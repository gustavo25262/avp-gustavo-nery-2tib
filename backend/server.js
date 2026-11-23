import "dotenv/config";
import app from "./app.js";
import prisma from "./src/config/prisma.js";
import { validarConfiguracao } from "./src/config/env.js";

const port = process.env.PORT || 3000;

validarConfiguracao();

try {
  await prisma.$connect();
  const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  const encerrar = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
} catch (error) {
  console.error("Não foi possível iniciar a API ou conectar ao banco:", error);
  await prisma.$disconnect();
  process.exitCode = 1;
}

