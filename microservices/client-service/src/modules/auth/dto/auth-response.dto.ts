export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    picture: string;
    phone?: string;
  };
}
