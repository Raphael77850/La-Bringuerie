import { useCallback, useEffect, useState } from "react";
import api from "../src/config/axiosConfig";
import type { Event, User } from "../src/types/admin";

export function useAdminDashboardLogic(token: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [newsletterUsers, setNewsletterUsers] = useState<User[]>([]);
  const [eventUsers, setEventUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Récupérer les événements
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Event[]>("/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des événements",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Récupérer les utilisateurs newsletter
  const fetchNewsletterUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<User[]>("/admin/newsletter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsletterUsers(res.data);
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des abonnés newsletter",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Récupérer les inscrits aux événements
  const fetchEventUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<User[]>("/admin/event-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventUsers(res.data);
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des inscrits événements",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Suppression d'un abonné newsletter
  const deleteNewsletterUser = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`/admin/newsletter/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsletterUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage({ type: "success", text: "Abonné supprimé avec succès" });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la suppression" });
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un inscrit événement
  const deleteEventUser = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`/admin/event-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventUsers((prev) => prev.filter((u) => u.id !== id));
      setMessage({ type: "success", text: "Inscrit supprimé avec succès" });
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression de l'inscription à l'événement",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchNewsletterUsers();
      fetchEventUsers();
    }
  }, [token, fetchEvents, fetchNewsletterUsers, fetchEventUsers]);

  return {
    events,
    setEvents,
    newsletterUsers,
    setNewsletterUsers,
    eventUsers,
    setEventUsers,
    message,
    setMessage,
    loading,
    fetchEvents,
    fetchNewsletterUsers,
    fetchEventUsers,
    deleteNewsletterUser,
    deleteEventUser,
  };
}
