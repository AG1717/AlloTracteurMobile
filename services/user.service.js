// services/user.service.js

// Données mock des utilisateurs
export const users = [
  // Clients
  {
    id: 'client_1',
    role: 'client',
    nom: 'Diop',
    prenom: 'Fatou',
    email: 'fatou.diop@email.com',
    telephone: '77 234 56 78',
    address: 'Dakar, Sénégal',
    avatar: null,
    isActive: true,
    isVerified: true,
    createdAt: '2025-06-15T10:00:00Z',
    lastLogin: '2026-01-29T08:30:00Z',
  },
  {
    id: 'client_2',
    role: 'client',
    nom: 'Ndiaye',
    prenom: 'Amadou',
    email: 'amadou.ndiaye@email.com',
    telephone: '76 345 67 89',
    address: 'Thiès, Sénégal',
    avatar: null,
    isActive: true,
    isVerified: true,
    createdAt: '2025-08-20T14:00:00Z',
    lastLogin: '2026-01-28T15:45:00Z',
  },
  {
    id: 'client_3',
    role: 'client',
    nom: 'Seck',
    prenom: 'Mariama',
    email: 'mariama.seck@email.com',
    telephone: '78 456 78 90',
    address: 'Saint-Louis, Sénégal',
    avatar: null,
    isActive: true,
    isVerified: false,
    createdAt: '2025-11-10T09:30:00Z',
    lastLogin: '2026-01-27T11:00:00Z',
  },

  // Propriétaires
  {
    id: 'owner_1',
    role: 'proprietaire',
    nom: 'Diallo',
    prenom: 'Mamadou',
    email: 'mamadou.diallo@email.com',
    telephone: '77 123 45 67',
    address: 'Dakar, Sénégal',
    avatar: null,
    isActive: true,
    isVerified: true,
    rating: 4.9,
    totalTractors: 2,
    totalBookings: 45,
    createdAt: '2025-01-10T08:00:00Z',
    lastLogin: '2026-01-29T09:00:00Z',
  },
  {
    id: 'owner_2',
    role: 'proprietaire',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    email: 'ibrahima.sarr@email.com',
    telephone: '76 987 65 43',
    address: 'Pikine, Dakar',
    avatar: null,
    isActive: true,
    isVerified: true,
    rating: 4.7,
    totalTractors: 2,
    totalBookings: 32,
    createdAt: '2025-03-15T10:30:00Z',
    lastLogin: '2026-01-28T17:20:00Z',
  },
  {
    id: 'owner_3',
    role: 'proprietaire',
    nom: 'Ndiaye',
    prenom: 'Ousmane',
    email: 'ousmane.ndiaye@email.com',
    telephone: '78 456 78 90',
    address: 'Rufisque, Dakar',
    avatar: null,
    isActive: true,
    isVerified: true,
    rating: 4.8,
    totalTractors: 2,
    totalBookings: 58,
    createdAt: '2025-02-20T11:00:00Z',
    lastLogin: '2026-01-29T07:45:00Z',
  },
  {
    id: 'owner_4',
    role: 'proprietaire',
    nom: 'Fall',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.fall@email.com',
    telephone: '70 111 22 33',
    address: 'Dakar Centre',
    avatar: null,
    isActive: true,
    isVerified: true,
    rating: 4.6,
    totalTractors: 2,
    totalBookings: 28,
    createdAt: '2025-05-08T14:00:00Z',
    lastLogin: '2026-01-27T16:30:00Z',
  },
  {
    id: 'owner_5',
    role: 'proprietaire',
    nom: 'Sow',
    prenom: 'Cheikh',
    email: 'cheikh.sow@email.com',
    telephone: '77 555 66 77',
    address: 'Mbour',
    avatar: null,
    isActive: false,
    isVerified: true,
    rating: 4.5,
    totalTractors: 1,
    totalBookings: 15,
    createdAt: '2025-07-12T09:00:00Z',
    lastLogin: '2026-01-15T10:00:00Z',
  },
  {
    id: 'owner_6',
    role: 'proprietaire',
    nom: 'Ba',
    prenom: 'Moussa',
    email: 'moussa.ba@email.com',
    telephone: '76 888 99 00',
    address: 'Guédiawaye',
    avatar: null,
    isActive: true,
    isVerified: false,
    rating: 4.4,
    totalTractors: 1,
    totalBookings: 12,
    createdAt: '2025-09-25T13:30:00Z',
    lastLogin: '2026-01-28T14:00:00Z',
  },

  // Admin
  {
    id: 'admin_1',
    role: 'admin',
    nom: 'Admin',
    prenom: 'Super',
    email: 'admin@allotracteur.sn',
    telephone: '77 000 00 00',
    address: 'Dakar, Sénégal',
    avatar: null,
    isActive: true,
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLogin: '2026-01-29T10:00:00Z',
  },
];

