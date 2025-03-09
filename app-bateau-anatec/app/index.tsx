"use client"
import React, { useState, useEffect } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation } from '@/app/location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WifiManager from 'react-native-wifi-reborn'; 
import { requestOtherPhoneLocationPermission, getOtherPhoneLocation } from '@/app/otherPhoneLocation';

const App = () => {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number; title?: string }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number; longitude: number; title?: string } | null>(null);
  const [otherPhoneLocation, setOtherPhoneLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const targetSSID = "haze";
  const [apiLocation, setApiLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Initialiser la base de données
    initDatabase();

    // Vérifier la connexion Wi-Fi et obtenir la position
    const checkWifiAndGetLocation = async () => {
      try {
        console.log("WifiManager:", WifiManager);
        if (WifiManager) { // Check if WifiManager is not null
          // Check if getCurrentWifiSSID is a function before calling it
          if (typeof WifiManager.getCurrentWifiSSID === 'function') {
            const wifi = await WifiManager.getCurrentWifiSSID();
            console.log("wifi", wifi);

            if (wifi === targetSSID) {
              // Demander l'autorisation d'accéder à la position et obtenir la position
              await requestLocationPermission();
              const location = await getCurrentLocation();
              setLocation(location);
              await saveLocation(location.coords.latitude, location.coords.longitude);

              // Récupérer et afficher les positions enregistrées
              const savedLocations = await fetchLocations();
              console.log('Positions enregistrées :', savedLocations);

              // Demander la permission et obtenir la position de l'autre téléphone
              const otherPhonePermission = await requestOtherPhoneLocationPermission();
              if (otherPhonePermission) {
                const otherPhoneLocation = await getOtherPhoneLocation();
                setOtherPhoneLocation(otherPhoneLocation);
                await saveLocation(otherPhoneLocation.latitude, otherPhoneLocation.longitude);
                // Envoyer la position à l'API
                sendLocationToApi(otherPhoneLocation);
              }
            } else{
              console.log("Pas connecté au SSID cible.");
            }
          } else {
            console.log("getCurrentWifiSSID is not a function.");
          }
        } else {
          console.log("WifiManager is null.");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du SSID :', error);
      }
    };

    const fetchLocationFromApi = async () => {
      try {
        const response = await fetch('http://localhost:3001/location');
        const data = await response.json();
        setApiLocation(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la position depuis l\'API:', error);
      }
    };

    const sendLocationToApi = async (location: { latitude: number; longitude: number }) => {
      try {
        await fetch('http://localhost:3001/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        });
        console.log('Position envoyée à l\'API avec succès.');
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la position à l\'API:', error);
      }
    };

    checkWifiAndGetLocation(); // Vérification initiale
    fetchLocationFromApi();

    // Mettre en place un intervalle pour vérifier périodiquement la connexion Wi-Fi (facultatif)
    const intervalId = setInterval(() => {
      checkWifiAndGetLocation();
      fetchLocationFromApi();
    }, 10000); // Vérifier toutes les 10 secondes

    return () => clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => {
      if (prevMarkers.length < 4) {
        return [...prevMarkers, { latitude, longitude, title: `Position ${prevMarkers.length + 1}` }];
      }
      return prevMarkers;
    });
  };

  const handleMarkerPress = (marker: { latitude: number; longitude: number; title?: string }) => {
    setSelectedMarker(marker);
  };

  const handleRemoveRectangle = () => {
    setSelectedMarker(null);
  };

  const handleRemoveMarker = () => {
    if (selectedMarker) {
      setMarkers((prevMarkers) =>
        prevMarkers.filter(
          (marker) =>
            marker.latitude !== selectedMarker.latitude ||
            marker.longitude !== selectedMarker.longitude
        )
      );
      setSelectedMarker(null);
    }
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
            title="Mattéo"
            description="HOME"
            pinColor='blue'
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={`Position ${index + 1}`}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
          {/* Afficher la position de l'autre téléphone */}
          {otherPhoneLocation && (
            <Marker
              coordinate={otherPhoneLocation}
              title="Autre Téléphone"
              pinColor="green"
            />
          )}
          {/* Afficher la position de l'API */}
          {apiLocation && (
            <Marker
              coordinate={apiLocation}
              title="API Location"
              pinColor="orange"
            />
          )}
        </MapView>

        ) : (
          <Text>Chargement...</Text>
        )}

        {selectedMarker && (
          <View style={styles.rectangle}>
            <View style={styles.rectangle_head}>
              <Text style={styles.head_titre}>{selectedMarker.title}</Text>
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
              <TouchableOpacity style={styles.button_sup} onPress={handleRemoveMarker}>
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