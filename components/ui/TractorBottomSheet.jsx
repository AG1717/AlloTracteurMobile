//import BottomSheet from "@gorhom/bottom-sheet";

import { View, Text, Button, StyleSheet } from "react-native";

export default function TractorBottomSheet({ tractor, onClose, onView }) {
  if (!tractor) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>{tractor.name}</Text>
        <Text>Propriétaire: {tractor.ownerName}</Text>
        <Text>Prix: {tractor.pricePerHour} FCFA / Ha</Text>

        <View style={styles.actions}>
          <Button title="Voir détails" onPress={onView} />
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
});

