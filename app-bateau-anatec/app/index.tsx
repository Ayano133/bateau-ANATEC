"use client"
import { Stack, useNavigation } from 'expo-router';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initDatabase, saveLocation, fetchLocations } from '@/app/database';
import { requestLocationPermission, getCurrentLocation } from '@/app/location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Platform } from 'react-native';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import * as Network from 'expo-network'; // Import expo-network

const App = () => {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number; title?: string }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number; longitude: number; title?: string } | null>(null);
  const [otherPhoneLocation, setOtherPhoneLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [serverIp, setServerIp] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const previousLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeApp = async () => {
      await fetchIp(); // Assurez-vous que l'IP est récupérée avant de continuer
      if (!serverIp) {
        console.warn('Impossible de continuer sans adresse IP.');
        return;
      }

      initDatabase();
      await initLocation();
      fetchOtherPhoneLocation();

      const intervalId = setInterval(fetchOtherPhoneLocation, 5000); // Fetch the other phone's location every 5 seconds
      navigation.setOptions({ headerShown: false });

      return () => clearInterval(intervalId);
    };

    initializeApp();
  }, [navigation, serverIp]);

  const fetchIp = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected) {
        let ip = networkState.ipAddress;

        // If ipAddress is undefined, try to get it from networkInfo
        if (!ip && networkState.networkInfo) {
          // @ts-ignore
          ip = networkState.networkInfo.ipAddress;
        }

        if (ip) {
          console.log('Adresse IP du serveur:', ip);
          setServerIp(ip);
        } else {
          console.warn('Adresse IP non trouvée, utilisation de l\'adresse IP de secours.');
          setServerIp('172.20.10.2'); // Adresse IP de secours
        }
      } else {
        console.warn('Pas de connexion réseau détectée.');
        setServerIp(null); // Ensure serverIp is null if no connection
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse IP:', error);
      setServerIp(null); // Ensure serverIp is null on error
    }
  };

  const initLocation = async () => {
    try {
      await requestLocationPermission();
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      await saveLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);

      const savedLocations = await fetchLocations();
      // console.log('Positions enregistrées:', savedLocations);

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchOtherPhoneLocation = async () => {
    try {
      if (!serverIp) {
        console.warn('Adresse IP du serveur non définie.');
        return;
      }
      const response = await fetch(`http://${serverIp}:3001/location`);
      if (response.ok) {
        const data = await response.json();
        const newLocation = { latitude: data.latitude, longitude: data.longitude };

        // Compare the new location with the previous location
        const tolerance = 0.000001; // Define a tolerance value
        const previousLocation = previousLocationRef.current;

        if (!previousLocation || 
            Math.abs(newLocation.latitude - previousLocation.latitude) > tolerance || 
            Math.abs(newLocation.longitude - previousLocation.longitude) > tolerance) {
          setOtherPhoneLocation(newLocation);
          previousLocationRef.current = newLocation; // Update the ref with the new location
          // console.log('Localisation de l\'autre téléphone:', data);
        } else {
          
        }
      } else {
        console.log('Localisation de l\'autre téléphone introuvable ou erreur lors de la récupération.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation de l\'autre téléphone:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => {
      if (prevMarkers.length < 2) {
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

  const handleGoToPosition = async () => {
    if (selectedMarker && serverIp) {
      try {
        const response = await fetch(`http://${serverIp}:3001/set-location`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: selectedMarker.latitude,
            longitude: selectedMarker.longitude,
          }),
        });

        if (response.ok) {
          console.log('Position du marker envoyée au serveur avec succès !');
          await fetchOtherPhoneLocation(); // Fetch the other phone's location immediately
        } else {
          console.error('Échec de l\'envoi de la position du marker au serveur.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la position du marker au serveur:', error);
      }
    }
  };
  const AirdropAppat = async () => {
    try {
      if (!serverIp) {
        console.warn('Adresse IP du serveur non définie.');
        return;
      }
      const response = await fetch(`http://${serverIp}:3001/airdrop-appat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Lache les appats'
        }),
      });

      if (response.ok) {
        console.log('Alert envoyée au serveur avec succès !');
        await fetchOtherPhoneLocation(); // Fetch the other phone's location immediately
      } else {
        console.error('Échec de l\'envoi de l\'alert au serveur.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'alert au serveur:', error); 
    }
  };

  const handleRemoveAllMarkers = () => {
    setMarkers([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {location ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords?.latitude || 0,
              longitude: location?.coords?.longitude || 0,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            // provider={PROVIDER_GOOGLE}
            onPress={handleMapPress}
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
            {otherPhoneLocation && (
              <Marker
                coordinate={{ latitude: otherPhoneLocation.latitude, longitude: otherPhoneLocation.longitude }}
                title="Lucas"
                pinColor="green"
                description={`Latitude: ${otherPhoneLocation.latitude}, Longitude: ${otherPhoneLocation.longitude}`}
              />
            )}
          </MapView>
        ) : (
          <Text>Chargement...</Text>
        )}

        <TouchableOpacity style={styles.button_centrer} onPress={() => {
          if (location?.coords) {
            // Vérifie si mapRef.current est défini avant d'appeler animateToRegion
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }, 3000);
            } else {
              console.warn('mapRef.current is null');
            }
          } else {
            console.warn('location or location.coords is undefined');
          }
        }}>
          <Image source={require('@/images/Maps-Center-Direction-icon.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button_appats} onPress={AirdropAppat} >
          <Image source={require('@/images/fish.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button_remove_all_markers} onPress={handleRemoveAllMarkers} >
          <Image source={require('@/images/markers sup.png')} style={{ width: 35, height: 35,}} />
        </TouchableOpacity>

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

              <TouchableOpacity style={styles.button_ALLER} onPress={handleGoToPosition}>
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

  rectangle_head: {
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  head_titre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  button_fermer: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 50,
    width: 90,
  },

  button_fermer_texte: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  rectangle_gps: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
  },

  text_titre_gps: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textDecorationLine: 'underline',
  },

  coordonnées: {
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

  button_sup: {
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 50,
  },

  button_sup_texte: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },

  button_ALLER: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
  },

  button_ALLER_texte: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'skyblue',
  },

  button_centrer: {
    position: 'absolute',
    top: '50%',
    left: '1.5%',
    backgroundColor: 'rgba(192, 248, 250, 1)',
    padding: 10,
    borderRadius: 50,
  },

  button_appats: {
    position: 'absolute',
    top: '42%',
    left: '1.5%',
    backgroundColor: 'rgba(192, 248, 250, 1)',
    padding: 10,
    borderRadius: 50,
  },

  button_remove_all_markers: {
    position: 'absolute',
    top: '58%',
    left: '1.5%',
    backgroundColor: 'rgba(192, 248, 250, 1)',
    padding: 10,
    borderRadius: 50,
  },
});

export default App;