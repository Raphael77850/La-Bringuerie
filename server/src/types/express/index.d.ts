// to make the file a module and avoid the TypeScript error
export type {};

declare global {
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // Add your custom properties here, for example:
      //
      // user?: { ... }
      /* ************************************************************************* */
    }
  }
}

declare namespace Express {
  interface Request {
    admin?: {
      id: number;
      email: string;
      role: string;
    };
  }
}
