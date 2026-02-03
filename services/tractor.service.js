// services/tractor.service.js
import { api } from './api';

// Données mock enrichies - 10+ tracteurs
export const tractors = [
  {
    id: 't1',
    name: 'John Deere 5050D',
    brand: 'John Deere',
    model: '5050D',
    type: 'TRACTOR',
    power: 50,
    year: 2020,
    pricePerDay: 25000,
    pricePerHour: 3500,
    isAvailable: true,
    rating: 4.8,
    totalReviews: 24,
    image: null,
    description: 'Tracteur polyvalent idéal pour les petites et moyennes exploitations. Équipé d\'un moteur diesel économique.',
    features: ['Climatisation', '4x4', 'Cabine fermée'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7167,
      longitude: -17.4677,
      address: 'Dakar, Sénégal',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_1',
      name: 'Mamadou Diallo',
      phone: '77 123 45 67',
      rating: 4.9,
    },
  },
  {
    id: 't2',
    name: 'Massey Ferguson MF-385',
    brand: 'Massey Ferguson',
    model: 'MF-385',
    type: 'TRACTOR',
    power: 85,
    year: 2019,
    pricePerDay: 35000,
    pricePerHour: 5000,
    isAvailable: true,
    rating: 4.6,
    totalReviews: 18,
    image: null,
    description: 'Tracteur robuste pour les grandes surfaces agricoles. Puissance et fiabilité garanties.',
    features: ['4x4', 'Attelage 3 points', 'Prise de force'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7267,
      longitude: -17.4577,
      address: 'Pikine, Dakar',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_2',
      name: 'Ibrahima Sarr',
      phone: '76 987 65 43',
      rating: 4.7,
    },
  },
  {
    id: 't3',
    name: 'New Holland T4.75',
    brand: 'New Holland',
    model: 'T4.75',
    type: 'TRACTOR',
    power: 75,
    year: 2021,
    pricePerDay: 30000,
    pricePerHour: 4200,
    isAvailable: true,
    rating: 4.9,
    totalReviews: 32,
    image: null,
    description: 'Tracteur moderne avec technologie de pointe. Confort optimal pour longues journées de travail.',
    features: ['Climatisation', '4x4', 'GPS intégré', 'Cabine insonorisée'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7050,
      longitude: -17.4500,
      address: 'Rufisque, Dakar',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_3',
      name: 'Ousmane Ndiaye',
      phone: '78 456 78 90',
      rating: 4.8,
    },
  },
  {
    id: 't4',
    name: 'Kubota M7060',
    brand: 'Kubota',
    model: 'M7060',
    type: 'TRACTOR',
    power: 70,
    year: 2022,
    pricePerDay: 32000,
    pricePerHour: 4500,
    isAvailable: false,
    rating: 4.7,
    totalReviews: 15,
    image: null,
    description: 'Tracteur japonais reconnu pour sa durabilité. Parfait pour tous types de travaux agricoles.',
    features: ['4x4', 'Transmission hydrostatique', 'Relevage hydraulique'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7800,
      longitude: -17.4000,
      address: 'Thiès',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_1',
      name: 'Mamadou Diallo',
      phone: '77 123 45 67',
      rating: 4.9,
    },
  },
  {
    id: 't5',
    name: 'Case IH Farmall 90C',
    brand: 'Case IH',
    model: 'Farmall 90C',
    type: 'TRACTOR',
    power: 90,
    year: 2020,
    pricePerDay: 38000,
    pricePerHour: 5500,
    isAvailable: true,
    rating: 4.5,
    totalReviews: 21,
    image: null,
    description: 'Tracteur puissant pour grandes exploitations. Idéal pour le labour et le transport lourd.',
    features: ['Climatisation', '4x4', 'Cabine fermée', 'Attelage renforcé'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.6928,
      longitude: -17.4467,
      address: 'Dakar Centre',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_4',
      name: 'Abdoulaye Fall',
      phone: '70 111 22 33',
      rating: 4.6,
    },
  },
  {
    id: 't6',
    name: 'Deutz-Fahr 5080G',
    brand: 'Deutz-Fahr',
    model: '5080G',
    type: 'TRACTOR',
    power: 80,
    year: 2018,
    pricePerDay: 28000,
    pricePerHour: 4000,
    isAvailable: true,
    rating: 4.4,
    totalReviews: 12,
    image: null,
    description: 'Tracteur allemand fiable et économique. Bon rapport qualité-prix.',
    features: ['4x4', 'Cabine fermée', 'Prise de force'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7500,
      longitude: -17.3500,
      address: 'Mbour',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_5',
      name: 'Cheikh Sow',
      phone: '77 555 66 77',
      rating: 4.5,
    },
  },
  {
    id: 't7',
    name: 'Fendt 211 Vario',
    brand: 'Fendt',
    model: '211 Vario',
    type: 'TRACTOR',
    power: 110,
    year: 2021,
    pricePerDay: 45000,
    pricePerHour: 6500,
    isAvailable: true,
    rating: 4.9,
    totalReviews: 28,
    image: null,
    description: 'Tracteur premium avec transmission Vario. Le nec plus ultra en matière de confort et performance.',
    features: ['Climatisation auto', '4x4', 'Transmission CVT', 'GPS RTK', 'Cabine panoramique'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.8000,
      longitude: -17.2500,
      address: 'Saint-Louis',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_3',
      name: 'Ousmane Ndiaye',
      phone: '78 456 78 90',
      rating: 4.8,
    },
  },
  {
    id: 't8',
    name: 'Mahindra 575 DI',
    brand: 'Mahindra',
    model: '575 DI',
    type: 'TRACTOR',
    power: 45,
    year: 2019,
    pricePerDay: 18000,
    pricePerHour: 2500,
    isAvailable: true,
    rating: 4.3,
    totalReviews: 35,
    image: null,
    description: 'Tracteur économique et robuste. Parfait pour les petits exploitants.',
    features: ['Économique', 'Facile à entretenir'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.6500,
      longitude: -17.4200,
      address: 'Guédiawaye',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_6',
      name: 'Moussa Ba',
      phone: '76 888 99 00',
      rating: 4.4,
    },
  },
  {
    id: 't9',
    name: 'Valtra A104',
    brand: 'Valtra',
    model: 'A104',
    type: 'TRACTOR',
    power: 100,
    year: 2020,
    pricePerDay: 40000,
    pricePerHour: 5800,
    isAvailable: false,
    rating: 4.7,
    totalReviews: 19,
    image: null,
    description: 'Tracteur finlandais adapté aux conditions difficiles. Excellente maniabilité.',
    features: ['4x4', 'Climatisation', 'Direction assistée', 'Cabine renforcée'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.7700,
      longitude: -17.4100,
      address: 'Parcelles Assainies',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_2',
      name: 'Ibrahima Sarr',
      phone: '76 987 65 43',
      rating: 4.7,
    },
  },
  {
    id: 't10',
    name: 'Claas Arion 430',
    brand: 'Claas',
    model: 'Arion 430',
    type: 'TRACTOR',
    power: 95,
    year: 2022,
    pricePerDay: 42000,
    pricePerHour: 6000,
    isAvailable: true,
    rating: 4.8,
    totalReviews: 14,
    image: null,
    description: 'Tracteur polyvalent haut de gamme. Technologie allemande de précision.',
    features: ['Climatisation', '4x4', 'GPS', 'Télémétrie', 'Cabine suspendue'],
    lastUpdated: Date.now(),
    location: {
      latitude: 14.6800,
      longitude: -17.4600,
      address: 'Yoff, Dakar',
      updatedAt: Date.now(),
    },
    owner: {
      id: 'owner_4',
      name: 'Abdoulaye Fall',
      phone: '70 111 22 33',
      rating: 4.6,
    },
  },
];

