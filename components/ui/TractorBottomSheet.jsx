import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

export default function TractorBottomSheet({ tractor, onClose, onView }) {
  if (!tractor) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={["30%"]}
      onClose={onClose}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {tractor.name}
        </Text>

        <Text style={{ marginVertical: 10 }}>
          {tractor.price} FCFA / jour
        </Text>

        <TouchableOpacity
          onPress={onView}
          style={{
            backgroundColor: "#2e7d32",
            padding: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Voir détails
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
