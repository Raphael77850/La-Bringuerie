import axios from "axios";

// Créez une instance d'axios avec une configuration de base
const api = axios.create({
  baseURL: "http://localhost:3310/api", // ou l'URL de votre serveur backend
});

export default api;
