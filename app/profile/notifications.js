import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    pushEnabled: true,
    bookingConfirmation: true,
    bookingReminder: true,
    newRequest: true,
    paymentReceived: true,
    promotions: false,
    newsletter: false,
    smsNotifications: true,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const NotificationItem = ({ icon, title, subtitle, settingKey }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{title}</Text>
        {subtitle && <Text style={styles.notificationSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={settings[settingKey] ? colors.primary : colors.textTertiary}
      />
    </View>
  );

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          <View style={styles.sectionContent}>
            <NotificationItem
              icon="notifications-outline"
              title="Notifications push"
              subtitle="Recevoir des notifications sur votre appareil"
              settingKey="pushEnabled"
            />
            <NotificationItem
              icon="chatbubble-outline"
              title="SMS"
              subtitle="Recevoir des SMS pour les événements importants"
              settingKey="smsNotifications"
            />
          </View>
        </View>

        {/* Reservations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réservations</Text>
          <View style={styles.sectionContent}>
            <NotificationItem
              icon="checkmark-circle-outline"
              title="Confirmation de réservation"
              subtitle="Quand une réservation est confirmée"
              settingKey="bookingConfirmation"
            />
            <NotificationItem
              icon="alarm-outline"
              title="Rappel de réservation"
              subtitle="Rappel avant le début de la location"
              settingKey="bookingReminder"
            />
            <NotificationItem
              icon="mail-outline"
              title="Nouvelles demandes"
              subtitle="Quand vous recevez une demande de réservation"
              settingKey="newRequest"
            />
          </View>
        </View>

        {/* Payments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paiements</Text>
          <View style={styles.sectionContent}>
            <NotificationItem
              icon="card-outline"
              title="Paiement reçu"
              subtitle="Quand vous recevez un paiement"
              settingKey="paymentReceived"
            />
          </View>
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing</Text>
          <View style={styles.sectionContent}>
            <NotificationItem
              icon="pricetag-outline"
              title="Promotions"
              subtitle="Offres spéciales et réductions"
              settingKey="promotions"
            />
            <NotificationItem
              icon="newspaper-outline"
              title="Newsletter"
              subtitle="Actualités et conseils agricoles"
              settingKey="newsletter"
            />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Vous pouvez modifier ces paramètres à tout moment. Certaines notifications essentielles ne peuvent pas être désactivées.
          </Text>
        </View>

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
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  notificationSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoLight || '#E8F4FD',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.info || '#0066CC',
    marginLeft: 12,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});
