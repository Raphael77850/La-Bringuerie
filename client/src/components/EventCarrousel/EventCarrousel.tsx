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
  image: string;
}

interface EventCarouselProps {
  events: Event[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
    centerMoode: false,
    adaptiveHeight: true,
  };

  return (
    <div
      style={{ width: "100%", overflow: "hidden", margin: "2", padding: "2" }}
    >
      <Slider {...settings}>
        {events.map((event) => (
          <Card key={event.id} sx={{ maxWidth: 300, gap: 1 }}>
            <CardMedia
              component="img"
              height="140"
              image={event.image}
              alt={event.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.date}
              </Typography>
              <Button
                variant="contained"
                color="primary"
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
