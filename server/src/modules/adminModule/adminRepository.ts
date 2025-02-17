import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

class AdminRepository {
  // Récupérer tous les emails de la newsletter
  async getNewsletterEmails() {
    const [rows] = await databaseClient.query<RowDataPacket[]>(
      "SELECT firstName, lastName, email FROM newsletter",
    );
    return rows;
  }

  // Récupérer les emails des inscrits aux événements
  async getEventEmails(eventId?: number) {
    const query = eventId
      ? "SELECT firstName, lastName, email, event_id FROM user_event WHERE event_id = ?"
      : "SELECT firstName, lastName, email, event_id FROM user_event";

    const [rows] = await databaseClient.query<RowDataPacket[]>(
      query,
      eventId ? [eventId] : [],
    );
    return rows;
  }
}

export default new AdminRepository();
