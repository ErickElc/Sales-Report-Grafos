#!/bin/bash

echo "🚀 Iniciando Sales Report..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Iniciar containers
echo "📦 Iniciando containers Docker..."
docker-compose up -d

# Aguardar MongoDB estar pronto
echo "⏳ Aguardando MongoDB estar pronto..."
sleep 5

# Instalar dependências do backend
echo "📥 Instalando dependências do backend..."
cd backend
npm install

# Executar seed
echo "🌱 Executando seed do banco de dados..."
npm run seed

echo "✅ Setup concluído!"
echo "🌐 API disponível em: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/health"

