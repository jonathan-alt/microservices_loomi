export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  cpf: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  cpf: string;
  picture: string;
  phone?: string;
}

export interface RequestWithUser {
  user: Client;
  headers: {
    authorization?: string;
  };
}
