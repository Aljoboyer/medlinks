import React from "react";
import {
  useWindowDimensions,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import LottieView from 'lottie-react-native';
const OnBoardLoader = ({ visible = false }) => {
  const { width, height } = useWindowDimensions();
  return (
    visible && (
      <View style={[style.container, {width}]}>
  
        <LottieView source={require('../LottieLoader/Onloading.json')} autoPlay loop />
      </View>
    )
  );
};

export default OnBoardLoader;
const style = StyleSheet.create({
    container: {
      position: 'absolute',
      zIndex: 10,
    //   backgroundColor: 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      height: '100%',
    },
  });
  