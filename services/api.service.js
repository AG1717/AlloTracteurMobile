// Service API centralisé pour l'app mobile
// Se connecte au panneau admin Next.js comme backend temporaire

import { api } from './api';

// ============ AUTH ============

export const authService = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  // Inscription
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
};

// ============ USERS ============

export const userService = {
  // Obtenir tous les utilisateurs
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  // Obtenir un utilisateur par ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },

  // Créer un utilisateur
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response;
  },

  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response;
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },
};

// ============ TRACTORS ============

export const tractorService = {
  // Obtenir tous les tracteurs
  getAll: async (params = {}) => {
    const response = await api.get('/tractors', { params });
    return response;
  },

  // Obtenir les tracteurs disponibles
  getAvailable: async () => {
    const response = await api.get('/tractors', { params: { status: 'available' } });
    return response;
  },

  // Obtenir un tracteur par ID
  getById: async (id) => {
    const response = await api.get(`/tractors/${id}`);
    return response;
  },

  // Obtenir les tracteurs d'un propriétaire
  getByOwner: async (ownerId) => {
    const response = await api.get('/tractors', { params: { ownerId } });
    return response;
  },

  // Créer un tracteur
  create: async (tractorData) => {
    const response = await api.post('/tractors', tractorData);
    return response;
  },

  // Mettre à jour un tracteur
  update: async (id, tractorData) => {
    const response = await api.put(`/tractors/${id}`, tractorData);
    return response;
  },

  // Supprimer un tracteur
  delete: async (id) => {
    const response = await api.delete(`/tractors/${id}`);
    return response;
  },

  // Rechercher des tracteurs
  search: async (searchParams) => {
    const response = await api.get('/tractors', { params: searchParams });
    return response;
  },
};

// ============ BOOKINGS ============

export const bookingService = {
  // Obtenir toutes les réservations
  getAll: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response;
  },

  // Obtenir une réservation par ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response;
  },

  // Obtenir les réservations d'un client
  getByClient: async (clientId) => {
    const response = await api.get('/bookings', { params: { clientId } });
    return response;
  },

  // Obtenir les réservations d'un propriétaire
  getByOwner: async (ownerId) => {
    const response = await api.get('/bookings', { params: { ownerId } });
    return response;
  },

  // Créer une réservation
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response;
  },

  // Mettre à jour une réservation
  update: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response;
  },

  // Annuler une réservation
  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}`, {
      status: 'cancelled',
      paymentStatus: 'refunded'
    });
    return response;
  },

  // Confirmer une réservation
  confirm: async (id) => {
    const response = await api.put(`/bookings/${id}`, { status: 'confirmed' });
    return response;
  },

  // Supprimer une réservation
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response;
  },
};

// ============ TRANSACTIONS ============

export const transactionService = {
  // Obtenir toutes les transactions
  getAll: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response;
  },

  // Obtenir les transactions d'un utilisateur
  getByUser: async (userId) => {
    const response = await api.get('/transactions', { params: { userId } });
    return response;
  },
};

// ============ STATS ============

export const statsService = {
  // Obtenir les statistiques du dashboard
  getDashboard: async () => {
    const response = await api.get('/stats');
    return response;
  },
};

// Export par défaut
export default {
  auth: authService,
  users: userService,
  tractors: tractorService,
  bookings: bookingService,
  transactions: transactionService,
  stats: statsService,
};
