import "../../styles/newsletter.css";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Veuillez entrer une adresse email." });
      setOpen(true);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/newsletter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (response.status === 201) {
        setMessage({ type: "success", text: "Inscription réussie !" });
        setEmail("");
      } else if (response.status === 409) {
        setMessage({
          type: "error",
          text: "Cet email est déjà inscrit à la newsletter.",
        });
      } else {
        setMessage({ type: "error", text: "Une erreur est survenue." });
      }
      setOpen(true);
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue." });
      setOpen(true);
    }
  };

  return (
    <section className="section-block newsletter-section">
      <h2 className="newsletter-title">Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Adresse email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          S'inscrire
        </Button>
      </form>
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
    </section>
  );
}
