import React from 'react'
import {
    StyleSheet,
    Text,
    Pressable,
    Image} from 'react-native'
import { Amplify, Auth, Hub } from "aws-amplify";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { QUERY_LISTPROFILES } from '../../graphql';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gqlquery } from '../../api/doctorFlow';
import { useDispatch } from 'react-redux';
import { setLoginScreenLoader, userLoggedHandler } from '../../Redux_Mine/Redux_Slices/GlobalSettingSlice';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";


const GoogleSignInButton = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const dispatch = useDispatch()

    const GoogleSignInHandler = async () => {

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            const { event } = payload;

            console.log('Event Here', event)
            if (event === "cognitoHostedUI") {
                dispatch(setLoginScreenLoader(true))
                Auth.currentSession().then(async (data) => {
                    console.log('auth data googlesignin', data)
                    const accessToken = data.accessToken.jwtToken;
                    const refreshToken = data.refreshToken.token;
                    const idToken = data.idToken.jwtToken;
                    await AsyncStorage.setItem("accessToken", accessToken);
                    await AsyncStorage.setItem("idToken", idToken);
                    await AsyncStorage.setItem("refreshToken", refreshToken);
                    await AsyncStorage.setItem("flow", "jobSeeker");
                    dispatch(userLoggedHandler(true))
                    unsubscribe();
                    gqlquery(QUERY_LISTPROFILES, null, accessToken)
                        .then((res) => res.json())
                        .then((datas) => {

                            console.log('profile data >>', datas)
                            if (datas?.data?.getProfile?.name) navigation.navigate("CreateProfile");
                            else navigation.navigate("CreateProfile");
                        })
                })
            }
        });
    }
    
//Dev Credential
    // Amplify.configure({
    //     Auth: {
    //         userPoolId: 'ap-south-1_QK74tfZrQ',
    //         userPoolWebClientId: '1ua1gsq8b1hui3jva16f72u38k',
    //         region: 'ap-south-1',
    //         oauth: {
    //             domain: `${process.env.REACT_APP_GOOGLE_SIGNIN_DOMAIN}`,
    //             scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
    //             // redirectSignIn:'https://googleauth001.auth.ap-south-1.amazoncognito.com/login?client_id=1ua1gsq8b1hui3jva16f72u38k&response_type=token&scope=openid&aws.cognito.signin.user.admin&redirect_uri=http://localhost:3000/',
    //             redirectSignIn: 'myapp://CreateProfile',
    //             redirectSignOut: 'myapp://Login',
    //             responseType: 'code',
    //             options: {
    //                 Google: {
    //                     clientId: '438689605258-hhqhngbg4blg05k134k0tckqt4nu2tpn.apps.googleusercontent.com',
    //                     responseType: 'code',
    //                     scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
    //                 },
    //             },
    //         },
    //     },
    // });

    
//QA Credential
Amplify.configure({
    Auth: {
        userPoolId: 'ap-south-1_9D2FX5VoM',
        userPoolWebClientId: '1c09j45grpbk0amn4cfvjn5m4s',
        region: 'ap-south-1',
        oauth: {
            domain: 'googleauthqa.auth.ap-south-1.amazoncognito.com',
            scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'myapp://AuthCommonScreen',
            redirectSignOut: 'myapp://Login',
            responseType: 'code',
            options: {
                Google: {
                    clientId: '438689605258-hhqhngbg4blg05k134k0tckqt4nu2tpn.apps.googleusercontent.com',
                    responseType: 'code',
                    scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
                },
            },
        },
    },
});


//Production Credential
// Amplify.configure({
//     Auth: {
//         userPoolId: 'ap-south-1_wvE08H8k4',
//         userPoolWebClientId: '216k3n2dhccdj3aonle7hrko57',
//         region: 'ap-south-1',
//         oauth: {
//             domain: 'authenticate.medlinkjobs.com',
//             scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
//             redirectSignIn: 'myapp://AuthCommonScreen',
//             redirectSignOut: 'myapp://Login',
//             responseType: 'code',
//             options: {
//                 Google: {
//                     clientId: '438689605258-hhqhngbg4blg05k134k0tckqt4nu2tpn.apps.googleusercontent.com',
//                     responseType: 'code',
//                     scope: ['profile', 'email', 'openid', 'phone', 'aws.cognito.signin.user.admin'],
//                 },
//             },
//         },
//     },
// });
    useEffect(() => {
        GoogleSignInHandler()
    }, [isFocused]);


    return (
        <Pressable
            onPress={() => {
                Auth.federatedSignIn({ provider: "google" })
            }}
            style={styles.googleLoginView}
        >
            <Image
                source={require("../../assets/Google_ICON.png")} />
            <Text
                style={{
                    color: '#6F7482',
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    marginLeft: 15
                }}
            >
                Google

            </Text>
        </Pressable>
    )
}

export default GoogleSignInButton;

const styles = StyleSheet.create({
    googleLoginView: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 5,
        // marginVertical:hp('3%'),
        width: wp('80%'),
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 3,
        height: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
})
