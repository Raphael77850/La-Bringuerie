// to make the file a module and avoid the TypeScript error
import type { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // Add your custom properties here, for example:
      //
      // user?: { ... }
      /* ************************************************************************* */
      admin?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Type helper pour les requêtes authentifiées
 * Utilise le namespace global Express pour bénéficier de l'augmentation de module
 */
export interface AuthenticatedRequest extends Request {
  admin: {
    id: number;
    email: string;
    role: string;
  };
}
