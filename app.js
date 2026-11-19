import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import jogosRouter from "./src/routes/jogos.js";
import { usuariosRouter, login } from "./src/routes/usuarios.js";
import uploadRouter from "./src/routes/upload.js";
import swaggerSpec from "./src/docs/swagger.js";

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === clientOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "src/uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API Catalogo de Jogos funcionando!"
  });
});

app.use("/jogos", jogosRouter);
app.use("/usuarios", usuariosRouter);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz login e retorna um token JWT
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             example: { email: ana@email.com, senha: senha123 }
 *     responses:
 *       200: { description: Login realizado }
 *       401: { description: Credenciais invalidas }
 */
app.post("/login", login);
app.use("/upload", uploadRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE" || error.status === 400 || error.type === "entity.parse.failed") {
    return res.status(400).json({ mensagem: error.message || "Requisição inválida." });
  }
  if (error.code === "P2002") {
    return res.status(409).json({ mensagem: "E-mail já cadastrado." });
  }
  if (error.code === "P2025") {
    return res.status(404).json({ mensagem: "Registro não encontrado." });
  }
  if (
    (typeof error.code === "string" && error.code.startsWith("P1")) ||
    ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND"].includes(error.code)
  ) {
    console.error("Falha de comunicação com o banco de dados:", error);
    return res.status(503).json({ mensagem: "Banco de dados indisponível. Tente novamente." });
  }

  console.error("Erro não tratado na API:", error);
  res.status(500).json({ mensagem: "Erro interno do servidor." });
});

export default app;
