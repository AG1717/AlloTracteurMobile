import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import TractorCard from '../../components/ui/TractorCard';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { filterTractors, getBrands, getNearbyTractors } from '../../services/tractor.service';

// Calcul de la distance entre deux points (Haversine)
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

const DISTANCE_OPTIONS = [
  { id: 5, label: '5 km' },
  { id: 10, label: '10 km' },
  { id: 25, label: '25 km' },
  { id: 50, label: '50 km' },
  { id: 100, label: '100 km' },
  { id: null, label: 'Tous' },
];

export default function SearchScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const [filters, setFilters] = useState({
    available: true,
    minPrice: null,
    maxPrice: null,
    minPower: null,
    maxPower: null,
    brand: null,
    maxDistance: null, // Distance maximale en km
  });
  const [sortBy, setSortBy] = useState('distance'); // distance, price, rating, power

  const brands = getBrands();

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permission de localisation refusée');
        // Utiliser la position par défaut (Dakar)
        setUserLocation({
          latitude: APP_CONFIG.defaultLocation.latitude,
          longitude: APP_CONFIG.defaultLocation.longitude,
        });
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Erreur de localisation:', error);
      setLocationError('Impossible d\'obtenir votre position');
      // Utiliser la position par défaut
      setUserLocation({
        latitude: APP_CONFIG.defaultLocation.latitude,
        longitude: APP_CONFIG.defaultLocation.longitude,
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const getFilteredTractors = () => {
    let results = filterTractors({
      ...filters,
      search: searchQuery,
    });

    // Calculer la distance pour chaque tracteur si on a la position
    if (userLocation) {
      results = results.map((tractor) => ({
        ...tractor,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          tractor.location.latitude,
          tractor.location.longitude
        ),
      }));

      // Filtrer par distance maximale
      if (filters.maxDistance) {
        results = results.filter((t) => t.distance <= filters.maxDistance);
      }
    }

    // Trier les résultats
    switch (sortBy) {
      case 'distance':
        if (userLocation) {
          results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
        break;
      case 'price':
        results.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'power':
        results.sort((a, b) => b.power - a.power);
        break;
    }

    return results;
  };

  const tractors = getFilteredTractors();

  const clearFilters = () => {
    setFilters({
      available: true,
      minPrice: null,
      maxPrice: null,
      minPower: null,
      maxPower: null,
      brand: null,
      maxDistance: null,
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minPower ||
    filters.maxPower ||
    filters.maxDistance;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rechercher</Text>

          {/* Location Status */}
          <TouchableOpacity style={styles.locationBar} onPress={getLocation}>
            {locationLoading ? (
              <>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.locationText}>Recherche de votre position...</Text>
              </>
            ) : locationError ? (
              <>
                <Ionicons name="location-outline" size={18} color={colors.warning} />
                <Text style={[styles.locationText, { color: colors.warning }]}>
                  Position par défaut (Dakar)
                </Text>
                <Ionicons name="refresh" size={16} color={colors.primary} />
              </>
            ) : (
              <>
                <Ionicons name="location" size={18} color={colors.success} />
                <Text style={[styles.locationText, { color: colors.success }]}>
                  Position actuelle détectée
                </Text>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              </>
            )}
          </TouchableOpacity>

          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom, marque, modèle..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons
                name="options"
                size={22}
                color={hasActiveFilters ? colors.textWhite : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Tri */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortContainer}
          >
            {[
              { id: 'distance', label: 'Distance', icon: 'location' },
              { id: 'price', label: 'Prix', icon: 'pricetag' },
              { id: 'rating', label: 'Note', icon: 'star' },
              { id: 'power', label: 'Puissance', icon: 'speedometer' },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.id}
                style={[styles.sortChip, sortBy === sort.id && styles.sortChipActive]}
                onPress={() => setSortBy(sort.id)}
              >
                <Ionicons
                  name={sort.icon}
                  size={14}
                  color={sortBy === sort.id ? colors.textWhite : colors.textSecondary}
                />
                <Text
                  style={[styles.sortChipText, sortBy === sort.id && styles.sortChipTextActive]}
                >
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Résultats */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {tractors.length} résultat{tractors.length > 1 ? 's' : ''}
            {filters.maxDistance && ` dans ${filters.maxDistance} km`}
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilters}>Effacer les filtres</Text>
            </TouchableOpacity>
          )}
        </View>

        {tractors.length > 0 ? (
          <FlatList
            data={tractors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TractorCard
                tractor={item}
                variant="horizontal"
                showDistance={!!userLocation}
                onPress={() => router.push(`/tractor/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="search-outline"
            title="Aucun tracteur trouvé"
            description={
              filters.maxDistance
                ? `Aucun tracteur disponible dans un rayon de ${filters.maxDistance} km. Essayez d'augmenter la distance.`
                : 'Essayez de modifier vos critères de recherche ou vos filtres.'
            }
            actionLabel="Effacer les filtres"
            onAction={clearFilters}
          />
        )}

        {/* Modal des filtres */}
        <Modal
          visible={showFilters}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Distance */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelRow}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <Text style={styles.filterLabel}>Distance maximale</Text>
                </View>
                <Text style={styles.filterHint}>
                  Rechercher les tracteurs autour de votre position
                </Text>
                <View style={styles.distanceContainer}>
                  {DISTANCE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id || 'all'}
                      style={[
                        styles.distanceChip,
                        filters.maxDistance === option.id && styles.distanceChipActive,
                      ]}
                      onPress={() => setFilters({ ...filters, maxDistance: option.id })}
                    >
                      <Text
                        style={[
                          styles.distanceText,
                          filters.maxDistance === option.id && styles.distanceTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Disponibilité */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Disponibilité</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleOption, filters.available && styles.toggleOptionActive]}
                    onPress={() => setFilters({ ...filters, available: true })}
                  >
                    <Text style={[styles.toggleText, filters.available && styles.toggleTextActive]}>
                      Disponible
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleOption, filters.available === false && styles.toggleOptionActive]}
                    onPress={() => setFilters({ ...filters, available: false })}
                  >
                    <Text style={[styles.toggleText, filters.available === false && styles.toggleTextActive]}>
                      Tous
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Marque */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Marque</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.brandContainer}>
                    <TouchableOpacity
                      style={[styles.brandChip, !filters.brand && styles.brandChipActive]}
                      onPress={() => setFilters({ ...filters, brand: null })}
                    >
                      <Text style={[styles.brandText, !filters.brand && styles.brandTextActive]}>
                        Toutes
                      </Text>
                    </TouchableOpacity>
                    {brands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        style={[styles.brandChip, filters.brand === brand && styles.brandChipActive]}
                        onPress={() => setFilters({ ...filters, brand })}
                      >
                        <Text style={[styles.brandText, filters.brand === brand && styles.brandTextActive]}>
                          {brand}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Prix */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Prix par jour ({APP_CONFIG.currency.symbol})</Text>
                <View style={styles.rangeContainer}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    value={filters.minPrice?.toString() || ''}
                    onChangeText={(text) =>
                      setFilters({ ...filters, minPrice: text ? parseInt(text) : null })
                    }
                  />
                  <Text style={styles.rangeSeparator}>-</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    value={filters.maxPrice?.toString() || ''}
                    onChangeText={(text) =>
                      setFilters({ ...filters, maxPrice: text ? parseInt(text) : null })
                    }
                  />
                </View>
              </View>

              {/* Puissance */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Puissance (CV)</Text>
                <View style={styles.rangeContainer}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    value={filters.minPower?.toString() || ''}
                    onChangeText={(text) =>
                      setFilters({ ...filters, minPower: text ? parseInt(text) : null })
                    }
                  />
                  <Text style={styles.rangeSeparator}>-</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    value={filters.maxPower?.toString() || ''}
                    onChangeText={(text) =>
                      setFilters({ ...filters, maxPower: text ? parseInt(text) : null })
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Réinitialiser"
                variant="outline"
                onPress={clearFilters}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Appliquer"
                onPress={() => setShowFilters(false)}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  sortContainer: {
    marginTop: 16,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 10,
  },
  sortChipActive: {
    backgroundColor: colors.primary,
  },
  sortChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: colors.textWhite,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  clearFilters: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    marginLeft: 8,
  },
  filterHint: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 12,
    marginLeft: 28,
  },
  distanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  distanceChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  distanceChipActive: {
    backgroundColor: colors.primaryBackground,
    borderColor: colors.primary,
  },
  distanceText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  distanceTextActive: {
    color: colors.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: colors.textWhite,
  },
  brandContainer: {
    flexDirection: 'row',
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 10,
  },
  brandChipActive: {
    backgroundColor: colors.primary,
  },
  brandText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  brandTextActive: {
    color: colors.textWhite,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
    height: 50,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rangeSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: colors.textTertiary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
});
