import prisma from "../config/prisma.js";

export function buscarPorEmail(email) {
  return prisma.usuario.findUnique({ where: { email } });
}

export function buscarPorId(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true }
  });
}

export function criar({ nome, email, senhaHash }) {
  return prisma.usuario.create({
    data: { nome, email, senhaHash },
    select: { id: true, nome: true, email: true }
  });
}
