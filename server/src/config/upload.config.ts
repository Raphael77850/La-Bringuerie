/**
 * Configuration pour l'upload de fichiers
 * Centralisée selon le principe OCP (Open/Closed Principle)
 */

export const UploadConfig = {
  // Taille maximale des fichiers
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

  // Types MIME autorisés
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,

  // Extensions autorisées
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"] as const,

  // Chemin de stockage des uploads
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./public/uploads/events",

  // Messages d'erreur
  ERRORS: {
    INVALID_FILE_TYPE: "Seules les images JPEG, PNG et WebP sont autorisées",
    FILE_TOO_LARGE: "Le fichier est trop volumineux (max 5MB)",
    UPLOAD_FAILED: "Échec de l'upload du fichier",
  },
} as const;
