import "../../App.css";
import { Box, useMediaQuery } from "@mui/material";
import videoSrc from "../../assets/videos/Video_Bringuerie-Compressed.mp4";
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
        />
      </Box>
    </Box>
  );
}
