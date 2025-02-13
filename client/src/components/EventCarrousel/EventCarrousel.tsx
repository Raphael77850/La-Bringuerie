import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

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
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {events.map((event) => (
        <Card key={event.id} sx={{ maxWidth: 300, margin: 1, gap: 1 }}>
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
            <Button variant="contained" color="primary">
              S'inscrire
            </Button>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
}
