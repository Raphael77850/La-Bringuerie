import type { RequestHandler } from "express";
import newsletterRepository from "../NewsletterModule/newsletterRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const insertId = await newsletterRepository.create({
      firstName,
      lastName,
      email,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { add };