// ---- FONCTIONS ----

// Récupérer tous les tracteurs
export const getAllTractors = () => {
  return [...tractors];
};

// Récupérer tous les tracteurs disponibles
export const getAvailableTractors = () => {
  return tractors.filter((t) => t.isAvailable);
};

// Récupérer un tracteur par son ID
export const getTractorById = (tractorId) => {
  return tractors.find((t) => t.id === tractorId) || null;
};

// Récupérer les tracteurs d'un propriétaire
export const getTractorsByOwner = (ownerId) => {
  return tractors.filter((t) => t.owner.id === ownerId);
};

// Toggle disponibilité
export const toggleAvailability = (tractorId) => {
  const tractor = tractors.find((t) => t.id === tractorId);
  if (!tractor) return null;

  tractor.isAvailable = !tractor.isAvailable;
  tractor.lastUpdated = Date.now();

  return tractor;
};

// Filtrer les tracteurs
export const filterTractors = ({
  available,
  minPrice,
  maxPrice,
  minPower,
  maxPower,
  brand,
  search,
}) => {
  return tractors.filter((t) => {
    if (available !== undefined && t.isAvailable !== available) return false;
    if (minPrice && t.pricePerDay < minPrice) return false;
    if (maxPrice && t.pricePerDay > maxPrice) return false;
    if (minPower && t.power < minPower) return false;
    if (maxPower && t.power > maxPower) return false;
    if (brand && t.brand.toLowerCase() !== brand.toLowerCase()) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesName = t.name.toLowerCase().includes(searchLower);
      const matchesBrand = t.brand.toLowerCase().includes(searchLower);
      const matchesModel = t.model.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesBrand && !matchesModel) return false;
    }
    return true;
  });
};

// Calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Récupérer les tracteurs proches d'une position
export const getNearbyTractors = (latitude, longitude, radiusKm = 50) => {
  return tractors
    .map((t) => ({
      ...t,
      distance: calculateDistance(
        latitude,
        longitude,
        t.location.latitude,
        t.location.longitude
      ),
    }))
    .filter((t) => t.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

// Obtenir les marques uniques
export const getBrands = () => {
  return [...new Set(tractors.map((t) => t.brand))].sort();
};

// Ajouter un tracteur (mock)
export const addTractor = (tractorData) => {
  const newTractor = {
    id: `t${Date.now()}`,
    ...tractorData,
    rating: 0,
    totalReviews: 0,
    lastUpdated: Date.now(),
    location: {
      ...tractorData.location,
      updatedAt: Date.now(),
    },
  };
  tractors.push(newTractor);
  return newTractor;
};

// Mettre à jour un tracteur (mock)
export const updateTractor = (tractorId, updates) => {
  const index = tractors.findIndex((t) => t.id === tractorId);
  if (index === -1) return null;

  tractors[index] = {
    ...tractors[index],
    ...updates,
    lastUpdated: Date.now(),
  };

  return tractors[index];
};

// Supprimer un tracteur (mock)
export const deleteTractor = (tractorId) => {
  const index = tractors.findIndex((t) => t.id === tractorId);
  if (index === -1) return false;

  tractors.splice(index, 1);
  return true;
};
