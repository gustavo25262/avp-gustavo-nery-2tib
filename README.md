# API Catalogo de Jogos

Projeto escolar de API REST com Node.js e Express. O tema foi trocado de cadastro de alunos para catalogo de jogos porque o enunciado nao aceita temas escolares.

## Requisitos e execucao

- Node.js 18+
- `npm install`
- Copie `.env.example` para `.env` e defina um `JWT_SECRET` proprio.
- `npm run dev` (desenvolvimento) ou `npm start`

A API inicia em `http://localhost:3000`. Os dados ficam em memoria e sao perdidos ao reiniciar.

## Rotas

### AV1: jogos

Os `GET` sao publicos. `POST`, `PUT` e `DELETE` exigem `Authorization: Bearer TOKEN`.

Corpo de jogo:

```json
{
  "titulo": "Hades",
  "genero": "Roguelike",
  "plataforma": "PC",
  "anoLancamento": 2020,
  "preco": 74.99
}
```

| Metodo | Rota | Sucesso |
| --- | --- | --- |
| POST | `/jogos` | `201` com o jogo criado |
| GET | `/jogos` | `200` com a lista |
| GET | `/jogos/:id` | `200` com o jogo |
| PUT | `/jogos/:id` | `200` com o jogo atualizado |
| DELETE | `/jogos/:id` | `200` com o jogo removido |

IDs sao gerados por contador incremental e nao sao reutilizados depois de exclusoes. Campos ausentes retornam `400`; IDs inexistentes retornam `404`.

Exemplos:

```bash
curl http://localhost:3000/jogos
curl http://localhost:3000/jogos/1
curl -X POST http://localhost:3000/jogos -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"titulo":"Celeste","genero":"Plataforma","plataforma":"PC","anoLancamento":2018,"preco":36.99}'
curl -X PUT http://localhost:3000/jogos/1 -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"titulo":"Hades II","genero":"Roguelike","plataforma":"PC","anoLancamento":2024,"preco":99.99}'
curl -X DELETE http://localhost:3000/jogos/1 -H "Authorization: Bearer TOKEN"
```

### AV2: autenticacao

| Metodo | Rota | Descricao |
| --- | --- | --- |
| POST | `/usuarios` | Cadastra usuario com `nome`, `email` e `senha` |
| POST | `/login` | Valida credenciais e retorna JWT com validade de 1 hora |
| POST | `/upload` | Recebe imagem no campo `imagem` |
| GET | `/api-docs` | Abre a documentacao Swagger |

Cadastro e login:

```bash
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nome":"Ana","email":"ana@email.com","senha":"senha123"}'
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"ana@email.com","senha":"senha123"}'
```

Use o valor de `token` retornado no header das rotas protegidas. As senhas sao armazenadas somente como hash bcrypt; credenciais invalidas retornam `401`.

### Upload

Aceita apenas `image/jpeg`, `image/png` e `image/webp`, com limite de 2 MB. O arquivo e salvo em `src/uploads/` e a resposta informa `arquivo` e `caminho`.

```bash
curl -X POST http://localhost:3000/upload -F "imagem=@./capa.png"
```

O Swagger detalha todas as rotas em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).
