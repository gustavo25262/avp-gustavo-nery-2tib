import jwt from "jsonwebtoken";
import { obterJwtSecret } from "../config/env.js";

export function autenticar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ mensagem: "Token Bearer ausente" });
  }

  const secret = obterJwtSecret();
  try {
    req.user = jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ mensagem: "Token inválido ou expirado." });
    }
    return next(error);
  }

  next();
}
