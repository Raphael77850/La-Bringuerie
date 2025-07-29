import { Box, Button, Typography } from "@mui/material";
import type { Event } from "../../types/admin";
import "../../styles/adminEventList.css";

interface AdminEventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
  extractTime: (date: string) => string;
}

export default function AdminEventList({
  events,
  onEdit,
  onDelete,
  formatDate,
  extractTime,
}: AdminEventListProps) {
  if (!Array.isArray(events)) {
    return (
      <Box className="admin-event-list">
        <Typography color="error">
          Erreur de chargement des événements.
        </Typography>
      </Box>
    );
  }
  return (
    <Box className="admin-event-list">
      {events.length === 0 ? (
        <Typography>Aucun événement pour le moment.</Typography>
      ) : (
        <table className="admin-event-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(events) &&
              events
                .filter((e) => e && e.id !== undefined)
                .map((event) => (
                  <tr key={String(event.id)}>
                    <td>{event.title}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{extractTime(event.date)}</td>
                    <td>{event.endTime ? extractTime(event.endTime) : ""}</td>
                    <td>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => onEdit(event)}
                        sx={{ mr: 1 }}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(event.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      )}
    </Box>
  );
}
