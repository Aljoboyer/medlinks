import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import BottomCoupleButton from '../../../components/BottomCoupleButton/BottomCoupleButton';
import SingleItemBottomSheet from '../../../components/singleItemBottomSheet/singleItemBottomSheet';
import SelectButton from '../../../components/selectButton/selectButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorText from '../../../components/ErrorText/ErrorText';
import { Days, communicationPreferenceArr, desiredEmploymentTypesArr, desiredJobTypesArr, educationCourse, fromTimeArr, toTimeArr } from '../../../utils/StaticDropdownData';
import MultiSelectBottomSheet from '../../../components/multiSelectBottomSheet/multiSelectBottomSheet';
import { getCareerProfileAvailablity, getCareerProfileData, getPreferredWorkLocation } from '../../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { gqlquery } from '../../../api/doctorFlow';
import Entypo from 'react-native-vector-icons/Entypo';
import { QUERY_GETCANDIDATEAVAILABILITY } from '../../../graphql';
import { showMessage } from 'react-native-flash-message';
import { TouchableOpacity } from 'react-native';
import MultiSelectButton from '../../../components/multiSelectButton/multiSelectButton';
import { getProfileData, setMonthlyData, setTotalData } from '../../../Redux_Mine/Redux_Slices/ProfileSlice';
import { BackHandler } from 'react-native';

const fromTimeArrData = [
  "12 AM",
  "01 AM",
  "02 AM",
  "03 AM",
  "04 AM",
  "05 AM",
  "06 AM",
  "07 AM",
  "08 AM",
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
  "07 PM",
  "08 PM",
  "09 PM",
  "10 PM",
  "11 PM",
];

const toTimeArrData = [
  "12 AM",
  "01 AM",
  "02 AM",
  "03 AM",
  "04 AM",
  "05 AM",
  "06 AM",
  "07 AM",
  "08 AM",
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
  "07 PM",
  "08 PM",
  "09 PM",
  "10 PM",
  "11 PM",
];


