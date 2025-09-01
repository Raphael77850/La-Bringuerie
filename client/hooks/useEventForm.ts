import { useState } from "react";
import api from "../src/config/axiosConfig";
import type { Event, Message } from "../src/types/admin";
import { combineDateTime } from "../src/utils/dateUtils";

export function useEventForm({
  token,
  setEvents,
  events,
  setMessage,
  fetchEvents,
}: {
  token: string | null;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  events: Event[];
  setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
  fetchEvents: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUpdateFile, setSelectedUpdateFile] = useState<File | null>(
    null,
  );
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    image_url: "",
    location: "",
    max_participants: null,
  });

  const handleAddEvent = async () => {
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.startTime ||
      !selectedFile
    ) {
      setMessage({ type: "error", text: "Tous les champs sont obligatoires" });
      return;
    }

    const formattedStartDateTime = combineDateTime(
      newEvent.date,
      newEvent.startTime ?? "",
    );

    let formattedEndDateTime = newEvent.endTime
      ? combineDateTime(newEvent.date, newEvent.endTime)
      : formattedStartDateTime;

    // Si l'heure de fin est antérieure à l'heure de début, ajouter un jour
    const startDate = new Date(formattedStartDateTime);
    const endDate = new Date(formattedEndDateTime);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
      formattedEndDateTime = endDate.toISOString().slice(0, 19);
    }
    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description || "");
    formData.append("date", formattedStartDateTime);
    formData.append("endTime", formattedEndDateTime);
    formData.append("image", selectedFile);
    if (newEvent.location) {
      formData.append("location", newEvent.location);
    }
    if (newEvent.max_participants) {
      formData.append("max_participants", String(newEvent.max_participants));
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await api.post<{ id: number; imagePath: string }>(
        "/admin/events",
        formData,
        config,
      );
      if (response.status === 201 && response.data.id) {
        setEvents([
          ...events,
          {
            id: response.data.id,
            title: newEvent.title,
            description: newEvent.description,
            date: formattedStartDateTime,
            endTime: formattedEndDateTime,
            image_url: response.data.imagePath,
            location: newEvent.location,
            max_participants: newEvent.max_participants,
          },
        ]);
        setOpen(false);
        setNewEvent({
          id: 0,
          title: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          image_url: "",
          location: "",
          max_participants: null,
        });
        setSelectedFile(null);
        setMessage({ type: "success", text: "Événement ajouté avec succès" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de l'ajout de l'événement",
      });
    }
  };

  const handleOpenEditDialog = (
    event: Event,
    extractTimeFromDate: (date: string) => string,
  ) => {
    if (!event || !event.date || typeof event.date !== "string") {
      setMessage({
        type: "error",
        text: "Donnée événement invalide pour l'édition",
      });
      return;
    }

    // Réinitialiser le fichier sélectionné
    setSelectedUpdateFile(null);

    // Correction : gérer le format date avec ou sans 'T'
    let date = event.date;
    let startTime = "";
    let endTime = "";
    if (date.includes("T")) {
      date = date.split("T")[0];
      startTime = extractTimeFromDate(event.date);
      endTime = event.endTime ? extractTimeFromDate(event.endTime) : "";
    } else {
      startTime = event.startTime || "";
      endTime = event.endTime || "";
    }
    setCurrentEvent({
      ...event,
      date,
      startTime,
      endTime,
    });
    setEditOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (
      !currentEvent?.title ||
      !currentEvent.description ||
      !currentEvent.date ||
      !currentEvent.startTime
    ) {
      setMessage({
        type: "error",
        text: "Tous les champs textuels sont obligatoires",
      });
      return;
    }
    if (!currentEvent.startTime) {
      setMessage({ type: "error", text: "L'heure de début est obligatoire" });
      return;
    }

    const formattedStartDateTime = combineDateTime(
      currentEvent.date,
      currentEvent.startTime,
    );

    let formattedEndDateTime =
      currentEvent.endTime && currentEvent.endTime !== ""
        ? combineDateTime(currentEvent.date, currentEvent.endTime)
        : formattedStartDateTime;

    // Si l'heure de fin est antérieure à l'heure de début, ajouter un jour
    const startDate = new Date(formattedStartDateTime);
    const endDate = new Date(formattedEndDateTime);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
      formattedEndDateTime = endDate.toISOString().slice(0, 19);
    }
    const formData = new FormData();
    formData.append("id", String(currentEvent.id));
    formData.append("title", currentEvent.title);
    formData.append("description", currentEvent.description ?? "");
    formData.append("date", formattedStartDateTime);
    formData.append("endTime", formattedEndDateTime);
    if (currentEvent.location) {
      formData.append("location", currentEvent.location);
    }
    if (currentEvent.max_participants) {
      formData.append(
        "max_participants",
        String(currentEvent.max_participants),
      );
    }
    if (selectedUpdateFile) {
      formData.append("image", selectedUpdateFile);
    } else if (currentEvent.image_url) {
      formData.append("image_url", currentEvent.image_url);
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await api.put<{ imagePath?: string }>(`/admin/events/${currentEvent.id}`, formData, config);

      // Recharger les événements pour avoir les données à jour
      fetchEvents();
      setEditOpen(false);
      setSelectedUpdateFile(null);
      setMessage({ type: "success", text: "Évènement mis à jour avec succès" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour de l'évènement",
      });
    }
  };

  return {
    open,
    setOpen,
    editOpen,
    setEditOpen,
    selectedFile,
    setSelectedFile,
    selectedUpdateFile,
    setSelectedUpdateFile,
    currentEvent,
    setCurrentEvent,
    newEvent,
    setNewEvent,
    handleAddEvent,
    handleOpenEditDialog,
    handleUpdateEvent,
  };
}
