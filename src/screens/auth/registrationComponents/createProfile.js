import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    SafeAreaView,
    TouchableHighlight,
    ActivityIndicator,
    ScrollView, TextInput
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useContext, useRef } from "react";
import LoginHeader from "../../../components/header/loginheader";
import Tooltip from 'react-native-walkthrough-tooltip';
import TextBoxes from "../../../components/textBoxes/textBoxes";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { showMessage } from 'react-native-flash-message'
import SingleItemBottomSheet from "../../../components/singleItemBottomSheet/singleItemBottomSheet";
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from "react-redux";
import ReactNativeBlobUtil from 'react-native-blob-util'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DataContext } from '../../../Context/GlobalState';
import { Amplify, Auth } from 'aws-amplify';
import { gqlquery, gqlOpenQuery } from "../../../api/doctorFlow";
import aws_config_doctor from '../../../../aws-config.doctor';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getCourseMaster, getAllNoticePeriod, getDesiredIndustryMaster, getHealthInstitutions, getJobRole, getPreferredWorkLocationDropDownData, getQualificationMaster, getSpecializationMaster } from "../../../Redux_Mine/Redux_Slices/DropDownDataSlice";
import { getCareerProfileData, getEducationList, getExperienceList } from "../../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice";
Amplify.configure(aws_config_doctor);

