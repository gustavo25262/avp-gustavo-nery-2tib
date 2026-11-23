import prisma from "../config/prisma.js";

export function listarTodos() {
  return prisma.jogo.findMany({ orderBy: { id: "asc" } });
}

export function buscarPorId(id) {
  return prisma.jogo.findUnique({ where: { id } });
}

export function criar(dados) {
  return prisma.jogo.create({ data: dados });
}

export function atualizar(id, dados) {
  return prisma.jogo.update({ where: { id }, data: dados });
}

export function excluir(id) {
  return prisma.jogo.delete({ where: { id } });
}
