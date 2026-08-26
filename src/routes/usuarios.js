import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();
const usuarios = [];
let nextUserId = 1;
const jwtSecret = process.env.JWT_SECRET || "segredo-de-desenvolvimento";

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string, example: Ana }
 *               email: { type: string, format: email, example: ana@email.com }
 *               senha: { type: string, format: password, example: senha123 }
 *     responses:
 *       201: { description: Usuario criado }
 *       400: { description: Campos obrigatorios ausentes }
 *       409: { description: Email ja cadastrado }
 */
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "nome, email e senha sao obrigatorios" });
  }

  if (usuarios.some((usuario) => usuario.email === email.toLowerCase())) {
    return res.status(409).json({ mensagem: "Email ja cadastrado" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = { id: nextUserId++, nome, email: email.toLowerCase(), senha: senhaHash };
  usuarios.push(usuario);

  res.status(201).json({
    mensagem: "Usuario cadastrado com sucesso",
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuario e retorna JWT
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, format: email, example: ana@email.com }
 *               senha: { type: string, format: password, example: senha123 }
 *     responses:
 *       200: { description: Token JWT gerado }
 *       401: { description: Credenciais invalidas }
 */
export async function login(req, res) {
  const { email, senha } = req.body;
  const usuario = usuarios.find((item) => item.email === email?.toLowerCase());

  if (!usuario || !senha || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ mensagem: "Email ou senha invalidos" });
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, jwtSecret, { expiresIn: "1h" });
  res.status(200).json({ token, expiresIn: "1h" });
}

export { router as usuariosRouter };
