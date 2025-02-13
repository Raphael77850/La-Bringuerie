import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 4,
        mb: 1,
        p: 2,
        border: 1,
        borderRadius: 2,
        borderColor: "primary.main",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Inscrivez-vous à notre newsletter
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
        label="J'accepte de recevoir des newsletters"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        S'inscrire
      </Button>
    </Box>
  );
}
