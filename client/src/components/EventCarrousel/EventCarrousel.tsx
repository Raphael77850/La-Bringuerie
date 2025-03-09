import "../../App.css";
import Slider from "react-slick";
import FormEvent from "../FormEvent/FormEvent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  endTime?: string;
  image: string;
}

interface EventCarouselProps {
  events: Event[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Fonction pour formater une date pour l'affichage
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Fonction robuste pour extraire l'heure d'une date ISO
  const extractTimeFromDate = (dateStr: string): string => {
    if (!dateStr) return "";

    try {
      const date = new Date(dateStr);

      // Vérifier si la date est valide
      if (Number.isNaN(date.getTime())) {
        console.error("Date invalide:", dateStr);
        return "";
      }

      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (error) {
      console.error("Erreur lors de l'extraction de l'heure:", error, dateStr);
      return "";
    }
  };

  // Formater l'heure de l'événement de manière plus robuste
  const formatEventTime = (event: Event): string => {
    let startTime: string;
    try {
      startTime = extractTimeFromDate(event.date);
    } catch (e) {
      console.error("Erreur avec l'heure de début:", e);
      startTime = "";
    }

    if (!startTime) return "";

    if (event.endTime) {
      let endTime: string;
      try {
        endTime = extractTimeFromDate(event.endTime);
        if (endTime) {
          return `${startTime} - ${endTime}`;
        }
      } catch (e) {
        console.error("Erreur avec l'heure de fin:", e);
      }
    }

    return startTime;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    centerMode: false,
    adaptiveHeight: true,
  };

  return (
    <div
      style={{ width: "100%", overflow: "hidden", margin: "2", padding: "2" }}
    >
      <Slider {...settings}>
        {events.map((event) => (
          <Card key={event.id} sx={{ maxWidth: 300, gap: 2 }}>
            <CardMedia
              component="img"
              height="400"
              image={
                event.image.startsWith("/uploads")
                  ? `http://localhost:3310${event.image}`
                  : event.image
              }
              alt={event.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontFamily: "Francois One, serif" }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Francois One, serif" }}
              >
                {event.description}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Francois One, serif", my: 1 }}
              >
                {formatDateForDisplay(event.date)} • {formatEventTime(event)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontFamily: "Francois One, serif", mt: 1 }}
                onClick={() => setSelectedEventId(event.id)}
              >
                S'inscrire
              </Button>
            </CardContent>
          </Card>
        ))}
      </Slider>
      {selectedEventId && (
        <FormEvent
          eventId={selectedEventId}
          open={selectedEventId !== null}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
}
