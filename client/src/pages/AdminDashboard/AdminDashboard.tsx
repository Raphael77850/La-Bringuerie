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
import { EventList } from "../../components/Admin/EventList";
import { UserTable } from "../../components/Admin/UserTable";
import api from "../../config/axiosConfig";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import type { Event } from "../../types/admin";

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
    fetchData,
  } = useAdminDashboard(token);

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
      if (response.status === 201) {
        setEvents([
          ...events,
          {
            id: response.data.id,
            title: newEvent.title,
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
  const handleDeleteEvent = (id: number) => {
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
      fetchData();
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
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            value={credentials.password}
            onChange={(e) =>
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
        <EventList
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter un événement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Image"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
          <TextField
            margin="dense"
            label="Titre"
            type="text"
            fullWidth
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              margin="dense"
              label="Heure de début"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Heure de fin"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddEvent} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog édition événement */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifier un événement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Image"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) setSelectedUpdateFile(file);
            }}
          />
          <TextField
            margin="dense"
            label="Titre"
            type="text"
            fullWidth
            value={currentEvent?.title || ""}
            onChange={(e) =>
              setCurrentEvent((ev) =>
                ev ? { ...ev, title: e.target.value } : ev,
              )
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentEvent?.description || ""}
            onChange={(e) =>
              setCurrentEvent((ev) =>
                ev ? { ...ev, description: e.target.value } : ev,
              )
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentEvent?.date || ""}
            onChange={(e) =>
              setCurrentEvent((ev) =>
                ev ? { ...ev, date: e.target.value } : ev,
              )
            }
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              margin="dense"
              label="Heure de début"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={currentEvent?.startTime || ""}
              onChange={(e) =>
                setCurrentEvent((ev) =>
                  ev ? { ...ev, startTime: e.target.value } : ev,
                )
              }
            />
            <TextField
              margin="dense"
              label="Heure de fin"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={currentEvent?.endTime || ""}
              onChange={(e) =>
                setCurrentEvent((ev) =>
                  ev ? { ...ev, endTime: e.target.value } : ev,
                )
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleUpdateEvent} color="primary">
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      <UserTable title="Abonnés à la newsletter" users={newsletterUsers} />
      <UserTable
        title="Inscrits aux événements"
        users={eventUsers}
        showEventName
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
