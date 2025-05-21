import { Box, Button, Typography } from "@mui/material";
import type { Event } from "../../types/admin";

interface Props {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
  extractTime: (date: string) => string;
}

export function EventList({
  events,
  onEdit,
  onDelete,
  formatDate,
  extractTime,
}: Props) {
  return (
    <Box sx={{ marginTop: 2 }}>
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
            marginBottom: 2,
            borderRadius: 1,
            backgroundColor: "#f5f5f5",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.date)} {extractTime(event.date)}
              {event.endTime && ` - ${extractTime(event.endTime)}`}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ marginRight: 1 }}
              onClick={() => onEdit(event)}
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => onDelete(event.id)}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
