import type { RowDataPacket } from "mysql2";
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
      const [events] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM event WHERE id = ?",
        [registration.event_id],
      );

      if (!events.length) {
        throw new Error("Événement non trouvé");
      }

      // Insérer l'inscription
      const [result] = await connection.query<Result>(
        "INSERT INTO user_event (firstName, lastName, email, event_id) VALUES (?, ?, ?, ?)",
        [
          registration.firstName,
          registration.lastName,
          registration.email,
          registration.event_id,
        ],
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new EventRegistrationRepository();
