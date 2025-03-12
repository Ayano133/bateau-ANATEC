import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestOtherPhoneLocationPermission = async () => {
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      "Permission Request",
      "Autorisation d'accès à la localisation",
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
  let location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export default { requestOtherPhoneLocationPermission, getOtherPhoneLocation };