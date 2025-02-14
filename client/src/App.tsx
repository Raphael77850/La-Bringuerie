import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import EventCarrousel from "./components/EventCarrousel/EventCarrousel";
import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import Intro from "./components/Introduction/Intro";
import NewsletterForm from "./components/NewsletterForm/NewsletterForm";

// Définir un thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5722", // Couleur orange pour les boutons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF", // Texte blanc pour les boutons
          border: "2px solid #FF5722", // Contour orange
          "&:hover": {
            backgroundColor: "#FF5722", // Couleur de fond orange au survol
          },
        },
      },
    },
  },
});

import eventImage1 from "./assets/images/EventIbaia.png";
import eventImage2 from "./assets/images/Fiesta.png";
import eventImage3 from "./assets/images/fiesta2.jpg";
import eventImage4 from "./assets/images/fiesta3.jpg";
import eventImage5 from "./assets/images/fiesta4.jpg";

// tableau a suprrimer par la suite
// fecth de data pour les event depuis de la BDD
const events = [
  {
    id: 1,
    image: eventImage1,
    title: "1st Event",
    description: "@Ibaïa",
    date: "2023-20-03",
  },
  { id: 2, image: eventImage2, title: "Soon", description: "...", date: "..." },
  { id: 3, image: eventImage3, title: "Soon", description: "...", date: "..." },
  { id: 4, image: eventImage4, title: "Soon", description: "...", date: "..." },
  { id: 5, image: eventImage5, title: "Soon", description: "...", date: "..." },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <HeroSection />
      <section className="events">
        <h2 style={{ margin: "1rem 0", color: "#FF5722" }}>
          Prochains Événements
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
