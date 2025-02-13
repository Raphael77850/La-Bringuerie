import { AppBar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink } from "react-router-dom";
import letterB from "../../assets/images/IconeBM.png";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "white !important",
    boxShadow: "none !important",
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
      <RouterLink to="/">
        <img src={letterB} alt="La Bringuerie" style={{ height: "2rem" }} />
      </RouterLink>
      <RouterLink
        to="/about"
        style={{ color: "orange", textDecoration: "none" }}
      >
        À propos
      </RouterLink>
    </AppBar>
  );
}
