# Plataforma de Microserviços

Esta é uma plataforma de microserviços construída com NestJS, PostgreSQL e RabbitMQ.

## 🏗️ Arquitetura

```
microservices-platform/
├── microservices/
│   ├── transfer-service/     # Microserviço de Transferências
│   ├── client-service/       # Microserviço de Clientes (futuro)
│   └── notification-service/ # Microserviço de Notificações (futuro)
├── shared/                   # Código compartilhado
│   ├── events/              # Eventos de domínio
│   └── config/              # Configurações compartilhadas
└── docker-compose.yml       # Orquestração dos serviços
```

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+

### 1. Configurar Variáveis de Ambiente

```bash
cp env.example .env
# Edite o arquivo .env conforme necessário
```

### 2. Executar a Plataforma

```bash
docker-compose -f docker-compose.dev.yml up
```

### 3. Acessar os Serviços

- **Transfer Service**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672
- **PostgreSQL**: localhost:5432

## 📋 Serviços

### Transfer Service

- **Porta**: 3000
- **Responsabilidade**: Gestão de transferências e contas

### Client Service (Futuro)

- **Porta**: 3001
- **Responsabilidade**: Gestão de clientes e perfis

### Notification Service (Futuro)

- **Porta**: 3002
- **Responsabilidade**: Envio de notificações

## 🔄 Comunicação Entre Serviços

A comunicação entre microserviços é feita através de eventos via RabbitMQ:

## 🛠️ Desenvolvimento

### Adicionar Novo Microserviço

1. Criar pasta em `microservices/nome-do-servico/`
2. Configurar Dockerfile
3. Adicionar ao `docker-compose.yml`
4. Implementar eventos necessários

### Compartilhar Código

- Eventos: `shared/events/`
- Configurações: `shared/config/`
- DTOs: `shared/dto/`

## 📊 Monitoramento

- **RabbitMQ Management**: http://localhost:15672
  - Usuário: guest
  - Senha: guest

## 🔧 Comandos Úteis

```bash
# Executar apenas um serviço
docker-compose up transfer-service

# Ver logs
docker-compose logs -f transfer-service

# Parar todos os serviços
docker-compose down

# Reconstruir imagens
docker-compose build --no-cache
```
