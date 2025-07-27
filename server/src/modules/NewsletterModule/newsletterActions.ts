import type { RequestHandler } from "express";
import newsletterRepository from "../NewsletterModule/newsletterRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    try {
      const insertId = await newsletterRepository.create({
        email,
      });

      res.status(201).json({ insertId });
    } catch (err) {
      if (
        err instanceof Error &&
        "code" in err &&
        err.code === "ER_DUP_ENTRY"
      ) {
        res
          .status(409)
          .json({ error: "Cet email est déjà inscrit à la newsletter." });
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

export default { add };
