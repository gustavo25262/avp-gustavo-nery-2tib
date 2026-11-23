import React, { useState } from "react";

export default function AuthForm({ onSubmit, busy }) {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function enviar(event) {
    event.preventDefault();
    await onSubmit({ modo, nome, email, senha });
  }

  return (
    <section className="panel auth-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Área do usuário</p>
          <h2>{modo === "login" ? "Acesse sua conta" : "Crie sua conta"}</h2>
        </div>
        <span className="status-dot" aria-hidden="true" />
      </div>

      <div className="auth-tabs" role="tablist" aria-label="Autenticação">
        <button
          type="button"
          className={modo === "login" ? "active" : ""}
          onClick={() => setModo("login")}
          role="tab"
          aria-selected={modo === "login"}
        >
          Entrar
        </button>
        <button
          type="button"
          className={modo === "cadastro" ? "active" : ""}
          onClick={() => setModo("cadastro")}
          role="tab"
          aria-selected={modo === "cadastro"}
        >
          Cadastrar
        </button>
      </div>

      <form className="stack-form" onSubmit={enviar}>
        {modo === "cadastro" && (
          <label>
            Nome
            <input
              autoComplete="name"
              maxLength={100}
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </label>
        )}
        <label>
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            autoComplete={modo === "login" ? "current-password" : "new-password"}
            minLength={8}
            maxLength={72}
            required
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
          {modo === "cadastro" && <span className="field-hint">Use pelo menos 8 caracteres.</span>}
        </label>
        <button className="button button--primary button--full" disabled={busy} type="submit">
          {busy ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>
    </section>
  );
}
