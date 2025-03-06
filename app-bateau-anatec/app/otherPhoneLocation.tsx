import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestOtherPhoneLocationPermission = async () => {
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      "Permission Request",
      "Do you allow this app to access your GPS coordinates?",
      [
        {
          text: "No",
          onPress: () => resolve(false),
          style: "cancel"
        },
        { text: "Yes", onPress: () => resolve(true) }
      ],
      { cancelable: false }
    );
  });
};

export const getOtherPhoneLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export default {
  requestOtherPhoneLocationPermission,
  getOtherPhoneLocation,
};
