"use client"
import React, { useState, useEffect } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation, } from '@/app/location';
import MapView,{Marker} from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const App = () => {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number; longitude: number } | null>(null);

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
    setMarkers((prevMarkers) => {
      if (prevMarkers.length < 5) {
        return [...prevMarkers, { latitude, longitude }];
      }
      return prevMarkers;
    });
  };

  const handleMarkerPress = (marker: { latitude: number; longitude: number }) => {
    setSelectedMarker(marker);
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
            onPress={handleMapPress} // Ajouter l'événement onPress
            // mapType="satellite"
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
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={`Marker ${index + 1}`}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        </MapView>

        ) : (
          <Text>Loading...</Text>
        )}

        {selectedMarker && (
          <View style={styles.rectangle}>
            <View style={styles.rectangle_text}>
              <Text style={styles.Texte}>Titre</Text>
              <Text style={styles.Texte}></Text>
              <Text style={styles.Texte}>Latitude: {selectedMarker.latitude}</Text>
              <Text style={styles.Texte}>Longitude: {selectedMarker.longitude}</Text>
            </View>

            <View style={styles.rectangle_button}>
              <TouchableOpacity style={styles.button}>
                <Text>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Text>Aller à la position</Text>
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
  rectangle: {
    position: 'absolute',
    bottom: '32%',
    left: '12%',
    width: 300,
    height: 300,
    backgroundColor: 'rgba(143, 138, 138, 0.8)',
    borderColor: 'skyblue',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 10
  },

  rectangle_text: {
    backgroundColor: ''
  },

  rectangle_button: {
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    marginTop: 50
  },

  button:{
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 20,
  },

  Texte:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  }
});


export default App;