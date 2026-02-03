import axios from "axios";

// Configuration de l'API
// En développement, utiliser l'IP locale de votre machine
// Pour trouver votre IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
// Remplacer 10.46.101.167 par votre IP locale si différente
const API_BASE_URL = "http://192.168.1.9:3002/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis AsyncStorage si nécessaire
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Gérer les erreurs spécifiques
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      console.log('Non autorisé - redirection vers login');
    }

    return Promise.reject(error.response?.data || { error: error.message });
  }
);

export default api;
