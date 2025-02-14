import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type EventRegistration = {
  firstName: string;
  lastName: string;
  email: string;
  event_id: number;
};

class EventRegistrationRepository {
  async create(registration: EventRegistration) {
    const connection = await databaseClient.getConnection();

    try {
      await connection.beginTransaction();

      // Vérifier si l'événement existe
      const [eventExists] = await connection.query(
        "SELECT id FROM event WHERE id = ?",
        [registration.event_id],
      );

      if (!eventExists) {
        throw new Error("Event not found");
      }

      // Création de l'utilisateur
      const [userResult] = await connection.query<Result>(
        "INSERT INTO user (firstName, lastName, email) VALUES (?, ?, ?)",
        [registration.firstName, registration.lastName, registration.email],
      );

      // Création de l'inscription
      await connection.query<Result>(
        "INSERT INTO user_event (user_id, event_id) VALUES (?, ?)",
        [userResult.insertId, registration.event_id],
      );

      await connection.commit();
      return userResult.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

export default new EventRegistrationRepository();
