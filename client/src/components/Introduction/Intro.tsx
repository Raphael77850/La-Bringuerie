import styled from "styled-components";

const IntroSection = styled.section`
    background-color: white;
    padding: 2rem;
    text-align: center;
`;

const Title = styled.h1`
    color: #FF8C00; // Orange color
    font-size: 2rem;
    margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
    color: #FF8C00;
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
        aventure inoubliable entre bringueurs et bringueuses passionnés ! Plus
        qu’une soirée, une aventure à partager !
      </Paragraph>
    </IntroSection>
  );
}
