import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="notfound-main">
    <section className="notfound-section">
      <h2>404 - Page non trouvée</h2>
      <p>Oups, la page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/">Retour à l'accueil</Link>
    </section>
  </main>
);

export default NotFoundPage;
