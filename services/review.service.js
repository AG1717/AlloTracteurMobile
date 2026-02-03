// services/review.service.js
import { getTractorById } from './tractor.service';
import { getUserById } from './user.service';

// Données mock des avis
export const reviews = [
  {
    id: 'rev_1',
    bookingId: 'b1',
    tractorId: 't1',
    clientId: 'client_1',
    ownerId: 'owner_1',
    rating: 5,
    comment: 'Excellent tracteur, très puissant et bien entretenu. Le propriétaire était très professionnel.',
    response: 'Merci beaucoup ! Ce fut un plaisir de travailler avec vous.',
    createdAt: '2026-01-17T19:00:00Z',
    respondedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'rev_2',
    bookingId: 'b4',
    tractorId: 't2',
    clientId: 'client_3',
    ownerId: 'owner_2',
    rating: 4,
    comment: 'Bon service, tracteur en bon état. Livraison un peu en retard mais rien de grave.',
    response: null,
    createdAt: '2026-01-28T20:00:00Z',
    respondedAt: null,
  },
  {
    id: 'rev_3',
    bookingId: 'b_old_1',
    tractorId: 't3',
    clientId: 'client_2',
    ownerId: 'owner_3',
    rating: 5,
    comment: 'Parfait ! Le tracteur était exactement ce dont j\'avais besoin pour mon champ.',
    response: 'Ravi que le service vous ait satisfait. À bientôt !',
    createdAt: '2026-01-10T15:00:00Z',
    respondedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: 'rev_4',
    bookingId: 'b_old_2',
    tractorId: 't5',
    clientId: 'client_1',
    ownerId: 'owner_4',
    rating: 3,
    comment: 'Service correct mais le tracteur avait quelques problèmes mineurs.',
    response: 'Désolé pour les désagréments. Nous avons depuis effectué les réparations nécessaires.',
    createdAt: '2026-01-05T18:00:00Z',
    respondedAt: '2026-01-06T11:00:00Z',
  },
  {
    id: 'rev_5',
    bookingId: 'b_old_3',
    tractorId: 't1',
    clientId: 'client_2',
    ownerId: 'owner_1',
    rating: 5,
    comment: 'Deuxième fois que je loue ce tracteur, toujours aussi satisfait !',
    response: null,
    createdAt: '2025-12-20T16:00:00Z',
    respondedAt: null,
  },
];

// ---- FONCTIONS ----

// Récupérer tous les avis
export const getAllReviews = () => {
  return reviews.map((review) => ({
    ...review,
    client: getUserById(review.clientId),
    tractor: getTractorById(review.tractorId),
  }));
};

// Récupérer un avis par ID
export const getReviewById = (reviewId) => {
  const review = reviews.find((r) => r.id === reviewId);
  if (!review) return null;

  return {
    ...review,
    client: getUserById(review.clientId),
    tractor: getTractorById(review.tractorId),
  };
};

// Récupérer les avis d'un tracteur
export const getReviewsByTractor = (tractorId) => {
  return reviews
    .filter((r) => r.tractorId === tractorId)
    .map((review) => ({
      ...review,
      client: getUserById(review.clientId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Récupérer les avis d'un propriétaire
export const getReviewsByOwner = (ownerId) => {
  return reviews
    .filter((r) => r.ownerId === ownerId)
    .map((review) => ({
      ...review,
      client: getUserById(review.clientId),
      tractor: getTractorById(review.tractorId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Récupérer les avis d'un client
export const getReviewsByClient = (clientId) => {
  return reviews
    .filter((r) => r.clientId === clientId)
    .map((review) => ({
      ...review,
      tractor: getTractorById(review.tractorId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Vérifier si un avis existe pour une réservation
export const getReviewByBooking = (bookingId) => {
  const review = reviews.find((r) => r.bookingId === bookingId);
  if (!review) return null;

  return {
    ...review,
    client: getUserById(review.clientId),
    tractor: getTractorById(review.tractorId),
  };
};

// Créer un nouvel avis
export const createReview = ({
  bookingId,
  tractorId,
  clientId,
  ownerId,
  rating,
  comment,
}) => {
  // Vérifier si un avis existe déjà pour cette réservation
  const existingReview = reviews.find((r) => r.bookingId === bookingId);
  if (existingReview) {
    throw new Error('Un avis existe déjà pour cette réservation');
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    bookingId,
    tractorId,
    clientId,
    ownerId,
    rating,
    comment,
    response: null,
    createdAt: new Date().toISOString(),
    respondedAt: null,
  };

  reviews.push(newReview);

  return {
    ...newReview,
    client: getUserById(clientId),
    tractor: getTractorById(tractorId),
  };
};

// Répondre à un avis (propriétaire)
export const respondToReview = (reviewId, response) => {
  const index = reviews.findIndex((r) => r.id === reviewId);
  if (index === -1) throw new Error('Avis non trouvé');

  reviews[index] = {
    ...reviews[index],
    response,
    respondedAt: new Date().toISOString(),
  };

  return reviews[index];
};

// Calculer la note moyenne d'un tracteur
export const getTractorAverageRating = (tractorId) => {
  const tractorReviews = reviews.filter((r) => r.tractorId === tractorId);
  if (tractorReviews.length === 0) return { average: 0, count: 0 };

  const sum = tractorReviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: sum / tractorReviews.length,
    count: tractorReviews.length,
  };
};

// Calculer la note moyenne d'un propriétaire
export const getOwnerAverageRating = (ownerId) => {
  const ownerReviews = reviews.filter((r) => r.ownerId === ownerId);
  if (ownerReviews.length === 0) return { average: 0, count: 0 };

  const sum = ownerReviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: sum / ownerReviews.length,
    count: ownerReviews.length,
  };
};

// Statistiques des avis pour admin
export const getReviewStats = () => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const respondedCount = reviews.filter((r) => r.response !== null).length;

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    respondedCount,
    responseRate: totalReviews > 0 ? (respondedCount / totalReviews) * 100 : 0,
  };
};
