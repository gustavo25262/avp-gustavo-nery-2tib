import * as jogosModel from "../models/jogosModel.js";
import { validarJogo } from "../utils/jogosValidation.js";

function numeroId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function serializarJogo(jogo) {
  return { ...jogo, preco: Number(jogo.preco) };
}

export async function listarJogos(req, res) {
  const jogos = await jogosModel.listarTodos();
  res.status(200).json(jogos.map(serializarJogo));
}

export async function buscarJogo(req, res) {
  const id = numeroId(req.params.id);
  const jogo = id === null ? null : await jogosModel.buscarPorId(id);
  if (!jogo) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }
  res.status(200).json(serializarJogo(jogo));
}

export async function criarJogo(req, res) {
  const validacao = validarJogo(req.body);
  if (validacao.erro) {
    return res.status(400).json({ mensagem: validacao.erro });
  }

  const jogo = await jogosModel.criar(validacao.dados);
  res.status(201).json({
    mensagem: "Jogo cadastrado com sucesso.",
    jogo: serializarJogo(jogo)
  });
}

export async function atualizarJogo(req, res) {
  const id = numeroId(req.params.id);
  if (id === null) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  const validacao = validarJogo(req.body);
  if (validacao.erro) {
    return res.status(400).json({ mensagem: validacao.erro });
  }

  const existente = await jogosModel.buscarPorId(id);
  if (!existente) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  const jogo = await jogosModel.atualizar(id, validacao.dados);
  res.status(200).json({
    mensagem: "Jogo atualizado com sucesso.",
    jogo: serializarJogo(jogo)
  });
}

export async function excluirJogo(req, res) {
  const id = numeroId(req.params.id);
  if (id === null) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  const existente = await jogosModel.buscarPorId(id);
  if (!existente) {
    return res.status(404).json({ mensagem: "Jogo não encontrado." });
  }

  const jogo = await jogosModel.excluir(id);
  res.status(200).json({
    mensagem: "Jogo removido com sucesso.",
    jogo: serializarJogo(jogo)
  });
}