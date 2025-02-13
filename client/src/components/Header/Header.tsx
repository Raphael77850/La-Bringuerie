import { AppBar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import letterB from "../../assets/images/letter-b.png";

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
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <img
        src={letterB}
        alt="La Bringuerie"
        style={{ height: "24px", marginRight: "16px" }}
      />
      <Button
        href="/about"
        className={classes.button}
        style={{ textTransform: "none" }}
      >
        À propos
      </Button>
    </AppBar>
  );
}
