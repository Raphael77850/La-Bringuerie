import "../../styles/footer.css";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import facebook from "../../assets/images/facebook.png";
import instagramLogo from "../../assets/images/instagramLogo.svg";

export const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 1,
        backgroundColor: "white",
        color: "#FF5722",
      }}
    >
      <Typography variant="body2" sx={{ fontFamily: "'Francois One', serif" }}>
        © La Bringuerie
      </Typography>
      <RouterLink
        to="https://www.instagram.com/labringueriebordeaux/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={instagramLogo} alt="Instagram" className="social-icon" />
      </RouterLink>
      <RouterLink
        to="https://www.facebook.com/labringueriebordeaux/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={facebook}
          alt="Facebook"
          className="social-icon social-icon-facebook"
        />
      </RouterLink>
    </Box>
  );
};
