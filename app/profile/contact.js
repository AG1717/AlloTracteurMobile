import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

const CONTACT_OPTIONS = [
  {
    id: 'phone',
    icon: 'call-outline',
    title: 'Téléphone',
    subtitle: '+221 33 123 45 67',
    action: () => Linking.openURL('tel:+221331234567'),
  },
  {
    id: 'whatsapp',
    icon: 'logo-whatsapp',
    title: 'WhatsApp',
    subtitle: '+221 77 123 45 67',
    action: () => Linking.openURL('https://wa.me/221771234567'),
  },
  {
    id: 'email',
    icon: 'mail-outline',
    title: 'Email',
    subtitle: 'support@allotracteur.sn',
    action: () => Linking.openURL('mailto:support@allotracteur.sn'),
  },
];

export default function ContactScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un sujet');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre message');
      return;
    }

    setIsLoading(true);
    // Simuler l'envoi du message
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    Alert.alert(
      'Message envoyé',
      'Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubject('');
            setMessage('');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nous contacter</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Contact Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact direct</Text>
            <View style={styles.contactOptions}>
              {CONTACT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.contactOption}
                  onPress={option.action}
                >
                  <View style={styles.contactOptionIcon}>
                    <Ionicons name={option.icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.contactOptionInfo}>
                    <Text style={styles.contactOptionTitle}>{option.title}</Text>
                    <Text style={styles.contactOptionSubtitle}>{option.subtitle}</Text>
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

          {/* Contact Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Envoyer un message</Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sujet *</Text>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Ex: Question sur ma réservation"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Décrivez votre demande en détail..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Envoi en cours...</Text>
                ) : (
                  <>
                    <Ionicons name="send" size={18} color={colors.textWhite} />
                    <Text style={styles.submitButtonText}>Envoyer le message</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Hours */}
          <View style={styles.hoursSection}>
            <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursTitle}>Horaires de support</Text>
              <Text style={styles.hoursText}>
                Lundi - Vendredi : 8h00 - 18h00{'\n'}
                Samedi : 9h00 - 13h00{'\n'}
                Dimanche : Fermé
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationSection}>
            <Ionicons name="location-outline" size={24} color={colors.textSecondary} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Notre adresse</Text>
              <Text style={styles.locationText}>
                123 Avenue Cheikh Anta Diop{'\n'}
                Dakar, Sénégal
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
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
  keyboardView: {
    flex: 1,
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
  contactOptions: {
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactOptionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contactOptionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  form: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
    marginLeft: 8,
  },
  hoursSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  hoursInfo: {
    marginLeft: 12,
    flex: 1,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  locationSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
