import type { Request, RequestHandler, Response } from "express";
import eventRepository from "../EventModule/eventRepository";
import adminRepository from "./adminRepository";

const adminActions = {
  // Récupérer les emails de la newsletter
  getNewsletterEmails: async (req: Request, res: Response) => {
    try {
      const emails = await adminRepository.getNewsletterEmails();
      res.json(emails);
    } catch (error) {
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
      res.status(500).json({ error: "Erreur serveur interne" });
    }
  },

  // Ajouter un événement
  addEvent: async (req: Request, res: Response) => {
    try {
      const { image, title, description, date, endTime } = req.body;

      if (!image || !title || !description || !date || !endTime) {
        res.status(400).json({ message: "Tous les champs sont requis" });
        return;
      }

      const insertId = await eventRepository.createEvent({
        image,
        title,
        description,
        date,
        endTime,
        id: 0,
      });

      res
        .status(201)
        .json({ message: "Événement ajouté avec succès", id: insertId });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de l'événement" });
    }
  },

  // Mettre à jour un événement
  updateEvent: async (req: Request, res: Response) => {
    try {
      const { id, image, title, description, date, endTime } = req.body;

      if (!id || !image || !title || !description || !date || !endTime) {
        res.status(400).json({ message: "Tous les champs sont requis" });
        return;
      }

      await eventRepository.update({
        id,
        image,
        title,
        description,
        date,
        endTime,
      });

      res.status(200).json({ message: "Événement mis à jour avec succès" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de l'événement" });
    }
  },

  // Supprimer un événement
  deleteEvent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "ID requis" });
        return;
      }
      await eventRepository.delete(Number(id));
      res.status(200).json({ message: "Événement supprimé avec succès" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'événement" });
    }
  },

  // Récupérer tous les événements
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const events = await eventRepository.getEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({
        error: "Erreur serveur lors de la récupération des événements",
      });
    }
  },
};

export default adminActions;
