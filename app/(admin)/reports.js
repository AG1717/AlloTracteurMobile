import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../../components/ui/Card';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { getAllBookings } from '../../services/booking.service';
import { getPaymentStats } from '../../services/payment.service';
import { getAllTractors } from '../../services/tractor.service';
import { getUserStats } from '../../services/user.service';

export default function ReportsScreen() {
  const userStats = getUserStats();
  const tractors = getAllTractors();
  const bookings = getAllBookings();
  const paymentStats = getPaymentStats();

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  // Calculate booking stats
  const bookingsByStatus = {
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    in_progress: bookings.filter((b) => b.status === 'in_progress').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rapports</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color={colors.primary} />
            <Text style={styles.exportButtonText}>Exporter</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Card */}
        <Card variant="elevated" style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Vue d'ensemble</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="people" size={28} color={colors.info} />
              <Text style={styles.overviewValue}>{userStats.totalUsers}</Text>
              <Text style={styles.overviewLabel}>Utilisateurs</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="car" size={28} color={colors.primary} />
              <Text style={styles.overviewValue}>{tractors.length}</Text>
              <Text style={styles.overviewLabel}>Tracteurs</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="calendar" size={28} color={colors.warning} />
              <Text style={styles.overviewValue}>{bookings.length}</Text>
              <Text style={styles.overviewLabel}>Réservations</Text>
            </View>
            <View style={styles.overviewItem}>
              <Ionicons name="cash" size={28} color={colors.success} />
              <Text style={styles.overviewValue}>{formatAmount(totalRevenue)}</Text>
              <Text style={styles.overviewLabel}>Revenus</Text>
            </View>
          </View>
        </Card>

        {/* Bookings Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réservations par statut</Text>
          <Card variant="outlined" style={styles.statusCard}>
            {[
              { key: 'pending', label: 'En attente', color: colors.warning },
              { key: 'confirmed', label: 'Confirmées', color: colors.info },
              { key: 'in_progress', label: 'En cours', color: colors.primary },
              { key: 'completed', label: 'Terminées', color: colors.success },
              { key: 'cancelled', label: 'Annulées', color: colors.error },
            ].map((status, index) => (
              <View
                key={status.key}
                style={[
                  styles.statusRow,
                  index < 4 && styles.statusRowBorder,
                ]}
              >
                <View style={styles.statusInfo}>
                  <View
                    style={[styles.statusDot, { backgroundColor: status.color }]}
                  />
                  <Text style={styles.statusLabel}>{status.label}</Text>
                </View>
                <Text style={styles.statusValue}>
                  {bookingsByStatus[status.key]}
                </Text>
                <View style={styles.statusBar}>
                  <View
                    style={[
                      styles.statusBarFill,
                      {
                        backgroundColor: status.color,
                        width: `${
                          bookings.length > 0
                            ? (bookingsByStatus[status.key] / bookings.length) *
                              100
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Users Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition utilisateurs</Text>
          <Card variant="outlined" style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownIcon, { backgroundColor: colors.infoLight }]}>
                  <Ionicons name="person" size={20} color={colors.info} />
                </View>
                <View>
                  <Text style={styles.breakdownValue}>{userStats.totalClients}</Text>
                  <Text style={styles.breakdownLabel}>Clients</Text>
                </View>
              </View>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownIcon, { backgroundColor: colors.primaryBackground }]}>
                  <Ionicons name="car" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.breakdownValue}>{userStats.totalOwners}</Text>
                  <Text style={styles.breakdownLabel}>Propriétaires</Text>
                </View>
              </View>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownIcon, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.breakdownValue}>{userStats.verifiedUsers}</Text>
                  <Text style={styles.breakdownLabel}>Vérifiés</Text>
                </View>
              </View>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownIcon, { backgroundColor: colors.errorLight }]}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </View>
                <View>
                  <Text style={styles.breakdownValue}>{userStats.inactiveUsers}</Text>
                  <Text style={styles.breakdownLabel}>Inactifs</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Payment Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paiements</Text>
          <Card variant="outlined" style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Volume total</Text>
              <Text style={styles.paymentValue}>
                {formatAmount(paymentStats.totalVolume)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Commissions collectées</Text>
              <Text style={[styles.paymentValue, { color: colors.success }]}>
                {formatAmount(paymentStats.totalFees)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Remboursements</Text>
              <Text style={[styles.paymentValue, { color: colors.warning }]}>
                {formatAmount(paymentStats.refundedAmount)}
              </Text>
            </View>
            <View style={[styles.paymentRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.paymentLabel}>Transactions</Text>
              <Text style={styles.paymentValue}>
                {paymentStats.totalTransactions}
              </Text>
            </View>
          </Card>
        </View>

        {/* Tractors Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracteurs</Text>
          <View style={styles.tractorStats}>
            <Card variant="outlined" style={styles.tractorStatCard}>
              <Text style={styles.tractorStatValue}>
                {tractors.filter((t) => t.isAvailable).length}
              </Text>
              <Text style={styles.tractorStatLabel}>Disponibles</Text>
              <View style={[styles.tractorIndicator, { backgroundColor: colors.success }]} />
            </Card>
            <Card variant="outlined" style={styles.tractorStatCard}>
              <Text style={styles.tractorStatValue}>
                {tractors.filter((t) => !t.isAvailable).length}
              </Text>
              <Text style={styles.tractorStatLabel}>En service</Text>
              <View style={[styles.tractorIndicator, { backgroundColor: colors.warning }]} />
            </Card>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overviewItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statusCard: {
    paddingVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statusRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    width: 40,
    textAlign: 'center',
  },
  statusBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    marginLeft: 12,
  },
  statusBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownCard: {
    paddingVertical: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
  },
  breakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentCard: {
    paddingVertical: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tractorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  tractorStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  tractorStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tractorStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tractorIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
});
