import "../../App.css";
import { Box } from "@mui/material";
import videoSrc from "../../assets/videos/Video_Bringuerie.mp4";

export default function HeroSection() {
  // Modifie ici la hauteur visible de la vidéo (ex: '70vh', '60vh', '80vh', etc.)
  const videoHeight = "70vh";

  return (
    <>
      <Box
        className="hero-video-bg"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            objectPosition: "center center",
            backgroundColor: "#000",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        {/* Masque dégradé pour transition douce */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `calc(100vh - ${videoHeight})`,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #181818 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>
      {/* Espace réservé pour la HeroSection visible (pour éviter que le contenu ne soit caché sous le header) */}
      <div style={{ height: videoHeight, width: "100%" }} />
    </>
  );
}
