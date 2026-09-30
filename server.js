import "dotenv/config";
import app from "./app.js";
import{listarJogos} from "./src/controllers/jogosController.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get("/jogos",listarJogos);
app.get("/jogos",buscarJogos);
app.get("/jogos",deletarJogos);
app.get("/jogos",editarJogos);
app.get("/jogos",editarJogos);

