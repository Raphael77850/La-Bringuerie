import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    consent: false,
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setMessage({
        type: "error",
        text: "Veuillez accepter de recevoir des news la Bringuerie",
      });
      setOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3310/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Inscription réussie!" });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          consent: false,
        });
      } else {
        setMessage({ type: "error", text: "Une erreur est survenue" });
      }
      setOpen(true);
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue" });
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          margin: "auto",
          mt: 4,
          mb: 1,
          p: 2,
          border: 2,
          borderRadius: 2,
          borderColor: "primary.main",
        }}
      >
        <Typography variant="h6" gutterBottom textAlign="center">
          Deviens un Bringueur !
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consent}
              onChange={handleChange}
              name="consent"
            />
          }
          label="J'accepte de recevoir des news de la Bringuerie"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          S'inscrire
        </Button>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={message?.type || "info"}
          sx={{ width: "100%" }}
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </>
  );
}
