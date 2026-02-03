import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';
import { colors } from '../../constants/colors';
import {
  addUser,
  getAllUsers,
  searchUsers,
  toggleUserStatus,
  verifyUser,
} from '../../services/user.service';

const TABS = [
  { id: 'all', label: 'Tous' },
  { id: 'client', label: 'Clients' },
  { id: 'proprietaire', label: 'Propriétaires' },
];

export default function UsersScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(getAllUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: 'proprietaire',
    avatar: null,
  });

  const filteredUsers = users.filter((u) => {
    // Filter by role
    if (activeTab !== 'all' && u.role !== activeTab) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${u.prenom} ${u.nom}`.toLowerCase();
      return (
        fullName.includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.telephone?.includes(query)
      );
    }

    return true;
  });

  const handleToggleStatus = (userId) => {
    const user = users.find((u) => u.id === userId);
    Alert.alert(
      user.isActive ? 'Désactiver' : 'Activer',
      `Voulez-vous ${user.isActive ? 'désactiver' : 'activer'} ce compte ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            toggleUserStatus(userId);
            setUsers([...getAllUsers()]);
          },
        },
      ]
    );
  };

  const handleVerify = (userId) => {
    Alert.alert('Vérifier', 'Confirmer la vérification de cet utilisateur ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Vérifier',
        onPress: () => {
          verifyUser(userId);
          setUsers([...getAllUsers()]);
          Alert.alert('Succès', 'Utilisateur vérifié !');
        },
      },
    ]);
  };

  // Sélection de photo
  const pickImage = async () => {
    // Demander la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewUser({ ...newUser, avatar: result.assets[0].uri });
    }
  };

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à la caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewUser({ ...newUser, avatar: result.assets[0].uri });
    }
  };

  // Choisir source de photo
  const handlePickPhoto = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImage },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  // Ajouter un utilisateur
  const handleAddUser = () => {
    if (!newUser.prenom || !newUser.nom || !newUser.email || !newUser.telephone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    const user = addUser({
      prenom: newUser.prenom,
      nom: newUser.nom,
      email: newUser.email,
      telephone: newUser.telephone,
      role: newUser.role,
      avatar: newUser.avatar,
      isActive: true,
      isVerified: true,
    });

    setUsers([...getAllUsers()]);
    setShowAddModal(false);
    setNewUser({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      role: 'proprietaire',
      avatar: null,
    });

    Alert.alert('Succès', `${newUser.role === 'proprietaire' ? 'Propriétaire' : 'Client'} ajouté avec succès !`);
  };

  const getTabCount = (tabId) => {
    if (tabId === 'all') return users.filter((u) => u.role !== 'admin').length;
    return users.filter((u) => u.role === tabId).length;
  };

  const renderUserCard = ({ item }) => (
    <Card variant="outlined" style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {item.prenom?.[0] || 'U'}
            {item.nom?.[0] || ''}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>
              {item.prenom} {item.nom}
            </Text>
            {item.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.primary}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.telephone}</Text>
        </View>
        <StatusBadge
          status={item.isActive ? 'active' : 'inactive'}
          size="small"
        />
      </View>

      <View style={styles.userMeta}>
        <View style={styles.userMetaItem}>
          <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.userMetaText}>
            {item.role === 'client'
              ? 'Client'
              : item.role === 'proprietaire'
              ? 'Propriétaire'
              : 'Admin'}
          </Text>
        </View>
        <View style={styles.userMetaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.userMetaText}>
            Inscrit le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        {item.role === 'proprietaire' && item.rating && (
          <View style={styles.userMetaItem}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.userMetaText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.userActions}>
        {!item.isVerified && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.verifyBtn]}
            onPress={() => handleVerify(item.id)}
          >
            <Ionicons name="checkmark" size={16} color={colors.success} />
            <Text style={[styles.actionBtnText, { color: colors.success }]}>
              Vérifier
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            item.isActive ? styles.disableBtn : styles.enableBtn,
          ]}
          onPress={() => handleToggleStatus(item.id)}
        >
          <Ionicons
            name={item.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
            size={16}
            color={item.isActive ? colors.error : colors.success}
          />
          <Text
            style={[
              styles.actionBtnText,
              { color: item.isActive ? colors.error : colors.success },
            ]}
          >
            {item.isActive ? 'Désactiver' : 'Activer'}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Utilisateurs</Text>
            <Text style={styles.subtitle}>
              {filteredUsers.length} utilisateur(s)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
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
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  activeTab === tab.id && styles.tabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === tab.id && styles.tabBadgeTextActive,
                  ]}
                >
                  {getTabCount(tab.id)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Users List */}
        {filteredUsers.filter((u) => u.role !== 'admin').length > 0 ? (
          <FlatList
            data={filteredUsers.filter((u) => u.role !== 'admin')}
            keyExtractor={(item) => item.id}
            renderItem={renderUserCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="people-outline"
            title="Aucun utilisateur"
            description="Aucun utilisateur ne correspond à vos critères."
          />
        )}

        {/* Modal d'ajout */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvel utilisateur</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Photo de profil */}
              <View style={styles.photoSection}>
                <Text style={styles.photoLabel}>Photo de profil</Text>
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={handlePickPhoto}
                >
                  {newUser.avatar ? (
                    <Image
                      source={{ uri: newUser.avatar }}
                      style={styles.photoPreview}
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="camera" size={40} color={colors.textTertiary} />
                      <Text style={styles.photoPlaceholderText}>
                        Ajouter une photo
                      </Text>
                    </View>
                  )}
                  <View style={styles.photoEditBadge}>
                    <Ionicons name="pencil" size={14} color={colors.textWhite} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Type d'utilisateur */}
              <View style={styles.roleSection}>
                <Text style={styles.roleLabel}>Type d'utilisateur *</Text>
                <View style={styles.roleOptions}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      newUser.role === 'proprietaire' && styles.roleOptionActive,
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'proprietaire' })}
                  >
                    <Ionicons
                      name="car"
                      size={24}
                      color={newUser.role === 'proprietaire' ? colors.primary : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.roleOptionText,
                        newUser.role === 'proprietaire' && styles.roleOptionTextActive,
                      ]}
                    >
                      Propriétaire
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      newUser.role === 'client' && styles.roleOptionActive,
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'client' })}
                  >
                    <Ionicons
                      name="person"
                      size={24}
                      color={newUser.role === 'client' ? colors.primary : colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.roleOptionText,
                        newUser.role === 'client' && styles.roleOptionTextActive,
                      ]}
                    >
                      Client
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Input
                label="Prénom *"
                placeholder="Ex: Mamadou"
                value={newUser.prenom}
                onChangeText={(text) => setNewUser({ ...newUser, prenom: text })}
                icon="person-outline"
              />

              <Input
                label="Nom *"
                placeholder="Ex: Diallo"
                value={newUser.nom}
                onChangeText={(text) => setNewUser({ ...newUser, nom: text })}
                icon="person-outline"
              />

              <Input
                label="Email *"
                placeholder="exemple@email.com"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Téléphone *"
                placeholder="77 123 45 67"
                value={newUser.telephone}
                onChangeText={(text) => setNewUser({ ...newUser, telephone: text })}
                icon="call-outline"
                keyboardType="phone-pad"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Ajouter"
                onPress={handleAddUser}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </SafeAreaView>
        </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
  tabBadge: {
    marginLeft: 6,
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: colors.primaryBackground,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: 20,
  },
  userCard: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
    textTransform: 'uppercase',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 1,
  },
  userMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  userMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifyBtn: {
    backgroundColor: colors.successLight,
  },
  disableBtn: {
    backgroundColor: colors.errorLight,
  },
  enableBtn: {
    backgroundColor: colors.successLight,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Photo section
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  // Role section
  roleSection: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 8,
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBackground,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleOptionTextActive: {
    color: colors.primary,
  },
});
