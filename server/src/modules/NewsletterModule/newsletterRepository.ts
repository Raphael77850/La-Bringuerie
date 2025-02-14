import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type Newsletter = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
};

class NewsletterRepository {
  async create(newsletter: Newsletter) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO newsletter (firstName, lastName, email) VALUES (?, ?, ?)",
      [newsletter.firstName, newsletter.lastName, newsletter.email],
    );

    return result.insertId;
  }
}

export default new NewsletterRepository();
