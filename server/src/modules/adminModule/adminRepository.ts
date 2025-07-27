import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

class AdminRepository {
  // Récupérer tous les emails de la newsletter
  async getNewsletterEmails() {
    const [rows] = await databaseClient.query<RowDataPacket[]>(
      "SELECT email FROM newsletter",
    );
    return rows;
  }

  // Récupérer les emails des inscrits aux événements
  async getEventEmails(eventId?: number) {
    let query =
      "SELECT u.email, u.firstName, u.lastName, e.title as eventName FROM user_event u JOIN event e ON u.event_id = e.id";
    const params = [];

    if (eventId) {
      query += " WHERE u.event_id = ?";
      params.push(eventId);
    }

    const [rows] = await databaseClient.query<RowDataPacket[]>(query, params);
    return rows;
  }
}

export default new AdminRepository();
