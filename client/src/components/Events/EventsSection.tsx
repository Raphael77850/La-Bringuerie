import "../../styles/events.css";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import type { Event } from "../../types/admin";
import {
  extractTimeFromDate,
  formatDateForDisplay,
} from "../../utils/dateUtils";
import FormEvent from "./FormEvent";

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    api.get<Event[]>("/events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  const handleOpenForm = (eventId: number) => {
    setSelectedEventId(eventId);
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEventId(null);
  };

  return (
    <section className="events-section section-block">
      <div className="events-list-block">
        <h2>Prochains Évènements</h2>
        <div className="events-horizontal-scroll">
          {events.map((event) => (
            <div key={event.id} className="event-card-container">
              <div className="event-card">
                {event.image_url && (
                  <img
                    className="event-card-image"
                    src={
                      event.image_url.startsWith("/uploads/")
                        ? `${import.meta.env.VITE_API_URL || window.location.origin}${event.image_url}`
                        : event.image_url.startsWith("http")
                          ? event.image_url
                          : `/src/assets/images/${event.image_url}`
                    }
                    alt={event.title}
                    onError={(e) => {
                      // Image placeholder en base64 pour éviter les requêtes
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+SW1hZ2UgaW5kaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K";
                      // Éviter la boucle infinie en supprimant l'event handler
                      e.currentTarget.onerror = null;
                    }}
                  />
                )}
                <div className="event-card-content">
                  <Typography variant="h5" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {event.description}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {formatDateForDisplay(event.date)}{" "}
                    {extractTimeFromDate(event.date)}
                    {event.endTime
                      ? ` - ${extractTimeFromDate(event.endTime)}`
                      : ""}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenForm(event.id)}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="events-photo-block">
        <img src="/aleksandr.jpg" alt="Fiesta" className="events-photo-image" />
      </div>
      {selectedEventId !== null && (
        <FormEvent
          eventId={selectedEventId}
          open={openForm}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
