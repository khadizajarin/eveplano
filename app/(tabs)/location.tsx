import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const [map, setMap] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapViewRef = useRef<MapView | null>(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const newRegion: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMap(newRegion);

    mapViewRef.current?.animateToRegion(newRegion, 1000);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {"Let's see where we are located!"}
      </Text>

      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={map}
        showsUserLocation
        showsMyLocationButton
        // ❗ IMPORTANT: force free map provider
        provider={undefined}
      >
        <Marker coordinate={map} title="You are here" />
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={getLocation} />
      </View>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 12,
    color: '#3A3D42',
    borderBottomWidth: 1,
    borderBottomColor: '#AB8C56',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
});