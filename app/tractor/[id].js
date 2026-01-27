import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { tractors } from "../../services/tractor.service";
import { sendRentalRequest } from "../../services/request.service";

export default function TractorDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const tractor = tractors.find(t => t.id === id);

  if (!tractor) {
    return <Text>Tracteur introuvable</Text>;
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {tractor.name}
      </Text>

      <Text style={{ marginVertical: 10 }}>
        Prix : {tractor.price} FCFA / hectare
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#2e7d32",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Louer ce tracteur
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ marginTop: 20, color: "#2e7d32" }}>
          Retour à la carte
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#2e7d32",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
        onPress={() =>
          sendRentalRequest({
            tractorId: tractor.id,
            userId: "user_1",
            message: "Bonjour, je souhaite louer ce tracteur.",
          })
        }
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Envoyer une demande
        </Text>
      </TouchableOpacity>
    </View>
  );
}
