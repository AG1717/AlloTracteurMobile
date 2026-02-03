import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { colors } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Email ou téléphone requis' });
      return;
    }

    setLoading(true);
    // Simuler l'envoi du code
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    Alert.alert(
      'Code envoyé',
      'Un code de vérification a été envoyé à votre adresse.',
      [{ text: 'OK', onPress: () => setStep(2) }]
    );
  };

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length !== 6) {
      setErrors({ code: 'Code à 6 chiffres requis' });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    // Simuler vérification réussie
    setStep(3);
  };

  const handleResetPassword = async () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Mot de passe requis';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Minimum 6 caractères';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    Alert.alert(
      'Succès',
      'Votre mot de passe a été réinitialisé avec succès.',
      [{ text: 'Se connecter', onPress: () => router.replace('/(auth)/login') }]
    );
  };

  const renderStep1 = () => (
    <>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={48} color={colors.primary} />
      </View>

      <Text style={styles.title}>Mot de passe oublié ?</Text>
      <Text style={styles.description}>
        Entrez votre email ou numéro de téléphone pour recevoir un code de
        vérification.
      </Text>

      <Input
        label="Email ou Téléphone"
        placeholder="exemple@email.com"
        value={email}
        onChangeText={setEmail}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <Button
        title={loading ? 'Envoi...' : 'Envoyer le code'}
        onPress={handleSendCode}
        loading={loading}
        disabled={loading}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.iconContainer}>
        <Ionicons name="keypad-outline" size={48} color={colors.primary} />
      </View>

      <Text style={styles.title}>Vérification</Text>
      <Text style={styles.description}>
        Entrez le code à 6 chiffres envoyé à {email}
      </Text>

      <Input
        label="Code de vérification"
        placeholder="000000"
        value={code}
        onChangeText={setCode}
        icon="keypad-outline"
        keyboardType="number-pad"
        error={errors.code}
      />

      <Button
        title={loading ? 'Vérification...' : 'Vérifier'}
        onPress={handleVerifyCode}
        loading={loading}
        disabled={loading}
      />

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleSendCode}
        disabled={loading}
      >
        <Text style={styles.resendText}>Renvoyer le code</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.primary} />
      </View>

      <Text style={styles.title}>Nouveau mot de passe</Text>
      <Text style={styles.description}>
        Créez un nouveau mot de passe sécurisé.
      </Text>

      <Input
        label="Nouveau mot de passe"
        placeholder="Minimum 6 caractères"
        value={newPassword}
        onChangeText={setNewPassword}
        icon="lock-closed-outline"
        secureTextEntry
        error={errors.newPassword}
      />

      <Input
        label="Confirmer le mot de passe"
        placeholder="Retapez votre mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon="lock-closed-outline"
        secureTextEntry
        error={errors.confirmPassword}
      />

      <Button
        title={loading ? 'Réinitialisation...' : 'Réinitialiser'}
        onPress={handleResetPassword}
        loading={loading}
        disabled={loading}
      />
    </>
  );

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  step >= s && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>

          {/* Back to login */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.loginLinkText}>
              Retour à la <Text style={styles.loginLinkButton}>connexion</Text>
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  resendButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 40,
    alignSelf: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLinkButton: {
    color: colors.primary,
    fontWeight: '600',
  },
});
