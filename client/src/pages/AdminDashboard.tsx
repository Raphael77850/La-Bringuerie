import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useAdminDashboardLogic } from "../../hooks/useAdminDashboardLogic";
import AddEventDialog from "../components/Admin/AddEventDialog";
import AdminEventList from "../components/Admin/AdminEventList";
import AdminUserList from "../components/Admin/AdminUserList";
import EditEventDialog from "../components/Admin/EditEventDialog";
import api from "../config/axiosConfig";
import type { Event } from "../types/admin";

const AdminDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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
    image: "",
  });

  const {
    events,
    setEvents,
    newsletterUsers,
    eventUsers,
    message,
    setMessage,
    fetchEvents,
    deleteNewsletterUser,
    deleteEventUser,
  } = useAdminDashboardLogic(token);

  // Utilitaires
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };
  const extractTimeFromDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  const combineDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    return `${date}T${time}:00`;
  };

  // Auth
  const handleLogin = () => {
    api
      .post("/login", credentials)
      .then((response) => {
        const data = response.data as { token: string };
        setToken(data.token);
        setLoginOpen(false);
        setMessage({ type: "success", text: "Connexion réussie" });
      })
      .catch(() => {
        setMessage({ type: "error", text: "Identifiants invalides" });
      });
  };

  // Ajout événement
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
    const formattedEndDateTime = newEvent.endTime
      ? combineDateTime(newEvent.date, newEvent.endTime)
      : formattedStartDateTime;

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description || "");
    formData.append("date", formattedStartDateTime);
    formData.append("endTime", formattedEndDateTime);
    formData.append("image", selectedFile);

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

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
            image: response.data.imagePath,
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
          image: "",
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

  // Suppression événement
  const handleDeleteEvent = (id: number | undefined) => {
    if (typeof id !== "number" || Number.isNaN(id)) {
      setMessage({ type: "error", text: "ID d'événement invalide" });
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      api
        .delete(`/admin/events/${id}`, config)
        .then(() => {
          setEvents(events.filter((event) => event.id !== id));
          setMessage({
            type: "success",
            text: "Événement supprimé avec succès",
          });
        })
        .catch(() => {
          setMessage({
            type: "error",
            text: "Erreur lors de la suppression de l'événement",
          });
        });
    }
  };

  // Ouverture modale édition
  const handleOpenEditDialog = (event: Event) => {
    if (
      !event ||
      !event.date ||
      typeof event.date !== "string" ||
      !event.date.includes("T")
    ) {
      setMessage({
        type: "error",
        text: "Donnée événement invalide pour l'édition",
      });
      return;
    }
    setCurrentEvent({
      ...event,
      date: event.date.split("T")[0],
      startTime: extractTimeFromDate(event.date),
      endTime: event.endTime ? extractTimeFromDate(event.endTime) : "",
    });
    setEditOpen(true);
  };

  // Modification événement
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
      setMessage({
        type: "error",
        text: "L'heure de début est obligatoire",
      });
      return;
    }
    const formattedStartDateTime = combineDateTime(
      currentEvent.date,
      currentEvent.startTime,
    );
    const formattedEndDateTime =
      currentEvent.endTime && currentEvent.endTime !== ""
        ? combineDateTime(currentEvent.date, currentEvent.endTime)
        : formattedStartDateTime;

    const formData = new FormData();
    formData.append("id", String(currentEvent.id));
    formData.append("title", currentEvent.title);
    formData.append("description", currentEvent.description ?? "");
    formData.append("date", formattedStartDateTime);
    formData.append("endTime", formattedEndDateTime);
    if (selectedUpdateFile) {
      formData.append("image", selectedUpdateFile);
    } else if (currentEvent.image) {
      formData.append("image", currentEvent.image);
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await api.put("/admin/events", formData, config);
      fetchEvents();
      setEditOpen(false);
      setSelectedUpdateFile(null);
      setMessage({ type: "success", text: "Événement mis à jour avec succès" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour de l'événement",
      });
    }
  };

  if (!token) {
    return (
      <Dialog open={loginOpen} onClose={() => {}}>
        <DialogTitle>Connexion Administrateur</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={credentials.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            value={credentials.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">
            Se connecter
          </Button>
        </DialogActions>
        {message && (
          <Alert severity={message.type} sx={{ m: 2 }}>
            {message.text}
          </Alert>
        )}
      </Dialog>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 2 }} />
      <Typography
        variant="h4"
        sx={{ marginBottom: 2, fontFamily: "'Francois One', serif" }}
      >
        Dashboard admin Bringueur
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h5"
          sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
        >
          Gérer les événements
        </Typography>
        <AdminEventList
          events={events}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteEvent}
          formatDate={formatDateForDisplay}
          extractTime={extractTimeFromDate}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginTop: 1.5 }}
        >
          Ajouter un événement
        </Button>
      </Box>

      {/* Dialog ajout événement */}
      <AddEventDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        setSelectedFile={setSelectedFile}
      />

      {/* Dialog édition événement */}
      <EditEventDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={handleUpdateEvent}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
      />

      <AdminUserList
        title="Abonnés à la newsletter"
        users={newsletterUsers}
        onDelete={deleteNewsletterUser}
      />
      <AdminUserList
        title="Inscrits aux événements"
        users={eventUsers}
        onDelete={deleteEventUser}
      />

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
      >
        <Alert onClose={() => setMessage(null)} severity={message?.type}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
