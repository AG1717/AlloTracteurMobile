import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

export default function PrivacyScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Politique de confidentialité</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Dernière mise à jour : Janvier 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Collecte des données</Text>
          <Text style={styles.sectionText}>
            Nous collectons les informations que vous nous fournissez lors de votre inscription : nom, prénom, email, numéro de téléphone et adresse. Pour les propriétaires, nous collectons également les informations relatives aux tracteurs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Utilisation des données</Text>
          <Text style={styles.sectionText}>
            Vos données sont utilisées pour :{'\n'}
            • Gérer votre compte et vos réservations{'\n'}
            • Faciliter la communication entre clients et propriétaires{'\n'}
            • Traiter les paiements{'\n'}
            • Améliorer nos services{'\n'}
            • Vous envoyer des notifications importantes
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Partage des données</Text>
          <Text style={styles.sectionText}>
            Nous ne vendons pas vos données personnelles. Vos informations peuvent être partagées avec :{'\n'}
            • Les autres utilisateurs (nom et téléphone) dans le cadre d'une réservation{'\n'}
            • Nos prestataires de paiement (Orange Money, Wave){'\n'}
            • Les autorités si la loi l'exige
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Sécurité des données</Text>
          <Text style={styles.sectionText}>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Conservation des données</Text>
          <Text style={styles.sectionText}>
            Vos données sont conservées tant que votre compte est actif. Après suppression de votre compte, nous conservons certaines données pendant une période limitée pour des raisons légales et comptables.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Vos droits</Text>
          <Text style={styles.sectionText}>
            Vous avez le droit de :{'\n'}
            • Accéder à vos données personnelles{'\n'}
            • Rectifier vos données{'\n'}
            • Demander la suppression de vos données{'\n'}
            • Vous opposer au traitement de vos données{'\n'}
            • Retirer votre consentement à tout moment
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies et technologies similaires</Text>
          <Text style={styles.sectionText}>
            L'application utilise des technologies de stockage local pour améliorer votre expérience et mémoriser vos préférences de connexion.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact</Text>
          <Text style={styles.sectionText}>
            Pour toute question concernant la protection de vos données, contactez notre délégué à la protection des données à dpo@allotracteur.sn.
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
  lastUpdated: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
