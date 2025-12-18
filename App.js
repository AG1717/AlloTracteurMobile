import { ArrowRight, Bell, Check, CreditCard, MapPin, Search, Settings, Star, Tractor, User } from 'lucide-react';
import { useState } from 'react';

export default function AlloTracteurDashboard() {
  const [step, setStep] = useState('search');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    duration: '1',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [reservationNumber, setReservationNumber] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const tracteursDisponibles = [
    { 
      id: 1, 
      nom: 'John Deere 6130R', 
      puissance: '130 CV', 
      prix: 15000, 
      distance: '2.5 km',
      localisation: 'Rufisque',
      disponible: true,
      proprietaire: 'Ferme Diallo',
      note: 4.8
    },
    { 
      id: 2, 
      nom: 'Massey Ferguson 7718', 
      puissance: '180 CV', 
      prix: 18000, 
      distance: '4.1 km',
      localisation: 'Bambilor',
      disponible: true,
      proprietaire: 'Coopérative Ndiaye',
      note: 4.9
    },
    { 
      id: 3, 
      nom: 'Case IH Puma 185', 
      puissance: '185 CV', 
      prix: 19000, 
      distance: '6.8 km',
      localisation: 'Diamniadio',
      disponible: true,
      proprietaire: 'Agri Services Sénégal',
      note: 4.7
    },
    { 
      id: 4, 
      nom: 'Fendt 724 Vario', 
      puissance: '240 CV', 
      prix: 22000, 
      distance: '8.2 km',
      localisation: 'Kayar',
      disponible: true,
      proprietaire: 'Mamadou Agriculture',
      note: 4.9
    }
  ];

  const handleSearch = () => {
    if (searchAddress.trim()) {
      setBookingDetails({...bookingDetails, address: searchAddress});
      setStep('results');
    } else {
      alert('Veuillez entrer une adresse');
    }
  };

  const handleUseCurrentLocation = () => {
    setSearchAddress('Dakar, Plateau');
    setBookingDetails({...bookingDetails, address: 'Dakar, Plateau'});
    setStep('results');
  };

  const handleSelectTractor = (tracteur) => {
    setSelectedTractor(tracteur);
    setStep('booking');
  };

  const calculateTotal = () => {
    if (!selectedTractor) return 0;
    return selectedTractor.prix * parseInt(bookingDetails.duration);
  };

  const handleConfirmBooking = () => {
    if (!bookingDetails.address.trim()) {
      alert('Veuillez entrer une adresse de livraison');
      return;
    }
    if (!bookingDetails.startDate) {
      alert('Veuillez sélectionner une date de début');
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    if (paymentMethod === 'carte') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Veuillez remplir tous les champs de la carte bancaire');
        return;
      }
    } else {
      if (!phoneNumber) {
        alert('Veuillez entrer votre numéro de téléphone');
        return;
      }
    }
    
    const resNumber = 'AT' + Math.floor(10000 + Math.random() * 90000);
    setReservationNumber(resNumber);
    setStep('confirmation');
  };

  const handleNewReservation = () => {
    setStep('search');
    setSelectedTractor(null);
    setBookingDetails({startDate: '', duration: '1', address: ''});
    setSearchAddress('');
    setPhoneNumber('');
    setCardDetails({number: '', expiry: '', cvv: ''});
    setPaymentMethod('orange');
    setReservationNumber('');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedTractor(null);
  };

  const handleBackToResults = () => {
    setStep('results');
    setSelectedTractor(null);
  };

  const handleBackToBooking = () => {
    setStep('booking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tractor size={36} />
              <div>
                <h1 className="text-2xl font-bold">Allo Tracteur</h1>
                <p className="text-green-100 text-sm">Location de tracteurs agricoles</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="p-2 hover:bg-green-700 rounded-full transition relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-green-700 rounded-full transition">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-2 bg-green-700 px-4 py-2 rounded-full">
                <User size={20} />
                <span className="font-medium">Mamadou D.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'search' ? 'text-green-600' : (step === 'results' || step === 'booking' || step === 'payment' || step === 'confirmation') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${(step === 'search' || step === 'results' || step === 'booking' || step === 'payment' || step === 'confirmation') ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {(step === 'results' || step === 'booking' || step === 'payment' || step === 'confirmation') ? '✓' : '1'}
              </div>
              <span className="font-medium hidden sm:inline">Recherche</span>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className={`flex items-center gap-2 ${step === 'booking' ? 'text-green-600' : (step === 'payment' || step === 'confirmation') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${(step === 'booking' || step === 'payment' || step === 'confirmation') ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {(step === 'payment' || step === 'confirmation') ? '✓' : '2'}
              </div>
              <span className="font-medium hidden sm:inline">Réservation</span>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-green-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${(step === 'payment' || step === 'confirmation') ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {step === 'confirmation' ? '✓' : '3'}
              </div>
              <span className="font-medium hidden sm:inline">Paiement</span>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
            <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {step === 'confirmation' ? '✓' : '4'}
              </div>
              <span className="font-medium hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        
        {step === 'search' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🚜</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Trouvez un tracteur près de chez vous</h2>
                <p className="text-gray-600">Entrez votre adresse ou position pour voir les tracteurs disponibles</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Votre adresse ou localisation
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Ex: Rufisque, Dakar, Thiès..."
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <Search size={20} />
                      Rechercher
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleUseCurrentLocation}
                  className="w-full border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  <MapPin size={20} />
                  Utiliser ma position actuelle
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div>
            <div className="mb-6">
              <button 
                onClick={handleBackToSearch}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mb-4"
              >
                ← Modifier la recherche
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                Tracteurs disponibles près de {bookingDetails.address}
              </h2>
              <p className="text-gray-600">{tracteursDisponibles.length} tracteurs trouvés</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracteursDisponibles.map(tracteur => (
                <div key={tracteur.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center text-6xl">
                    🚜
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">{tracteur.nom}</h3>
                        <p className="text-gray-600">{tracteur.puissance}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        {tracteur.note}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{tracteur.localisation} • {tracteur.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{tracteur.proprietaire}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{tracteur.prix.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm"> FCFA/jour</span>
                      </div>
                      <button 
                        onClick={() => handleSelectTractor(tracteur)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                      >
                        Réserver
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'booking' && selectedTractor && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button 
                onClick={handleBackToResults}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
              >
                ← Retour aux résultats
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tracteur sélectionné</h3>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg mb-4 flex items-center justify-center text-5xl">
                  🚜
                </div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">{selectedTractor.nom}</h4>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Puissance:</span> {selectedTractor.puissance}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {selectedTractor.localisation}
                  </p>
                  <p className="flex items-center gap-2">
                    <User size={16} />
                    {selectedTractor.proprietaire}
                  </p>
                  <p className="flex items-center gap-2">
                    <Star size={16} fill="currentColor" className="text-yellow-500" />
                    Note: {selectedTractor.note}/5
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Prix par jour</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedTractor.prix.toLocaleString()} <span className="text-lg">FCFA</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Détails de la réservation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 Adresse de livraison
                    </label>
                    <input
                      type="text"
                      value={bookingDetails.address}
                      onChange={(e) => setBookingDetails({...bookingDetails, address: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez l'adresse complète"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Date de début
                    </label>
                    <input
                      type="date"
                      value={bookingDetails.startDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, startDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ Durée de location (jours)
                    </label>
                    <select
                      value={bookingDetails.duration}
                      onChange={(e) => setBookingDetails({...bookingDetails, duration: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[1,2,3,4,5,6,7,10,14,21,30].map(d => (
                        <option key={d} value={d}>{d} jour{d > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Prix par jour:</span>
                      <span className="font-semibold">{selectedTractor.prix.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Durée:</span>
                      <span className="font-semibold">{bookingDetails.duration} jour(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-green-300">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmBooking}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    Continuer au paiement
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && selectedTractor && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button 
                onClick={handleBackToBooking}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
              >
                ← Modifier la réservation
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Paiement</h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Récapitulatif de la commande</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracteur:</span>
                    <span className="font-semibold">{selectedTractor.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-semibold">{bookingDetails.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{bookingDetails.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-semibold">{bookingDetails.duration} jour(s)</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-300">
                    <span className="font-bold text-lg">Montant total:</span>
                    <span className="font-bold text-2xl text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Méthode de paiement</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="orange"
                      checked={paymentMethod === 'orange'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-orange-500"
                    />
                    <span className="ml-3 font-semibold text-lg">🟠 Orange Money</span>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="wave"
                      checked={paymentMethod === 'wave'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-500"
                    />
                    <span className="ml-3 font-semibold text-lg">🔵 Wave</span>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'carte' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="carte"
                      checked={paymentMethod === 'carte'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-green-500"
                    />
                    <span className="ml-3 font-semibold text-lg">💳 Carte bancaire</span>
                  </label>
                </div>
              </div>

              {paymentMethod !== 'carte' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="77 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous recevrez une notification pour valider le paiement
                  </p>
                </div>
              )}

              {paymentMethod === 'carte' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💳 Numéro de carte
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      maxLength="19"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        maxLength="5"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        maxLength="3"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handlePayment}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <CreditCard size={24} />
                Payer {calculateTotal().toLocaleString()} FCFA
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && selectedTractor && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Réservation confirmée !</h2>
              <p className="text-gray-600 mb-8">
                Votre tracteur sera livré à l'adresse indiquée le {bookingDetails.startDate}
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                <h3 className="font-bold text-gray-800 mb-4 text-center">Détails de votre réservation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Numéro de réservation:</span>
                    <span className="font-bold text-green-600 text-xl">#{reservationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tracteur:</span>
                    <span className="font-semibold">{selectedTractor.nom}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Puissance:</span>
                    <span className="font-semibold">{selectedTractor.puissance}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Adresse de livraison:</span>
                    <span className="font-semibold text-right">{bookingDetails.address}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Date de début:</span>
                    <span className="font-semibold">{bookingDetails.startDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-semibold">{bookingDetails.duration} jour(s)</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Propriétaire:</span>
                    <span className="font-semibold">{selectedTractor.proprietaire}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-gray-300">
                    <span className="font-bold text-lg">Montant payé:</span>
                    <span className="font-bold text-2xl text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-6">
                <p className="text-blue-800 font-medium mb-2">📱 Prochaines étapes</p>
                <p className="text-blue-700 text-sm">
                  • Un SMS de confirmation a été envoyé<br/>
                  • Le propriétaire {selectedTractor.proprietaire} vous contactera sous 2h<br/>
                  • Le tracteur sera livré le {bookingDetails.startDate} à l'heure convenue
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleNewReservation}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Faire une nouvelle réservation
                </button>
                <button className="w-full border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                  Voir toutes mes réservations
                </button>
                <button className="w-full text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                  Télécharger le reçu (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}