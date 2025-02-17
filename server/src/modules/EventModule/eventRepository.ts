import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type Event = {
  id?: number;
  image: string;
  title: string;
  description: string;
  date: string;
};

class EventRepository {
  async create(event: Event) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO event (image, title, description, date) VALUES (?, ?, ?, ?)",
      [event.image, event.title, event.description, event.date],
    );

    return result.insertId;
  }

  async update(event: Event) {
    await databaseClient.query<Result>(
      "UPDATE event SET image = ?, title = ?, description = ?, date = ? WHERE id = ?",
      [event.image, event.title, event.description, event.date, event.id],
    );
  }
}

export default new EventRepository();
