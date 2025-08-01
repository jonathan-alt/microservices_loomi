import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ClientService } from "./client.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Client as AuthClient } from "../auth/types/auth.types";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("client")
@Controller("client")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(":id")
  @ApiOperation({ summary: "Obter detalhes do usuário" })
  @ApiResponse({
    status: 200,
    description: "Detalhes do usuário retornados com sucesso",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado a dados de outro usuário",
  })
  async getUserDetails(@Param("id") id: string, @Request() req: any) {
    const userId = parseInt(id);
    const authClient: AuthClient = req.user;
    return this.clientService.getUserDetails(userId, authClient);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar dados do usuário" })
  @ApiResponse({
    status: 200,
    description: "Dados do usuário atualizados com sucesso",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado a dados de outro usuário",
  })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const userId = parseInt(id);
    const authClient: AuthClient = req.user;
    return this.clientService.updateUser(userId, updateUserDto, authClient);
  }

  @Put(":id/profile-picture")
  @ApiOperation({ summary: "Atualizar foto de perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Foto de perfil atualizada com sucesso",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado a dados de outro usuário",
  })
  async updateProfilePicture(
    @Param("id") id: string,
    @Body() updateProfilePictureDto: { profilePicture: string },
    @Request() req: any,
  ) {
    const userId = parseInt(id);
    const authClient: AuthClient = req.user;
    return this.clientService.updateProfilePicture(
      userId,
      updateProfilePictureDto,
      authClient,
    );
  }

  @Get("search/cpf/:cpf")
  @ApiOperation({ summary: "Buscar usuário por CPF" })
  @ApiResponse({
    status: 200,
    description: "Usuário encontrado com sucesso",
  })
  @ApiResponse({
    status: 403,
    description: "CPF inválido",
  })
  @ApiResponse({
    status: 404,
    description: "Usuário não encontrado",
  })
  async searchByCpf(@Param("cpf") cpf: string, @Request() req: any) {
    const authClient: AuthClient = req.user;
    return this.clientService.searchByCpf(cpf, authClient);
  }
}
