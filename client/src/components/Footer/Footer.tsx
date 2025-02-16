import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import instagramLogo from "../../assets/images/instagramLogo.svg";

export const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        backgroundColor: "white",
        color: "#FF5722",
      }}
    >
      <Typography variant="body2">© La Bringuerie</Typography>
      <RouterLink
        to="https://www.instagram.com/labringueriebordeaux/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={instagramLogo} alt="Instagram" style={{ height: "2rem" }} />
      </RouterLink>
    </Box>
  );
};
