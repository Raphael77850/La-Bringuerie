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
import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";

const AdminDashboard = () => {
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      date: string;
      endTime?: string;
      image?: string;
    }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [token, setToken] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    image: "",
    title: "",
    description: "",
    date: "", // Format YYYY-MM-DD pour le stockage
    startTime: "", // Format HH:mm pour le stockage
    endTime: "", // Format HH:mm pour le stockage
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Ajoutez ces états
  const [editOpen, setEditOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{
    id: number;
    image: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }>({
    id: 0,
    image: "",
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Modifiez les états pour inclure les noms et prénoms
  const [newsletterUsers, setNewsletterUsers] = useState<
    { email: string; firstName: string; lastName: string }[]
  >([]);
  const [eventUsers, setEventUsers] = useState<
    { email: string; firstName: string; lastName: string; eventName?: string }[]
  >([]);

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
    api
      .get("/admin/newsletter/emails", config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNewsletterUsers(response.data);
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
    api
      .get("/admin/events/emails", config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEventUsers(response.data);
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
    api
      .get("/events")
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

  const handleAddEvent = async () => {
    // Vérifier que les champs obligatoires sont remplis
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.startTime ||
      !selectedFile // Nouvelle variable d'état pour le fichier
    ) {
      setMessage({ type: "error", text: "Tous les champs sont obligatoires" });
      return;
    }

    // Combiner date et heure pour l'envoi
    const formattedStartDateTime = combineDateTime(
      newEvent.date,
      newEvent.startTime,
    );
    const formattedEndDateTime = newEvent.endTime
      ? combineDateTime(newEvent.date, newEvent.endTime)
      : formattedStartDateTime;

    // Utiliser FormData au lieu d'un objet JSON
    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("date", formattedStartDateTime);
    formData.append("endTime", formattedEndDateTime);
    formData.append("image", selectedFile); // Le fichier lui-même, pas une chaîne base64

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Ne pas définir Content-Type, il sera automatiquement défini avec le bon boundary
      },
    };

    try {
      const response = await api.post<{ id: number; imagePath: string }>(
        "/admin/events",
        formData,
        config,
      );

      if (response.status === 201) {
        // Ajouter le nouvel événement avec l'URL de l'image retournée par le serveur
        setEvents([
          ...events,
          {
            id: response.data.id,
            title: newEvent.title,
            date: formattedStartDateTime,
            endTime: formattedEndDateTime,
            image: response.data.imagePath, // Utiliser le chemin retourné par le serveur
          },
        ]);

        setOpen(false);
        setNewEvent({
          image: "",
          title: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
        });
        setSelectedFile(null); // Réinitialiser le fichier sélectionné
        setMessage({ type: "success", text: "Événement ajouté avec succès" });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de l'ajout de l'événement",
      });
    }
  };

  // Ajouter un état pour le fichier sélectionné
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUpdateFile, setSelectedUpdateFile] = useState<File | null>(
    null,
  );

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

  const handleDeleteEvent = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      api
        .delete(`/admin/events/${id}`, config)
        .then(() => {
          // Mettre à jour la liste des événements en supprimant l'événement
          setEvents(events.filter((event) => event.id !== id));
          setMessage({
            type: "success",
            text: "Événement supprimé avec succès",
          });
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          setMessage({
            type: "error",
            text: "Erreur lors de la suppression de l'événement",
          });
        });
    }
  };

  // Fonction pour ouvrir la boîte de dialogue de modification
  const handleOpenEditDialog = (event: {
    id: number;
    title: string;
    date: string;
  }) => {
    // Récupérer les détails complets de l'événement
    api
      .get(`/events/${event.id}`)
      .then((response) => {
        const eventData = response.data as {
          id: number;
          image: string;
          title: string;
          description: string;
          date: string;
          startTime: string;
          endTime: string;
        };
        setCurrentEvent({
          id: eventData.id,
          image: eventData.image,
          title: eventData.title,
          description: eventData.description,
          date: formatDateForInput(eventData.date),
          startTime: extractTimeFromDate(eventData.date),
          endTime: eventData.endTime
            ? extractTimeFromDate(eventData.endTime)
            : "",
        });
        setEditOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setMessage({
          type: "error",
          text: "Erreur lors de la récupération des détails de l'événement",
        });
      });
  };

  const handleUpdateEvent = async () => {
    // Vérifications
    if (
      !currentEvent.title ||
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

    try {
      const formattedStartDateTime = combineDateTime(
        currentEvent.date,
        currentEvent.startTime,
      );
      const formattedEndDateTime = currentEvent.endTime
        ? combineDateTime(currentEvent.date, currentEvent.endTime)
        : formattedStartDateTime;

      // Utiliser FormData pour l'envoi multipart
      const formData = new FormData();
      formData.append("id", String(currentEvent.id));
      formData.append("title", currentEvent.title);
      formData.append("description", currentEvent.description);
      formData.append("date", formattedStartDateTime);
      formData.append("endTime", formattedEndDateTime);

      // Si un fichier est sélectionné, l'ajouter, sinon utiliser l'image existante
      if (selectedUpdateFile) {
        formData.append("image", selectedUpdateFile);
      } else {
        formData.append("image", currentEvent.image);
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await api.put("/admin/events", formData, config);

      console.info("Update response:", response.data);
      fetchData();
      setEditOpen(false);
      setSelectedUpdateFile(null);
      setMessage({
        type: "success",
        text: "Événement mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour de l'événement",
      });
    }
  };

  // Fonction pour formater une date pour l'affichage
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Fonction pour formater une date pour l'input date (YYYY-MM-DD)
  const formatDateForInput = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Fonction pour extraire l'heure d'une date ISO
  const extractTimeFromDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Fonction pour combiner date et heure en une seule chaîne ISO
  const combineDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    return `${date}T${time}:00`;
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
    <>
      <Container maxWidth="lg">
        <Box sx={{ padding: 2 }} />
        <Typography
          variant="h4"
          sx={{ marginBottom: 2, fontFamily: "'Francois One', serif" }}
        >
          Dashboard admin Bringueur
        </Typography>
        <Box sx={{ marginBottom: 4 }}>
          <Box sx={{ marginBottom: 4 }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
            >
              Gérer les événements
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              {events.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 2,
                    marginBottom: 2, // Ajoute de l'espace entre les événements
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateForDisplay(event.date)}{" "}
                      {extractTimeFromDate(event.date)}
                      {event.endTime &&
                        ` - ${extractTimeFromDate(event.endTime)}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleOpenEditDialog(event)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ marginTop: 1.5 }}
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
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setSelectedFile(file);
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
                label="Date (JJ/MM/AAAA)"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
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

          {/* Boîte de dialogue pour modifier un événement */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
            <DialogTitle>Modifier un événement</DialogTitle>
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
                      setCurrentEvent({
                        ...currentEvent,
                        image: compressedImage,
                      });
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
              {currentEvent.image && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1">Image actuelle:</Typography>
                  <img
                    src={currentEvent.image}
                    alt="Aperçu"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </Box>
              )}
              <TextField
                margin="dense"
                label="Titre"
                type="text"
                fullWidth
                value={currentEvent.title}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={currentEvent.description}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Date (JJ/MM/AAAA)"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentEvent.date}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent, date: e.target.value })
                }
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  margin="dense"
                  label="Heure de début"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={currentEvent.startTime}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      startTime: e.target.value,
                    })
                  }
                />

                <TextField
                  margin="dense"
                  label="Heure de fin"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={currentEvent.endTime}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      endTime: e.target.value,
                    })
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

          <Box sx={{ marginBottom: 4 }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
            >
              Abonnés à la newsletter
            </Typography>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 2,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Prénom
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Nom
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {newsletterUsers.map((user) => (
                  <tr
                    key={user.email} // Utiliser une propriété unique comme l'email
                    style={{
                      background:
                        newsletterUsers.indexOf(user) % 2 === 0
                          ? "white"
                          : "#fafafa",
                    }}
                  >
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.firstName}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.lastName}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Box sx={{ marginBottom: 4 }}>
            <Typography
              variant="h5"
              sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
            >
              Inscrits aux événements
            </Typography>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 2,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Prénom
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Nom
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Événement
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventUsers.map((user) => (
                  <tr
                    key={`${user.email}-${user.eventName}`} // Combinaison unique
                    style={{
                      background:
                        eventUsers.indexOf(user) % 2 === 0
                          ? "white"
                          : "#fafafa",
                    }}
                  >
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.firstName}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.lastName}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                      {user.eventName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

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
      </Container>
    </>
  );
};

export default AdminDashboard;
