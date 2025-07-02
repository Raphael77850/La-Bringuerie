import "../../App.css";
import { Box, Typography, useMediaQuery } from "@mui/material";
import videoSrc from "../../assets/vidéos/Video_Bringuerie-Compressed.mp4";
export default function HeroSection() {
  const isDesktop1024 = useMediaQuery("(min-width:1024px)");
  const isDesktop1440 = useMediaQuery("(min-width:1440px)");

  const getVideoHeight = () => {
    if (isDesktop1440) return "100vh";
    if (isDesktop1024) return "85vh";
    return { xs: "70vh", md: "70vh" };
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: getVideoHeight(),
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
          objectFit: isDesktop1024 || isDesktop1440 ? "contain" : "cover",
          objectPosition: "center center",
          transform: "none",
          backgroundColor: "#000",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
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
            paddingBottom: isDesktop1440 ? "3rem" : "2rem",
          }}
        >
          <Typography
            variant={isDesktop1024 ? "h5" : "h6"}
            sx={{
              fontFamily: "Francois One, serif",
              cursor: "pointer",
              color: "#FF5722",
              lineHeight: 1,
              fontSize: isDesktop1440 ? "1.5rem" : undefined,
            }}
            onClick={() => {
              const element = document.getElementById("newsletterForm");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Pour découvrir nos évènements, inscrivez-vous !
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
