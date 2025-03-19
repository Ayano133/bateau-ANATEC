// OtherPhoneApp.tsx (Create a new React Native project for this)
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { requestLocationPermission, getCurrentLocation } from './location'; // You'll need to implement this

const OtherPhoneApp = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const sendLocation = async () => {
      try {
        await requestLocationPermission();
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation.coords);

        // Replace with your server's IP address
        const serverIp = 'http://192.168.43.1:3001/location'; // Example - REPLACE THIS!
        const response = await fetch(serverIp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentLocation.coords),
        });

        if (response.ok) {
          console.log('Localisation envoyée avec succès depuis l\'autre téléphone');
        } else {
          console.error('Erreur lors de l\'envoi de la localisation depuis l\'autre téléphone:', response.status);
        }
      } catch (error) {
        console.error('Erreur dans l\'application de l\'autre téléphone:', error);
      }
    };

    sendLocation(); // Send location immediately

    // Send location every 10 seconds (adjust as needed)
    const intervalId = setInterval(sendLocation, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      {location ? (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Obtention de la localisation...</Text>
      )}
    </View>
  );
};

export default OtherPhoneApp;