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
      <div className="app-root">
        <Header />
        <HeroSection />
        <main className="main-content">
          {/* Section événements (sera stylée plus tard) */}
          <section className="events-section">
            <div className="events-photo-block">
              {/* Image temporaire, à remplacer plus tard */}
              <img
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Visuel événement"
              />
            </div>
            <div className="events-list-block">
              <h2>Prochains Événements</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li>
                  <strong>07 juin</strong> — Kev Junior avec BD Vic
                  <button
                    type="button"
                    style={{
                      marginLeft: 16,
                      background: "#FF5722",
                      color: "#FFF3E0",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </li>
                <li>
                  <strong>08 juin</strong> — Monsieur Dollar
                  <button
                    type="button"
                    style={{
                      marginLeft: 16,
                      background: "#FF5722",
                      color: "#FFF3E0",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </li>
                <li>
                  <strong>10 juin</strong> — Chips et Rafale 3D
                  <button
                    type="button"
                    style={{
                      marginLeft: 16,
                      background: "#FF5722",
                      color: "#FFF3E0",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </li>
                <li>
                  <strong>13 juin</strong> — La Batte avec Collabirie
                  <button
                    type="button"
                    style={{
                      marginLeft: 16,
                      background: "#FF5722",
                      color: "#FFF3E0",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </li>
                <li>
                  <strong>14 juin</strong> — Tation 1
                  <button
                    type="button"
                    style={{
                      marginLeft: 16,
                      background: "#FF5722",
                      color: "#FFF3E0",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.3rem 1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Réserver
                  </button>
                </li>
              </ul>
            </div>
          </section>
          {/* Section intro (sera stylée plus tard) */}
          <section className="intro-section">
            <div className="intro-text-block">
              <Intro />
            </div>
            <div className="intro-photo-block">
              {/* Image temporaire, à remplacer plus tard */}
              <img
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="presentation"
              />
            </div>
          </section>
          {/* Section Instagram (sera stylée plus tard) */}
          <section className="instagram-section">
            <h2>Instagram</h2>
            <div className="instagram-photos-row">
              <img
                className="instagram-photo"
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Instagram 1"
              />
              <img
                className="instagram-photo"
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Instagram 2"
              />
              <img
                className="instagram-photo"
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Instagram 3"
              />
              <img
                className="instagram-photo"
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Instagram 4"
              />
              <img
                className="instagram-photo"
                src="/src/assets/images/fidel-unsplash.jpg"
                alt="Instagram 5"
              />
            </div>
          </section>
          {/* Section contact (sera stylée plus tard) */}
          <section className="contact-section">
            <h3>Contact</h3>
            <p>labringueriebordeaux@gmail.com</p>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
