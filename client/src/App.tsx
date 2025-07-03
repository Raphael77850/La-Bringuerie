import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import InstagramCarousel from "./components/Instagram/InstagramCarousel";
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
      <div className="app-root">
        <Header />
        <HeroSection />
        <main className="main-content">
          {/* Section événements (sera stylée plus tard) */}
          <section className="events-section section-block">
            <div className="events-list-block">
              <h2>Prochains Événements</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>
                  <strong>07 juin</strong> — Kev Junior avec BD Vic
                  <a
                    href="https://shotgun.live/fr/events/la-bringuerie-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 16,
                      background: "#FFF3E0",
                      color: "#FF5722",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Réserver
                  </a>
                </li>
                <li>
                  <strong>08 juin</strong> — Monsieur Dollar
                  <a
                    href="https://shotgun.live/fr/events/la-bringuerie-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 16,
                      background: "#FFF3E0",
                      color: "#FF5722",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Réserver
                  </a>
                </li>
                <li>
                  <strong>10 juin</strong> — Chips et Rafale 3D
                  <a
                    href="https://shotgun.live/fr/events/la-bringuerie-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 16,
                      background: "#FFF3E0",
                      color: "#FF5722",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Réserver
                  </a>
                </li>
                <li>
                  <strong>13 juin</strong> — La Batte avec Collabirie
                  <a
                    href="https://shotgun.live/fr/events/la-bringuerie-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 16,
                      background: "#FFF3E0",
                      color: "#FF5722",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Réserver
                  </a>
                </li>
                <li>
                  <strong>14 juin</strong> — Tation 1
                  <a
                    href="https://shotgun.live/fr/events/la-bringuerie-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 16,
                      background: "#FFF3E0",
                      color: "#FF5722",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Réserver
                  </a>
                </li>
              </ul>
            </div>
            <div className="events-photo-block">
              <img
                src="/src/assets/images/aleksandr.jpg"
                alt="Logo La Bringuerie"
              />
            </div>
          </section>
          {/* Section intro (sera stylée plus tard) */}
          <section className="intro-section section-block">
            <div className="intro-photo-block">
              <img
                src="/src/assets/images/levi-g.jpg"
                alt="Logo La Bringuerie"
              />
            </div>
            <div className="intro-text-block">
              <Intro />
            </div>
          </section>
          {/* Section Instagram (sera stylée plus tard) */}
          <section className="instagram-section section-block">
            <h2>Instagram</h2>
            <InstagramCarousel />
          </section>
          {/* Section contact (sera stylée plus tard) */}
          <section className="contact-section section-block">
            <h3>Contact</h3>
            <p>labringueriebordeaux@gmail.com</p>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
