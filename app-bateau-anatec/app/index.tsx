"use client"
import React, { useState, useEffect } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation, } from '@/app/location';
import MapView,{Marker} from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const App = () => {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number; longitude: number; title?: string; description?: string } | null>(null);
  const [nextMarkerId, setNextMarkerId] = useState(1);
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

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newMarker = {
      latitude,
      longitude,
      title: `Marker ${nextMarkerId}`,
      description: `Location ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
    setMarkers(prevMarkers => {
      const newMarkers = [...prevMarkers, newMarker];
      return newMarkers.slice(0, 5); // Limit to a maximum of 5 markers
    });
    setSelectedMarker(null); // Clear selected marker when map is pressed
    setNextMarkerId(nextMarkerId + 1);
  };

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
  };

  const handleDeleteMarker = () => {
    if (selectedMarker) {
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker !== selectedMarker));
      setSelectedMarker(null);
    }
  };

  const handleGoToPosition = () => {
    // Implement logic to move the map to the selected marker's position
    console.log('Go to position:', selectedMarker);
    setSelectedMarker(null);
  };

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
            onPress={handleMapPress}
            mapType="satellite"
          >
          
          <Marker
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title="Home"
            description="Je suis ici"
            pinColor='blue'
          />

          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              title={`Marker ${index + 1}`}
              description={`Location ${marker.latitude}, ${marker.longitude}`}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        </MapView>
        ) : (
          <Text>Loading...</Text>
        )}

        {selectedMarker && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Nom: {selectedMarker.title}</Text>
              <Text>Latitude: {selectedMarker.latitude.toFixed(6)}</Text>
              <Text>Longitude: {selectedMarker.longitude.toFixed(6)}</Text>
              <TouchableOpacity style={styles.button} onPress={handleDeleteMarker}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleGoToPosition}>
                <Text style={styles.buttonText}>Aller à la position</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});


export default App;