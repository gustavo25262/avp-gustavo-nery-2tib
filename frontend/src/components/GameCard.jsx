import React from "react";

export default function GameCard({ jogo, onEdit, onDelete, busy }) {
  return (
    <article className="game-card">
      <div className="game-card__top">
        <span className="game-card__genre">{jogo.genero}</span>
        <span className="game-card__id">#{String(jogo.id).padStart(3, "0")}</span>
      </div>
      <h3>{jogo.titulo}</h3>
      <p className="game-card__platform">{jogo.plataforma}</p>
      <div className="game-card__details">
        <span>Lançamento <strong>{jogo.anoLancamento}</strong></span>
        <strong className="game-card__price">
          {Number(jogo.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </strong>
      </div>
      <div className="game-card__actions">
        <button type="button" className="button button--quiet" disabled={busy} onClick={() => onEdit(jogo)}>
          Editar
        </button>
        <button type="button" className="button button--danger-quiet" disabled={busy} onClick={() => onDelete(jogo)}>
          Excluir
        </button>
      </div>
    </article>
  );
}
