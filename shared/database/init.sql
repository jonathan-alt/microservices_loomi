-- Criação das tabelas para o microserviço de transferência

-- Criar usuário se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'platform_user') THEN
        CREATE USER platform_user WITH PASSWORD 'platform_password';
    END IF;
END
$$;

-- Conceder privilégios ao usuário
GRANT ALL PRIVILEGES ON DATABASE microservices_platform TO platform_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO platform_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO platform_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO platform_user;

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    picture TEXT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    agency VARCHAR(10),
    account_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contas
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    history_id INTEGER NOT NULL DEFAULT 1,
    agency VARCHAR(10) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id),
    UNIQUE(agency, account_number)
);

-- Tabela de histórico de transferências
CREATE TABLE IF NOT EXISTS history_transfer (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    transfer_value DECIMAL(15,2) NOT NULL,
    target_id_account INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    new_value DECIMAL(15,2) NOT NULL,
    old_value DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER-SENT', 'TRANSFER-RECEIVED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(token_hash)
);
-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clients_cpf ON clients(cpf);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_accounts_client_id ON accounts(client_id);
CREATE INDEX IF NOT EXISTS idx_history_transfer_account_id ON history_transfer(account_id);
CREATE INDEX IF NOT EXISTS idx_history_transfer_timestamp ON history_transfer(timestamp);
CREATE INDEX IF NOT EXISTS idx_history_transfer_type ON history_transfer(type);
CREATE INDEX IF NOT EXISTS idx_user_sessions_client_id ON user_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

    
-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_history_transfer_updated_at BEFORE UPDATE ON history_transfer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dados de exemplo (opcional)
INSERT INTO clients (name, cpf, picture, email, phone, password) VALUES
    ('João Silva', '123.456.789-00', 'https://example.com/joao.jpg', 'joao@email.com', '(11) 99999-9999', '$2b$10$hashedpassword'),
    ('Maria Santos', '987.654.321-00', 'https://example.com/maria.jpg', 'maria@email.com', '(11) 88888-8888', '$2b$10$hashedpassword')
ON CONFLICT (cpf) DO NOTHING;

INSERT INTO accounts (client_id, value, history_id, agency, account_number) VALUES
    (1, 1000.00, 1, '0001', '123456-7'),
    (2, 500.00, 2, '0001', '765432-1')
ON CONFLICT DO NOTHING;

INSERT INTO history_transfer (account_id, transfer_value, target_id_account, description, new_value, old_value, type) VALUES
    (1, 100.00, 2, 'Transferência inicial', 900.00, 1000.00, 'TRANSFER-SENT'),
    (2, 100.00, 1, 'Recebimento de transferência', 600.00, 500.00, 'TRANSFER-RECEIVED')
ON CONFLICT DO NOTHING; 