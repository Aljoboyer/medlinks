import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextBoxes from '../components/textBoxes/textBoxes';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDeviceToken, setLoginScreenLoader, setSearchParams, userLoggedHandler } from "../Redux_Mine/Redux_Slices/GlobalSettingSlice";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { Amplify, Auth, Hub } from 'aws-amplify'
import { gqlOpenQuery, gqlquery } from '../api/doctorFlow';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileTabScreenHeader from '../components/header/profileTabScreenHeader';
import BottomCoupleButton from '../components/BottomCoupleButton/BottomCoupleButton';
import VerifyOtpBottomSheet from '../components/verifyOtpBottomSheet/verifyOtpBottomSheet';
import ErrorText from '../components/ErrorText/ErrorText';
import { useNavigation } from '@react-navigation/native';
import { getProfileData } from '../Redux_Mine/Redux_Slices/ProfileSlice';
import DeleteAccountBottomSheet from '../components/deleteaccountBottomsheet/deleteaccountBottomsheet';

export default function AccountSettings() {
    let passwordRegex = /^(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    let numRgex = /^\d+$/;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regexp = /^\S*$/;

    const navigation = useNavigation()
    const [logoutLoader, setLogoutLoader] = useState(false);
    // const [phone, setPhone] = useState('')
    // const [email, setEmail] = useState('')
    const dispatchAction = useDispatch();
    const [emailErr, setEmailErr] = useState('')
    const [phoneErr, setPhoneErr] = useState('')
    const [newEmail, setnewEmail] = useState('')
    const [newPhone, setnewPhone] = useState('')
    const [oldPassword, setoldPassword] = useState('')
    const [newPassword, setnewPassword] = useState('')
    const [confirmNewPassword, setconfirmNewPassword] = useState('')
    const [error, setError] = useState('')
    const [oldPassErr, setOldPassErr] = useState('')
    const [flag,setflag] = useState(false)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [verifyOtpModal, setVerifyOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpErr, setOtpErr] = useState('')
    const [loading, setLoading] = useState(false)
    const [seconds,setSeconds] = useState(false)
    const [deleteModal,setDeleteModal] = useState(false)
    //Edit State
    const [emailEdit, setEmailEdit] = useState(false);
    const [phoneEdit, setPhoneEdit] = useState(false);
    const [verifyOption, setVerifyOption] = useState(false);

    const profile = useSelector((state) => state.profilestore.profileData);

    //-------------Email validation check---------------//
    const EmailHandler = (text) => {
        if (emailRegex.test(text) === false) {
            setEmailErr('Enter valid email')
        }
        else {
            setEmailErr('')
        }
    }

//----------------Verification Funcationality------------//
    const sendingOtpForVerifyingProfileEmail = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const res = await Auth.updateUserAttributes(user, {
          'email': profile?.email,
        });
        setVerifyOtpModal(true)
    }
    const handleVerificaitonPhone = async () => {
        // const {attributes} = await Auth.currentUserInfo()
        const user = await Auth.currentAuthenticatedUser();
        const res = await Auth.updateUserAttributes(user, {
          'phone_number': `+91${profile?.phone}`,
        });
        // console.log('handleVerificaitonPhone If condition>>>', res)
        setVerifyOtpModal(true)
    
      };

//-------------New Email Verification---------------//
    const handleVerifyNewEmail = async () => {
        if (emailRegex.test(newEmail.trim()) === false) {
            setEmailErr('Enter valid email')
            return
        }
        else if (!newEmail) {
            setEmailErr('Enter email')
            return
        }
        else {
            setLoading(true)
            const res = await checkEmailExists(newEmail);
            if (res) {
                setLoading(false)
                showMessage({
                    message: "Email already exists",
                    type: "danger",
                });
                // setChangeJobseekerEmail("Email already exists");
            } else {
                verifyNewEmail();
            }
        }
    };

    const checkEmailExists = () => {

        return new Promise((resolve) => {
            const CHECK_EMAIL_EXISTS = {
                query: `query MyQuery{
            checkEmailExists(email:"${newEmail}")
          }`,
            };
            gqlOpenQuery(CHECK_EMAIL_EXISTS, null)
                .then((res) => res.json())
                .then(({ data }) => {

                    const response = JSON.parse(data["checkEmailExists"]);

                    console.log('email exists response >>>', response);

                    const exists = response.length > 0 ? true : false;
                    console.log(exists);
                    resolve(exists);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    };

    const verifyNewEmail = async () => {
        // if (timerEmail === "00") {
        await Auth.currentUserInfo();
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
            email: `${newEmail}`,
        });
        //   setTimerEmail(30);
        //   startTimerCountEmail();
        showMessage({
            message: "An otp has been sent to your Email.",
            type: "success",
        });
        //   setOpenSnacks(true);
        // }
        setTimeout(() => {
            setLoading(false)
            setVerifyOtpModal(true);
        }, 1500)
    };

//--------------New Phone Verification---------------//
    const handleVerifyNewPhone = async () => {

        if (!newPhone || newPhone?.length !== 10 || numRgex.test(newPhone) === false) {
            setPhoneErr('Please enter valid phone number')
            return
        }
        else if (newPhone?.split('')[0] == '+') {
            setPhoneErr('Please enter valid phone number')
            return
        }
        else if (newPhone.charAt(0) < 6) {
            setPhoneErr('First digit of phone number should be 6-9.')
            return
        }
        else {
            setLoading(true)
            const res = await checkPhoneExists(newPhone);
            if (res) {
                setLoading(false)
                showMessage({
                    message: "Phone already exists",
                    type: "danger",
                });
            } else {
                verifyPhone();
            }
        }

    };

    const checkPhoneExists = (phoneNum) => {
        return new Promise((resolve) => {
            const CHECK_PHONE_EXISTS = {
                query: `query MyQuery{
        checkPhoneExists(phone:"${phoneNum}")
    }`,
            };
            gqlOpenQuery(CHECK_PHONE_EXISTS, null)
                .then((res) => res.json())
                .then(({ data }) => {
                    const response = JSON.parse(data["checkPhoneExists"]);
                    const exists = response.length > 0 ? true : false;
                    resolve(exists);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    };

    const verifyPhone = async () => {
        // if (timerPhone === "00") {
        await Auth.currentUserInfo();
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
            phone_number: `+91${newPhone}`,
        });
        showMessage({
            message: "An otp has been sent to your Number.",
            type: "success",
            duration: 2000,
            // autoHide:false
        });
        setTimeout(() => {
            setLoading(false)
            setVerifyOtpModal(true);
        }, 1500)

    };

    const updateDb = async ({ email, phone, emailVerified, phoneVerified }) => {

        if (phoneVerified) {
            const QUERY_UPDATE_DB = {
                query: `mutation MyMutation {
              updateDb(
                phone:"${phone ? phone : profile?.phone}",
                phoneVerified:${phoneVerified}
                )
                  }`,
                variables: null,
                operationName: "MyMutation",
            };
            gqlquery(QUERY_UPDATE_DB, null)
                .then((res) => res.json())
                .then((datas) => {
                    setLoading(false)
                    dispatchAction(getProfileData())
                });
        } else {
            const QUERY_UPDATE_DB = {
                query: `mutation MyMutation {
              updateDb(
                email:"${email ? email : profile?.email}",
                emailVerified:${emailVerified}
                )
                  }`,
                variables: null,
                operationName: "MyMutation",
            };
            console.log("Query", QUERY_UPDATE_DB)
            gqlquery(QUERY_UPDATE_DB, null)
                .then((res) => res.json())
                .then((datas) => {
                    console.log("Email Added db", datas);
                    dispatchAction(getProfileData())
                });
        }
    }

    const handleVerifyOTP = async (para) => {
        // console.log("vaues>>>>>>>>", otpCode)
        if (otp) {
            setLoading(true)
            await Auth.currentUserInfo()
            if (para == "phone") {
                if (otp.length == 6) {
                    try {
                        const verify = await Auth.verifyCurrentUserAttributeSubmit('phone_number', otp)
                        console.log("verify >>", verify)
                        showMessage({
                            message: "Verified Successfully",
                            type: "success",
                        });

                        updateDb({ phone: newPhone, phoneVerified: true })
                        console.log(" i m here phone")
                        OnCLoseHandler()
                    } catch (err) {
                        console.log('Phone otp err >>', err)
                        setOtpErr('Please enter valid OTP')
                        setLoading(false)
                        OnCLoseHandler()
                    }

                }
                else {
                    showMessage({
                        message: "Please Enter valid OTP",
                        type: "danger",
                    });
                    setLoading(false)
                }
            }
            else if (para == "email") {
                if (otp.length == 6) {
                    console.log("OTP", otp)
                    try {

                        const verify = await Auth.verifyCurrentUserAttributeSubmit('email', otp)
                        console.log('verify data', verify)
                        showMessage({
                            message: "Verified Successfully",
                            type: "success",
                        })
                        updateDb({ emailVerified: true, email: newEmail })
                        OnCLoseHandler()
                    } catch (err) {
                        setOtpErr('Please enter valid OTP')
                        setLoading(false)
                    }
                }
                else {
                    showMessage({
                        message: "Please Enter valid OTP",
                        type: "danger",
                    });
                    setLoading(false)
                    OnCLoseHandler()
                }
            }
        } else {
            console.log('asche')
            setOtpErr('Please enter OTP')
            setLoading(false)
        }
    };

    const OtpConfirmHandler = () => {
        if(emailEdit){
            handleVerifyOTP("email");
        }
        else if(phoneEdit){
            handleVerifyOTP("phone");
        }
        else if (verifyOption){
            if(!profile?.emailVerified){
                handleVerifyOTP("email");
            }
            else if(!profile?.phone){
                handleVerifyOTP("phone");
            }
        }
    }

    const OnCLoseHandler = () => {
        setVerifyOtpModal(false)
        setEmailEdit(false)
        setPhoneEdit(false)
        setVerifyOption(false)
        setflag(false)
    }

//-----------------Password change functionality---------------//

    const handleResetPassword = async () => {
        let isValid = true;

        if (
            oldPassword == ""
        ) {
            setOldPassErr("Old password is mandatory!");
            // return;
            isValid = false;
        }
        if (
            newPassword == ""
        ) {

            setErrorPassword("New password is mandatory!");
            isValid = false;
            // return;
        }
        if (
            confirmNewPassword == ""
        ) {

            setErrorConfirmPassword("Confirm new password is mandatory!");
            // return;
            isValid = false;
        }
        if (isValid == false) {
            return;
        }
        // if (values.oldPassword === "" || values.newPassword === "" || values.confirmNewPassword === "") {
        //   setError("Inputs can't be empty!")
        //   return setOpen(true);;
        // } else {
        //   setError("");
        // }

        let finalpassword;
        if (newPassword === confirmNewPassword) {
            finalpassword = newPassword;
            setError("");
        } else {
            setError("Password didn't match.")
            return;
        }

        if (finalpassword === oldPassword) {
            setError("New password can't be the same as the old password.");
            return;
        } else {
            setError("");
        }

        try {
            setLoading(true)
            const user = await Auth.currentAuthenticatedUser();
            const res = await Auth.changePassword(user, oldPassword, finalpassword);
            if (res === "SUCCESS") {
                // setSuccess(true);
                // setOpen(true);
                // sendPasswordResetEmail("Password_Reset");
                // setValues({
                //     oldEmail: "",
                //     newEmail: "",
                //     oldPhone: "",
                //     newPhone: "",
                //     oldPassword: "",
                //     newPassword: "",
                //     confirmNewPassword: "",
                // });
                console.log("passworc chec", res)
                showMessage({
                    message: "Password changes successfully",
                    type: 'success'
                })
                // oldPassword = "";
                // newPassword = "";
                // confirmNewPassword = "";
                setError("");
                setLoading(false)
                handleLogout();
                // setPasswordEdit(false);
            }
        }
        catch (err) {
            setLoading(false)
            console.log('Password set error >>>> ' , err)
            if (err.message.includes("Incorrect username or password.")) {
                setErrorConfirmPassword("Your Old Password is incorrect");
            }
            else if (err.message.includes(`Password did not conform with policy: Password must have numeric characters`)) {
                setError("Password did not conform with policy: Password must have numeric characters, special characters");
            }
            else if (err.message.includes("Password did not conform with policy: Password must have symbol characters")) {
                setError("Password did not conform with policy: Password must have symbol characters");
            }
            else if (err.message.includes("Attempt limit exceeded, please try after some time")) {
                setError("Attempt limit exceeded, please try after some time");
            }
            else if (err.message.includes("Password did not conform with policy: Password must have uppercase characters")) {
                setError("Password did not conform with policy: Password must have uppercase characters");
            }
            else {
                // setError(err.message);
                setErrorConfirmPassword("Your Old Password is incorrect");
            }
            // setOpen(true);
            return;
        }
        setError("");
        setErrorPassword("");
        setErrorConfirmPassword("");
    }

    //-------------Resend OTP--------/
    const HanldeResendOtp = async () => {
        const { attributes } = await Auth.currentUserInfo()
        if(emailEdit){
            const user = await Auth.currentAuthenticatedUser();
            const res = await Auth.updateUserAttributes(user, {
                'email': newEmail,
            });
             showMessage({
                message: "OTP sent successfully to your email",
                type: 'success',
                duration: 7000,
            })
            console.log('email res', res)
            setSeconds(30);
        }
        else if (phoneEdit) {
            const user = await Auth.currentAuthenticatedUser();
            const res = await Auth.updateUserAttributes(user, {
                'phone_number': `+91${newPhone}`,
            });
             showMessage({
                message: "OTP sent successfully to your phone number",
                type: 'success',
                duration: 7000,
            })
            console.log('Phone res 2', res)
            setSeconds(30);
        }
        else if (!attributes?.phone_number_verified){
            const user = await Auth.currentAuthenticatedUser();
            const res = await Auth.updateUserAttributes(user, {
                'phone_number': `+91${profile?.phone}`,
            });
             showMessage({
                message: "OTP sent successfully to your phone number",
                type: 'success',
                duration: 7000,
            })
            console.log('Phone res 1', res)
            setSeconds(30);
        }
       
        else{
            const user = await Auth.currentAuthenticatedUser();
                const res = await Auth.updateUserAttributes(user, {
                    'email': profile?.email,
                });
                 showMessage({
                    message: "OTP sent successfully to your email",
                    type: 'success',
                    duration: 7000,
                })
                console.log('email res', res)
                setSeconds(30);
        }
    };
    
    const handleLogout = async () => {
        setLogoutLoader(true)
        const QUERY_REMOVE_TOKEN = {
            query: `mutation MyMutation {
                    removeJobSeekerDeviceToken(deviceToken: "")
                  }`,
            operationName: "MyMutation",
        };
        await gqlquery(QUERY_REMOVE_TOKEN, null)
            .then((res) => res.json())
            .then(async (data) => {
                console.log('removeJobSeekerDeviceToken Data >>>>>>>', data)
                // await Auth.signOut()
                setLogoutLoader(false)
                await AsyncStorage.clear();
              
                dispatchAction(setSearchParams({
                    searchValue: '',
                    searchloca: '',
                }))
                dispatchAction(setDeviceToken(''))
                dispatchAction(setLoginScreenLoader(false))
                dispatchAction(userLoggedHandler(false));
                // googleappreview();
                setflag(false)
                // navigation.navigate('Login')

            })
        // navigation.navigate("Login");
        // } catch (err) { }
    };

    useEffect(() => {
        let timer = seconds > 0 && setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000)
        return () => {
          clearInterval(timer);
        };
      }, [seconds]);

  return (
<SafeAreaView style={{flex: 1}}>
    <ProfileTabScreenHeader title={'Account Settings'} deleteBtn={false} />
    <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
            <Text style={styles.labelText}>Primary Email</Text>
      
            {
                emailEdit ? <TextBoxes title='' placeHolder="Enter full name" extra={false} error={emailErr} onChangeText={(text) => {
                    setnewEmail(text.trim())
                    EmailHandler(text)
                }}
                    // value={newEmail.trim()}
                    defaultValue={profile?.email}
                /> :
                <View style={styles.inputBoxView}>
                    <View style={styles.verifyBtn}>
                        <Text style={styles.rgularFourteen}>{profile?.email}</Text>
                        {
                            !profile?.emailVerified && <Pressable onPress={() => {
                                sendingOtpForVerifyingProfileEmail()
                                setVerifyOption(true)
                            }} style={[styles.verifyBtn, {marginLeft: 10}]}>
                            <Text style={[styles.rgularFourteen,{color: '#F2B45A'}]}>Verify</Text>
                        </Pressable>
                        }
                    
                    </View>
                    <Pressable onPress={() => {
                        setEmailEdit(true)
                        setPhoneEdit(false)
                        setflag(false)
                    }} style={styles.verifyBtn}>
                        <Text style={[styles.rgularFourteen,{color: '#395987', fontFamily: 'Poppins-SemiBold',}]}>Edit</Text>
                    </Pressable>
                </View>
            }

        <Text style={[styles.labelText, {marginTop: 20}]}>Contact Number</Text>

            {
                phoneEdit ? <TextBoxes title='Contact Number' placeHolder="Please enter phone number" extra={false} 
                error={phoneErr} 
                keyboardType='number-pad'
                maxLength={10}
                defaultValue={profile?.phone}
                onChangeText={(text) => {
                    setnewPhone(text.trim())
                   setPhoneErr('')
                }}
            /> :            
             <View style={styles.inputBoxView}>
                <View style={styles.verifyBtn}>
                    <Text style={styles.rgularFourteen}>{profile?.phone}</Text>

                    {
                        !profile?.phoneVerified && <Pressable onPress={() => handleVerificaitonPhone()} style={[styles.verifyBtn, {marginLeft: 10}]}>
                        <Text style={[styles.rgularFourteen,{color: '#F2B45A'}]}>Verify</Text>
                    </Pressable>
                    }
                    
                </View>
                <Pressable onPress={() => {
                    setPhoneEdit(true)
                    setEmailEdit(false)
                    setflag(false)
                }} style={styles.verifyBtn}>
                    <Text style={[styles.rgularFourteen,{color: '#395987', fontFamily: 'Poppins-SemiBold',}]}>Edit</Text>
                </Pressable>
            </View>
            }

{/* ---------------Password Change View------------------ */}
            <View style={styles.passChangeView}></View>
            {flag == false ?
                <TouchableOpacity style={{marginTop:20}} onPress={() => {
                     setflag(true) 
                     setPhoneEdit(false)
                     setEmailEdit(false)
                    }}><Text style={{ color: "#395987", fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Regular', textDecorationLine: 'underline', textDecorationColor: '#395987' }}>Change Password</Text></TouchableOpacity>
                : <>
                    <TextBoxes title='Enter Old Password' extra={true} error={errorConfirmPassword}
                        value={oldPassword}
                        onChangeText={(text) => {
                            if (regexp.test(text) == true) {
                                setoldPassword(text)
                                if (text) {
                                    setErrorConfirmPassword('')
                                }
                            }
                            else {
                                setErrorConfirmPassword('Password should not include whitespaces')
                            }
                        }}
                        // numberOfLines={10}
                        // multiline={true}
                        // autoGrow={false}
                        iconname={'eye'}
                        autoCapitalize='none'
                        placeHolder="Enter Old Password"
                    // secureTextEntry={!hideOldPassword}
                    />
                    <TextBoxes title='Enter Password' extra={true} error={errorPassword} onChangeText={(text) => {
                        if (regexp.test(text) == true) {
                            setnewPassword(text)
                            if (text) {
                                setErrorPassword('')
                            }
                        }
                        else {
                            setErrorPassword('Password should not include whitespaces')
                        }
                    }}

                        placeHolder="Enter Password"
                        value={newPassword}
                        iconname={'eye'}
                        autoCapitalize='none'
                    />
                    <TextBoxes title='Enter Password Again' extra={true} error={error} onChangeText={(text) => {
                        if (regexp.test(text) == true) {
                            setconfirmNewPassword(text)
                            if (text) {
                                setErrorConfirmPassword('')
                            }
                        }
                        else {
                            setErrorConfirmPassword('Password should not include whitespaces')
                        }
                    }}
                        placeHolder="Enter Password Again"
                        value={confirmNewPassword.trim()}
                        iconname={'eye'}
                        autoCapitalize='none'
                    /></>}
                <Pressable onPress={() => handleLogout()} style={styles.logoutBtn}>
                <Text><MaterialIcons name='logout' size={16} color={'#395987'} /></Text>
                <Text style={{color: '#395987', fontFamily: "Poppins-Regular", fontSize: 14, marginLeft: 4}}>Logout</Text>
            </Pressable>

            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('4%') }}>
                <TouchableOpacity style={{ flexDirection: 'row' }}
                    onPress={() => { setDeleteModal(true) }}
                >
                    <Ionicons name="trash" color={'#EB5757'} size={16} />
                    <Text style={{ color: "#EB5757", fontSize: 14, lineHeight: 21, fontFamily: 'Poppins-Medium', marginLeft: 5, textDecorationLine: 'underline', textDecorationColor: '#EB5757' }}>Request delete account</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
    
    {
        (emailEdit || flag || phoneEdit ) && <BottomCoupleButton nextHandler={() => {
            if(!loading){
                if(emailEdit){
                    handleVerifyNewEmail()
                }
                else if (phoneEdit){
                    handleVerifyNewPhone()
                }
                else{
                    handleResetPassword()
                }
            }
        }} backHandler={() => {
            setEmailEdit(false)
            setPhoneEdit(false)
            setflag(false)
        }} title1='Cancel' title2='Save' isLoad={loading}
        />
    }
    
    <VerifyOtpBottomSheet 
    title={profile?.emailVerified || !emailEdit ? 'Verify Phone Number' : 'Verify Email'}
     modalShow={verifyOtpModal} 
     OnCLoseHandler={OnCLoseHandler} 
     otp={otp}
     setOtp={setOtp}
     newData={newEmail ? newEmail : newPhone}
     otpErr={otpErr}
     setOtpErr={setOtpErr}
     confirmHandler={OtpConfirmHandler}
     loading={loading}
     HanldeResendOtp={HanldeResendOtp}
     seconds={seconds}
    />

    <DeleteAccountBottomSheet setModalShow={setDeleteModal} modalShow={deleteModal} />
</SafeAreaView>
  )
}

const styles = StyleSheet.create({
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Medium',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    searchInputView: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        height: 45,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10
    },
    searchInput: {
        paddingLeft: 10,
        width: '80%',
        color: 'black',
        fontFamily: 'Poppins-Regular'
    },
    BottomSheetView: {
        backgroundColor: 'white',
        height: hp('80%'),
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
    rgularFourteen:{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        lineHeight: 21,
        color: 'black'
    },
    verifyBtn:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBoxView:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        marginTop: 10
    },
    passChangeView:{ marginTop: hp('3%'), height: hp('0.2%'), backgroundColor: '#E4EEF5' }
});