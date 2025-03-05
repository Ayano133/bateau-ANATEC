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

  const handleRemoveRectangle = () => {
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
            <View style={styles.rectangle_head}>
              <Text style={styles.head_titre}>Titre</Text>
              <TouchableOpacity style={styles.button_fermer} onPress={handleRemoveRectangle}>
                <Text style={styles.button_fermer_texte}>Fermer</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rectangle_gps}>
              <Text style={styles.text_titre_gps}>Latitude:</Text>
              <Text style={styles.coordonnées}>{selectedMarker.latitude}</Text>
              <Text style={styles.text_titre_gps}>Longitude:</Text>
              <Text style={styles.coordonnées}>{selectedMarker.longitude}</Text>
            </View>

            <View style={styles.rectangle_button}>
              <TouchableOpacity style={styles.button_sup}>
                <Text style={styles.button_sup_texte}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button_ALLER}>
                <Text style={styles.button_ALLER_texte}>Aller à la position</Text>
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
    left: '10%',
    width: '80%',
    backgroundColor: 'rgba(143, 138, 138, 0.8)',
    borderColor: 'skyblue',
    borderWidth: 1,
    borderRadius: 10,
  },

  rectangle_head:{
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  head_titre:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  button_fermer:{
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 50,
    width: 90,
  },

  button_fermer_texte:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  rectangle_gps: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
  },

  text_titre_gps:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textDecorationLine: 'underline',
  },

  coordonnées:{
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 10,
  },

  rectangle_button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
  },

  button_sup:{
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 50,
  },

  button_sup_texte:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },

  button_ALLER:{
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
  },

  button_ALLER_texte:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'skyblue',
  },
});

export default App;