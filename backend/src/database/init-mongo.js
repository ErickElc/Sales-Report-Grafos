// Script executado automaticamente quando o MongoDB é iniciado pela primeira vez
// Este arquivo é executado pelo docker-entrypoint-initdb.d

print('🚀 Inicializando MongoDB...');

db = db.getSiblingDB('sales-report');

print('✅ Banco de dados sales-report criado');

// O seed será executado pelo script seed.ts após o container estar rodando

