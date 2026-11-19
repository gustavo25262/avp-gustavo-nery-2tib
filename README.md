# Catálogo de Jogos

Aplicação escolar de catálogo de jogos. O backend usa Node.js, Express e Prisma com MySQL; o frontend usa React e Vite. O CRUD e as contas são persistidos no banco de dados.

## Requisitos

- Node.js 20.19 ou superior.
- MySQL em execução e um banco criado (por exemplo, `gustavo_nery_2tib`).
- npm.

## Configuração e execução

1. Na raiz, instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` copiando `.env.example`. Configure `DATABASE_URL` para seu MySQL e troque `JWT_SECRET` por uma chave própria com pelo menos 32 caracteres. Exemplo local:

   ```env
   PORT=3000
   JWT_SECRET=use-uma-chave-local-com-pelo-menos-32-caracteres
   DATABASE_URL="mysql://root:sua-senha@localhost:3306/gustavo_nery_2tib"
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. Gere o cliente Prisma e aplique as migrações:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

   A primeira migração já existente cria a tabela de jogos legada. A seguinte adapta os nomes de campos sem apagar os registros e cria a tabela de usuários. Jogos antigos recebem valores padrão para plataforma, ano e preço, que podem ser atualizados pela interface.

4. Em um terminal, inicie a API:

   ```bash
   npm run dev
   ```

   A API fica em `http://localhost:3000`; a documentação Swagger, em `http://localhost:3000/api-docs`.

5. Em outro terminal, instale e inicie o frontend:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`). O Vite encaminha as chamadas da API para a porta 3000.

Para produção, defina `VITE_API_URL` no ambiente de build do frontend com a URL da API e configure `CLIENT_ORIGIN` com a origem publicada. Aplique migrações existentes com `npx prisma migrate deploy`.

## Como funciona

### Backend (AV1)

- **Routes:** `src/routes/` define endpoints e combina middlewares com controllers.
- **Controllers:** `src/controllers/` valida entradas e monta respostas HTTP.
- **Models:** `src/models/` usa Prisma para consultar e alterar o banco.
- **Config:** `src/config/` configura o cliente Prisma e valida as variáveis de ambiente.
- **Middleware:** `src/middlewares/auth.js` valida o JWT nas rotas de escrita.

O cliente Prisma usa o adapter MariaDB para conectar ao MySQL configurado em `DATABASE_URL`. As migrações em `prisma/migrations/` versionam a estrutura do banco. Os dados não são carregados de arrays no servidor.

Ao cadastrar, a senha é armazenada como hash bcrypt. O login compara o hash e retorna um JWT com validade de uma hora. O frontend envia esse token como `Authorization: Bearer <token>` para cadastrar, editar ou excluir jogos. O logout remove o token do navegador; como JWT é stateless, um token já emitido permanece válido até expirar.

### Frontend (AV2)

Os componentes React em `client/src/components/` organizam autenticação, formulários, mensagens e cartões de jogos. O componente principal mantém usuário, jogos, carregamento e mensagens com `useState`; os formulários enviam eventos para a API por `client/src/api.js`. A tela lista somente os registros retornados pelo backend.

## Endpoints

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/jogos` | Público | Lista jogos persistidos |
| `GET` | `/jogos/:id` | Público | Consulta um jogo |
| `POST` | `/jogos` | JWT | Cadastra um jogo |
| `PUT` | `/jogos/:id` | JWT | Atualiza todos os campos do jogo |
| `DELETE` | `/jogos/:id` | JWT | Exclui um jogo |
| `POST` | `/usuarios` | Público | Cadastra usuário |
| `POST` | `/login` | Público | Autentica e retorna JWT |
| `GET` | `/usuarios/me` | JWT | Retorna o usuário do token |
| `POST` | `/upload` | Público | Envia uma imagem JPEG, PNG ou WebP (até 2 MB) |
| `GET` | `/api-docs` | Público | Documentação Swagger |

### Exemplo de CRUD pela API

Cadastre um usuário e faça login:

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Ana\",\"email\":\"ana@email.com\",\"senha\":\"senha123\"}"

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana@email.com\",\"senha\":\"senha123\"}"
```

Use o valor `token` retornado no login:

```bash
curl -X POST http://localhost:3000/jogos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"titulo\":\"Hades\",\"genero\":\"Roguelike\",\"plataforma\":\"PC\",\"anoLancamento\":2020,\"preco\":74.99}"

curl http://localhost:3000/jogos
curl http://localhost:3000/jogos/1
curl -X PUT http://localhost:3000/jogos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"titulo\":\"Hades II\",\"genero\":\"Roguelike\",\"plataforma\":\"PC\",\"anoLancamento\":2024,\"preco\":99.99}"
curl -X DELETE http://localhost:3000/jogos/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Testes

Na raiz, execute `npm test` para verificar a inicialização HTTP, respostas JSON de erro, validação do CRUD e middleware JWT. Os testes de integração e persistência exigem um MySQL configurado; depois de definir `.env` e aplicar as migrações, demonstre-os com as rotas acima ou pela interface.
