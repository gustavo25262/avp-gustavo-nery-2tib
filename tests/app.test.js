import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

process.env.JWT_SECRET = "test-secret-with-more-than-thirty-two-characters";
process.env.DATABASE_URL = "mysql://root:local@127.0.0.1:3306/test_catalogo";

const { default: app } = await import("../app.js");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test("API inicia, publica a rota principal e responde erros de rota em JSON", async () => {
  const inicio = await fetch(baseUrl);
  assert.equal(inicio.status, 200);
  assert.match((await inicio.json()).mensagem, /API Catalogo de Jogos/);

  const inexistente = await fetch(`${baseUrl}/rota-inexistente`);
  assert.equal(inexistente.status, 404);
  assert.equal((await inexistente.json()).mensagem, "Rota não encontrada.");
});