const CreateProfile = ({  route }) => {
    const navigation = useNavigation()
    const dispatchAction = useDispatch();
    const [gender, setGender] = useState('');
    const [resumeChecked, setResumeChecked] = useState(false);
    const [resumeLoad, setResumeLoad] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [state, dispatch] = useContext(DataContext)
    const tokenRef = useRef(state.auth)
    const [cityLocation, setCityLocation] = useState({})
    const [country, setCountry] = useState('')
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [region, setRegion] = useState('')
    const [fileUri, setFileUri] = useState([]);
    const [isNumber, setIsNumber] = useState(false);
    const [resumeName, setResumeName] = useState('');
    const [stateModal, setStateModal] = useState(false);
    const [active, setActive] = useState(false)
    const [locationChecked, setLocationChecked] = useState(false)
    const [files, setFiles] = useState(false);
    const [locationModal, setLocationModal] = useState(false)
    const [active1, setActive1] = useState(false)
    const [active2, setActive2] = useState(false)
    const [active3, setActive3] = useState(false)
    const [active4, setActive4] = useState(false)
    const [allstates, setAllstates] = useState([])
    const allgender = ["Male", "Female", "Other"];
    const [allCityLocation, setAllCityLocation] = useState([])
    const [states, setState] = useState('');
    const [createProfileLoader, setCreateProfileLoader] = useState(false);
    const [nameErr, setNameErr] = useState('');
    const [phoneErr, setPhoneErr] = useState('');
    const [cityErr, setCityErr] = useState('');
    const [resumeErr, setResumeErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [regionerr, setRegionErr] = useState('')
    const [countryerr, setCountryErr] = useState('')
    const [passworderr, setPassworderr] = useState('');
    const [stateErr, setStateErr] = useState('');
    const [showState, setShowState] = useState(false);
    const [gendererr, setGenderErr] = useState('')
    let resText = /^[A-Za-z\s]*$/;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let OutsideLocationTextRegex = /^[A-Za-z\s,.-]*$/;
    let numRgex = /^\d+$/;

    const isFocused = useIsFocused()

    const loginScreenLoading = useSelector((state) => state.globalSettingStore.loginScreenLoading);

    const GetUserLocalstorageEmailOrPhone = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const signUpemailOrPhone = await AsyncStorage.getItem('emailOrPhone')

            const LoginemailOrPhone = await AsyncStorage.getItem('loginEmailorPhone')
            const emailOrPhone = user?.attributes?.email ? user?.attributes?.email : signUpemailOrPhone ? signUpemailOrPhone : LoginemailOrPhone;
            console.log('inside emailOrPhone', emailOrPhone)
            if ((/^\d+$/).test(emailOrPhone)) {
                setIsNumber(true)
                setPhone(emailOrPhone)
            }
            else {
                setIsNumber(false)
                setEmail(emailOrPhone)
            }

            //   setEmailOrPhone(emailOrPhone)
        } catch (e) {
            console.log("error ", e)
            // error reading value
        }
    }

    useEffect(() => {
        GetUserLocalstorageEmailOrPhone()
    }, [isFocused])


    useEffect(() => {
        const GET_CITY = {
            query: `query MyQuery {
            getCityMaster {
              city
              cityWithState
              country
              lmID
              state
            }
          }
        `,
            variables: null,
            operationName: "MyQuery",
        };

        gqlOpenQuery(GET_CITY, null)
            .then((res) => res.json())
            .then((datas) => {
                setAllCityLocation(datas?.data?.getCityMaster)
                // console.log('city location here', datas?.data?.getCityMaster)
            });
    }, [isFocused,locationModal])


    const getallState = () => {
        const GET_STATE_MASTER = {
            query: `query MyQuery {
            getStateMaster(country: "INDIA") {
              state
          }
        }`,
            variables: null,
            operationName: "MyQuery",
        };
        gqlquery(GET_STATE_MASTER, null)
            .then((res) => res.json())
            .then((datas) => { setAllstates(datas?.data?.getStateMaster);
                //  console.log("getStateMaster", datas?.data?.getStateMaster)
                 });
    }

    useEffect(() => {
        getallState();
    }, [isFocused])

    const HandlerName = async (text) => {
        if (resText.test(text) === false || text.trim().length === 0 || text.length < 3 || text.length > 34) {
            setNameErr('Please write proper name without special character and number and space and of 35 characters');
            // isValid = false
            // console.log('asche name2', nameErr)
        }
        else {
            setNameErr('')
        }
        setName(text)
        // setNameErr('')
    }

    const handlePostUserDeviceInfoAndPassword = async () => {
        const MUTATIONPOSTUSERPASSWORD = {
            query: `mutation MyMutation {
                setPassword(
                  password: "${password}", 
                  userName: "${isNumber ? phone : email}"
                )
              }`,
            variables: null,
            operationName: "MyMutation",
        };
        console.log("MUTATIONPOSTUSERPASSWORD", MUTATIONPOSTUSERPASSWORD)
        gqlquery(MUTATIONPOSTUSERPASSWORD, null, tokenRef.current?.access_token)
            .then((res) => res.json())
            .then((data) => {
                console.log('Password post >>', data)
            });

    };


    const handleCreateProfile = async () => {
        setCreateProfileLoader(true)
        let isValid = true

        if (resText.test(name) === false || name.trim().length === 0 || name.length < 3 || name.length > 35) {
            setNameErr('Please write proper name without special character and number and space and of 35 characters');
            isValid = false
            // console.log('asche name2', nameErr)
            setCreateProfileLoader(false)
        }
        if (!name || name == " ") {
            setNameErr('Please write proper name')
            isValid = false
            console.log('asche name')
            setCreateProfileLoader(false)
        }

        if (!password && !loginScreenLoading) {
            setPassworderr('Please enter password')
            isValid = false
            setCreateProfileLoader(false)
        }
        if (password?.length < 6 && !loginScreenLoading) {
            setPassworderr('Password must be at least 6 characters')
            isValid = false
            setCreateProfileLoader(false)
        }
        if (showState && !states?.state) {
            setStateErr("Please select state")
            isValid = false
            console.log('asche state')
            setCreateProfileLoader(false)
        }

        if (!locationChecked && !cityLocation?.city) {
            setCityErr('Please select location')
            isValid = false
            console.log('asche location')
            setCreateProfileLoader(false)
        }


        if (numRgex.test(phone) === false) {
            setPhoneErr('This field only accept numbers')

            isValid = false
            console.log('asche phone')
            setCreateProfileLoader(false)
        }
        if (!phone || phone?.length < 10) {
            setPhoneErr('Please enter valid phone number')
            isValid = false
            console.log('asche phone')
            setCreateProfileLoader(false)
        }
        if (!email || (emailRegex.test(email) === false)) {
            setEmailErr('Please enter valid Email address')
            isValid = false
            console.log('asche email')
            setCreateProfileLoader(false)
        }
        if (!gender) {
            setGenderErr('Please select an Option')
            isValid = false
            console.log('asche gender')
            setCreateProfileLoader(false)
        }
        if (locationChecked && !region) {
            setRegionErr('Please enter region')
            isValid = false
            setCreateProfileLoader(false)
        }
        if (locationChecked && !country) {
            setCountryErr('Please enter country')
            isValid = false
            setCreateProfileLoader(false)
        }
        if (phone.charAt(0) < 6) {
            setPhoneErr('First digit of phone number should be 6-9.')
            setCreateProfileLoader(false)
            return
        }
        if (OutsideLocationTextRegex.test(country) === false && country && locationChecked) {
            setCountryErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
            setCreateProfileLoader(false)
            return
        }
        if (OutsideLocationTextRegex.test(region) === false && region && locationChecked) {
            setRegionErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
            setCreateProfileLoader(false)
            return
        }
        if (isValid === false) {
            return;
        }



        if (isValid === true) {
            setCreateProfileLoader(true)
            const QUERY_POSTNEW_PROFILE = {
                query: `mutation MyMutation {
                addProfileNewReg(
                  email: "${email}",
                  emailVerified: ${isNumber ? false : true},
                  locationID: ${!locationChecked ? cityLocation?.lmID : 0},
                  name: "${name}",
                  phone: "${phone}",
                  phoneVerified: ${isNumber ? true : false},
                  isOutsideIndia: ${locationChecked},
                  outsideArea: "${region || ""}",
                  outsideCountry: "${country || ""}",
                  otherCity: "${showState == true ? cityLocation?.city : ""}",
                  gender:"${gender}",
                  otherState: "${showState == true ? states?.state : ""}",
              ) 
            }`,
                variables: null,
                operationName: "MyMutation",
            };
            console.log('create profile data', QUERY_POSTNEW_PROFILE)
            // return
            gqlquery(QUERY_POSTNEW_PROFILE, null)
                .then((res) => res.json())
                .then((data) => {
                    console.log('create profile data response', data)
                    setCreateProfileLoader(false)
                    if (data?.data?.addProfileNewReg === "Added") {
                        if (!loginScreenLoading) {
                            handlePostUserDeviceInfoAndPassword();
                        }
                        navigation.navigate('Register')
                        setCreateProfileLoader(false)

                    }
                    else if (data?.errors[0]?.message === "Attribute exists") {
                        if (!isNumber) {
                            showMessage({
                                message: 'Phone Number Is Already Exists',
                                type: 'danger',
                                hideStatusBar: true,
                                icon: 'danger',
                                position: 'right',
                                duration: 2000,
                            })
                        }
                        else if (isNumber) {
                            showMessage({
                                message: 'Email Number Is Already Exists',
                                type: 'danger',
                                hideStatusBar: true,
                                icon: 'danger',
                                position: 'right',
                                duration: 2000,
                            })
                        }
                        else{
                            showMessage({
                                message: "Sorry, something went wrong. Please, try again",
                                type: 'danger',
                                autoHide: true,
                                hideStatusBar: true,
                                icon: 'danger',
                                position: 'left'
                            })
                        }
                        setCreateProfileLoader(false)
                        
                    }
                })
                .finally((e) => console.log("adding to database"));
        } else {
            setCreateProfileLoader(false)
        }

    }

    const handleDocumentSelection = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory',
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
            });
            const fileUriArr = response[0]?.fileCopyUri?.split('/')
            fileUriArr.pop()
            fileUriArr.push(response[0]?.name)
            const fileUri = fileUriArr.join("/")
            const file = await ReactNativeBlobUtil.fs.readFile(
                fileUri,
                'base64',
            );

            if (parseFloat(response[0]?.size / 1024 / 1024).toFixed(2) < 2) {
                setResumeName(response[0]?.name)
                setFiles(file)
                setFileUri(response[0]?.uri)
                setResumeLoad(true)
                const QUERY_ADDRESUME = {
                    query: `mutation MyMutation {
                  uploadResume (
                    content: "${file}", 
                    fileName: "${response[0]?.name}",
                    url: "${response[0]?.uri ? response[0]?.uri : ""}"
                  )
                }`,
                    variables: null,
                    operationName: "MyMutation",
                }
                gqlquery(QUERY_ADDRESUME, null)
                    .then((res) => res.json())
                    .then((datas) => {
                        setResumeLoad(false)
                        setResumeChecked(true)
                        setFiles(false);
                        showMessage({
                            message: "Resume Uploaded Successfully",
                            type: "success",
                            duration: 2000
                        });
                    });
            }
            else {
                setResumeLoad(false)
                showMessage({
                    message: "Please select File lessthan 2MB",
                    type: "danger",
                    duration: 2000
                });

            }

        }
        catch (err) {
            console.warn(err);
        }
    }

    const SearchLocation = (text) => {
        const val = text.split(" ").length - 1;
        const valtwo = text.length - val
        // setSearchlocationtext(text)
        if (text && text !== " " && text !== "" && valtwo >= 2) {

            const GET_CITY = {
                query: `query MyQuery {
              searchCity(city: "${text}") {
                city
                cityWithState
                country
                lmID
                state
              }
            }
          `,
                variables: null,
                operationName: "MyQuery",
            };

            gqlOpenQuery(GET_CITY, null)
                .then((res) => res.json())
                .then((datas) => {
                    setAllCityLocation([...datas?.data?.searchCity])

                    if (datas?.data?.searchCity?.length < 1) {
                        setCityLocation({ city: text, cityWithState: "", lmID: 0 });
                        setShowState(true)
                    } else {

                        setShowState(false)
                    }

                });
        }
        else {

            const GET_CITY = {
                query: `query MyQuery {
              getCityMaster {
                city
                cityWithState
                country
                lmID
                state
              }
            }
          `,
                variables: null,
                operationName: "MyQuery",
            };

            gqlOpenQuery(GET_CITY, null)
                .then((res) => res.json())
                .then((datas) => {
                    setAllCityLocation(datas?.data?.getCityMaster);
                    if (datas?.data?.searchCity?.length < 1) {
                        setCityLocation({ city: text, cityWithState: "", lmID: 0 });
                        console.log('else e asche')
                        setShowState(true)
                    } else {
                        // setState("")
                        setShowState(false)
                    }
                });
        }
    }

    const EmailHandler = (text) => {
        if (emailRegex.test(text) === false) {
            setEmailErr('Enter valid email')
        }
        else {
            setEmailErr('')
        }
    }

    useEffect(() => {
        dispatchAction(getQualificationMaster())
        dispatchAction(getCourseMaster())
        dispatchAction(getSpecializationMaster())
        dispatchAction(getJobRole());
        dispatchAction(getHealthInstitutions());
        dispatchAction(getAllNoticePeriod());
        dispatchAction(getDesiredIndustryMaster())
        dispatchAction(getPreferredWorkLocationDropDownData())
        dispatchAction(getExperienceList())
        dispatchAction(getEducationList()); 
        dispatchAction(getCareerProfileData()); 
    }, [isFocused])

    const cityLocationSelectHandler = (item) => {
        setCityLocation(item)
        setLocationModal(false)
        setCityErr('');
        setShowState(false);
    }
    const stateSelectHandler = (item) => {
        setState(item)
        setStateModal(false)
        setStateErr('')
        setCityErr('')
    }

    const citylocationFreeText = (text) => {
        setCityLocation({ city: text, cityWithState: "", lmID: 0 });
        setCityErr('')
        setShowState(true);
        setLocationModal(false)
    }
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <LoginHeader arrow={false} title={"Create Profile"} colorname={'#6F7482'} /></View>
                <View style={{ flex: 9, paddingHorizontal: wp('6%') }}>
                    <TextBoxes title='Full Name' placeHolder="Enter full name" extra={false} error={nameErr} onChangeText={(text) => {
                        if (text.length == 1) {
                            HandlerName(text.trim())
                            console.log('dukssee')
                        }
                        else if (resText.test(text) === false) {
                            setNameErr('Please write proper name without special character and number and space')
                        }
                        else {
                            HandlerName(text)
                            setNameErr('')
                            console.log(text.length)
                        }
                    }}
                        maxLength={35}

                        value={name.replace(/  +/g, " ")}
                    />

                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>Email Id</Text>
                        <View style={{
                            borderColor: active3 ? '#395987' : '#B8BCCA50',
                            borderWidth: 1,
                            borderRadius: 6,
                            height: 45,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 15,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14, lineHeight: 21,
                            marginTop: 10,

                        }}>

                            <TextInput
                                autoCorrect={false}
                                editable={isNumber ? true : false}
                                placeholder={'Enter email id'}
                                keyboardType='default'
                                onFocus={() => setActive3(true)} onBlur={() => setActive3(false)}
                                // onChangeText={() => onChangeText()}
                                value={email?.trim()}
                                onChangeText={(text) => {
                                    setEmail(text.trim())
                                    EmailHandler(text)
                                }}
                                // autoCapitalize={'words'}
                                style={{ flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21, color: 'black' }}
                                placeholderTextColor="#BBBCCA"
                            />
                            <View style={{ width: wp('10%'), flexDirection: 'row' }}>
                                <View style={{ height: hp('5%'), width: wp('10%'), alignItems: 'center', justifyContent: 'center' }}>

                                    {!isNumber ?
                                        <Tooltip
                                            isVisible={toolTipVisible}
                                            content={<Text style={{ fontFamily: 'Poppins-Regular', color: 'grey', fontSize: 12 }}>You can change this later on account settings</Text>}
                                            placement="top"
                                            onClose={() => setToolTipVisible(false)}
                                        >
                                            <TouchableHighlight style={{ borderRadius: 20, backgroundColor: toolTipVisible ? "#6F7482" : 'white' }} onPress={() => setToolTipVisible(true)}>
                                                <Ionicons name="information-circle-outline" size={20} color={toolTipVisible == false ? '#6F7482' : 'white'} />
                                            </TouchableHighlight>
                                        </Tooltip> : <></>}

                                </View>
                            </View>
                        </View></View>
                    {emailErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{emailErr}</Text>}
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>Phone Number</Text>
                        <View style={{
                            borderColor: active4 ? '#395987' : '#B8BCCA50',
                            borderWidth: 1,
                            borderRadius: 6,
                            height: 45,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 15,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 14, lineHeight: 21,
                            marginTop: 10,

                        }}>

                            <TextInput
                                editable={isNumber ? false : true} onChangeText={(text) => {
                                    if (text.charAt(0) >= 6 && numRgex.test(text) === true) {
                                        setPhone(text)
                                        setPhoneErr('')
                                    } else {

                                        setPhoneErr('First digit of phone number should be 6-9 and this field only accept numbers')
                                    }
                                }}
                                maxLength={10}
                                placeholder={"Enter phone number"}
                                autoCorrect={false}
                                keyboardType='number-pad'
                                onFocus={() => setActive4(true)} onBlur={() => setActive4(false)}
                                // onChangeText={() => onChangeText()}
                                defaultValue={phone}

                                // autoCapitalize={'words'}
                                style={{ flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21, color: 'black', }}
                                placeholderTextColor="#BBBCCA"
                            />
                            <View style={{ width: wp('10%'), flexDirection: 'row' }}>
                                <View style={{ height: hp('5%'), width: wp('10%'), alignItems: 'center', justifyContent: 'center' }}>

                                    {isNumber ?
                                        <Tooltip
                                            isVisible={toolTipVisible}
                                            content={<Text style={{ fontFamily: 'Poppins-Regular', color: 'grey', fontSize: 12 }}>You can change this later on account settings</Text>}
                                            placement="top"
                                            onClose={() => setToolTipVisible(false)}
                                        >
                                            <TouchableHighlight style={{ borderRadius: 20, backgroundColor: toolTipVisible ? "#6F7482" : 'white' }} onPress={() => setToolTipVisible(true)}>
                                                <Ionicons name="information-circle-outline" size={20} color={toolTipVisible == false ? '#6F7482' : 'white'} />
                                            </TouchableHighlight>
                                        </Tooltip> : <></>}

                                </View>
                            </View>
                        </View></View>
                    {phoneErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{phoneErr}</Text>}

                    {
                        !loginScreenLoading && <TextBoxes error={passworderr} title='Password' placeHolder="Enter password" extra={true} onChangeText={(text) => {
                            setPassword(text.trim())
                            if (text.length < 6) {
                                setPassworderr('Password must be 6 characters long.')
                            } else {
                                setPassworderr('')
                            }
    
                        }} iconname={'eye'} value={password.trim()} />
                    }

                    <View style={styles.inputView}>
                        <View style={styles.locationLabelView}>
                            {!locationChecked ?
                                <Text style={styles.labelText}>City</Text>
                                :
                                <Text style={styles.labelText}>Location</Text>}
                            <View style={styles.AnywhereView}>
                                {
                                    locationChecked ? <Pressable onPress={() => setLocationChecked(false)}>
                                        <MaterialIcons name='check-box' style={{ marginRight: 7 }} size={18} color="#395987" />
                                    </Pressable> : <Pressable onPress={() => setLocationChecked(true)}>
                                        <MaterialIcons style={{ marginRight: 7 }} name='check-box-outline-blank' size={18} color="#E4EEF5" />
                                    </Pressable>
                                }
                                <Text style={styles.currentlyWorkingText}>OutSide India</Text>
                            </View>
                        </View>
                    </View>
                    {locationChecked ?
                        <>
                            <TextInput onFocus={() => setActive1(true)} onBlur={() => setActive1(false)}
                                // onChangeText={() => onChangeText()}
                                value={country?.replace(/  +/g, " ")}
                                onChangeText={(text) => {

                                    if (OutsideLocationTextRegex.test(text) === false) {
                                        setCountryErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
                                    }
                                    else {
                                        setCountry(text.trimStart())
                                        setCountryErr('')
                                    }
                                }}
                                underlineColorAndroid='transparent' style={{
                                    borderColor: active1 ? '#395987' : '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    height: 45,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 15,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 14, lineHeight: 21,
                                    marginTop: 10,
                                    color: 'black',
                                }} placeholder={'Enter Country'} placeholderTextColor={'#B8BCCA'}></TextInput>
                            {countryerr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{countryerr}</Text>}
                            <TextInput onFocus={() => setActive2(true)} onBlur={() => {
                                setActive2(false)

                                if (!region) {
                                    setRegionErr('Please enter City / State / Region.')
                                }
                                else {
                                    setRegionErr('')
                                }

                            }}

                                value={region?.replace(/  +/g, " ")}
                                // onChangeText={() => onChangeText()}

                                onChangeText={(text) => {

                                    if (OutsideLocationTextRegex.test(text) === false) {
                                        setRegionErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
                                    }
                                    else {
                                        setRegion(text.trimStart())
                                        setRegionErr('')
                                    }
                                    // EmailHandler(text)
                                }}

                                underlineColorAndroid='transparent' style={{
                                    borderColor: active2 ? '#395987' : '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    height: 45,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 15,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 14, lineHeight: 21,
                                    marginTop: 10,
                                    color: 'black',
                                }} placeholder={'Enter City/state/Region'} placeholderTextColor={'#B8BCCA'}></TextInput>
                            {regionerr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{regionerr}</Text>}

                        </> :
                        <>
                            <Pressable style={{
                                borderColor: '#B8BCCA50',
                                borderWidth: 1,
                                borderRadius: 6,
                                height: 45,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 15,
                                fontFamily: 'Poppins-Regular',
                                fontSize: 14, lineHeight: 21,
                                marginTop: 10,
                                color: 'black',
                            }} onPress={() => setLocationModal(true)}>
                                <Text style={[styles.selectText, { color: cityLocation?.city ? 'black' : '#B8BCCA' }]}>{cityLocation?.cityWithState ? cityLocation?.cityWithState : cityLocation?.city ? cityLocation?.city : "Select City"}</Text>
                            </Pressable>
                            {cityErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{cityErr}</Text>}
                            {showState &&

                                <Pressable style={{
                                    borderColor: '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    height: 45,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 15,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 14, lineHeight: 21,
                                    marginTop: 10,
                                    color: 'black',
                                }} onPress={() => setStateModal(true)}>
                                    <Text style={[styles.selectText, { color: states?.state ? 'black' : '#B8BCCA' }]}>{states?.state ? states?.state : "Select State"}</Text>
                                </Pressable>
                            }{stateErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{stateErr}</Text>}
                        </>}
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>Gender</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 18 }}>{
                            allgender?.map((item, i) => (<Pressable onPress={() => setGender(item)} key={i} style={[gender == item ? styles.chipsSelected : styles.chipsNotSelected]}>
                                <Text style={[gender == item ? styles.chipsSelectedText : styles.chipsNotSelectedText]}>{item}</Text>
                            </Pressable>))}</View>
                    </View>
                    {gendererr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{gendererr}</Text>}

                    <View style={styles.resumeview}>
                        <Text style={styles.resumeheadline}>Upload resume <Text style={styles.optionaltextview}>(Optional) </Text> </Text>


                        {
                            (resumeChecked && !resumeName) ? <Text>''</Text> :
                                resumeLoad ? <TouchableOpacity
                                    style={styles.button}
                                >
                                    <Text style={styles.title}><ActivityIndicator color="blue" size="small" /></Text>
                                </TouchableOpacity> :
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleDocumentSelection}
                                    >
                                        <Text style={styles.title}>Upload Resume</Text>
                                    </TouchableOpacity>
                        }
                        {resumeName && <Text style={{ color: '#395987', alignSelf: 'center', fontSize: 14, fontFamily: "Poppins-Regular" }}>{resumeName}</Text>}
                        <Text style={styles.sizeTextView}>docx, pdf,doc | Max 2 MB</Text>


                    </View>
                    {resumeErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{resumeErr}</Text>}
                </View>
                <View style={styles.bottombar}>
                    <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 18 }}>
                        <View style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={styles.bottomBarText}>Create Profile & Search Jobs in 2 minutes</Text>

                        </View>
                        {createProfileLoader === false ? <TouchableOpacity onPress={() => {

                            handleCreateProfile()

                        }} style={styles.buttonView}><Text style={styles.buttonTextView}>Continue</Text></TouchableOpacity> :
                            <TouchableOpacity style={styles.buttonView}><ActivityIndicator color={'white'} size={24} /></TouchableOpacity>}
                    </View>
                </View>
            </ScrollView>
            {
                locationModal && <SingleItemBottomSheet setSearchResult={setAllCityLocation} setSelectItem={cityLocationSelectHandler} title={'Location'} modalShow={locationModal} setModalShow={setLocationModal} dropDownData={allCityLocation} onSearch={SearchLocation} isApiSearch={true} addHandler={citylocationFreeText} />
            }
            {
                stateModal && <SingleItemBottomSheet isSearch={false} setSearchResult={setAllstates} setSelectItem={stateSelectHandler} title={'States'} modalShow={stateModal} setModalShow={setStateModal} dropDownData={allstates} />
            }
        </SafeAreaView>

    );
};

