import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  RefreshControl,
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
import { STATUS_LABELS } from '../../constants/config';
import {
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from '../../services/booking.service';
import {
  getReviewByBooking,
  createReview,
} from '../../services/review.service';
import { AuthContext } from '../context/AuthContext';

export default function BookingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Simulation suivi temps réel
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    loadBookingData();
  }, [id]);

  useEffect(() => {
    // Simuler le suivi en temps réel pour les réservations en cours
    if (booking?.status === 'in_progress') {
      simulateTracking();
      const interval = setInterval(simulateTracking, 30000); // Mise à jour toutes les 30s
      return () => clearInterval(interval);
    }
  }, [booking?.status]);

  const loadBookingData = () => {
    const bookingData = getBookingById(id);
    setBooking(bookingData);

    if (bookingData) {
      const existingReview = getReviewByBooking(bookingData.id);
      setReview(existingReview);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookingData();
    setRefreshing(false);
  };

  const simulateTracking = () => {
    // Simuler les données de suivi en temps réel
    const stages = [
      { id: 1, label: 'Tracteur en route', time: '08:30', completed: true },
      { id: 2, label: 'Arrivé sur le terrain', time: '09:15', completed: true },
      { id: 3, label: 'Travail en cours', time: '09:30', completed: true },
      { id: 4, label: 'Travail terminé', time: null, completed: false },
      { id: 5, label: 'Retour du tracteur', time: null, completed: false },
    ];

    setTrackingInfo({
      currentStage: 3,
      stages,
      lastUpdate: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      estimatedCompletion: '16:00',
      tractorLocation: {
        latitude: 14.7167 + (Math.random() - 0.5) * 0.01,
        longitude: -17.4677 + (Math.random() - 0.5) * 0.01,
      },
    });
  };

  const formatPrice = (price) => {
    return `${price?.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: colors.warning,
      confirmed: colors.info,
      in_progress: colors.primary,
      completed: colors.success,
      cancelled: colors.error,
    };
    return statusColors[status] || colors.textSecondary;
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            try {
              cancelBooking(booking.id, 'Annulé par le client');
              loadBookingData();
              Alert.alert('Succès', 'La réservation a été annulée.');
            } catch (error) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert('Erreur', 'Veuillez ajouter un commentaire.');
      return;
    }

    setSubmitting(true);
    try {
      const newReview = createReview({
        bookingId: booking.id,
        tractorId: booking.tractorId,
        clientId: user.id,
        ownerId: booking.ownerId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReview(newReview);
      setShowReviewModal(false);
      Alert.alert('Merci !', 'Votre avis a été envoyé avec succès.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 20) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && setReviewRating(i)}
          disabled={!interactive}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={colors.warning}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>Réservation introuvable</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réservation #{booking.id.slice(-6)}</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: getStatusColor(booking.status) + '15' }]}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Ionicons
              name={
                booking.status === 'completed' ? 'checkmark-circle' :
                booking.status === 'cancelled' ? 'close-circle' :
                booking.status === 'in_progress' ? 'play-circle' :
                booking.status === 'confirmed' ? 'checkmark' : 'time'
              }
              size={20}
              color={colors.textWhite}
            />
            <Text style={styles.statusText}>{STATUS_LABELS[booking.status]}</Text>
          </View>
          <Text style={styles.statusDate}>
            Créée le {formatDate(booking.createdAt)}
          </Text>
        </View>

        {/* Suivi en temps réel */}
        {booking.status === 'in_progress' && trackingInfo && (
          <View style={styles.trackingSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Suivi en temps réel</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>EN DIRECT</Text>
              </View>
            </View>

            <View style={styles.trackingCard}>
              <Text style={styles.trackingUpdate}>
                Dernière mise à jour : {trackingInfo.lastUpdate}
              </Text>

              {/* Timeline */}
              <View style={styles.timeline}>
                {trackingInfo.stages.map((stage, index) => (
                  <View key={stage.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          stage.completed && styles.timelineDotCompleted,
                          trackingInfo.currentStage === stage.id && styles.timelineDotCurrent,
                        ]}
                      >
                        {stage.completed && (
                          <Ionicons name="checkmark" size={12} color={colors.textWhite} />
                        )}
                      </View>
                      {index < trackingInfo.stages.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            stage.completed && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          stage.completed && styles.timelineLabelCompleted,
                        ]}
                      >
                        {stage.label}
                      </Text>
                      {stage.time && (
                        <Text style={styles.timelineTime}>{stage.time}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.estimatedTime}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <Text style={styles.estimatedTimeText}>
                  Fin estimée : {trackingInfo.estimatedCompletion}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Tractor Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracteur</Text>
          <TouchableOpacity
            style={styles.tractorCard}
            onPress={() => router.push(`/tractor/${booking.tractorId}`)}
          >
            <View style={styles.tractorIcon}>
              <Ionicons name="car" size={32} color={colors.primary} />
            </View>
            <View style={styles.tractorInfo}>
              <Text style={styles.tractorName}>{booking.tractor?.name || 'Tracteur'}</Text>
              <Text style={styles.tractorDetails}>
                {booking.tractor?.power} CV • {booking.tractor?.brand}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de la réservation</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Début</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.startDate)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fin</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.endDate)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Durée</Text>
                  <Text style={styles.detailValue}>{booking.totalDays} jour(s)</Text>
                </View>
              </View>
            </View>
            {booking.notes && (
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Notes</Text>
                    <Text style={styles.detailValue}>{booking.notes}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paiement</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Prix par jour</Text>
              <Text style={styles.paymentValue}>{formatPrice(booking.pricePerDay)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Nombre de jours</Text>
              <Text style={styles.paymentValue}>x {booking.totalDays}</Text>
            </View>
            <View style={[styles.paymentRow, styles.paymentTotal]}>
              <Text style={styles.paymentTotalLabel}>Total</Text>
              <Text style={styles.paymentTotalValue}>{formatPrice(booking.totalPrice)}</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons
                name={
                  booking.paymentMethod === 'orange_money' ? 'phone-portrait' :
                  booking.paymentMethod === 'wave' ? 'wallet' : 'card'
                }
                size={20}
                color={
                  booking.paymentMethod === 'orange_money' ? colors.orangeMoney :
                  booking.paymentMethod === 'wave' ? colors.wave : colors.card
                }
              />
              <Text style={styles.paymentMethodText}>
                {booking.paymentMethod === 'orange_money' ? 'Orange Money' :
                 booking.paymentMethod === 'wave' ? 'Wave' : 'Carte Bancaire'}
              </Text>
              <View
                style={[
                  styles.paymentStatusBadge,
                  {
                    backgroundColor:
                      booking.paymentStatus === 'paid' ? colors.successLight :
                      booking.paymentStatus === 'refunded' ? colors.warningLight : colors.errorLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.paymentStatusText,
                    {
                      color:
                        booking.paymentStatus === 'paid' ? colors.success :
                        booking.paymentStatus === 'refunded' ? colors.warning : colors.error,
                    },
                  ]}
                >
                  {booking.paymentStatus === 'paid' ? 'Payé' :
                   booking.paymentStatus === 'refunded' ? 'Remboursé' : 'En attente'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Review Section */}
        {booking.status === 'completed' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avis</Text>
            {review ? (
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                {review.response && (
                  <View style={styles.reviewResponse}>
                    <Text style={styles.reviewResponseLabel}>Réponse du propriétaire :</Text>
                    <Text style={styles.reviewResponseText}>{review.response}</Text>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="star-outline" size={24} color={colors.primary} />
                <Text style={styles.addReviewText}>Donner mon avis</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Actions */}
        {['pending', 'confirmed'].includes(booking.status) && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelBooking}
            >
              <Ionicons name="close-circle-outline" size={22} color={colors.error} />
              <Text style={styles.cancelButtonText}>Annuler la réservation</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contact Owner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Besoin d'aide ?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call-outline" size={22} color={colors.primary} />
            <Text style={styles.contactButtonText}>Contacter le propriétaire</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReviewModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Donner mon avis</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.reviewTractorInfo}>
              <View style={styles.reviewTractorIcon}>
                <Ionicons name="car" size={32} color={colors.primary} />
              </View>
              <Text style={styles.reviewTractorName}>{booking.tractor?.name}</Text>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Votre note</Text>
              <View style={styles.ratingStars}>
                {renderStars(reviewRating, true, 36)}
              </View>
              <Text style={styles.ratingText}>
                {reviewRating === 5 ? 'Excellent !' :
                 reviewRating === 4 ? 'Très bien' :
                 reviewRating === 3 ? 'Correct' :
                 reviewRating === 2 ? 'Décevant' : 'Mauvais'}
              </Text>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Votre commentaire</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Décrivez votre expérience avec ce tracteur..."
                placeholderTextColor={colors.textTertiary}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={5}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.submitReviewButton, submitting && styles.submitReviewButtonDisabled]}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <Text style={styles.submitReviewButtonText}>Envoi en cours...</Text>
              ) : (
                <>
                  <Text style={styles.submitReviewButtonText}>Envoyer mon avis</Text>
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
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginLeft: 8,
  },
  statusDate: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },
  trackingSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.error,
  },
  trackingCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
  },
  trackingUpdate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  timeline: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
  },
  timelineDotCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 14,
    paddingBottom: 24,
  },
  timelineLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timelineLabelCompleted: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  timelineTime: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBackground,
    padding: 12,
    borderRadius: 10,
  },
  estimatedTimeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  tractorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 16,
  },
  tractorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tractorInfo: {
    flex: 1,
    marginLeft: 14,
  },
  tractorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tractorDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  paymentCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  paymentTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  reviewComment: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  reviewResponse: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reviewResponseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reviewResponseText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBackground,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addReviewText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorLight,
    padding: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 10,
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
  reviewTractorInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reviewTractorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewTractorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  ratingStars: {
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  submitReviewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitReviewButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  submitReviewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});
