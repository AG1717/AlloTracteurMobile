// services/tractor.service.js

import { api } from "./api"; // futur backend MERN

// MOCK (mobile-only pour l'instant)
export const tractors = [
  {
    id: "1",
    name: "John Deere 5050D",
    type: "TRACTOR",
    pricePerDay: 25000,
    isAvailable: true,
    lastUpdated: Date.now(),

    location: {
      latitude: 14.7167,
      longitude: -17.4677,
      updatedAt: Date.now(),
    },

    owner: {
      id: "owner_1",
      name: "Mamadou Diallo",
      phone: "77 123 45 67",
    },
  },

  {
    id: "2",
    name: "Massey Ferguson MF-385",
    type: "TRACTOR",
    pricePerDay: 22000,
    isAvailable: false,
    lastUpdated: Date.now(),

    location: {
      latitude: 14.7267,
      longitude: -17.4577,
      updatedAt: Date.now(),
    },

    owner: {
      id: "owner_2",
      name: "Ibrahima Sarr",
      phone: "76 987 65 43",
    },
  },
];

// ---- FONCTIONS ----

// Récupérer tous les tracteurs disponibles
export const getAvailableTractors = () => {
  return tractors.filter(t => t.isAvailable);
};

export const toggleAvailability = (tractorId) => {
  const tractor = tractors.find(t => t.id === tractorId);
  if (!tractor) return null;

  tractor.isAvailable = !tractor.isAvailable;
  tractor.lastUpdated = Date.now();

  return tractor;
};
