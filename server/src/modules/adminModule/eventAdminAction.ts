import fs from "node:fs";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import type { RequestHandler } from "express";
import eventRepository from "../EventModule/eventRepository";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

const addEvent: RequestHandler = async (req, res, next) => {
  try {
    const fileReq = req as FileRequest;
    const { title, description, date, endTime } = fileReq.body;

    if (!title || !description || !date || !endTime) {
      res.status(400).json({ message: "Tous les champs textuels sont requis" });
      return;
    }

    let imagePath = "";

    if (fileReq.file) {
      imagePath = `/uploads/events/${fileReq.file.filename}`;
    } else {
      res.status(400).json({ message: "L'image est requise" });
      return;
    }

    const insertId = await eventRepository.createEvent({
      image: imagePath,
      title,
      description,
      date,
      endTime,
      id: 0,
    });

    res.status(201).json({
      message: "Événement ajouté avec succès",
      id: insertId,
      imagePath,
    });
  } catch (err) {
    console.error("Error in addEvent:", err);
    next(err);
  }
};

const updateEvent: RequestHandler = async (req, res, next) => {
  try {
    const fileReq = req as FileRequest;
    const { id, title, description, date, endTime } = fileReq.body;
    let { image } = fileReq.body;

    if (!id || !title || !description || !date || !endTime) {
      res.status(400).json({ message: "Tous les champs textuels sont requis" });
      return;
    }

    const existingEvent = await eventRepository.getEventById(Number(id));

    if (!existingEvent) {
      res.status(404).json({ message: "Événement non trouvé" });
      return;
    }

    if (fileReq.file) {
      image = `/uploads/events/${fileReq.file.filename}`;

      const oldImagePath = existingEvent.image;
      if (oldImagePath.startsWith("/uploads/")) {
        const fullPath = path.join(__dirname, "../../../public", oldImagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    } else if (!image) {
      image = existingEvent.image;
      if (!image.startsWith("/uploads/")) {
        res.status(400).json({ message: "Chemin de l'image invalide" });
        return;
      }
    }

    await eventRepository.update({
      id: Number(id),
      image,
      title,
      description,
      date,
      endTime,
    });

    res.status(200).json({
      message: "Événement mis à jour avec succès",
      imagePath: image,
    });
  } catch (err) {
    console.error("Error in updateEvent:", err);
    next(err);
  }
};

export default { addEvent, updateEvent };
