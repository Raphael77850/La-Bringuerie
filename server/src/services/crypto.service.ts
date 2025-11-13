/**
 * Service Crypto
 * Responsabilité : Hachage et vérification de mots de passe
 * Principe SRP + DIP (Dependency Inversion Principle)
 */

import bcrypt from "bcrypt";

/**
 * Nombre de rounds pour bcrypt (12 = bon équilibre sécurité/performance)
 */
const SALT_ROUNDS = 12;

/**
 * Règles de validation pour un mot de passe fort
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide la force d'un mot de passe
 */
export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || password.length < 12) {
    errors.push("Le mot de passe doit contenir au moins 12 caractères");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Hash un mot de passe avec bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Vérifie un mot de passe contre son hash
 */
export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Génère un hash sécurisé (générique, pas spécifique aux mots de passe)
 */
export const generateHash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, SALT_ROUNDS);
};

export default {
  validatePassword,
  hashPassword,
  verifyPassword,
  generateHash,
};
