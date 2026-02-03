import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { getBookingStats, getPendingRequestsByOwner } from '../../services/booking.service';
import { getOwnerEarnings } from '../../services/payment.service';
import { getTractorsByOwner } from '../../services/tractor.service';
import { AuthContext } from '../context/AuthContext';

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const ownerId = user?.id || 'owner_1';
  const tractors = getTractorsByOwner(ownerId);
  const bookingStats = getBookingStats(ownerId);
  const earnings = getOwnerEarnings(ownerId);
  const pendingRequests = getPendingRequestsByOwner(ownerId);

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Bonjour, {user?.prenom || 'Propriétaire'} 👋
            </Text>
            <Text style={styles.subGreeting}>Voici votre tableau de bord</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            {pendingRequests.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Revenue Card */}
        <Card variant="elevated" style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueLabel}>Revenus ce mois</Text>
            <Ionicons name="trending-up" size={20} color={colors.success} />
          </View>
          <Text style={styles.revenueAmount}>{formatAmount(earnings.monthlyEarnings)}</Text>
          <Text style={styles.revenueSub}>
            Total: {formatAmount(earnings.totalEarnings)}
          </Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.statCard}>
            <Ionicons name="car" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{tractors.length}</Text>
            <Text style={styles.statLabel}>Tracteurs</Text>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <Ionicons name="calendar" size={28} color={colors.info} />
            <Text style={styles.statValue}>{bookingStats.totalBookings}</Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <Ionicons name="time" size={28} color={colors.warning} />
            <Text style={styles.statValue}>{bookingStats.pendingBookings}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={styles.statValue}>{bookingStats.completionRate.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Taux réussite</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(owner)/tractors')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primaryBackground }]}>
                <Ionicons name="add" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Ajouter un tracteur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(owner)/requests')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="mail" size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionLabel}>Voir demandes</Text>
              {pendingRequests.length > 0 && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>{pendingRequests.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(owner)/earnings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.successLight }]}>
                <Ionicons name="stats-chart" size={24} color={colors.success} />
              </View>
              <Text style={styles.actionLabel}>Statistiques</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Requests Preview */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Demandes en attente</Text>
              <TouchableOpacity onPress={() => router.push('/(owner)/requests')}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            {pendingRequests.slice(0, 2).map((booking) => (
              <Card key={booking.id} variant="outlined" style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTractor}>{booking.tractor?.name}</Text>
                  <Text style={styles.requestDate}>
                    {new Date(booking.startDate).toLocaleDateString('fr-FR')} -{' '}
                    {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                  </Text>
                  <Text style={styles.requestPrice}>{formatAmount(booking.totalPrice)}</Text>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.rejectBtn}>
                    <Ionicons name="close" size={20} color={colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Ionicons name="checkmark" size={20} color={colors.textWhite} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Tractors Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes tracteurs</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/tractors')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {tractors.slice(0, 3).map((tractor) => (
            <Card key={tractor.id} variant="outlined" style={styles.tractorCard}>
              <View style={styles.tractorInfo}>
                <View style={styles.tractorIcon}>
                  <Ionicons name="car" size={24} color={colors.primary} />
                </View>
                <View style={styles.tractorDetails}>
                  <Text style={styles.tractorName}>{tractor.name}</Text>
                  <Text style={styles.tractorPrice}>
                    {formatAmount(tractor.pricePerDay)}/jour
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: tractor.isAvailable ? colors.success : colors.error },
                ]}
              />
            </Card>
          ))}
        </View>

        <View style={{ height: 20 }} />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  revenueCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.primary,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginTop: 8,
  },
  revenueSub: {
    fontSize: 13,
    color: colors.primaryLight,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  statCard: {
    width: '46%',
    margin: '2%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestTractor: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requestDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  requestPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tractorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tractorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tractorDetails: {},
  tractorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tractorPrice: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
