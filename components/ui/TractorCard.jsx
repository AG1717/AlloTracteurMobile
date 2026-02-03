import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import StatusBadge from './StatusBadge';
import TractorIcon from './TractorIcon';

export default function TractorCard({
  tractor,
  onPress,
  variant = 'default', // default, compact, horizontal
  showOwner = true,
  showDistance = false,
  distance,
}) {
  // Use the distance prop if provided, otherwise use tractor.distance
  const displayDistance = distance ?? tractor.distance;

  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactImageContainer}>
          {tractor.image ? (
            <Image source={{ uri: tractor.image }} style={styles.compactImage} />
          ) : (
            <View style={styles.compactImagePlaceholder}>
              <TractorIcon size={28} color={colors.textTertiary} />
            </View>
          )}
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>
            {tractor.name}
          </Text>
          <Text style={styles.compactPrice}>
            {formatPrice(tractor.pricePerDay)}/jour
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress}>
        <View style={styles.horizontalImageContainer}>
          {tractor.image ? (
            <Image source={{ uri: tractor.image }} style={styles.horizontalImage} />
          ) : (
            <View style={styles.horizontalImagePlaceholder}>
              <TractorIcon size={44} color={colors.textTertiary} />
            </View>
          )}
          <StatusBadge
            status={tractor.isAvailable ? 'available' : 'unavailable'}
            style={styles.statusBadge}
          />
        </View>
        <View style={styles.horizontalContent}>
          <Text style={styles.name} numberOfLines={1}>
            {tractor.name}
          </Text>
          {tractor.power && (
            <Text style={styles.specs}>
              <Ionicons name="speedometer-outline" size={12} color={colors.textSecondary} />
              {' '}{tractor.power} CV
            </Text>
          )}
          <Text style={styles.price}>
            {formatPrice(tractor.pricePerDay)}
            <Text style={styles.priceUnit}>/jour</Text>
          </Text>
          {showDistance && displayDistance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.distance}>{displayDistance.toFixed(1)} km</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {tractor.image ? (
          <Image source={{ uri: tractor.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <TractorIcon size={56} color={colors.textTertiary} />
          </View>
        )}
        <StatusBadge
          status={tractor.isAvailable ? 'available' : 'unavailable'}
          style={styles.statusBadgeTop}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {tractor.name}
          </Text>
          {tractor.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.rating}>{tractor.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.specsRow}>
          {tractor.power && (
            <View style={styles.specItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.specText}>{tractor.power} CV</Text>
            </View>
          )}
          {tractor.year && (
            <View style={styles.specItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.specText}>{tractor.year}</Text>
            </View>
          )}
          {showDistance && displayDistance && (
            <View style={styles.specItem}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={[styles.specText, { color: colors.primary }]}>
                {displayDistance.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>
              {formatPrice(tractor.pricePerDay)}
              <Text style={styles.priceUnit}>/jour</Text>
            </Text>
          </View>
          {showOwner && tractor.owner && (
            <View style={styles.ownerContainer}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={12} color={colors.textWhite} />
              </View>
              <Text style={styles.ownerName} numberOfLines={1}>
                {tractor.owner.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Default Card
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    height: 160,
    backgroundColor: colors.backgroundSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
  statusBadgeTop: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  specsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  specText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  ownerName: {
    fontSize: 13,
    color: colors.textSecondary,
    maxWidth: 100,
  },

  // Horizontal Card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  horizontalImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  horizontalImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
  horizontalContent: {
    flex: 1,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  distance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },

  // Compact Card
  compactCard: {
    width: 140,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  compactImageContainer: {
    height: 100,
    backgroundColor: colors.backgroundSecondary,
  },
  compactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
  compactContent: {
    padding: 10,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },
  specs: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
