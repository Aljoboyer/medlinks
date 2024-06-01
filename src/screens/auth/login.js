import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Keyboard,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Linking
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Amplify, Auth, Hub } from 'aws-amplify'
import LoginHeader from "../../components/header/loginheader";
import TextBoxes from "../../components/textBoxes/textBoxes";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { gqlquery, gqlOpenQuery } from "../../api/doctorFlow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { showMessage } from 'react-native-flash-message'
import { DataContext } from "../../Context/GlobalState";
import { setAuthCommonScreenLoader, userLoggedHandler } from "../../Redux_Mine/Redux_Slices/GlobalSettingSlice";
import GoogleSignInButton from "../../components/googleSignInbutton/googleSignInbutton";
import aws_config_doctor from '../../../aws-config.doctor';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native";
Amplify.configure(aws_config_doctor);

const Login = ({ route }) => {
  const navigation = useNavigation()
  const [page, setpage] = useState(0);
  var regexp = /^\S*$/;
  const [otp, setOTP] = useState('');
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [seconds, setSeconds] = useState(0);

  const [codeErr, setCodeErr] = useState('');
  const [forgotPasswordErr, setForgotPasswordErr] = useState('')
  const [otpSignUpTextBlur, setOtpSignUpTextBlur] = useState(false);
  const [otpLoginTextBlur, setOtpLoginTextBlur] = useState(false);
  const [signUpSeconds, setSignUpSeconds] = useState(0);
  const [state, dispatch] = useContext(DataContext)
  const [signinuser, setSigninuser] = useState({})
  const [OTPDetected, setOTPDetected] = useState(false);
  const [isphone, setIsphone] = useState(false);
  const [inputsLogin, setInputslogin] = useState({ user: '', emailorphone: '', password: '' })
  const [loginSeconds, setLoginSeconds] = useState(0);
  const [prelogindata, setPreloginData] = useState('')
  let otpRegex = /^[0-9]*$/;
  const [loading, setLoading] = useState(false);
  const [emailorphoneErr, setEmailorphoneErr] = useState('')
  const [passwordErr, setPassworderr] = useState('')
  const [otpErr, setotpErr] = useState('')
  const [flag, setflag] = useState(false)
  let numRgex = /^[0-9]$/;
  const dispatchAction = useDispatch()
  const [active, setActive] = useState(false)
  // dsdsdsdds
  const handleOnchangelogin = (text, input) => {
    if (text) {
      setEmailorphoneErr('')
    }
    setInputslogin((prevState) => ({ ...prevState, [input]: text }))
  }

  function preLoginUpdate() {
    Keyboard.dismiss();
    let isValid = true;
    console.log("email", inputsLogin)
    setLoading(true)
    if (!inputsLogin.emailorphone) {
      setEmailorphoneErr('Please input email or phone')
      isValid = false
      setLoading(false)
      return;
    }
    if (inputsLogin.emailorphone.split('')[0] == '+') {
      console.log('Phone e dukse')
      setEmailorphoneErr('Phone number length should be 10 Digit')
      setLoading(false)
      return;
    }
    if (inputsLogin.emailorphone && (/^\d+$/).test(inputsLogin.emailorphone)) {
      if (inputsLogin.emailorphone?.length !== 10) {
        setEmailorphoneErr('Please input a valid phone number')
        isValid = false
        console.log('phone e asche')
        setLoading(false)
        return;
      }
    }
    if (inputsLogin.emailorphone && !(/^\d+$/).test(inputsLogin.emailorphone)) {
      if (!inputsLogin.emailorphone.match(/\S+@\S+\.\S+/)) {
        setEmailorphoneErr('Please input a valid email')
        isValid = false
        console.log('Email e asche')
        setLoading(false)
        return;
      }
    }

    if (isValid === true) {
      const PRE_LOGIN_UPDATE = {
        query: `mutation MyMutation {
        preLoginUpdate(userName:"${inputsLogin?.emailorphone}")
          }`,
        operationName: "MyMutation",
      };
      gqlOpenQuery(PRE_LOGIN_UPDATE, null)
        .then((res) => res.json())
        .then(async (data) => {

          console.log('From PreLoginUpdate raw>>>>>', data)
          const prelogindata = JSON.parse(data?.data?.preLoginUpdate)

          console.log('From PreLoginUpdate data >>>>>', prelogindata.response)
          setPreloginData(prelogindata.response)
          if (prelogindata?.response?.code === "UserNotFoundException") {
            setflag(false)
            OTPsendForUnRegisterUserInLogin()

            console.log('entered')
          } else {
            handlePasswordlogin()
            setflag(true)
            setLoading(false)
          };
        });
    }
  }

  const OTPsendForUnRegisterUserInLogin = async () => {
    Keyboard.dismiss();
    let isValid = true

    setOTPDetected(true);
    if (!inputsLogin.emailorphone) {
      setEmailorphoneErr('Please input email or phone')
      isValid = false
      setLoading(false)
    }
    if (inputsLogin.emailorphone.split('')[0] == '+') {
      console.log('Phone e dukse')
      setEmailorphoneErr('Please input valid phone')
      console.log('ekhaneee')
      isValid = false
      setLoading(false)
      return;
    }
    if (inputsLogin.emailorphone && (/^\d+$/).test(inputsLogin.emailorphone)) {
      setEmailorphoneErr('')
      if (inputsLogin.emailorphone?.length !== 10) {
        setEmailorphoneErr('Please input a valid phone number')
        isValid = false

      }
      else {

        try {
          FromLoginNewUserSignUp({ phone_number: `+91${inputsLogin.emailorphone}` });
          setEmailorphoneErr('')
          setPassworderr('')
          setLoading(false)

        } catch (error) {
          setLoading(false)
          showMessage({
            message: 'Phone number is already exists',
            type: 'danger',
            hideStatusBar: true,
            icon: 'error',
            position: 'right',
            duration: 2000,
          })
        }

      }
    }
    if (inputsLogin.emailorphone && !(/^\d+$/).test(inputsLogin.emailorphone)) {
      if (!inputsLogin.emailorphone.match(/\S+@\S+\.\S+/)) {
        setEmailorphoneErr('Please input a valid email')
        isValid = false
        setLoading(false)
      }
      else {
        try {
          console.log("I am email")
          FromLoginNewUserSignUp({ email: inputsLogin.emailorphone })
          setEmailorphoneErr('')
          setPassworderr('')
          setLoading(false)
        } catch (error) {
          setLoading(false)
          showMessage({
            message: 'Email is already exists',
            type: 'danger',
            hideStatusBar: true,
            icon: 'error',
            position: 'right',
            duration: 2000,
          })
        }
      }
    }
  };

  const handleOTPlogin = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputsLogin.emailorphone) {
      setEmailorphoneErr('Please input email or phone')
      isValid = false
    }
    if (inputsLogin.emailorphone && (/^\d+$/).test(inputsLogin.emailorphone)) {
      if (inputsLogin.emailorphone?.length !== 10) {
        setEmailorphoneErr('Please input a valid phone number')
        isValid = false
      }
      else {
        setEmailorphoneErr('')
        signIn(`+91${inputsLogin.emailorphone}`, null)
      }
    }
    if (inputsLogin.emailorphone && !(/^\d+$/).test(inputsLogin.emailorphone)) {
      if (!inputsLogin.emailorphone.match(/\S+@\S+\.\S+/)) {
        setEmailorphoneErr('Please input a valid email')
        isValid = false
      }
      else {
        setEmailorphoneErr('')
        signIn(inputsLogin.emailorphone, null)
      }
    }
  };

  async function signIn(param1, param2) {
    console.log("attributes", param1)
    try {
      if (param2 === null) {
        const user = await Auth.signIn(param1);
        setSigninuser(user);
        setLoading(false);
        setpage(2);
      } else {
        const user = await Auth.signIn(param1, param2);
        postAuthentication(user);
        console.log('password login done')
      }
    } catch (error) {
      console.log('error signing in', error);
      showMessage({
        message: 'Incorrect username or password',
        type: 'danger',
        hideStatusBar: true,
        icon: 'error',
        position: 'right',
        duration: 2000,
      })
    }
  }

  const confirmSignIn = async (code) => {
    console.log("signinuser", signinuser)
    setLoading(true)
    try {
      const res = await Auth.sendCustomChallengeAnswer(
        signinuser, code
      );
      console.log("res code", res);
      postAuthentication(res);
      setOTP('');
    } catch (error) {
      setLoading(false)
      showMessage({
        message: 'Incorrect code/Your network connection is poor',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
      console.log('error code in', error);
    }
  }

  async function FromLoginNewUserSignUp(attributes) {
    console.log(inputsLogin.user, inputsLogin.password, attributes)
    inputsLogin.user = `MLJS_M${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`
    try {
      const { user } = await Auth.signUp({
        username: inputsLogin.user,
        password: 'Mlf093jna763tvsva9792adok3ndwoi3',
        attributes,
        autoSignIn: { // optional - enables auto sign in after user is confirmed
          enabled: true,
        }
      })

      setpage(2);


      console.log("user after signup", user);
    } catch (error) {
      console.log(inputsLogin.user);
      // setRecievedCode(user);
      console.log('error signing up FromLoginNewUserSignUp', error);
    }
  }

  const handlePasswordlogin = () => {
    let isValid = true;
    if (!inputsLogin.emailorphone) {
      // handleError('Please input email or phone', 'loginEmailorphone')
      isValid = false
    }
    if (inputsLogin.emailorphone && (/^\d+$/).test(inputsLogin.emailorphone)) {

      if (inputsLogin.emailorphone?.length !== 10) {
        setEmailorphoneErr('Please input a valid phone number')
        isValid = false
      }
      else {
        setEmailorphoneErr('')
        setPassworderr('')
        // signIn(`+91${inputsLogin.emailorphone}`, null)
      }
    }
    if (inputsLogin.emailorphone && !(/^\d+$/).test(inputsLogin.emailorphone)) {

      if (!inputsLogin.emailorphone.match(/\S+@\S+\.\S+/)) {
        setEmailorphoneErr('Please input a valid email')
        isValid = false
      }
      else {
        setEmailorphoneErr('')
        setPassworderr('')
        // signIn(inputsLogin.emailorphone, null)
      }
    }
    if (isValid === true) {
      setLoading(true);
      handleOTPlogin()


    }
  }

  const postSignUp = async (userName) => {
    console.log("username", userName)
    const MUTATIONPOSTSIGNUP = {
      query: `mutation MyMutation {
        postSignUp(userName: "${userName}")
      }`,
      operationName: "MyMutation",
    };
    gqlquery(MUTATIONPOSTSIGNUP, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log("From Post Singup >>", datas)
        navigation.navigate('AuthCommonScreen');
      })
  };


  function updateOldUserId(oldUserId, newUserId, email) {
    console.log('entered update old userId');
    return new Promise((resolve, reject) => {
      const MUTATION_UPDATE_OLD_USERID = {
        query: `mutation MyMutation {
          updateOldUserId(oldId:"${oldUserId}", newId:"${newUserId}",email:"${email}")
            }`,
        operationName: "MyMutation",
      };
      gqlquery(MUTATION_UPDATE_OLD_USERID, null)
        .then((res) => {
          console.log(res, 'resssssssssssss')
          res.json()
        })
        .then((datas) => {
          console.log(datas, 'datassssssssssssssssssssss')
          resolve()
          // const existsData = JSON.parse(datas.data.verifyEmail);
          // setUserExistsData(existsData);
        }).catch((err) => {
          reject()
        })
    })
  }


  const postAuthentication = async (res) => {

    return new Promise(async (resolve, reject) => {
      try {
        let access_token = res["signInUserSession"]["accessToken"]["jwtToken"];
        let idToken = res["signInUserSession"]["idToken"]["jwtToken"];
        let refresh_token = res["signInUserSession"]["refreshToken"]["token"];
        console.log("accesstoken from post aithentucation", access_token)
        await AsyncStorage.setItem("accessToken", access_token);
        await AsyncStorage.setItem("idToken", idToken);
        await AsyncStorage.setItem("refreshToken", refresh_token);
        await AsyncStorage.setItem("flow", "jobSeeker");
        await AsyncStorage.setItem("emailOrPhone", inputsLogin.emailorphone);
        await AsyncStorage.setItem("loginEmailorPhone", inputsLogin.emailorphone);
        var token = idToken; 
        console.log('Came here')
        var decoded = jwt_decode(token);
        const jwt_token = decoded;

        let userToken = {
          access_token,
          idToken,
          refresh_token,
          emailOrPhone: inputsLogin.emailorphone,
          jwt_token
        }
        console.log("jwt_token in post", jwt_token)
        if (decoded["custom:old_userpool_Id"]) {
          const oldUserId = decoded["custom:old_userpool_Id"]
          const newUserId = decoded["sub"]
          const email = decoded["email"]
          // console.log(oldUserId, newUserId, email, 'idssssss');
          await updateOldUserId(oldUserId, newUserId, email);
        }

        const jsonValue = JSON.stringify(userToken)
        const value = await AsyncStorage.setItem('userToken', jsonValue)
        const flowItem = await AsyncStorage.setItem('FLOW', 'Doctor')

        setLoading(false)
        const flow = 'Doctor'
        dispatch({ type: 'AUTH', payload: userToken })
        dispatch({ type: 'FLOW', payload: flow })
        setOTPDetected(false);
        // dispatch({ type: "FLOW", payload: "doctor" });
        // setLoggedInUser({ ...loggedInUser, userToken }); 
        showMessage({
          message: 'Login Success',
          type: 'success',
          hideStatusBar: true,
          icon: 'success',
          position: 'right',
          duration: 2000,
        })
        dispatchAction(userLoggedHandler(true))
        setTimeout(handleNavigate, 700)

        resolve()
      } catch (err) {
        console.log('From PostAuthentication', err)
        reject()
      }
    })
  }


  const handleNavigate = () => {
    navigation.navigate('AuthCommonScreen')
  }

  async function confirmSignUp(code) {
    console.log("ijputs.user", inputsLogin)
    try {
      setLoading(true)
      await Auth.confirmSignUp(inputsLogin.user, code);
      const unsubscribe = Hub.listen('auth', ({ payload }) => {
        const { event } = payload;
        if (event === 'autoSignIn') {
          const user = payload.data;
          console.log("user object", user)
          postAuthentication(user).then(() => {
            postSignUp(user?.attributes?.email || user?.attributes?.phone_number);
            unsubscribe();
          })
        } else if (event === 'autoSignIn_failure') {
          unsubscribe();
          // redirect to sign in page
        }
      })
    } catch (error) {
      setLoading(false)
      console.log('error confirming sign up', error);
      if (error.message == 'Network error') {
        showMessage({
          message: 'Poor network connection! please check your network connection',
          type: 'danger',
          hideStatusBar: true,
          icon: 'danger',
          position: 'right',
          duration: 2000,
        })
      }
      else {
        showMessage({
          message: 'Invalid verification code provided, please try again.',
          type: 'danger',
          hideStatusBar: true,
          icon: 'danger',
          position: 'right',
          duration: 2000,
        })
      }

    }
  }

  const verifycodesignup = () => {
    // setAttemptsCodeCheck(pre => pre + 1);
    // // console.log("ateempys", attemptsCodeCheck)
    // if (attemptsCodeCheck >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttemptsCodeCheck(0);
    //   // 
    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    if (otp && otp?.length == 6 && !otpErr) {
      confirmSignUp(otp);
      // handleError({})
      setEmailorphoneErr('')
      setPassworderr('')
      setotpErr('')
    }
    else {
      setotpErr('Please enter otp')
      showMessage({
        message: 'Please enter proper OTP',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
    }
  }


  const final = () => {
    // setAttempts(pre => pre + 1);
    // console.log("ateempys", attempts)
    // if (attempts >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttempts(0);

    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    console.log("ipnutslogin password", inputsLogin.password);
    if (!inputsLogin.password) {
      setPassworderr('Please Enter your password')
      showMessage({
        message: 'Please enter email or phone',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
      return
    } else if (inputsLogin.password && inputsLogin.password.length < 6) {
      setPassworderr('Password length is atleast 6')
      return
    } else {
      if (inputsLogin.emailorphone && (/^\d+$/).test(inputsLogin.emailorphone)) {
        setIsphone(true)
        if (inputsLogin.emailorphone?.length !== 10) {
          setEmailorphoneErr('Please input a valid phone number')
          isValid = false
        }
        else {
          setEmailorphoneErr('')
          setPassworderr('')
          setLoading(true)
          signInWithPassword(`+91${inputsLogin.emailorphone}`, inputsLogin.password)
          // setLoading(false)
        }
      }
      if (inputsLogin.emailorphone && !(/^\d+$/).test(inputsLogin.emailorphone)) {
        setIsphone(false)
        if (!inputsLogin.emailorphone.match(/\S+@\S+\.\S+/)) {
          setEmailorphoneErr('Please input a valid email')
          isValid = false
        }
        else {
          setEmailorphoneErr('')
          setPassworderr('')
          setLoading(true)
          signInWithPassword(inputsLogin.emailorphone, inputsLogin.password)
          // setLoading(false)
        }
      }
    }
  }


  async function signInWithPassword(username, password) {
    //DEV_Credential
    // Amplify.configure({
    //   Auth: {
    //     region: "ap-south-1",
    //     userPoolId: "ap-south-1_QK74tfZrQ",
    //     userPoolWebClientId: "1ua1gsq8b1hui3jva16f72u38k",
    //     authenticationFlowType: 'USER_PASSWORD_AUTH',
    //   },
    // });

    //QA_Credential
    Amplify.configure({
      Auth: {
        region: "ap-south-1",
        userPoolId: "ap-south-1_9D2FX5VoM",
        userPoolWebClientId: "1c09j45grpbk0amn4cfvjn5m4s",
        authenticationFlowType: 'USER_PASSWORD_AUTH',
      }
    });

    //PRODUCTION_Credential
    // Amplify.configure({
    //   Auth: {
    //     region: "ap-south-1",
    //     userPoolId: "ap-south-1_wvE08H8k4",
    //     userPoolWebClientId: "216k3n2dhccdj3aonle7hrko57",
    //     authenticationFlowType: 'USER_PASSWORD_AUTH',
    //   }
    // });

    try {
      const user = await Auth.signIn(username, password);
      console.log(user)
      postAuthentication(user)
    } catch (error) {
      setLoading(false)
      console.log('error from signInWithPassword >>>>>>', error)
      showMessage({
        message: 'Incorrect username or password',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
    }
  }

  const verifyValidatecode = () => {
    // setAttemptsCodeCheck(pre => pre + 1);
    // console.log("ateempys", attemptsCodeCheck)
    // if (attemptsCodeCheck >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttemptsCodeCheck(0);

    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    console.log("I am hera as an otp")
    if (otp && otp?.length == 6 && !otpErr) {
      confirmSignIn(otp);
      setEmailorphoneErr('')
      setPassworderr('')
      setotpErr('')
    } else {
      setotpErr('Please enter otp')
      showMessage({
        message: 'Please enter proper OTP',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
    }
  }


  // ----------Production-------//
  //  const TcUrl = "https://www.medlinkjobs.com/terms-and-services"
  //  const PVCUrl = "https://www.medlinkjobs.com/privacy-policy"

  //--------QA url -------------//
    const TcUrl = "https://qa.medlinkjobs.com/terms-and-services"
   const PVCUrl = "https://qa.medlinkjobs.com/privacy-policy"

  //--------dev url -------------//
  // const TcUrl = "https://dev.medlinkjobs.com/terms-and-services"
  // const PVCUrl = "https://dev.medlinkjobs.com/privacy-policy"

  const HandleTCHandler = useCallback(async () => {
    const supported = await Linking.canOpenURL(TcUrl);

    if (supported) {
      await Linking.openURL(TcUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${TcUrl}`);
    }
  }, [TcUrl]);

  const HandlePVCHandler = useCallback(async () => {
    const supported = await Linking.canOpenURL(PVCUrl);

    if (supported) {
      await Linking.openURL(PVCUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${PVCUrl}`);
    }
  }, [PVCUrl]);



  const ResendOTPHandlerSignIn = async () => {
    // setAttemptsCode(pre => pre + 1);
    // console.log("ateempys", attemptsCode)
    // if (attemptsCode >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttemptsCode(0);

    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    if ((/^\d+$/).test(inputsLogin.emailorphone)) {
      signIn(`+91${inputsLogin.emailorphone}`, null);
      showMessage({
        message: 'Code send successfully',
        type: 'success',
        hideStatusBar: true,
        icon: 'success',
        position: 'right',
        duration: 2000,
      })
      setOtpLoginTextBlur(true)
      setLoginSeconds(30)
    } else {
      signIn(inputsLogin.emailorphone, null);
      showMessage({
        message: 'Code send successfully',
        type: 'success',
        hideStatusBar: true,
        icon: 'success',
        position: 'right',
        duration: 2000,
      })
      setOtpLoginTextBlur(true)
      setLoginSeconds(30)
    }

  }

  const ResendOTPHandlerSignup = async () => {
    // setAttemptsCode(pre => pre + 1);
    // console.log("ateempys", attemptsCode)
    // if (attemptsCode >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttemptsCode(0);

    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    try {
      const Response = await Auth.resendSignUp(inputsLogin.user);
      // console.log('Response from ResendOTPHandlerSignup >>>>', Response)
      // console.log('Parameter from ResendOTPHandlerSignup >>>>', inputs.user)
      showMessage({
        message: 'Code send successfully',
        type: 'success',
        hideStatusBar: true,
        icon: 'success',
        position: 'right',
        duration: 2000,
      })
      setOtpSignUpTextBlur(true)
      setSignUpSeconds(30)
    } catch (err) {
      console.log('error resending code from signup: ', err);
      showMessage({
        message: 'Attempt limit exceeded, please try after some time.',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
    }
  }

  const handleResendCode = async () => {
    // setAttempts(pre => pre + 1);
    // console.log("ateempys", attempts)
    // if (attempts >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttempts(0);
    //   // setLoaderBtn(true);
    //   // // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    if ((/^\d+$/).test(inputsLogin?.emailorphone)) {
      Auth.forgotPassword(`+91${inputsLogin?.emailorphone}`)
        .then((data) => {
          if (data) {
            showMessage({
              message: "Vefication code send",
              type: "success",
            });
          }
          console.log('data >>>', data);
          setSeconds(30)
        })
        .catch((err) => console.log(err));

    } else {
      Auth.forgotPassword(inputsLogin?.emailorphone)
        .then((data) => {
          if (data) {
            showMessage({
              message: "Vefication code send",
              type: "success",
            });
          }
          console.log('data >>>', data);
          setSeconds(30)
        })
        .catch((err) => console.log(err));
    }


  };

  useEffect(() => {
    setOTP('');
    setotpErr('')
  }, [page])

  const SetNewPasswordHandler = async () => {
    // setAttemptscode(pre => pre + 1);
    // console.log("ateempys", attemptscode)
    // if (attemptscode >= 2) {
    //   console.log("hjgjhgjj")
    //   recaptcha.current?.open();
    //   setAttemptscode(0);
    //   // setLoaderBtn(true);
    //   // setLoaderBtn(false);
    //   // setProgressLoading(false);
    //   return;
    // };
    setLoading(true)
    if (code?.length == 6 && password && password.length >= 6) {
      try {
        if ((/^\d+$/).test(inputsLogin?.emailorphone)) {
          const res = await Auth.forgotPasswordSubmit(`+91${inputsLogin?.emailorphone}`, code, password)
          console.log("password change res phone",res)
          setpage(0)
        }
        else {
          const res = await Auth.forgotPasswordSubmit(inputsLogin?.emailorphone, code, password)
          console.log("password change res",res)
          setpage(0)
        }
        setCode('')
        setPassword('')
        setLoading(false)
      } catch (err) {
        console.log('SetNewPasswordHandler errr >>>', err)
        setCodeErr('Please Enter Valid OTP');
        setLoading(false)
      }

    }
    else {
      setLoading(false)
      showMessage({
        message: 'Please enter OTP and Password properly',
        type: 'danger',
        hideStatusBar: true,
        icon: 'error',
        position: 'right',
        duration: 2000,
      })
    }
  };

  const ForGetPasswordHandler = async () => {

    try {

      if ((/^\d+$/).test(inputsLogin.emailorphone)) {
        setIsphone(true)
        await Auth.forgotPassword(`+91${inputsLogin.emailorphone}`)
      } else {
        setIsphone(false)
        await Auth.forgotPassword(inputsLogin.emailorphone)
      }

      showMessage({
        message: 'OTP is send in your Email/Phone',
        type: 'success',
        hideStatusBar: true,
        icon: 'success',
        position: 'right',
        duration: 2000,
      })
      setInputslogin({ ...inputsLogin, password: '' })
      setpage(3)
    }
    catch (err) {
      console.log('ForGetPasswordHandler Error >>>', err)
      showMessage({
        message: 'Your Phone/Email is not registered',
        type: 'danger',
        hideStatusBar: true,
        icon: 'danger',
        position: 'right',
        duration: 2000,
      })
    }

  }

  useEffect(() => {
    let timer = (signUpSeconds > 0 && otpSignUpTextBlur) && setInterval(() => {
      setSignUpSeconds((seconds) => seconds - 1);
    }, 1000)
    return () => {
      clearInterval(timer);
    };
  }, [signUpSeconds, page]);


  useEffect(() => {
    let timer = (loginSeconds > 0 && otpLoginTextBlur) && setInterval(() => {
      setLoginSeconds((loginSeconds) => loginSeconds - 1);
    }, 1000)
    return () => {
      clearInterval(timer);
    };
  }, [loginSeconds, page]);

  useEffect(() => {
    let timer = seconds > 0 && setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000)
    return () => {
      clearInterval(timer);
    };
  }, [seconds, page]);

  const loginScreenLoading = useSelector((state) => state.globalSettingStore.loginScreenLoading);
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatchAction(setAuthCommonScreenLoader(true))
  },[isFocused])
  
  return (
    <SafeAreaView style={{ flex: 1, }}>
      {page === 0 &&
           <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for Android and iOS
           style={{ flex: 1 }}
           keyboardVerticalOffset={50} // Adjust this value as needed
         >
     
        {
           loginScreenLoading ?  <View style={{ flex: 1, paddingHorizontal: wp('6%'),
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center' }}>
              <View>
                  <Text><ActivityIndicator size='large' color="blue" /></Text>
              </View>
           </View> : <>
           <View style={{ flex: 1, paddingHorizontal: wp('6%') }}>
          <LoginHeader backarrow={'arrow-back-outline'}  setflag={setflag} setpage={setpage} page={page} arrow={false} title={"Register or Login"} colorname={'#6F7482'} /></View><View style={{ flex: 6, paddingHorizontal: wp('6%') }}>
            <TextBoxes onBlurHandler={() => {
              if (!inputsLogin.emailorphone) {
                setEmailorphoneErr('Please enter phone number or email id')
              } else {
                setEmailorphoneErr('')
              }
            }}
              error={emailorphoneErr}
              onChangeText={(text) => handleOnchangelogin(text.trim(), "emailorphone")}
              // onFocus={() => handleError(null, "loginEmailorphone")}
              value={inputsLogin.emailorphone.trim()}
              title='Phone Number/Email ID' placeHolder="Enter phone number/email id" extra={false} />
            <View
              style={styles.seperatorView}>
              <View style={styles.lineView}></View>
              <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#6F7482' }}>or</Text>
              <View style={styles.lineView}></View>
            </View>
            <GoogleSignInButton />
          </View>
          <View style={{ borderWidth: 1, borderColor: '#E4EEF5', flex: 2 }}>
            <View style={{ flex: 1, justifyContent: 'space-around' }}>
              <View style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, lineHeight: 24, fontFamily: "Poppins-Regular", color: '#6F7482', paddingLeft: wp('3.5%'), textAlign: 'center' }}>By clicking Sign Up, you agree to the{' '}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={HandleTCHandler}>
                    <Text style={{
                      fontSize: 12, lineHeight: 24, textAlign: 'center', color: '#395987', fontFamily: "Poppins-Regular"
                    }}>
                      Terms and Conditions
                    </Text>
                  </TouchableOpacity>

                  <Text style={{ fontSize: 12, lineHeight: 24, color: '#6F7482', fontFamily: "Poppins-Regular", marginHorizontal: 5 }}>&</Text>

                  <TouchableOpacity onPress={HandlePVCHandler}>
                    <Text style={{
                      fontSize: 12, lineHeight: 24, color: '#395987', fontFamily: "Poppins-Regular"
                    }}>
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {loading === false ? <TouchableOpacity onPress={() => preLoginUpdate()} style={styles.bottomtabView}><Text style={{ color: 'white', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Continue</Text></TouchableOpacity> : <TouchableOpacity style={styles.bottomtabView}><ActivityIndicator color={'white'} size={24} /></TouchableOpacity>}
            </View>
          </View>
           </>
        }
         
   
          </KeyboardAvoidingView>
      }
      {page === 1 && <><View style={{ flex: 1, paddingHorizontal: wp('6%') }}>
        <LoginHeader backarrow={'arrow-back-outline'} setflag={setflag} setpage={setpage} page={page} arrow={true} title={"Login As Jobseeker"} colorname={'#395987'} /></View>
        <View style={{ flex: 6, paddingHorizontal: wp('6%') }}>
          <TextBoxes title='Password' placeHolder="Enter password" extra={true} onBlurHandler={() => {
            if (!inputsLogin.emailorphone) {
              setEmailorphoneErr('Please enter phone number or email id')
            } else {
              setEmailorphoneErr('')
            }
          }}
            iconname={"eye"}
            value={inputsLogin.password.trim()}
            error={passwordErr}
            onChangeText={(text) => handleOnchangelogin(text.trim(), "password")} />
          <TouchableOpacity onPress={() => ForGetPasswordHandler()}><Text style={{
            marginVertical: 12, fontFamily: 'Poppins-Medium', fontSize: 14, lineHeight: 21, color: '#395987', textAlign: 'right', textDecorationLine: 'underline'
          }}>Forgot Password?</Text></TouchableOpacity>
        </View>
        <View style={{ borderWidth: 1, borderColor: '#E4EEF5', flex: 2 }}>
          <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 18 }}>
            {loading === false ? <TouchableOpacity onPress={() => final()} style={styles.bottomtabView}><Text style={{ color: 'white', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Continue</Text></TouchableOpacity> : <TouchableOpacity style={styles.bottomtabView}><ActivityIndicator color={'white'} size={24} /></TouchableOpacity>}
          </View>
        </View>

      </>}
      {page === 2 && <><View style={{ flex: 1, paddingHorizontal: wp('6%') }}>
        <LoginHeader  backarrow={'arrow-back-outline'} setflag={setflag} setpage={setpage} page={page} arrow={true} title={"Verification"} colorname={'#395987'} /></View>
        <View style={{ flex: 6, paddingHorizontal: wp('6%') }}>
          <Text
            style={{
              color: '#6F7482',
              fontFamily: "Poppins-SemiBold",
              fontSize: 12,
              lineHeight: 18
            }}
          >
            A six digit one time code was sent to

          </Text>
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: '#395987',
              fontSize: 14,
              lineHeight: 21,
              marginTop: 5,
              textDecorationLine: 'underline'
            }}
          >
            {inputsLogin?.emailorphone}
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: '#395987',
                fontSize: 14,
                lineHeight: 21
              }}
            >
              <Pressable style={{ paddingLeft: 18, }} onPress={() => { setpage(0) }} ><Ionicons name='pencil' color="#395987" size={16}></Ionicons></Pressable>
            </Text></Text>
          <OTPInputView
            style={{ width: '100%', height: 100, }}
            pinCount={6}
            code={otp}
            onCodeChanged={code => {
              if (otpRegex.test(code) === true && code) {

                setotpErr('');
              }
              else {
                setotpErr('Please Enter numbers only.')
              }
              setOTP(code);
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
          <Text style={[{ fontSize: 10, color: 'red', fontFamily: "Poppins-Regular", }]}>{otpErr}</Text>
          <View
            style={{
              alignItems: 'center',
              // flexDirection: 'row',
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            {
              (otpLoginTextBlur && loginSeconds > 0) && <Text style={{ color: '#395987', fontWeight: '400', fontSize: 14, marginTop: 10 }}>{loginSeconds} Seconds Left</Text>
            }
            {
              (otpSignUpTextBlur && signUpSeconds > 0) && <Text style={{ color: '#395987', fontWeight: '400', fontSize: 14, marginTop: 10, fontFamily: "Poppins-Regular" }}>{signUpSeconds} Seconds Left</Text>
            }
            {
              signUpSeconds > 0 || loginSeconds > 0 ? <Text></Text> : <Pressable style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#B8B8B8', fontFamily: "Poppins-Regular", fontSize: 13, lineHeight: 14, }}>
                  Didn’t receive OTP?{'  '}
                </Text>
                <Pressable onPress={() => { if (flag === false) { ResendOTPHandlerSignup() } else { ResendOTPHandlerSignIn() } }}>
                  <Text style={{ fontFamily: "Poppins-Regular", color: '#395987', fontSize: 13, lineHeight: 14, }}>
                    Resend
                  </Text>
                </Pressable>
              </Pressable>
            }
          </View>
        </View>
        <View style={{ borderWidth: 1, borderColor: '#E4EEF5', flex: flag === true ? 2 :1, paddingVertical: 12 }}>
          <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 18 }}>
            {loading === false ? <TouchableOpacity onPress={() => {
              if (OTPDetected === true) { console.log("I am true"); verifycodesignup(); } else {
                console.log("I am false");
                verifyValidatecode();
              }
            }} style={styles.bottomtabView}><Text style={{ color: 'white', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Continue</Text></TouchableOpacity> :
              <TouchableOpacity style={styles.bottomtabView}><ActivityIndicator color={'white'} size={24} /></TouchableOpacity>}
            {flag === true && <TouchableOpacity onPress={() => { setpage(1) }} style={{
              marginHorizontal: wp('6%'),
              borderColor: '#39598740',
              borderWidth: 1,
              backgroundColor: 'white',
              borderRadius: 6,
              height: 45,
              elevation: 5,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 2,
            }}><Text style={{ color: '#395987', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Login With Password</Text></TouchableOpacity>}
          </View>
        </View>

      </>}
      {page === 3 && <><View style={{ flex: 1, paddingHorizontal: wp('6%') }}>
        <LoginHeader backarrow={'arrow-back-outline'}  setflag={setflag} setpage={setpage} page={page} arrow={true} title={"Reset Password"} colorname={'#395987'} /></View>
        <View style={{ flex: 6, paddingHorizontal: wp('6%'), alignContent: 'center' }}>
          <TextBoxes title='New Password' placeHolder="Enter password" extra={true} onChangeText={(text) => {

            if (regexp.test(text) == true) { setPassword(text); setForgotPasswordErr('') } else {
              setForgotPasswordErr("Password should not include whitespaces")
            }
          }}
            iconname={"eye"}
            error={forgotPasswordErr}
            autoCapitalize={"none"}
            onBlurHandler={() => {
              if (!password) {
                setForgotPasswordErr('Please enter new password.')
              } else {
                setForgotPasswordErr('')
              }
            }} />
          <TextBoxes onBlurHandler={() => {
            if (!code) {
              setCodeErr('Please enter conformation code')
            } else {
              setCodeErr('')
            }
          }}
            error={codeErr}
            onChangeText={(text) => {
              setCode(text)
              setCodeErr('')
            }}
            keyboardType={'Number-pad'}
            // onFocus={() => handleError(null, "loginEmailorphone")}
            value={code}
            title='OTP' placeHolder="Enter Otp" extra={false} />
          {

            seconds > 0 ?
              <View style={{ alignItems: 'center', marginTop: 12 }}><Text style={{ marginVertical: 10, textAlign: "center", color: '#395987', fontSize: 14, marginTop: 10 }}>{seconds} Seconds Left</Text></View> :
              <View style={{ alignItems: 'center', marginTop: 12 }}><TouchableOpacity onPress={handleResendCode}>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 13, lineHeight: 19.5, color: '#6F7482', fontFamily: 'Poppins-Regular'
                  }}
                >
                  Didn’t receive OTP?<Text
                    style={{
                      textAlign: "right",
                      fontSize: 14, lineHeight: 21, color: '#395987', fontFamily: 'Poppins-Medium'
                    }}
                  > Resend</Text>
                </Text>
              </TouchableOpacity></View>
          }
        </View>

        <View style={{ borderWidth: 1, borderColor: '#E4EEF5', flex: 1, paddingVertical: 24 }}>
          <View style={{ flex: 1 }}>
            {loading === false ? <TouchableOpacity onPress={() => {
              SetNewPasswordHandler()
            }} style={styles.bottomtabView}><Text style={{ color: 'white', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Continue</Text></TouchableOpacity> :
              <TouchableOpacity style={styles.bottomtabView}><ActivityIndicator color={'white'} size={24} /></TouchableOpacity>}

          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => {
              setpage(0);
            }} style={styles.bottomtabViewborder}><Text style={{ color: '#395987', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium', }}>Register</Text></TouchableOpacity>

          </View>
        </View>

      </>}
    </SafeAreaView>

  );
};

export default Login;

const styles = StyleSheet.create({
  underlineStyleBase: {
    height: hp('6.5%'), width: wp('12.4%'), borderWidth: 1, borderRadius: hp('1.5%'), borderColor: '#B8BCCA50', alignItems: 'center', justifyContent: 'center', color: 'black', marginRight: 10
  },
  bottomtabView: {
    marginHorizontal: wp('6%'),
    backgroundColor: '#395987',
    borderWidth: 1,
    borderRadius: 6,
    height: 45,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },

  lineView: { backgroundColor: "#E4EEF5", height: 1, width: 120 },
  seperatorView: {
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginVertical: hp('1.5%'),
    paddingVertical: 14,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  underlineStyleHighLighted: {
    borderColor: '#395987',
  },
  bottomtabViewborder: {
    marginHorizontal: wp('6%'),
    borderColor: '#395987',
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderRadius: 6,
    height: 45,
    marginTop: 10,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
});