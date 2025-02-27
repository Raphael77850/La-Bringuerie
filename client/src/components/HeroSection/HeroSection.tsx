import "../../App.css";
import { Box, Typography } from "@mui/material";
import videoSrc from "../../assets/images/Soiree.mp4";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "70vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src={videoSrc} type="video/mp4" />
        Ton navigateur ne supporte pas la balise vidéo.
      </video>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          Découvrez nos événements et inscrivez-vous !
        </Typography>
      </Box>
    </Box>
  );
}
