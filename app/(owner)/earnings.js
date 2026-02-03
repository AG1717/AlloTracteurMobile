import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Card from '../../components/ui/Card';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { getOwnerEarnings, getTransactionsByOwner } from '../../services/payment.service';
import { AuthContext } from '../context/AuthContext';

export default function EarningsScreen() {
  const { user } = useContext(AuthContext);

  const ownerId = user?.id || 'owner_1';
  const earnings = getOwnerEarnings(ownerId);
  const transactions = getTransactionsByOwner(ownerId);

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('fr-FR')} ${APP_CONFIG.currency.symbol}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'refunded':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Reçu';
      case 'refunded':
        return 'Remboursé';
      case 'failed':
        return 'Échoué';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes revenus</Text>
        </View>

        {/* Main Revenue Card */}
        <Card variant="elevated" style={styles.mainCard}>
          <Text style={styles.mainLabel}>Revenus totaux</Text>
          <Text style={styles.mainAmount}>{formatAmount(earnings.totalEarnings)}</Text>
          <View style={styles.mainStats}>
            <View style={styles.mainStatItem}>
              <Text style={styles.mainStatValue}>{earnings.totalTransactions}</Text>
              <Text style={styles.mainStatLabel}>Transactions</Text>
            </View>
            <View style={styles.mainStatDivider} />
            <View style={styles.mainStatItem}>
              <Text style={styles.mainStatValue}>{formatAmount(earnings.monthlyEarnings)}</Text>
              <Text style={styles.mainStatLabel}>Ce mois</Text>
            </View>
          </View>
        </Card>

        {/* Monthly Chart (simplified) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution (6 derniers mois)</Text>
          <Card variant="outlined" style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {earnings.earningsByMonth.map((month, index) => {
                const maxAmount = Math.max(
                  ...earnings.earningsByMonth.map((m) => m.amount),
                  1
                );
                const heightPercent = (month.amount / maxAmount) * 100;

                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${Math.max(heightPercent, 5)}%`,
                            backgroundColor:
                              index === earnings.earningsByMonth.length - 1
                                ? colors.primary
                                : colors.primaryLight,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{month.month}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions récentes</Text>

          {transactions.length > 0 ? (
            transactions.slice(0, 10).map((transaction) => (
              <Card key={transaction.id} variant="outlined" style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.method === 'orange_money'
                            ? '#fff2e6'
                            : '#e6e6ff',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        transaction.method === 'orange_money'
                          ? 'phone-portrait'
                          : 'wallet'
                      }
                      size={20}
                      color={
                        transaction.method === 'orange_money'
                          ? colors.orangeMoney
                          : colors.wave
                      }
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionRef}>
                      {transaction.reference.slice(0, 15)}...
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    +{formatAmount(transaction.ownerAmount)}
                  </Text>
                  <Text
                    style={[
                      styles.transactionStatus,
                      { color: getStatusColor(transaction.status) },
                    ]}
                  >
                    {getStatusLabel(transaction.status)}
                  </Text>
                </View>
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={40} color={colors.textTertiary} />
              <Text style={styles.emptyText}>Aucune transaction</Text>
            </Card>
          )}
        </View>

        {/* Commission Info */}
        <Card variant="outlined" style={[styles.section, styles.infoCard]}>
          <Ionicons name="information-circle-outline" size={24} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Commission plateforme</Text>
            <Text style={styles.infoText}>
              Une commission de {APP_CONFIG.commission.platform}% est prélevée sur chaque
              transaction pour le fonctionnement de la plateforme.
            </Text>
          </View>
        </Card>

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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mainCard: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: 28,
  },
  mainLabel: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  mainAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginTop: 8,
  },
  mainStats: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'center',
  },
  mainStatItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  mainStatDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
  },
  mainStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  mainStatLabel: {
    fontSize: 12,
    color: colors.primaryLight,
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
  chartCard: {
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    width: 30,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRef: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.success,
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
