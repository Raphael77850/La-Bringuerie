// PrivacyPolicy.tsx
// Composant React pour afficher la politique de confidentialité du site vitrine.
// Personnalisez les zones entre crochets selon votre entreprise.
import type React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <section>
      {/* Titre principal de la politique de confidentialité */}
      <h2>Politique de confidentialité</h2>
      {/* Introduction */}
      <p>
        Cette politique explique comment [Nom de l'entreprise] collecte, utilise
        et protège vos données personnelles lorsque vous utilisez ce site.
      </p>
      {/* Données collectées */}
      <h3>1. Données collectées</h3>
      <p>
        Nous collectons uniquement les informations nécessaires, telles que :
        nom, prénom, adresse e-mail, téléphone, messages envoyés via le
        formulaire de contact.
      </p>
      {/* Utilisation des données */}
      <h3>2. Utilisation des données</h3>
      <p>
        Vos données sont utilisées uniquement pour répondre à vos demandes,
        gérer les prestations et améliorer nos services. Elles ne sont jamais
        vendues à des tiers.
      </p>
      {/* Conservation des données */}
      <h3>3. Conservation des données</h3>
      <p>
        Les données sont conservées pendant la durée strictement nécessaire à la
        gestion de la relation commerciale ou conformément à la législation en
        vigueur.
      </p>
      {/* Droits des utilisateurs */}
      <h3>4. Vos droits</h3>
      <p>
        Vous pouvez demander l'accès, la rectification ou la suppression de vos
        données à tout moment en contactant : [email].
      </p>
      {/* Cookies */}
      <h3>5. Cookies</h3>
      <p>
        Le site peut utiliser des cookies pour améliorer l'expérience
        utilisateur. Vous pouvez les refuser en modifiant les paramètres de
        votre navigateur.
      </p>
      {/* Sécurité */}
      <h3>6. Sécurité</h3>
      <p>
        [Nom de l'entreprise] met en œuvre des mesures pour protéger vos données
        personnelles contre tout accès non autorisé.
      </p>
      {/* Contact */}
      <h3>7. Contact</h3>
      <p>
        Pour toute question concernant la protection de vos données,
        contactez-nous à [email].
      </p>
      {/* Date de mise à jour */}
      <p>
        <em>Dernière mise à jour : [date]</em>
      </p>
    </section>
  );
};

export default PrivacyPolicy;
