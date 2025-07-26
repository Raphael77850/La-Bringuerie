import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface FormEventProps {
  eventId: number;
  open: boolean;
  onClose: () => void;
}

export default function FormEvent({ eventId, open, onClose }: FormEventProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user_event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            event_id: eventId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || "Inscription réussie",
        });
        setTimeout(() => {
          onClose();
          setFormData({ firstName: "", lastName: "", email: "" });
          setMessage(null);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Erreur lors de l'inscription",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Erreur lors de l'inscription",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>S'inscrire</DialogTitle>
      <DialogContent>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose} sx={{ backgroundColor: "#DD1C1A" }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary">
              S'inscrire
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
