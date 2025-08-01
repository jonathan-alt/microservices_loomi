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

Prompts:

Ferramentas - (cursor - claude)

Contexto:
Logo no início, eu tinha apenas criado o projeto a estrutura e modelado o banco

prompt:
Dada a modelagem do banco abaixo, preencha as entities e o repository

Tabelas:

client
name - str (not null)
cpf - str (not null)
id - int (not null)
picture - image (not null)
email - str
phone - str
password - str
account
Id - int (not null)
client_id - int (not null)
value - int (not null)
history_id - int (not null)
history_transfer
Id - int (not null)
account_id - int (not null)
transfer_value - int (not null)
target_id_account - int (not null)
timestamp - timestamp (not null)
description - str
new_value - int (not null)
old_value - int (not null)
type - str (not null)

    resultado:

(funcionou adequadamente)
Basico
Contexto:
Após criar e organizar a estrutura docker

prompt:
Preciso de um arquivo init para inicializar as tabelas no banco quando eu subir o container do postgresql, se baseie na estrutura de dados fornecida anteriormente e presente nos arquivos que passei como parâmetro

    resultado:

(funcionou adequadamente)

Contexto:
Após tanto container de serviço como do banco funcionando

prompt:
Crie um crud genérico para history_transfer e account, se a tenha a ser simples, quero um get, um post, um patch e um delete.

    resultado:

    Ele criou o crud mas para um banco mock, optei por criar uma nova branch para alterar o crud para usar typeorm e se conectar ao container postgresql

Contexto:
Por ter menos familiaridade com micro serviço, fiz inicialmente um crud genérico, apenas preocupado com escalabilidade e boas práticas, para então fazer alterações para microserviço

prompt:
Me dê um arquivo genérico de rabbitmq
(chat gpt)

    resultado:

    export const rabbitMQConfig = {

host: process.env.RABBITMQ_HOST || "localhost",
port: parseInt(process.env.RABBITMQ_PORT || "5672"),
username: process.env.RABBITMQ_USERNAME || "guest",
password: process.env.RABBITMQ_PASSWORD || "guest",
vhost: process.env.RABBITMQ_VHOST || "/",
};

export const rabbitMQExchanges = {
transfer: "transfer.exchange",
client: "client.exchange",
};

export const rabbitMQQueues = {
transferEvents: "transfer.events",
clientEvents: "client.events",
transferNotifications: "transfer.notifications",
};

export const rabbitMQRoutingKeys = {
// Eventos publicados pelo Transfer Service
transferCreated: "transfer.created",
transferCompleted: "transfer.completed",
transferFailed: "transfer.failed",
accountBalanceUpdated: "account.balance.updated",

// Eventos escutados pelo Transfer Service
clientCreated: "client.created",
clientUpdated: "client.updated",
};

Contexto:
Depois de criar os eventos e as mensagens

prompt:
Atualize as referências e importações

    resultado:

    Funcionou corretamente

Contexto:
Estava com o escopo inicial do primeiro primeiro serviço ok, deveria partir para escopo inicial dos outros ou a lógica de negócio desse primeiro, mas pensando para o futuro fui saber se estava organizando tudo da melhor maneira

prompt:
quais arquitetura organizacional (estrutura de repositórios) para um microserviço e as vantagens de cada um deles

    resultado:

    1. Monorepo (Monolithic Repository)

📁 Estrutura:

/repositorio-principal
/auth-service
/user-service
/transaction-service
/libs-comuns
package.json (raiz, opcional)
docker-compose.yml

✅ Vantagens:
Facilidade de versionamento conjunto: tudo pode ser versionado de forma coordenada.

Melhor reutilização de código: bibliotecas e módulos comuns podem ser compartilhados com facilidade.

Facilidade de navegação e refatoração: muda um contrato entre serviços? É só ajustar tudo no mesmo lugar.

CI/CD unificado: pipelines centralizados e mais fáceis de gerenciar no início.

❌ Desvantagens:
Escalabilidade limitada em times grandes.

Build e testes podem ser mais lentos com o tempo.

Pode dificultar controle de acesso mais granular por serviço.

Tendência a “acoplamento organizacional” (times precisam de coordenação constante).

2. Multirepo (Multiple Repositories)
   📁 Estrutura:
   /repositorio-auth
   /repositorio-user
   /repositorio-transaction
   /repositorio-libs-comuns (opcional ou como submódulo)

✅ Vantagens:
Independência total de times: cada time cuida do seu serviço com autonomia.

Pipelines mais rápidos: builds e testes mais curtos e específicos.

Controle de acesso por repositório: segurança mais granular.

Mais alinhado com filosofia de microsserviços (serviços isolados).

❌ Desvantagens:
Mais difícil de manter consistência (ex: versões de bibliotecas compartilhadas).

Refatorações em múltiplos serviços são mais trabalhosas.

CI/CD descentralizado exige mais cuidado.

Gerenciamento de múltiplos repositórios é mais complexo.

3. Hybrid Repo (Monorepo com Serviços Clonáveis/Plugáveis)
   📁 Estrutura:
   Parecido com monorepo, mas cada serviço pode ser desacoplado como pacote independente, ou rodado isoladamente.
   bash
   CopiarEditar
   /repositorio-principal
   /servicos
   /auth
   /user
   /transaction
   /libs

Cada serviço pode:
Ser buildado sozinho

Ter Docker próprio

Ser publicado como pacote

✅ Vantagens:
Combina os benefícios de monorepo com certa modularidade.

Facilita evolução gradual: começa monorepo, migra para multirepo se necessário.

Refatoração conjunta ainda possível.

❌ Desvantagens:
Requer uma boa disciplina para manter os serviços realmente isolados.

Complexidade técnica maior para CI/CD condicional.

Contexto:
Depois de escolher adaptar para monoporepo

prompt:
Preciso adaptar a organização atual para monorepo, poderia me dizer quais boas práticas para essa organização

resultado:

(funcionou adequadamente)

Contexto:
Depois de praticamente finalizar o mínimo do serviço de transferências

prompt:
Da mesma maneira que fiz transfer_service, crie o client_service, seguindo o mesmo padrão

resultado:

(funcionou adequadamente)

Contexto:
Para criar um mecanismo de autenticação

prompt:
Crie toda estrutura para usar JWT em conjunto com bycrpt em um mecanismo de autenticação. O token gerado deve ser armazenado em uma tabela a parte que terá os seguintes campos

Id - int (not null)
Client_id - int
Token_hash - str
expires_at - timestamp
is_revoked - boolean
created_at - timestamp
update_at timestamp

resultado:

(funcionou adequadamente)

Contexto:
Depois de instalar as dependências do redis

prompt:
Use o banco redis recém adicionado para criar um blacklist de tokens expirados, seja por tempo ou por logout, e para manter dados de client que serão usados constantemente

resultado:

(funcionou adequadamente)

Contexto:
Últimos testes escritos

prompt:
Baseado nos testes já existente escreva os testes para os endpoints de client_service

    resultado:

(funcionou adequadamente)

Contexto:
Ao criar cenários abstratos

prompt:
Baseado no cenário de auditação que estou passando como parâmetro, crie um de notificação que irá notificar o usuário por meio de suposto email e sms
resultado:

(funcionou adequadamente)

Contexto:
Depois de acabar quase tudo

prompt:
Atualize os readmes com arquitetura, tecnologias e instruções

resultado:
(funcionou adequadamente)
