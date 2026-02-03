import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

const STATUS_CONFIG = {
  // Disponibilité
  available: {
    label: 'Disponible',
    backgroundColor: colors.successLight,
    textColor: colors.success,
  },
  unavailable: {
    label: 'Indisponible',
    backgroundColor: colors.errorLight,
    textColor: colors.error,
  },
  // Statuts de réservation
  pending: {
    label: 'En attente',
    backgroundColor: colors.warningLight,
    textColor: colors.warning,
  },
  confirmed: {
    label: 'Confirmée',
    backgroundColor: colors.successLight,
    textColor: colors.success,
  },
  in_progress: {
    label: 'En cours',
    backgroundColor: colors.infoLight,
    textColor: colors.info,
  },
  completed: {
    label: 'Terminée',
    backgroundColor: colors.successLight,
    textColor: colors.success,
  },
  cancelled: {
    label: 'Annulée',
    backgroundColor: colors.errorLight,
    textColor: colors.error,
  },
  // Utilisateurs
  active: {
    label: 'Actif',
    backgroundColor: colors.successLight,
    textColor: colors.success,
  },
  inactive: {
    label: 'Inactif',
    backgroundColor: colors.backgroundTertiary,
    textColor: colors.textSecondary,
  },
  blocked: {
    label: 'Bloqué',
    backgroundColor: colors.errorLight,
    textColor: colors.error,
  },
  // Paiement
  paid: {
    label: 'Payé',
    backgroundColor: colors.successLight,
    textColor: colors.success,
  },
  unpaid: {
    label: 'Non payé',
    backgroundColor: colors.warningLight,
    textColor: colors.warning,
  },
  refunded: {
    label: 'Remboursé',
    backgroundColor: colors.infoLight,
    textColor: colors.info,
  },
};

export default function StatusBadge({
  status,
  label,
  size = 'medium', // small, medium, large
  style,
}) {
  const config = STATUS_CONFIG[status] || {
    label: label || status,
    backgroundColor: colors.backgroundTertiary,
    textColor: colors.textSecondary,
  };

  const displayLabel = label || config.label;

  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${size}`],
        { backgroundColor: config.backgroundColor },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.textColor }]} />
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: config.textColor },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badge_small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge_medium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badge_large: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 10,
  },
  text_medium: {
    fontSize: 12,
  },
  text_large: {
    fontSize: 14,
  },
});
