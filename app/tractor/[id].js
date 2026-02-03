import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Alert,
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
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { createBooking, checkAvailability } from '../../services/booking.service';
import { getTractorById } from '../../services/tractor.service';
import { AuthContext } from '../context/AuthContext';

export default function TractorDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);

  const tractor = getTractorById(id);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!tractor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>Tracteur introuvable</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    return days * tractor.pricePerDay;
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour effectuer une réservation.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/(auth)/login') },
        ]
      );
      return;
    }
    setShowBookingModal(true);
  };

  const validateDates = () => {
    if (!startDate || !endDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner les dates de location.');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      Alert.alert('Erreur', 'La date de début doit être aujourd\'hui ou plus tard.');
      return false;
    }

    if (end <= start) {
      Alert.alert('Erreur', 'La date de fin doit être après la date de début.');
      return false;
    }

    // Vérifier disponibilité
    if (!checkAvailability(tractor.id, startDate, endDate)) {
      Alert.alert('Indisponible', 'Le tracteur n\'est pas disponible pour ces dates.');
      return false;
    }

    return true;
  };

  const submitBooking = async () => {
    if (!validateDates()) return;

    setLoading(true);
    try {
      const booking = createBooking({
        tractorId: tractor.id,
        clientId: user.id,
        startDate,
        endDate,
        paymentMethod,
        notes,
      });

      setShowBookingModal(false);
      Alert.alert(
        'Demande envoyée !',
        `Votre demande de réservation a été envoyée au propriétaire.\n\nMontant total: ${formatPrice(booking.totalPrice)}\n\nVous serez notifié dès que le propriétaire aura répondu.`,
        [
          {
            text: 'Voir mes réservations',
            onPress: () => router.push('/(client)/bookings'),
          },
          { text: 'OK', onPress: () => router.back() },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du tracteur</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="car" size={80} color={colors.primary} />
          </View>
          {tractor.isAvailable ? (
            <View style={styles.availableBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.textWhite} />
              <Text style={styles.availableBadgeText}>Disponible</Text>
            </View>
          ) : (
            <View style={[styles.availableBadge, styles.unavailableBadge]}>
              <Ionicons name="close-circle" size={16} color={colors.textWhite} />
              <Text style={styles.availableBadgeText}>Indisponible</Text>
            </View>
          )}
        </View>

        {/* Tractor Info */}
        <View style={styles.infoSection}>
          <Text style={styles.tractorName}>{tractor.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color={colors.warning} />
            <Text style={styles.ratingText}>{tractor.rating?.toFixed(1) || '4.5'}</Text>
            <Text style={styles.reviewsText}>({tractor.totalReviews || 0} avis)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix par jour</Text>
            <Text style={styles.priceValue}>{formatPrice(tractor.pricePerDay)}</Text>
          </View>
        </View>

        {/* Specs */}
        <View style={styles.specsSection}>
          <Text style={styles.sectionTitle}>Caractéristiques</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="business" size={22} color={colors.primary} />
              <Text style={styles.specLabel}>Marque</Text>
              <Text style={styles.specValue}>{tractor.brand}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="construct" size={22} color={colors.primary} />
              <Text style={styles.specLabel}>Modèle</Text>
              <Text style={styles.specValue}>{tractor.model}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="speedometer" size={22} color={colors.primary} />
              <Text style={styles.specLabel}>Puissance</Text>
              <Text style={styles.specValue}>{tractor.power} CV</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="calendar" size={22} color={colors.primary} />
              <Text style={styles.specLabel}>Année</Text>
              <Text style={styles.specValue}>{tractor.year}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={22} color={colors.error} />
            <Text style={styles.locationText}>
              {tractor.location?.address || 'Dakar, Sénégal'}
            </Text>
          </View>
        </View>

        {/* Owner */}
        <View style={styles.ownerSection}>
          <Text style={styles.sectionTitle}>Propriétaire</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>
                {tractor.owner?.name?.[0] || 'P'}
              </Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{tractor.owner?.name || 'Propriétaire'}</Text>
              <Text style={styles.ownerPhone}>{tractor.owner?.phone || ''}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        {tractor.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{tractor.description}</Text>
          </View>
        )}

        {/* Equipment */}
        {tractor.equipment && tractor.equipment.length > 0 && (
          <View style={styles.equipmentSection}>
            <Text style={styles.sectionTitle}>Équipements inclus</Text>
            <View style={styles.equipmentList}>
              {tractor.equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Prix/jour</Text>
          <Text style={styles.bottomPrice}>{formatPrice(tractor.pricePerDay)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            !tractor.isAvailable && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={!tractor.isAvailable}
        >
          <Text style={styles.bookButtonText}>
            {tractor.isAvailable ? 'Louer ce tracteur' : 'Non disponible'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Réserver ce tracteur</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Tractor Summary */}
            <View style={styles.tractorSummary}>
              <View style={styles.summaryIcon}>
                <Ionicons name="car" size={32} color={colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryName}>{tractor.name}</Text>
                <Text style={styles.summaryPrice}>{formatPrice(tractor.pricePerDay)} / jour</Text>
              </View>
            </View>

            {/* Date Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Date de début *</Text>
              <View style={styles.dateInputContainer}>
                <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="AAAA-MM-JJ"
                  placeholderTextColor={colors.textTertiary}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <Text style={styles.formHint}>Format: 2026-02-15</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Date de fin *</Text>
              <View style={styles.dateInputContainer}>
                <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="AAAA-MM-JJ"
                  placeholderTextColor={colors.textTertiary}
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>

            {/* Duration & Price Summary */}
            {calculateTotalDays() > 0 && (
              <View style={styles.priceSummary}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Durée</Text>
                  <Text style={styles.priceRowValue}>{calculateTotalDays()} jour(s)</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Prix par jour</Text>
                  <Text style={styles.priceRowValue}>{formatPrice(tractor.pricePerDay)}</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(calculateTotalPrice())}</Text>
                </View>
              </View>
            )}

            {/* Payment Method */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Méthode de paiement *</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'orange_money' && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setPaymentMethod('orange_money')}
                >
                  <View style={[styles.paymentIcon, { backgroundColor: '#fff2e6' }]}>
                    <Ionicons name="phone-portrait" size={24} color={colors.orangeMoney} />
                  </View>
                  <Text style={styles.paymentName}>Orange Money</Text>
                  {paymentMethod === 'orange_money' && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'wave' && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setPaymentMethod('wave')}
                >
                  <View style={[styles.paymentIcon, { backgroundColor: '#e6e6ff' }]}>
                    <Ionicons name="wallet" size={24} color={colors.wave} />
                  </View>
                  <Text style={styles.paymentName}>Wave</Text>
                  {paymentMethod === 'wave' && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'card' && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <View style={[styles.paymentIcon, { backgroundColor: '#eef2ff' }]}>
                    <Ionicons name="card" size={24} color={colors.card} />
                  </View>
                  <Text style={styles.paymentName}>Carte Bancaire</Text>
                  {paymentMethod === 'card' && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Notes (optionnel)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Décrivez vos besoins (ex: Labour de 5 hectares)"
                placeholderTextColor={colors.textTertiary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBookingModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (loading || calculateTotalDays() === 0) && styles.submitButtonDisabled,
              ]}
              onPress={submitBooking}
              disabled={loading || calculateTotalDays() === 0}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Envoi...</Text>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Envoyer la demande</Text>
                  <Ionicons name="send" size={18} color={colors.textWhite} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unavailableBadge: {
    backgroundColor: colors.error,
  },
  availableBadgeText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tractorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  specsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  specLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  specValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  locationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  ownerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ownerPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  equipmentSection: {
    padding: 20,
  },
  equipmentList: {
    gap: 10,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  bottomPriceContainer: {},
  bottomPriceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  tractorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: {
    marginLeft: 16,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  summaryPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  formHint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  priceSummary: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  priceRowLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBackground,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  paymentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notesInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});
