import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileTabScreenHeader from '../components/header/profileTabScreenHeader'
import SingleItemBottomSheet from '../components/singleItemBottomSheet/singleItemBottomSheet'
import SelectButton from '../components/selectButton/selectButton'
import { gqlquery , gqlOpenQuery} from '../api/doctorFlow'
import MultiSelectBottomSheet from '../components/multiSelectBottomSheet/multiSelectBottomSheet'
import { useDispatch, useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo';
import { showMessage } from 'react-native-flash-message'
import ErrorText from '../components/ErrorText/ErrorText'
import { getProfileData } from '../Redux_Mine/Redux_Slices/ProfileSlice'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Auth } from 'aws-amplify';
import { getPreferredWorkLocationDropDownData } from '../Redux_Mine/Redux_Slices/DropDownDataSlice'
import { setSelectedJobAlert } from '../Redux_Mine/Redux_Slices/GlobalSettingSlice'

export default function CreateAlertScreen({route}) {
  
  const navigation = useNavigation()
  let numRgex = /^\d+$/;
  const dispatchAction = useDispatch();
  const isFocused = useIsFocused()
  const [roleCategoryModal, setRoleCategoryModal] = useState(false)
  const [roleCategorySingleModal, setRoleCategorySingleModal] = useState(false)
  const [allDesiredRole, setAllDesiredRole] = useState([])
  const [selectedPreferredLocation, setSelectedPreferredLocation] = useState([]);
  const [finalPreferredLocation, setFinalPreferredLocation] = useState([]);
  const [preferredLocationModal, setPreferredLocationModal] = useState(false);
  const [allPreferredLocation, setAllPreferredLocation] = useState([]);
  const [totalExp, setTotalExp] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState([]);
  const [finalJobRole, setFinalJobRole] = useState([]);
  const [saveAlertLoader, setSaveAlertLoader] = useState(false);
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')

  //--------Error State-----------//
  const [locationErr, setLocationErr] = useState('')
  const [jobRoleErr, setJobRoleErr] = useState('')
  const [totalExpErr, setTotalExpErr] = useState('');
  const [emailErr, setEmailErr] = useState('')

  const preferredWorkLocationData = useSelector((state) => state.dropDownDataStore.preferredWorkLocationData);
  const profile = useSelector((state) => state.profilestore.profileData);
  const selectedJobAlertData = useSelector((state) => state.globalSettingStore.selectedJobAlert); 
  const isLogged = useSelector((state) => state.globalSettingStore.isLogged);
 
  useEffect(() => {
    if(route?.params?.searchKeyWord){
      setFinalJobRole([{specialty: route?.params?.searchKeyWord}])
    }
    if(route?.params?.searchlocation?.length > 0){
      const addingFieldName = route?.params?.searchlocation?.map((item) => {
        const itemObj = {cityWithState: item}
        return itemObj
      })
      setFinalPreferredLocation([...addingFieldName])

    }
  },[isFocused]);
  
  const currentUserUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    
    setUserId(user?.attributes?.sub)
  }
    //Role category getting
    useEffect(() => {
   
      dispatchAction(getProfileData())
      currentUserUserData()
      dispatchAction(getPreferredWorkLocationDropDownData())

      const GET_INDUSTRY = {
        query: `query MyQuery {
          searchSpecialty(specialty: "") {
            hciID
            hciType
            industry
            specialty
            status
          }
        }
    `,
        variables: null,
        operationName: "MyQuery",
      };

      gqlOpenQuery(GET_INDUSTRY, null)
        .then((res) => res.json())
        .then((datas) => {
          // console.log('specialty >>>', datas)
          setAllDesiredRole(datas?.data?.searchSpecialty.slice(0,40))
        });
          
    },[isFocused])

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
          setAllPreferredLocation([...datas?.data?.searchCity])
        });
    }
    else {
      const GET_CITY = {
        query: `query MyQuery {
          searchCity(city: "") {
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
          // console.log(datas?.data?.searchCity)
          setAllPreferredLocation([...datas?.data?.searchCity])
        });
    }
  }

  useEffect(() => {
    searchCity()
  }, [preferredWorkLocationData?.length, isFocused])
 
    const locationSelectHandler = (item, froms) => {
      const existsLocation = selectedPreferredLocation?.find((item2) => item2?.cityWithState == item?.cityWithState);
      setLocationErr('')
      if (froms == 'search' && selectedPreferredLocation?.length <= 4) {
        // const filterData = allPreferredLocation?.filter((item2) => item2?.lmID !== item?.lmID)
        // setAllPreferredLocation(filterData);
  
        if (!existsLocation?.cityWithState) {
          setSelectedPreferredLocation([...selectedPreferredLocation, item])
        }
      }
      else if (froms == 'unselect') {
  
        const filterData = selectedPreferredLocation?.filter((item2) => item2?.cityWithState !== item?.cityWithState)
        setSelectedPreferredLocation([...filterData])
        // setAllPreferredLocation(filterData)
      }
      else if (selectedPreferredLocation?.length > 4) {
        // setAllPreferredLocation([])
        return
      }
    }

    const jobRoleSelectHandler = (item, froms) => {
      const existsLocation = selectedJobRole?.find((item2) => item2?.specialty == item?.specialty);
      setJobRoleErr('')
      console.log(' clicked >>>', existsLocation)
      if (froms == 'search' && selectedJobRole?.length <= 4) {
  
        if (!existsLocation?.specialty) {
          setSelectedJobRole([...selectedJobRole, item])
        }
      }
      else if (froms == 'unselect') {
  
        const filterData = selectedJobRole?.filter((item2) => item2?.specialty !== item?.specialty)
        setSelectedJobRole([...filterData])
      }
      else if (selectedJobRole?.length > 4) {
        return
      }
    }

    const roleCategorySelect = (item) => {
      setFinalJobRole([item])
      setJobRoleErr('')
      setRoleCategorySingleModal(false)
    }
  //unselect
  const unSelectHandler = (item) => {
    const filterData = selectedPreferredLocation?.filter((item2) => item2?.cityWithState !== item?.cityWithState)
    const filterData2 = finalPreferredLocation?.filter((item2) => item2?.cityWithState !== item?.cityWithState)
    setSelectedPreferredLocation([...filterData])
    setFinalPreferredLocation(filterData2)
  }

  const unSelectJobRoleHandler = (item) => {
    const filterData = selectedJobRole?.filter((item2) => item2?.specialty !== item?.specialty)
    const filterData2 = finalJobRole?.filter((item2) => item2?.specialty !== item?.specialty)
    setSelectedJobRole([...filterData])
    setFinalJobRole(filterData2)
  }

  const jobAlertCreateHandler = () => {
    let isValid = true;
    setSaveAlertLoader(true)
    if(finalJobRole?.length == 0){
      isValid == false
      setJobRoleErr('Please Select Job Role')
      setSaveAlertLoader(false)
      return
    }
    // if(finalPreferredLocation?.length == 0){
    //   isValid == false
    //   setLocationErr('Please Select preffered location')
    //   setSaveAlertLoader(false)
    // }
    // if(!totalExp){
    //   isValid == false
    //   setTotalExpErr('Please write total experience')
    // }
    // if (numRgex.test(totalExp) === false) {
    //   setTotalExpErr('This field only accept number digit')
    //   isValid = false
    //   setSaveAlertLoader(false)
    //  }
    //  if (totalExp?.toString()?.split('')[0] == 0) {
    //   setTotalExpErr('First digit 0 is not acceptable')
    //   isValid = false
    //   setSaveAlertLoader(false)
    // }
    if(!email && !isLogged){
      isValid == false
      setEmailErr('Please write email')
      return
    }
    const jobRoleArr = finalJobRole?.map((item) => item?.specialty)
    const locationArr = finalPreferredLocation?.map((item) => item?.cityWithState)
    
    if (isValid) {
      const QUERY_CREATEJOBALERT = {
        query: `mutation MyMutation {
                 createJobAlertForUnregisteredUsers(
                   emailID: "${profile?.email}",
                   deviceToken:"",
                   registered: true,
                   userID: "${userId}",
                   education: "",
                   alertName: "",
                   exp: ${Number(totalExp)},
                   hospitals: "",
                   jobType: "",
                   keyword: "${jobRoleArr.join(',')}",
                   location: "${locationArr.join(',')}",
                   locationTop: "",
                   maximumSalary: ${Number(999999)},
                   minimumSalary: ${Number(0)},
                   profession: "",
                   skill: "",
                   specialization: ""
                 )
               }`,
        variables: null,
        operationName: 'MyMutation',
      };

      gqlOpenQuery(QUERY_CREATEJOBALERT, null)
        .then((res) => res.json())
        .then((data) => {
          console.log(" data", data);
    
          setSaveAlertLoader(false)

          showMessage({
            message: "Alert Created Successfully",
            type: "success",
          });
          setFinalJobRole([])
          setSelectedJobRole([])
          setFinalPreferredLocation([])
          setSelectedPreferredLocation([])
          setTotalExp('')
          navigation.goBack()
        });

    }
    else {
    }

  }

  useEffect(() => {
    if(selectedJobAlertData?.jsaID){
      const locationSplitArr = selectedJobAlertData?.location?.split(',');
      const locationMapArr = locationSplitArr?.map((item) => {
        const obj = {cityWithState: item}
        return obj
      })
      const jobRoleSplitArr = selectedJobAlertData?.keyword?.split(',');
      const jobRoleMapArr = jobRoleSplitArr?.map((item) => {
        const obj = {specialty: item}
        return obj
      })
      
      setFinalPreferredLocation(locationMapArr)
      setSelectedPreferredLocation(locationMapArr)
      setFinalJobRole(jobRoleMapArr)
      setSelectedJobRole(jobRoleMapArr)

      setTotalExp(selectedJobAlertData?.exp?.toString())
    }
  },[selectedJobAlertData?.jsaID]);

  const updateAlertHandler = async () => {
    const jobRoleArr = finalJobRole?.map((item) => item?.specialty)
    const locationArr = finalPreferredLocation?.map((item) => item?.cityWithState)

    const QUERY_CREATEJOBALERT = {
      query: ` 
      mutation MyMutation {
        updateAlert(
          alertName: "${selectedJobAlertData?.alertName}",
          jsaID: "${selectedJobAlertData?.jsaID}", 
          keyword: "${jobRoleArr.join(',')}",
          exp: ${Number(totalExp)},
          location: "${locationArr.join(',')}",
          ) {
          alertName
          exp
          keyword
          jsaID
          location
        }
      } `,
      variables: null,
      operationName: 'MyMutation',
    };
   
    gqlquery(QUERY_CREATEJOBALERT, null)
    .then((res) => res.json())
    .then((data) => {
      console.log(" QUERY_CREATEJOBALERT", QUERY_CREATEJOBALERT);
      console.log("job alert updated data >>>>", data);

      setSaveAlertLoader(false)

      showMessage({
        message: "Alert updated Successfully",
        type: "success",
      });
      dispatchAction(setSelectedJobAlert())
      navigation.goBack()
    });

  }

  // console.log('finalPreferredLocation >>>>', finalPreferredLocation) 
  return (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    {/* ----------------Header------------------ */}
    <ProfileTabScreenHeader title={'Create Job Alert'} deleteBtn={false} />

<ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}>

  {/* ---------------Job Role Category-------------- */}
    <View style={styles.inputView}>
        <View style={styles.locationLabelView}>
          <Text style={styles.labelText}>Job Role</Text>
        </View>
            {
              isLogged ? 
            <View>
                {
              finalJobRole?.length > 0 ? <View style={styles.selectArrBox}>
                <View style={styles.chipBox}>
                  {
                    finalJobRole?.map((item, i) => (
                      <Pressable key={i} style={styles.chipsSelected} onPress={() => unSelectJobRoleHandler(item)}>
                        <Text style={[styles.selectText, { color: "white" }]}>{item?.specialty}</Text>
                      </Pressable>
                    ))
                  }
                </View>
                <Pressable onPress={() => setRoleCategoryModal(true)}>
                  <Entypo color="#6F7482" name="plus" size={24} />
                </Pressable>

              </View> : <Pressable onPress={() => setRoleCategoryModal(true)} style={styles.selectBtn}>
                <Text style={styles.selectText}>Select job role</Text>
              </Pressable>
            }
          </View> :   <SelectButton selected={finalJobRole[0]?.specialty } labelShow={false} title='' placeHolder="Select role category" onPressHandler={() => setRoleCategorySingleModal(true)} />
        }
        {jobRoleErr && <ErrorText title={jobRoleErr} />}

    </View>

  {/* ---------------Preferred Work Location-------------- */}
    <View style={styles.inputView}>
      <View style={styles.locationLabelView}>
        <Text style={styles.labelText}>Preferred Work Location</Text>
        
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
        {locationErr && <ErrorText title={locationErr} />}

    </View>
    
    {/* -------------Total Experience----------- */}
    <View style={styles.inputView}>
      <Text style={styles.labelText}>Total Experience</Text>
      <TextInput value={totalExp?.replace(/  +/g, " ")}
        // onFocus={() => setActive(true)} 
        // onBlur={() => setActive(false)}
       onChangeText={(text) => {
          setTotalExp(text.trimStart())
          setTotalExpErr('')
      }} 
      // maxLength={4} 
      keyboardType='number-pad' 
      style={{
          color: 'black',
          borderColor: '#B8BCCA50',
          borderWidth: 1,
          borderRadius: 10,
          height: 45,
          paddingLeft: 15,
          marginTop: 10
      }} 
      placeholder='Write total experience' 
      placeholderTextColor='gray' />

      {totalExpErr && <ErrorText title={totalExpErr} />}
    </View>

          {/* -------------Email----------- */}
    <View style={styles.inputView}>
      <Text style={styles.labelText}>Email ID</Text>
      <TextInput 
        style={{
          color: 'black',
          borderColor: '#B8BCCA50',
          borderWidth: 1,
          borderRadius: 10,
          height: 45,
          paddingLeft: 15,
          marginTop: 10
      }} 
      editable={isLogged ? false : true}
      placeholder='Write your email' 
      value={profile?.email}
      onChange={(text) => {
        setEmail(text)
        setEmailErr('')
      }}
      placeholderTextColor='gray' />
      <Text style={styles.suggestionText}>Job alert will be sent to this Email ID </Text>
      {emailErr && <ErrorText title={emailErr} />}
    </View>
</ScrollView>
    {/* ----------------Submit Button------------------ */}
      <View style={styles.createBtnView}>
          {
            saveAlertLoader ?  <Pressable  style={styles.createBtn}>
            <Text style={styles.createBtnText}>Loading...</Text>
          </Pressable> :  <View>
            {
              selectedJobAlertData?.jsaID ? <Pressable onPress={() => updateAlertHandler()} style={styles.createBtn}>
              <Text style={styles.createBtnText}>Update Job Alert</Text>
            </Pressable> : <Pressable onPress={() => jobAlertCreateHandler()} style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create Job Alert</Text>
        </Pressable>
            }
          </View>
          }
      </View>
      {
        roleCategoryModal && <MultiSelectBottomSheet fieldName="job role" isAddBtn={false} onSubmit={setFinalJobRole} selectedData={selectedJobRole} isSearch={false} setSelectItem={jobRoleSelectHandler} searchData={allDesiredRole} title={'Job Role'} modalShow={roleCategoryModal} setModalShow={setRoleCategoryModal} />
      }
      {
        roleCategorySingleModal && <SingleItemBottomSheet  setSelectItem={roleCategorySelect} isSearch={false} dropDownData={allDesiredRole} title={'Job Role'} modalShow={roleCategorySingleModal} setModalShow={setRoleCategorySingleModal} />
      }
      {
        preferredLocationModal && <MultiSelectBottomSheet fieldName="alert_preferredLocation" isAddBtn={false} onSubmit={setFinalPreferredLocation} selectedData={selectedPreferredLocation} onSearch={searchCity} setSelectItem={locationSelectHandler} searchData={allPreferredLocation} title={'Location'} modalShow={preferredLocationModal} setModalShow={setPreferredLocationModal} />
      }
  </View>
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
  selectText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B8BCCA'
  },
  createBtn:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#395987',
    marginTop: 20,
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    height: 48
  },
  createBtnText:{
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white'
  },
  createBtnView:{
    backgroundColor: 'white',
    elevation: 6,
    shadowColor: '#E4EEF5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 124,
    borderColor: '#E4EEF5',
    borderTopWidth: 2
  }
});
