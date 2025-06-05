import axios from "axios";

// Créez une instance d'axios avec une configuration de base
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // ou l'URL de votre serveur backend
});

export default api;
