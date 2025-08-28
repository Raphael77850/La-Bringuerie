import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useAdminDashboardLogic } from "../../hooks/useAdminDashboardLogic";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useEventForm } from "../../hooks/useEventForm";
import AddEventDialog from "../components/Admin/AddEventDialog";
import AdminEventList from "../components/Admin/AdminEventList";
import AdminLoginDialog from "../components/Admin/AdminLoginDialog";
import AdminUserList from "../components/Admin/AdminUserList";
import EditEventDialog from "../components/Admin/EditEventDialog";
import api from "../config/axiosConfig";
import { extractTimeFromDate, formatDateForDisplay } from "../utils/dateUtils";

const AdminDashboard = () => {
  const { accessToken: token, setTokens } = useAuthToken();
  const [loginOpen, setLoginOpen] = useState(!token);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

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
    selectedUpdateFile,
    setSelectedUpdateFile,
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

  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  // Auth
  const handleLogin = () => {
    api
      .post("/auth/login", credentials)
      .then((response) => {
        const data = response.data as {
          token: string;
          refreshToken?: string;
        };
        // On attend que le backend renvoie aussi le refreshToken
        setTokens(data.token, data.refreshToken || null);
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
      <Box className="admin-section" sx={{ marginBottom: "4rem" }}>
        <Typography variant="h4" sx={{ fontFamily: "'Francois One', serif" }}>
          Tableau de bord Administrateur
        </Typography>
        <Typography variant="h5" sx={{ fontFamily: "'Francois One', serif" }}>
          Gérer les événements
        </Typography>
        <AdminEventList
          events={events}
          onEdit={(event) => {
            handleOpenEditDialog(event, extractTimeFromDate);
            setEditOpen(true);
          }}
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
        selectedUpdateFile={selectedUpdateFile}
        setSelectedUpdateFile={setSelectedUpdateFile}
      />

      <Box className="admin-section">
        <AdminUserList
          title="Inscrits aux événements"
          users={eventUsers}
          onDelete={deleteEventUser}
          showEventName={true}
        />
      </Box>
      <Box className="admin-section">
        <AdminUserList
          title="Abonnés à la newsletter"
          users={newsletterUsers}
          onDelete={deleteNewsletterUser}
          onlyEmail={true}
        />
      </Box>

      <Snackbar
        open={!!message || sessionExpired}
        autoHideDuration={4000}
        onClose={() => {
          setMessage(null);
          setSessionExpired(false);
        }}
      >
        <Alert
          onClose={() => {
            setMessage(null);
            setSessionExpired(false);
          }}
          severity={sessionExpired ? "warning" : message?.type}
        >
          {sessionExpired
            ? "Votre session a expiré, veuillez vous reconnecter."
            : message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
