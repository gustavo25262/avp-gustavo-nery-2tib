import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/index.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL precisa estar configurada.");
}

const connection = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: connection.hostname,
  port: Number(connection.port || 3306),
  user: decodeURIComponent(connection.username),
  password: decodeURIComponent(connection.password),
  database: decodeURIComponent(connection.pathname.slice(1)),
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

export default prisma;
