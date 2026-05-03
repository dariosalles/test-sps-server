# Test SPS Server - Backend

API backend desenvolvida em Node.js/Express para gerenciamento de usuários do sistema SPS.

## 📋 Pré-requisitos

- **Node.js** versão 14.0 ou superior
- **npm** ou **yarn** instalado
- **Git** (opcional)

## 🚀 Instalação

### 1. Clonar ou baixar o projeto

```bash
git clone https://github.com/dariosalles/test-sps-server
cd test-sps-server
```

### 2. Instalar as dependências

```bash
npm install
```

Ou com yarn:

```bash
yarn install
```

## 🔧 Executar o projeto

### Desenvolvimento

```bash
npm start
```

O servidor iniciará em `http://localhost:3001`

### Executar com nodemon (auto-reload)

```bash
npm install -g nodemon
nodemon src/index.js
```

## 📁 Estrutura do Projeto

```
test-sps-server/
├── src/
│   ├── helpers.js          # Funções utilitárias
│   ├── index.js            # Entry point do servidor
│   ├── routes.js           # Definição das rotas
│   └── middleware/
│       └── authMiddleware.js  # Middleware de autenticação JWT
├── package.json
├── .env                    # Variáveis de ambiente
└── README.md
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

- Token gerado no login com validade de **24 horas**
- Token deve ser enviado no header: `Authorization: Bearer <token>`
- Rotas protegidas verificam a autenticidade do token

## 📡 Endpoints da API

### 1. Login
```http
POST /login
```

**Request:**
```json
{
  "email": "admin@spsgroup.com.br",
  "password": "1234"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@spsgroup.com.br",
    "nome": "Administrador",
    "type": "admin",
    "dataCriacao": "2024-05-01T10:30:00.000Z"
  }
}
```

### 2. Listar Usuários
```http
GET /users
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "admin@spsgroup.com.br",
    "nome": "Administrador",
    "type": "admin",
    "dataCriacao": "2024-05-01T10:30:00.000Z"
  },
  {
    "id": 2,
    "email": "user@example.com",
    "nome": "João Silva",
    "type": "user",
    "dataCriacao": "2024-05-02T14:15:00.000Z"
  }
]
```

### 3. Obter Usuário por ID
```http
GET /users/:id
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@spsgroup.com.br",
  "nome": "Administrador",
  "type": "admin",
  "dataCriacao": "2024-05-01T10:30:00.000Z"
}
```

### 4. Criar Usuário
```http
POST /users
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
```

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "type": "user",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "message": "✅ Usuário criado com sucesso!",
  "usuario": {
    "id": 2,
    "nome": "João Silva",
    "email": "joao@example.com",
    "type": "user",
    "dataCriacao": "2024-05-02T14:15:00.000Z"
  }
}
```

### 5. Atualizar Usuário
```http
PUT /users/:id
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
```

**Request:**
```json
{
  "nome": "João Silva Atualizado",
  "email": "joao_novo@example.com",
  "type": "gerente",
  "password": "novaSenha123"
}
```

**Response (200):**
```json
{
  "message": "✅ Usuário atualizado com sucesso!",
  "usuario": {
    "id": 2,
    "nome": "João Silva Atualizado",
    "email": "joao_novo@example.com",
    "type": "gerente",
    "dataCriacao": "2024-05-02T14:15:00.000Z"
  }
}
```

### 6. Deletar Usuário
```http
DELETE /users/:id
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "✅ Usuário deletado com sucesso!"
}
```

## ⚠️ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Requisição inválida (dados faltando ou inválidos) |
| 401 | Não autenticado (token inválido ou expirado) |
| 403 | Proibido (sem permissão para essa ação) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## 📝 Usuário Padrão

Ao iniciar a aplicação, um usuário padrão é criado:

```
ID: 1
Email: admin@spsgroup.com.br
Nome: Administrador
Tipo: admin
Senha: 1234
```

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - CORS para requisições cross-origin
- **Node.js** - Runtime JavaScript

## 🐛 Troubleshooting

### Erro: "Port already in use"
```bash
# Mude a porta no arquivo .env
PORT=3002
```

### Erro: "Token inválido"
- Certifique-se de que o JWT_SECRET é o mesmo no .env
- Verifique se o token foi enviado corretamente no header

### Erro: "CORS error"
- O middleware CORS está habilitado por padrão
- Aceita requisições de qualquer origem
