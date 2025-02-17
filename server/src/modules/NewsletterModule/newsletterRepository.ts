import type { ResultSetHeader, RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

type Newsletter = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
};

class NewsletterRepository {
  async create(newsletter: Newsletter) {
    const [result] = await databaseClient.query<ResultSetHeader>(
      "INSERT INTO newsletter (firstName, lastName, email) VALUES (?, ?, ?)",
      [newsletter.firstName, newsletter.lastName, newsletter.email],
    );

    return result.insertId;
  }

  async getAll() {
    const [rows] = await databaseClient.query<RowDataPacket[]>(
      "SELECT * FROM newsletter",
    );
    return rows;
  }

  async delete(id: number) {
    await databaseClient.query<ResultSetHeader>(
      "DELETE FROM newsletter WHERE id = ?",
      [id],
    );
  }
}

export default new NewsletterRepository();
