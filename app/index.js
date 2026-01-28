import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1598514982205-f6f38f51e8d2" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Allô Tracteur 🚜</Text>
        <Text style={styles.subtitle}>
          Louez un tracteur près de chez vous, en quelques clics.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/map")}>
          <Text style={styles.btnText}>Voir les tracteurs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/auth/login")}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push("/auth/register")}>
          <Text style={styles.linkText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryBtn: {
    backgroundColor: "#1565C0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkBtn: {
    padding: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});
