import "../../App.css";
import { AppBar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import LogoTitle from "../../assets/images/LogoTitle.png";
import facebook from "../../assets/images/facebook.png";
import instagramLogo from "../../assets/images/instagramLogo.svg";

const useStyles = makeStyles({
  appBar: {
    padding: ".5rem 1rem 0rem 1rem",
  },
  container: {
    display: "flex !important",
    justifyContent: "space-between !important",
    alignItems: "center !important",
    width: "100% !important",
  },
  socialLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  link: {
    color: "#FF5722 !important",
    fontSize: "1rem !important",
    fontFamily: "'Francois One', serif !important",
    fontWeight: "400 !important",
    textDecoration: "none !important",
    "&:hover": {
      textDecoration: "underline !important",
    },
  },
});

export default function Header() {
  const classes = useStyles();
  const location = useLocation();

  const isAboutPage = location.pathname === "/about";

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      sx={{
        backgroundColor: isAboutPage ? "white" : "transparent",
        boxShadow: isAboutPage ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none",
        position: isAboutPage ? "fixed" : "absolute",
      }}
    >
      <Box className={classes.container}>
        <Box className={classes.socialLinks}>
          <RouterLink
            to="https://www.instagram.com/labringueriebordeaux/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={instagramLogo}
              alt="Instagram"
              style={{ height: "1.5rem" }}
            />
          </RouterLink>

          <RouterLink
            to="https://www.facebook.com/profile.php?id=61571448225787&mibextid=wwXIfr&rdid=sgWfTOUkJ5mKtoNq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="Facebook" style={{ height: "1.3rem" }} />
          </RouterLink>
        </Box>

        <RouterLink to="/">
          <img
            src={LogoTitle}
            alt="La Bringuerie"
            style={{ height: "4.5rem" }}
          />
        </RouterLink>

        <RouterLink to="/about" className={classes.link}>
          Qui ?
        </RouterLink>
      </Box>
    </AppBar>
  );
}
