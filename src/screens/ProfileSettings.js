import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Switch, Modal, Pressable, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useReducer, useState, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { DataContext } from '../Context/GlobalState';
import TextBoxes from '../components/textBoxes/textBoxes';
import { showMessage } from "react-native-flash-message";
import { gqlOpenQuery, gqlquery } from '../api/doctorFlow';
import DatePicker from 'react-native-date-picker';
import SingleItemBottomSheet from '../components/singleItemBottomSheet/singleItemBottomSheet';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { getLanguageList } from "../Redux_Mine/Redux_Slices/CompleteProfileTabSlice"
import BottomCoupleButton from "../components/BottomCoupleButton/BottomCoupleButton"
import { getProfileData } from "../Redux_Mine/Redux_Slices/ProfileSlice";
import { getPersonalDetails, } from '../Redux_Mine/Redux_Slices/CompleteProfileTabSlice'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { current } from '@reduxjs/toolkit';
import ErrorText from '../components/ErrorText/ErrorText';

const IsWorkStatusData = [
    'Fresher', 'Experienced'
]

const GenderData = ["Male", "Female", "Other"];
const MaritalData = ['Married', 'Single']
const languageData = [
    {
        hmID: "English",
        name: "English",
    },
    {
        hmID: "Hindi",
        name: "Hindi",
    },
    {
        hmID: "Tamil",
        name: "Tamil",
    },
    {
        hmID: "Punjabi",
        name: "Punjabi",
    },
    {
        hmID: "Telugu",
        name: "Telugu",
    },
    {
        hmID: "Marathi",
        name: "Marathi",
    },
    {
        hmID: "French",
        name: "French",
    },
    {
        hmID: "Arabic",
        name: "Arabic",
    },
    {
        hmID: "Mandarin",
        name: "Mandarin",
    },
];
const proficiencies = [
    {
        hmID: "Beginner",
        name: "Beginner",
    },
    {
        hmID: "Intermediate",
        name: "Intermediate",
    },
    {
        hmID: "High",
        name: "High",
    },
    {
        hmID: "Expert",
        name: "Expert",
    },
    {
        hmID: "Native",
        name: "Native",
    },
];

