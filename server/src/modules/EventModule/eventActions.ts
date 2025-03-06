import type { RequestHandler } from "express";
import eventRepository from "./eventRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, event_id } = req.body;

    if (!firstName || !lastName || !email || !event_id) {
      res.status(400).json({ message: "Tous les champs sont requis" });
      return; // Ajoutez un return après chaque réponse
    }

    try {
      const insertId = await eventRepository.createUserEvent({
        firstName,
        lastName,
        email,
        event_id,
      });

      res.status(201).json({
        message: "Inscription réussie !",
        id: insertId,
      });
    } catch (error: unknown) {
      // Vérifier si c'est une erreur de duplication
      interface DuplicationError extends Error {
        code: string;
      }

      if (
        error instanceof Error &&
        (error as DuplicationError).code === "ER_DUP_ENTRY"
      ) {
        res.status(409).json({
          message: "Vous êtes déjà inscrit à cet événement.",
        });
        return; // Ajoutez un return ici
      }

      // Pour les autres erreurs, renvoyer une erreur 500
      console.error("Erreur d'inscription:", error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de l'inscription.",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getEvents: RequestHandler = async (req, res, next) => {
  try {
    const events = await eventRepository.getEvents();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const event = await eventRepository.getEventById(id);

    if (!event) {
      res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export default { add, getEvents, getEventById };
