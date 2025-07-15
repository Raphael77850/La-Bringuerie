import "../../styles/events.css";

function ReservationButton({
  href,
  children,
}: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="reservation-button"
    >
      {children}
    </a>
  );
}

export default function EventsSection() {
  return (
    <section className="events-section section-block">
      <div className="events-list-block">
        <h2>Prochains Évènements</h2>
        <ul className="events-list">
          <li>
            <strong>07 juin</strong> — Kev Junior avec BD Vic
            <ReservationButton href="https://shotgun.live/fr/events/la-bringuerie-2">
              Réserver
            </ReservationButton>
          </li>
          <li>
            <strong>08 juin</strong> — Monsieur Dollar
            <ReservationButton href="https://shotgun.live/fr/events/la-bringuerie-2">
              Réserver
            </ReservationButton>
          </li>
          <li>
            <strong>10 juin</strong> — Chips et Rafale 3D
            <ReservationButton href="https://shotgun.live/fr/events/la-bringuerie-2">
              Réserver
            </ReservationButton>
          </li>
          <li>
            <strong>13 juin</strong> — La Batte avec Collabirie
            <ReservationButton href="https://shotgun.live/fr/events/la-bringuerie-2">
              Réserver
            </ReservationButton>
          </li>
          <li>
            <strong>14 juin</strong> — Tation 1
            <ReservationButton href="https://shotgun.live/fr/events/la-bringuerie-2">
              Réserver
            </ReservationButton>
          </li>
        </ul>
      </div>
      <div className="events-photo-block">
        <img src="/src/assets/images/aleksandr.jpg" alt="Logo La Bringuerie" />
      </div>
    </section>
  );
}
