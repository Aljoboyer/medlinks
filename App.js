import React, { createContext, useContext, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { AuthStack } from './src/navigations/authStack';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { DataContext, DataProvider } from "./src/Context/GlobalState";
import { store, persistor } from "./src/Redux_Mine/Store/store";
import { Amplify, Notifications } from "aws-amplify";
import aws_config_doctor from "./aws-config.doctor";
import FlashMessage from "react-native-flash-message";
Amplify.configure(aws_config_doctor)

export const AuthContext = createContext();

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <DataProvider>
            <StatusBar translucent={false} barStyle={'light-content'} backgroundColor="#395987" />
            <AuthStack />
            <FlashMessage position="top" />
          </DataProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({

});

export default App;
