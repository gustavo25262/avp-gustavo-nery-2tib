import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "segredo-de-desenvolvimento";

export function autenticar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ mensagem: "Token Bearer ausente" });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ mensagem: "Token invalido ou expirado" });
  }
}
