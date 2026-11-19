import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { autenticar } from "../src/middlewares/auth.js";

process.env.JWT_SECRET = "test-secret-with-more-than-thirty-two-characters";

function resposta() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test("middleware rejeita token ausente, inválido ou expirado", () => {
  for (const authorization of [undefined, "Bearer token-invalido", `Bearer ${jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: -1 })}`]) {
    const req = { headers: { authorization } };
    const res = resposta();
    let chamado = false;

    autenticar(req, res, () => { chamado = true; });

    assert.equal(res.statusCode, 401);
    assert.equal(chamado, false);
  }
});

test("middleware libera token válido e disponibiliza os dados autenticados", () => {
  const token = jwt.sign({ id: 42, email: "ana@email.com" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = resposta();
  let chamado = false;

  autenticar(req, res, () => { chamado = true; });

  assert.equal(chamado, true);
  assert.equal(req.user.id, 42);
  assert.equal(req.user.email, "ana@email.com");
});
