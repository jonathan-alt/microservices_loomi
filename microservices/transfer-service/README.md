# Transfer Service

Microserviço para gerenciamento de transferências financeiras desenvolvido com NestJS.

### Eventos Publicados

- `transfer.created` - Transferência criada
- `transfer.completed` - Transferência completada
- `transfer.failed` - Transferência falhou
- `account.balance.updated` - Saldo atualizado

### Eventos Escutados

- `client.created` - Cliente criado
- `client.updated` - Cliente atualizado
- `client.deleted` - Cliente deletado
