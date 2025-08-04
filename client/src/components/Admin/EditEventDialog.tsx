import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type React from "react";
import type { Event } from "../../types/admin";
import "../../styles/editEventDialog.css";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  currentEvent: Event | null;
  setCurrentEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  selectedUpdateFile?: File | null;
  setSelectedUpdateFile?: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function EditEventDialog({
  open,
  onClose,
  onUpdate,
  currentEvent,
  setCurrentEvent,
  selectedUpdateFile,
  setSelectedUpdateFile,
}: EditEventDialogProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (setSelectedUpdateFile) {
      setSelectedUpdateFile(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier un événement</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Image"
          type="file"
          fullWidth
          inputProps={{ accept: "image/*" }}
          onChange={handleFileChange}
        />
        {currentEvent?.image_url && !selectedUpdateFile && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <img
              src={currentEvent.image_url}
              alt={currentEvent.title}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <p style={{ fontSize: "0.875rem", color: "#666" }}>
              Image actuelle (sélectionnez un fichier pour la remplacer)
            </p>
          </Box>
        )}
        {selectedUpdateFile && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <p style={{ fontSize: "0.875rem", color: "#1976d2" }}>
              Nouvelle image sélectionnée: {selectedUpdateFile.name}
            </p>
          </Box>
        )}
        <TextField
          margin="dense"
          label="Titre"
          type="text"
          fullWidth
          value={currentEvent?.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentEvent((ev) => (ev ? { ...ev, date: e.target.value } : ev))
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentEvent((ev) =>
                ev ? { ...ev, endTime: e.target.value } : ev,
              )
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={onUpdate} color="primary">
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
}
