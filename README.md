# Transfer Service

Microserviço para gerenciamento de transferências financeiras desenvolvido com NestJS.

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

## Testes

### Testes Unitários

```bash
npm run test
```

### Testes E2E

```bash
npm run test:e2e
```

### Cobertura de Testes

```bash
npm run test:cov
```

```env
# Aplicação
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=transfer_service
```

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações escaláveis
- **TypeScript**: Linguagem de programação tipada
- **Jest**: Framework de testes
- **Supertest**: Biblioteca para testes de API
- **Class Validator**: Validação de dados
- **Config**: Gerenciamento de configurações

## Arquitetura

Este microserviço segue os princípios de:

- **Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica
- **Injeção de Dependência**: Uso do sistema de DI do NestJS
- **Modularidade**: Organização em módulos independentes
- **Testabilidade**: Estrutura preparada para testes unitários e E2E
- **Configurabilidade**: Configurações centralizadas e flexíveis
