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
    const { title, description, date, endTime, location, max_participants } =
      fileReq.body;

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
      image_url: imagePath,
      title,
      description,
      date,
      endTime,
      location: location || null,
      max_participants: max_participants
        ? Number.parseInt(max_participants)
        : undefined,
    });

    res.status(201).json({
      message: "Événement ajouté avec succès",
      id: insertId,
      imagePath,
    });
  } catch (err) {
    console.error("=== ERROR IN ADD EVENT ===");
    console.error("Error details:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'événement",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

const updateEvent: RequestHandler = async (req, res, next) => {
  try {
    const fileReq = req as FileRequest;
    const {
      id,
      title,
      description,
      date,
      endTime,
      location,
      max_participants,
    } = fileReq.body;
    let { image_url } = fileReq.body;

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
      // Nouvelle image uploadée
      image_url = `/uploads/events/${fileReq.file.filename}`;

      // Supprimer l'ancienne image si elle existe
      const oldImagePath = existingEvent.image_url;
      if (oldImagePath?.startsWith("/uploads/")) {
        const fullPath = path.join(__dirname, "../../../public", oldImagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        } else {
          console.info("Old image file not found:", fullPath);
        }
      }
    } else {
      // Pas de nouvelle image, garder l'ancienne
      if (!image_url) {
        image_url = existingEvent.image_url;
      }
    }

    const updateData = {
      id: Number(id),
      image_url,
      title,
      description,
      date,
      endTime,
      location: location || null,
      max_participants: max_participants
        ? Number.parseInt(max_participants)
        : undefined,
    };

    await eventRepository.update(updateData);

    // Vérifier que la mise à jour a bien eu lieu
    const updatedEvent = await eventRepository.getEventById(Number(id));

    res.status(200).json({
      message: "Événement mis à jour avec succès",
      imagePath: image_url,
    });
  } catch (err) {
    console.error("=== ERROR IN UPDATE EVENT ===");
    console.error("Error details:", err);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'événement",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export default { addEvent, updateEvent };
