import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 12 }}>
        Allô Tracteur 🚜
      </Text>

      <Text style={{ fontSize: 16, color: "#555", marginBottom: 40 }}>
        Trouvez un tracteur près de vous pour vos travaux agricoles
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#2e7d32",
          padding: 16,
          borderRadius: 10,
          marginBottom: 16,
        }}
        onPress={() => router.push("/login")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Se connecter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={{ textAlign: "center", color: "#2e7d32" }}>
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}
