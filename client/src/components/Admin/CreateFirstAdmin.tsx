import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import api from "../../config/axiosConfig";

interface CreateFirstAdminProps {
  onAdminCreated: () => void;
}

export default function CreateFirstAdmin({
  onAdminCreated,
}: CreateFirstAdminProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Tous les champs sont requis" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/admin/bootstrap", { email, password });
      setMessage({ type: "success", text: "Compte admin créé avec succès !" });

      // Nettoyer le formulaire
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Notifier le parent que l'admin a été créé
      setTimeout(() => {
        onAdminCreated();
      }, 2000);
    } catch (error: unknown) {
      console.error("Erreur lors de la création de l'admin:", error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Erreur lors de la création du compte admin";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Créer le premier compte administrateur
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
          align="center"
        >
          Ce formulaire permet de créer le premier compte admin sur Railway.
          <br />
          <strong>⚠️ À utiliser une seule fois puis supprimer.</strong>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email administrateur"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minimum 8 caractères"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer le compte admin"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
