import type { RequestHandler } from "express";
import newsletterRepository from "../newsletterModule/newsletterRepository";

const getAllSubscriptions: RequestHandler = async (req, res, next) => {
  try {
    const subscriptions = await newsletterRepository.getAll();
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
};

const deleteSubscription: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID requis" });
      return;
    }

    await newsletterRepository.delete(Number(id));
    res.status(200).json({ message: "Inscription supprimée avec succès" });
  } catch (err) {
    next(err);
  }
};

export default { getAllSubscriptions, deleteSubscription };
