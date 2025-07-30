import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../auth/types/auth.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";

@Controller("api")
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // 1. Detalhes do cliente
  @Get("users/:userId")
  async getUserDetails(
    @Param("userId", ParseIntPipe) userId: number,
    @CurrentUser() user: User,
  ) {
    return this.clientService.getUserDetails(userId, user);
  }

  // 2. Atualização parcial de dados do cliente
  @Patch("users/:userId")
  async updateUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.clientService.updateUser(userId, updateUserDto, user);
  }

  // 3. Atualização da foto de perfil
  @Patch("users/:userId/profile-picture")
  async updateProfilePicture(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
    @CurrentUser() user: User,
  ) {
    return this.clientService.updateProfilePicture(
      userId,
      updateProfilePictureDto,
      user,
    );
  }

  // 4. Busca de cliente por CPF
  @Get("users/search")
  async searchByCpf(@Query("cpf") cpf: string, @CurrentUser() user: User) {
    return this.clientService.searchByCpf(cpf, user);
  }
}
