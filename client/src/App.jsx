import React, { useCallback, useEffect, useState } from "react";
import AuthForm from "./components/AuthForm.jsx";
import Feedback from "./components/Feedback.jsx";
import GameCard from "./components/GameCard.jsx";
import GameForm from "./components/GameForm.jsx";
import { apiRequest, mensagemErro } from "./api.js";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [jogoEmEdicao, setJogoEmEdicao] = useState(null);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);
  const [operacaoEmAndamento, setOperacaoEmAndamento] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const carregarJogos = useCallback(async () => {
    setCarregandoLista(true);
    try {
      const dados = await apiRequest("/jogos");
      setJogos(dados);
      setApiOnline(true);
    } catch (error) {
      setApiOnline(false);
      setFeedback({ tipo: "erro", mensagem: mensagemErro(error) });
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  useEffect(() => {
    carregarJogos();
  }, [carregarJogos]);

  useEffect(() => {
    if (!token) {
      setUsuario(null);
      return;
    }
    let ativo = true;
    apiRequest("/usuarios/me")
      .then(({ usuario: usuarioAtual }) => {
        if (ativo) setUsuario(usuarioAtual);
      })
      .catch((error) => {
        if (ativo) {
          setToken(null);
          setFeedback({ tipo: "erro", mensagem: mensagemErro(error) });
        }
      });
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    const encerrarSessao = () => {
      setToken(null);
      setUsuario(null);
      setJogoEmEdicao(null);
      setFeedback({ tipo: "erro", mensagem: "Sua sessão expirou. Entre novamente para continuar." });
    };
    window.addEventListener("auth-expired", encerrarSessao);
    return () => window.removeEventListener("auth-expired", encerrarSessao);
  }, []);

  async function autenticar({ modo, nome, email, senha }) {
    setOperacaoEmAndamento(true);
    setFeedback(null);
    try {
      if (modo === "cadastro") {
        await apiRequest("/usuarios", {
          method: "POST",
          body: JSON.stringify({ nome, email, senha })
        });
        setFeedback({ tipo: "sucesso", mensagem: "Cadastro concluído. Agora entre com seus dados." });
      } else {
        const resultado = await apiRequest("/login", {
          method: "POST",
          body: JSON.stringify({ email, senha })
        });
        localStorage.setItem("token", resultado.token);
        setToken(resultado.token);
        setUsuario(resultado.usuario);
        setFeedback({ tipo: "sucesso", mensagem: `Bem-vindo(a), ${resultado.usuario.nome}!` });
      }
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: mensagemErro(error) });
    } finally {
      setOperacaoEmAndamento(false);
    }
  }

  async function salvarJogo(dados) {
    setOperacaoEmAndamento(true);
    setFeedback(null);
    try {
      if (jogoEmEdicao) {
        await apiRequest(`/jogos/${jogoEmEdicao.id}`, {
          method: "PUT",
          body: JSON.stringify(dados)
        });
        setFeedback({ tipo: "sucesso", mensagem: "Jogo atualizado com sucesso." });
      } else {
        await apiRequest("/jogos", { method: "POST", body: JSON.stringify(dados) });
        setFeedback({ tipo: "sucesso", mensagem: "Jogo cadastrado com sucesso." });
      }
      setJogoEmEdicao(null);
      await carregarJogos();
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: mensagemErro(error) });
    } finally {
      setOperacaoEmAndamento(false);
    }
  }

  async function excluirJogo(jogo) {
    if (!window.confirm(`Deseja excluir "${jogo.titulo}"?`)) return;
    setOperacaoEmAndamento(true);
    setFeedback(null);
    try {
      await apiRequest(`/jogos/${jogo.id}`, { method: "DELETE" });
      if (jogoEmEdicao?.id === jogo.id) setJogoEmEdicao(null);
      setFeedback({ tipo: "sucesso", mensagem: "Jogo removido com sucesso." });
      await carregarJogos();
    } catch (error) {
      setFeedback({ tipo: "erro", mensagem: mensagemErro(error) });
    } finally {
      setOperacaoEmAndamento(false);
    }
  }

  function sair() {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
    setJogoEmEdicao(null);
    setFeedback({ tipo: "sucesso", mensagem: "Sessão encerrada." });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Catálogo de jogos, início">
          <span className="brand-mark">CJ</span>
          <span>CATÁLOGO<span className="brand-muted"> / JOGOS</span></span>
        </a>
        {usuario ? (
          <div className="user-area">
            <span className="user-name">{usuario.nome}</span>
            <button type="button" className="button button--quiet" onClick={sair}>Sair</button>
          </div>
        ) : <span className="topbar-note">UMA COLEÇÃO, SEMPRE EM EXPANSÃO</span>}
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> SUA BIBLIOTECA DE JOGOS</p>
          <h1>Descubra.<br /><span>Organize.</span> Jogue.</h1>
          <p className="hero-description">
            Um espaço para explorar e organizar jogos de diferentes gêneros e plataformas.
          </p>
          <div className="hero-stats">
            <div><strong>{jogos.length.toString().padStart(2, "0")}</strong><span>jogos no catálogo</span></div>
            <div className="stat-divider" />
            <div><strong>{usuario ? "ATIVO" : "ABERTO"}</strong><span>acesso à coleção</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="art-glow" />
          <div className="controller">
            <span className="controller-cross">＋</span>
            <span className="controller-button controller-button--one" />
            <span className="controller-button controller-button--two" />
            <span className="controller-stick controller-stick--one" />
            <span className="controller-stick controller-stick--two" />
          </div>
          <span className="art-label">PLAYER<br />ONE</span>
          <span className="art-coordinate">02 / 04</span>
        </div>
      </section>

      <Feedback feedback={feedback} />

      <section className="content-grid">
        <div className="catalog-section">
          <div className="section-heading catalog-heading">
            <div>
              <p className="eyebrow">COLEÇÃO</p>
              <h2>Jogos do catálogo <span className="count-badge">{jogos.length}</span></h2>
            </div>
            <button type="button" className="button button--quiet refresh-button" onClick={carregarJogos} disabled={carregandoLista}>
              {carregandoLista ? "Carregando..." : "Atualizar lista"}
            </button>
          </div>

          {carregandoLista ? (
            <div className="empty-state"><span className="loader" />Buscando jogos na API...</div>
          ) : jogos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◇</span>
              <strong>O catálogo ainda está vazio.</strong>
              <span>Entre na sua conta para cadastrar o primeiro jogo.</span>
            </div>
          ) : (
            <div className="game-grid">
              {jogos.map((jogo) => (
                <GameCard
                  key={jogo.id}
                  jogo={jogo}
                  onEdit={setJogoEmEdicao}
                  onDelete={excluirJogo}
                  busy={operacaoEmAndamento}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="sidebar">
          {usuario ? (
            <GameForm
              jogo={jogoEmEdicao}
              onSubmit={salvarJogo}
              onCancel={() => setJogoEmEdicao(null)}
              busy={operacaoEmAndamento}
            />
          ) : <AuthForm onSubmit={autenticar} busy={operacaoEmAndamento} />}
          <div className="security-note">
            <span className="security-icon">⌑</span>
            <p><strong>{usuario ? "Conta protegida" : "Entre para contribuir"}</strong><br />
              {usuario
                ? "Suas alterações são autenticadas e salvas no banco de dados."
                : "Cadastre-se para adicionar, editar e remover jogos do catálogo."}
            </p>
          </div>
        </aside>
      </section>

      <footer className="footer">
        <span>CATÁLOGO DE JOGOS <span className="footer-muted">· DESENVOLVIMENTO WEB</span></span>
        <span>
          API REST <span className="footer-dot">{apiOnline ? "●" : "○"}</span>{" "}
          {apiOnline ? "CONECTADA" : "INDISPONÍVEL"}
        </span>
      </footer>
    </main>
  );
}
