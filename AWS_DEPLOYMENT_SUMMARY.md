Client-Service

ip : `3.19.75.214:3001`
api : `GET http://3.19.75.214:3001/api/`
swagger: http://3.19.75.214:3001/api/docs

Transfer-Service

ip: http://18.191.254.217:3000/
api: http://18.191.254.217:3000/api/v1
swagger: http://18.191.254.217:3000/api/docs

INFRAESTRUTURA AWS

ECS (Elastic Container Service)

- Cluster: `loomi-cluster-2`
- Region: `us-east-2`
- Services:
  - `client_service-service-t2cfcl0m`
  - `transfer_service-service-ivzskd6r`

RDS (PostgreSQL)

- Endpoint: `loomi-db.cnyckyic2z97.us-east-2.rds.amazonaws.com`
- Database: `microservices_platform`
- User: `postgres`

ElastiCache (Redis)

- Endpoint: `loomi-redis-cluster.in2zpd.0001.use2.cache.amazonaws.com`
- Port: `6379`

Amazon MQ (RabbitMQ)

- Broker: `loomi-rabbitmq-new`
- Endpoint: `b-5445344c-c8fe-4fe3-b9c8-147ab2adadcc.mq.us-east-2.on.aws`
- Port: `5671` (SSL)
- User: `microservice_user`
- Password: `microservice_pass123`

ECR (Elastic Container Registry)

- Client-Service: `564175165405.dkr.ecr.us-east-2.amazonaws.com/loomi-client-service:latest`
- Transfer-Service: `564175165405.dkr.ecr.us-east-2.amazonaws.com/loomi-transfer-service:latest`

SECURITY GROUPS

- ID: `sg-0bd13e1c8004c8541`
- Ports Abertos: 3000, 3001
- CIDR: `0.0.0.0/0`
