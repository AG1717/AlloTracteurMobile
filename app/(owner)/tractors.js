import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import {
  addTractor,
  getTractorsByOwner,
  toggleAvailability,
  updateTractor,
} from '../../services/tractor.service';
import { AuthContext } from '../context/AuthContext';

export default function TractorsScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [tractors, setTractors] = useState(
    getTractorsByOwner(user?.id || 'owner_1')
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTractorId, setEditingTractorId] = useState(null);
  const [tractorForm, setTractorForm] = useState({
    name: '',
    brand: '',
    model: '',
    power: '',
    year: '',
    pricePerDay: '',
    description: '',
    locationAddress: '',
  });

  // État pour la géolocalisation du propriétaire
  const [ownerLocation, setOwnerLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Obtenir la position du propriétaire quand le modal s'ouvre
  const getOwnerLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permission de localisation refusée');
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setOwnerLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Essayer d'obtenir l'adresse via géocodage inverse
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          const addressText = [
            address.street,
            address.city,
            address.region,
          ].filter(Boolean).join(', ');

          setTractorForm(prev => ({
            ...prev,
            locationAddress: addressText || `${address.city || 'Position actuelle'}`,
          }));
        }
      } catch (geocodeError) {
        console.log('Géocodage inverse non disponible');
      }
    } catch (error) {
      console.error('Erreur de localisation:', error);
      setLocationError('Impossible d\'obtenir votre position');
    } finally {
      setLocationLoading(false);
    }
  };

  // Ouvrir le modal pour ajouter un tracteur
  const openAddModal = () => {
    setIsEditing(false);
    setEditingTractorId(null);
    setTractorForm({
      name: '',
      brand: '',
      model: '',
      power: '',
      year: '',
      pricePerDay: '',
      description: '',
      locationAddress: '',
    });
    setShowModal(true);
    getOwnerLocation();
  };

  // Ouvrir le modal pour éditer un tracteur
  const openEditModal = (tractor) => {
    setIsEditing(true);
    setEditingTractorId(tractor.id);
    setTractorForm({
      name: tractor.name || '',
      brand: tractor.brand || '',
      model: tractor.model || '',
      power: tractor.power?.toString() || '',
      year: tractor.year?.toString() || '',
      pricePerDay: tractor.pricePerDay?.toString() || '',
      description: tractor.description || '',
      locationAddress: tractor.location?.address || '',
    });
    if (tractor.location) {
      setOwnerLocation({
        latitude: tractor.location.latitude,
        longitude: tractor.location.longitude,
      });
    }
    setShowModal(true);
  };

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  const handleToggleAvailability = (tractorId) => {
    const updated = toggleAvailability(tractorId);
    if (updated) {
      setTractors(getTractorsByOwner(user?.id || 'owner_1'));
    }
  };

  const handleSaveTractor = () => {
    if (!tractorForm.name || !tractorForm.pricePerDay) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    if (!ownerLocation) {
      Alert.alert(
        'Localisation requise',
        'Veuillez activer votre localisation pour indiquer où se trouve le tracteur.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Réessayer', onPress: getOwnerLocation },
        ]
      );
      return;
    }

    const tractorData = {
      name: tractorForm.name,
      brand: tractorForm.brand || 'Non spécifié',
      model: tractorForm.model || '',
      type: 'TRACTOR',
      power: parseInt(tractorForm.power) || 0,
      year: parseInt(tractorForm.year) || new Date().getFullYear(),
      pricePerDay: parseInt(tractorForm.pricePerDay),
      pricePerHour: Math.round(parseInt(tractorForm.pricePerDay) / 7),
      description: tractorForm.description || '',
      location: {
        latitude: ownerLocation.latitude,
        longitude: ownerLocation.longitude,
        address: tractorForm.locationAddress || 'Position du propriétaire',
      },
    };

    if (isEditing && editingTractorId) {
      // Mode édition
      const updated = updateTractor(editingTractorId, tractorData);
      if (updated) {
        setTractors(getTractorsByOwner(user?.id || 'owner_1'));
        Alert.alert('Succès', 'Tracteur modifié avec succès !');
      } else {
        Alert.alert('Erreur', 'Impossible de modifier le tracteur');
        return;
      }
    } else {
      // Mode ajout
      const tractor = addTractor({
        ...tractorData,
        isAvailable: true,
        features: [],
        image: null,
        owner: {
          id: user?.id || 'owner_1',
          name: `${user?.prenom || ''} ${user?.nom || ''}`.trim() || 'Propriétaire',
          phone: user?.telephone || '',
          rating: user?.rating || 4.5,
        },
      });
      setTractors([...tractors, tractor]);
      Alert.alert('Succès', 'Tracteur ajouté avec succès !');
    }

    // Réinitialiser le formulaire
    setShowModal(false);
    setTractorForm({
      name: '',
      brand: '',
      model: '',
      power: '',
      year: '',
      pricePerDay: '',
      description: '',
      locationAddress: '',
    });
    setOwnerLocation(null);
    setIsEditing(false);
    setEditingTractorId(null);
  };

  const renderTractorCard = ({ item }) => (
    <Card variant="elevated" style={styles.tractorCard}>
      <View style={styles.tractorHeader}>
        <View style={styles.tractorIcon}>
          <Ionicons name="car" size={28} color={colors.primary} />
        </View>
        <View style={styles.tractorInfo}>
          <Text style={styles.tractorName}>{item.name}</Text>
          <Text style={styles.tractorSpecs}>
            {item.power} CV • {item.year}
          </Text>
        </View>
        <View style={styles.availabilityToggle}>
          <Text style={styles.availabilityLabel}>
            {item.isAvailable ? 'Dispo' : 'Indispo'}
          </Text>
          <Switch
            value={item.isAvailable}
            onValueChange={() => handleToggleAvailability(item.id)}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={item.isAvailable ? colors.primary : colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.tractorBody}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Prix journalier</Text>
          <Text style={styles.priceValue}>{formatAmount(item.pricePerDay)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.statText}>{item.rating?.toFixed(1) || '-'}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.totalReviews || 0} avis</Text>
          </View>
        </View>
      </View>

      <View style={styles.tractorActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/tractor/${item.id}`)}
        >
          <Ionicons name="eye-outline" size={20} color={colors.primary} />
          <Text style={styles.actionBtnText}>Voir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.info} />
          <Text style={[styles.actionBtnText, { color: colors.info }]}>
            Modifier
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Mes tracteurs</Text>
            <Text style={styles.subtitle}>{tractors.length} tracteur(s)</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Liste des tracteurs */}
        {tractors.length > 0 ? (
          <FlatList
            data={tractors}
            keyExtractor={(item) => item.id}
            renderItem={renderTractorCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="car-outline"
            title="Aucun tracteur"
            description="Ajoutez votre premier tracteur pour commencer à recevoir des réservations."
            actionLabel="Ajouter un tracteur"
            onAction={openAddModal}
          />
        )}

        {/* Modal d'ajout/édition */}
        <Modal
          visible={showModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Modifier le tracteur' : 'Nouveau tracteur'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Section Localisation */}
              <View style={styles.locationSection}>
                <Text style={styles.locationSectionTitle}>
                  <Ionicons name="location" size={18} color={colors.primary} /> Localisation du tracteur
                </Text>

                {locationLoading ? (
                  <View style={styles.locationStatus}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.locationStatusText}>
                      Recherche de votre position...
                    </Text>
                  </View>
                ) : locationError ? (
                  <TouchableOpacity style={styles.locationStatusError} onPress={getOwnerLocation}>
                    <Ionicons name="warning" size={20} color={colors.error} />
                    <Text style={styles.locationStatusTextError}>{locationError}</Text>
                    <Text style={styles.locationRetry}>Réessayer</Text>
                  </TouchableOpacity>
                ) : ownerLocation ? (
                  <View style={styles.locationStatusSuccess}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationStatusTextSuccess}>Position détectée</Text>
                      <Text style={styles.locationAddress}>
                        {tractorForm.locationAddress || `${ownerLocation.latitude.toFixed(4)}, ${ownerLocation.longitude.toFixed(4)}`}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={getOwnerLocation}>
                      <Ionicons name="refresh" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.locationStatusError} onPress={getOwnerLocation}>
                    <Ionicons name="location-outline" size={20} color={colors.warning} />
                    <Text style={styles.locationStatusText}>Appuyez pour détecter la position</Text>
                  </TouchableOpacity>
                )}

                <Input
                  label="Adresse (optionnel)"
                  placeholder="Ex: Thiès, Quartier Médina"
                  value={tractorForm.locationAddress}
                  onChangeText={(text) =>
                    setTractorForm({ ...tractorForm, locationAddress: text })
                  }
                />
              </View>

              <Input
                label="Nom du tracteur *"
                placeholder="Ex: John Deere 5050D"
                value={tractorForm.name}
                onChangeText={(text) =>
                  setTractorForm({ ...tractorForm, name: text })
                }
              />

              <Input
                label="Marque"
                placeholder="Ex: John Deere"
                value={tractorForm.brand}
                onChangeText={(text) =>
                  setTractorForm({ ...tractorForm, brand: text })
                }
              />

              <Input
                label="Modèle"
                placeholder="Ex: 5050D"
                value={tractorForm.model}
                onChangeText={(text) =>
                  setTractorForm({ ...tractorForm, model: text })
                }
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    label="Puissance (CV)"
                    placeholder="Ex: 50"
                    value={tractorForm.power}
                    onChangeText={(text) =>
                      setTractorForm({ ...tractorForm, power: text })
                    }
                    keyboardType="number-pad"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Input
                    label="Année"
                    placeholder="Ex: 2020"
                    value={tractorForm.year}
                    onChangeText={(text) =>
                      setTractorForm({ ...tractorForm, year: text })
                    }
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <Input
                label={`Prix par jour (${APP_CONFIG.currency.symbol}) *`}
                placeholder="Ex: 25000"
                value={tractorForm.pricePerDay}
                onChangeText={(text) =>
                  setTractorForm({ ...tractorForm, pricePerDay: text })
                }
                keyboardType="number-pad"
              />

              <Input
                label="Description"
                placeholder="Décrivez votre tracteur..."
                value={tractorForm.description}
                onChangeText={(text) =>
                  setTractorForm({ ...tractorForm, description: text })
                }
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title={isEditing ? 'Modifier' : 'Ajouter'}
                onPress={handleSaveTractor}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tractorCard: {
    marginBottom: 16,
  },
  tractorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tractorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tractorInfo: {
    flex: 1,
    marginLeft: 14,
  },
  tractorName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tractorSpecs: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  availabilityToggle: {
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  tractorBody: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tractorActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'center',
    gap: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
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
  row: {
    flexDirection: 'row',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Location section styles
  locationSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  locationSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationStatusText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  locationStatusError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  locationStatusTextError: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 10,
    flex: 1,
  },
  locationRetry: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  locationStatusSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.success,
  },
  locationStatusTextSuccess: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 10,
  },
  locationAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
