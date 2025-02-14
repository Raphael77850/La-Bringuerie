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

    res.status(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

export default { add };
