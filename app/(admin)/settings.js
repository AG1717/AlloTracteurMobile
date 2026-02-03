import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { AuthContext } from '../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            // La redirection est gérée automatiquement par _layout.js
            await logout();
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Administration',
      items: [
        {
          icon: 'settings-outline',
          label: 'Paramètres généraux',
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
        {
          icon: 'cash-outline',
          label: 'Commissions',
          subtitle: `${APP_CONFIG.commission.platform}% actuellement`,
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
        {
          icon: 'notifications-outline',
          label: 'Notifications système',
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
      ],
    },
    {
      title: 'Contenu',
      items: [
        {
          icon: 'document-text-outline',
          label: "Conditions d'utilisation",
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
        {
          icon: 'shield-outline',
          label: 'Politique de confidentialité',
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
        {
          icon: 'help-circle-outline',
          label: 'FAQ',
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
      ],
    },
    {
      title: 'Système',
      items: [
        {
          icon: 'server-outline',
          label: 'État du serveur',
          subtitle: 'Mode développement',
          onPress: () => Alert.alert('Info', 'Backend non connecté'),
        },
        {
          icon: 'bug-outline',
          label: 'Logs système',
          onPress: () => Alert.alert('Info', 'Fonctionnalité à venir'),
        },
        {
          icon: 'refresh-outline',
          label: 'Vider le cache',
          onPress: () =>
            Alert.alert('Succès', 'Cache vidé avec succès (simulation)'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
        </View>

        {/* Admin Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={28} color={colors.textWhite} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.prenom || 'Admin'} {user?.nom || ''}
            </Text>
            <Text style={styles.profileRole}>Administrateur</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoCard}>
          <View style={styles.appInfoRow}>
            <View style={styles.appIcon}>
              <Ionicons name="car" size={28} color={colors.primary} />
            </View>
            <View style={styles.appDetails}>
              <Text style={styles.appName}>{APP_CONFIG.name}</Text>
              <Text style={styles.appVersion}>Version {APP_CONFIG.version}</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={colors.textSecondary}
                    />
                    <View style={styles.menuItemTextContainer}>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {APP_CONFIG.name} Admin v{APP_CONFIG.version}
          </Text>
          <Text style={styles.footerText}>© 2026 Tous droits réservés</Text>
        </View>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  profileRole: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 4,
  },
  appInfoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appDetails: {
    marginLeft: 14,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  appVersion: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemTextContainer: {
    marginLeft: 14,
  },
  menuItemLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
});
