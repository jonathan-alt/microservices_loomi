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
import { NotificationClientService } from "../notifications/notification-client.service";
import { AuditClientService } from "../audit/audit-client.service";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly messagingService: MessagingService,
    private readonly historyTransferService: HistoryTransferService,
    private readonly retryService: RetryService,
    private readonly auditClientService: AuditClientService,
    private readonly notificationClientService: NotificationClientService,
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

    // Chamadas para serviços abstratos
    await this.notifyTransferCompleted(
      createTransactionDto,
      transferHistory.id,
    );
    await this.auditTransferEvent(createTransactionDto, transferHistory.id);

    return this.findById(senderAccount.id);
  }

  // 1. Depósito em conta
  async deposit(
    id: number,
    depositDto: { amount: number; description?: string },
  ): Promise<any> {
    const { amount, description = "Depósito" } = depositDto;

    if (amount <= 0) {
      throw new BadRequestException(
        "Valor do depósito deve ser maior que zero",
      );
    }

    const account = await this.findById(id);
    const oldBalance = account.value;

    // Atualizar saldo
    const updatedAccount = await this.update(id, {
      value: account.value + amount,
    });

    // Criar histórico do depósito
    await this.historyTransferService.create({
      account_id: id,
      transfer_value: amount,
      target_id_account: id, // Mesma conta para depósito
      description: description,
      new_value: updatedAccount.value,
      old_value: oldBalance,
      type: "DEPOSIT",
      timestamp: new Date().toISOString(),
    });

    // Publicar evento de depósito com retry
    await this.retryService.executeMessagingOperation(async () => {
      await this.messagingService.publishTransferCreated({
        transferId: Date.now(),
        senderUserId: account.client_id,
        receiverUserId: account.client_id,
        amount: amount,
        description: description,
        status: "COMPLETED",
      });
    });

    return {
      success: true,
      message: "Depósito realizado com sucesso",
      data: {
        accountId: id,
        amount: amount,
        description: description,
        oldBalance: oldBalance,
        newBalance: updatedAccount.value,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 2. Consulta de saldo
  async getBalance(id: number): Promise<any> {
    const account = await this.findById(id);

    return {
      accountId: id,
      balance: account.value,
      currency: "BRL",
      lastUpdate: new Date().toISOString(),
      account: {
        id: account.id,
        agency: account.agency,
        accountNumber: account.account_number,
        clientId: account.client_id,
      },
    };
  }

  private async auditTransferEvent(
    createTransactionDto: CreateTransactionDto,
    transferId: number,
  ): Promise<void> {
    try {
      // Audit para remetente
      await this.auditClientService.logEvent({
        userId: createTransactionDto.senderUserId,
        action: "TRANSFER_SENT",
        resource: "transfer",
        resourceId: transferId.toString(),
        details: {
          amount: createTransactionDto.amount,
          receiverId: createTransactionDto.receiverUserId,
          description: createTransactionDto.description,
        },
      });

      // Audit para destinatário
      await this.auditClientService.logEvent({
        userId: createTransactionDto.receiverUserId,
        action: "TRANSFER_RECEIVED",
        resource: "transfer",
        resourceId: transferId.toString(),
        details: {
          amount: createTransactionDto.amount,
          senderId: createTransactionDto.senderUserId,
          description: createTransactionDto.description,
        },
      });
    } catch (error: any) {
      // Log do erro mas não falha a transferência
      console.error(
        "Failed to audit transfer event:",
        (error as Error).message,
      );
    }
  }
  // Métodos auxiliares para serviços abstratos
  private async notifyTransferCompleted(
    createTransactionDto: CreateTransactionDto,
    transferId: number,
  ): Promise<void> {
    try {
      // Notificar remetente
      await this.notificationClientService.createNotification({
        userId: createTransactionDto.senderUserId,
        type: "TRANSFER_SUCCESS",
        title: "Transferência realizada com sucesso",
        message: `Transferência de R$ ${createTransactionDto.amount} foi concluída`,
        data: {
          transferId,
          amount: createTransactionDto.amount,
          receiverId: createTransactionDto.receiverUserId,
        },
      });

      // Notificar destinatário
      await this.notificationClientService.createNotification({
        userId: createTransactionDto.receiverUserId,
        type: "TRANSFER_SUCCESS",
        title: "Transferência recebida",
        message: `Você recebeu R$ ${createTransactionDto.amount}`,
        data: {
          transferId,
          amount: createTransactionDto.amount,
          senderId: createTransactionDto.senderUserId,
        },
      });
    } catch (error: any) {
      // Log do erro mas não falha a transferência
      console.error("Failed to send notifications:", (error as Error).message);
    }
  }
}
