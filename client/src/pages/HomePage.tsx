import CommandementsCarousel from "../components/Commandements/CommandementsCarousel";
import Contact from "../components/Contact/Contact";
import EventsSection from "../components/Events/EventsSection";
import HeroSection from "../components/HeroSection/HeroSection";
import Intro from "../components/Introduction/Intro";
import NewsletterForm from "../components/NewsletterForm/NewsletterForm";

const HomePage = () => (
  <>
    <HeroSection />
    <main className="main-content" style={{ flex: 1 }}>
      <EventsSection />
      <section className="intro-section section-block">
        <Intro />
      </section>
      <section className="commandements-section section-block">
        <h2>Les 10 commandements du Bringueur :</h2>
        <CommandementsCarousel />
      </section>
      <Contact />
      <NewsletterForm />
    </main>
  </>
);

export default HomePage;
