import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function App() {
  const [friendPosition, setFriendPosition] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
  });

  // Simuler la mise à jour de la position de l'ami (à remplacer par une API réelle)
  const updateFriendPosition = () => {
    // Exemple : Récupérer la position actuelle de l'ami
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFriendPosition({ latitude, longitude });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Mettre à jour la position toutes les 5 secondes (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      updateFriendPosition();
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: friendPosition.latitude,
          longitude: friendPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: friendPosition.latitude,
            longitude: friendPosition.longitude,
          }}
          title="Position de l'ami"
          description="Mon ami est ici !"
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Latitude: {friendPosition.latitude.toFixed(4)}
        </Text>
        <Text style={styles.infoText}>
          Longitude: {friendPosition.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});