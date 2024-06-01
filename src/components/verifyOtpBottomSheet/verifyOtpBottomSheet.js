import { View, Text, StyleSheet, Pressable, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useContext } from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useSelector } from 'react-redux';


export default function VerifyOtpBottomSheet({ modalShow, OnCLoseHandler , title, confirmHandler, setOtpErr, setOtp, otp, newData, otpErr, loading, HanldeResendOtp, seconds}) {
    let otpRegex = /^[0-9]*$/;
    const profile = useSelector((state) => state.profilestore.profileData);

    return (

        <BottomSheet onBackdropPress={() => OnCLoseHandler()} modalProps={{}} isVisible={modalShow}>
            <View style={styles.BottomSheetView}>
                <View style={styles.emptyView}></View>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Pressable onPress={() => OnCLoseHandler()}>
                        <Entypo color="#6F7482" name="cross" size={24} />
                    </Pressable>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{marginVertical: 20}}>
                        <Text style={{fontSize: 12, fontFamily: 'Poppins-Bold', color: '#6F7482', textAlign: 'center'}}>A 6 digit OTP has been sent to</Text>
                        <Text style={[styles.fourteenRegular, {textDecorationLine:'underline', marginTop: 10}]}>{newData ? newData : profile?.emailVerified ? `+91-${profile?.phone}` : profile?.email}</Text>
                    </View>

                    <OTPInputView
                        style={{ width: '100%', height: 100, }}
                        pinCount={6}
                        code={otp}
                        onCodeChanged={code => {
                        if (otpRegex.test(code) === true && code) {

                            setOtpErr('');
                        }
                        else {
                            setOtpErr('Please Enter numbers only.')
                        }
                        setOtp(code);
                        }
                        }
                        keyboardType="number-pad"
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code => {
                        console.log(`Code is ${code}, you are good to go!`)
                        })}
                    />
                <Text style={[styles.fourteenRegular, {textDecorationLine:'underline', marginVertical: 10}]}>{otpErr}</Text>
                
                {
                    seconds > 0 ? <Text style={{ color: '#395987', fontWeight: '400', fontSize: 14 , textAlign: 'center' }}>{seconds} Seconds Left</Text> : <Pressable onPress={() => HanldeResendOtp()} style={styles.resendBtn}>
                    <Text style={styles.fourteenRegular}>Didn’t receive OTP?   </Text>
                    <Text style={[styles.fourteenRegular, {fontFamily: 'Poppins-SemiBold'}]}>Resend</Text>
                </Pressable>
                }
                
                  
                </View>
                <Pressable onPress={() => {
                   if(!loading){
                    confirmHandler()
                   }
                }} style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>{loading ? 'Loading...' : 'Submit'}</Text>
                </Pressable>
            </View>
            
        </BottomSheet>

    )
}

const styles = StyleSheet.create({

    BottomSheetView: {
        backgroundColor: 'white',
        height: hp('70%'),
        paddingVertical: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    bottomSheetHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        height: 45,
        paddingHorizontal: 20
    },
    headerTitle: {
        color: '#395987',
        fontSize: 16,
        // fontWeight: '700',
        fontFamily: 'Poppins-SemiBold',
    },
    emptyView: {
        height: 4,
        width: 50,
        backgroundColor: '#D9D9D9',
        alignSelf: 'center'
    },
    addText: {
        color: '#395987',
        fontSize: 14,
        // fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    dropDownItem: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        paddingVertical: 15
    },
    radioContent: {
        display: 'flex',
        // flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,

    },
    outerCircle: {
        height: 20,
        width: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E4EEF5',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 7.5,
        borderWidth: 1,
        borderColor: 'white',
    },
    selectedOuterCircle: {
        borderColor: '#E4EEF5',
        borderColor: "#395987",
    },
    selectedInnerCircle: {
        backgroundColor: "#395987",
        borderColor: "#395987",
    },
    logoutBtn:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    submitBtnText: {
        color: 'white',
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Regular',
    },
    submitBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#395987',
        height: 45,
        width: 320,
        alignSelf: 'center',
        borderRadius: 10,
        position: 'absolute',
        bottom: 20
    },
    underlineStyleBase: {
        height: hp('6.5%'), width: wp('12.4%'), borderWidth: 1, borderRadius: hp('1.5%'), borderColor: '#B8BCCA50', alignItems: 'center', justifyContent: 'center', color: 'black', marginRight: 10
      },
      fourteenRegular:{fontSize: 14, fontFamily: 'Poppins-Regular', color: '#395987', textAlign: 'center'},
      resendBtn: {display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}
});