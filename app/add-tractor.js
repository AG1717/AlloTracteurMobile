import { View, TextInput, TouchableOpacity, Text } from "react-native";

export default function AddTractor() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Ajouter un tracteur
      </Text>

      <TextInput placeholder="Nom du tracteur" />
      <TextInput placeholder="Prix / hectare" keyboardType="numeric" />

      <TouchableOpacity
        style={{
          backgroundColor: "#2e7d32",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Publier
        </Text>
      </TouchableOpacity>
    </View>
  );
}
