import * as Location from 'expo-location';

export const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
};

export const getCurrentLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
  // Vérifiez si un log est ici
  console.log('Position actuelle:', location.coords.latitude, location.coords.longitude);
  return location;
};

export default { requestLocationPermission, getCurrentLocation };