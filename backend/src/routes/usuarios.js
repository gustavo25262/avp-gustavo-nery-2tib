import { Router } from "express";
import { autenticar } from "../middlewares/auth.js";
import { cadastrarUsuario, login, usuarioAtual } from "../controllers/usuariosController.js";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um usuário com senha protegida por hash
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string }
 *               email: { type: string, format: email }
 *               senha: { type: string, format: password, minLength: 8 }
 *     responses:
 *       201: { description: Usuário cadastrado }
 *       400: { description: Dados inválidos }
 *       409: { description: E-mail já cadastrado }
 */
router.post("/", cadastrarUsuario);

/**
 * @swagger
 * /usuarios/me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuário encontrado }
 *       401: { description: Token ausente ou inválido }
 */
router.get("/me", autenticar, usuarioAtual);

export { router as usuariosRouter, login };
