import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import jogosRouter from "./src/routes/jogos.js";
import { usuariosRouter, login } from "./src/routes/usuarios.js";
import uploadRouter from "./src/routes/upload.js";
import swaggerSpec from "./src/docs/swagger.js";

const app = express();

app.use(express.json());
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

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE" || error.status === 400) {
    return res.status(400).json({ mensagem: error.message || "Arquivo invalido" });
  }
  next(error);
});

export default app;
