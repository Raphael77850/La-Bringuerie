import "../../styles/contact.css";
import facebookLogo from "../../assets/images/facebook.png";
import instagramLogo from "../../assets/images/instagramLogo.svg";

const contact = [
  {
    id: 1,
    mail: "labringueriebordeaux@gmail.com",
    image: "/src/assets/images/Icon2Officiel-removebg-preview.png",
  },
];

export default function Contact() {
  return (
    <section className="section-block contact-section">
      <div className="contact-card">
        <h2 className="contact-title">Contact</h2>
        <p className="contact-text">{contact[0].mail}</p>
        <div className="contact-socials">
          <a
            href="https://www.instagram.com/labringueriebordeaux/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src={instagramLogo}
              alt="Instagram"
              className="contact-social-icon"
            />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61571448225787&mibextid=wwXIfr&rdid=sgWfTOUkJ5mKtoNq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img
              src={facebookLogo}
              alt="Facebook"
              className="contact-social-icon contact-social-icon--facebook"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
