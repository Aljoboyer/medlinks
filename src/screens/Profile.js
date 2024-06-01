import React, { useEffect, useState, useContext } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileMini from '../components/profilemini/ProfileMini';
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from '../Context/GlobalState';
import { BottomSheet } from "@rneui/themed";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from "rn-fetch-blob";
import { gqlquery } from '../api/doctorFlow';
import { showMessage } from 'react-native-flash-message';
import { getEducationList, getExperienceList, getCareerProfileData, getCareerProfileAvailablity, getPreferredWorkLocation, setSelectedEducation, setSelectedExperience, } from '../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { getProfileData,getProfileImg } from '../Redux_Mine/Redux_Slices/ProfileSlice';
import { getProfileStrength } from '../Redux_Mine/Redux_Slices/ProfileSlice';
import UploadResumeBottomSheet from "../components/uploadresumeBottomsheet/uploadresumeBottomsheet"
import { getResumeDetails, getResumeHeadline } from '../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import DeleteAccountBottomSheet from '../components/deleteaccountBottomsheet/deleteaccountBottomsheet';
import { CommonStyle } from '../thems/commonStyles';

const toTimeData = [
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
const fromTimeArr = [
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

const Profile = () => {
    const navigation = useNavigation();
    const [displayesdesiredDetails, setDisplayedDesiredDetails] = useState(false);
    const [filterSheetShow, setFilterSheetShow] = useState(false)
    const [deleteSheetShow, setDeleteSheetShow] = useState(false)
    const [headline, setHeadline] = useState('abc')
    const dispatchAction = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [update, setUpdate] = useState(0)
    const [imgLoader, setImgLoader] = useState(false)
    const [resumeHeadlinesuggestion,setResumeHeadlinesuggestion] = useState('')
    const [pendingActionShow, setPendingActionShow] = useState(false)
    const [completedAction, setCompletedeAction] = useState([])

    const Months = useSelector((state) => state.profiletabstore.months);
    const resume = useSelector((state) => state.profiletabstore.resumeDetails);
    const resumeHeadline = useSelector((state) => state.profiletabstore.resumeHeadline);
    const careerProfileData = useSelector((state) => state.profiletabstore.careerProfileData);
    const profile = useSelector((state) => state.profilestore.profileData);
    const EducationList = useSelector((state) => state.profiletabstore.educationList);
    const ExperienceList = useSelector((state) => state.profiletabstore.experienceList);
    const userAvailablity = useSelector((state) => state.profiletabstore.userAvailablity);
    const preferredLocations = useSelector((state) => state.profiletabstore.preferredLocation);
    const profileStrength = useSelector((state) => state.profilestore.profileStrength);

    const base64Image = useSelector((state) => state.profilestore.profleImg);
    const isFocused = useIsFocused();

    useEffect(() => {
        dispatchAction(getProfileImg(profile?.profilePicURL))
    }, [profile?.profilePicURL, update]);

    useEffect(() => {
        dispatchAction(getProfileStrength())
        dispatchAction(getEducationList())
        dispatchAction(getExperienceList())
        dispatchAction(getCareerProfileData());
        dispatchAction(getCareerProfileAvailablity());
        dispatchAction(getPreferredWorkLocation());
        dispatchAction(getProfileData())
    }, [isFocused])

    useEffect(() => {
        if (resumeHeadline) {
            setHeadline(resumeHeadline?.headline?.replace(/<br \/>/g, "\n"))
        }
        else {
            setHeadline("")
        }
    }, [resumeHeadline?.headline, isFocused]);

    useEffect(() => {
        dispatchAction(getResumeDetails())
        dispatchAction(getResumeHeadline())

    }, [isFocused, filterSheetShow, profileStrength?.strength])


    const hanldeDownloadResume = async () => {

        if (resume?.url) {
            const QUERY_DOWNLOADRESUME = {
                query: `query MyQuery {
                    downloadDocument (url: "${resume?.url}")
                  }`,
            };

            gqlquery(QUERY_DOWNLOADRESUME, null)
                .then((res) => res.json())
                .then((datas) => {

                    const downloadDocument = JSON.parse(datas?.data?.downloadDocument);
                    savePdf(downloadDocument);
                });
        }
    };

    const savePdf = async (item) => {
        try {
            const byteCharacters = (item?.response?.content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/octet-stream" });

            const dirs = RNFetchBlob.fs.dirs;
            const NEW_FILE_PATH = dirs.DownloadDir + '/' + resume?.filename;

            // RNFetchBlob.fs.writeFile(NEW_FILE_PATH, RNFetchBlob.base64.encode(byteCharacters), 'base64')
            RNFetchBlob.fs.writeFile(NEW_FILE_PATH, item?.response?.content, 'base64')
            showMessage({
                message: "Downloaded Successfully",
                type: "success",
            });

        }
        catch (err) {
            console.log('error catched', err)
        }
    }
    
    const ImageModalHandler = () => {
        setModalVisible(true)
    }

    const handleDocumentSelection = async () => {
        ImagePicker.openPicker({
            // width: 500,
            // height: 600,
            cropping: true,
            includeBase64: true
        }).then(image => {
            setModalVisible(false)
            setImgLoader(true)
            const QUERY_UPLOADPAPER = {
                query: `mutation MyMutation {
                    uploadDocument (
                      content: "${image?.data}", 
                      fileName: "${image?.path}",
                      url: ""
                    )
                  }`,
                variables: null,
                operationName: "MyMutation",
            };

            gqlquery(QUERY_UPLOADPAPER, null)
                .then((res) => res.json())
                .then((datas) => {
                    console.log("profile picture upload", datas);
                    const data = JSON.parse(datas?.data?.uploadDocument);

                    postProfilePic(data?.url);
                    //   setImage(null);
                });
        });

        const postProfilePic = (fileUrl) => {
            const QUERY_POSTPROFILEPIC = {
                query: `mutation MyMutation {
                    updateProfilePicURL(
                        profilePicURL: "${fileUrl ? fileUrl : ""}"
                          ) {
                            profilePicURL
                        }
                      }`,
                variables: null,
                operationName: "MyMutation",
            };

            gqlquery(QUERY_POSTPROFILEPIC, null)
                .then((res) => res.json())
                .then((datas) => {
                    console.log('profile updateProfilePicURL', datas)
                    dispatchAction(getProfileData())
                    setUpdate(update + 1)
                    setImgLoader(false)
                    if (datas?.data?.updateProfilePicURL) {

                        // setTimeout(() => {
                        //   dispatchAction(getProfileImg(profile?.profilePicURL))
                        //   console.log('called')
                        // }, 500)


                    } else {
                    }
                })
                .finally((e) => {
                    console.log("adding image details to database")
                    setImgLoader(false)
                });
        }
    }

    const DeleteProfilePic = async () => {
        setImgLoader(true)
        const QUERY_UPLOADCOMPANYPROFILEPIC = {
            query: `mutation MyMutation {
                  uploadDocument (
                    content: "${base64Image}", 
                    fileName: "${profile?.profilePicURL}",
                    url: ""
                  )
                }`,
            variables: null,
            operationName: "MyMutation",
        };
        gqlquery(QUERY_UPLOADCOMPANYPROFILEPIC, null)
            .then((res) => res.json())
            .then((datas) => {
                const data = JSON.parse(datas?.data?.uploadDocument);
                // console.log('hey >>', datas)
                delets(data?.url);
            })

        const delets = (urls) => {
            const QUERY_ADDRESUME = {
                query: `mutation MyMutation {
              deleteDocument(url: "${urls}")
            }`,
                variables: null,
                operationName: "MyMutation",
            };
            gqlquery(QUERY_ADDRESUME, null)
                .then((res) => res.json())
                .then((datas) => {
                    const response = JSON.parse(datas?.data?.deleteDocument);
                    // console.log('response response>>',response);
                    if (response?.response?.status === "SUCCESS") {

                        const QUERY_POSTPROFILEPIC = {
                            query: `mutation MyMutation {
                          updateProfilePicURL(
                              profilePicURL: "${""}"
                                ) {
                                  profilePicURL
                              }
                            }`,
                            variables: null,
                            operationName: "MyMutation",
                        };

                        gqlquery(QUERY_POSTPROFILEPIC, null)
                            .then((res) => res.json())
                            .then((datas) => {
                                setModalVisible(false)
                                dispatchAction(getProfileData())
                                dispatchAction(getProfileImg(""))
                                if (datas?.data?.updateProfilePicURL) {
                                    setImgLoader(false)
                                } else {
                                    setImgLoader(false)
                                }
                            })
                    } else {
                        setImgLoader(false)
                    }
                })
        }
    }

    useEffect(() => {
    const QUERY_GETRESUMESUGGESTIONS = {
        query: `query MyQueryCopy {
        getResumeHeadlineSuggestion
        }`,
        };
    
        gqlquery(QUERY_GETRESUMESUGGESTIONS, null)
        .then((res) => res.json())
        .then((datas) => {
            
            setResumeHeadlinesuggestion(datas?.data?.getResumeHeadlineSuggestion)
        })
    }, [isFocused])
    
    useEffect(() => {
        if (profileStrength?.completed) {
          const splitArr = profileStrength?.completed?.replace(/ /g, "").split(',')
          console.log('splitarr', splitArr)
          setCompletedeAction(splitArr)
        }
      }, [isFocused, profileStrength?.completed])

    console.log('profileStrength', profileStrength)
    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={styles.headerMainView}>
                <View style={{
                    flex: 3,}}>
                     <View style={{backgroundColor: '#395987', paddingLeft: 30, height: '40%'}}>
                        {/* <Image source={require("../assets/Ellipse_563.png")} style={{ position: 'absolute' }} /> */}
                       <Text style={styles.myProfileTxt}>My Profile</Text>
                    </View> 
                    <View style={styles.headerContentView}>

                        <View style={{ flex: 1, }}>
                            <ProfileMini edit={true} ImageModalHandler={ImageModalHandler} />
                        </View>
                        <View style={{ flexDirection: 'column', flex: 3, marginLeft: wp('8%'), backgroundColor: 'white' }}>
                           
                            <View style={styles.nameView}>
                                <Text style={{
                                    color: 'black',
                                    fontSize: profile?.name?.length >= 23 ? 12 : 16,
                                    fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold", textAlignVertical: 'center'}}>
                                    {profile?.name}
                                </Text>

                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ProfileSettings')
                                }}>
                                    <Ionicons name='pencil' size={18} color={'#395987'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                <Ionicons name='call' size={12} color={'black'} />
                                 <Text style={styles.profileHeaderTxt}>
                                    {profile?.phone}
                                 </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name='location' size={12} color={'black'} />
                                <Text style={styles.profileHeaderTxt}>{profile?.cityWithState}
                                </Text>
                            </View>
                        </View>
                    
                    </View>
                </View>
                {/* <View style={{ flex: 1, flexDirection: 'column', paddingTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Image
                        source={require("../assets/Ellipse_564.png")} style={{ marginTop: hp('4%') }} />
                </View> */}
            </View>

            <View style={styles.profilePercentView}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedCircularProgress
                        size={50}
                        width={3}
                        fill={profileStrength?.strength}
                        tintColor="#395987"
                        backgroundColor="#E4EEF5">
                        {
                            (fill) => (
                                <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: 'Poppins-SemiBold' }}>
                                    {fill ? fill : 0}%
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", lineHeight: 18, color: 'black' }}>Complete your profile to get job faster</Text>
                    <Text style={{ fontSize: 10, fontFamily: "Poppins-Regular", lineHeight: 15, color: '#6F7482', paddingRight: 12 }}>Completed profile has higher chance of getting hired</Text>
                </View>
            </View>
            
    {/* -----------Pending action view----------- */}
        <View style={{marginTop: 15}}>
            <View style={styles.pendingActionToggle}>
                <View style={CommonStyle.RowFlexStyle}>
                    <Text><Ionicons name="alert-circle" size={24} color='#F2B45A' /></Text>
                    <Text style={styles.pendingText}>Pending Actions</Text>
                </View>
                {
                    pendingActionShow ?  <Pressable onPress={() => setPendingActionShow(false)}>
                    <AntDesign name="up" size={18} color='#6F7482' />
                </Pressable> : <Pressable onPress={() => setPendingActionShow(true)}>
                    <AntDesign name="down" size={18} color='#6F7482' />
                </Pressable>
                }
                
            </View>

           {
            pendingActionShow &&  
            <View style={styles.actionItemView}>
                {
                    !completedAction?.includes('resumeUploaded') &&
                    <View style={styles.actionItem}>
                        <Text style={styles.actionItemTxt}>Upload Resume</Text>
                        <Pressable  onPress={() => setFilterSheetShow(true
                        )} >
                        <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                        </Pressable>
                    </View>
                }

                {
                  !completedAction?.includes('phoneVerified') && 
                  <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Verify Phone Number</Text>
                    <Pressable onPress={() => navigation.navigate('AccountSettings')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                 </View>
                }
              {
                 !completedAction?.includes('emailVerified') && 
                 <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Verify Email ID</Text>
                    <Pressable onPress={() => navigation.navigate('AccountSettings')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                </View>
              }
             
             {
                  !completedAction?.includes('propicUploaded') && 
                  <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Add profile picture</Text>
                    <Pressable>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                </View>
             }
             {
                  !completedAction?.includes('educationUploaded') && 
                  <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Add Education</Text>
                    <Pressable onPress={() => navigation.navigate('Addeducation')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                  </View>
             }
            {
              !completedAction?.includes('experienceUploaded') && 
              <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Add Experience</Text>
                    <Pressable onPress={() => navigation.navigate('Addexperience')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                </View>
            }
            {
                !completedAction?.includes('personalDetailsUploaded') && 
                <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Add Personal Details</Text>
                    <Pressable onPress={() => navigation.navigate('ProfileSettings')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                </View>
            }
            {
                !completedAction?.includes('desiredProfileUpdated') && 
                <View style={styles.actionItem}>
                    <Text style={styles.actionItemTxt}>Add desired career details</Text>
                    <Pressable  onPress={() => navigation.navigate('AddcareerProfile')}>
                    <Text style={styles.actionItemPercentTxt}>Add 10%</Text>
                    </Pressable>
                </View>
            }
            </View>
           }
        </View>
    {/* --------------Resume Box--------------- */}
            <View style={styles.resumeBox}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text_sixteen}>Resume</Text>
                    {resume?.filename || headline ?
                        <TouchableOpacity onPress={() => setFilterSheetShow(true
                        )} style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name='pencil' size={12} color={'#395987'}></Ionicons>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setFilterSheetShow(true
                        )} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name='add' size={12} color={'#395987'}></Ionicons>
                            <Text style={{
                                color: '#395987',
                                paddingLeft: 4,
                                //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                                fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                            }}>Add</Text>
                        </TouchableOpacity>}
                </View>
                
                {
                    resume?.filename &&  
                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.resumeFileBox}>
                        {
                             resume?.filename &&  <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            
                             <TouchableOpacity
                                 onPress={() => setFilterSheetShow(true)}
                                 style={styles.resumeBtn}
                             // onPress={() => navigation.navigate('Settings')}
                             >
                                 <Ionicons style={{}} name="document" size={18} color="#395987" />
                                 <Text style={[styles.text_fourteen,{paddingHorizontal: 8}]}>
                                     {
                                         resume?.filename ? <>{resume?.filename.length > 22 ? `${resume?.filename.slice(0, 13)}...pdf` : resume?.filename}</> : 'Upload Resume'
                                     }
                                 </Text>
 
                             </TouchableOpacity>
                         </View>
                        }
                       
                        {
                        resume?.filename ?
                            <TouchableOpacity onPress={() => { hanldeDownloadResume() }} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name='cloud-download' size={20} color="#395987"></Ionicons>
                            </TouchableOpacity>


                            :
                            <Pressable
                                onPress={() => setFilterSheetShow(true)}
                            >
                                {/* <Ionicons name='cloud-upload' size={22} color="#395987" /> */}
                            </Pressable>
                        }
                    </View>

                </View>
                }
               
                {
                   resume?.filename  && <View style={{ width: wp('88%'), alignSelf: 'center', }}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}><Text style={[styles.text_sixteen, {marginBottom: 6, fontFamily: "Poppins-SemiBold",}]}>Resume HeadLine</Text>
                   </View>
                   <View style={{ height: hp('18%') }}>
                       <TextInput
                       // ref={refInput}
                       editable={false}
                       // autoFocus={flag}
                       style={styles.headlineInput}
                       // onChangeText={(text) => {
                       //     if (/^(\w+\s?)*\s*$/.test(text)) {
                       //         console.log('Dukse')
                       //         setHeadline((text).trimStart());
                       //     }
                       //     else {
                       //         setHeadline(text.trimStart())
                       //     }
                       //     handleChange(text.trimStart())
                       //     setHeadlineErr('')
                       // }}
                       numberOfLines={10}
                       multiline={true}
                       autoGrow={false}
                       // numberOfLines={5}
                       // onSubmitEditing={() => setModalVisible(true)}
                       // autoFocus={isedit}
                       // onBlur={() => {
                       //     if (!headline) {
                       //         setHeadlineErr('Text Field cannot be empty')
                       //     } else {
                       //         setHeadlineErr('')
                       //     }
                       // }}
                       placeholder='Description goes here'
                       value={headline ? headline?.replace(/  +/g, " ") : resumeHeadlinesuggestion&& resume?.filename ? resumeHeadlinesuggestion : ''}
                       />
                       <Text
                           style={{ color: "rgba(57, 89, 135, 0.3)", paddingVertical: 5, fontSize: 12, fontFamily: "Poppins-Regular" }}
                       >
                           {/* {`${charactersLeft} Charcter(s) left`} */}
                       </Text>
                       
                   </View>
               </View>
                }
                    
            </View>

            {/* Experience */}
            <View style={styles.profileContents}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text_sixteen}>Work Experience</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Addexperience')
                    }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='add' size={12} color={'#395987'}></Ionicons>
                        <Text style={{
                            color: '#395987',
                            paddingLeft: 4,
                            //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                            fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                        }}>Add</Text>
                    </TouchableOpacity>
                </View>

                {
                    ExperienceList?.map((item, index) => (
                        <View style={{ borderWidth: 1, borderColor: '#E4EEF5', borderRadius: 12, padding: 6 }}>
                            <View style={{ paddingVertical: 8, flexDirection: 'row', }}>


                                <View style={{ flex: 3, }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: 'black', fontSize: 14, lineHeight: 21, fontFamily: "Poppins-SemiBold", }}>{item?.designation}</Text>
                                        <TouchableOpacity onPress={() => {
                                            dispatchAction(setSelectedExperience(item))
                                            navigation.navigate('Addexperience')
                                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name='pencil' size={12} color={'#395987'}></Ionicons>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", }}>{item?.instituteType}, {item?.instituteName}</Text>
                                    <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Medium", }}>{Months?.find((mon) => mon?.hmID == item?.startingMonth)?.name} {" "}
                                        {item?.startingYear} to {item?.workingYear == 0 ? 'Current' : <>{Months?.find((mon) => mon?.hmID == item?.workingMonth)?.name} {item?.workingYear}</>}</Text>
                                    <View style={{ borderBottomWidth: 2, borderColor: '#E4EEF5', marginRight: wp('20%') }}><Text style={{ color: 'black', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Medium", marginBottom: 6 }}>{item?.description?.replace(/<br \/>/g, "\n")}</Text></View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View>

            {/* Education */}
            <View style={styles.profileContents}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text_sixteen}>Education</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Addeducation')
                    }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='add' size={12} color={'#395987'}></Ionicons>
                        <Text style={{
                            color: '#395987',
                            paddingLeft: 4,
                            //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                            fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                        }}>Add</Text>
                    </TouchableOpacity>
                </View>
                {
                    EducationList?.map((item, index) => (
                        <View style={{ borderWidth: 1, borderColor: '#E4EEF5', borderRadius: 12, padding: 6 }}>
                            <View style={{ paddingVertical: 8, flexDirection: 'row', }}>


                                <View style={{ flex: 3, }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: 'black', fontSize: 14, lineHeight: 21, fontFamily: "Poppins-SemiBold", }}>{item?.course || item?.qualification}</Text>

                                        <TouchableOpacity onPress={() => {
                                            dispatchAction(setSelectedEducation(item))
                                            navigation.navigate('Addeducation')
                                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name='pencil' size={12} color={'#395987'}></Ionicons>
                                        </TouchableOpacity>

                                    </View>
                                    <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", }}>{item?.university}</Text>
                                    <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Medium", }}>{item?.yearOfPassing}{`(${item?.courseType})`}</Text>
                                    {/* <View style={{ borderBottomWidth: 2, borderColor: '#E4EEF5', marginRight: wp('20%') }}><Text style={{ color: 'black', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Medium", marginBottom: 6 }}>dskdhskjdhkj</Text></View> */}
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View>
            
            {/* Desired Career */}
            <View style={styles.profileContents}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text_sixteen}>Desired Career</Text>
                    {(careerProfileData || userAvailablity || preferredLocations) ? <TouchableOpacity onPress={() => navigation.navigate('AddcareerProfile')} style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name='pencil' size={12} color={'#395987'}></Ionicons>
                    </TouchableOpacity> :
                        <TouchableOpacity onPress={() => navigation.navigate('AddcareerProfile')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name='add' size={12} color={'#395987'}></Ionicons>
                            <Text style={{
                                color: '#395987',
                                paddingLeft: 4,
                                //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                                fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                            }}>Add</Text>
                        </TouchableOpacity>}
                </View>
                {displayesdesiredDetails === false ?
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ flex: 5, paddingVertical: hp('2%') }}>

                    {
                    <View>
                        {(careerProfileData || userAvailablity || preferredLocations) ? (
                        <View style={styles.container}>
                            <View style={{}}>
                                <View style={styles.detailsView}>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 120 }}>
                                        Desired Industry
                                    </Text>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                        {careerProfileData?.industryName ? careerProfileData?.industryName : "-"}
                                    </Text>
                                </View>

                                <View style={styles.detailsView}>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                        Desired Role Category
                                    </Text>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                        {careerProfileData?.roleCategoryName ? careerProfileData?.roleCategoryName : "-"}
                                    </Text>
                                </View>

                                <View style={styles.detailsView}>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                        Desired Job Type
                                    </Text>
                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                        {careerProfileData?.desiredJobType ? careerProfileData?.desiredJobType : "-"}
                                    </Text>
                                </View>

                            </View>
                        </View>
                        ) : (
                            <></>
                        )
                        }
                    </View>
                    }
                </View>
                </View> :
                <View style={{ flex: 1, backgroundColor: 'white' }}>

                    <View style={{ flex: 5, paddingVertical: hp('2%') }}>


                        {

                            <View>
                                {(careerProfileData || userAvailablity || preferredLocations) ? (
                                    <View style={styles.container}>
                                        <View style={{}}>
                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 120 }}>
                                                    Desired Industry
                                                </Text>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    {careerProfileData?.industryName ? careerProfileData?.industryName : "-"}
                                                </Text>
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                                    Desired Role Category
                                                </Text>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    {careerProfileData?.roleCategoryName ? careerProfileData?.roleCategoryName : "-"}
                                                </Text>
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                                    Desired Job Type
                                                </Text>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    {careerProfileData?.desiredJobType ? careerProfileData?.desiredJobType : "-"}
                                                </Text>
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 140 }}>
                                                    Desired Employment Type
                                                </Text>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    {careerProfileData?.desiredEmploymentType ? careerProfileData?.desiredEmploymentType : "-"}
                                                </Text>
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                                    Desired Shift
                                                </Text>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    {careerProfileData?.desiredShift ? careerProfileData?.desiredShift : "-"}
                                                </Text>
                                            </View>

                                            <View style={{

                                                justifyContent: "space-between",

                                                display: 'flex',
                                                flexDirection: 'row',
                                                // height: hp('6%'),
                                                backgroundColor: '#FAFAFD',
                                                borderRadius: 12,
                                                marginTop: 7,
                                                alignItems: 'center',
                                                paddingHorizontal: 10,
                                            }}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 130 }}>
                                                    Preferred Work Location
                                                </Text>
                                                <View style={{ width: 160, }}>
                                                    {
                                                        preferredLocations?.map((item, index) => (
                                                            <Text key={index} style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', }}>
                                                                {item?.cityWithState}{','}
                                                            </Text>
                                                        ))
                                                    }
                                                    {careerProfileData?.isAnywhereFromIndia == true && <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', }}>
                                                        Anywhere in India
                                                    </Text>}
                                                    {preferredLocations.length === 0 && careerProfileData?.isAnywhereFromIndia == false && <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', }}>
                                                        -
                                                    </Text>}
                                                </View>
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", marginVertical: 5, width: 120 }}>
                                                    Expected Salary
                                                </Text>
                                                {careerProfileData?.expectedSalaryEnd != 0 && <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>

                                                    {/* {`${careerProfileData?.expectedSalaryStart ? careerProfileData?.expectedSalaryStart : ''} lakh INR - ${careerProfileData?.expectedSalaryEnd ? careerProfileData?.expectedSalaryEnd : ''} lakh INR`} */}
                                                    {`${careerProfileData?.expectedSalaryEnd ? careerProfileData?.expectedSalaryEnd : ''} lakh INR`}
                                                </Text>}
                                                {(careerProfileData?.expectedSalaryStart == 0 && careerProfileData?.expectedSalaryEnd == 0) && <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                    -
                                                </Text>}
                                            </View>

                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", width: 130 }}>
                                                    Communication Preference
                                                </Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5, width: 160, }}>
                                                        {careerProfileData?.phoneOpted && "Phone"}
                                                        {(careerProfileData?.phoneOpted && careerProfileData?.emailOpted) && ", "}
                                                        {careerProfileData?.emailOpted && "Email"}
                                                        {(careerProfileData?.phoneOpted || careerProfileData?.emailOpted) && (careerProfileData?.whatsappOpted) && ", "}
                                                        {careerProfileData?.whatsappOpted && "WhatsApp"}
                                                        {((careerProfileData?.phoneOpted || careerProfileData?.emailOpted || careerProfileData?.whatsappOpted) && (careerProfileData?.smsOpted)) && ", "}
                                                        {careerProfileData?.smsOpted && "SMS"}
                                                        {!careerProfileData?.phoneOpted && !careerProfileData?.emailOpted && !careerProfileData?.smsOpted && !careerProfileData?.whatsappOpted && "-"}
                                                    </Text></View>
                                            </View>
                                            <View style={styles.detailsView}>
                                                <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: "#6F7482", width: 130 }}>
                                                    Available Timing
                                                </Text>
                                                <View style={{ flexDirection: 'row', width: 160 }}>
                                                    {
                                                        userAvailablity?.map((item, index) => (
                                                            <Text key={index} style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5 }}>
                                                                {item?.day} {fromTimeArr[item?.fromTime]} {"-"}{" "}
                                                                {toTimeData[item?.toTime]}
                                                            </Text>
                                                        ))
                                                    }
                                                    {userAvailablity.length === 0 && <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-SemiBold", color: 'black', marginVertical: 5 }}>
                                                        -
                                                    </Text>}
                                                </View>
                                            </View>
                                        </View>



                                    </View>
                                ) : (
                                    <></>
                                )
                                }
                            </View>
                        }
                    </View>
                </View>
                }
                {displayesdesiredDetails === false ?
                    <TouchableOpacity onPress={() => setDisplayedDesiredDetails(prev => !prev)} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', }}>
                        <Ionicons name='add' size={12} color={'#395987'}></Ionicons>
                        <Text style={{
                            color: '#395987',

                            paddingLeft: 4,
                            //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                            fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                        }}>Show more</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', }} onPress={() => setDisplayedDesiredDetails(prev => !prev)}>
                        <Ionicons name='remove' size={12} color={'#395987'}></Ionicons>
                        <Text style={{
                            color: '#395987',
                            paddingLeft: 4,
                            //  fontSize: profile?.name.length >= 23 ? 12 : 16,
                            fontSize: 12, lineHeight: 28, fontFamily: "Poppins-SemiBold",
                        }}>Show less</Text>
                    </TouchableOpacity>}
            </View>

            <View style={styles.accountSettingView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={styles.text_sixteen}>Account Settings</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AccountSettings')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='pencil' size={12} color={'#395987'}></Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
        
       
            <UploadResumeBottomSheet modalShow={filterSheetShow} setModalShow={setFilterSheetShow} />

            <DeleteAccountBottomSheet modalShow={deleteSheetShow} setModalShow={setDeleteSheetShow} />
            <BottomSheet onBackdropPress={() => setModalVisible(false)} modalProps={{}} isVisible={modalVisible}>
                <View style={{ paddingTop: 7, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <View style={styles.emptyView}></View>
                    {/* <TouchableOpacity style={styles.bottomSheetItemView}>
              <Text> <FontAwesome name="camera" size={20} color='#4F4F4F' /></Text>
              <Text style={styles.bottomSheetText}>View Profile Picture</Text>
            </TouchableOpacity> */}
                    <TouchableOpacity onPress={handleDocumentSelection} style={styles.bottomSheetItemView}>
                        <Text> <MaterialIcons name="add-photo-alternate" size={24} color='#4F4F4F' /></Text>
                        <Text style={styles.bottomSheetText}>Add Profile Picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={DeleteProfilePic} style={styles.bottomSheetItemView}>
                        <Text> <MaterialCommunityIcons name="delete" size={24} color='#4F4F4F' /></Text>
                        <Text style={styles.bottomSheetText}>Remove Profile Picture</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    bottomSheetText: {
        color: '#4F4F4F',
        fontSize: 15, lineHeight: 18, fontFamily: "Poppins-Regular",
        marginLeft: 7
    },
    bottomSheetItemView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    detailsView: {
        // display: 'flex',
        height: hp('6%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
        borderRadius: 12,
        paddingHorizontal: 10,
        backgroundColor: '#FAFAFD',
        justifyContent: "space-between"
    },
    locationView: {
        display: 'flex',
        flexDirection: 'row',
        height: hp('6%'),
        backgroundColor: '#FAFAFD',
        borderRadius: 12,
        marginTop: 7,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    
   
    profileHeaderTxt:{color: 'black', fontSize: 12, lineHeight: 21, fontFamily: "Poppins-Regular", paddingLeft: 7 },
    nameView:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContentView: { flex: 3, flexDirection: 'row', paddingHorizontal: wp('5%') , backgroundColor: 'white',paddingTop: 20},
    myProfileTxt:{
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: 'white',
        marginTop: 20
    },
    profilePercentView:{ borderColor: "#E4EEF5", borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 12 , marginTop: 20},
    headerMainView:{ flex: 2, height: hp('20%'), flexDirection: 'row' },
    profileContents:{ paddingVertical: 12, borderColor: "#E4EEF5", borderBottomWidth: 1, marginHorizontal: wp('6%') },
    text_sixteen:{
        color: 'black',
        //  fontSize: profile?.name.length >= 23 ? 12 : 16,
        fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold",
    },
    resumeBox:{ paddingVertical: 12, borderColor: "#E4EEF5", justifyContent: 'center', borderBottomWidth: 1, marginHorizontal: wp('6%') },
    resumeFileBox:{
        height: hp('8%'), alignItems: 'center', backgroundColor: '#FAFAFD', borderRadius: 12, width: wp('88%'), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp('4%'),
    },
    text_fourteen: {
        fontSize: 14, 
        lineHeight: 21, 
        color: "black",
        fontFamily: "Poppins-Medium",
    },
    resumeBtn: {
        borderRadius: 8,
        height: 50,
        borderWidth: 1,
        // width: 250,
        borderColor: '#FAFAFD',
        backgroundColor: '#FAFAFD',
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        // marginBottom: 16,
        // marginHorizontal: 10,
    },
    headlineInput:{
        height: hp('17%'),

        // flex: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        textAlignVertical: "top",
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Regular",
        color: 'black', borderColor: '#E4EEF5',
    },
    accountSettingView:{ borderColor: "#E4EEF5", borderBottomWidth: 1, marginHorizontal: wp('6%'), paddingVertical: 12, marginBottom: hp('6%') },
    pendingActionToggle:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 25
    },
    pendingText:{
        fontSize: 14, lineHeight: 21, 
        color: "black",
        fontFamily: "Poppins-Medium",
        marginLeft: 5
    },
    actionItemView:{
    paddingHorizontal: 17
    },
    actionItem:{
        borderWidth: 2,
        borderColor: '#E4EEF5',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 10
    },
    actionItemTxt:{
        fontSize: 12, 
        color: "#6F7482",
        fontFamily: "Poppins-Regular",
    },
    actionItemPercentTxt:{
        fontSize: 12, 
        color: "#395987",
        fontFamily: "Poppins-Medium",
    }
})





