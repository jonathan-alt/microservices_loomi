// Eventos externos que o Transfer Service escuta (vindos de outros microserviços)
export class ClientCreatedEvent {
  constructor(
    public readonly clientId: number,
    public readonly name: string,
    public readonly cpf: string,
    public readonly email: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class ClientUpdatedEvent {
  constructor(
    public readonly clientId: number,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
