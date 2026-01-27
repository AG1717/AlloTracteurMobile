import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getAvailableTractors } from "../../services/tractor.service";

export default function MachinesScreen() {
  const router = useRouter();
  const tractors = getAvailableTractors();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracteurs disponibles 🚜</Text>

      <FlatList
        data={tractors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/machines/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} FCFA / hectare</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#2E7D32",
    marginTop: 4,
  },
});
