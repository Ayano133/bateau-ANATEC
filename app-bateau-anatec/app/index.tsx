"use client"
import React, { useState, useEffect } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation, } from '@/app/location';
import MapView from 'react-native-maps';
import { View, Text } from 'react-native';

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

    <View>
      <Text>
        {location ? (
          <Text>Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </Text>
    </View>
  );
};

export default App;