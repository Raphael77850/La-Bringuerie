import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [eventEmails, setEventEmails] = useState<string[]>([]);
  const [events, setEvents] = useState<
    { id: number; title: string; date: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [token, setToken] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    image: "",
    title: "",
    description: "",
    date: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Si un token existe, effectuer les requêtes
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Fetch newsletter emails
    axios
      .get("/api/admin/newsletter/emails", config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNewsletterEmails(
            response.data.map((item: { email: string }) => item.email),
          );
        } else {
          console.error("Invalid response format for newsletter emails");
          setMessage({
            type: "error",
            text: "Erreur lors de la récupération des emails newsletter",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching newsletter emails:", error);
        setMessage({
          type: "error",
          text: "Erreur lors de la récupération des emails newsletter",
        });
      });

    // Fetch event emails
    axios
      .get("/api/admin/events/emails", config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEventEmails(
            response.data.map((item: { email: string }) => item.email),
          );
        } else {
          console.error("Invalid response format for event emails");
          setMessage({
            type: "error",
            text: "Erreur lors de la récupération des emails événements",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching event emails:", error);
        setMessage({
          type: "error",
          text: "Erreur lors de la récupération des emails événements",
        });
      });

    // Fetch events
    axios
      .get("/api/events")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error("Invalid response format for events");
          setMessage({
            type: "error",
            text: "Erreur lors de la récupération des événements",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setMessage({
          type: "error",
          text: "Erreur lors de la récupération des événements",
        });
      });
  };

  const handleLogin = () => {
    axios
      .post("/api/login", credentials)
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

  const handleAddEvent = () => {
    // Vérifier que les champs obligatoires sont remplis
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.image
    ) {
      setMessage({ type: "error", text: "Tous les champs sont obligatoires" });
      return;
    }

    // Limiter la taille de l'image si nécessaire
    if (newEvent.image.length > 1024 * 1024) {
      // Plus de 1Mo
      setMessage({ type: "error", text: "L'image est trop volumineuse" });
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post<{ id: number }>("/api/admin/events", newEvent, config)
      .then((response) => {
        if (response.status === 201) {
          setEvents([...events, { ...newEvent, id: response.data.id }]);
          setOpen(false);
          setNewEvent({ image: "", title: "", description: "", date: "" });
          setMessage({ type: "success", text: "Événement ajouté avec succès" });
        } else {
          setMessage({
            type: "error",
            text: "Erreur lors de l'ajout de l'événement",
          });
        }
      })
      .catch((_error) => {
        setMessage({
          type: "error",
          text: "Erreur lors de l'ajout de l'événement",
        });
      });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Redimensionner l'image à une taille raisonnable
          const maxWidth = 800;
          const maxHeight = 800;
          let width = image.width;
          let height = image.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(image, 0, 0, width, height);

          // Compression de l'image (qualité 0.7)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        image.onerror = reject;
        image.src = readerEvent.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Dashboard admin Bringueur
      </Typography>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Emails de la newsletter
        </Typography>
        <ul>
          {newsletterEmails.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Emails des inscrits aux événements
        </Typography>
        <ul>
          {eventEmails.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Gérer les événements
        </Typography>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.title} - {event.date}
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: 1 }}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: 1 }}
              >
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Ajouter un événement
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter un événement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Image"
            type="file"
            fullWidth
            inputProps={{
              accept: "image/*",
            }}
            onChange={async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                try {
                  const compressedImage = await compressImage(file);
                  setNewEvent({ ...newEvent, image: compressedImage });
                } catch (error) {
                  console.error(
                    "Erreur lors de la compression de l'image:",
                    error,
                  );
                  setMessage({
                    type: "error",
                    text: "Erreur lors du traitement de l'image",
                  });
                }
              }
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
            type="datetime-local"
            fullWidth
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
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

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
      >
        <Alert onClose={() => setMessage(null)} severity={message?.type}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
