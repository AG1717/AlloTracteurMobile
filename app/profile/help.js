import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

const FAQ_DATA = [
  {
    category: 'Réservation',
    questions: [
      {
        id: '1',
        question: 'Comment réserver un tracteur ?',
        answer:
          "Pour réserver un tracteur, parcourez la carte ou la liste des tracteurs disponibles, sélectionnez celui qui vous convient, choisissez vos dates et confirmez la réservation. Vous recevrez une confirmation par SMS.",
      },
      {
        id: '2',
        question: 'Puis-je annuler ma réservation ?',
        answer:
          "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant la date prévue sans frais. Au-delà, des frais d'annulation peuvent s'appliquer selon les conditions du propriétaire.",
      },
      {
        id: '3',
        question: 'Comment modifier ma réservation ?',
        answer:
          'Pour modifier une réservation, rendez-vous dans "Mes réservations", sélectionnez la réservation concernée et appuyez sur "Modifier". Les modifications sont soumises à la disponibilité.',
      },
    ],
  },
  {
    category: 'Paiement',
    questions: [
      {
        id: '4',
        question: 'Quels sont les moyens de paiement acceptés ?',
        answer:
          'Nous acceptons Orange Money et Wave pour tous les paiements. Ajoutez votre numéro de téléphone dans les paramètres de paiement pour faciliter vos transactions.',
      },
      {
        id: '5',
        question: 'Quand suis-je débité ?',
        answer:
          'Vous êtes débité au moment de la confirmation de la réservation. En cas d\'annulation éligible au remboursement, le montant vous sera recrédité sous 3 à 5 jours ouvrés.',
      },
      {
        id: '6',
        question: 'Comment obtenir une facture ?',
        answer:
          'Les factures sont automatiquement générées après chaque transaction. Vous pouvez les consulter dans "Historique des paiements" de votre profil.',
      },
    ],
  },
  {
    category: 'Propriétaires',
    questions: [
      {
        id: '7',
        question: 'Comment devenir propriétaire sur Allo Tracteur ?',
        answer:
          "Inscrivez-vous en tant que propriétaire, ajoutez vos tracteurs avec photos et descriptions, définissez vos tarifs et disponibilités. Une fois validé par notre équipe, vous pourrez recevoir des réservations.",
      },
      {
        id: '8',
        question: 'Quelle est la commission de la plateforme ?',
        answer:
          'Allo Tracteur prélève une commission de 10% sur chaque réservation confirmée. Cette commission couvre les frais de plateforme, le support client et la garantie des transactions.',
      },
      {
        id: '9',
        question: 'Quand reçois-je mes paiements ?',
        answer:
          'Les paiements sont versés automatiquement sur votre compte Orange Money ou Wave dans les 24 à 48 heures suivant la fin de la location.',
      },
    ],
  },
  {
    category: 'Compte & Sécurité',
    questions: [
      {
        id: '10',
        question: 'Comment modifier mon mot de passe ?',
        answer:
          'Allez dans Profil > Sécurité > Modifier le mot de passe. Vous devrez entrer votre ancien mot de passe puis le nouveau deux fois pour confirmer.',
      },
      {
        id: '11',
        question: 'Comment supprimer mon compte ?',
        answer:
          'Pour supprimer votre compte, contactez notre support via "Nous contacter". Notez que cette action est irréversible et toutes vos données seront supprimées.',
      },
    ],
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
        <Text style={styles.headerTitle}>Aide & FAQ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Search hint */}
        <View style={styles.searchHint}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <Text style={styles.searchHintText}>
            Parcourez les questions fréquentes ci-dessous
          </Text>
        </View>

        {/* FAQ Categories */}
        {FAQ_DATA.map((category) => (
          <View key={category.category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <View style={styles.questionsContainer}>
              {category.questions.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.questionItem}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Ionicons
                      name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>
                  {expandedId === item.id && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  )}
                  {index < category.questions.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Contact Support */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Besoin d'aide supplémentaire ?</Text>
          <Text style={styles.contactSubtitle}>
            Notre équipe de support est disponible pour vous aider
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/profile/contact')}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.textWhite} />
            <Text style={styles.contactButtonText}>Nous contacter</Text>
          </TouchableOpacity>
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
  },
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  searchHintText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  questionsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    marginRight: 12,
  },
  answerContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    marginTop: -8,
  },
  answerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  contactSection: {
    margin: 20,
    padding: 24,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textWhite,
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
