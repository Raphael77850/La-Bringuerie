export interface Event {
  id: number;
  title: string;
  date: string;
  endTime?: string;
  image?: string;
  description?: string;
  startTime?: string;
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
