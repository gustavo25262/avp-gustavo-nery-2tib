import React, { useEffect, useState } from "react";

const camposIniciais = {
  titulo: "",
  genero: "",
  plataforma: "",
  anoLancamento: "",
  preco: ""
};

export default function GameForm({ jogo, onSubmit, onCancel, busy }) {
  const [campos, setCampos] = useState(camposIniciais);

  useEffect(() => {
    setCampos(jogo ? {
      titulo: jogo.titulo,
      genero: jogo.genero,
      plataforma: jogo.plataforma,
      anoLancamento: String(jogo.anoLancamento),
      preco: String(jogo.preco)
    } : camposIniciais);
  }, [jogo]);

  function atualizar(event) {
    setCampos((atual) => ({ ...atual, [event.target.name]: event.target.value }));
  }

  async function enviar(event) {
    event.preventDefault();
    await onSubmit({
      ...campos,
      anoLancamento: Number(campos.anoLancamento),
      preco: Number(campos.preco)
    });
  }

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{jogo ? "Edição" : "Novo registro"}</p>
          <h2>{jogo ? "Atualizar jogo" : "Adicionar jogo"}</h2>
        </div>
        <span className="panel-icon" aria-hidden="true">＋</span>
      </div>
      <form className="stack-form game-form" onSubmit={enviar}>
        <label>
          Título
          <input name="titulo" maxLength={100} required value={campos.titulo} onChange={atualizar} />
        </label>
        <div className="form-row">
          <label>
            Gênero
            <input name="genero" maxLength={80} required value={campos.genero} onChange={atualizar} />
          </label>
          <label>
            Plataforma
            <input name="plataforma" maxLength={80} required value={campos.plataforma} onChange={atualizar} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Ano de lançamento
            <input
              name="anoLancamento"
              type="number"
              min="0"
              step="1"
              required
              value={campos.anoLancamento}
              onChange={atualizar}
            />
          </label>
          <label>
            Preço (R$)
            <input
              name="preco"
              type="number"
              min="0"
              step="0.01"
              required
              value={campos.preco}
              onChange={atualizar}
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="button button--primary" disabled={busy} type="submit">
            {busy ? "Salvando..." : jogo ? "Salvar alterações" : "Cadastrar jogo"}
          </button>
          {jogo && <button className="button button--quiet" disabled={busy} onClick={onCancel} type="button">Cancelar</button>}
        </div>
      </form>
    </section>
  );
}
