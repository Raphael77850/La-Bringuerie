import { AppBar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import letterB from "../../assets/images/IconeBM.png";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "white !important",
    boxShadow: "none !important",
  },
  title: {
    flexGrow: 1,
    color: "orange !important",
  },
  button: {
    color: "orange !important",
  },
});

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar
      position="static"
      className={classes.appBar}
      style={{
        alignItems: "center",
        margin: "1rem",
      }}
    >
      <img
        src={letterB}
        alt="La Bringuerie"
        style={{ height: "2rem", marginRight: "1rem" }}
      />
    </AppBar>
  );
}
