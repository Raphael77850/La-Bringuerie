import "../../App.css";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const AboutSection = styled.section`
  padding: 4rem 0;
  background-color: white;
`;

const TeamMember = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const teamMembers = [
  {
    id: 1,
    name: "Alexis",
    role: "Directeur Artistique & Graphiste 360°",
    image: "/src/assets/images/AlexisDA.png",
  },
  {
    id: 2,
    name: "Anaïs",
    role: "Directrice Événementiel",
    image: "/src/assets/images/AnaisDE.png",
  },
  {
    id: 3,
    name: "Prénom Nom",
    role: "Directeur des partenariats",
    image: "/src/assets/images/VictorDDP.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutSection>
        <Container>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ color: "#FF8C00" }}
          >
            Notre Équipe
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ color: "#FF8C00", mb: 6 }}
          >
            Découvrez les personnes qui font vibrer vos soirées
          </Typography>

          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item key={member.id} xs={12} sm={6} md={4}>
                <TeamMember>
                  <CardMedia
                    component="img"
                    height="300"
                    image={member.image}
                    alt={member.name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{ color: "#FF8C00" }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      {member.role}
                    </Typography>
                  </CardContent>
                </TeamMember>
              </Grid>
            ))}
          </Grid>
          <Typography
            variant="h3"
            align="center"
            pt={3}
            gutterBottom
            sx={{ color: "#FF8C00" }}
          >
            CV DES CHEFS DE BRINGUE
          </Typography>
          <Typography
            variant="h6"
            align="center"
            paragraph
            sx={{ color: "#FF8C00", mb: 6 }}
          >
            Chefs de Clan, de Bringue et Organisateurs d'Événements Privés Le
            chef de bringue est un passionné d'événements exclusifs et
            innovants, reconnu pour son influence dans la scène parisienne.
            Expert en création d'expériences uniques, il allie networking,
            communication et festivités haut de gamme. Il a été coopté par les
            Ambassadeurs pour intégrer les clans les plus prisés de la Nuit des
            Ambassadeurs, un événement devenu incontournable à Paris, mélangeant
            jeu de rôle, théâtre et fête costumée.
          </Typography>
        </Container>
      </AboutSection>
      <Footer />
    </>
  );
}
