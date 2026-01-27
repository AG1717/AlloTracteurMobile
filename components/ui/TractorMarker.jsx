import { Marker } from "react-native-maps";

export default function TractorMarker({ tractor, onPress }) {
  return (
    <Marker
      coordinate={tractor.location}
      title={tractor.name}
      description={`🟢 Disponible • ${tractor.pricePerDay} FCFA/Ha`}
      onPress={onPress}
    />
  );
}
