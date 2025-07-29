import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useAdminDashboardLogic } from "../../hooks/useAdminDashboardLogic";
import { useEventForm } from "../../hooks/useEventForm";
import AddEventDialog from "../components/Admin/AddEventDialog";
import AdminEventList from "../components/Admin/AdminEventList";
import AdminLoginDialog from "../components/Admin/AdminLoginDialog";
import AdminUserList from "../components/Admin/AdminUserList";
import EditEventDialog from "../components/Admin/EditEventDialog";
import api from "../config/axiosConfig";
import { extractTimeFromDate, formatDateForDisplay } from "../utils/dateUtils";

const AdminDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  const {
    setSelectedFile,
    currentEvent,
    setCurrentEvent,
    newEvent,
    setNewEvent,
    handleAddEvent,
    handleOpenEditDialog,
    handleUpdateEvent,
  } = useEventForm({
    token,
    setEvents,
    events,
    setMessage,
    fetchEvents,
  });

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

  if (!token) {
    return (
      <AdminLoginDialog
        open={loginOpen}
        credentials={credentials}
        setCredentials={setCredentials}
        onLogin={handleLogin}
        message={message}
      />
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
          onEdit={(event) => handleOpenEditDialog(event, extractTimeFromDate)}
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
        title="Inscrits aux événements"
        users={eventUsers}
        onDelete={deleteEventUser}
      />
      <AdminUserList
        title="Abonnés à la newsletter"
        users={newsletterUsers}
        onDelete={deleteNewsletterUser}
        onlyEmail={true}
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
