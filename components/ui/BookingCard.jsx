import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import StatusBadge from './StatusBadge';
import TractorIcon from './TractorIcon';

export default function BookingCard({
  booking,
  onPress,
  variant = 'default', // default, compact
  showTractor = true,
  showClient = false,
  showActions = false,
  onAccept,
  onReject,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactId}>#{booking.id.slice(-6)}</Text>
          <StatusBadge status={booking.status} size="small" />
        </View>
        <Text style={styles.compactTractor} numberOfLines={1}>
          {booking.tractor?.name || 'Tracteur'}
        </Text>
        <Text style={styles.compactDate}>
          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.bookingId}>Réservation #{booking.id.slice(-6)}</Text>
          <StatusBadge status={booking.status} />
        </View>
        <Text style={styles.date}>
          {formatDate(booking.createdAt || booking.startDate)}
        </Text>
      </View>

      {showTractor && booking.tractor && (
        <View style={styles.tractorSection}>
          <View style={styles.tractorImageContainer}>
            {booking.tractor.image ? (
              <Image
                source={{ uri: booking.tractor.image }}
                style={styles.tractorImage}
              />
            ) : (
              <View style={styles.tractorImagePlaceholder}>
                <TractorIcon size={28} color={colors.textTertiary} />
              </View>
            )}
          </View>
          <View style={styles.tractorInfo}>
            <Text style={styles.tractorName}>{booking.tractor.name}</Text>
            {booking.tractor.owner && (
              <Text style={styles.ownerName}>
                Propriétaire: {booking.tractor.owner.name}
              </Text>
            )}
          </View>
        </View>
      )}

      {showClient && booking.client && (
        <View style={styles.clientSection}>
          <View style={styles.clientAvatar}>
            <Ionicons name="person" size={20} color={colors.textWhite} />
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {booking.client.prenom} {booking.client.nom}
            </Text>
            <Text style={styles.clientPhone}>{booking.client.telephone}</Text>
          </View>
          {/* Boutons de contact */}
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => {
                const phone = booking.client.telephone;
                Linking.openURL(`tel:${phone}`).catch(() => {
                  Alert.alert('Erreur', 'Impossible de passer l\'appel');
                });
              }}
            >
              <Ionicons name="call" size={18} color={colors.success} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, styles.whatsappButton]}
              onPress={() => {
                const phone = booking.client.telephone;
                // Formater pour WhatsApp (Sénégal)
                let cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
                if (cleaned.startsWith('7')) cleaned = '221' + cleaned;
                else if (!cleaned.startsWith('221')) cleaned = '221' + cleaned;

                const message = `Bonjour ${booking.client.prenom || ''}, concernant votre réservation de tracteur...`;
                const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
                Linking.openURL(url).catch(() => {
                  Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp');
                });
              }}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Début</Text>
            <Text style={styles.detailValue}>{formatDate(booking.startDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Fin</Text>
            <Text style={styles.detailValue}>{formatDate(booking.endDate)}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>{formatPrice(booking.totalPrice)}</Text>
          </View>
          {booking.paymentMethod && (
            <View style={styles.paymentMethod}>
              <Ionicons
                name={
                  booking.paymentMethod === 'orange_money' ? 'phone-portrait' :
                  booking.paymentMethod === 'wave' ? 'wallet' : 'card'
                }
                size={16}
                color={
                  booking.paymentMethod === 'orange_money' ? colors.orangeMoney :
                  booking.paymentMethod === 'wave' ? colors.wave : colors.card || '#6366f1'
                }
              />
              <Text style={styles.paymentText}>
                {booking.paymentMethod === 'orange_money' ? 'Orange Money' :
                 booking.paymentMethod === 'wave' ? 'Wave' : 'Carte'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {showActions && booking.status === 'pending' && (
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onReject}
          >
            <Ionicons name="close" size={20} color={colors.error} />
            <Text style={styles.rejectButtonText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
          >
            <Ionicons name="checkmark" size={20} color={colors.textWhite} />
            <Text style={styles.acceptButtonText}>Accepter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.viewDetails}>Voir les détails</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  bookingId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  tractorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tractorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  tractorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tractorImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
  tractorInfo: {
    flex: 1,
  },
  tractorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  whatsappButton: {
    backgroundColor: '#E8F5E9',
    borderColor: '#25D366',
  },
  detailsSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {},
  priceLabel: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  rejectButton: {
    backgroundColor: colors.errorLight,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  rejectButtonText: {
    color: colors.error,
    fontWeight: '600',
    marginLeft: 6,
  },
  acceptButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  viewDetails: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  // Compact variant
  compactCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactId: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  compactTractor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  compactDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
