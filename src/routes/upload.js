import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();
const uploadsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error("Tipo de arquivo invalido. Use JPEG, PNG ou WebP");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  }
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Envia uma imagem de capa
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [imagem]
 *             properties:
 *               imagem: { type: string, format: binary }
 *     responses:
 *       201: { description: Imagem salva }
 *       400: { description: Tipo ou tamanho invalido }
 */
router.post("/", upload.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensagem: "Envie uma imagem no campo imagem" });
  }

  res.status(201).json({
    mensagem: "Imagem enviada com sucesso",
    arquivo: req.file.filename,
    caminho: `/uploads/${req.file.filename}`
  });
});

export default router;
