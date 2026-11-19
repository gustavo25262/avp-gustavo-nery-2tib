export const camposObrigatorios = [
  "titulo",
  "genero",
  "plataforma",
  "anoLancamento",
  "preco"
];

export function validarJogo(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { erro: "Envie os dados do jogo em formato JSON." };
  }

  const camposAusentes = camposObrigatorios.filter((campo) => {
    const valor = body[campo];
    return valor === undefined || valor === null || String(valor).trim() === "";
  });

  if (camposAusentes.length) {
    return { erro: `Campos obrigatórios ausentes: ${camposAusentes.join(", ")}` };
  }

  const limitesDeTexto = { titulo: 100, genero: 80, plataforma: 80 };
  for (const [campo, limite] of Object.entries(limitesDeTexto)) {
    if (typeof body[campo] !== "string" || body[campo].trim().length > limite) {
      return { erro: `${campo} deve ser um texto com até ${limite} caracteres.` };
    }
  }

  if (!["number", "string"].includes(typeof body.anoLancamento)) {
    return { erro: "anoLancamento deve ser um número inteiro maior ou igual a zero." };
  }
  const anoLancamento = Number(body.anoLancamento);
  if (!Number.isInteger(anoLancamento) || anoLancamento < 0 || anoLancamento > 9999) {
    return { erro: "anoLancamento deve ser um número inteiro maior ou igual a zero." };
  }

  if (!["number", "string"].includes(typeof body.preco)) {
    return { erro: "preco deve ser um número maior ou igual a zero, com até duas casas decimais." };
  }
  const preco = Number(body.preco);
  if (
    !Number.isFinite(preco) ||
    preco < 0 ||
    preco > 99999999.99 ||
    !/^\d+(\.\d{1,2})?$/.test(String(body.preco).trim())
  ) {
    return { erro: "preco deve ser um número maior ou igual a zero, com até duas casas decimais." };
  }

  return {
    dados: {
      titulo: body.titulo.trim(),
      genero: body.genero.trim(),
      plataforma: body.plataforma.trim(),
      anoLancamento,
      preco
    }
  };
}
