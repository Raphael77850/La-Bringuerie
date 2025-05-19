import { useEffect, useState } from "react";
import api from "../config/axiosConfig";
import type { Event, Message, User } from "../types/admin";

export function useAdminDashboard(token: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [newsletterUsers, setNewsletterUsers] = useState<User[]>([]);
  const [eventUsers, setEventUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line
  }, [token]);

  const fetchData = () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    api
      .get("/admin/newsletter/emails", config)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNewsletterUsers(res.data);
        } else {
          setMessage({
            type: "error",
            text: "Format de réponse invalide pour les emails newsletter",
          });
        }
      })
      .catch(() => setMessage({ type: "error", text: "Erreur newsletter" }));
    api
      .get("/admin/events/emails", config)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEventUsers(res.data);
        } else {
          setMessage({
            type: "error",
            text: "Format de réponse invalide pour les emails événements",
          });
        }
      })
      .catch(() => setMessage({ type: "error", text: "Erreur inscrits" }));
    api
      .get("/events")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setMessage({
            type: "error",
            text: "Format de réponse invalide pour les événements",
          });
        }
      })
      .catch(() => setMessage({ type: "error", text: "Erreur événements" }));
  };

  return {
    events,
    setEvents,
    newsletterUsers,
    eventUsers,
    message,
    setMessage,
    fetchData,
  };
}
