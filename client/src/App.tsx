import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <HeroSection />
      <section className="events">
        <h2 style={{ margin: "1rem 0", color: "#FF5722", textAlign: "center" }}>
          Prochains Évènements
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <a
            href="https://shotgun.live/fr/venues/la-bringuerie"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#FF5722",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
            }}
          >
            Réserver sur Shotgun
          </a>
        </div>
      </section>
      <Intro />
      <section
        className="contact"
        style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
      >
        <div
          style={{
            background: "#FFF3E0",
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            minWidth: "280px",
          }}
        >
          <h3 style={{ color: "#FF5722", marginBottom: "1rem" }}>Contact</h3>
          <p
            style={{ color: "#FF5722", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            labringueriebordeaux@gmail.com
          </p>
        </div>
      </section>
      <Footer />
    </ThemeProvider>
  );
}
