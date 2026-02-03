import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import { colors } from '../../constants/colors';
import { getBookingsByClient } from '../../services/booking.service';
import { AuthContext } from '../context/AuthContext';

const TABS = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'confirmed', label: 'Confirmées' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'completed', label: 'Terminées' },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const allBookings = getBookingsByClient(user?.id || 'client_1');

  const filteredBookings =
    activeTab === 'all'
      ? allBookings
      : allBookings.filter((b) => b.status === activeTab);

  const onRefresh = () => {
    setRefreshing(true);
    // Simuler un refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStats = () => {
    return {
      total: allBookings.length,
      pending: allBookings.filter((b) => b.status === 'pending').length,
      inProgress: allBookings.filter((b) => b.status === 'in_progress').length,
      completed: allBookings.filter((b) => b.status === 'completed').length,
    };
  };

  const stats = getStats();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes réservations</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.info }]}>
                {stats.inProgress}
              </Text>
              <Text style={styles.statLabel}>En cours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.completed}
              </Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste des réservations */}
        {filteredBookings.length > 0 ? (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookingCard
                booking={item}
                onPress={() => router.push(`/booking/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="Aucune réservation"
            description={
              activeTab === 'all'
                ? "Vous n'avez pas encore de réservation. Trouvez un tracteur pour commencer !"
                : "Aucune réservation dans cette catégorie."
            }
            actionLabel={activeTab === 'all' ? 'Trouver un tracteur' : null}
            onAction={
              activeTab === 'all' ? () => router.push('/(client)/search') : null
            }
          />
        )}
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
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
});
