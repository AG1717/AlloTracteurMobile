// screens/client/ProfileScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [userData] = useState({
    nom: 'Diallo',
    prenom: 'Amadou',
    telephone: '+221 77 123 45 67',
    email: 'amadou.diallo@email.com',
    photo: null,
    dateInscription: '2024-06-15',
    stats: {
      commandes: 15,
      depenses: 450000,
      favoris: 3,
    }
    
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    {
      section: 'Compte',
      items: [
        { 
          icon: 'person-outline', 
          title: 'Modifier le profil', 
          screen: 'EditProfile',
          iconColor: '#3b82f6',
          bgColor: '#dbeafe',
        },
        { 
          icon: 'shield-checkmark-outline', 
          title: 'Vérification du compte', 
          screen: 'Verification',
          iconColor: '#22c55e',
          bgColor: '#f0fdf4',
          badge: 'Non vérifié',
        },
        { 
          icon: 'key-outline', 
          title: 'Changer le mot de passe', 
          screen: 'ChangePassword',
          iconColor: '#f59e0b',
          bgColor: '#fef3c7',
        },
      ]
    },
    {
      section: 'Préférences',
      items: [
        { 
          icon: 'heart-outline', 
          title: 'Mes favoris', 
          screen: 'Favorites',
          iconColor: '#ef4444',
          bgColor: '#fee2e2',
          badge: userData.stats.favoris,
        },
        { 
          icon: 'location-outline', 
          title: 'Adresses enregistrées', 
          screen: 'SavedAddresses',
          iconColor: '#8b5cf6',
          bgColor: '#f3e8ff',
        },
        { 
          icon: 'wallet-outline', 
          title: 'Moyens de paiement', 
          screen: 'PaymentMethods',
          iconColor: '#10b981',
          bgColor: '#d1fae5',
        },
      ]
    },
    {
      section: 'Support',
      items: [
        { 
          icon: 'help-circle-outline', 
          title: 'Centre d\'aide', 
          screen: 'Help',
          iconColor: '#06b6d4',
          bgColor: '#cffafe',
        },
        { 
          icon: 'chatbubble-ellipses-outline', 
          title: 'Contacter le support', 
          screen: 'Support',
          iconColor: '#14b8a6',
          bgColor: '#ccfbf1',
        },
        { 
          icon: 'star-outline', 
          title: 'Noter l\'application', 
          action: 'rate',
          iconColor: '#facc15',
          bgColor: '#fef9c3',
        },
      ]
    },
    {
      section: 'Légal',
      items: [
        { 
          icon: 'document-text-outline', 
          title: 'Conditions d\'utilisation', 
          screen: 'Terms',
          iconColor: '#64748b',
          bgColor: '#f1f5f9',
        },
        { 
          icon: 'shield-outline', 
          title: 'Politique de confidentialité', 
          screen: 'Privacy',
          iconColor: '#64748b',
          bgColor: '#f1f5f9',
        },
        { 
          icon: 'information-circle-outline', 
          title: 'À propos', 
          screen: 'About',
          iconColor: '#64748b',
          bgColor: '#f1f5f9',
        },
      ]
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => navigation.replace('Login')
        }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Noter l\'application',
      'Merci de nous soutenir ! Vous allez être redirigé vers le store.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Noter', onPress: () => console.log('Redirect to store') }
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.action === 'rate') {
      handleRateApp();
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const handleEditPhoto = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Prendre une photo', onPress: () => console.log('Camera') },
        { text: 'Choisir dans la galerie', onPress: () => console.log('Gallery') }
      ]
    );
  };

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Card */}
          <View style={styles.userCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleEditPhoto}>
              {userData.photo ? (
                <Image source={{ uri: userData.photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#22c55e" />
                </View>
              )}
              <View style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.userFullName}>{userData.prenom} {userData.nom}</Text>
            <Text style={styles.userContact}>{userData.telephone}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="create-outline" size={18} color="#22c55e" />
              <Text style={styles.editProfileText}>Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity 
  style={styles.bookingButton}
  onPress={() => navigation.navigate('BookingFlow')}
>
  <Text style={styles.bookingButtonIcon}>🚜</Text>
  <View>
    <Text style={styles.bookingButtonTitle}>Réserver un tracteur</Text>
    <Text style={styles.bookingButtonSubtitle}>Trouvez et réservez rapidement</Text>
  </View>
  <Text style={styles.bookingButtonArrow}>→</Text>
</TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userData.stats.commandes}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{(userData.stats.depenses / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>FCFA dépensés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userData.stats.favoris}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>

          {/* Quick Settings */}
          <View style={styles.quickSettings}>
            <View style={styles.quickSetting}>
              <View style={styles.quickSettingLeft}>
                <View style={[styles.quickSettingIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.quickSettingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e2e8f0', true: '#86efac' }}
                thumbColor={notifications ? '#22c55e' : '#f1f5f9'}
              />
            </View>

            <View style={styles.quickSetting}>
              <View style={styles.quickSettingLeft}>
                <View style={[styles.quickSettingIcon, { backgroundColor: '#f1f5f9' }]}>
                  <Ionicons name="moon-outline" size={20} color="#64748b" />
                </View>
                <Text style={styles.quickSettingText}>Mode sombre</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e2e8f0', true: '#86efac' }}
                thumbColor={darkMode ? '#22c55e' : '#f1f5f9'}
              />
            </View>
          </View>

          {/* Menu Sections */}
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.section}</Text>
              <View style={styles.menuList}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      index === section.items.length - 1 && styles.menuItemLast
                    ]}
                    onPress={() => handleMenuPress(item)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>
                        <Ionicons name={item.icon} size={22} color={item.iconColor} />
                      </View>
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.badge && (
                        <View style={styles.menuBadge}>
                          <Text style={styles.menuBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appCopyright}>© 2025 Allo Tracteur</Text>
            <Text style={styles.memberSince}>
              Membre depuis {new Date(userData.dateInscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userFullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  userContact: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  quickSettings: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  quickSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickSettingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickSettingText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuList: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 8,
  },
  
});
