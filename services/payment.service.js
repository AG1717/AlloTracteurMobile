// services/payment.service.js
import { APP_CONFIG } from '../constants/config';

// Données mock des transactions
export const transactions = [
  {
    id: 'txn_1',
    bookingId: 'b1',
    userId: 'client_1',
    ownerId: 'owner_1',
    amount: 50000,
    platformFee: 5000, // 10%
    ownerAmount: 45000,
    method: 'orange_money',
    status: 'completed',
    reference: 'OM-2026011512345',
    createdAt: '2026-01-15T10:30:00Z',
    completedAt: '2026-01-15T10:32:00Z',
  },
  {
    id: 'txn_2',
    bookingId: 'b2',
    userId: 'client_1',
    ownerId: 'owner_3',
    amount: 60000,
    platformFee: 6000,
    ownerAmount: 54000,
    method: 'wave',
    status: 'completed',
    reference: 'WV-2026012567890',
    createdAt: '2026-01-25T15:00:00Z',
    completedAt: '2026-01-25T15:01:00Z',
  },
  {
    id: 'txn_3',
    bookingId: 'b4',
    userId: 'client_3',
    ownerId: 'owner_2',
    amount: 105000,
    platformFee: 10500,
    ownerAmount: 94500,
    method: 'wave',
    status: 'completed',
    reference: 'WV-2026012812345',
    createdAt: '2026-01-28T17:00:00Z',
    completedAt: '2026-01-28T17:02:00Z',
  },
  {
    id: 'txn_4',
    bookingId: 'b5',
    userId: 'client_1',
    ownerId: 'owner_3',
    amount: 90000,
    platformFee: 9000,
    ownerAmount: 81000,
    method: 'orange_money',
    status: 'refunded',
    reference: 'OM-2026011598765',
    createdAt: '2026-01-15T11:30:00Z',
    completedAt: '2026-01-15T11:32:00Z',
    refundedAt: '2026-01-19T14:00:00Z',
  },
];

// ---- FONCTIONS ----

// Obtenir les méthodes de paiement disponibles
export const getPaymentMethods = () => {
  return APP_CONFIG.paymentMethods.filter((m) => m.available);
};

// Créer une transaction (simuler le paiement)
export const createTransaction = ({
  bookingId,
  userId,
  ownerId,
  amount,
  method,
}) => {
  const platformFee = Math.round((amount * APP_CONFIG.commission.platform) / 100);
  const ownerAmount = amount - platformFee;

  const transaction = {
    id: `txn_${Date.now()}`,
    bookingId,
    userId,
    ownerId,
    amount,
    platformFee,
    ownerAmount,
    method,
    status: 'pending',
    reference: generateReference(method),
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  transactions.push(transaction);
  return transaction;
};

// Générer une référence de paiement
const generateReference = (method) => {
  const prefixes = {
    orange_money: 'OM',
    wave: 'WV',
    card: 'CB',
  };
  const prefix = prefixes[method] || 'TX';
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// Simuler le processus de paiement
export const processPayment = async (transactionId) => {
  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const index = transactions.findIndex((t) => t.id === transactionId);
  if (index === -1) throw new Error('Transaction non trouvée');

  // Simuler 95% de succès
  const success = Math.random() > 0.05;

  if (success) {
    transactions[index] = {
      ...transactions[index],
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  } else {
    transactions[index] = {
      ...transactions[index],
      status: 'failed',
      failedAt: new Date().toISOString(),
      failureReason: 'Solde insuffisant',
    };
  }

  return transactions[index];
};

// Initier un remboursement
export const initiateRefund = async (transactionId, reason) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const index = transactions.findIndex((t) => t.id === transactionId);
  if (index === -1) throw new Error('Transaction non trouvée');

  if (transactions[index].status !== 'completed') {
    throw new Error('Seules les transactions complétées peuvent être remboursées');
  }

  transactions[index] = {
    ...transactions[index],
    status: 'refunded',
    refundedAt: new Date().toISOString(),
    refundReason: reason,
  };

  return transactions[index];
};

// Obtenir les transactions d'un utilisateur
export const getTransactionsByUser = (userId) => {
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Obtenir les transactions d'un propriétaire
export const getTransactionsByOwner = (ownerId) => {
  return transactions
    .filter((t) => t.ownerId === ownerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Obtenir une transaction par ID
export const getTransactionById = (transactionId) => {
  return transactions.find((t) => t.id === transactionId) || null;
};

// Calculer les revenus d'un propriétaire
export const getOwnerEarnings = (ownerId) => {
  const ownerTransactions = transactions.filter(
    (t) => t.ownerId === ownerId && t.status === 'completed'
  );

  const totalEarnings = ownerTransactions.reduce((sum, t) => sum + t.ownerAmount, 0);

  // Revenus du mois courant
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = ownerTransactions
    .filter((t) => {
      const date = new Date(t.completedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.ownerAmount, 0);

  // Revenus par mois (6 derniers mois)
  const earningsByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTotal = ownerTransactions
      .filter((t) => {
        const tDate = new Date(t.completedAt);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.ownerAmount, 0);

    earningsByMonth.push({
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      year,
      amount: monthTotal,
    });
  }

  return {
    totalEarnings,
    monthlyEarnings,
    totalTransactions: ownerTransactions.length,
    earningsByMonth,
  };
};

// Statistiques de paiement pour admin
export const getPaymentStats = () => {
  const completedTransactions = transactions.filter((t) => t.status === 'completed');
  const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = completedTransactions.reduce((sum, t) => sum + t.platformFee, 0);

  const byMethod = {
    orange_money: completedTransactions
      .filter((t) => t.method === 'orange_money')
      .reduce((sum, t) => sum + t.amount, 0),
    wave: completedTransactions
      .filter((t) => t.method === 'wave')
      .reduce((sum, t) => sum + t.amount, 0),
    card: completedTransactions
      .filter((t) => t.method === 'card')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return {
    totalVolume,
    totalFees,
    totalTransactions: completedTransactions.length,
    refundedAmount: transactions
      .filter((t) => t.status === 'refunded')
      .reduce((sum, t) => sum + t.amount, 0),
    byMethod,
  };
};

// Formater le montant
export const formatAmount = (amount) => {
  return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
};
