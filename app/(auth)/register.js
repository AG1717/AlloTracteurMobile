import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TractorIcon from '../../components/ui/TractorIcon';
import { colors } from '../../constants/colors';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    // Champs spécifiques propriétaire
    nombreTracteurs: '1',
    adresse: '',
  });
  const [tractorImages, setTractorImages] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  // Demander les permissions pour la caméra/galerie
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions requises',
        'Veuillez autoriser l\'accès à la caméra et à la galerie pour ajouter des photos de tracteurs.'
      );
      return false;
    }
    return true;
  };

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setTractorImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Choisir une photo depuis la galerie
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - tractorImages.length,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setTractorImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  // Supprimer une image
  const removeImage = (index) => {
    setTractorImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Afficher les options de photo
  const showImageOptions = () => {
    Alert.alert(
      'Ajouter une photo',
      'Comment souhaitez-vous ajouter une photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Prendre une photo', onPress: takePhoto },
        { text: 'Choisir depuis la galerie', onPress: pickImage },
      ]
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Nom requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Prénom requis';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Téléphone requis';
    } else if (formData.telephone.length < 9) {
      newErrors.telephone = 'Numéro invalide';
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation spécifique propriétaire
    if (formData.role === 'proprietaire') {
      if (!formData.adresse.trim()) {
        newErrors.adresse = 'Adresse requise pour les propriétaires';
      }
      const nbTracteurs = parseInt(formData.nombreTracteurs);
      if (isNaN(nbTracteurs) || nbTracteurs < 1) {
        newErrors.nombreTracteurs = 'Nombre de tracteurs invalide';
      }
    }

    if (!acceptTerms) {
      Alert.alert('Erreur', "Veuillez accepter les conditions d'utilisation");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Ajouter les images de tracteurs pour les propriétaires
      const registrationData = {
        ...formData,
        ...(formData.role === 'proprietaire' && {
          tractorImages,
          nombreTracteurs: parseInt(formData.nombreTracteurs),
        }),
      };

      const result = await register(registrationData);

      if (result.success) {
        Alert.alert('Succès', 'Votre compte a été créé avec succès !', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      } else {
        Alert.alert('Erreur', result.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Allo Tracteur</Text>
          </View>

          <View style={styles.form}>
            {/* Type de compte */}
            <Text style={styles.label}>Type de compte</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'client' && styles.roleButtonActive,
                ]}
                onPress={() => updateFormData('role', 'client')}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={formData.role === 'client' ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'client' && styles.roleButtonTextActive,
                  ]}
                >
                  Client
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'proprietaire' && styles.roleButtonActive,
                ]}
                onPress={() => updateFormData('role', 'proprietaire')}
              >
                <TractorIcon
                  size={26}
                  color={formData.role === 'proprietaire' ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'proprietaire' && styles.roleButtonTextActive,
                  ]}
                >
                  Propriétaire
                </Text>
              </TouchableOpacity>
            </View>

            {/* Champs du formulaire */}
            <Input
              label="Nom *"
              placeholder="Votre nom"
              value={formData.nom}
              onChangeText={(text) => updateFormData('nom', text)}
              icon="person-outline"
              error={errors.nom}
            />

            <Input
              label="Prénom *"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChangeText={(text) => updateFormData('prenom', text)}
              icon="person-outline"
              error={errors.prenom}
            />

            <Input
              label="Téléphone *"
              placeholder="+221 XX XXX XX XX"
              value={formData.telephone}
              onChangeText={(text) => updateFormData('telephone', text)}
              icon="call-outline"
              keyboardType="phone-pad"
              error={errors.telephone}
            />

            <Input
              label="Email (optionnel)"
              placeholder="exemple@email.com"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Mot de passe *"
              placeholder="Minimum 6 caractères"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirmer le mot de passe *"
              placeholder="Retapez votre mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Champs spécifiques propriétaire */}
            {formData.role === 'proprietaire' && (
              <View style={styles.ownerSection}>
                <View style={styles.ownerSectionHeader}>
                  <TractorIcon size={24} color={colors.primary} />
                  <Text style={styles.ownerSectionTitle}>Informations Propriétaire</Text>
                </View>

                <Input
                  label="Adresse / Localisation *"
                  placeholder="Ex: Dakar, Pikine"
                  value={formData.adresse}
                  onChangeText={(text) => updateFormData('adresse', text)}
                  icon="location-outline"
                  error={errors.adresse}
                />

                <View style={styles.tractorCountContainer}>
                  <Text style={styles.label}>Nombre de tracteurs *</Text>
                  <View style={styles.countSelector}>
                    <TouchableOpacity
                      style={styles.countButton}
                      onPress={() => {
                        const current = parseInt(formData.nombreTracteurs) || 1;
                        if (current > 1) {
                          updateFormData('nombreTracteurs', String(current - 1));
                        }
                      }}
                    >
                      <Ionicons name="remove" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.countDisplay}>
                      <Text style={styles.countText}>{formData.nombreTracteurs}</Text>
                      <Text style={styles.countLabel}>tracteur{parseInt(formData.nombreTracteurs) > 1 ? 's' : ''}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.countButton}
                      onPress={() => {
                        const current = parseInt(formData.nombreTracteurs) || 1;
                        if (current < 20) {
                          updateFormData('nombreTracteurs', String(current + 1));
                        }
                      }}
                    >
                      <Ionicons name="add" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  {errors.nombreTracteurs && (
                    <Text style={styles.errorText}>{errors.nombreTracteurs}</Text>
                  )}
                </View>

                {/* Photos des tracteurs */}
                <View style={styles.photosSection}>
                  <Text style={styles.label}>Photos de vos tracteurs (optionnel)</Text>
                  <Text style={styles.photosHint}>
                    Ajoutez jusqu'à 5 photos pour mettre en valeur vos tracteurs
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.photosScroll}
                    contentContainerStyle={styles.photosContainer}
                  >
                    {tractorImages.map((uri, index) => (
                      <View key={index} style={styles.photoWrapper}>
                        <Image source={{ uri }} style={styles.photoImage} />
                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close-circle" size={24} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}

                    {tractorImages.length < 5 && (
                      <TouchableOpacity
                        style={styles.addPhotoButton}
                        onPress={showImageOptions}
                      >
                        <Ionicons name="camera" size={32} color={colors.primary} />
                        <Text style={styles.addPhotoText}>Ajouter</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={16} color={colors.textWhite} />
                )}
              </View>
              <Text style={styles.termsText}>
                J'accepte les{' '}
                <Text style={styles.termsLink}>conditions d'utilisation</Text> et
                la <Text style={styles.termsLink}>politique de confidentialité</Text>
              </Text>
            </TouchableOpacity>

            {/* Bouton */}
            <Button
              title={isLoading ? 'Inscription...' : "S'inscrire"}
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
            />

            {/* Login link */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Vous avez déjà un compte ? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLinkButton}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBackground,
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleButtonTextActive: {
    color: colors.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLinkButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  // Styles section propriétaire
  ownerSection: {
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ownerSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  tractorCountContainer: {
    marginBottom: 16,
  },
  countSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
  },
  countButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  countLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  photosSection: {
    marginBottom: 16,
  },
  photosHint: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  photosScroll: {
    marginHorizontal: -24,
  },
  photosContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});
