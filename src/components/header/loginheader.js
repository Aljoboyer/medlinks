import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
export default function LoginHeader({backarrow,onRightclick, title , arrow = true, colorname, page = -1, setpage, OTPDetected, lefticon = false, }) {
    const navigation = useNavigation();
    // console.log("Otpdetected",OTPDetected)
    const goingback = () => {

        if (page == 1) {
            setpage(0);
        }
        else if (page == 2) {
            if (OTPDetected == false) {
                setpage(1);
            }
            else {
                setpage(0)
            }
        }
        else if (page == 3) {
            setpage(1)
        }
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
            <TouchableOpacity onPress={() => { if (page != -1) { goingback() } else { navigation.goBack(); } }} style={{ flex: 1,  }}>{arrow === true && <Ionicons name={backarrow} size={30} color="#6F7482"></Ionicons>}</TouchableOpacity>
            <View style={{ flex: title === "Login As Jobseeker" ? 3 : 2, }}>
                {title && <Text style={[{ fontFamily: 'Poppins-Bold', fontSize: 17, marginLeft: 10, lineHeight: 26, color: colorname, textAlign: 'center' }]}>{title}</Text>}
            </View>
            <View style={{ flex: 1,alignItems:'flex-end' }}>{lefticon === true && <TouchableOpacity onPress={onRightclick} ><Ionicons name="share-social-outline" size={25} color="#6F7482"></Ionicons></TouchableOpacity>}</View>
        </View>
    )
}

