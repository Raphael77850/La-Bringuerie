import "../../styles/footer.css";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-title">© La Bringuerie</div>
        <nav>
          <Link to="/mentions-legales">Mentions légales</Link> |{" "}
          <Link to="/politique-confidentialite">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
};
