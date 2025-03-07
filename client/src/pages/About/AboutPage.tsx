import "../../App.css";
import { Card, Container, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const AboutSection = styled.section`
  background-color: #FF5722;
  font-family: "Francois One, serif" !important;
  padding-top: 6.5rem;
  padding-bottom: .5rem;
`;

const contact = [
  {
    id: 1,
    mail: "labringueriebordeaux@gmail.com",
    image: "/src/assets/images/Icon2Officiel-removebg-preview.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutSection>
        <Container>
          <Typography
            variant="h4"
            align="center"
            pt={1}
            gutterBottom
            sx={{ color: "white", fontFamily: "Francois One, serif" }}
          >
            IL ÉTAIT UNE FOIS, TROIS AMIS PASSIONNÉS PAR LE MONDE DE LA FÊTE ET
            DE LA MUSIQUE SUR BORDEAUX.
          </Typography>
          <Typography
            variant="h6"
            align="center"
            paragraph
            sx={{
              color: "white",
              mb: 1,
              pb: 1,
              fontFamily: "Francois One, serif",
            }}
          >
            Mais il fallait un lieu... <br />
            ...un endroit où tout était possible...
            <br />
            ...des rencontres, des échanges, des moments de pure folie !<br />
            Ils se mirent alors en quête d’un partenaire, un lieu avec lequel
            s’associer pour créer la première soirée de La Bringuerie.
          </Typography>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#FFF3E0",
                  padding: 2,
                  marginTop: 1,
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mt: 0,
                    fontFamily: "Francois One, serif",
                    color: "#FF5722",
                  }}
                >
                  Contact
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    fontFamily: "Francois One, serif",
                    color: "#FF5722",
                  }}
                >
                  {contact[0].mail}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </AboutSection>
      <Footer />
    </>
  );
}
