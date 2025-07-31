# 🏦 Plataforma de Microserviços - Loomi

Uma plataforma bancária moderna construída com microserviços, oferecendo transferências, gestão de clientes e notificações em tempo real.

## 🎯 Visão Geral

Esta plataforma demonstra uma arquitetura de microserviços completa com:

- **Transferências bancárias** em tempo real
- **Gestão de clientes** com autenticação JWT
- **Notificações** automáticas
- **Auditoria** completa de operações
- **Documentação interativa** com Swagger
- **Microsserviços abstratos** para simulação de integrações

## 🏗️ Arquitetura

```
microservices_loomi/
├── microservices/
│   ├── transfer-service/     # 🏦 Microserviço de Transferências
│   │   ├── accounts/        # Gestão de contas bancárias
│   │   ├── transfers/       # Processamento de transferências
│   │   ├── history/         # Histórico de operações
│   │   ├── notifications/   # Serviços abstratos
│   │   ├── audit/          # Auditoria abstrata
│   │   └── analytics/      # Métricas abstratas
│   └── client-service/      # 👤 Microserviço de Clientes
│       ├── auth/           # Autenticação JWT
│       ├── users/          # Gestão de usuários
│       ├── redis/          # Cache e sessões
│       └── messaging/      # Comunicação RabbitMQ
├── shared/                  # 📦 Código compartilhado
│   ├── events/             # Eventos de domínio
│   ├── config/             # Configurações
│   └── common/             # Utilitários
└── docker-compose.yml      # 🐳 Orquestração
```

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

## 🛠️ Tecnologias Utilizadas

### **Backend**

- **NestJS** - Framework Node.js para microserviços
- **TypeScript** - Linguagem principal
- **TypeORM** - ORM para PostgreSQL
- **Passport.js** - Autenticação JWT
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs

### **Banco de Dados**

- **PostgreSQL** - Banco relacional principal
- **Redis** - Cache e sessões
- **TypeORM** - ORM e migrations

### **Mensageria**

- **RabbitMQ** - Comunicação entre serviços
- **amqplib** - Cliente RabbitMQ

### **Documentação**

- **Swagger/OpenAPI** - Documentação interativa
- **@nestjs/swagger** - Decorators para NestJS

### **Testes**

- **Jest** - Framework de testes
- **Supertest** - Testes de integração
- **@nestjs/testing** - Utilitários de teste

### **DevOps**

- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **ESLint** - Linting
- **Prettier** - Formatação

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+
- Git

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd microservices_loomi
```

### 2. Configurar Variáveis de Ambiente

```bash
cp env.example .env
# Edite o arquivo .env conforme necessário
```

### 3. Executar a Plataforma

```bash
# Executar todos os serviços
docker-compose up -d

# Ou executar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up
```

### 4. Acessar os Serviços

| Serviço                 | URL                            | Descrição             |
| ----------------------- | ------------------------------ | --------------------- |
| **Transfer Service**    | http://localhost:3001          | API de transferências |
| **Client Service**      | http://localhost:3000          | API de clientes       |
| **Transfer Swagger**    | http://localhost:3001/api/docs | Documentação Transfer |
| **Client Swagger**      | http://localhost:3000/api/docs | Documentação Client   |
| **RabbitMQ Management** | http://localhost:15672         | Gestão de filas       |
| **PostgreSQL**          | localhost:5432                 | Banco de dados        |
| **Redis**               | localhost:6379                 | Cache e sessões       |

## 📋 Serviços

### 🏦 Transfer Service

- **Porta**: 3001
- **Responsabilidade**: Gestão de transferências e contas bancárias
- **Funcionalidades**:
  - Criar e gerenciar contas
  - Realizar transferências entre contas
  - Consultar saldos
  - Histórico de operações
  - Depósitos em conta
  - Microsserviços abstratos (notifications, audit, analytics)

### 👤 Client Service

- **Porta**: 3000
- **Responsabilidade**: Gestão de clientes e autenticação
- **Funcionalidades**:
  - Registro e login de usuários
  - Autenticação JWT
  - Gestão de perfis
  - Cache com Redis
  - Blacklist de tokens
  - Rate limiting

### 🔄 Comunicação Entre Serviços

A comunicação entre microserviços é feita através de:

#### **Eventos RabbitMQ**

- `transfer.created` - Transferência criada
- `transfer.completed` - Transferência concluída
- `transfer.failed` - Transferência falhou
- `account.balance.updated` - Saldo atualizado
- `user.registered` - Usuário registrado
- `user.updated` - Usuário atualizado
- `user.logged_in` - Usuário logado
- `user.logged_out` - Usuário deslogado

#### **Microsserviços Abstratos**

- **Notification Service** - Simulação de notificações
- **Audit Service** - Simulação de auditoria
- **Analytics Service** - Simulação de métricas

## 📚 API Endpoints

### 🏦 Transfer Service

#### **Contas**

- `POST /api/accounts` - Criar conta
- `GET /api/accounts` - Listar contas
- `GET /api/accounts/:id` - Buscar conta
- `PATCH /api/accounts/:id` - Atualizar conta
- `DELETE /api/accounts/:id` - Deletar conta
- `GET /api/accounts/client/:clientId` - Buscar conta por cliente

#### **Transferências**

- `POST /api/accounts/transfer` - Realizar transferência
- `POST /api/accounts/:id/deposit` - Realizar depósito
- `GET /api/accounts/:id/balance` - Consultar saldo

#### **Histórico**

- `GET /api/history` - Listar histórico
- `GET /api/history/:id` - Buscar histórico
- `POST /api/history` - Criar histórico

### 👤 Client Service

#### **Autenticação**

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/me` - Perfil do usuário

