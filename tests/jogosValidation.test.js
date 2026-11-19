import test from "node:test";
import assert from "node:assert/strict";
import { validarJogo } from "../src/utils/jogosValidation.js";

const jogoValido = {
  titulo: "  Hades  ",
  genero: "Roguelike",
  plataforma: "PC",
  anoLancamento: "2020",
  preco: "74.99"
};

test("normaliza texto e converte campos numéricos de um jogo válido", () => {
  const resultado = validarJogo(jogoValido);

  assert.equal(resultado.erro, undefined);
  assert.deepEqual(resultado.dados, {
    titulo: "Hades",
    genero: "Roguelike",
    plataforma: "PC",
    anoLancamento: 2020,
    preco: 74.99
  });
});

test("rejeita campos obrigatórios vazios e preço negativo ou com precisão excessiva", () => {
  assert.match(validarJogo({ ...jogoValido, titulo: "   " }).erro, /titulo/);
  assert.match(validarJogo({ ...jogoValido, preco: "-1" }).erro, /preco/);
  assert.match(validarJogo({ ...jogoValido, preco: "1.999" }).erro, /preco/);
});

test("rejeita ano fracionário e payload que não seja objeto", () => {
  assert.match(validarJogo({ ...jogoValido, anoLancamento: "2020.5" }).erro, /anoLancamento/);
  assert.match(validarJogo({ ...jogoValido, anoLancamento: true }).erro, /anoLancamento/);
  assert.match(validarJogo(null).erro, /JSON/);
});
