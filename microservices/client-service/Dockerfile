# Estágio de desenvolvimento
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"] 