// ---- FONCTIONS ----

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  return [...users];
};

// Récupérer un utilisateur par son ID
export const getUserById = (userId) => {
  return users.find((u) => u.id === userId) || null;
};

// Récupérer les utilisateurs par rôle
export const getUsersByRole = (role) => {
  return users.filter((u) => u.role === role);
};

// Récupérer tous les clients
export const getClients = () => {
  return getUsersByRole('client');
};

// Récupérer tous les propriétaires
export const getOwners = () => {
  return getUsersByRole('proprietaire');
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = (userId, updates) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return users[index];
};

// Activer/Désactiver un utilisateur
export const toggleUserStatus = (userId) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index].isActive = !users[index].isActive;
  return users[index];
};

// Vérifier un utilisateur
export const verifyUser = (userId) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index].isVerified = true;
  return users[index];
};

// Rechercher des utilisateurs
export const searchUsers = (query) => {
  const searchLower = query.toLowerCase();
  return users.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.telephone.includes(query)
    );
  });
};

// Ajouter un utilisateur
export const addUser = (userData) => {
  const newUser = {
    id: userData.role === 'proprietaire' ? `owner_${Date.now()}` : `client_${Date.now()}`,
    role: userData.role || 'client',
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    address: userData.address || '',
    avatar: userData.avatar || null,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    isVerified: userData.isVerified !== undefined ? userData.isVerified : false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    ...(userData.role === 'proprietaire' && {
      rating: 0,
      totalTractors: 0,
      totalBookings: 0,
    }),
  };

  users.push(newUser);
  return newUser;
};

// Supprimer un utilisateur
export const deleteUser = (userId) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
};

// Obtenir les statistiques utilisateurs (pour admin)
export const getUserStats = () => {
  const totalUsers = users.length;
  const clients = users.filter((u) => u.role === 'client');
  const owners = users.filter((u) => u.role === 'proprietaire');
  const activeUsers = users.filter((u) => u.isActive);
  const verifiedUsers = users.filter((u) => u.isVerified);

  return {
    totalUsers,
    totalClients: clients.length,
    totalOwners: owners.length,
    activeUsers: activeUsers.length,
    verifiedUsers: verifiedUsers.length,
    inactiveUsers: totalUsers - activeUsers.length,
    unverifiedUsers: totalUsers - verifiedUsers.length,
  };
};

// Utilisateur courant (simulé)
let currentUser = users.find((u) => u.id === 'client_1');

export const getCurrentUser = () => {
  return currentUser;
};

export const setCurrentUser = (userId) => {
  currentUser = users.find((u) => u.id === userId) || null;
  return currentUser;
};

// Simuler différents utilisateurs pour le test
export const loginAs = (role) => {
  switch (role) {
    case 'client':
      currentUser = users.find((u) => u.id === 'client_1');
      break;
    case 'proprietaire':
      currentUser = users.find((u) => u.id === 'owner_1');
      break;
    case 'admin':
      currentUser = users.find((u) => u.id === 'admin_1');
      break;
    default:
      currentUser = null;
  }
  return currentUser;
};
