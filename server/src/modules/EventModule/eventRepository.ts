import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type EventRegistration = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  event_id: number;
};

class EventRegistrationRepository {
  async create(registration: EventRegistration) {
    // Création de l'utilisateur
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstName, lastName, email) VALUES (?, ?, ?)",
      [registration.firstName, registration.lastName, registration.email],
    );

    const userId = result.insertId;

    // Création de la relation user_event
    await databaseClient.query<Result>(
      "INSERT INTO user_event (user_id, event_id) VALUES (?, ?)",
      [userId, registration.event_id],
    );

    return userId;
  }
}

export default new EventRegistrationRepository();
