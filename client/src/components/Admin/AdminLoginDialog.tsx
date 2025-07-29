import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type React from "react";
import type { Message } from "../../types/admin";

interface AdminLoginDialogProps {
  open: boolean;
  credentials: { email: string; password: string };
  setCredentials: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  onLogin: () => void;
  message: Message | null;
}

export default function AdminLoginDialog({
  open,
  credentials,
  setCredentials,
  onLogin,
  message,
}: AdminLoginDialogProps) {
  return (
    <Dialog open={open} onClose={() => {}}>
      <DialogTitle>Connexion Administrateur</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={credentials.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <TextField
          margin="dense"
          label="Mot de passe"
          type="password"
          fullWidth
          value={credentials.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogin} color="primary">
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
