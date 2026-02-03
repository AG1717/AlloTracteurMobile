import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { addTractor, getAllTractors, getBrands } from '../../services/tractor.service';
import { getOwners } from '../../services/user.service';

export default function AdminTractorsScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [tractorsList, setTractorsList] = useState(getAllTractors());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOwnerPicker, setShowOwnerPicker] = useState(false);
  const owners = getOwners();
  const brands = getBrands();

  const [newTractor, setNewTractor] = useState({
    name: '',
    brand: '',
    model: '',
    power: '',
    year: '',
    pricePerDay: '',
    description: '',
    image: null,
    selectedOwner: null,
  });

  const filteredTractors = tractorsList.filter((t) => {
    if (selectedBrand && t.brand !== selectedBrand) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(query) ||
        t.brand.toLowerCase().includes(query) ||
        t.owner.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  // Sélection de photo depuis la galerie
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewTractor({ ...newTractor, image: result.assets[0].uri });
    }
  };

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewTractor({ ...newTractor, image: result.assets[0].uri });
    }
  };

  // Choisir source de photo
  const handlePickPhoto = () => {
    Alert.alert(
      'Photo du tracteur',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImage },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  // Ajouter un tracteur
  const handleAddTractor = () => {
    if (!newTractor.name || !newTractor.pricePerDay || !newTractor.selectedOwner) {
      Alert.alert('Erreur', 'Veuillez remplir le nom, le prix et sélectionner un propriétaire');
      return;
    }

    const owner = newTractor.selectedOwner;
    const tractor = addTractor({
      name: newTractor.name,
      brand: newTractor.brand || 'Non spécifié',
      model: newTractor.model || '',
      type: 'TRACTOR',
      power: parseInt(newTractor.power) || 0,
      year: parseInt(newTractor.year) || new Date().getFullYear(),
      pricePerDay: parseInt(newTractor.pricePerDay),
      pricePerHour: Math.round(parseInt(newTractor.pricePerDay) / 7),
      isAvailable: true,
      description: newTractor.description || '',
      features: [],
      image: newTractor.image,
      location: {
        latitude: 14.7167,
        longitude: -17.4677,
        address: owner.address || 'Dakar, Sénégal',
      },
      owner: {
        id: owner.id,
        name: `${owner.prenom} ${owner.nom}`,
        phone: owner.telephone,
        rating: owner.rating || 4.5,
      },
    });

    setTractorsList([...getAllTractors()]);
    setShowAddModal(false);
    setNewTractor({
      name: '',
      brand: '',
      model: '',
      power: '',
      year: '',
      pricePerDay: '',
      description: '',
      image: null,
      selectedOwner: null,
    });

    Alert.alert('Succès', 'Tracteur ajouté avec succès !');
  };

  const renderTractorCard = ({ item }) => (
    <Card
      variant="outlined"
      style={styles.tractorCard}
      onPress={() => router.push(`/tractor/${item.id}`)}
    >
      <View style={styles.tractorHeader}>
        <View style={styles.tractorIcon}>
          <Ionicons name="car" size={24} color={colors.primary} />
        </View>
        <View style={styles.tractorInfo}>
          <Text style={styles.tractorName}>{item.name}</Text>
          <Text style={styles.tractorSpecs}>
            {item.brand} • {item.power} CV • {item.year}
          </Text>
        </View>
        <StatusBadge
          status={item.isAvailable ? 'available' : 'unavailable'}
          size="small"
        />
      </View>

      <View style={styles.tractorDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatAmount(item.pricePerDay)}/jour
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.detailText}>
              {item.rating?.toFixed(1) || '-'} ({item.totalReviews || 0})
            </Text>
          </View>
        </View>
        <View style={styles.ownerRow}>
          <View style={styles.ownerAvatar}>
            <Ionicons name="person" size={12} color={colors.textWhite} />
          </View>
          <Text style={styles.ownerName}>{item.owner.name}</Text>
          <Text style={styles.ownerPhone}>{item.owner.phone}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Tracteurs</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={24} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{tractorsList.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {tractorsList.filter((t) => t.isAvailable).length}
              </Text>
              <Text style={styles.statLabel}>Disponibles</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {tractorsList.filter((t) => !t.isAvailable).length}
              </Text>
              <Text style={styles.statLabel}>Indisponibles</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher tracteur ou propriétaire..."
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

        {/* Brand Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, !selectedBrand && styles.filterChipActive]}
            onPress={() => setSelectedBrand(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedBrand && styles.filterChipTextActive,
              ]}
            >
              Toutes marques
            </Text>
          </TouchableOpacity>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              style={[
                styles.filterChip,
                selectedBrand === brand && styles.filterChipActive,
              ]}
              onPress={() => setSelectedBrand(brand)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedBrand === brand && styles.filterChipTextActive,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tractors List */}
        {filteredTractors.length > 0 ? (
          <FlatList
            data={filteredTractors}
            keyExtractor={(item) => item.id}
            renderItem={renderTractorCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="car-outline"
            title="Aucun tracteur"
            description="Aucun tracteur ne correspond à vos critères."
          />
        )}

        {/* Modal d'ajout */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau tracteur</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Photo du tracteur */}
              <View style={styles.photoSection}>
                <Text style={styles.photoLabel}>Photo du tracteur</Text>
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={handlePickPhoto}
                >
                  {newTractor.image ? (
                    <Image
                      source={{ uri: newTractor.image }}
                      style={styles.photoPreview}
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="camera" size={48} color={colors.textTertiary} />
                      <Text style={styles.photoPlaceholderText}>
                        Ajouter une photo
                      </Text>
                    </View>
                  )}
                  <View style={styles.photoEditBadge}>
                    <Ionicons name="pencil" size={14} color={colors.textWhite} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Sélection du propriétaire */}
              <View style={styles.ownerSection}>
                <Text style={styles.sectionLabel}>Propriétaire *</Text>
                <TouchableOpacity
                  style={styles.ownerSelector}
                  onPress={() => setShowOwnerPicker(true)}
                >
                  {newTractor.selectedOwner ? (
                    <View style={styles.selectedOwner}>
                      <View style={styles.ownerAvatarSmall}>
                        <Text style={styles.ownerAvatarText}>
                          {newTractor.selectedOwner.prenom?.[0]}
                          {newTractor.selectedOwner.nom?.[0]}
                        </Text>
                      </View>
                      <View style={styles.ownerDetails}>
                        <Text style={styles.ownerNameText}>
                          {newTractor.selectedOwner.prenom} {newTractor.selectedOwner.nom}
                        </Text>
                        <Text style={styles.ownerPhoneText}>
                          {newTractor.selectedOwner.telephone}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.ownerPlaceholder}>
                      <Ionicons name="person-add" size={24} color={colors.textTertiary} />
                      <Text style={styles.ownerPlaceholderText}>
                        Sélectionner un propriétaire
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <Input
                label="Nom du tracteur *"
                placeholder="Ex: John Deere 5050D"
                value={newTractor.name}
                onChangeText={(text) => setNewTractor({ ...newTractor, name: text })}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    label="Marque"
                    placeholder="Ex: John Deere"
                    value={newTractor.brand}
                    onChangeText={(text) => setNewTractor({ ...newTractor, brand: text })}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Input
                    label="Modèle"
                    placeholder="Ex: 5050D"
                    value={newTractor.model}
                    onChangeText={(text) => setNewTractor({ ...newTractor, model: text })}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    label="Puissance (CV)"
                    placeholder="Ex: 50"
                    value={newTractor.power}
                    onChangeText={(text) => setNewTractor({ ...newTractor, power: text })}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Input
                    label="Année"
                    placeholder="Ex: 2020"
                    value={newTractor.year}
                    onChangeText={(text) => setNewTractor({ ...newTractor, year: text })}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <Input
                label={`Prix par jour (${APP_CONFIG.currency.symbol}) *`}
                placeholder="Ex: 25000"
                value={newTractor.pricePerDay}
                onChangeText={(text) => setNewTractor({ ...newTractor, pricePerDay: text })}
                keyboardType="number-pad"
              />

              <Input
                label="Description"
                placeholder="Décrivez le tracteur..."
                value={newTractor.description}
                onChangeText={(text) => setNewTractor({ ...newTractor, description: text })}
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Ajouter"
                onPress={handleAddTractor}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </SafeAreaView>
        </Modal>

        {/* Modal sélection propriétaire */}
        <Modal
          visible={showOwnerPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner propriétaire</Text>
              <TouchableOpacity onPress={() => setShowOwnerPicker(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={owners}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.ownerItem,
                    newTractor.selectedOwner?.id === item.id && styles.ownerItemSelected,
                  ]}
                  onPress={() => {
                    setNewTractor({ ...newTractor, selectedOwner: item });
                    setShowOwnerPicker(false);
                  }}
                >
                  <View style={styles.ownerItemAvatar}>
                    <Text style={styles.ownerItemAvatarText}>
                      {item.prenom?.[0]}{item.nom?.[0]}
                    </Text>
                  </View>
                  <View style={styles.ownerItemInfo}>
                    <Text style={styles.ownerItemName}>
                      {item.prenom} {item.nom}
                    </Text>
                    <Text style={styles.ownerItemPhone}>{item.telephone}</Text>
                    <Text style={styles.ownerItemMeta}>
                      {item.totalTractors || 0} tracteur(s) • Note: {item.rating?.toFixed(1) || '-'}
                    </Text>
                  </View>
                  {newTractor.selectedOwner?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
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
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  filterContainer: {
    marginTop: 12,
    maxHeight: 44,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.textWhite,
  },
  listContent: {
    padding: 20,
  },
  tractorCard: {
    marginBottom: 12,
  },
  tractorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tractorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tractorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tractorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tractorSpecs: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tractorDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  ownerPhone: {
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 8,
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
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  // Photo section
  photoSection: {
    marginBottom: 24,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Owner section
  ownerSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  ownerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOwner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textWhite,
    textTransform: 'uppercase',
  },
  ownerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  ownerNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ownerPhoneText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ownerPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerPlaceholderText: {
    fontSize: 15,
    color: colors.textTertiary,
    marginLeft: 12,
  },
  // Owner picker
  ownerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ownerItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBackground,
  },
  ownerItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerItemAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    textTransform: 'uppercase',
  },
  ownerItemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  ownerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ownerItemPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ownerItemMeta: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
});
