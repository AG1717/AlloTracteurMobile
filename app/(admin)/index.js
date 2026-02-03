import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboardScreen() {
  const { user } = useContext(AuthContext);

  const userStats = getUserStats();
  const tractors = getAllTractors();
  const bookings = getAllBookings();
  const paymentStats = getPaymentStats();

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const activeBookings = bookings.filter((b) => b.status === 'in_progress').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Administration</Text>
            <Text style={styles.subGreeting}>
              Bonjour, {user?.prenom || 'Admin'}
            </Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.textWhite} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>

        {/* Revenue Card */}
        <Card variant="elevated" style={styles.revenueCard}>
          <View style={styles.revenueRow}>
            <View>
              <Text style={styles.revenueLabel}>Revenus plateforme</Text>
              <Text style={styles.revenueAmount}>
                {formatAmount(paymentStats.totalFees)}
              </Text>
            </View>
            <View style={styles.revenueIcon}>
              <Ionicons name="trending-up" size={28} color={colors.textWhite} />
            </View>
          </View>
          <View style={styles.revenueStats}>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueStatValue}>
                {formatAmount(paymentStats.totalVolume)}
              </Text>
              <Text style={styles.revenueStatLabel}>Volume total</Text>
            </View>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueStatValue}>
                {paymentStats.totalTransactions}
              </Text>
              <Text style={styles.revenueStatLabel}>Transactions</Text>
            </View>
          </View>
        </Card>

        {/* KPIs Grid */}
        <View style={styles.kpisGrid}>
          <Card variant="outlined" style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="people" size={24} color={colors.info} />
            </View>
            <Text style={styles.kpiValue}>{userStats.totalUsers}</Text>
            <Text style={styles.kpiLabel}>Utilisateurs</Text>
            <Text style={styles.kpiSub}>
              {userStats.totalClients} clients, {userStats.totalOwners} propriétaires
            </Text>
          </Card>

          <Card variant="outlined" style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.primaryBackground }]}>
              <Ionicons name="car" size={24} color={colors.primary} />
            </View>
            <Text style={styles.kpiValue}>{tractors.length}</Text>
            <Text style={styles.kpiLabel}>Tracteurs</Text>
            <Text style={styles.kpiSub}>
              {tractors.filter((t) => t.isAvailable).length} disponibles
            </Text>
          </Card>

          <Card variant="outlined" style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="time" size={24} color={colors.warning} />
            </View>
            <Text style={styles.kpiValue}>{pendingBookings}</Text>
            <Text style={styles.kpiLabel}>En attente</Text>
            <Text style={styles.kpiSub}>{activeBookings} en cours</Text>
          </Card>

          <Card variant="outlined" style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>
            <Text style={styles.kpiValue}>{userStats.verifiedUsers}</Text>
            <Text style={styles.kpiLabel}>Vérifiés</Text>
            <Text style={styles.kpiSub}>{userStats.activeUsers} actifs</Text>
          </Card>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition paiements</Text>
          <Card variant="outlined" style={styles.paymentCard}>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentInfo}>
                <View style={[styles.paymentIcon, { backgroundColor: '#fff2e6' }]}>
                  <Ionicons name="phone-portrait" size={20} color={colors.orangeMoney} />
                </View>
                <View>
                  <Text style={styles.paymentName}>Orange Money</Text>
                  <Text style={styles.paymentAmount}>
                    {formatAmount(paymentStats.byMethod.orange_money)}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentBar}>
                <View
                  style={[
                    styles.paymentBarFill,
                    {
                      backgroundColor: colors.orangeMoney,
                      width: `${
                        paymentStats.totalVolume > 0
                          ? (paymentStats.byMethod.orange_money /
                              paymentStats.totalVolume) *
                            100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.paymentMethod}>
              <View style={styles.paymentInfo}>
                <View style={[styles.paymentIcon, { backgroundColor: '#e6e6ff' }]}>
                  <Ionicons name="wallet" size={20} color={colors.wave} />
                </View>
                <View>
                  <Text style={styles.paymentName}>Wave</Text>
                  <Text style={styles.paymentAmount}>
                    {formatAmount(paymentStats.byMethod.wave)}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentBar}>
                <View
                  style={[
                    styles.paymentBarFill,
                    {
                      backgroundColor: colors.wave,
                      width: `${
                        paymentStats.totalVolume > 0
                          ? (paymentStats.byMethod.wave / paymentStats.totalVolume) *
                            100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.paymentMethod}>
              <View style={styles.paymentInfo}>
                <View style={[styles.paymentIcon, { backgroundColor: '#eef2ff' }]}>
                  <Ionicons name="card" size={20} color={colors.card || '#6366f1'} />
                </View>
                <View>
                  <Text style={styles.paymentName}>Carte Bancaire</Text>
                  <Text style={styles.paymentAmount}>
                    {formatAmount(paymentStats.byMethod.card || 0)}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentBar}>
                <View
                  style={[
                    styles.paymentBarFill,
                    {
                      backgroundColor: colors.card || '#6366f1',
                      width: `${
                        paymentStats.totalVolume > 0
                          ? ((paymentStats.byMethod.card || 0) / paymentStats.totalVolume) *
                            100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          {bookings.slice(0, 5).map((booking) => (
            <Card key={booking.id} variant="outlined" style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons
                  name={
                    booking.status === 'completed'
                      ? 'checkmark-circle'
                      : booking.status === 'pending'
                      ? 'time'
                      : 'play-circle'
                  }
                  size={20}
                  color={
                    booking.status === 'completed'
                      ? colors.success
                      : booking.status === 'pending'
                      ? colors.warning
                      : colors.info
                  }
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  Réservation #{booking.id.slice(-6)}
                </Text>
                <Text style={styles.activitySub}>
                  {booking.tractor?.name} • {formatAmount(booking.totalPrice)}
                </Text>
              </View>
              <Text style={styles.activityStatus}>
                {booking.status === 'completed'
                  ? 'Terminée'
                  : booking.status === 'pending'
                  ? 'En attente'
                  : booking.status === 'in_progress'
                  ? 'En cours'
                  : booking.status}
              </Text>
            </Card>
          ))}
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textWhite,
    marginLeft: 4,
  },
  revenueCard: {
    marginHorizontal: 20,
    backgroundColor: colors.secondary,
    marginBottom: 20,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginTop: 4,
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueStats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondaryLight,
  },
  revenueStat: {
    flex: 1,
  },
  revenueStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  revenueStatLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  kpisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  kpiCard: {
    width: '46%',
    margin: '2%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 4,
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
  paymentCard: {
    paddingVertical: 8,
  },
  paymentMethod: {
    paddingVertical: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  paymentAmount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentBar: {
    height: 6,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 3,
  },
  paymentBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activitySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
