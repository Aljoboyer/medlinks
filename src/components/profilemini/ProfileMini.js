import { View, Image, TouchableOpacity } from "react-native";
import React, { useState, useContext, useRef } from 'react';
import { DataContext } from "../../Context/GlobalState";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { Avatar } from "@rneui/themed";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const ProfileMini = ({edit = false, ImageModalHandler, isPressable}) => {
  const navigation = useNavigation()
  const [state, dispatch] = useContext(DataContext);
  const profile = useSelector((state) => state.profilestore.profileData);
  const base64Image = useSelector((state) => state.profilestore.profleImg);

  return (
    <TouchableOpacity
      style={{
        marginBottom:5
      }}
      onPress={() => {
        if(edit){
          ImageModalHandler()
        }else if(isPressable){
          return
        }
        else{
          navigation.navigate('Profile')
        }
      }}
    >
      <View>
        {base64Image !== 'data:image/png;base64,' ? (
          <Image
            source={{
              uri: `${base64Image?base64Image:null}`,
            }}
            style={{
              height: hp('8.5%'),
              width: hp('8.5%'),
              borderRadius: hp('8.5%'),
            }}
          />

        ) : (
          <Avatar
            rounded
            size={hp('8.5%')}
            title={profile?.name?.split(" ")[0]?.charAt(0)?.toUpperCase().concat(profile?.name?.split(" ")?.length > 1 ? profile?.name?.split(" ")[1]?.charAt(0)?.toUpperCase() : "")}
            containerStyle={{ backgroundColor: "rgb(242, 153, 74)", fontSize: 10, color: "white" }}
           
          />
         )} 
      </View>

    </TouchableOpacity>
  );
};

export default ProfileMini;