// useeffect is remaining to get all details
export default function ProfileSettings() {
    const [state, dispatch] = useContext(DataContext)
    const [editDate, setEditDate] = useState('')
    const [dateErr, setDateErr] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [emailErr, setemailerr] = useState('')
    const [isPersonalDetails, setIsPersonalDetails] = useState(true)
    const [personalInterest, setPersonalInterest] = useState('')
    const [professionalInterest, setProfessionalInterest] = useState('')
    const [professionalInterestErr, setProfessionalInterestErr] = useState('')
    const [personalInterestErr, setPersonalInterestErr] = useState('');
    const [active1, setActive1] = useState(false);
    const [newtoggle, setnewtoggle] = useState(false);
    const [allCityLocation, setAllCityLocation] = useState([])
    const navigation = useNavigation()
    const [locationModal, setLocationModal] = useState(false)
    const [presentAddress, setPresentAddress] = useState('')
    const [permanentAddress, setPermanentAddress] = useState('')
    const [jobtoggle, setjobtoggle] = useState(false);
    const [active2, setActive2] = useState(false);
    const [previousexp, setPreviousexp] = useState(false)
    const [gender, setGender] = useState("");
    const [active3, setActive3] = useState(false)
    const [bothChecked, setBothChecked] = useState(false)
    const [genderErr, setGenderErr] = useState("")
    const [name, setName] = useState("");
    const [cityErr, setCityErr] = useState("")
    const [locationChecked, setLocationChecked] = useState(false)
    const [loader, setLoader] = useState(false)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [maritalStatus, setMaritalStatus] = useState("");
    const [maritalStatusErr, setMaritalStatusErr] = useState('');
    const [maritalModal, setMaritalModal] = useState(false)
    const [nameErr, setNameErr] = useState("");
    const [cityLocation, setCityLocation] = useState({})
    const [stateErr, setStateErr] = useState('');
    const [showState, setShowState] = useState(false);
    const [isLanguage, setIsLanguage] = useState(false)
    const [states, setState] = useState('');
    const [languages, setLanguages] = useState([])
    const dispatchAction = useDispatch();
    const [workStatus, setWorkStatus] = useState('')
    const toggleSwitch1 = () => setjobtoggle(previousState => !previousState);
    const toggleSwitch2 = () => setnewtoggle(previousState => !previousState);
    const [gendermodal, setGenderModal] = useState(false)
    const isFocused = useIsFocused();
    const [flag, setFlag] = useState(false);
    const [proficiencince, setProficience] = useState('');
    const [read, setRead] = useState(false);
    const [write, setWrite] = useState(false);
    const [speak, setSpeak] = useState(false);
    const [errors, setErrors] = useState("");
    const dropdownlanguage = useRef()
    const [language, setLanguage] = useState('');
    const [currentState, setCurrentState] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [languageLoader, setLanguageLodaer] = useState(false);
    const [updateload, setUpdateload] = useState(false);
    const [currentitem, setCurrentItem] = useState();
    let rexDescription = /^[a-zA-Z0-9\s.,;]*$/;
    const today = new Date()

    useEffect(() => {
        dispatchAction(getLanguageList())
        // setCurrentState(PersonalDetailsData);
    }, [isPersonalDetails])

    useEffect(() => {
        dispatchAction(getPersonalDetails())
        dispatchAction(getProfileData())
    }, [isFocused])

    const lagnuageKnown = useSelector((state) => state.profiletabstore.languageList);
    const PersonalDetailsData = useSelector((state) => state.profiletabstore.personalDetails);
    const profile = useSelector((state) => state.profilestore.profileData);
    
    useEffect(() => {
        setEditDate(PersonalDetailsData?.dateofBirth || "");
        // setDateOfBirth(PersonalDetailsData?.dateofBirth || "");
        setMaritalStatus(PersonalDetailsData?.maritalStatus || "")
        // setLinkedInUrl(profile?.linkedInURL || "")
        // setDateOfBirthdumy(PersonalDetailsData?.dateofBirth || "")
        setGender(PersonalDetailsData?.gender);
        // if (!PersonalDetailsData?.dateofBirth) {
        //     setCurrentItem(false)
        // }
        // setLocationChecked(profile?.isOutsideIndia)
        // if (profile?.isOutsideIndia == true) {
        //     setRegion(profile?.getLocationOutsideIndia?.area || "")
        //     setCountry(profile?.getLocationOutsideIndia?.country || "")
        // }
        setPresentAddress(PersonalDetailsData?.permanentAddressL1)
        setName(profile?.name || '');
        // setPhone(profile?.phone || '')
        if (!profile?.isOutsideIndia) {
            setCityLocation({ cityWithState: profile?.cityWithState })
        }
        setnewtoggle(profile?.newsletter)
        setjobtoggle(profile?.activelySearching)
        setWorkStatus(profile?.workStatus)
        // setIsphonever(profile?.phoneVerified);
        // setIsemailver(profile?.emailVerified)
        // setEmail(profile?.email || '')
        // console.log("currne", currentitem)
        // profileQuery()

        if (PersonalDetailsData?.presentAddressL1 && PersonalDetailsData?.presentAddressL1 !== 'undefined') {
            setPresentAddress(PersonalDetailsData?.presentAddressL1?.replace(/<br \/>/g, "\n"))
        }
        if (PersonalDetailsData?.presentAddressL2 && PersonalDetailsData?.presentAddressL2 !== 'undefined') {
            setPresentAddress(PersonalDetailsData?.presentAddressL2?.replace(/<br \/>/g, "\n"))
        }
        if (PersonalDetailsData?.presentZip !== 0) {
            // setPresentZip(PersonalDetailsData?.presentZip)
        }
        if (PersonalDetailsData?.permanentZip !== 0) {
            // setPermanentZip(PersonalDetailsData?.permanentZip)
        }
        // setPresentCity(PersonalDetailsData?.presentCity)
        // setPresentState(PersonalDetailsData?.presentState)
        // setPresentCountry(PersonalDetailsData?.presentCountry)

        setPermanentAddress(PersonalDetailsData?.permanentAddressL1?.replace(/<br \/>/g, "\n"))
        setPermanentAddress(PersonalDetailsData?.permanentAddressL1?.replace(/<br \/>/g, "\n"))
        // setPermanentCity({ city: PersonalDetailsData?.permanentCity, lmID: PersonalDetailsData?.permanentLocationID })
        // setPermanentState(PersonalDetailsData?.permanentState)
        // setPermanentCountry(PersonalDetailsData?.permanentCountry)

        setPersonalInterest(PersonalDetailsData?.personalInterest?.replace(/<br \/>/g, "\n"))
        setProfessionalInterest(PersonalDetailsData?.professionalInterest?.replace(/<br \/>/g, "\n"))

        // if (PersonalDetailsData?.IsOtherPermanentCity) {
        //     setPermanentCity({ city: 'Other' })
        //     permanentCity.city = 'Other'
        //     setOtherPermanentCity(PersonalDetailsData?.permanentCity)
        // }
        // if (PersonalDetailsData?.IsOtherPresentCity) {

        //     setPresentCity('Other')
        //     setOtherPresentCity(PersonalDetailsData?.presentCity)
        // }

        // if(PersonalDetailsData?.presentAddressL1){
        //     setBothChecked(PersonalDetailsData?.bothAddressSame)
        // }

    }, [profile?.name, profile?.phoneVerified, profile?.emailVerified, isFocused]);


    useEffect(() => {
        if (lagnuageKnown?.length > 0) {
            const filterData = languageData.filter((lang) => !lagnuageKnown.find((item) => lang.name == item.language));
            setLanguages(filterData)
        }
        else {
            setLanguages(languageData)
        }

    }, [lagnuageKnown?.length])


    const HandlerName = async (text) => {
        const result = text.replace(/[^a-z ]/gi, '');
        if (resText.test(text) === false || text.trim().length === 0) {
            setNameErr('Please write proper name without special character and number and space and of 35 characters');
            // isValid = false
            console.log('asche name2', nameErr)
        }
        else {
            setNameErr('')
        }
        setName(text)
        // setNameErr('')
    }

    const cityLocationSelectHandler = (item) => {
        setCityLocation(item)
        setLocationModal(false)
        setCityErr('');
        setShowState(false);
    }


    const validate = () => {
        // Keyboard.dismiss()
        setLoader(true)
        let isValid = true
        if (resText.test(name) === false || name.trim().length === 0) {
            setNameErr('Please write proper name without special character and number and space and of 35 characters');
            setLoader(false)
            isValid = false
            console.log('asche name2')
        }
        if (!name || name == " ") {
            setLoader(false)
            setNameErr('Please write proper name')
            isValid = false
            console.log('asche name')
        }
        if (!editDate) {

            if ((new Date(dateOfBirth).toDateString() == new Date().toDateString()) || (today.setDate(today.getDate()) <= new Date(dateOfBirth).getTime())) {
                setDateErr('Please select appropriate birth date')
                isValid = false;
                setLoader(false)
                console.log('dateOfBirth >>>', dateOfBirth)
            }
        }

        if (!locationChecked && !cityLocation) {
            setCityErr('Please select location')
            isValid = false
            setLoader(false)
            console.log('asche location validat')
            // setCreateProfileLoader(false)
        }
        if (maritalStatus.length == 0) {
            setMaritalStatusErr('Please select your marital status')
            isValid = false;
            setLoader(false)
            console.log('maritalStatus')
        }

        if (locationChecked && !region) {
            setRegionErr('Please enter region')
            isValid = false;
            setLoader(false)
            // setCreateProfileLoader(false)
        }
        if (locationChecked && !country) {
            setCountryErr('Please enter country')
            isValid = false;
            setLoader(false)
            // setCreateProfileLoader(false)
        }
        if (linkedInURL != "" && (resTextLinkedIn.test(linkedInURL) == false)) {
            setLinkedInUrlErr("Provide an appropriate url for linked in. character limit is not more than 75.")
            isValid = false;
            setLoader(false)
        }
        if (OutsideLocationTextRegex.test(country) === false && country && locationChecked) {
            setCountryErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
            isValid = false;
            setLoader(false)
            return
        }
        if (OutsideLocationTextRegex.test(region) === false && region && locationChecked) {
            setRegionErr('This field accepts a maximum of 25 characters with only Alphabets, numbers and comma.')
            isValid = false;
            setLoader(false)
            return
        }
        // if (!gender) {
        //   setGenderErr('Please select your gender')
        //   isValid = false;
        //   console.log('gender')
        // }
        // if (!permanentAddressL1) {
        //   setPermanentAddressL1Err('Please write your address')
        //   isValid = false;
        //   console.log('permanentAddressL1')
        // }


        if (isValid) {
            HandleBasicDetails()

        }
        else {
            return
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
    }, [locationModal])

    const citylocationFreeText = (text) => {
        setCityLocation({ city: text, cityWithState: "", lmID: 0 });
        setCityErr('')
        setShowState(true);
        setLocationModal(false)
    }


    const HandleBasicDetailsInitial = async () => {
        setLoader(true)
        console.log('entering in initial >>>>')
        let isValid = true
        // if (resText.test(name) === false || name.trim().length === 0) {
        //     setNameErr('Please write proper name without special character and number and space')
        //     isValid = false
        //     console.log('asche name2')
        // }
        // if (!name || name == " ") {
        //     setNameErr('Please write proper name')
        //     isValid = false
        //     console.log('asche name')
        // }
        // if (maritalStatus.length == 0) {
        //     setMaritalStatusErr('Please select your marital status')
        //     isValid = false;
        //     console.log('maritalStatus')
        // }
        // if (locationChecked && !region) {
        //     setRegionErr('Please enter region')
        //     isValid = false
        //     setLoader(false)
        //     // setCreateProfileLoader(false)
        // }
        // if (locationChecked && !country) {
        //     setCountryErr('Please enter country')
        //     isValid = false
        //     setLoader(false)
        //     // setCreateProfileLoader(false)
        // }
        // if (dateOfBirth == new Date()) {
        //     setDateErr('Please select your date of birth')
        //     isValid = false;
        //     return
        //     console.log('dateOfBirth >>>', dateOfBirth)
        // }
        // if ((new Date(dateOfBirth).toDateString() == new Date().toDateString()) || (today.setDate(today.getDate()) <= new Date(dateOfBirth).getTime())) {
        //     setDateErr('Please select appropriate birth date')
        //     isValid = false;
        //     console.log('dateOfBirth >>>', dateOfBirth)
        // }
        // if (linkedInURL != "" && (resTextLinkedIn.test(linkedInURL) == false)) {
        //     setLinkedInUrlErr("Provide an appropriate url for linked in. character limit is not more than 75.")
        //     isValid = false
        // }
        // // if (!gender) {
        // //   setGenderErr('Please select your gender')
        // //   isValid = false;
        // //   console.log('gender')
        // // }
        // if (!permanentAddressL1) {
        //     setPermanentAddressL1Err('Please write your address')
        //     isValid = false;
        //     console.log('permanentAddressL1')
        // }
        // if (!locationChecked && !cityLocation) {
        //     setCityErr('Please select location')
        //     isValid = false
        //     console.log('asche location up')
        //     setLoader(false)
        // }
        // if (permanentAddressL1.length < 3 || resText.test(permanentAddressL1) === false) {
        //     setPermanentAddressL1Err('This field accept only Alphabets with minimum 3 characters.')
        //     isValid = false;
        //     console.log('permanentAddressL1')
        // }
        // if (isValid == false) {
        //     return
        // }

        if (isValid) {
            const QUERY_POSTPROFILES = {
                query: `mutation MyMutation {
                updateBasicDetails(
                    name: "${name}", 
                    locationID: ${locationChecked == false ? cityLocation?.lmID ? Number(cityLocation?.lmID) : profile?.locationID : 0}, 
                    workStatus: "${workStatus || profile?.workStatus}",
                    activelySearching: ${jobtoggle}, 
                    newsletter: ${newtoggle},
                    exp: ${profile?.experienceYears ? profile?.experienceYears : 0},
                    expMonths: ${profile?.experienceMonths ? profile?.experienceMonths : 0},
                    salary: ${profile?.salary ? profile?.salary : 0},
                    isOutsideIndia: ${false}
                    outsideArea: "${""}", 
                    outsideCountry: "${""}",
                    otherCity: "", otherState: "",
                    linkedInURL:"${""}"
                    ) {
                      activelySearching
                      cityWithState
                      email
                      emailVerified
                      exp
                      expMonths
                      getLocationOutsideIndia {
                      area
                      country
                      loiID
                      }
                      isCurrentlyStduying
                      isOutsideIndia
                      locationID
                      name
                      newsletter
                      phone
                      phoneVerified
                      profilePicURL
                      salary
                      salaryThousands
                      workStatus
                }
              }`,

                variables: null,
                operationName: "MyMutation",
            };
            const QUERY_ADD_PERSONAL_DETAILS = {
                query: `mutation MyMutation {
            addPersonalDetails(
                dateofBirth: "${new Date(dateOfBirth).toDateString() == new Date().toDateString() ? editDate : new Date(dateOfBirth).toISOString().slice(0, 10)}",
                differentlyAbled: ${Boolean(Number(PersonalDetailsData?.differentlyAbled))},
                gender: "${gender || PersonalDetailsData?.gender}",
                maritalStatus: "${maritalStatus ? maritalStatus : PersonalDetailsData?.maritalStatus ? PersonalDetailsData?.maritalStatus : "" || ""}",
                bothAddressSame: ${Boolean(PersonalDetailsData?.bothAddressSame)},
                permanentAddressL1: "${permanentAddress ? permanentAddress : PersonalDetailsData?.permanentAddressL1 || ""}", 
                permanentAddressL2: "${PersonalDetailsData?.permanentAddressL2 || ""}",
                permanentLocationID: ${PersonalDetailsData?.permanentLocationID || 0}, 
                permanentZip: ${PersonalDetailsData?.permanentZip || 0},
                personalInterest: "${personalInterest?.replace(/\n/g, "<br />") || ""}",
                presentAddressL1: "${presentAddress ? presentAddress : PersonalDetailsData?.presentAddressL1 || ""}", 
                presentAddressL2: "${PersonalDetailsData?.presentAddressL2 || ""}", 
                presentLocationID: ${PersonalDetailsData?.presentLocationID || 0}, 
                presentZip: ${PersonalDetailsData?.presentZip || 0},
                professionalInterest: "${professionalInterest?.replace(/\n/g, "<br />") || ""}",
                spouseName: "${PersonalDetailsData?.spouseName || ""}",
                spouseOccupation: "${PersonalDetailsData?.spouseOccupation || ""}",
                otherPresentCity: "${PersonalDetailsData?.IsOtherPresentCity || ""}", 
                otherPermanentCity: "${PersonalDetailsData?.IsOtherPermanentCity || ""}",
                presentState: "${PersonalDetailsData?.presentState || ""}", 
                permanentState: "${PersonalDetailsData?.permanentState || ""}", ) {
              spouseOccupation
              spouseName
              professionalInterest
              presentZip
              presentState
              presentLocationID
              presentCountry
              presentCity
              presentAddressL2
              presentAddressL1
              personalInterest
              permanentZip
              permanentState
              permanentLocationID
              IsOtherPermanentCity
              IsOtherPresentCity
              permanentCountry
              permanentCity
              permanentAddressL2
              permanentAddressL1
              pdID
              maritalStatus
              gender
              differentlyAbled
              dateofBirth
              bothAddressSame
            }
          }`,
                variables: null,
                operationName: "MyMutation",
            };

            gqlquery(QUERY_ADD_PERSONAL_DETAILS, null)
                .then((res) => res.json())
                .then((datas) => {
                    console.log("ADD_PERSONAL_DETAILS", datas);
                    if (datas?.data) {
                        dispatchAction(getPersonalDetails())

                        setLoading(false);

                        gqlquery(QUERY_POSTPROFILES, null)
                            .then((res) => res.json())
                            .then((datas) => {
                                console.log('profile updated', datas);
                                setLoader(false)
                                if (datas?.data?.updateBasicDetails) {
                                    console.log("its is dome", datas?.data?.updateBasicDetails)
                                    dispatchAction(getProfileData())
                                    dispatchAction(getPersonalDetails())
                                    setDateErr('')
                                    setNameErr('')
                                    setEditDate(new Date(dateOfBirth).toISOString().slice(0, 10))
                                    setGenderErr('')
                                    // setPermanentAddressL1Err('')
                                    // setCityLocationErr('')
                                    showMessage({
                                        message: "Account Info added",
                                        type: "success",
                                        hideStatusBar: true,
                                        duration: 3000
                                    })
                                } else {
                                    console.log("error");
                                    setLoader(false)
                                }
                            });
                    }
                    else {
                        setLoading(false);
                        showMessage({
                            message: "cann't added details",
                            type: 'danger',
                            autoHide: true,
                            hideStatusBar: true,
                            icon: 'danger'
                        })
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err.message);
                });
        } else {
            setLoading(false)
        }
    }

    const HandleBasicDetails = async () => {
        // console.log("inside Handlebasicdetails")
     
        if (!editDate) {

            if ((new Date(dateOfBirth).toDateString() == new Date().toDateString()) || (today.setDate(today.getDate()) <= new Date(dateOfBirth).getTime())) {
                setDateErr('Please select appropriate birth date')
                isValid = false;
                return
            }
        }
        setLoader(true)
        const QUERY_POSTPROFILES = {
            query: `mutation MyMutation {
                updateBasicDetails(
                    name: "${name}", 
                    locationID: ${locationChecked == false ? cityLocation?.lmID ? Number(cityLocation?.lmID) : profile?.locationID : 0}, 
                    workStatus: "${workStatus || profile?.workStatus}",
                    activelySearching: ${jobtoggle}, 
                    newsletter: ${newtoggle},
                    exp: ${profile?.experienceYears ? profile?.experienceYears : 0},
                    expMonths: ${profile?.experienceMonths ? profile?.experienceMonths : 0},
                    salary: ${profile?.salary ? profile?.salary : 0},
                    isOutsideIndia: ${false}
                    outsideArea: "${""}", 
                    isCurrentlyStduying: ${workStatus === "Experienced" ? true : false},
                    outsideCountry: "${""}",
                    otherCity: "", otherState: "",
                    linkedInURL:"${""}"
                    ){
                        activelySearching
                        cityWithState
                        email
                        emailVerified
                        exp
                        expMonths
                        getLocationOutsideIndia {
                        area
                        country
                        loiID
                      }
                        isCurrentlyStduying
                        isOutsideIndia
                        locationID
                        name
                        newsletter
                        phone
                        phoneVerified
                        profilePicURL
                        salary
                        salaryThousands
                        workStatus
                      }
                    }`,

            variables: null,
            operationName: "MyMutation",
        };

        const QUERY_UPDATE_PERSONAL_DETAILS = {
            query: `mutation MyMutation {
                updatePersonalDetails ( 
                  dateofBirth: "${new Date(dateOfBirth).toDateString() == new Date().toDateString() ? editDate : new Date(dateOfBirth).toISOString().slice(0, 10)}",
                  differentlyAbled: ${Boolean(Number(PersonalDetailsData?.differentlyAbled))},
                  gender: "${gender || PersonalDetailsData?.gender}",
                  maritalStatus: "${maritalStatus ? maritalStatus : PersonalDetailsData?.maritalStatus ? PersonalDetailsData?.maritalStatus : "" || ""}",
                  bothAddressSame: ${Boolean(PersonalDetailsData?.bothAddressSame)},
                  permanentAddressL1: "${permanentAddress ? permanentAddress : PersonalDetailsData?.permanentAddressL1 || ""}", 
                  permanentAddressL2: "${PersonalDetailsData?.permanentAddressL2 || ""}",
                  permanentLocationID: ${PersonalDetailsData?.permanentLocationID || 0}, 
                  permanentZip: ${PersonalDetailsData?.permanentZip || 0},
                  personalInterest: "${personalInterest?.replace(/\n/g, "<br />") || ""}",
                  presentAddressL1: "${presentAddress ? presentAddress : PersonalDetailsData?.presentAddressL1 || ""}", 
                  presentAddressL2: "${PersonalDetailsData?.presentAddressL2 || ""}", 
                  presentLocationID: ${PersonalDetailsData?.presentLocationID || 0}, 
                  presentZip: ${PersonalDetailsData?.presentZip || 0},
                  professionalInterest: "${professionalInterest?.replace(/\n/g, "<br />") || ""}",
                  spouseName: "${PersonalDetailsData?.spouseName || ""}",
                  spouseOccupation: "${PersonalDetailsData?.spouseOccupation || ""}",
                  pdID: ${PersonalDetailsData?.pdID || 0},
                  otherPresentCity: "${PersonalDetailsData?.IsOtherPresentCity || ""}", 
                  otherPermanentCity: "${PersonalDetailsData?.IsOtherPermanentCity || ""}",
                  presentState: "${PersonalDetailsData?.presentState || ""}", 
                  permanentState: "${PersonalDetailsData?.permanentState || ""}", 
                  ) {
                    spouseOccupation
                    spouseName
                    professionalInterest
                    presentZip
                    presentState
                    presentLocationID
                    presentCountry
                    presentCity
                    presentAddressL2
                    presentAddressL1
                    personalInterest
                    permanentZip
                    permanentState
                    permanentLocationID
                    permanentCountry
                    permanentCity
                    permanentAddressL2
                    permanentAddressL1
                    pdID
                    maritalStatus
                    gender
                    differentlyAbled
                    dateofBirth
                    bothAddressSame
                    IsOtherPresentCity
                    IsOtherPermanentCity
                  }
                  }`,
            variables: null,
            operationName: "MyMutation",
        };

        gqlquery(QUERY_UPDATE_PERSONAL_DETAILS, null)
            .then((res) => res.json())
            .then((datas) => {
                console.log("personal Details Query", QUERY_UPDATE_PERSONAL_DETAILS)
                console.log("personal details add data", datas);

                dispatchAction(getPersonalDetails())

                setEditDate(new Date(dateOfBirth).toISOString().slice(0, 10))
                gqlquery(QUERY_POSTPROFILES, null)
                    .then((res) => res.json())
                    .then((datas) => {
                        console.log('profile updated Query', QUERY_POSTPROFILES);
                        setLoader(false)

                        console.log("profile updated", datas)
                        // CheckAddValid();
                        dispatchAction(getProfileData())
                        dispatchAction(getPersonalDetails())

                        // navigation.navigate("Home");
                        // setToggle(!toggle);
                        setDateErr('')
                        setNameErr('')
                        setGenderErr('')
                        // setPermanentAddressL1Err('')
                        // setCityLocationErr('')
                        showMessage({
                            message: "Account Info added",
                            type: "success",
                            hideStatusBar: true,
                            duration: 3000
                        })

                    });
           
            })
            .catch((err) => {
                setLoading(false);
                console.log(err.message);
            });

    };

    const CheckUpdateValid = async () => {
        setLoading(true);
        let isValid = true;
        // if (!professionalInterest && !personalInterest) {
        //     setProfessionalInterestErr('Please write professional interest')
        //     setPersonalInterestErr('Please write personal interest')
        //     isValid = false;
        //     setLoading(false);
        //     console.log('professionalInterest')
        //     return
        // }
        // if (!personalInterest) {
        //     setPersonalInterestErr('Please write personal interest')
        //     isValid = false;
        //     setLoading(false);
        //     console.log('personalInterest')
        // }
        if (rexDescription.test(personalInterest) === false) {
            setPersonalInterestErr("This field only accepts numbers and the alphabet.");
            isValid = false;
            setLoading(false);
            return
        }
        if (rexDescription.test(professionalInterest) === false) {
            setProfessionalInterestErr("This field only accepts numbers and the alphabet.");
            isValid = false;
            setLoading(false);
            return
        }

    };

    const handleUpdateLanguage = (item) => {
        setCurrentState(item)
        setLanguage(item?.language)
        setProficience(item?.proficiency)
        setRead(item?.read)
        setWrite(item?.write)
        setSpeak(item?.speak)
        setModalVisible(true)
        setIsLanguage(!isLanguage)
        setIsPersonalDetails(!isPersonalDetails)
    }

    const handleLanuage = () => {
        setIsLanguage(!isLanguage)
        setIsPersonalDetails(!isPersonalDetails)
    }

    const handleDelete = async (lkID) => {
        console.log("upated", proficiencies)
        const QUERY_DELETE_LANGUAGE_KNOWN = {
            query: `mutation MyMutation {
        deleteLanguagesKnown (
          lknID: "${lkID}"
          ) {
              language
              lknID
              proficiency
              read
              speak
              write
            }
          }
        `,
            variables: null,
            operationName: 'MyMutation',
        }

        gqlquery(QUERY_DELETE_LANGUAGE_KNOWN, null)
            .then((res) => res.json())
            .then((data) => {
                setLanguages(data?.data?.deleteLanguagesKnown)
                setModalVisible(false);
                setCurrentState({})
                setLanguageLodaer(false)
                setModalVisible(false)
                setCurrentState({})
                setLanguage('')
                setProficience('')
                setRead(false)
                handleError('', "proficiency");
                handleError('', "language")
                handleError('', "check")
                setWrite(false)
                setSpeak(false)
                // dispatchAction(strengthUpdateHandler(!strengthUpdate))
                dispatchAction(getLanguageList())
                showMessage({
                    message: "Language Detail Deleted",
                    type: "success",
                    hideStatusBar: true,
                    duration: 3000
                })
                console.log(data)
            })
            .finally((e) => console.log('Successful to Delete Language'))
    }

    const showConfirmDialog = (lkID) => {
        return Alert.alert(
            'Are your sure?',
            'Are you sure you want to delete this language?',
            [
                // The "Yes" button
                {
                    text: 'Yes',
                    onPress: () => {
                        handleDelete(lkID)
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: 'No',
                },
            ],
        )
    }

    const handleError = (error, input) => {
        console.log(input)
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };


    const handleSave = async () => {
        setLanguageLodaer(true)

        let isValid = true;


        if (!language) {
            handleError("Please select your language", "language");
            isValid = false;
            setLanguageLodaer(false)
        }
        if (!read && !write && !speak) {
            handleError("You must select One option", "check");
            isValid = false;
            setLanguageLodaer(false)
            return
        }
        
        if (isValid) {
            const QUERY_ADD_LANGUAGE_KNOWN = {
                query: `mutation MyMutation {
                  addLanguagesKnown(
                    language: "${language}", 
                    proficiency: "${proficiencince ? proficiencince : ""}", 
                    read: ${read}, 
                    speak: ${speak}, 
                    write: ${write}
                    ) {
                        language
                        lknID
                        proficiency
                        read
                        speak
                        write
                      }
                    }
                  `,
                variables: null,
                operationName: "MyMutation",
            };
      
            
            gqlquery(QUERY_ADD_LANGUAGE_KNOWN, null)
                .then((res) => res.json())
                .then((datas) => {
                   
                    setLanguageLodaer(false)
                    if (datas?.data) {
       
                        dispatchAction(getLanguageList())
                        setModalVisible(false)
                        // dispatchAction(strengthUpdateHandler(strengthUpdate + 1))
                        // setMainToggle(!mainToggle);
                        // setToggle(!toggle);
                        setCurrentState({})

                        // setSrengthToggle(true)
                        setCurrentState({})
                        setLanguage('')
                        setProficience('')
                        setRead(false)
                        setWrite(false)
                        setSpeak(false)
                        handleError('', "proficiency");
                        handleError('', "language")
                        handleError('', "check")
                        console.log("done")

                        showMessage({
                            message: "Language Details added",
                            type: "success",
                            hideStatusBar: true,
                            duration: 3000
                        })
                    }
                    else {
                        setModalVisible(false)
                        showMessage({
                            message: "Cann't add Language Details",
                            type: "danger",
                            hideStatusBar: true,
                            autoHide: true,
                            icon: 'danger'
                        })
                        setLanguageLodaer(false)
                    }
                })
                .finally((e) => {
                    setModalVisible(false)
                    console.log("Successful to Update personal details Data");
                    setLanguageLodaer(false);
                }
                );
        }
        else {
            setLanguageLodaer(false)
            // console.log(description, link, title, year.smID, month.hmID);
        }
    };

    const handleUpdate = async () => {
        console.log("upated", proficiencies)
        let isValid = true;
        setUpdateload(true);
        if (!language) {
            handleError("Plase select your language", "language");
            isValid = false;
            setUpdateload(false);
        }
        if (!read && !write && !speak) {
            handleError("You must select One option", "check");
            isValid = false;
            setUpdateload(false);
        }
        if (isValid) {
            const QUERY_UPDATE_LANGUAGE_KNOWN = {
                query: `mutation MyMutation {
            updateLanguagesKnown (
              language: "${language}", 
              lknID: "${currentState?.lknID}", 
              proficiency: "${proficiencince ? proficiencince : ""}", 
              read: ${read}, 
              speak: ${speak}, 
              write: ${write}
              ) {
                  language
                  lknID
                  proficiency
                  read
                  speak
                  write
                }
              }
            `,
                variables: null,
                operationName: "MyMutation",
            };

            gqlquery(QUERY_UPDATE_LANGUAGE_KNOWN, null)
                .then((res) => res.json())
                .then((datas) => {
                    dispatchAction(getLanguageList())
                    console.log(datas);
                    // setMainToggle(!mainToggle);
                    setUpdateload(false);
                    setCurrentState({})
                    setLanguage('')
                    setProficience('')
                    setRead(false)
                    setWrite(false)
                    setSpeak(false)
                    handleError('', "proficiency");
                    handleError('', "language")
                    handleError('', "check")
                    // setToggle(!toggle);
                    setModalVisible(false)
                    showMessage({
                        message: "Language Details Update",
                        type: "success",
                        hideStatusBar: true,

                    })
                })
                .finally((e) => console.log("Successful to Update Language"))
        }
        else {
            setUpdateload(false)
            // console.log(description, link, title, year.smID, month.hmID);
        }
    };

    const handleCancel = () => {
        setLanguageLodaer(false)
        setModalVisible(false)
        setCurrentState({})
        setLanguage('')
        setProficience('')
        setRead(false)
        handleError('', "proficiency");
        handleError('', "language")
        handleError('', "check")
        setWrite(false)
        setSpeak(false)

    };
// console.log('personal data >>>>', PersonalDetailsData)
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.BottomSheetView}>
                <View style={styles.emptyView}></View>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headerTitle}>Profile Settings</Text>

                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <TextBoxes title='Full Name' placeHolder="Enter Full Name" extra={false} error={nameErr}
                        onChangeText={(text) => {
                            // if (text.length == 1) {
                            //     HandlerName(text)
                            // }
                            // else {
                            //     HandlerName(text)
                            // }
                            setName(text)
                        }}
                        value={name.replace(/  +/g, " ")}
                    />
                    <View style={{ marginTop: 18 }}>
                        <Text style={styles.labelText}>Location</Text>
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
                            <Text style={[styles.selectText, { color: (cityLocation?.cityWithState || cityLocation?.city) ? 'black' : '#B8BCCA' }]}>{cityLocation?.cityWithState ? cityLocation?.cityWithState : cityLocation?.city ? cityLocation?.city : "Select Location"}</Text>
                        </Pressable></View>

                    <TouchableOpacity style={{ marginTop: 18 }} onPress={() => setShow(true)}>
                        <Text style={styles.labelText}>Date Of Birth</Text>
                        <DatePicker
                            
                            
                            modal
                            open={show}
                            date={dateOfBirth}
                            maximumDate={new Date()}
                            onConfirm={(date) => {
                                setShow(false)
                                setDateOfBirth(date)
                                if (dateOfBirth != new Date()) {
                                    setDateErr('')
                                }
                            }}
                            onCancel={() => {
                                setShow(false)
                            }}
                            mode="date"
                            title="Select Your Birth Date"
                        />
                        <TextInput
                            // autoCorrect={false}
                            autoCorrect={false}
                            value={new Date(dateOfBirth)?.toDateString() == new Date().toDateString() ? '' : `${String(new Date(dateOfBirth).getDate()).length == 1 ? '0' : ''}${new Date(dateOfBirth).getDate()}-${new Date(dateOfBirth).getMonth() + 1 <= 9 ? '0' : ''}${new Date(dateOfBirth).getMonth() + 1}-${new Date(dateOfBirth).getFullYear()}`}
                            placeholder={editDate ? `${String(new Date(editDate).getDate()).length == 1 ? '0' : ''}${new Date(editDate).getDate()}-${new Date(editDate).getMonth() + 1 <= 9 ? '0' : ''}${new Date(editDate).getMonth() + 1}-${new Date(editDate).getFullYear()}` : "DD-MM-YYYY"}
                            placeholderTextColor={editDate ? 'black' : 'gray'}
                            autoCapitalize={"words"}
                            // defaultValue={dateOfBirth}
                            editable={false}
                            onFocus={() => setActive3(true)} onBlur={() => setActive3(false)}
                            style={{
                                borderColor: active3 ? '#395987' : '#B8BCCA50',
                                borderWidth: 1,
                                borderRadius: 6,
                                height: 40,
                                // display: 'flex',
                                // flexDirection: 'row',
                                // alignItems: 'center',
                                paddingLeft: 15,
                                fontFamily: 'Poppins-Regular',
                                fontSize: 13.5, lineHeight: 21,
                                marginTop: 10,
                                color: 'black',
                                textAlignVertical: 'center',
                                alignContent: 'center'
                            }}
                        />
                    </TouchableOpacity>
                    {dateErr && <ErrorText error={dateErr} />}
                    <View style={{ marginTop: 18 }}>
                        <Text style={styles.labelText}>Gender</Text>
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
                        }} onPress={() => setGenderModal(true)}>
                            <Text style={[styles.selectText, { color: gender ? 'black' : '#B8BCCA' }]}>{gender ? gender : "Select Gender"}</Text>
                        </Pressable></View>

                    <View style={{ marginTop: 18 }}>
                        <Text style={styles.labelText}>Marital Status</Text>
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
                        }} onPress={() => setMaritalModal(true)}>
                            <Text style={[styles.selectText, { color: maritalStatus ? 'black' : '#B8BCCA' }]}>{maritalStatus ? maritalStatus : "Select Marital Status"}</Text>
                        </Pressable></View>



                    <TextBoxes title='Address' placeHolder="Enter Address" extra={false} error={emailErr}
                        onChangeText={(text) => {
                            setPresentAddress(text)
                        }}
                        value={presentAddress}
                    />
                    <TextBoxes title='Permanent Address' placeHolder="Select Address" extra={false} error={emailErr}
                        onChangeText={(text) => {
                            setPermanentAddress(text)
                        }}
                        value={permanentAddress}
                    />
                    <View style={{ marginTop: 18 }}>
                        <Text style={styles.labelText}>Professional Interest</Text>
                        <ScrollView>
                            <TextInput
                                style={{
                                    height: 120,
                                    justifyContent: "flex-start",
                                    textAlignVertical: "top",
                                    borderColor: active1 ? '#395987' : '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    paddingLeft: 15,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 13.5, lineHeight: 21,
                                    marginTop: 10,
                                    color: 'black',

                                    alignContent: 'center'
                                }}
                                onFocus={() => setActive1(true)} onBlur={() => setActive1(false)}
                                placeholder="Enter Details"
                                placeholderTextColor="#BBBCCA"
                                numberOfLines={10}
                                multiline={true}
                                autoGrow={false}
                                onChangeText={(text) => {
                                    if (text.length == 1) {
                                        setProfessionalInterest((text.trim()));
                                        setProfessionalInterestErr('')
                                    }
                                    else {
                                        setProfessionalInterest((text));
                                        setProfessionalInterestErr('')
                                    }
                                }}
                                value={professionalInterest?.replace(/  +/g, " ")}

                            />
                        </ScrollView>

                        {professionalInterestErr && <ErrorText error={professionalInterestErr} />}
                    </View>
                    <View style={{ marginTop: 18 }}>
                        <Text style={styles.labelText}>Personal Interest</Text>
                        <ScrollView>
                            <TextInput
                                style={{
                                    height: 120,
                                    justifyContent: "flex-start",
                                    textAlignVertical: "top",
                                    borderColor: active2 ? '#395987' : '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    paddingLeft: 15,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 13.5, lineHeight: 21,
                                    marginTop: 10,
                                    color: 'black',

                                    alignContent: 'center'
                                }}
                                onFocus={() => setActive2(true)} onBlur={() => setActive2(false)}
                                placeholder="Enter Details"
                                placeholderTextColor="#BBBCCA"
                                numberOfLines={10}
                                multiline={true}
                                autoGrow={false}
                                onChangeText={(text) => {
                                    if (text.length == 1) {
                                        setPersonalInterest((text.trim()));
                                        setPersonalInterestErr('')
                                    }
                                    else {
                                        setPersonalInterest((text));
                                        setPersonalInterestErr('')
                                    }
                                }}
                                value={personalInterest?.replace(/  +/g, " ")}
                            />
                        </ScrollView>

                        {professionalInterestErr && <ErrorText error={professionalInterestErr} />}
                    </View>
                    <View style={{ marginTop: hp('3%'), height: hp('0.2%'), backgroundColor: '#E4EEF5' }}></View>
                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ flex: 1 }}><Text style={{
                            fontSize: 14,
                            // fontWeight: '700',
                            fontFamily: 'Poppins-Medium',
                            color: '#6F7482',
                            lineHeight: 18,
                            marginLeft: 5
                        }}>Languages Known</Text></View>
                        {/* {lagnuageKnown?.length > 0 && languages?.length > 0 ?  */}
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                // style={{backgroundColor:'red'}}
                                onPress={() => { setCurrentState({}); setModalVisible(true) }}
                            ><Text style={{
                                fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: '#395987', textDecorationLine: 'underline'
                            }}>Add Language</Text></TouchableOpacity></View>
                        {/* : <></>} */}



                    </View>
                    {


                        lagnuageKnown?.length > 0 ? (
                            <View style={{

                            }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        // paddingVertical: 15,
                                    }}
                                >
                                    <View style={{ width: wp('93%'), alignContent: 'center' }}>


                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp('72%'), marginTop: 8, paddingLeft: 10 }}>

                                            <Text
                                                style={{ color: 'black', fontSize: 10, lineHeight: 15, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                            >
                                                Language
                                            </Text>

                                            <Text
                                                style={{ color: 'black', fontSize: 10, lineHeight: 15, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                            >
                                                Read
                                            </Text>

                                            <Text
                                                style={{ color: 'black', fontSize: 10, lineHeight: 15, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                            >
                                                Write
                                            </Text>

                                            <Text
                                                style={{ color: 'black', fontSize: 10, lineHeight: 15, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                            >
                                                Speak
                                            </Text>

                                        </View>

                                    </View>

                                </View>
                                {lagnuageKnown?.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginTop: 5,
                                                }}
                                            >
                                                <View style={{ width: wp('93%'), alignContent: 'center' }}>

                                                    {/* <View
                                                        style={{
                                                            flexDirection: 'column',
                                                            // justifyContent: 'space-between',
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 10,
                                                        }}
                                                    > */}

                                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFD', height: hp('4%'), borderRadius: 12, paddingHorizontal: 10, }}>
                                                        {/* </View style={styles.detailsView}> */}
                                                        <Text style={{ color: 'black', color: 'black', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", marginVertical: 5 }}>
                                                            {item?.language}
                                                        </Text>

                                                        <Text
                                                            style={{ color: '#979797', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", marginVertical: 5, textAlign: 'center' }}
                                                        >
                                                            {item.read ? 'Yes' : 'No'}
                                                        </Text>

                                                        <Text
                                                            style={{ color: '#979797', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                                        >
                                                            {item.write ? 'Yes' : 'No'}
                                                        </Text>

                                                        <Text
                                                            style={{ color: '#979797', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", marginVertical: 5 }}
                                                        >
                                                            {item.speak ? 'Yes' : 'No'}
                                                        </Text>
                                                        {/* </View> */}

                                                        <TouchableOpacity
                                                            style={{ marginBottom: 12 }}
                                                            onPress={() => handleUpdateLanguage(item)}
                                                        >
                                                            <Ionicons
                                                                name="pencil"
                                                                size={20}
                                                                color="#395987"
                                                            />
                                                        </TouchableOpacity>


                                                    </View>

                                                    {/* </View> */}
                                                </View>

                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        ) : (
                            <></>
                        )

                    }
                    <View style={{ marginTop: hp('3%'), height: hp('0.2%'), backgroundColor: '#E4EEF5' }}></View>
                    <View style={{ marginVertical: 18 }}>
                        <Text style={styles.labelText}>Work Status</Text>
                        <View style={styles.qualificationChipView}>
                            {
                                IsWorkStatusData?.map((item, i) => (
                                    <Pressable onPress={() => setWorkStatus(item)} key={i} style={[workStatus == item ? styles.chipsSelected : styles.chipsNotSelected]}>
                                        <Text style={[workStatus == item ? styles.chipsSelectedText : styles.chipsNotSelectedText]}>{item}</Text>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: wp('90%'), marginVertical: 8, paddingLeft: 3 }}>
                        <TouchableOpacity onPress={() => setPreviousexp(!previousexp)}>
                            <Ionicons name={previousexp ? 'checkbox' : 'checkbox-outline'} color={previousexp ? '#395987' : '#6F7482'} size={28} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Regular", color: 'black', textAlignVertical: 'center', paddingLeft: 5
                            }}
                        >
                            I have previous work experience
                        </Text>

                    </View>

                    <View style={{ width: wp('90%'), marginBottom: 15, alignSelf: 'center', borderRadius: 12, backgroundColor: '#FAFAFD', height: hp('8%'), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp('3%') }}>
                        <Text
                            style={{
                                fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Medium", color: 'black'
                            }}
                        >
                            Actively searching for job
                        </Text>

                        <Switch
                            trackColor={{ false: "#B8BCCA", true: "#395987" }}
                            thumbColor="#FFFFFF"
                            onValueChange={toggleSwitch1}
                            value={jobtoggle}
                        />

                    </View>
                    <View style={{ width: wp('90%'), marginBottom: hp('2%'), alignSelf: 'center', borderRadius: 12, backgroundColor: '#FAFAFD', height: hp('8%'), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp('3%') }}>
                        <Text
                            style={{
                                fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Medium", color: 'black'
                            }}
                        >
                            Subscribe to our newsletter
                        </Text>
                        <Switch
                            trackColor={{ false: "#B8BCCA", true: "#395987" }}
                            thumbColor="#FFFFFF"
                            onValueChange={toggleSwitch2}
                            value={newtoggle}
                        />
                    </View>
                </View>

            </View>
            {
                gendermodal && <SingleItemBottomSheet setSelectItem={setGender} title={'Select Gender'} modalShow={gendermodal} setModalShow={setGenderModal} dropDownData={GenderData} isApiSearch={false} isSearch={false} />
            }
            {
                maritalModal && <SingleItemBottomSheet setSelectItem={setMaritalStatus} title={'Select Marital Status'} modalShow={maritalModal} setModalShow={setMaritalModal} dropDownData={MaritalData} isApiSearch={false} isSearch={false} />
            }
            {
                locationModal && <SingleItemBottomSheet setSearchResult={setAllCityLocation} setSelectItem={cityLocationSelectHandler} title={'Select Location'} modalShow={locationModal} setModalShow={setLocationModal} dropDownData={allCityLocation} onSearch={SearchLocation} isApiSearch={true} addHandler={citylocationFreeText} />
            }

            <View style={[styles.btnView]}>
                <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} >
                    <Text style={styles.backBtnText}>Cancel</Text>
                </Pressable>


                {loading ? <TouchableOpacity style={styles.nextBtn}>
                    <Text><ActivityIndicator color="white" size={12} /></Text>
                </TouchableOpacity> :
                    PersonalDetailsData?.gender ?
                        <View>
                            {
                                loader ? <TouchableOpacity
                                    style={styles.nextBtn}
                                >
                                    <Text style={styles.nextBtnText}>Updating.....</Text>
                                </TouchableOpacity> : <TouchableOpacity
                                    style={styles.nextBtn}
                                    onPress={HandleBasicDetails}
                                >
                                    <Text style={styles.nextBtnText}>Update</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        :
                        loader ? <TouchableOpacity
                            style={styles.nextBtn}
                        >
                            <Text style={styles.nextBtnText}>Saving.....</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity
                                style={styles.nextBtn}
                                onPress={HandleBasicDetailsInitial}
                            >
                                <Text style={styles.nextBtnText}>Save</Text>
                            </TouchableOpacity>
                }

            </View>

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)
                }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                    <View style={{
                        // height: hp('35%'),
                        width: wp('90%'),
                        backgroundColor: 'white',
                        borderRadius: 12
                    }}
                    >

                        <View style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1%') }}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                        fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold",

                                        color: "black",

                                    }}
                                >
                                    {Object.keys(currentState)?.length > 0 ? "Edit Language" : "Add Language"}
                                </Text>
                                {Object.keys(currentState)?.length > 0 && <TouchableOpacity
                                    onPress={() => showConfirmDialog(currentState?.lknID)}
                                    style={{ height: hp('4%'), width: wp('8%'), borderRadius: 5, backgroundColor: '#EB575720', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    {loading ? <ActivityIndicator /> : <Ionicons name='trash' size={20} color="#EB5757"></Ionicons>}
                                </TouchableOpacity>}</View>
                            <View
                                style={[

                                    { paddingHorizontal: 15 },
                                ]}
                            >
                                <View style={{}}>
                                    <Text
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 10,
                                            fontSize: 14, lineHeight: 18, fontFamily: "Poppins-Medium",

                                            color: "black",

                                        }}
                                    >
                                        Language
                                    </Text>
                                    <Pressable onPress={() => dropdownlanguage.current.close()}>
                                        <Dropdown
                                            style={{
                                                height: hp('6%'),
                                                borderColor: '#E4EEF5',
                                                // flexDirection: "row",
                                                paddingHorizontal: wp('4%'),
                                                // paddingVertical: hp('0.7%'),
                                                borderWidth: 2,
                                                width: wp('78%'),
                                                marginVertical: hp('1%'),
                                                borderRadius: hp('1%'),
                                                // alignItems: 'center',
                                                // justifyContent: 'space-between'
                                               color: 'black'
                                            }}
                                            searchField={false}
                                            selectedTextStyle={{fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black'}}
                                            itemTextStyle={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black' }}
                                            containerStyle={{ width: wp('77%'), borderRadius: 8, alignSelf: 'center' }}
                                            // onFocus={() => getSpecializationData()}
                                            ref={dropdownlanguage}
                                            placeholderStyle={{
                                                fontSize: 14, fontFamily: 'Poppins-Regular',
                                                paddingLeft: 12,
                                                color: 'black',
                                            }}
                                            // selectedTextStyle={styles.selectedTextStyle}


                                            data={languages}
                                            // disabled={languages?.length === 0 ? true : false}
                                            dropdownPosition='auto'
                                            maxHeight={300}
                                            // searchField={designation}
                                            labelField="name"
                                            valueField="hmID"
                                            placeholder={language ? language : 'Select Language'}
                                            value={language}
                                            // onFocus={() => setIsFocus(true)}
                                            // onBlur={() => setIsFocus(false)}
                                            searchPlaceholder="Enter Location"
                                            onChange={item => {

                                                setLanguage(item?.name)

                                            }}
                                            renderItem={(item) => {
                                                return (<View style={styles.dropdownItem} >
                                                    <Text style={styles.dropdownText}>{item?.name}</Text>
                                                </View>)
                                            }}
                                        /></Pressable>

                                    {/* {languageErr && <ErrorText error={languageErr} />} */}
                                    {/* <Text style={{ marginTop: errors.language ? 7 : 0, color: COLORS.red, fontSize: 12, fontFamily: "Poppins-Regular", }}>
                                        {errors.language}
                                    </Text> */}
                                </View>



                                <View
                                    style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 24 }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 10,
                                            marginBottom: 15,
                                            paddingHorizontal: 5,
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setRead(!read)}>
                                            <Ionicons name={read ? 'checkbox' : 'checkbox-outline'} color={read ? '#395987' : '#6F7482'} size={28} />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10, color: '#6F7482', fontSize: 14, lineHeight: 24, fontFamily: "Poppins-Regular", }}>Read</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 10,
                                            marginBottom: 15,
                                            paddingHorizontal: 5,
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setWrite(!write)}>
                                            <Ionicons name={write ? 'checkbox' : 'checkbox-outline'} color={write ? '#395987' : '#6F7482'} size={28} />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular", color: '#6F7482' }}>Write</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 10,
                                            marginBottom: 15,
                                            paddingHorizontal: 5,
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setSpeak(!speak)}>
                                            <Ionicons name={speak ? 'checkbox' : 'checkbox-outline'} color={speak ? '#395987' : '#6F7482'} size={28} />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular", color: '#6F7482' }}>Speak</Text>
                                    </View>
                                </View>
                                {
                                    (!write && !read && !speak && errors.check) && <Text style={{ marginTop: errors.check ? 7 : 0, color: 'red', fontSize: 12, fontFamily: 'Poppins-Regular' }}>
                                        {errors.check}
                                    </Text>
                                }
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginTop: hp('5%'),
                                    }}
                                >
                                    <TouchableOpacity style={styles.BottomCancelBtn} onPress={handleCancel}>
                                        <Text style={{ color: 'white', fontSize: 14, fontFamily: "Poppins-Medium", }}>Cancel</Text>
                                    </TouchableOpacity>
                                    {Object.keys(currentState)?.length > 0 ? (
                                        updateload ? <TouchableOpacity style={styles.bottomSaveBtn}>
                                            <Text style={styles.title}><ActivityIndicator color="white" size="small" /></Text>
                                        </TouchableOpacity> :
                                            <TouchableOpacity
                                            style={styles.bottomSaveBtn}>
                                                <Text style={{ fontSize: 14, color: 'white', fontFamily: "Poppins-Medium", }}>Update</Text>
                                            </TouchableOpacity>
                                    ) :
                                        (<>

                                            {
                                                languageLoader ? <TouchableOpacity style={styles.bottomSaveBtn}>
                                                    <Text style={styles.title}><ActivityIndicator color="white" size="small" /></Text>
                                                </TouchableOpacity> : <TouchableOpacity style={styles.bottomSaveBtn} onPress={handleSave}>
                                                    <Text style={{ color: 'white', fontSize: 14, fontFamily: "Poppins-Medium", }}>Save</Text>
                                                </TouchableOpacity>
                                            }
                                        </>

                                        )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    dropdownItem: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        zIndex: 1,
        backgroundColor: 'white',
        color: 'red',
    },
    dropdownText: {

        color: 'black', fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21,
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
    detailsView: {
        // display: 'flex',
        height: hp('6%'),
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'center',
        // marginTop: 7,
        borderRadius: 12,
        // paddingHorizontal: 10,
        backgroundColor: '#FAFAFD',
        justifyContent: "space-between"
    },
    searchInput: {
        paddingLeft: 10,
        width: '80%',
        color: 'black',
        fontFamily: 'Poppins-Regular'
    },
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Medium',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    btnView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: hp('14%'),
        padding: 10,

        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,

        backgroundColor: 'white',
        // position: 'absolute',
        bottom: 0,
        width: "100%",

    },
    backBtn: {
        height: 48,
        width: 155,
        borderWidth: 2,
        borderColor: '#395987',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    nextBtn: {
        height: 48,
        width: 155,
        backgroundColor: '#395987',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    nextBtnText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    backBtnText: {
        fontSize: 12,
        color: '#395987',
        fontFamily: 'Poppins-Regular',
    },
    chipsNotSelected: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        marginLeft: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginRight: 5
    },
    chipsSelected: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        marginLeft: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginRight: 5,
        backgroundColor: '#395987'
    },
    chipsNotSelectedText: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        fontSize: 12
    },
    chipsSelectedText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },


    BottomSheetView: {
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: 20, borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    qualificationChipView: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    BottomCancelBtn:{
        height: 45,
        borderWidth: 1,
        width: 110,
        borderRadius: 12,
        borderColor: '#C7D3E3',
        backgroundColor: '#C7D3E3',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginHorizontal: 10,
    },
    bottomSaveBtn:{
        height: 45,
        borderWidth: 1,
        width: 110,
        borderColor: '#395987',
        backgroundColor: '#395987',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderRadius: 12,
        marginHorizontal: 10,
    }
});