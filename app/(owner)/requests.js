import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import { colors } from '../../constants/colors';
import {
  acceptBooking,
  getBookingsByOwner,
  rejectBooking,
} from '../../services/booking.service';
import { getUserById } from '../../services/user.service';
import { AuthContext } from '../context/AuthContext';

const TABS = [
  { id: 'pending', label: 'En attente' },
  { id: 'confirmed', label: 'Confirmées' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'completed', label: 'Terminées' },
  { id: 'cancelled', label: 'Annulées' },
];

export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState(
    getBookingsByOwner(user?.id || 'owner_1')
  );

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  const getTabCount = (tabId) => {
    return bookings.filter((b) => b.status === tabId).length;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setBookings(getBookingsByOwner(user?.id || 'owner_1'));
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Formater le numéro pour WhatsApp (format international sénégalais)
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    // Enlever les espaces et caractères spéciaux
    let cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
    // Si le numéro commence par 7, ajouter +221
    if (cleaned.startsWith('7')) {
      cleaned = '+221' + cleaned;
    }
    // Si le numéro ne commence pas par +, ajouter +221
    if (!cleaned.startsWith('+')) {
      cleaned = '+221' + cleaned;
    }
    return cleaned.replace('+', '');
  };

  // Afficher le popup de contact après acceptation
  const showContactOptions = (booking) => {
    const client = getUserById(booking.clientId);
    if (!client?.telephone) {
      Alert.alert('Info', 'Numéro de téléphone du client non disponible');
      return;
    }

    const phoneNumber = client.telephone;
    const whatsappNumber = formatPhoneForWhatsApp(phoneNumber);
    const clientName = `${client.prenom || ''} ${client.nom || ''}`.trim();

    Alert.alert(
      '✅ Réservation acceptée !',
      `Contactez ${clientName} pour organiser la livraison du tracteur.`,
      [
        {
          text: 'Plus tard',
          style: 'cancel',
        },
        {
          text: '💬 WhatsApp',
          onPress: () => {
            const message = `Bonjour ${client.prenom || ''}, votre réservation de tracteur a été acceptée. Quand souhaitez-vous que je livre le tracteur ?`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            Linking.openURL(whatsappUrl).catch(() => {
              Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp');
            });
          },
        },
        {
          text: '📞 Appeler',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
              Alert.alert('Erreur', 'Impossible de passer l\'appel');
            });
          },
        },
      ]
    );
  };

  const handleAccept = (bookingId) => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous accepter cette réservation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Accepter',
          onPress: () => {
            // Récupérer les infos de la réservation avant de l'accepter
            const booking = bookings.find(b => b.id === bookingId);

            acceptBooking(bookingId);
            setBookings(getBookingsByOwner(user?.id || 'owner_1'));

            // Afficher les options de contact
            if (booking) {
              showContactOptions(booking);
            } else {
              Alert.alert('Succès', 'Réservation acceptée !');
            }
          },
        },
      ]
    );
  };

  const handleReject = (bookingId) => {
    Alert.alert(
      'Refuser',
      'Voulez-vous refuser cette réservation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: () => {
            rejectBooking(bookingId, 'Refusé par le propriétaire');
            setBookings(getBookingsByOwner(user?.id || 'owner_1'));
            Alert.alert('Info', 'Réservation refusée');
          },
        },
      ]
    );
  };

  const enrichBookingWithClient = (booking) => {
    const client = getUserById(booking.clientId);
    return {
      ...booking,
      client: client,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Demandes</Text>
          <Text style={styles.subtitle}>
            {bookings.length} réservation(s) au total
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => {
            const count = getTabCount(tab.id);
            return (
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
                {count > 0 && (
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
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Liste des réservations */}
        {filteredBookings.length > 0 ? (
          <FlatList
            data={filteredBookings.map(enrichBookingWithClient)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookingCard
                booking={item}
                showClient
                showActions={item.status === 'pending'}
                onPress={() => router.push(`/booking/${item.id}`)}
                onAccept={() => handleAccept(item.id)}
                onReject={() => handleReject(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          />
        ) : (
          <EmptyState
            icon={
              activeTab === 'pending'
                ? 'mail-outline'
                : activeTab === 'completed'
                ? 'checkmark-circle-outline'
                : 'calendar-outline'
            }
            title={
              activeTab === 'pending'
                ? 'Aucune demande en attente'
                : `Aucune réservation ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}`
            }
            description={
              activeTab === 'pending'
                ? 'Les nouvelles demandes de réservation apparaîtront ici.'
                : ''
            }
          />
        )}
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
    padding: 20,
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
});
