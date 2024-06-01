import {
  View,
    Text,
    Image,
    StyleSheet,
    Pressable,
    Keyboard,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
      } from "react-native";
  import React, { useState } from "react";
import RegisterHeader from "../../components/header/registerHeader";
import Education from "./registrationComponents/education";
import { SafeAreaView } from "react-native-safe-area-context";
import Experience from "./registrationComponents/experience";
import Preferences from "./registrationComponents/preferences";
  
  const Register = ({ navigation, route }) => {
    const [page, setPage] = useState(1)
  
    return (
    <SafeAreaView style={{flex: 1}}>
       <RegisterHeader page={page} /> 

          {
            page == 1 && <Education page={page} setPage={setPage}/>
          }
          {
            page == 2 && <Experience page={page} setPage={setPage}/>
          }
          {
            page == 3 && <Preferences page={page} setPage={setPage} />
          }
    
    </SafeAreaView>

    );
  };
  
  export default Register;
  
  const styles = StyleSheet.create({

  });