// Configuration globale de l'application Allo Tracteur

export const APP_CONFIG = {
  name: 'Allo Tracteur',
  version: '1.0.0',
  description: 'Location de tracteurs agricoles',

  // API (pour le futur backend)
  api: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 10000,
  },

  // Devise
  currency: {
    code: 'XOF',
    symbol: 'FCFA',
    locale: 'fr-SN',
  },

  // Localisation par défaut (Dakar, Sénégal)
  defaultLocation: {
    latitude: 14.7167,
    longitude: -17.4677,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },

  // Rôles utilisateur
  roles: {
    CLIENT: 'client',
    OWNER: 'proprietaire',
    ADMIN: 'admin',
  },

  // Statuts de réservation
  bookingStatus: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Méthodes de paiement
  paymentMethods: [
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: 'phone-portrait-outline',
      color: '#ff6600',
      available: true,
    },
    {
      id: 'wave',
      name: 'Wave',
      icon: 'wallet-outline',
      color: '#1a1aff',
      available: true,
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: 'card-outline',
      color: '#6366f1',
      available: true,
    },
  ],

  // Types de tracteurs
  tractorTypes: [
    { id: 'small', label: 'Petit tracteur', minPower: 0, maxPower: 50 },
    { id: 'medium', label: 'Tracteur moyen', minPower: 50, maxPower: 100 },
    { id: 'large', label: 'Grand tracteur', minPower: 100, maxPower: 200 },
  ],

  // Limites
  limits: {
    maxTractorsPerOwner: 10,
    maxBookingDays: 30,
    minBookingHours: 4,
  },

  // Commissions (pourcentage)
  commission: {
    platform: 10, // 10% pour la plateforme
  },
};

// Labels des statuts (en français)
export const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

// Labels des rôles (en français)
export const ROLE_LABELS = {
  client: 'Client',
  proprietaire: 'Propriétaire',
  admin: 'Administrateur',
};

export default APP_CONFIG;
