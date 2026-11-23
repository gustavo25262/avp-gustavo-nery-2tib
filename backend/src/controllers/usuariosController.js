import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as usuariosModel from "../models/usuariosModel.js";
import { obterJwtSecret } from "../config/env.js";

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body ?? {};
  const nomeNormalizado = typeof nome === "string" ? nome.trim() : "";
  const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!nomeNormalizado || !emailNormalizado || typeof senha !== "string" || !senha) {
    return res.status(400).json({ mensagem: "nome, email e senha são obrigatórios." });
  }
  if (nomeNormalizado.length > 100 || !emailValido.test(emailNormalizado) || emailNormalizado.length > 191) {
    return res.status(400).json({ mensagem: "Informe um nome e um e-mail válidos." });
  }
  if (Buffer.byteLength(senha, "utf8") < 8 || Buffer.byteLength(senha, "utf8") > 72) {
    return res.status(400).json({ mensagem: "A senha deve ter entre 8 e 72 bytes." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuariosModel.criar({
    nome: nomeNormalizado,
    email: emailNormalizado,
    senhaHash
  });

  res.status(201).json({ mensagem: "Usuário cadastrado com sucesso.", usuario });
}

export async function login(req, res) {
  const { email, senha } = req.body ?? {};
  const emailNormalizado = typeof email === "string" ? email.trim().toLowerCase() : "";
  const usuario = emailNormalizado ? await usuariosModel.buscarPorEmail(emailNormalizado) : null;

  if (!usuario || typeof senha !== "string" || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    obterJwtSecret(),
    { expiresIn: "1h" }
  );
  res.status(200).json({
    token,
    expiresIn: "1h",
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
}

export async function usuarioAtual(req, res) {
  const id = Number(req.user.id);
  const usuario = Number.isInteger(id) ? await usuariosModel.buscarPorId(id) : null;
  if (!usuario) {
    return res.status(401).json({ mensagem: "Sessão inválida. Faça login novamente." });
  }
  res.status(200).json({ usuario });
}
