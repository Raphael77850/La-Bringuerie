import "./styles/index.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import CommandementsCarousel from "./components/Commandements/CommandementsCarousel";
import Contact from "./components/Contact/Contact";
import EventsSection from "./components/Events/EventsSection";
import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import Intro from "./components/Introduction/Intro";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5722",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className="app-root"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Header />
        <HeroSection />
        <main className="main-content" style={{ flex: 1 }}>
          {/* Ancienne section événements supprimée, remplacée par le composant */}
          <EventsSection />
          {/* Section intro (sera stylée plus tard) */}
          <section className="intro-section section-block">
            <Intro />
          </section>
          {/* Section Commandements (sera stylée plus tard) */}
          <section className="commandements-section section-block">
            <h2>Les 10 commandements du Bringueur :</h2>
            <CommandementsCarousel />
          </section>
          {/* Section contact */}
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
