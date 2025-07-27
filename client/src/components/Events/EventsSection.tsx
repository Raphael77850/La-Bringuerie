import "../../styles/events.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../../config/axiosConfig";
import type { Event } from "../../types/admin";
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  return (
    <section className="events-section section-block">
      <div className="events-list-block">
        <h2>Prochains Évènements</h2>
        <Slider {...settings}>
          {events.map((event) => (
            <Box key={event.id} sx={{ px: 2 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "stretch",
                  minHeight: 320,
                }}
              >
                {event.image && (
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: "100%", md: 300 }, objectFit: "cover" }}
                    image={
                      event.image.startsWith("/uploads/")
                        ? event.image
                        : `/src/assets/images/${event.image}`
                    }
                    alt={event.title}
                  />
                )}
                <CardContent sx={{ flex: 1 }}>
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
                    {new Date(event.date).toLocaleDateString()}{" "}
                    {event.startTime ? `à ${event.startTime}` : ""}
                    {event.endTime ? ` - ${event.endTime}` : ""}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenForm(event.id)}
                  >
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </div>
      <div className="events-photo-block">
        <img src="/src/assets/images/aleksandr.jpg" alt="Logo La Bringuerie" />
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
