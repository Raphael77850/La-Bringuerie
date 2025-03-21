import fs from "node:fs";
import path from "node:path";
import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2";
import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type Event = {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  endTime: string;
};

type UserEvent = {
  firstName: string;
  lastName: string;
  email: string;
  event_id: number;
};

class EventRepository {
  async createEvent(event: {
    image: string;
    title: string;
    description: string;
    date: string;
    endTime: string;
    id?: number;
  }): Promise<number> {
    try {
      const [result] = await databaseClient.query<ResultSetHeader>(
        "INSERT INTO event (image, title, description, date, endTime) VALUES (?, ?, ?, ?, ?)",
        [
          event.image,
          event.title,
          event.description,
          event.date,
          event.endTime,
        ],
      );

      return result.insertId;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async createUserEvent(userEvent: UserEvent) {
    const [rows] = await databaseClient.query<Result[]>(
      "SELECT id FROM event WHERE id = ?",
      [userEvent.event_id],
    );

    if (!rows || rows.length === 0) {
      throw new Error(`Event with id ${userEvent.event_id} does not exist`);
    }

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

  async getEvents() {
    const [rows] = await databaseClient.query<RowDataPacket[]>(
      "SELECT * FROM event",
    );
    return rows;
  }

  async getEventById(id: number) {
    const [rows] = await databaseClient.query<RowDataPacket[]>(
      "SELECT * FROM event WHERE id = ?",
      [id],
    );

    return rows.length > 0 ? rows[0] : null;
  }

  async update(event: Event) {
    try {
      await databaseClient.query<Result>(
        "UPDATE event SET image = ?, title = ?, description = ?, date = ?, endTime = ? WHERE id = ?",
        [
          event.image,
          event.title,
          event.description,
          event.date,
          event.endTime,
          event.id,
        ],
      );
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Ajoutez une gestion d'erreur appropriée à la méthode delete
  async delete(id: number): Promise<void> {
    try {
      // D'abord supprimer tous les enregistrements liés dans user_event
      await databaseClient.query("DELETE FROM user_event WHERE event_id = ?", [
        id,
      ]);

      // Ensuite supprimer l'événement
      await databaseClient.query("DELETE FROM event WHERE id = ?", [id]);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}

export default new EventRepository();
