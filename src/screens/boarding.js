import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable,
    Image,
} from 'react-native'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {setAuthCommonScreenLoader, } from '../Redux_Mine/Redux_Slices/GlobalSettingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Boarding = () => {
    const [selected, setSelected] = useState(0)
    const navigation = useNavigation()
    const dispatchAction = useDispatch()
    const isFocused = useIsFocused();

    const onSwipe = (gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        console.log('from boarding onSwipe fun',selected)
        switch (gestureName) {
            case SWIPE_LEFT:
                if (selected == 2) {
                    setSelected(2)
                }
                else {
                    setSelected(selected + 1)
                }
                break;
            case SWIPE_RIGHT:
                if (selected == 0) {
                    setSelected(0)
                }
                else {
                    setSelected(selected - 1)
                }
                break;
        }
    }

    useEffect(() => {
        const timer1 = setTimeout(() => setSelected((i) => ((i + 1) % 3)), 3000);
        return () => {
            clearTimeout(timer1);
        }
    }, [selected]);

    const clearingPreviousData = async () => {
        await AsyncStorage.clear();
        dispatchAction(setAuthCommonScreenLoader(true))
    }

    useEffect(() => {
        clearingPreviousData()
    },[isFocused])
    return (

        <GestureRecognizer
            onSwipe={(direction, state) => onSwipe(direction, state)} style={{ flex: 1, backgroundColor: '#395987', }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'center' }}>
                {selected == 0 ? <Image
                    source={require("../assets/pana1.png")}
                    style={{
                        // height: 40,
                        // width: 40,
                        // borderRadius: 10,
                        // borderWidth: 1,
                        // borderColor: "#D9D9D9",
                        // resizeMode: "cover",
                    }}
                /> :
                    selected == 1 ?
                        <Image
                            source={require("../assets/pana2.png")}
                            style={{
                                // height: 40,
                                // width: 40,
                                // borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: "#D9D9D9",
                                // resizeMode: "cover",
                            }}
                        /> :
                        <Image
                            source={require("../assets/pana3.png")}
                            style={{
                                // height: 40,
                                // width: 40,
                                // borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: "#D9D9D9",
                                // resizeMode: "cover",
                            }}
                        />}
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>

                {selected == 0 ? <Text style={{ color: 'white', fontSize: 20, lineHeight: 22, fontFamily: 'Open-Sans', fontWeight: "700" }}>Build Profile</Text> :
                    selected == 1 ?
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "700", lineHeight: 22, fontFamily: 'Open-Sans' }}>Search and Apply for Jobs</Text>
                        :
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "700", lineHeight: 22, fontFamily: 'Open-Sans' }}>Get Job Alerts</Text>}

                {selected == 0 ? <Text style={{ marginTop: 12, color: 'white', fontSize: 14, fontWeight: "600", lineHeight: 22, fontFamily: 'Open-Sans', marginHorizontal: wp('13%'), textAlign: 'center' }}>No resume? No worry. Build a free jobseeker profile</Text>
                    : selected == 1 ?
                        <><Text style={{ marginTop: 12, color: 'white', fontSize: 14, fontWeight: "600", lineHeight: 22, fontFamily: 'Open-Sans', marginHorizontal: wp('8%'), textAlign: 'center' }}>With zero cost you can search and apply for healthcare jobs</Text></> : <>
                            <Text style={{ marginTop: 12, color: 'white', fontSize: 14, fontWeight: "600", lineHeight: 22, fontFamily: 'Open-Sans', marginHorizontal: wp('8%'), textAlign: 'center' }}>Create customized job alerts and receive new job alerts directly in your inbox</Text></>

                }
                <View style={{ alignItems: 'center', marginTop: 18, justifyContent: 'center', flexDirection: 'row' }}>
                    <Ionicons name={selected == 0 ? 'ellipse' : 'ellipse-outline'} size={selected == 0 ? 12 : 10} color="white" />
                    <Ionicons name={selected == 1 ? 'ellipse' : 'ellipse-outline'} size={selected == 1 ? 12 : 10} color="white" style={{ paddingHorizontal: 4 }} />
                    <Ionicons name={selected == 2 ? 'ellipse' : 'ellipse-outline'} size={selected == 2 ? 12 : 10} color="white" />

                </View>
            </View>
            <View style={{ height: hp('22%'), width: wp('100%'), alignSelf: 'center', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: hp('5%') }}>
                <Pressable onPress={() => {
                    if (selected == 2) {
                        // setSelected(3)
                    }
                    if (selected == 0) {
                        setSelected(1)
                    }
                    if (selected == 1) {
                        setSelected(2)
                    }


                    navigation.navigate('Login');
                }} style={{ height: hp('5.5%'), width: wp('80%'), marginBottom: 12, borderRadius: 10, backgroundColor: '#395987', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.boardingRegularTxt}>Register/Login</Text>
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('Home')}}>
                    <Text style={[styles.boardingRegularTxt, {textDecorationLine: 'underline', color: '#395987'}]}>Search Jobs</Text>
                </Pressable>

            </View>

        </GestureRecognizer>

    )
}

export default Boarding

const styles = StyleSheet.create({
    boardingRegularTxt:{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Medium' }
})


