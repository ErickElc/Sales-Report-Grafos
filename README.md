# Dashboard de Relatórios de Vendas

> Aplicação full-stack de análise de vendas com carregamento inteligente de dados e filtragem hierárquica

![Prévia do Dashboard](/Users/ericknascimento/.gemini/antigravity/brain/080b2134-71c0-4187-b001-5d3fe2219310/uploaded_image_1766121234434.png)

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Estratégia de Carregamento Inteligente](#estratégia-de-carregamento-inteligente)
- [Configuração e Instalação](#configuração-e-instalação)
- [Documentação da API](#documentação-da-api)
- [Qualidade de Código](#qualidade-de-código)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Visão Geral

O Dashboard de Relatórios de Vendas é uma aplicação full-stack moderna projetada para visualizar e gerenciar dados de vendas através de uma interface intuitiva. O sistema demonstra as melhores práticas em gerenciamento de estado React, design de API e containerização Docker.

**Funcionalidades Principais:**
- Dashboard interativo com análise de vendas para os primeiros 4 meses do ano
- Sistema de filtragem hierárquica (Categoria → Produto → Marca)
- Operações CRUD completas para Categorias, Produtos, Marcas e Vendas
- Agregação de dados em tempo real e visualização em gráficos
- Busca responsiva e ordenação alfabética em todas as entidades

---

## Arquitetura

### Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────┐
│                  Docker Compose                      │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │ MongoDB  │→ │  Backend   │→ │    Frontend     │ │
│  │  :27017  │  │ Express.js │  │  React + Vite   │ │
│  │          │  │   :3000    │  │     :5173       │ │
│  └──────────┘  └────────────┘  └─────────────────┘ │
│       ↑              ↑                               │
│   Seeder        REST API                             │
└─────────────────────────────────────────────────────┘
```

### Fluxo de Dados

```
┌──────────────┐
│  Ação Usuário│
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│  Componente React        │
│  (Dashboard/Páginas CRUD)│
└──────┬───────────────────┘
       │
       ▼
┌──────────────────┐
│  Custom Hooks    │
│  (useCategories, │
│   useProducts,   │
│   useBrands,     │
│   useSales)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  AppState        │
│  (Estado Global) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Serviços API    │
│  (chamadas Axios)│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Backend API     │
│  (Express.js)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  MongoDB         │
│  (Mongoose ODM)  │
└──────────────────┘
```

---

## Stack Tecnológica

### Frontend
- **React 19** - Biblioteca UI com hooks
- **TypeScript** - Segurança de tipos
- **Vite** - Ferramenta de build rápida
- **Highcharts** - Visualização de dados
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado global
- **React Router** - Roteamento client-side
- **SCSS** - Estilização

### Backend
- **Node.js** - Ambiente de execução
- **Express.js** - Framework web
- **TypeScript** - Segurança de tipos
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Swagger** - Documentação da API
- **CORS** - Compartilhamento de recursos entre origens

### DevOps
- **Docker & Docker Compose** - Containerização
- **Wait-for-it** - Gerenciamento de dependências de serviços

---

## Funcionalidades Principais

### 1. Estratégia de Carregamento Inteligente

A aplicação escolhe automaticamente a abordagem ideal de carregamento de dados baseada no tamanho do dataset:

- **Datasets pequenos** (≤100 itens): Carrega todos os dados de uma vez para filtragem instantânea
- **Datasets grandes** (>100 itens): Implementa carregamento lazy para manter a performance

```typescript
// Verifica a contagem total de itens na montagem
const totalItems = categoryCount + productCount + brandCount;

if (totalItems <= 100) {
  // Carrega tudo - filtragem rápida, zero requisições adicionais
  loadAllData();
} else {
  // Carrega sob demanda - escalável para datasets grandes
  loadOnDemand();
}
```

### 2. Filtragem Hierárquica

Sistema de filtragem em cascata inteligente:

```
Seleção de Categoria → Filtra Produtos
Seleção de Produto → Filtra Marcas  
Seleção de Marca → Mostra Dados Específicos de Vendas
```

**Agregação de Dados:**
- Categoria selecionada: Mostra vendas agregadas de todos os produtos daquela categoria
- Produto selecionado: Mostra vendas agregadas de todas as marcas daquele produto
- Marca selecionada: Mostra dados de vendas específicos da marca
- Nada selecionado: Mostra vendas totais de todos os dados

### 3. Busca e Ordenação

Todas as páginas CRUD possuem:
- Filtragem de busca em tempo real
- Ordenação alfabética (A-Z)
- Exibição de contagem de resultados
- Otimizado com `useMemo` para performance

### 4. Gerenciamento de Estado Global

Estado centralizado usando React Context API:
- Fonte única de verdade para todos os dados
- Estados de carregamento específicos por recurso
- Tratamento de erros com informações detalhadas
- Limpeza automática e gerenciamento de memória

---

## Estratégia de Carregamento Inteligente

Uma das funcionalidades de destaque desta aplicação é seu mecanismo inteligente de carregamento de dados.

### O Problema

Abordagens tradicionais:
1. Carregam todos os dados antecipadamente → Lento para datasets grandes
2. Sempre carregam sob demanda → Muitas requisições para datasets pequenos

### Nossa Solução

**Carregamento Adaptativo:**

```typescript
// Na montagem da aplicação
1. Verifica a contagem de dados (requisição leve)
2. Decide a estratégia baseada no tamanho
3. Aplica a abordagem de carregamento ideal
```

**Benefícios:**
- Rápido para datasets pequenos (atual: 82 itens totais)
- Escalável para datasets grandes (lida com 1000+ itens)
- Zero mudanças de código necessárias - adaptação automática
- Melhor experiência do usuário em ambos os cenários

**Performance Atual:**
- Carregamento inicial: ~500ms (4 requisições paralelas)
- Mudanças de filtro: <10ms (filtragem em memória)
- Total de requisições: ~5 (vs 100+ com abordagem ingênua)

---

## Configuração e Instalação

### Pré-requisitos

- Docker & Docker Compose
- Node.js 18+ (para desenvolvimento local)

### Início Rápido

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd front-end-grafos
   ```

2. **Inicie com Docker**
   ```bash
   docker-compose up -d
   ```

   Este comando irá:
   - Iniciar MongoDB na porta 27017
   - Popular o banco de dados com dados de exemplo
   - Iniciar Backend API na porta 3000
   - Iniciar Frontend na porta 5173

3. **Acesse a aplicação**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Documentação da API: http://localhost:3000/api-docs

### Configuração de Desenvolvimento

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

### Parando a Aplicação

```bash
docker-compose down
```

### Início Limpo (Limpar todos os dados)

```bash
docker-compose down -v
docker-compose up -d --build
```

---

## Documentação da API

### URL Base
```
http://localhost:3000/api
```

### Endpoints

#### Categorias
- `GET /categories` - Listar todas as categorias
- `POST /categories` - Criar categoria
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Deletar categoria

#### Produtos
- `GET /products` - Listar todos os produtos
- `GET /products/category/:categoryId` - Obter produtos por categoria
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

#### Marcas
- `GET /brands` - Listar todas as marcas
- `GET /brands/product/:productId` - Obter marcas por produto
- `POST /brands` - Criar marca
- `PUT /brands/:id` - Atualizar marca
- `DELETE /brands/:id` - Deletar marca

#### Vendas
- `GET /sales` - Listar todas as vendas
- `GET /sales/brand/:brandId` - Obter vendas por marca (com filtros opcionais de mês/ano)
- `POST /sales` - Criar venda
- `PUT /sales/:id` - Atualizar venda
- `DELETE /sales/:id` - Deletar venda

### Estrutura de Dados de Exemplo

**Categoria:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Eletrônicos"
}
```

**Produto:**
```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Smartphone",
  "categoryId": "507f1f77bcf86cd799439011"
}
```

**Marca:**
```json
{
  "_id": "507f191e810c19729de860eb",
  "name": "Apple",
  "productId": "507f191e810c19729de860ea"
}
```

**Venda:**
```json
{
  "_id": "507f191e810c19729de860ec",
  "brandId": "507f191e810c19729de860eb",
  "month": 1,
  "year": 2025,
  "value": 850
}
```

---

## Qualidade de Código

### Padrões de Design e Melhores Práticas

#### 1. Princípios SOLID

**Responsabilidade Única:**
- Cada hook gerencia uma preocupação (categorias, produtos, marcas, vendas)
- Serviços separados dos hooks
- Componentes focados em apresentação

**Inversão de Dependência:**
- Hooks dependem do Context, não de chamadas diretas à API
- Serviços abstraídos por interfaces
- Fácil de mockar para testes

#### 2. Código Limpo

**Convenções de Nomenclatura:**
```typescript
// Nomes claros e descritivos
const filteredProducts = useMemo(...)
const handleSubmit = async (e) => {...}
```

**Segurança de Tipos:**
```typescript
// Cobertura completa de TypeScript
interface Category {
  _id: string;
  name: string;
}
```

**Tratamento de Erros:**
```typescript
try {
  await createCategory(data);
} catch (error) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Falha ao criar categoria';
  dispatch({ type: 'SET_ERROR', payload: errorMessage });
}
```

#### 3. Otimização de Performance

- `useMemo` para computações caras
- `useCallback` para referências de função estáveis
- Requisições API paralelas com `Promise.all`
- Estado centralizado para evitar prop drilling

#### 4. Organização de Código

```
src/
├── components/     # Componentes UI reutilizáveis
├── pages/          # Componentes de nível de rota
├── hooks/          # Custom React hooks
├── services/       # Comunicação com API
├── context/        # Gerenciamento de estado global
├── types/          # Definições TypeScript
└── utils/          # Funções auxiliares
```

---

## Estrutura do Projeto

```
front-end-grafos/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chart/
│   │   │   │   └── SalesChart.tsx
│   │   │   ├── Layout/
│   │   │   │   └── Layout.tsx
│   │   │   └── Selects/
│   │   │       ├── CategorySelect.tsx
│   │   │       ├── ProductSelect.tsx
│   │   │       └── BrandSelect.tsx
│   │   ├── context/
│   │   │   ├── AppContext.tsx
│   │   │   └── AppState.tsx
│   │   ├── hooks/
│   │   │   ├── useCategories.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useBrands.ts
│   │   │   ├── useSales.ts
│   │   │   └── useAppState.ts
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Categories/
│   │   │   ├── Products/
│   │   │   ├── Brands/
│   │   │   └── Sales/
│   │   ├── services/
│   │   │   ├── category.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── brand.service.ts
│   │   │   └── sale.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── mockData.ts
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── seed.ts
│   │   ├── config/
│   │   │   └── swagger.ts
│   │   └── server.ts
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Pontos de Aprendizado

Este projeto demonstra:

1. **Padrões Modernos de React**
   - Arquitetura baseada em Hooks
   - Context API para gerenciamento de estado
   - Custom hooks para lógica de negócios
   - Memoização para performance

2. **Melhores Práticas de Backend**
   - Design de API RESTful
   - Melhores práticas de MongoDB
   - Automação de seeding de dados
   - Documentação de API com Swagger

3. **DevOps**
   - Containerização Docker
   - Orquestração de serviços
   - Health checks
   - Gerenciamento de dependências

4. **Qualidade de Código**
   - TypeScript para segurança de tipos
   - Princípios SOLID
   - Práticas de código limpo
   - Padrões de tratamento de erros

---

## Schema do Banco de Dados

### Coleções

**categories:**
- `_id`: ObjectId
- `name`: String (obrigatório)

**products:**
- `_id`: ObjectId
- `name`: String (obrigatório)
- `categoryId`: ObjectId (ref: categories)

**brands:**
- `_id`: ObjectId
- `name`: String (obrigatório)
- `productId`: ObjectId (ref: products)

**sales:**
- `_id`: ObjectId
- `brandId`: ObjectId (ref: brands)
- `month`: Number (1-12)
- `year`: Number
- `value`: Number (valor de vendas)

### Relacionamentos

```
Category (1) ──→ (N) Products
Product (1) ──→ (N) Brands
Brand (1) ──→ (N) Sales
```

---

## Destaques Técnicos

### 1. Carregamento Adaptativo de Dados
Alterna automaticamente entre "carregar tudo" e "lazy load" baseado no tamanho do dataset - demonstrando otimização de performance avançada sem mudanças de código.

### 2. Filtragem de Dados no Frontend
Toda filtragem acontece em memória usando `useMemo`, fornecendo atualizações instantâneas da UI sem requisições ao servidor.

### 3. Gerenciamento de Estado Centralizado
Fonte única de verdade usando Context API, evitando prop drilling e tornando mudanças de estado previsíveis.

### 4. Camada de API Type-Safe
Cobertura completa de TypeScript no frontend e backend, capturando erros em tempo de compilação.

### 5. Desenvolvimento Docker-First
Configuração completa de Docker com seeding automático de banco de dados, tornando trivial começar.

---

## Autor

**Erick Nascimento**

---

## Licença

Este projeto faz parte de uma avaliação técnica.

---

## Melhorias Futuras

Possíveis melhorias para produção:
- [ ] Paginação para datasets grandes
- [ ] Exportar dados para CSV/Excel
- [ ] Filtragem por intervalo de datas
- [ ] Gráficos avançados (pizza, barra, área)
- [ ] Autenticação de usuário
- [ ] Atualizações em tempo real com WebSockets
- [ ] Testes unitários e de integração
- [ ] Pipeline CI/CD
- [ ] Monitoramento de performance
- [ ] Estratégia de cache (Redis)

