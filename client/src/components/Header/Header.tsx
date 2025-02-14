import { AppBar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink } from "react-router-dom";
import letterB from "../../assets/images/Logo-Officiel.png";

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
    color: "orange !important",
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
        <RouterLink to="/">
          <img src={letterB} alt="La Bringuerie" style={{ height: "3rem" }} />
        </RouterLink>
        <RouterLink
          to="/about"
          style={{ color: "orange", textDecoration: "none" }}
        >
          À propos
        </RouterLink>
      </Box>
    </AppBar>
  );
}
