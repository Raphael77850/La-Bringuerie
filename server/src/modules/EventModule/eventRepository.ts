import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type EventRegistration = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  event_id: number;
  image?: string;
  title?: string;
  description?: string;
  date?: string;
};

class EventRegistrationRepository {
  createEvent(arg0: {
    image: string;
    title: string;
    description: string;
    date: string;
  }) {
    throw new Error("Method not implemented.");
  }
  async create(registration: EventRegistration) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user_event (firstName, lastName, email, event_id) VALUES (?, ?, ?, ?)",
      [
        registration.firstName,
        registration.lastName,
        registration.email,
        registration.event_id,
      ],
    );

    return result.insertId;
  }

  async update(event: EventRegistration) {
    await databaseClient.query<Result>(
      "UPDATE event SET image = ?, title= ?, description = ?, date = ? WHERE id = ?",
      [event.image, event.title, event.description, event.date, event.id],
    );
  }
}

export default new EventRegistrationRepository();
