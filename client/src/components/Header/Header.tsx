import "../../App.css";
import { AppBar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink } from "react-router-dom";
import LogoTitle from "../../assets/images/LogoTitle.png";
import instagramLogo from "../../assets/images/instagramLogo.svg";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "white !important",
    boxShadow: "none !important",
    padding: "1rem",
  },
  container: {
    display: "flex !important",
    justifyContent: "space-between !important",
    alignItems: "center !important",
    width: "100% !important",
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

  return (
    <AppBar position="static" className={classes.appBar}>
      <Box className={classes.container}>
        <RouterLink
          to="https://www.instagram.com/labringueriebordeaux/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instagramLogo} alt="Instagram" style={{ height: "2rem" }} />
        </RouterLink>

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
