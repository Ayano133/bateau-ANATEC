// location.tsx
import React from 'react';
import * as Location from 'expo-location';
import { View, Text } from 'react-native';

export const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
};

export const getCurrentLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
  return location;
};

const LocationScreen = () => {
  return (
    <View>
      <Text>Location Screen</Text>
      {/* Ajoutez ici du code pour afficher ou utiliser la localisation */}
    </View>
  );
};

export default LocationScreen;