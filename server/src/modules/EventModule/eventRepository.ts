import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type Event = {
  id?: number;
  image: string;
  title: string;
  description: string;
  date: string;
};

type UserEvent = {
  firstName: string;
  lastName: string;
  email: string;
  event_id: number;
};

class EventRepository {
  async createEvent(event: Event) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO event (image, title, description, date) VALUES (?, ?, ?, ?)",
      [event.image, event.title, event.description, event.date],
    );
    return result.insertId;
  }

  async createUserEvent(userEvent: UserEvent) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user_event (firstName, lastName, email, event_id) VALUES (?, ?, ?, ?)",
      [
        userEvent.firstName,
        userEvent.lastName,
        userEvent.email,
        userEvent.event_id,
      ],
    );
    return result.insertId;
  }

  async update(event: Event) {
    await databaseClient.query<Result>(
      "UPDATE event SET image = ?, title = ?, description = ?, date = ? WHERE id = ?",
      [event.image, event.title, event.description, event.date, event.id],
    );
  }

  async delete(id: number) {
    await databaseClient.query<Result>("DELETE FROM event WHERE id = ?", [id]);
  }
}

export default new EventRepository();
