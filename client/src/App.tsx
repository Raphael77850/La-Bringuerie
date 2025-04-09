import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import EventCarrousel from "./components/EventCarrousel/EventCarrousel";
import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import Intro from "./components/Introduction/Intro";
import NewsletterForm from "./components/NewsletterForm/NewsletterForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5722",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          border: "2px solid #FF5722",
          "&:hover": {
            backgroundColor: "#FF5722",
          },
        },
      },
    },
  },
});

export interface Event {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios.get("/api/events").then((response) => {
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error(
          "Erreur lors de la récupération des événements",
          response.data,
        );
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <HeroSection />
      <section className="events">
        <h2 style={{ margin: "1rem 0", color: "#FF5722", textAlign: "center" }}>
          Prochains Évènements
        </h2>
        <EventCarrousel events={events} />
      </section>
      <Intro />
      <section className="newsletter">
        <NewsletterForm />
      </section>
      <Footer />
    </ThemeProvider>
  );
}
