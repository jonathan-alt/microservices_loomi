# Client Service

Microserviço para gerenciamento de clientes desenvolvido com NestJS.

## Instalação

```bash
npm install
```

## Executando a aplicação

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testes

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

```bash
# Build da imagem
docker build -t client-service .

# Executar container
docker run -p 3001:3001 client-service
``` 