import { Router } from "express";
import { autenticar } from "../middlewares/auth.js";
import {
  atualizarJogo,
  buscarJogo,
  criarJogo,
  excluirJogo,
  listarJogos
} from "../controllers/jogosController.js";

const router = Router();

/**
 * @swagger
 * /jogos:
 *   get:
 *     summary: Lista todos os jogos
 *     tags: [Jogos]
 *     responses:
 *       200: { description: Lista de jogos }
 */
router.get("/", listarJogos);

/**
 * @swagger
 * /jogos/{id}:
 *   get:
 *     summary: Consulta um jogo por ID
 *     tags: [Jogos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Jogo encontrado }
 *       404: { description: Jogo nao encontrado }
 */
router.get("/:id", buscarJogo);

/**
 * @swagger
 * /jogos:
 *   post:
 *     summary: Cadastra um jogo
 *     tags: [Jogos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, genero, plataforma, anoLancamento, preco]
 *             example: { titulo: Hades, genero: Roguelike, plataforma: PC, anoLancamento: 2020, preco: 74.99 }
 *     responses:
 *       201: { description: Jogo criado }
 *       400: { description: Dados invalidos }
 *       401: { description: Nao autenticado }
 */
router.post("/", autenticar, criarJogo);

/**
 * @swagger
 * /jogos/{id}:
 *   put:
 *     summary: Atualiza um jogo
 *     tags: [Jogos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Jogo atualizado }
 *       400: { description: Dados invalidos }
 *       401: { description: Nao autenticado }
 *       404: { description: Jogo nao encontrado }
 */
router.put("/:id", autenticar, atualizarJogo);

/**
 * @swagger
 * /jogos/{id}:
 *   delete:
 *     summary: Remove um jogo
 *     tags: [Jogos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Jogo removido }
 *       401: { description: Nao autenticado }
 *       404: { description: Jogo nao encontrado }
 */
router.delete("/:id", autenticar, excluirJogo);

export default router;
