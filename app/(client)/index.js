import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TractorBottomSheet from '../../components/ui/TractorBottomSheet';
import TractorIcon from '../../components/ui/TractorIcon';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { getAvailableTractors, getNearbyTractors } from '../../services/tractor.service';
import { AuthContext } from '../context/AuthContext';

export default function ClientHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);

  const [location, setLocation] = useState(null);
  const [tractors, setTractors] = useState([]);
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        // Utiliser la localisation par défaut
        setLocation(APP_CONFIG.defaultLocation);
        loadTractors(APP_CONFIG.defaultLocation.latitude, APP_CONFIG.defaultLocation.longitude);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      loadTractors(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error('Erreur de localisation:', error);
      setLocation(APP_CONFIG.defaultLocation);
      loadTractors(APP_CONFIG.defaultLocation.latitude, APP_CONFIG.defaultLocation.longitude);
    }
  };

  const loadTractors = (lat, lon) => {
    const nearbyTractors = getNearbyTractors(lat, lon, 100);
    setTractors(nearbyTractors.filter((t) => t.isAvailable));
    setLoading(false);
  };

  const handleMarkerPress = (tractor) => {
    setSelectedTractor(tractor);
  };

  const handleViewTractor = () => {
    if (selectedTractor) {
      router.push(`/tractor/${selectedTractor.id}`);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carte */}
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={location}
        onPress={() => setSelectedTractor(null)}
      >
        {tractors.map((tractor) => (
          <Marker
            key={tractor.id}
            coordinate={{
              latitude: tractor.location.latitude,
              longitude: tractor.location.longitude,
            }}
            onPress={() => handleMarkerPress(tractor)}
          >
            <View
              style={[
                styles.marker,
                selectedTractor?.id === tractor.id && styles.markerSelected,
              ]}
            >
              <TractorIcon
                size={22}
                color={selectedTractor?.id === tractor.id ? colors.textWhite : colors.primary}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header avec recherche */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Bonjour, {user?.prenom || 'Utilisateur'} 👋
          </Text>
          <Text style={styles.subGreeting}>Trouvez un tracteur près de vous</Text>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(client)/search')}
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>Rechercher un tracteur...</Text>
        </TouchableOpacity>
      </View>

      {/* Compteur de tracteurs */}
      <View style={styles.tractorCount}>
        <TractorIcon size={18} color={colors.primary} />
        <Text style={styles.tractorCountText}>
          {tractors.length} tracteur{tractors.length > 1 ? 's' : ''} disponible{tractors.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Bouton de recentrage */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={initializeLocation}
      >
        <Ionicons name="locate" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Bottom Sheet pour le tracteur sélectionné */}
      {selectedTractor && (
        <TractorBottomSheet
          tractor={selectedTractor}
          onClose={() => setSelectedTractor(null)}
          onView={handleViewTractor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.textTertiary,
  },
  tractorCount: {
    position: 'absolute',
    top: 180,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tractorCountText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    transform: [{ scale: 1.1 }],
  },
});
