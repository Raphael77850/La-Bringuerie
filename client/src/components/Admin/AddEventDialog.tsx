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
import "../../styles/addEventDialog.css";

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  newEvent: Event;
  setNewEvent: React.Dispatch<React.SetStateAction<Event>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function AddEventDialog({
  open,
  onClose,
  onAdd,
  newEvent,
  setNewEvent,
  setSelectedFile,
}: AddEventDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un événement</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Image"
          type="file"
          fullWidth
          inputProps={{ accept: "image/*" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewEvent({ ...newEvent, title: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={newEvent.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewEvent({ ...newEvent, endTime: e.target.value })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={onAdd} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
