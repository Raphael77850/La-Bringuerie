import type { RequestHandler } from "express";
import eventRegistrationRepository from "./eventRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, event_id } = req.body;

    if (!firstName || !lastName || !email || !event_id) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const insertId = await eventRegistrationRepository.create({
      firstName,
      lastName,
      email,
      event_id,
    });

    res.status(201).json({
      message: "Inscription réussie",
      userId: insertId,
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    res.status(500).json({
      message: "Une erreur est survenue lors de l'inscription",
      error:
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
    });
  }
};

export default { add };
