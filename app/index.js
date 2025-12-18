// app/index.js
// Version React Native (Expo) – conversion du dashboard AlloTracteur

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [step, setStep] = useState('search');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ startDate: '', duration: '1', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');

  const tracteursDisponibles = [
    { id: 1, nom: 'John Deere 6130R', puissance: '130 CV', prix: 15000, localisation: 'Rufisque' },
    { id: 2, nom: 'Massey Ferguson 7718', puissance: '180 CV', prix: 18000, localisation: 'Bambilor' },
  ];

  const calculateTotal = () => selectedTractor ? selectedTractor.prix * parseInt(bookingDetails.duration) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* HEADER */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Ionicons name="tractor" size={28} color="#16a34a" />
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 10 }}>Allo Tracteur</Text>
        </View>

        {/* SEARCH */}
        {step === 'search' && (
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Trouvez un tracteur</Text>
            <TextInput
              placeholder="Votre adresse"
              value={searchAddress}
              onChangeText={setSearchAddress}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
            />
            <TouchableOpacity
              onPress={() => searchAddress && setStep('results')}
              style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Rechercher</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RESULTS */}
        {step === 'results' && (
          <View>
            {tracteursDisponibles.map(t => (
              <View key={t.id} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{t.nom}</Text>
                <Text>{t.puissance}</Text>
                <Text>{t.localisation}</Text>
                <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>{t.prix} FCFA / jour</Text>
                <TouchableOpacity
                  onPress={() => { setSelectedTractor(t); setStep('booking'); }}
                  style={{ marginTop: 10, backgroundColor: '#16a34a', padding: 10, borderRadius: 8 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Réserver</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* BOOKING */}
        {step === 'booking' && selectedTractor && (
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedTractor.nom}</Text>
            <TextInput
              placeholder="Adresse de livraison"
              value={bookingDetails.address}
              onChangeText={v => setBookingDetails({ ...bookingDetails, address: v })}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginVertical: 10 }}
            />
            <TextInput
              placeholder="Durée (jours)"
              keyboardType="numeric"
              value={bookingDetails.duration}
              onChangeText={v => setBookingDetails({ ...bookingDetails, duration: v })}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }}
            />
            <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Total: {calculateTotal()} FCFA</Text>
            <TouchableOpacity
              onPress={() => setStep('payment')}
              style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Continuer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PAYMENT */}
        {step === 'payment' && (
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Paiement</Text>
            <TextInput
              placeholder="Numéro de téléphone"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginVertical: 12 }}
            />
            <TouchableOpacity
              onPress={() => { setReservationNumber('AT' + Math.floor(Math.random() * 10000)); setStep('confirmation'); }}
              style={{ backgroundColor: '#16a34a', padding: 14, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Payer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CONFIRMATION */}
        {step === 'confirmation' && (
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Ionicons name="checkmark-circle" size={60} color="#16a34a" style={{ textAlign: 'center' }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Réservation confirmée</Text>
            <Text style={{ textAlign: 'center' }}>Numéro: {reservationNumber}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
