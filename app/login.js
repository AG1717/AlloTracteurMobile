import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
        Connexion
      </Text>

      <TextInput placeholder="Email" style={{ borderBottomWidth: 1, marginBottom: 20 }} />
      <TextInput placeholder="Mot de passe" secureTextEntry style={{ borderBottomWidth: 1 }} />

      <TouchableOpacity
        style={{ backgroundColor: "#2e7d32", padding: 16, borderRadius: 10, marginTop: 30 }}
        onPress={() => router.replace("/map")}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Continuer
        </Text>
      </TouchableOpacity>
    </View>
  );
}
