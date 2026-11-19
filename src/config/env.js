import "dotenv/config";

export function validarConfiguracao() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL precisa estar configurada.");
  }
}

export function obterJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return secret;
}
