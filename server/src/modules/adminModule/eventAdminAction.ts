import type { RequestHandler } from "express";
import eventRepository from "../eventModule/eventRepository";

export interface Event {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  endTime: string;
}

const addEvent: RequestHandler = async (req, res, next) => {
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
    next(err);
  }
};

const updateEvent: RequestHandler = async (req, res, next) => {
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
    next(err);
  }
};

export default { addEvent, updateEvent };
