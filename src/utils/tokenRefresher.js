import { refreshTokenHandler } from "./refreshToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const tokenRefresher = async () => {
  const newToken = await refreshTokenHandler();
  console.log('From token refresher >>>>>', newToken)
  const { accessToken, idToken, refreshToken } = newToken;
  const userToken = {
    access_token: accessToken,
    id_token: idToken,
    refresh_token: refreshToken,
  };
  const jsonValue = JSON?.stringify(userToken);
  if (jsonValue != null || jsonValue != undefined) {
    const value = await AsyncStorage.setItem("userToken", jsonValue);
  }
  return userToken;
};
