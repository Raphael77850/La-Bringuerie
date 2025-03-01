import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [eventEmails, setEventEmails] = useState<string[]>([]);
  const [events, setEvents] = useState<
    { id: number; title: string; date: string }[]
  >([]);

  useEffect(() => {
    //Fecth newsletter emails
    axios.get("/api/admin/newsletter").then((response) => {
      if (Array.isArray(response.data)) {
        setNewsletterEmails(response.data as string[]);
      } else {
        console.error("Error fetching newsletter emails:", response.data);
      }
    });

    //Fetch event emails
    axios.get("/api/admin/events").then((response) => {
      if (Array.isArray(response.data)) {
        setEventEmails(response.data as string[]);
      } else {
        console.error("Error fetching event emails:", response.data);
      }
    });

    //Fetch events
    axios.get("/api/events").then((response) => {
      if (Array.isArray(response.data)) {
        setEvents(
          response.data as { id: number; title: string; date: string }[],
        );
      } else {
        console.error("Error fetching events:", response.data);
      }
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4">Tableau de bord de l'administrateur</Typography>

      <Box>
        <Typography variant="h5">Emails de la newsletter</Typography>
        <ul>
          {Array.isArray(newsletterEmails) ? (
            newsletterEmails.map((email) => <li key={email}>{email}</li>)
          ) : (
            <li>Erreur lors de la récupération des emails</li>
          )}
        </ul>
      </Box>

      <Box>
        <Typography variant="h5">Emails des inscrits aux événements</Typography>
        <ul>
          {Array.isArray(eventEmails) ? (
            eventEmails.map((email) => <li key={email}>{email}</li>)
          ) : (
            <li>Erreur lors de la récupération des emails</li>
          )}
        </ul>
      </Box>

      <Box>
        <Typography variant="h5">Gérer les événements</Typography>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.title} - {event.date}
              <Button variant="contained" color="primary">
                Modifier
              </Button>
              <Button variant="contained" color="secondary">
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="contained" color="primary">
          Ajouter un événement
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