export default function Preferences({ page, setPage }) {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false);
  const [abilityLoading, setAbilityLoading] = useState(false);
  const isFocused = useIsFocused();
  const dispatchAction = useDispatch();
  let resText = /^[A-Za-z\s]+$/;

  // --------------------Modal------------------//
  const [desiredIndustryModal, setDesiredIndustryModal] = useState(false)
  const [jobTypeModal, setJobTypeModal] = useState(false)
  const [employmentTypeModal, setEmploymentTypeModal] = useState(false)
  const [communicationModal, setCommunicationModal] = useState(false)
  const [preferredLocationModal, setPreferredLocationModal] = useState(false);
  const [dayModal, setDayModal] = useState(false);
  const [fromTimeModal, setFromTimeModal] = useState(false);
  const [toTimeModal, setToTimeModal] = useState(false);
  const [active, setActive] = useState(false)
  //Fetch State
  const [allPreferredLocation, setAllPreferredLocation] = useState([]);

  //Field state
  const [anywhereIndia, setAnywhereIndia] = useState(false);
  const [desiredIndustry, setDesiredIndustry] = useState('')
  const [desiredIndustryOther, setDesiredIndustryOther] = useState('');
  const [desiredJobType, setDesiredJobType] = useState('');
  const [desiredEmploymentType, setDesiredEmploymentType] = useState('');
  const [selectedCommunications, setSelectedCommunications] = useState([]);
  const [finalSelectedCommunications, setFinalSelectedCommunications] = useState([]);
  const [abilityDay, setAbilityDay] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [selectedPreferredLocation, setSelectedPreferredLocation] = useState([]);
  const [finalPreferredLocation, setFinalPreferredLocation] = useState([]);
  const [isActivelySerching, setIsActivelySearching] = useState(true)
  const [isNewsLetterSubscribe, setIsNewsLetterSubscribe] = useState(true)

  //Error State
  const [desiredIndustryErr, setDesiredIndustryErr] = useState('')
  const [desiredIndustryOtherErr, setDesiredIndustryOtherErr] = useState('')
  const [desiredJobTypeErr, setDesiredJobTypeErr] = useState('');
  const [desiredEmploymentTypeErr, setDesiredEmploymentTypeErr] = useState('');
  const [communicationErr, setCommunicationErr] = useState('');
  const [fromTimeErr, setFromTimeErr] = useState('');
  const [toTimeErr, setToTimeErr] = useState('');
  const [abilityDayErr, setAbilityDayErr] = useState('');
  const [abilityErr, setAbilityErr] = useState('');
  const [preferedLocationErr, setPreferedLocationErr] = useState('')

  //Redux State
  const allDesiredIndustry = useSelector((state) => state.dropDownDataStore.desiredIndustry);
  const careerProfileData = useSelector((state) => state.profiletabstore.careerProfileData);
  const preferredWorkLocationData = useSelector((state) => state.dropDownDataStore.preferredWorkLocationData);
  const EducationList = useSelector((state) => state.profiletabstore.educationList);
  const preferredLocations = useSelector((state) => state.profiletabstore.preferredLocation);
  const userAvailablityData = useSelector((state) => state.profiletabstore.userAvailablity);
  const profileData = useSelector((state) => state.profilestore.profileData);

  //Static Data
  const desiredJobTypeData = desiredJobTypesArr;
  const desiredEmploymentTypeData = desiredEmploymentTypesArr;
  const communicationPreferenceData = communicationPreferenceArr;
  const fromtTimeData = fromTimeArr;
  const [toTimeData, setToTimeData] = useState([])
  const dayData = Days;

  //checking specific course for showing the communication preference and available time view
  const courseTypeExists = educationCourse?.find((item) => item == EducationList[0]?.course)

  //unselecting communication
  const communicationUnSelect = (item) => {

    const findExists = finalSelectedCommunications?.find((item2) => item2?.name == item?.name)
    if (findExists?.name) {
      const filterCommunication = finalSelectedCommunications?.filter((item2) => item2?.name !== item?.name)
      setFinalSelectedCommunications(filterCommunication)
      setSelectedCommunications(filterCommunication)
    }
  }

  // Get Location
  const searchCity = (text) => {

    if (text && text !== " " && text !== "") {

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

      gqlquery(GET_CITY, null)
        .then((res) => res.json())
        .then((datas) => {
          console.log(datas?.data?.searchCity)
          setAllPreferredLocation([...datas?.data?.searchCity])
        });
    }
    else {
      setAllPreferredLocation(preferredWorkLocationData)
    }
  }
  
  useEffect(() => {
    searchCity()
  }, [preferredWorkLocationData?.length])

  //unselect
  const unSelectHandler = (item) => {
    const filterData = selectedPreferredLocation?.filter((item2) => item2?.lmID !== item?.lmID)
    const filterData2 = finalPreferredLocation?.filter((item2) => item2?.lmID !== item?.lmID)
    setSelectedPreferredLocation([...filterData])
    setFinalPreferredLocation(filterData2)
  }

  //Select Item
  const desiredIndustrySelect = (item) => {
    setDesiredIndustry(item)
    setDesiredIndustryErr('')
    setDesiredIndustryModal(false)
  }
  const jobTypeSelect = (item) => {
    setDesiredJobType(item?.name)
    setDesiredJobTypeErr('')
    setJobTypeModal(false)
  }
  const employmentTypeSelect = (item) => {
    setDesiredEmploymentType(item?.name)
    setDesiredEmploymentTypeErr('');
    setEmploymentTypeModal(false)
  }
  const daySelect = (item) => {
    setAbilityDay(item?.name)
    setAbilityDayErr('')
    setDayModal(false)
  }
  const toTimeSelect = (item) => {
    setToTime(item?.name)
    setToTimeErr('')
    setToTimeModal(false)

  }
  const fromTimeSelect = (item) => {
    setFromTime(item?.name)
    setFromTimeErr('')
    setFromTimeModal(false)
    setToTime('')
    const startIndex = fromTimeArrData.indexOf(item?.name)
    const arr = toTimeArr.slice(startIndex + 1, 24)
    setToTimeData(arr)
  }
  const locationSelectHandler = (item, froms) => {
    const existsLocation = selectedPreferredLocation?.find((item2) => item2?.lmID == item?.lmID);

    if (froms == 'search' && selectedPreferredLocation?.length <= 4) {
      // const filterData = allPreferredLocation?.filter((item2) => item2?.lmID !== item?.lmID)
      // setAllPreferredLocation(filterData);

      if (!existsLocation?.lmID) {
        setSelectedPreferredLocation([...selectedPreferredLocation, item])
      }
    }
    else if (froms == 'unselect') {

      const filterData = selectedPreferredLocation?.filter((item2) => item2?.lmID !== item?.lmID)
      setSelectedPreferredLocation([...filterData])
      // setAllPreferredLocation(filterData)
    }
    else if (selectedPreferredLocation?.length > 4) {
      // setAllPreferredLocation([])
      return
    }
  }
  const selectedCommunicationHandler = (item, froms) => {
    if (froms == 'search') {
      const findExists = selectedCommunications?.find((item2) => item2?.name == item?.name)
      if (findExists?.name) {
        return
      }
      else {
        setSelectedCommunications([...selectedCommunications, item])
      }
    }
    else {
      const filterCommunication = selectedCommunications?.filter((item2) => item2?.name !== item?.name)
      setSelectedCommunications(filterCommunication)
    }
  }

  //For Adding Preference
  const addingNewsLetterAndActivelySearch = () => {
    console.log("isActivelySerching isNewsLetterSubscribe", isNewsLetterSubscribe, isActivelySerching)
    const QUERY_FINISHREGISTER = {
      query: `mutation MyMutation {
    updateProfileFinishReg( 
      activelySearching:  ${isActivelySerching},
      newsletter: ${isNewsLetterSubscribe},
    )
  }`,
      variables: null,
      operationName: "MyMutation",
    };
    gqlquery(QUERY_FINISHREGISTER, null)
      .then((res) => res.json())
      .then((data) => {
        dispatchAction(getProfileData());
        console.log("updateProfileFinishReg res ===>", data)
      })
  }

  const handleAddAvailability = async () => {
    setAbilityLoading(true)
    let isValid = true
    setAbilityErr('')
    //for availability

    if (courseTypeExists && !abilityDay) {
      setAbilityLoading(false)
      setAbilityDayErr('Please select day')
      isValid = false;
      setLoading(false);
      console.log('abilityDay Err')
    }
    if (courseTypeExists && !toTime) {
      setAbilityLoading(false)
      setToTimeErr('Please select time')
      isValid = false;
      setLoading(false);
      console.log('toTime Err')
    }
    if (courseTypeExists && !fromTime) {
      setAbilityLoading(false)
      setFromTimeErr('Please select time')
      isValid = false;
      setLoading(false);
      console.log('fromTime Err')
    }
    if (isValid) {

      const availabilityFromTime = fromTimeArrData.indexOf(fromTime);
      const availabilityToTime = toTimeArrData.indexOf(toTime);

      const QUERY_POSTCANDIDATEAVAILABILITY = {
        query: `mutation MyMutation {
              addCandidateAvailability (
                        day: "${abilityDay}",
                        fromTime: ${(availabilityFromTime)},
                        toTime: ${(availabilityToTime)}
                        ) {
                          availID
                          day
                          fromTime
                          toTime
                          }
                        }
                      `,
        variables: null,
        operationName: "MyMutation",
      };
      gqlquery(QUERY_POSTCANDIDATEAVAILABILITY, null)
        .then((res) => res.json())
        .then((datas) => {
          setAbilityLoading(false)
          console.log("Availability added", datas?.data?.addCandidateAvailability)
          dispatchAction(getCareerProfileAvailablity());
          setAbilityDay('')
          setToTime('')
          setFromTime('')
        })
    }
  };
  const handleAddPreferredLocations = async (newValue) => {
    console.log('location id', newValue)
    if (newValue?.length > 0) {
      const CLEARDB = {
        query: `mutation MyMutation {
          deletePreferredWorkLocation
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };
      await gqlquery(CLEARDB, null)
        .then((res) => res.json())
        .then((datas) => {
          console.log("DB Clear");
        })

      await newValue.map((newValue, index) => {
        const ADDTODATABASE = {
          query: `mutation MyMutation {
            addPreferredWorkLocation(locationID: ${newValue}) {
              cityWithState
              locationID
              pwlID 
            }
          }
        `,
          variables: null,
          operationName: "MyQuery",
        };
        gqlquery(ADDTODATABASE, null)
          .then((res) => res.json())
          .then((datas) => {
            console.log('Location Adding ===>', datas)
            dispatchAction(getPreferredWorkLocation());
          })

      })

    }
    else {
      // TODO document why this block is empty
    }
  }
  const savingPreferences = () => {
    const phone = finalSelectedCommunications?.find((item) => item?.name == 'Phone')
    const email = finalSelectedCommunications?.find((item) => item?.name == 'Email')
    const sms = finalSelectedCommunications?.find((item) => item?.name == 'SMS')
    const Whatsapp = finalSelectedCommunications?.find((item) => item?.name == 'Whatsapp')

    addingNewsLetterAndActivelySearch()
    const QUERY_POSTCAREERPROFILE = {
      query: `mutation MyMutation {
        addCareerProfile (
          desiredEmploymentType: "${desiredEmploymentType}",
          desiredJobType: "${desiredJobType}",
          desiredShift: "",
          expectedSalaryEnd: 0,
          expectedSalaryStart: 0,
          industryID: ${desiredIndustry?.hciID ? desiredIndustry?.hciID : 0},
          roleCategoryID: ${0},
          emailOpted: ${email?.name ? Boolean(true) : Boolean(false)},
          phoneOpted: ${phone?.name ? Boolean(true) : Boolean(false)},
          otherIndustry: "${desiredIndustry?.industry?.toLowerCase() === "other" ? desiredIndustryOther : ""}", 
          otherRoleCategory: "",
          smsOpted: ${sms?.name ? Boolean(true) : Boolean(false)}, 
          whatsappOpted: ${Whatsapp?.name ? Boolean(true) : Boolean(false)},
          isAnywhereFromIndia : ${Boolean(anywhereIndia)}
            ) {
              cpID
              desiredJobType
              desiredEmploymentType
              desiredShift
              expectedSalaryEnd
              expectedSalaryStart
              industryID 
              roleCategoryID
              emailOpted
              phoneOpted
              smsOpted
              whatsappOpted
              }
            }
          `,
      variables: null,
      operationName: "MyMutation",
    };
    gqlquery(QUERY_POSTCAREERPROFILE, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log("QUERY_POSTCAREERPROFILE===>", QUERY_POSTCAREERPROFILE);
        console.log("career profile res ===>", datas);
        let locationIdArr = finalPreferredLocation?.map(
          (loca) => loca?.lmID || loca?.locationID);

        handleAddPreferredLocations(locationIdArr)
        dispatchAction(getCareerProfileData());

        // dispatchAction(setMonthlyData(''))
        // dispatchAction(setTotalData(''))

        setLoading(false);
        showMessage({
          message: "Preferences added Successfully",
          type: "success",
        });
        navigation.navigate('AuthCommonScreen')
      })
  }
  const updateingPreferences = () => {
    const phone = finalSelectedCommunications?.find((item) => item?.name == 'Phone')
    const email = finalSelectedCommunications?.find((item) => item?.name == 'Email')
    const sms = finalSelectedCommunications?.find((item) => item?.name == 'SMS')
    const Whatsapp = finalSelectedCommunications?.find((item) => item?.name == 'Whatsapp')

    addingNewsLetterAndActivelySearch()
    const QUERY_UPDATECAREERPROFILE = {
      query: `mutation MyMutation {
        updateCareerProfile (
          cpID: "${careerProfileData?.cpID}",
          desiredEmploymentType: "${desiredEmploymentType}",
          desiredJobType: "${desiredJobType}",
          desiredShift: "",
          expectedSalaryEnd: 0,
          expectedSalaryStart: 0,
          industryID: ${desiredIndustry?.hciID ? desiredIndustry?.hciID : 0},
          roleCategoryID: ${0},
          emailOpted: ${email?.name ? Boolean(true) : Boolean(false)},
          phoneOpted: ${phone?.name ? Boolean(true) : Boolean(false)},
          otherIndustry: "${desiredIndustry?.industry?.toLowerCase() === "other" ? desiredIndustryOther : ""}", 
          otherRoleCategory: "",
          smsOpted: ${sms?.name ? Boolean(true) : Boolean(false)}, 
          whatsappOpted: ${Whatsapp?.name ? Boolean(true) : Boolean(false)},
          isAnywhereFromIndia : ${Boolean(anywhereIndia)}
            ) {
              cpID
              desiredJobType
              desiredEmploymentType
              desiredShift
              expectedSalaryEnd
              expectedSalaryStart
              industryID 
              roleCategoryID
              emailOpted
              phoneOpted
              smsOpted
              whatsappOpted
              }
            }
          `,
      variables: null,
      operationName: "MyMutation",
    };
    gqlquery(QUERY_UPDATECAREERPROFILE, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log(datas);
        let locationIdArr = finalPreferredLocation?.map(
          (loca) => loca?.lmID || loca?.locationID);

        handleAddPreferredLocations(locationIdArr)
        dispatchAction(getCareerProfileData());
        setLoading(false);
        showMessage({
          message: "Preferences added Successfully",
          type: "success",
        });
        navigation.navigate('AuthCommonScreen')
      })
  }
  useEffect(() => {
    setLoading(false)
  }, [])

  const preferenceHandler = () => {
    setLoading(true);
    let isValid = true;

    if (finalPreferredLocation?.length == 0 && !anywhereIndia) {
      console.log('preferredlocation Err')
      setPreferedLocationErr("Please, select an option.");
      setLoading(false);
      isValid = false;

    };
    if (!desiredIndustry?.hciID) {
      setDesiredIndustryErr('Please select desired industry')
      isValid = false;
      setLoading(false);
      console.log('desiredIndustry Err')
    }
    if (desiredIndustry?.industry?.toLowerCase() === "other" && !desiredIndustryOther) {
      setDesiredIndustryOtherErr('Please write other desired industry.')
      isValid = false;
      setLoading(false);
      console.log('desiredIndustryOther')
    }
    if (desiredIndustryOther && resText.test(desiredIndustryOther) === false) {
      setDesiredIndustryOtherErr('This field accept only Alphabets.');
      isValid = false;
      setLoading(false)
      console.log('desiredIndustryOther false')
    }
    if (!desiredJobType) {
      setDesiredJobTypeErr('Please select desired job type')
      isValid = false;
      setLoading(false);
      console.log('desiredJobType Err')
    }
    if (!desiredEmploymentType) {
      setDesiredEmploymentTypeErr('Please select desired employment type')
      isValid = false;
      setLoading(false);
      console.log('desiredEmploymentType Err')
    }
    if (!desiredJobType) {
      setDesiredJobTypeErr('Please select desired job type')
      isValid = false;
      setLoading(false);
      console.log('desiredJobType Err')
    }
    if (!desiredEmploymentType) {
      setDesiredEmploymentTypeErr('Please select desired employment type')
      isValid = false;
      setLoading(false);
      console.log('desiredEmploymentType Err')
    }
    if (finalSelectedCommunications?.length == 0 && courseTypeExists) {
      setCommunicationErr('Please select communication Preference')
      isValid = false;
      setLoading(false);
      console.log('communication Err')
    }
    if (userAvailablityData?.length == 0 && courseTypeExists) {
      setAbilityErr('Please add Available Timings')
      isValid = false;
      setLoading(false);
      console.log('AbilityErr Err')
    }

    if (isValid) {

      if (careerProfileData?.industryName) {
        updateingPreferences()
      } else {
        savingPreferences()
      }
    }
    // setPage(3)
  }

  const backHandler = () => {
    setPage(2)
  }

  //For Update Purpose
  useEffect(() => {
    setAnywhereIndia(careerProfileData?.isAnywhereFromIndia)
    if (careerProfileData?.cpID) {
      setSelectedPreferredLocation(preferredLocations)
      setFinalPreferredLocation(preferredLocations);

      const emptyArr = []
      const phone = careerProfileData?.phoneOpted && emptyArr?.push({ name: 'Phone' })
      const sms = careerProfileData?.smsOpted && emptyArr?.push({ name: 'SMS' })
      const whatsapp = careerProfileData?.whatsappOpted && emptyArr?.push({ name: 'Whatsapp' })
      const email = careerProfileData?.emailOpted && emptyArr?.push({ name: 'Email' })

      setSelectedCommunications(emptyArr)
      setFinalSelectedCommunications(emptyArr)

      if (careerProfileData?.isOtherIndustry) {
        setDesiredIndustry({ industry: 'Other' })
        setDesiredIndustryOther(careerProfileData?.industryName)
      }
      if (!careerProfileData?.isOtherIndustry) {
        setDesiredIndustry({ industry: careerProfileData?.industryName, hciID: careerProfileData?.industryID })
      }

      setDesiredJobType(careerProfileData?.desiredJobType)
      setDesiredEmploymentType(careerProfileData?.desiredEmploymentType)

    }
  }, [careerProfileData?.cpID]);

  useEffect(() => {
    if (careerProfileData?.cpID) {
      setSelectedPreferredLocation(preferredLocations)
      setFinalPreferredLocation(preferredLocations)
      setIsActivelySearching(profileData?.activelySearching)
      setIsNewsLetterSubscribe(profileData?.newsletter)
    }
  }, [preferredLocations?.length, page, careerProfileData?.cpID, profileData?.name])


  //Ablity delete 
  const handleDeleteAvaility = async (deleteID) => {

    const QUERY_DELETEAVAILABILITY = {
      query: `mutation MyMutation {
        deleteCandidateAvailability (availID: ${Number(deleteID)}) {
              availID
              day
              fromTime
              toTime
            }
          }`,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_DELETEAVAILABILITY, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log('Availability', datas?.data);
        dispatchAction(getCareerProfileAvailablity());
      })
      .finally((e) =>
        console.log("Deleting Candidate Availability details from database")
      );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
        backHandler()
      return true;
    }
    return false;
  };
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }}>
        {/* ---------------Desired Industry-------------- */}
        <SelectButton selected={desiredIndustry?.industry} title='Desired Industry' placeHolder="Select desired industry" onPressHandler={() => setDesiredIndustryModal(true)} />
        {desiredIndustryErr && <ErrorText title={desiredIndustryErr} />}
        {
          desiredIndustry?.industry == 'Other' &&
          <View style={[styles.inputView, { marginVertical: 10 }]}>
            <TextInput value={desiredIndustryOther.replace(/  +/g, " ")} onChangeText={(text) => {
              setDesiredIndustryOther(text.trimStart())
              setDesiredIndustryOtherErr('')
              setDesiredIndustryErr('')
            }} onFocus={() => setActive(true)} onBlur={() => setActive(false)} style={{
              color: 'black',
              borderColor: active ? '#395987' : '#B8BCCA50',
              borderWidth: 1,
              borderRadius: 10,
              height: 45,
              paddingLeft: 15,
              marginTop: 10
            }} placeholder='Write industry name' placeholderTextColor='gray' />
            {desiredIndustryOtherErr && <ErrorText title={desiredIndustryOtherErr} />}
          </View>
        }

        {/* ---------------Desired Job Type-------------- */}
        <SelectButton selected={desiredJobType} title='Desired Job Type' placeHolder="Select Desired Job Type" onPressHandler={() => setJobTypeModal(true)} />
        {desiredJobTypeErr && <ErrorText title={desiredJobTypeErr} />}

        {/* ---------------Desired Employment Type-------------- */}
        <SelectButton selected={desiredEmploymentType} title='Desired Employment Type' placeHolder="Select Desired Employment Type" onPressHandler={() => setEmploymentTypeModal(true)} />
        {desiredEmploymentTypeErr && <ErrorText title={desiredEmploymentTypeErr} />}

        {/* ---------------Preferred Work Location-------------- */}
        <View style={styles.inputView}>
          <View style={styles.locationLabelView}>
            <Text style={styles.labelText}>Preferred Work Location</Text>
            <View style={styles.AnywhereView}>
              {
                anywhereIndia ? <Pressable onPress={() => setAnywhereIndia(false)}>
                  <MaterialIcons name='check-box' style={{ marginRight: 7 }} size={18} color="#395987" />
                </Pressable> : <Pressable onPress={() => setAnywhereIndia(true)}>
                  <MaterialIcons style={{ marginRight: 7 }} name='check-box-outline-blank' size={18} color="#E4EEF5" />
                </Pressable>
              }
              <Text style={styles.currentlyWorkingText}>Anywhere in India</Text>
            </View>
          </View>



          {
            finalPreferredLocation?.length > 0 ? <View style={styles.selectArrBox}>
              <View style={styles.chipBox}>
                {
                  finalPreferredLocation?.map((item, i) => (
                    <Pressable key={i} style={styles.chipsSelected} onPress={() => unSelectHandler(item)}>
                      <Text style={[styles.selectText, { color: "white" }]}>{item?.city || item?.cityWithState}</Text>
                    </Pressable>
                  ))
                }
              </View>
              <Pressable onPress={() => setPreferredLocationModal(true)}>
                <Entypo color="#6F7482" name="plus" size={24} />
              </Pressable>

            </View> : <Pressable onPress={() => setPreferredLocationModal(true)} style={styles.selectBtn}>
              <Text style={styles.selectText}>Select Preferred Work Location</Text>
            </Pressable>
          }
          {preferedLocationErr && <ErrorText title={preferedLocationErr} />}

        </View>

        {/* ---------------Communication Preference-------------- */}
        {
          courseTypeExists &&
          <>
            <MultiSelectButton setSelectItem={communicationUnSelect} selectedArr={finalSelectedCommunications} title='Communication Preference' placeHolder="Select Communication Preference" onPressHandler={() => setCommunicationModal(true)} />
            {communicationErr && <ErrorText title={communicationErr} />}
          </>
        }

        {/* -----------------Available Timings-------------- */}
        {
          courseTypeExists &&
          <View style={styles.availableTimeView}>
            <Text style={styles.labelText}>Available Timings</Text>

            <SelectButton selected={abilityDay} labelShow={false} title='' placeHolder="Day" onPressHandler={() => setDayModal(true)} />
            {abilityDayErr && <ErrorText title={abilityDayErr} />}

            <SelectButton selected={fromTime} labelShow={false} title='' placeHolder="From Time" onPressHandler={() => setFromTimeModal(true)} />
            {fromTimeErr && <ErrorText title={fromTimeErr} />}

            <SelectButton selected={toTime} labelShow={false} title='' placeHolder="To Time" onPressHandler={() => {
              if (toTimeData?.length > 0) {
                setToTimeModal(true)
              }
            }} />
            {toTimeErr && <ErrorText title={toTimeErr} />}

            {abilityErr && <ErrorText title={abilityErr} />}

            {
              abilityLoading ? <Pressable style={styles.uploadButton}>
                <Text style={styles.availabiltyBtnText}>
                  Loading...
                </Text>
              </Pressable> : <Pressable style={styles.uploadButton} onPress={handleAddAvailability}>
                <Text style={styles.availabiltyBtnText}>
                  Add Availability
                </Text>
              </Pressable>
            }

            <View>
              {userAvailablityData?.length > 0 &&
                userAvailablityData?.map((item, index) => {
                  return (
                    <View
                      style={styles.abilityView}
                      key={index}>
                      <View>
                        <Text
                          style={styles.abilityItemText}>
                          {item?.day} {fromTimeArrData[item?.fromTime]} {"-"}{" "}
                          {toTimeArrData[item?.toTime]}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteAvaility(item.availID)}
                      >
                        <MaterialIcons name="delete" size={24} color="#395987" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>

          </View>
        }
        {/* --------------check box view-------------- */}
        <View style={{ paddingTop: 40, borderTopWidth: 1, borderTopColor: '#E4EEF5', marginTop: 40 }}>

          <View style={[styles.AnywhereView, { marginTop: 10 }]}>
            {
              isActivelySerching ? <Pressable onPress={() => setIsActivelySearching(false)}>
                <MaterialIcons name='check-box' style={{ marginRight: 7 }} size={18} color="#395987" />
              </Pressable> : <Pressable onPress={() => setIsActivelySearching(true)}>
                <MaterialIcons style={{ marginRight: 7 }} name='check-box-outline-blank' size={18} color="#E4EEF5" />
              </Pressable>
            }
            <Text style={[styles.currentlyWorkingText, { color: "black", fontSize: 14 }]}>Actively searching for Job</Text>
          </View>

          <View style={[styles.AnywhereView, { marginTop: 10 }]}>
            {
              isNewsLetterSubscribe ? <Pressable onPress={() => setIsNewsLetterSubscribe(false)}>
                <MaterialIcons name='check-box' style={{ marginRight: 7 }} size={18} color="#395987" />
              </Pressable> : <Pressable onPress={() => setIsNewsLetterSubscribe(true)}>
                <MaterialIcons style={{ marginRight: 7 }} name='check-box-outline-blank' size={18} color="#E4EEF5" />
              </Pressable>
            }
            <Text style={[styles.currentlyWorkingText, { color: "black", fontSize: 14 }]}>Subscribe to newsletter</Text>
          </View>
        </View>


      </ScrollView >
      <BottomCoupleButton isLoad={loading} backHandler={backHandler} nextHandler={preferenceHandler} />

      {
        desiredIndustryModal && <SingleItemBottomSheet setSelectItem={desiredIndustrySelect} isSearch={false} dropDownData={allDesiredIndustry} title={'Desired Industry'} modalShow={desiredIndustryModal} setModalShow={setDesiredIndustryModal} />
      }

      {
        jobTypeModal && <SingleItemBottomSheet setSelectItem={jobTypeSelect} isSearch={false} dropDownData={desiredJobTypeData} title={'Job Type'} modalShow={jobTypeModal} setModalShow={setJobTypeModal} />
      }

      {
        employmentTypeModal && <SingleItemBottomSheet dropDownData={desiredEmploymentTypeData} isSearch={false} setSelectItem={employmentTypeSelect} title={'Employment Type'} modalShow={employmentTypeModal} setModalShow={setEmploymentTypeModal} />
      }

      {
        communicationModal && <MultiSelectBottomSheet fieldName="cummonication" isSearch={false} isAddBtn={false} onSubmit={() => {
          setFinalSelectedCommunications(selectedCommunications)
          setCommunicationErr('');
          setCommunicationModal(false)
        }} selectedData={selectedCommunications} setSelectItem={selectedCommunicationHandler} suggestionData={[]} title={'Communication Preference'} modalShow={communicationModal} setModalShow={setCommunicationModal} searchData={communicationPreferenceData} />
      }

      {
        preferredLocationModal && <MultiSelectBottomSheet fieldName="preferredLocation" isAddBtn={false} onSubmit={setFinalPreferredLocation} selectedData={selectedPreferredLocation} onSearch={searchCity} setSelectItem={locationSelectHandler} searchData={allPreferredLocation} title={'Location'} modalShow={preferredLocationModal} setModalShow={setPreferredLocationModal} />
      }

      {
        dayModal && <SingleItemBottomSheet dropDownData={dayData} isSearch={false} setSelectItem={daySelect} title={'Day'} modalShow={dayModal} setModalShow={setDayModal} />
      }

      {
        fromTimeModal && <SingleItemBottomSheet dropDownData={fromtTimeData} isSearch={false} setSelectItem={fromTimeSelect} title={'From Time'} modalShow={fromTimeModal} setModalShow={setFromTimeModal} />
      }

      {
        toTimeModal && <SingleItemBottomSheet dropDownData={toTimeData} isSearch={false} setSelectItem={toTimeSelect} title={'To Time'} modalShow={toTimeModal} setModalShow={setToTimeModal} />
      }
    </View >
  )
}

const styles = StyleSheet.create({
  selectBtn: {
    borderColor: '#B8BCCA50',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginTop: 10
  },
  selectText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B8BCCA'
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#6F7482',
    lineHeight: 18,
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
  availableTimeView: {
    marginTop: 20
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#6F7482',
    // lineHeight: 18,
    marginLeft: 5
  },
  selectArrBox: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    // height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginTop: 10,
    paddingRight: 10,
    paddingVertical: 10,
  },
  chipsSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: '#B8BCCA50',
    borderWidth: 1,
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    marginRight: 5,
    backgroundColor: '#395987'
  },
  chipBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    width: 300,
  },
  availabiltyBtnText: { color: "#395987", fontFamily: 'Poppins-Medium', fontSize: 13, },
  uploadButton: {
    flexDirection: "row",
    borderRadius: 10,
    width: "100%",
    height: 45,
    borderColor: "#395987",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
    borderWidth: 2
  },
  abilityView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  abilityItemText: {
    color: "#6F7482",
    fontFamily: 'Poppins-Medium', fontSize: 14, lineHeight: 21,
  },
  passingYearInput: {
    color: 'black',
    borderColor: '#B8BCCA50',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    paddingLeft: 15,
    marginTop: 10
  },
});