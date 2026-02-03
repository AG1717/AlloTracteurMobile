import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

const DOCUMENTS = [
  {
    id: 'cni',
    title: "Carte d'identité nationale",
    description: 'Recto et verso de votre CNI en cours de validité',
    icon: 'card-outline',
    status: 'pending', // pending, uploaded, verified, rejected
  },
  {
    id: 'permis',
    title: 'Permis de conduire',
    description: 'Catégorie T pour les tracteurs agricoles',
    icon: 'car-outline',
    status: 'pending',
  },
  {
    id: 'assurance',
    title: 'Attestation d\'assurance',
    description: 'Assurance responsabilité civile professionnelle',
    icon: 'shield-checkmark-outline',
    status: 'pending',
  },
  {
    id: 'carte_grise',
    title: 'Carte grise du tracteur',
    description: 'Document d\'immatriculation du véhicule',
    icon: 'document-text-outline',
    status: 'pending',
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'À fournir',
    color: colors.warning,
    bgColor: colors.warningLight || '#FFF3CD',
  },
  uploaded: {
    label: 'En attente',
    color: colors.info,
    bgColor: colors.infoLight || '#D1ECF1',
  },
  verified: {
    label: 'Vérifié',
    color: colors.success,
    bgColor: colors.successLight || '#D4EDDA',
  },
  rejected: {
    label: 'Refusé',
    color: colors.error,
    bgColor: colors.errorLight,
  },
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState(DOCUMENTS);

  const handleUpload = (docId) => {
    Alert.alert(
      'Télécharger un document',
      'Cette fonctionnalité nécessite une connexion au serveur.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Simuler envoi',
          onPress: () => {
            setDocuments(docs =>
              docs.map(doc =>
                doc.id === docId ? { ...doc, status: 'uploaded' } : doc
              )
            );
            Alert.alert('Succès', 'Document envoyé (simulation)');
          },
        },
      ]
    );
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status];
    return (
      <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
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
        <Text style={styles.headerTitle}>Mes documents</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>
              Vérification des documents
            </Text>
            <Text style={styles.infoBannerText}>
              Pour pouvoir louer vos tracteurs, veuillez fournir les documents
              requis. La vérification prend généralement 24 à 48 heures.
            </Text>
          </View>
        </View>

        {/* Documents List */}
        <View style={styles.documentsContainer}>
          {documents.map((doc, index) => (
            <View
              key={doc.id}
              style={[
                styles.documentCard,
                index < documents.length - 1 && styles.documentCardBorder,
              ]}
            >
              <View style={styles.documentIcon}>
                <Ionicons name={doc.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentDescription}>{doc.description}</Text>
                {getStatusBadge(doc.status)}
              </View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleUpload(doc.id)}
              >
                <Ionicons
                  name={doc.status === 'pending' ? 'cloud-upload-outline' : 'refresh-outline'}
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Besoin d'aide ?</Text>
          <Text style={styles.helpText}>
            Si vous rencontrez des difficultés pour fournir vos documents,
            contactez notre support.
          </Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => router.push('/profile/contact')}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
            <Text style={styles.helpButtonText}>Contacter le support</Text>
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryBackground,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoBannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  documentsContainer: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  documentCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  documentDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpSection: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
