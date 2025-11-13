/**
 * Service de validation
 * Responsabilité : Validation et nettoyage des données utilisateur
 * Principe SRP + DIP (Dependency Inversion Principle)
 */

/**
 * Nettoie une entrée utilisateur pour éviter les XSS
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  return (
    input
      .trim()
      // Supprime les balises script
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Supprime javascript:
      .replace(/javascript:/gi, "")
      // Supprime les gestionnaires d'événements
      .replace(/on\w+\s*=/gi, "")
      // Limite la longueur
      .slice(0, 1000)
  );
};

/**
 * Valide un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valide un numéro de téléphone français
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

/**
 * Valide une date
 */
export const isValidDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !Number.isNaN(parsedDate.getTime());
};

/**
 * Vérifie si une date est dans le futur
 */
export const isFutureDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return parsedDate > new Date();
};

/**
 * Nettoie et valide un objet de données
 */
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
): T => {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized;
};

/**
 * Valide les données d'un événement (logique métier réutilisable)
 */
export interface EventValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEventData = (data: {
  title?: string;
  description?: string;
  date?: string;
  endTime?: string;
  maxParticipants?: number;
}): EventValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Le titre doit contenir au moins 3 caractères");
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push("La description doit contenir au moins 10 caractères");
  }

  if (!data.date || !isValidDate(data.date)) {
    errors.push("Date de début invalide");
  }

  if (!data.endTime || !isValidDate(data.endTime)) {
    errors.push("Date de fin invalide");
  }

  if (
    data.date &&
    data.endTime &&
    isValidDate(data.date) &&
    isValidDate(data.endTime)
  ) {
    const startDate = new Date(data.date);
    const endDate = new Date(data.endTime);

    if (endDate <= startDate) {
      errors.push("La date de fin doit être postérieure à la date de début");
    }
  }

  if (data.maxParticipants !== undefined) {
    const max = Number(data.maxParticipants);
    if (Number.isNaN(max) || max < 1 || max > 10000) {
      errors.push("Le nombre de participants doit être entre 1 et 10000");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  sanitizeInput,
  sanitizeObject,
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidDate,
  isFutureDate,
  validateEventData,
};
