import { Router } from "express";
import { autenticar } from "../middlewares/auth.js";

const router = Router();
let nextId = 4;

const jogos = [
  {
    id: 1,
    titulo: "Hades",
    genero: "Roguelike",
    plataforma: "PC",
    anoLancamento: 2020,
    preco: 74.99
  },
  {
    id: 2,
    titulo: "Celeste",
    genero: "Plataforma",
    plataforma: "PC",
    anoLancamento: 2018,
    preco: 36.99
  },
  {
    id: 3,
    titulo: "Stardew Valley",
    genero: "Simulacao",
    plataforma: "PC",
    anoLancamento: 2016,
    preco: 24.99
  }
];

const camposObrigatorios = [
  "titulo",
  "genero",
  "plataforma",
  "anoLancamento",
  "preco"
];

function validarJogo(body) {
  const camposAusentes = camposObrigatorios.filter(
    (campo) => body[campo] === undefined || body[campo] === null || body[campo] === ""
  );

  if (camposAusentes.length > 0) {
    return `Campos obrigatorios ausentes: ${camposAusentes.join(", ")}`;
  }

  if (!Number.isInteger(Number(body.anoLancamento)) || Number(body.anoLancamento) < 0) {
    return "anoLancamento deve ser um numero inteiro valido";
  }

  if (Number.isNaN(Number(body.preco)) || Number(body.preco) < 0) {
    return "preco deve ser um numero maior ou igual a zero";
  }

  return null;
}

function criarJogo(body, id) {
  return {
    id,
    titulo: String(body.titulo).trim(),
    genero: String(body.genero).trim(),
    plataforma: String(body.plataforma).trim(),
    anoLancamento: Number(body.anoLancamento),
    preco: Number(body.preco)
  };
}

/**
 * @swagger
 * /jogos:
 *   get:
 *     summary: Lista todos os jogos
 *     tags: [Jogos]
 *     responses:
 *       200: { description: Lista de jogos }
 */
router.get("/", (req, res) => {
  res.status(200).json(jogos);
});

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
router.get("/:id", (req, res) => {
  const jogo = jogos.find((item) => item.id === Number(req.params.id));

  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo nao encontrado" });
  }

  res.status(200).json(jogo);
});

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
router.post("/", autenticar, (req, res) => {
  const erro = validarJogo(req.body);

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  const novoJogo = criarJogo(req.body, nextId++);
  jogos.push(novoJogo);

  res.status(201).json({ mensagem: "Jogo cadastrado com sucesso", jogo: novoJogo });
});

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
router.put("/:id", autenticar, (req, res) => {
  const indice = jogos.findIndex((item) => item.id === Number(req.params.id));

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Jogo nao encontrado" });
  }

  const erro = validarJogo(req.body);
  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  const jogoAtualizado = criarJogo(req.body, jogos[indice].id);
  jogos[indice] = jogoAtualizado;
  res.status(200).json({ mensagem: "Jogo atualizado com sucesso", jogo: jogoAtualizado });
});

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
router.delete("/:id", autenticar, (req, res) => {
  const indice = jogos.findIndex((item) => item.id === Number(req.params.id));

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Jogo nao encontrado" });
  }

  const [jogoRemovido] = jogos.splice(indice, 1);
  res.status(200).json({ mensagem: "Jogo removido com sucesso", jogo: jogoRemovido });
});

export default router;
