import "../../App.css";
import { Box, Typography } from "@mui/material";
import videoSrc from "../../../src/assets/images/Video_Bringuerie.mp4";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "100vh", md: "70vh" },
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 45%",
        }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            paddingBottom: "2rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Francois One, serif", cursor: "pointer" }}
            onClick={() => {
              const element = document.getElementById("newsletterForm");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Découvrez nos événements et inscrivez-vous ! ⬇️
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
