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
      const {
        title,
        description,
        date,
        endTime,
        location,
        max_participants,
      } = req.body;

      if (!title || !description || !date || !endTime) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR',
            message: "Les champs title, description, date et endTime sont requis"
          }
        });
        return;
      }

      // Gérer l'upload d'image
      let image_url = null;
      if (req.file) {
        // Chemin relatif pour l'URL
        image_url = `/uploads/events/${req.file.filename}`;
      }

      const insertId = await eventRepository.createEvent({
        image_url: image_url || '', // Utiliser string vide au lieu de null
        title,
        description,
        date,
        endTime,
        location,
        max_participants: max_participants ? Number(max_participants) : undefined, // undefined au lieu de null
        id: 0,
      });

      res.status(201).json({ 
        success: true,
        id: insertId,
        imagePath: image_url,
        message: "Événement ajouté avec succès" 
      });
    } catch (err) {
      console.error('❌ Error adding event:', err);
      res.status(500).json({ 
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: "Erreur lors de l'ajout de l'événement"
        }
      });
    }
  },

    // Mettre à jour un événement
  updateEvent: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id; // ID depuis l'URL
      const {
        title,
        description,
        date,
        endTime,
        location,
        max_participants,
        image_url, // URL existante si pas de nouveau fichier
      } = req.body;

      if (!eventId || !title || !description || !date || !endTime) {
        res.status(400).json({
          success: false,
          error: { 
            code: 'VALIDATION_ERROR',
            message: "Les champs id, title, description, date et endTime sont requis"
          }
        });
        return;
      }

      // Gérer l'upload d'image (nouveau fichier ou garder l'existant)
      let finalImageUrl = image_url || ''; // Garder l'existant par défaut
      
      if (req.file) {
        // Nouveau fichier uploadé
        finalImageUrl = `/uploads/events/${req.file.filename}`;
      }

      await eventRepository.update({
        id: Number(eventId),
        image_url: finalImageUrl,
        title,
        description,
        date,
        endTime,
        location,
        max_participants: max_participants ? Number(max_participants) : undefined,
      });

      res.json({ 
        success: true,
        imagePath: finalImageUrl,
        message: "Événement mis à jour avec succès" 
      });
    } catch (err) {
      console.error('❌ Error updating event:', err);
      res.status(500).json({ 
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: "Erreur lors de la mise à jour de l'événement"
        }
      });
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

  // Supprimer un inscrit à un événement
  deleteEventUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "ID requis" });
        return;
      }
      await eventRepository.deleteUserEvent(Number(id));
      res.status(200).json({ message: "Inscrit supprimé avec succès" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'inscrit" });
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
