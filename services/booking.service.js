// services/booking.service.js
import { getTractorById } from './tractor.service';

// Données mock des réservations
export const bookings = [
  {
    id: 'b1',
    tractorId: 't1',
    clientId: 'client_1',
    ownerId: 'owner_1',
    status: 'completed',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    totalDays: 2,
    pricePerDay: 25000,
    totalPrice: 50000,
    paymentMethod: 'orange_money',
    paymentStatus: 'paid',
    notes: 'Labour de 3 hectares',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-17T18:00:00Z',
  },
  {
    id: 'b2',
    tractorId: 't3',
    clientId: 'client_1',
    ownerId: 'owner_3',
    status: 'in_progress',
    startDate: '2026-01-28',
    endDate: '2026-01-30',
    totalDays: 2,
    pricePerDay: 30000,
    totalPrice: 60000,
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    notes: 'Préparation du sol pour semis',
    createdAt: '2026-01-25T14:30:00Z',
    updatedAt: '2026-01-28T08:00:00Z',
  },
  {
    id: 'b3',
    tractorId: 't5',
    clientId: 'client_2',
    ownerId: 'owner_4',
    status: 'pending',
    startDate: '2026-02-01',
    endDate: '2026-02-03',
    totalDays: 2,
    pricePerDay: 38000,
    totalPrice: 76000,
    paymentMethod: 'orange_money',
    paymentStatus: 'unpaid',
    notes: 'Transport de matériel',
    createdAt: '2026-01-29T09:15:00Z',
    updatedAt: '2026-01-29T09:15:00Z',
  },
  {
    id: 'b4',
    tractorId: 't2',
    clientId: 'client_3',
    ownerId: 'owner_2',
    status: 'confirmed',
    startDate: '2026-02-05',
    endDate: '2026-02-08',
    totalDays: 3,
    pricePerDay: 35000,
    totalPrice: 105000,
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    notes: 'Récolte de riz',
    createdAt: '2026-01-28T16:45:00Z',
    updatedAt: '2026-01-29T10:00:00Z',
  },
  {
    id: 'b5',
    tractorId: 't7',
    clientId: 'client_1',
    ownerId: 'owner_3',
    status: 'cancelled',
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    totalDays: 2,
    pricePerDay: 45000,
    totalPrice: 90000,
    paymentMethod: 'orange_money',
    paymentStatus: 'refunded',
    notes: 'Annulé pour cause météo',
    cancellationReason: 'Mauvaises conditions météo',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-01-19T14:00:00Z',
  },
];

// ---- FONCTIONS ----

// Récupérer toutes les réservations
export const getAllBookings = () => {
  return bookings.map((booking) => ({
    ...booking,
    tractor: getTractorById(booking.tractorId),
  }));
};

// Récupérer une réservation par son ID
export const getBookingById = (bookingId) => {
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  return {
    ...booking,
    tractor: getTractorById(booking.tractorId),
  };
};

// Récupérer les réservations d'un client
export const getBookingsByClient = (clientId) => {
  return bookings
    .filter((b) => b.clientId === clientId)
    .map((booking) => ({
      ...booking,
      tractor: getTractorById(booking.tractorId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Récupérer les réservations d'un propriétaire
export const getBookingsByOwner = (ownerId) => {
  return bookings
    .filter((b) => b.ownerId === ownerId)
    .map((booking) => ({
      ...booking,
      tractor: getTractorById(booking.tractorId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Récupérer les demandes en attente d'un propriétaire
export const getPendingRequestsByOwner = (ownerId) => {
  return bookings
    .filter((b) => b.ownerId === ownerId && b.status === 'pending')
    .map((booking) => ({
      ...booking,
      tractor: getTractorById(booking.tractorId),
    }));
};

// Créer une nouvelle réservation
export const createBooking = ({
  tractorId,
  clientId,
  startDate,
  endDate,
  paymentMethod,
  notes,
}) => {
  const tractor = getTractorById(tractorId);
  if (!tractor) throw new Error('Tracteur non trouvé');
  if (!tractor.isAvailable) throw new Error('Tracteur non disponible');

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (totalDays < 1) throw new Error('Durée invalide');

  const newBooking = {
    id: `b${Date.now()}`,
    tractorId,
    clientId,
    ownerId: tractor.owner.id,
    status: 'pending',
    startDate,
    endDate,
    totalDays,
    pricePerDay: tractor.pricePerDay,
    totalPrice: totalDays * tractor.pricePerDay,
    paymentMethod,
    paymentStatus: 'unpaid',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  return {
    ...newBooking,
    tractor,
  };
};

// Mettre à jour le statut d'une réservation
export const updateBookingStatus = (bookingId, newStatus, reason) => {
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(reason && { cancellationReason: reason }),
  };

  return {
    ...bookings[index],
    tractor: getTractorById(bookings[index].tractorId),
  };
};

// Accepter une réservation
export const acceptBooking = (bookingId) => {
  return updateBookingStatus(bookingId, 'confirmed');
};

// Refuser une réservation
export const rejectBooking = (bookingId, reason) => {
  return updateBookingStatus(bookingId, 'cancelled', reason || 'Refusé par le propriétaire');
};

// Annuler une réservation (par le client)
export const cancelBooking = (bookingId, reason) => {
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  // Vérifier si annulation possible
  if (['completed', 'cancelled'].includes(booking.status)) {
    throw new Error('Cette réservation ne peut pas être annulée');
  }

  return updateBookingStatus(bookingId, 'cancelled', reason);
};

// Démarrer une réservation
export const startBooking = (bookingId) => {
  return updateBookingStatus(bookingId, 'in_progress');
};

// Terminer une réservation
export const completeBooking = (bookingId) => {
  return updateBookingStatus(bookingId, 'completed');
};

// Mettre à jour le statut de paiement
export const updatePaymentStatus = (bookingId, paymentStatus) => {
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    paymentStatus,
    updatedAt: new Date().toISOString(),
  };

  return bookings[index];
};

// Obtenir les statistiques des réservations
export const getBookingStats = (ownerId) => {
  const ownerBookings = bookings.filter((b) => b.ownerId === ownerId);

  const totalBookings = ownerBookings.length;
  const completedBookings = ownerBookings.filter((b) => b.status === 'completed').length;
  const pendingBookings = ownerBookings.filter((b) => b.status === 'pending').length;
  const totalRevenue = ownerBookings
    .filter((b) => b.status === 'completed' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const currentMonth = new Date().getMonth();
  const monthlyRevenue = ownerBookings
    .filter((b) => {
      const bookingMonth = new Date(b.createdAt).getMonth();
      return (
        b.status === 'completed' &&
        b.paymentStatus === 'paid' &&
        bookingMonth === currentMonth
      );
    })
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return {
    totalBookings,
    completedBookings,
    pendingBookings,
    totalRevenue,
    monthlyRevenue,
    completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
  };
};

// Vérifier la disponibilité d'un tracteur pour une période
export const checkAvailability = (tractorId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const conflictingBookings = bookings.filter((b) => {
    if (b.tractorId !== tractorId) return false;
    if (['cancelled', 'completed'].includes(b.status)) return false;

    const bookingStart = new Date(b.startDate);
    const bookingEnd = new Date(b.endDate);

    // Vérifier le chevauchement
    return start <= bookingEnd && end >= bookingStart;
  });

  return conflictingBookings.length === 0;
};