export default CreateProfile;

const styles = StyleSheet.create({
    labelText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#6F7482',
        // lineHeight: 18,
        marginLeft: 5
    },
    inputView: {
        marginTop: 20
    },
    locationLabelView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    currentlyWorkingText: {
        color: 'black',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#B8BCCA'
    },
    AnywhereView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    buttonTextView: {
        color: 'white', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-Medium',
    },
    selectText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'gray'
    },
    buttonView: {
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
    bottomBarText:
    {
        fontSize: 12, lineHeight: 24, fontFamily: "Poppins-Regular", color: '#6F7482', paddingLeft: wp('3.5%'), textAlign: 'center'
    },
    header: {
        flex: 1, paddingHorizontal: wp('6%'), paddingTop: hp('3%')
    },
    bottombar: {
        borderWidth: 1, borderColor: '#E4EEF5', flex: 2, marginTop: hp('6%')
    },
    resumeheadline: {
        fontSize: 12, fontFamily: "Poppins-SemiBold", color: '#6F7482', textAlign: 'center', marginTop: 10, lineHeight: 18
    },
    sizeTextView: {
        color: '#6F7482', alignSelf: 'center', fontSize: 10, fontFamily: "Poppins-Light"
    },
    underlineStyleHighLighted: {
        borderColor: "#B8BCCA50",
    },
    optionaltextview: {
        fontSize: 12, fontFamily: "Poppins-SemiBold", color: '#B8BCCA', textAlign: 'center', marginTop: 10, lineHeight: 15
    },
    resumeview: {
        paddingVertical: 10, borderColor: '#B8BCCA50', height: hp('16%'), borderWidth: 1, borderRadius: 7
    },
    inputView: {
        marginTop: 20
    },
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-SemiBold',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5,
        marginBottom: 8
    },
    button: {
        flexDirection: "row",
        borderRadius: 25,
        width: 134,
        height: 36,
        // height: 50,
        borderWidth: 1,
        borderColor: "#F2B45A",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: '#F2B45A20',
        alignSelf: 'center',
        marginTop: 15
    },
    title: {
        fontSize: 12,
        color: '#F2B45A',
        color: "#F2B45A",
        marginRight: 5,
        fontFamily: 'Poppins-Medium',
    },
    chipsNotSelectedText: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        // fontWeight: '400',
        fontSize: 12
    },
    chipsSelectedText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        // fontWeight: '400',
        fontSize: 12
    },
    chipsNotSelected: {
        height: 25, width: 60, borderRadius: 12, marginRight: 12, alignItems: 'center', justifyContent: 'center',
        borderColor: '#B8BCCA50', backgroundColor: 'white', borderWidth: 1
    },
    chipsSelected: {
        height: 25, width: 60, marginRight: 12, borderRadius: 12, justifyContent: 'center', backgroundColor: '#395987', borderWidth: 1, alignItems: 'center'
    },
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Medium',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    inputView: {
        marginTop: 18
    },
});