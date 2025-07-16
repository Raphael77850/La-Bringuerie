// LegalNotice.tsx
// Composant React pour afficher les mentions légales du site vitrine.
// Personnalisez les zones entre crochets selon votre entreprise.
import type React from "react";

const LegalNotice: React.FC = () => {
  return (
    <section>
      {/* Titre principal des mentions légales */}
      <h2>Mentions légales</h2>
      {/* Informations sur l'éditeur du site */}
      <p>
        <strong>Éditeur du site :</strong> [Nom de l'entreprise] - [Forme
        juridique] - SIRET : [SIRET]
      </p>
      {/* Adresse de l'entreprise */}
      <p>
        <strong>Adresse :</strong> [Adresse complète]
      </p>
      {/* Contact de l'entreprise */}
      <p>
        <strong>Email :</strong> [email] | <strong>Téléphone :</strong> [numéro
        de téléphone]
      </p>
      {/* Directeur de la publication */}
      <p>
        <strong>Directeur de la publication :</strong> [Nom du responsable]
      </p>
      {/* Hébergeur du site */}
      <p>
        <strong>Hébergeur :</strong> IONOS - [Adresse de l'hébergeur] -
        [Téléphone hébergeur]
      </p>
      {/* Propriété intellectuelle */}
      <p>
        <strong>Propriété intellectuelle :</strong> Tous les contenus présents
        sur ce site (textes, images, logos, etc.) sont la propriété de [Nom de
        l'entreprise], sauf mention contraire. Toute reproduction, même
        partielle, est interdite sans autorisation.
      </p>
      {/* Responsabilité */}
      <p>
        <strong>Responsabilité :</strong> [Nom de l'entreprise] s'efforce de
        fournir des informations à jour et exactes, mais ne saurait être tenue
        responsable d'éventuelles erreurs ou omissions.
      </p>
      {/* Date de mise à jour */}
      <p>
        <em>Dernière mise à jour : [date]</em>
      </p>
    </section>
  );
};

export default LegalNotice;
