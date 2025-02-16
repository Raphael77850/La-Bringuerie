import type { Request, RequestHandler, Response } from "express";
import adminRepository from "./adminsRepository";

const adminActions = {
  // Récupérer les emails de la newsletter
  getNewsletterEmails: async (req: Request, res: Response) => {
    try {
      const emails = await adminRepository.getNewsletterEmails();
      res.json(emails);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emails newsletter:",
        error,
      );
      res.status(500).json({ error: "Erreur serveur interne" });
    }
  },

  // Récupérer les emails des événements
  getEventEmails: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id
        ? Number.parseInt(req.params.id, 10)
        : undefined;
      const emails = await adminRepository.getEventEmails(eventId);
      res.json(emails);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emails événement:",
        error,
      );
      res.status(500).json({ error: "Erreur serveur interne" });
    }
  },
};

export default adminActions;
