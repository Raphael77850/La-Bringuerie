import "../../styles/heroSection.css";
import { Box } from "@mui/material";
import videoSrc from "../../assets/videos/Video_Bringuerie.mp4";

export default function HeroSection() {
  // Modifie ici la hauteur visible de la vidéo pour desktop et mobile

  return (
    <>
      <Box className="hero-video-bg">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={videoSrc} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        {/* Masque dégradé pour transition douce */}
        <div className="hero-gradient-mask" />
      </Box>
      {/* Espace réservé pour la HeroSection visible (pour éviter que le contenu ne soit caché sous le header) */}
      <div className="hero-spacer" />
    </>
  );
}
