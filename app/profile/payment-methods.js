import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

const PAYMENT_METHODS = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    icon: 'phone-portrait-outline',
    color: '#FF6600',
    description: 'Paiement via Orange Money',
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: 'wallet-outline',
    color: '#1DC8FC',
    description: 'Paiement via Wave',
  },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [savedMethods, setSavedMethods] = useState([
    { id: '1', type: 'orange_money', phone: '77 123 45 67', isDefault: true },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMethod = () => {
    if (!selectedMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner une méthode de paiement');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return;
    }

    const newMethod = {
      id: Date.now().toString(),
      type: selectedMethod,
      phone: phoneNumber,
      isDefault: savedMethods.length === 0,
    };

    setSavedMethods([...savedMethods, newMethod]);
    setSelectedMethod(null);
    setPhoneNumber('');
    setShowAddForm(false);
    Alert.alert('Succès', 'Méthode de paiement ajoutée');
  };

  const handleSetDefault = (id) => {
    setSavedMethods(
      savedMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous supprimer cette méthode de paiement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setSavedMethods(savedMethods.filter((m) => m.id !== id));
          },
        },
      ]
    );
  };

  const getMethodInfo = (type) => {
    return PAYMENT_METHODS.find((m) => m.id === type);
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
        <Text style={styles.headerTitle}>Méthodes de paiement</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Methods */}
        {savedMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Méthodes enregistrées</Text>
            {savedMethods.map((method) => {
              const info = getMethodInfo(method.type);
              return (
                <View key={method.id} style={styles.savedMethodCard}>
                  <View
                    style={[
                      styles.methodIcon,
                      { backgroundColor: info?.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={info?.icon}
                      size={24}
                      color={info?.color}
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{info?.name}</Text>
                    <Text style={styles.methodPhone}>{method.phone}</Text>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Par défaut</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.methodActions}>
                    {!method.isDefault && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={22}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(method.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Add New Method */}
        {!showAddForm ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Ajouter une méthode de paiement</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addFormSection}>
            <Text style={styles.sectionTitle}>Nouvelle méthode</Text>

            {/* Method Selection */}
            <View style={styles.methodsGrid}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodOption,
                    selectedMethod === method.id && styles.methodOptionSelected,
                    selectedMethod === method.id && {
                      borderColor: method.color,
                    },
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View
                    style={[
                      styles.methodOptionIcon,
                      { backgroundColor: method.color + '20' },
                    ]}
                  >
                    <Ionicons name={method.icon} size={28} color={method.color} />
                  </View>
                  <Text style={styles.methodOptionName}>{method.name}</Text>
                  {selectedMethod === method.id && (
                    <View
                      style={[
                        styles.selectedCheck,
                        { backgroundColor: method.color },
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro de téléphone</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="77 123 45 67"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>

            {/* Actions */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setSelectedMethod(null);
                  setPhoneNumber('');
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMethod}
              >
                <Text style={styles.saveButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            Vos informations de paiement sont sécurisées et ne sont jamais partagées.
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
  savedMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  methodPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  defaultBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.primaryBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  addFormSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  methodOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodOptionSelected: {
    borderWidth: 2,
  },
  methodOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
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
    fontSize: 14,
    color: colors.info || '#0066CC',
    marginLeft: 12,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
