# API URL Shortener

API para encurtamento de URLs desenvolvida com NestJS.

## 🏗️ Estrutura do Projeto

```
.
├── src/                    # Código fonte da aplicação
│   ├── main.ts            # Ponto de entrada da aplicação
│   ├── app.module.ts      # Módulo principal da aplicação
│   ├── modules/           # Módulos da aplicação
│   │   ├── auth/         # Módulo de autenticação
│   │   ├── user/         # Módulo de usuários
│   │   └── url/          # Módulo de URLs encurtadas
│   ├── common/           # Código compartilhado
│   │   ├── decorators/   # Decoradores personalizados
│   │   ├── interceptors/ # Interceptores
│   │   └── utils/        # Utilitários
│   └── database/         # Configurações do banco de dados
├── prisma/                 # Configurações e migrações do Prisma
│   ├── schema.prisma    # Schema do banco de dados
│   ├── migrations/     # Histórico de migrações do banco
│   └── seeds/          # Dados iniciais para o banco
├── test/                   # Testes automatizados
├── dist/                   # Código compilado
├── coverage/               # Relatórios de cobertura de testes
├── .husky/                 # Configurações do Husky para git hooks
├── node_modules/           # Dependências do projeto
├── .env-exemple           # Exemplo de variáveis de ambiente
├── docker-compose.yml     # Configuração do Docker Compose
├── Dockerfile             # Configuração do Docker
└── package.json           # Dependências e scripts do projeto
```

## 🔒 Autenticação
Para acessar as rotas protegidas, é necessário incluir o token JWT no header da requisição:

```
Authorization: Bearer <seu_token>
```

O token é obtido através do endpoint de login.

## 🚀 Rotas da API

### Autenticação
- `POST /auth/login` - Login de usuário
  - Obs.: Este usuário será criado junto com seed.
  ```json
  {
    "email": "ola@danielgguerra.dev",
    "password": "123456"
  }
  ```

### Usuários
- `POST /users` - Criar novo usuário
  ```json
  {
    "email": "ola2@danielgguerra.dev",
    "password": "Ola2@00x00"
  }
  ```

### URLs
- `POST /` - Criar nova URL encurtada (requer autenticação)
  ```json
  {
    "url": "https://www.danielgguerra.dev/"
  }
  ```
- `GET /` - Listar URLs (requer autenticação)
  - Query params: `page` e `limit`
- `PATCH /:id` - Atualizar URL (requer autenticação)
  ```json
  {
    "url": "https://www.linkedin.com/in/danielgguerra/"
  }
  ```
- `DELETE /:id` - Deletar URL (requer autenticação)

## 📡 Coleção do Insomnia

Para facilitar os testes da API, utilize a coleção do Insomnia com todas as rotas configuradas. Você pode importar o arquivo `Insomnia_2025-05-12.yaml` diretamente no Insomnia.

Para importar:
1. Abra o Insomnia
2. Clique em "Create" > "Import from File"
3. Selecione o arquivo `Insomnia_2025-05-12.yaml`

A coleção inclui:
- Todas as rotas da API
- Exemplos de payloads
- Configuração de ambiente com variáveis
- Headers pré-configurados

## 📚 Documentação com Swagger

A documentação interativa da API está disponível através do Swagger UI. Após iniciar a aplicação, você pode acessar:

```
http://localhost:3000/docs
```

No Swagger UI você encontrará:
- Todas as rotas disponíveis organizadas por tags (URLs, Users, Auth)
- Esquemas de requisição e resposta
- Interface interativa para testar os endpoints
- Descrições detalhadas dos parâmetros
- Exemplos de uso
- Configuração de autenticação JWT
- Documentação da versão 1.0 da API

## 🛠️ Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### Passos para Execução

1. Clone o repositório
2. Copie o arquivo `.env-exemple` para `.env` e configure as variáveis de ambiente
3. Execute o projeto com Docker Compose:

```bash
docker compose up --build
```

O comando acima irá:
- Construir a imagem Docker do projeto
- Iniciar o container da aplicação
- Configurar o banco de dados PostgreSQL
- Executar as migrações do Prisma
- Iniciar a aplicação na porta 3000

A API estará disponível em `http://localhost:3000`
