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
        Une soirée où la musique, l’ambiance et les rencontres sont les maîtres
        mots.
        <br />
        Et qui sait, peut-être que ces soirées marqueront le début d’une
        aventure inoubliable
        <br />
        entre bringueurs et bringueuses passionnés ! Plus qu’une soirée, une
        aventure à partager !
      </Paragraph>
    </IntroSection>
  );
}
