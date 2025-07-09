import "../../styles/header.css";
import { AppBar, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LogoTitle from "../../assets/images/LogoTitle.png";
import facebook from "../../assets/images/facebook.png";
import instagramLogo from "../../assets/images/instagramLogo.svg";

export default function Header() {
  return (
    <AppBar position="static">
      <Box className="container">
        <Box className="socialLinks">
          <RouterLink
            to="https://www.instagram.com/labringueriebordeaux/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={instagramLogo}
              alt="Instagram"
              className="social-icon-header"
            />
          </RouterLink>

          <RouterLink
            to="https://www.facebook.com/profile.php?id=61571448225787&mibextid=wwXIfr&rdid=sgWfTOUkJ5mKtoNq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={facebook}
              alt="Facebook"
              className="social-icon-header-facebook"
            />
          </RouterLink>
        </Box>

        <RouterLink to="/">
          <img src={LogoTitle} alt="La Bringuerie" className="logo-title" />
        </RouterLink>
      </Box>
    </AppBar>
  );
}
