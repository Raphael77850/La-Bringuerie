import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import type { Event } from "../../types/admin";
import "../../styles/adminEventList.css";

interface AdminEventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
  extractTime: (date: string) => string;
}

const AdminEventList: React.FC<AdminEventListProps> = ({
  events,
  onEdit,
  onDelete,
  formatDate,
  extractTime,
}) => (
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
          {events.map((event) => (
            <tr key={event.id}>
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

export default AdminEventList;
