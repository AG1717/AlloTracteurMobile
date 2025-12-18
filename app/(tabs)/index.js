// app/(tabs)/index.js ou app/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('Touba, Sénégal');
  const [tracteurs, setTracteurs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTracteurs();
  }, []);

  const loadTracteurs = async () => {
    // Simulation de chargement
    const mockTracteurs = [
      {
        id: 1,
        nom: 'John Deere 6120M',
        proprietaire: 'Moussa Diop',
        prix: 15000,
        note: 4.5,
        nombreAvis: 23,
        distance: 2.3,
        disponible: true,
        photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        caracteristiques: {
          puissance: '120 CV',
          annee: 2020,
        }
      },
      {
        id: 2,
        nom: 'Massey Ferguson 5710',
        proprietaire: 'Abdou Sall',
        prix: 12000,
        note: 4.8,
        nombreAvis: 45,
        distance: 3.7,
        disponible: true,
        photo: 'https://images.unsplash.com/photo-1589642380614-4a8c2147b857?w=400',
        caracteristiques: {
          puissance: '110 CV',
          annee: 2019,
        }
      },
      {
        id: 3,
        nom: 'New Holland T7.270',
        proprietaire: 'Fatou Kane',
        prix: 18000,
        note: 4.2,
        nombreAvis: 12,
        distance: 5.1,
        disponible: false,
        photo: 'https://images.unsplash.com/photo-1574272081949-e7ec634b1c05?w=400',
        caracteristiques: {
          puissance: '270 CV',
          annee: 2021,
        }
      },
      {
        id: 4,
        nom: 'Case IH Puma 185',
        proprietaire: 'Ibrahima Ndiaye',
        prix: 16000,
        note: 4.6,
        nombreAvis: 18,
        distance: 4.2,
        disponible: true,
        photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        caracteristiques: {
          puissance: '185 CV',
          annee: 2020,
        }
      },
    ];
    setTracteurs(mockTracteurs);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTracteurs();
    setRefreshing(false);
  };

  const handleReservation = (tracteur) => {
    if (!tracteur.disponible) {
      alert('Ce tracteur n\'est pas disponible pour le moment');
      return;
    }
    router.push({
      pathname: '/booking',
      params: { tracteurId: tracteur.id }
    });
  };

  const renderStars = (note) => {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color="#facc15" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#facc15" />);
    }
    const emptyStars = 5 - Math.ceil(note);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#facc15" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.userName}>Bienvenue</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#1e293b" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Ionicons name="location-outline" size={20} color="#22c55e" />
            <TextInput
              style={styles.searchInput}
              value={searchLocation}
              onChangeText={setSearchLocation}
              placeholder="Où êtes-vous ?"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Carte miniature */}
          <TouchableOpacity 
            style={styles.mapContainer}
            onPress={() => router.push('/map')}
            activeOpacity={0.8}
          >
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={40} color="#22c55e" />
              <Text style={styles.mapText}>Voir la carte</Text>
            </View>
            <View style={styles.mapOverlay}>
              <View style={styles.mapBadge}>
                <Ionicons name="tractor" size={16} color="#22c55e" />
                <Text style={styles.mapBadgeText}>{tracteurs.length} tracteurs</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Filtres rapides */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.filterChipTextActive}>Disponible maintenant</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="cash-outline" size={16} color="#64748b" />
                <Text style={styles.filterChipText}>Prix croissant</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="star-outline" size={16} color="#64748b" />
                <Text style={styles.filterChipText}>Mieux notés</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="navigate-outline" size={16} color="#64748b" />
                <Text style={styles.filterChipText}>Plus proches</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Section tracteurs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tracteurs disponibles</Text>
              <TouchableOpacity onPress={() => router.push('/search')}>
                <Text style={styles.sectionLink}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            {tracteurs.map((tracteur) => (
              <TouchableOpacity
                key={tracteur.id}
                style={styles.tracteurCard}
                onPress={() => handleReservation(tracteur)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: tracteur.photo }} 
                  style={styles.tracteurImage}
                  resizeMode="cover"
                />
                
                <View style={styles.tracteurInfo}>
                  <View style={styles.tracteurHeader}>
                    <Text style={styles.tracteurName} numberOfLines={1}>
                      {tracteur.nom}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      tracteur.disponible ? styles.statusAvailable : styles.statusUnavailable
                    ]}>
                      <View style={[
                        styles.statusDot,
                        tracteur.disponible ? styles.statusDotAvailable : styles.statusDotUnavailable
                      ]} />
                      <Text style={[
                        styles.statusText,
                        tracteur.disponible ? styles.statusTextAvailable : styles.statusTextUnavailable
                      ]}>
                        {tracteur.disponible ? 'Disponible' : 'Occupé'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.proprietaire}>{tracteur.proprietaire}</Text>

                  <View style={styles.tracteurDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="speedometer-outline" size={14} color="#64748b" />
                      <Text style={styles.detailText}>{tracteur.caracteristiques.puissance}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text style={styles.detailText}>{tracteur.caracteristiques.annee}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="location-outline" size={14} color="#64748b" />
                      <Text style={styles.detailText}>{tracteur.distance} km</Text>
                    </View>
                  </View>

                  <View style={styles.tracteurFooter}>
                    <View style={styles.ratingContainer}>
                      <View style={styles.stars}>{renderStars(tracteur.note)}</View>
                      <Text style={styles.ratingText}>
                        {tracteur.note} ({tracteur.nombreAvis})
                      </Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{tracteur.prix.toLocaleString()} FCFA</Text>
                      <Text style={styles.priceUnit}>/heure</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bannière promotionnelle */}
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Première réservation ?</Text>
              <Text style={styles.promoText}>Profitez de -20% sur votre première course</Text>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Utiliser</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 180,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0fdf4',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  filterChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterChipTextActive: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionLink: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  tracteurCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tracteurImage: {
    width: '100%',
    height: 180,
  },
  tracteurInfo: {
    padding: 16,
  },
  tracteurHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tracteurName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#f0fdf4',
  },
  statusUnavailable: {
    backgroundColor: '#f8fafc',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusDotAvailable: {
    backgroundColor: '#22c55e',
  },
  statusDotUnavailable: {
    backgroundColor: '#94a3b8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#22c55e',
  },
  statusTextUnavailable: {
    color: '#94a3b8',
  },
  proprietaire: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  tracteurDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  tracteurFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  priceUnit: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 2,
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  promoText: {
    fontSize: 14,
    color: '#f0fdf4',
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
});