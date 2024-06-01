import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { setSelectedEducation, setSelectedExperience } from '../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { useDispatch } from 'react-redux';
import { setSelectedJobAlert } from '../../Redux_Mine/Redux_Slices/GlobalSettingSlice';

export default function ProfileTabScreenHeader({title, deleteConfirmHandler, deleteBtn = false}) {
    const navigation = useNavigation();
    const dispatchAction = useDispatch()
  return (
    <View style={{display: 'flex' ,flexDirection: 'row', alignItems: 'center', height: 70, paddingHorizontal: 10}}>
    <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => {
            dispatchAction(setSelectedExperience({}))
            dispatchAction(setSelectedEducation({}))
            dispatchAction(setSelectedJobAlert({}))
            navigation.goBack()
        }}>
            <Ionicons name="chevron-back" color="black" size={28} />
        </TouchableOpacity>
    </View>
    <View style={{ flex: 3, paddingLeft: 20 }}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, lineHeight: 27, color: 'black', }}> {title}</Text>
    </View>
    {deleteBtn ?
        <TouchableOpacity onPress={() => deleteConfirmHandler()} style={{ height: hp('4%'), width: wp('8%'), borderRadius: 5, backgroundColor: '#EB575720', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name='trash-outline' size={20} color="#EB5757"></Ionicons>
    </TouchableOpacity> : <></>}
</View>
  )
}