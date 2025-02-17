import type { RequestHandler } from "express";
import eventRepository from "./eventRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { image, title, description, date } = req.body;

    if (!image || !title || !description || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const insertId = await eventRepository.create({
      image,
      title,
      description,
      date,
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
