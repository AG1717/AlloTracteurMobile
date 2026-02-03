import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { users } from '../../services/user.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUserToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, roleOverride = null) => {
    try {
      setIsLoading(true);

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Trouver l'utilisateur par email dans les données mock
      let mockUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // Si roleOverride est fourni (pour le quick login), trouver l'utilisateur par rôle
      if (roleOverride) {
        mockUser = users.find((u) => u.role === roleOverride);
      }

      if (!mockUser) {
        // L'utilisateur n'existe pas
        setIsLoading(false);
        return {
          success: false,
          error: 'Email ou mot de passe incorrect',
        };
      }

      const mockToken = 'token_' + mockUser.id + '_' + Date.now();

      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));

      setUserToken(mockToken);
      setUser(mockUser);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Vérifier si l'email existe déjà
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === userData.email?.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Créer le nouvel utilisateur (mock)
      const newUser = {
        id: userData.role === 'proprietaire' ? `owner_${Date.now()}` : `client_${Date.now()}`,
        role: userData.role,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        telephone: userData.telephone,
        address: '',
        avatar: null,
        isActive: true,
        isVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...(userData.role === 'proprietaire' && {
          rating: 0,
          totalTractors: 0,
          totalBookings: 0,
        }),
      };

      // Ajouter à la liste (en mémoire seulement)
      users.push(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Effacer d'abord l'état local pour une déconnexion immédiate
      setUserToken(null);
      setUser(null);
      // Puis effacer le stockage persistant
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'Non connecté' };

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper pour vérifier le rôle
  const isClient = () => user?.role === 'client';
  const isOwner = () => user?.role === 'proprietaire';
  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isLoading,
        isAuthenticated: !!userToken,
        login,
        register,
        logout,
        updateProfile,
        isClient,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
