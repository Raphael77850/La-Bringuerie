import "../../App.css";
import { Box, useMediaQuery } from "@mui/material";
import videoSrc from "../../assets/videos/Video_Bringuerie.mp4";

export default function HeroSection() {
  // Modifie ici la hauteur visible de la vidéo pour desktop et mobile
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const videoHeight = isDesktop ? "90vh" : "70vh"; // 55vh sur desktop, 70vh sur mobile/tablette

  return (
    <>
      <Box
        className="hero-video-bg"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
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
            width: "100%",
            height: "100%",
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
