import type { RequestHandler } from "express";
import eventRepository from "./eventRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, event_id } = req.body;

    if (!firstName || !lastName || !email || !event_id) {
      res.status(400).json({ message: "Tous les champs sont requis" });
      return;
    }

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
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Erreur lors de l'inscription",
    });
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

export default { add, getEvents };
