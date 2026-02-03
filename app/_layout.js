import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Composant qui gère la redirection basée sur l'authentification
function AuthRedirectHandler({ children }) {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (isLoading) return;

    // Pages publiques (pas besoin d'être connecté)
    const inAuthArea = segments[0] === '(auth)';
    const isIndexPage = segments.length === 0 || segments[0] === 'index' || !segments[0];

    // Vérifie si l'utilisateur est dans une zone protégée
    const inProtectedArea =
      segments[0] === '(client)' ||
      segments[0] === '(owner)' ||
      segments[0] === '(admin)' ||
      segments[0] === 'map' ||
      segments[0] === 'tractor' ||
      segments[0] === 'booking';

    // Si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      // Et qu'il est dans une zone protégée, rediriger vers l'accueil
      if (inProtectedArea) {
        router.replace('/');
      }
    } else {
      // Utilisateur connecté
      // S'il est sur la page d'accueil ou dans (auth), rediriger vers son espace
      if (isIndexPage || inAuthArea) {
        if (user?.role === 'admin') {
          router.replace('/(admin)');
        } else if (user?.role === 'proprietaire') {
          router.replace('/(owner)');
        } else {
          router.replace('/(client)');
        }
      }
    }
  }, [isAuthenticated, isLoading, segments, user]);

  return children;
}

// Layout interne avec accès au contexte
function RootLayoutNav() {
  return (
    <AuthRedirectHandler>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Écran d'accueil */}
        <Stack.Screen name="index" />

        {/* Authentification */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Espace Client */}
        <Stack.Screen name="(client)" options={{ headerShown: false }} />

        {/* Espace Propriétaire */}
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />

        {/* Espace Admin */}
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />

        {/* Écrans partagés */}
        <Stack.Screen
          name="tractor/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="booking/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </AuthRedirectHandler>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
