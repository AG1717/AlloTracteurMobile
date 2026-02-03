import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import TractorIcon from './TractorIcon';

export default function TractorBottomSheet({ tractor, onClose, onView }) {
  if (!tractor) return null;

  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <TractorIcon size={32} color={colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {tractor.name}
              </Text>
              <View style={styles.ratingRow}>
                {tractor.rating && (
                  <>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={styles.rating}>{tractor.rating.toFixed(1)}</Text>
                    <Text style={styles.reviews}>
                      ({tractor.totalReviews || 0} avis)
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText}>{tractor.power} CV</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText}>{tractor.year}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {tractor.distance ? `${tractor.distance.toFixed(1)} km` : tractor.location?.address || 'Dakar'}
            </Text>
          </View>
        </View>

        {/* Owner */}
        <View style={styles.ownerRow}>
          <View style={styles.ownerAvatar}>
            <Ionicons name="person" size={14} color={colors.textWhite} />
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{tractor.owner?.name || 'Propriétaire'}</Text>
            <Text style={styles.ownerPhone}>{tractor.owner?.phone || ''}</Text>
          </View>
          <View style={styles.availabilityBadge}>
            <View
              style={[
                styles.availabilityDot,
                { backgroundColor: tractor.isAvailable ? colors.success : colors.error },
              ]}
            />
            <Text
              style={[
                styles.availabilityText,
                { color: tractor.isAvailable ? colors.success : colors.error },
              ]}
            >
              {tractor.isAvailable ? 'Disponible' : 'Indisponible'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Prix</Text>
            <Text style={styles.price}>{formatPrice(tractor.pricePerDay)}</Text>
            <Text style={styles.priceUnit}>/jour</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.viewButton,
              !tractor.isAvailable && styles.viewButtonDisabled,
            ]}
            onPress={onView}
            disabled={!tractor.isAvailable}
          >
            <Text style={styles.viewButtonText}>
              {tractor.isAvailable ? 'Voir détails' : 'Non disponible'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.textWhite}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
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
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ownerPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  viewButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});
