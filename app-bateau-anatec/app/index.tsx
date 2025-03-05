"use client"
import React, { useState, useEffect } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation, } from '@/app/location';
import MapView,{Marker} from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const App = () => {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);

  useEffect(() => {
    // Initialiser la base de données
    initDatabase();

    // Récupérer la localisation et la sauvegarder
    (async () => {
      try {
        await requestLocationPermission();
        const location = await getCurrentLocation();
        setLocation(location);
        await saveLocation(location.coords.latitude, location.coords.longitude);

        // Récupérer et afficher les localisations sauvegardées
        const savedLocations = await fetchLocations();
        console.log('Saved locations:', savedLocations);
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, []);



  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            // mapType="satellite"
          >
          
          <Marker
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title="Home"
            description="Je suis ici"
            pinColor='blue'
          />
        </MapView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default App;