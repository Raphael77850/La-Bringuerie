import styled from "styled-components";

const IntroSection = styled.section`
    background-color: #FF5722;
    padding: 1rem;
    margin-top: 2.5rem; 
    padding-bottom: 2rem;
    text-align: center;
`;

const Title = styled.h1`
    color: white;
    font-size: 2rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

const Paragraph = styled.p`
    color: white;
    font-size: 1.2rem;
    line-height: 1.5;
`;

export default function Intro() {
  return (
    <IntroSection>
      <Title>La Bringuerie</Title>
      <Paragraph>
        Il était une fois, trois amis passionnés par le monde de la fête et de
        la musique à Bordeaux. Mais ils étaient en manque d’une soirée où la
        musique, l’ambiance et les rencontres seraient au cœur de l’événement,
        réunissant une communauté de bringueurs et de bringueuses stylés, prêts
        à faire la fête dans une atmosphère colorée, avec une grosse dose de
        bonne humeur et une touche d’extravagance. Cette soirée ils l’ont rêvée,
        ils l’ont créée : la Bringuerie est née !
      </Paragraph>
    </IntroSection>
  );
}