#### **Usuários**

- `GET /api/users/:userId` - Detalhes do usuário
- `PATCH /api/users/:userId` - Atualizar usuário
- `PATCH /api/users/:userId/profile-picture` - Atualizar foto
- `GET /api/users/search?cpf={cpf}` - Buscar por CPF

## 🔄 Comunicação Entre Serviços

A comunicação entre microserviços é feita através de eventos via RabbitMQ:

## 🛠️ Desenvolvimento

### **Estrutura de Desenvolvimento**

#### **Adicionar Novo Microserviço**

1. Criar pasta em `microservices/nome-do-servico/`
2. Configurar Dockerfile
3. Adicionar ao `docker-compose.yml`
4. Implementar eventos necessários
5. Adicionar documentação Swagger

#### **Compartilhar Código**

- **Eventos**: `shared/events/`
- **Configurações**: `shared/config/`
- **DTOs**: `shared/dto/`
- **Utilitários**: `shared/common/`

### **Testes**

```bash
# Transfer Service
cd microservices/transfer-service
npm test

# Client Service
cd microservices/client-service
npm test
```

### **Linting e Formatação**

```bash
# Transfer Service
cd microservices/transfer-service
npm run lint
npm run format

# Client Service
cd microservices/client-service
npm run lint
npm run format
```

### **Build**

```bash
# Transfer Service
cd microservices/transfer-service
npm run build

# Client Service
cd microservices/client-service
npm run build
```

## 📊 Monitoramento

### **Ferramentas de Monitoramento**

| Ferramenta              | URL                    | Credenciais                          |
| ----------------------- | ---------------------- | ------------------------------------ |
| **RabbitMQ Management** | http://localhost:15672 | guest/guest                          |
| **PostgreSQL**          | localhost:5432         | platform_user/microservices_platform |
| **Redis**               | localhost:6379         | -                                    |

### **Logs e Debugging**

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f transfer-service
docker-compose logs -f client-service

# Ver logs do banco de dados
docker-compose logs -f postgres
docker-compose logs -f redis
```

## 🔧 Comandos Úteis

### **Docker**

```bash
# Executar todos os serviços
docker-compose up -d

# Executar apenas um serviço
docker-compose up transfer-service
docker-compose up client-service

# Parar todos os serviços
docker-compose down

# Reconstruir imagens
docker-compose build --no-cache

# Ver status dos containers
docker-compose ps
```

### **Desenvolvimento**

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Executar linting
npm run lint

# Build do projeto
npm run build
```

### **Banco de Dados**

```bash
# Acessar PostgreSQL
docker-compose exec postgres psql -U platform_user -d microservices_platform

# Acessar Redis
docker-compose exec redis redis-cli
```

## 🚀 Deploy

### **Produção**

```bash
# Usar docker-compose.yml para produção
docker-compose -f docker-compose.yml up -d
```

### **Desenvolvimento**

```bash
# Usar docker-compose.dev.yml para desenvolvimento
docker-compose -f docker-compose.dev.yml up
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
