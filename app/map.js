import { View, Text } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import TractorMarker from "../components/ui/TractorMarker";
import TractorBottomSheet from "../components/ui/TractorBottomSheet";
import { getAvailableTractors } from "../services/tractor.service";

export default function MapScreen() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [tractors, setTractors] = useState(getAvailableTractors());
  const [selectedTractor, setSelectedTractor] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (!location) {
    return <Text>Chargement de la carte...</Text>;
  }

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {tractors.map((tractor) => (
          <TractorMarker
            key={tractor.id}
            tractor={tractor}
            onPress={() => setSelectedTractor(tractor)}
          />
        ))}
      </MapView>

      {selectedTractor && (
        <TractorBottomSheet
          tractor={selectedTractor}
          onClose={() => setSelectedTractor(null)}
          onView={() =>
            router.push(`/tractor/${selectedTractor.id}`)
          }
        />
      )}
    </>
  );
}
