export interface Event {
  id: number;
  title: string;
  date: string;
  endTime?: string;
  image_url?: string;
  description?: string;
  startTime?: string;
  location?: string;
  max_participants?: number | null;
  image?: string; // Pour compatibilité
}

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  eventName?: string;
}

export interface Message {
  type: "success" | "error";
  text: string;
}
