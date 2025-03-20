import "../../App.css";
import { Card, Container, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

// Style pour le conteneur principal avec flex pour positionner le footer
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Style pour le contenu principal qui prendra l'espace disponible
const MainContent = styled.div`
  flex: 1;
`;

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
    <PageContainer>
      <MainContent>
        <Header />
        <AboutSection>
          <Container>
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
                    marginTop: 25,
                    marginBottom: 25,
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
      </MainContent>
      <Footer />
    </PageContainer>
  );
}
