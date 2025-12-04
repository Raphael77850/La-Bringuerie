/**
 * Middleware d'upload de fichiers
 * Responsabilité unique : Gérer l'upload d'images
 * Principe SRP (Single Responsibility Principle)
 */

import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { UploadConfig } from "../config/upload.config";

// Créer le dossier d'upload s'il n'existe pas
const uploadDir = path.resolve(process.cwd(), UploadConfig.UPLOAD_PATH);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.info(`✅ Created upload directory: ${uploadDir}`);
}

/**
 * Configuration du stockage avec noms de fichiers uniques
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique avec UUID + extension originale
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

/**
 * Filtre de validation des types de fichiers
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const extname = path.extname(file.originalname).toLowerCase();
  const isValidMimeType = (
    UploadConfig.ALLOWED_MIME_TYPES as readonly string[]
  ).includes(file.mimetype);
  const isValidExtension = (
    UploadConfig.ALLOWED_EXTENSIONS as readonly string[]
  ).includes(extname);

  if (isValidMimeType && isValidExtension) {
    console.info(`✅ File accepted: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.warn(
      `⚠️ File rejected: ${file.originalname} (${file.mimetype}, ${extname})`,
    );
    cb(new Error(UploadConfig.ERRORS.INVALID_FILE_TYPE));
  }
};

/**
 * Middleware multer configuré
 */
export const upload = multer({
  storage,
  limits: { fileSize: UploadConfig.MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
