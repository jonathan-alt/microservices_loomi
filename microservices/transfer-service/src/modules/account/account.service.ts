import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { AccountRepository } from "./repositories/account.repository";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Account } from "./entities/account.entity";
import { MessagingService } from "../messaging/messaging.service";
import { HistoryTransferService } from "../history_transfer/history_transfer.service";
import { RetryService } from "../../common/services/retry.service";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly messagingService: MessagingService,
    private readonly historyTransferService: HistoryTransferService,
    private readonly retryService: RetryService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    // Verificar se já existe uma conta para este cliente
    const existingAccount = await this.findByClientId(
      createAccountDto.client_id,
    );
    if (existingAccount) {
      throw new BadRequestException(
        `Já existe uma conta para o cliente ${createAccountDto.client_id}`,
      );
    }

    return this.accountRepository.create(createAccountDto);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }

  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return account;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const oldAccount = await this.accountRepository.findById(id);
    if (!oldAccount) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }

    const account = await this.accountRepository.update(id, updateAccountDto);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }

    // Publicar evento de atualização de saldo com retry
    if (account.id && account.client_id) {
      await this.retryService.executeMessagingOperation(async () => {
        await this.messagingService.publishAccountBalanceUpdated({
          accountId: account.id,
          clientId: account.client_id,
          oldBalance: oldAccount.value,
          newBalance: account.value,
          difference: account.value - oldAccount.value,
          type: "TRANSFER",
        });
      });
    }

    return account;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.accountRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
  }

  async findByClientId(clientId: number): Promise<Account | null> {
    return this.accountRepository.findByClientId(clientId);
  }

  async transfer(createTransactionDto: CreateTransactionDto): Promise<Account> {
    if (
      createTransactionDto.senderUserId === createTransactionDto.receiverUserId
    ) {
      throw new BadRequestException(
        "Usuário remetente e destinatário não podem ser iguais",
      );
    }

    if (createTransactionDto.amount <= 0) {
      throw new BadRequestException(
        "Valor da transação deve ser maior que zero",
      );
    }

    const senderAccount = await this.findByClientId(
      createTransactionDto.senderUserId,
    );
    const receiverAccount = await this.findByClientId(
      createTransactionDto.receiverUserId,
    );

    if (!senderAccount) {
      throw new NotFoundException(
        `Conta não encontrada para o usuário ${createTransactionDto.senderUserId}`,
      );
    }

    if (!receiverAccount) {
      throw new NotFoundException(
        `Conta não encontrada para o usuário ${createTransactionDto.receiverUserId}`,
      );
    }

    if (senderAccount.value < createTransactionDto.amount) {
      throw new BadRequestException(
        "Saldo insuficiente para realizar a transferência",
      );
    }

    await this.update(senderAccount.id, {
      value: senderAccount.value - createTransactionDto.amount,
    });

    await this.update(receiverAccount.id, {
      value: receiverAccount.value + createTransactionDto.amount,
    });

    // Criar histórico da transferência
    const transferHistory = await this.historyTransferService.create({
      account_id: senderAccount.id,
      transfer_value: createTransactionDto.amount,
      target_id_account: receiverAccount.id,
      description:
        createTransactionDto.description || "Transferência entre usuários",
      new_value: senderAccount.value - createTransactionDto.amount,
      old_value: senderAccount.value,
      type: "TRANSFER-SENT",
      timestamp: new Date().toISOString(),
    });

    // Publicar eventos de transferência com retry
    await this.retryService.executeMessagingOperation(async () => {
      await this.messagingService.publishTransferCreated({
        transferId: transferHistory.id,
        senderUserId: createTransactionDto.senderUserId,
        receiverUserId: createTransactionDto.receiverUserId,
        amount: createTransactionDto.amount,
        description: createTransactionDto.description,
        status: "PENDING",
      });
    });

    await this.retryService.executeMessagingOperation(async () => {
      await this.messagingService.publishTransferCompleted({
        transferId: transferHistory.id,
        senderUserId: createTransactionDto.senderUserId,
        receiverUserId: createTransactionDto.receiverUserId,
        amount: createTransactionDto.amount,
        description: createTransactionDto.description,
        status: "COMPLETED",
      });
    });

    return this.findById(senderAccount.id);
  }
}
