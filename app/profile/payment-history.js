import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

const MOCK_PAYMENTS = [
  {
    id: '1',
    date: '2026-01-28',
    amount: 45000,
    type: 'debit',
    description: 'Réservation - John Deere 5075E',
    method: 'orange_money',
    status: 'completed',
  },
  {
    id: '2',
    date: '2026-01-25',
    amount: 35000,
    type: 'debit',
    description: 'Réservation - Massey Ferguson 4708',
    method: 'wave',
    status: 'completed',
  },
  {
    id: '3',
    date: '2026-01-20',
    amount: 5000,
    type: 'credit',
    description: 'Remboursement - Annulation',
    method: 'orange_money',
    status: 'completed',
  },
  {
    id: '4',
    date: '2026-01-15',
    amount: 60000,
    type: 'debit',
    description: 'Réservation - New Holland T6',
    method: 'wave',
    status: 'completed',
  },
  {
    id: '5',
    date: '2026-01-10',
    amount: 40000,
    type: 'debit',
    description: 'Réservation - Kubota M7060',
    method: 'orange_money',
    status: 'pending',
  },
];

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // all, debit, credit

  const filteredPayments = MOCK_PAYMENTS.filter((payment) => {
    if (filter === 'all') return true;
    return payment.type === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const getMethodIcon = (method) => {
    if (method === 'orange_money') return 'phone-portrait-outline';
    return 'wallet-outline';
  };

  const getMethodColor = (method) => {
    if (method === 'orange_money') return '#FF6600';
    return '#1DC8FC';
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return {
        text: 'En attente',
        color: colors.warning,
        bg: colors.warningLight || '#FFF3CD',
      };
    }
    return {
      text: 'Complété',
      color: colors.success,
      bg: colors.successLight || '#D4EDDA',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des paiements</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Tout' },
          { key: 'debit', label: 'Paiements' },
          { key: 'credit', label: 'Remboursements' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterButton, filter === item.key && styles.filterButtonActive]}
            onPress={() => setFilter(item.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === item.key && styles.filterButtonTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total payé</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(
                MOCK_PAYMENTS.filter((p) => p.type === 'debit' && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remboursements</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {formatAmount(
                MOCK_PAYMENTS.filter((p) => p.type === 'credit')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </Text>
          </View>
        </View>

        {/* Transactions List */}
        {filteredPayments.length > 0 ? (
          <View style={styles.transactionsList}>
            {filteredPayments.map((payment) => {
              const status = getStatusBadge(payment.status);
              return (
                <View key={payment.id} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: getMethodColor(payment.method) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getMethodIcon(payment.method)}
                        size={22}
                        color={getMethodColor(payment.method)}
                      />
                    </View>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {payment.description}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(payment.date)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.text}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        payment.type === 'credit' && styles.transactionAmountCredit,
                      ]}
                    >
                      {payment.type === 'credit' ? '+' : '-'}
                      {formatAmount(payment.amount)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyStateText}>Aucune transaction trouvée</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.textWhite,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.primaryLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textWhite,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {},
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  transactionRight: {
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  transactionAmountCredit: {
    color: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textTertiary,
    marginTop: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
