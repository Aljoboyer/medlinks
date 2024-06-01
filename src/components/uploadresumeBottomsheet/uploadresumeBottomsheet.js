import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BottomCoupleButton from '../BottomCoupleButton/BottomCoupleButton';
import DocumentPicker, { DirectoryPickerResponse } from 'react-native-document-picker';
import ReactNativeBlobUtil from 'react-native-blob-util'
import { gqlquery } from '../../api/doctorFlow';
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { showMessage } from 'react-native-flash-message';
import RNFetchBlob from "rn-fetch-blob";
import { DataContext } from '../../Context/GlobalState';
import { getResumeDetails, getResumeHeadline } from '../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
export default function SingleItemBottomSheet({ modalShow, setModalShow }) {
    const [headline, setHeadline] = useState('fdjgfsjdgfjsfgj')
    const [headlinetemp, setHeadlinetemp] = useState("");
    const dispatchAction = useDispatch();
    const [deleteload, setDeleteload] = useState(false);
    const [loading, setLoading] = useState(false)
    const [checked, setchecked] = useState(-1)
    const [state, dispatch] = useContext(DataContext)
    const [charactersLeft, setCharactersLeft] = useState(500);
    const [resumeHeadlinesuggestion, setResumeHeadlinesuggestion] = useState('');
    let getResumeHeadlineSuggestionArray = resumeHeadlinesuggestion?.split("^");
    const isFocused = useIsFocused()
    const resume = useSelector((state) => state.profiletabstore.resumeDetails);
    const resumeHeadline = useSelector((state) => state.profiletabstore.resumeHeadline);
    const [headlineErr, setHeadlineErr] = useState('')
    const [confirmationModal, setConfirmationModal] = useState(false);
    useEffect(() => {
        if (resumeHeadline) {
            setHeadline(resumeHeadline?.headline?.replace(/<br \/>/g, "\n"))
            setHeadlinetemp(resumeHeadline?.headline?.replace(/<br \/>/g, "\n"))
        }
        else {
            setHeadline("")
        }
    }, [resumeHeadline?.headline, isFocused]);

    useEffect(() => {
        GetSuggestion()
        dispatchAction(getResumeDetails())
        dispatchAction(getResumeHeadline())
    }, [isFocused])


    const GetSuggestion = async () => {
        const QUERY_GETRESUMESUGGESTIONS = {
            query: `query MyQueryCopy {
          getResumeHeadlineSuggestion
        }`,
        };

        gqlquery(QUERY_GETRESUMESUGGESTIONS, null)
            .then((res) => res.json())
            .then((datas) => {
                // console.log("mmmmmmmmmmmmm", datas)
                setResumeHeadlinesuggestion(datas?.data?.getResumeHeadlineSuggestion)
            })
    }

    const handlePdfSelection = async () => {

        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory',
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
            })
            const fileUri = response[0]?.fileCopyUri?.replace(/%20/g, " ")
            console.log('resume res', response)
            const file = await ReactNativeBlobUtil.fs.readFile(
                fileUri,
                'base64',
            );

            // setFiles(file)
            // setFileSize(response[0]?.size)

            if (parseFloat(response[0]?.size / 1024 / 1024).toFixed(2) < 2) {
                // setResumeLoad(true)
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
                };
                gqlquery(QUERY_ADDRESUME, null)
                    .then((res) => res.json())
                    .then((datas) => {
                        dispatchAction(getResumeDetails())
                        // setUpdated((pre) => !pre);
                        // setResumeLoad(false)
                        // setFiles(null);
                        // setResumeName(response[0]?.name)
                        showMessage({
                            message: "Resume Uploaded Successfully",
                            type: "success",
                        });

                    }).finally(() => {
                        // setResumeLoad(false)
                    });
            }
            else {
                showMessage({
                    message: "Please select File lessthan 2MB",
                    type: "danger",
                });

            }

        } catch (err) {
            console.log('resume pick err', err)
        }
    };

    const handleChange = (text) => {

        if (charactersLeft > 0) {
            setCharactersLeft(500 - text.length);
        }
        else {
            setCharactersLeft(500 - text.length);
        }
    };

    const handleDeleteResume = async () => {
        setDeleteload(true);
        const QUERY_ADDRESUME = {
            query: `mutation MyMutation {
          deleteDocument(url: "${resume?.url}")
        }`,
            variables: null,
            operationName: "MyMutation",
        };
        gqlquery(QUERY_ADDRESUME, null)
            .then((res) => res.json())
            .then((datas) => {
                console.log('this is datas', datas)
                const response = JSON.parse(datas?.data?.deleteDocument);
                // console.log(response);
                if (response?.response?.status === "SUCCESS") {
                    const QUERY_DELETERESUME = {
                        query: `mutation MyMutation {
                  deleteResume
              }`,
                        variables: null,
                        operationName: "MyMutation",
                    };
                    gqlquery(QUERY_DELETERESUME, null)
                        .then((res) => res.json())
                        .then((datas) => {
                            dispatchAction(getResumeDetails())
                            // setUpdated(pre => !pre);
                            setConfirmationModal(false)
                            // setHeadline('')
                            // setResumeName('')
                            setModalShow(false)
                            setDeleteload(false);
                            showMessage({
                                message: "Resume Deleted",
                                type: "success",
                            });
                            // setModalVisible(false)
                        });
                } else {
                    setDeleteload(false);
                    // setOpen(true);
                }
            })

    }


    const handleSaveResumeHeadline = async (e) => {
        if (headline.trim().length == 0) {
            setHeadlineErr('Resume headline input field cannot be empty.')
            return;
        }
        else {
            setHeadlineErr('')
        }
        setLoading(true)
        // setSaveload(true);
        const newHeadline = String(headline).replace(/\n/g, "<br />")

        if (headline.length > 0) {
            const QUERY_ADDRESUMEHEADLINE = {
                query: `mutation MyMutation {
                updateResumeHeadline (
                  headline: "${newHeadline}"
                )
              }`,

                variables: null,
                operationName: "MyMutation",
            };
            gqlquery(QUERY_ADDRESUMEHEADLINE, null)
                .then((res) => res.json())
                .then((datas) => {
                    console.log('Headline saved', QUERY_ADDRESUMEHEADLINE);
                    setchecked(-1)
                    dispatchAction(getResumeDetails())
                    dispatch(getResumeHeadline())
                    setLoading(false)

                    showMessage({
                        message: "Resume Headline Added",
                        type: "success",
                    });
                    setModalShow(false)
                    // setResumeLoad(false)
                    // setHeadline("");
                    headline.length = 0;
                })
        }
    };




    return (

        <BottomSheet onBackdropPress={() => setModalShow(false)} modalProps={{}} isVisible={modalShow}>
            <View style={styles.BottomSheetView}>
                <View style={styles.emptyView}></View>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headerTitle}>Resume</Text>
                    <Pressable onPress={() => setModalShow(false)}>
                        <Entypo color="#6F7482" name="cross" size={24} />
                    </Pressable>
                </View>

                {/* here resume */}
                <View style={{
                    height: hp('8%'), alignItems: 'center', backgroundColor: '#FAFAFD', borderRadius: 12, width: wp('88%'), flexDirection: 'row', marginVertical: 12, justifyContent: 'space-between', paddingHorizontal: wp('4%'),alignSelf:'center'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={handlePdfSelection}
                            style={{
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
                            }}
                        >
                            <Ionicons style={{}} name="document" size={18} color="#395987" />
                            <Text style={{
                                fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Medium",
                                color: "black",
                                paddingHorizontal: 8
                            }}>
                                {
                                    resume?.filename ? <>{resume?.filename.length > 22 ? `${resume?.filename.slice(0, 10)}...pdf` : resume?.filename}</> : 'Upload Resume'
                                }
                            </Text>


                        </TouchableOpacity>

                    </View>
                    {
                        resume?.filename ?
                            <TouchableOpacity onPress={() => { setConfirmationModal(true) }} style={{ height: hp('4%'), width: wp('8%'), borderRadius: 5, backgroundColor: '#EB575720', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name='trash-outline' size={20} color="#EB5757"></Ionicons>
                            </TouchableOpacity>


                            :
                            <Pressable
                                onPress={handlePdfSelection}

                            ><Ionicons name='cloud-upload' size={22} color="#395987" /></Pressable>
                    }


                </View>

                {/* resume headline */}
                <View style={{ width: wp('88%'), alignSelf: 'center', paddingVertical: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}><Text style={{ color: 'black', marginBottom: 6, fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold", }}>Resume Headline</Text>
                    </View>

                    <View style={{ height: hp('18%') }}><TextInput
                        // ref={refInput}
                        editable={true}
                        autoFocus={true}
                        style={{
                            height: hp('17%'),

                            // flex: 1,
                            justifyContent: "flex-start",
                            paddingHorizontal: 10,
                            textAlignVertical: "top",
                            borderWidth: 1,
                            borderRadius: 10,
                            fontSize: 14, lineHeight: 21, fontFamily: "Poppins-Regular",
                            color: 'black', borderColor: '#E4EEF5',
                        }}
                        onChangeText={(text) => {
                            if (/^(\w+\s?)*\s*$/.test(text)) {
                                console.log('Dukse')
                                setHeadline((text).trimStart());
                            }
                            else {
                                setHeadline(text.trimStart())
                            }
                            handleChange(text.trimStart())
                            setHeadlineErr('')
                        }}
                        numberOfLines={10}
                        multiline={true}
                        autoGrow={false}
                        // numberOfLines={5}
                        // onSubmitEditing={() => setModalVisible(true)}
                        // autoFocus={isedit}
                        onBlur={() => {
                            if (!headline) {
                                setHeadlineErr('Text Field cannot be empty')
                            } else {
                                setHeadlineErr('')
                            }
                        }}
                        placeholder='Description goes here'
                        value={headline?.replace(/  +/g, " ")} /><Text
                            style={{ color: "rgba(57, 89, 135, 0.3)", paddingVertical: 5, fontSize: 12, fontFamily: "Poppins-Regular" }}
                        >
                            {`${charactersLeft} Charcter(s) left`}
                        </Text></View>

                    {/* {headlineErr && <ErrorText error={headlineErr} />} */}
                </View>
                {/* resume headline suggestionss */}
                {/* {getResumeHeadlineSuggestionArray?.length > 0 &&
                    getResumeHeadlineSuggestionArray?.map((item, index) => (
                        item != headlinetemp &&
                        <Pressable onPress={() => {
                            if (checked != index) {
                                setchecked(index)

                                setTimeout(() => {
                                    setHeadline(item);
                                }, 500)
                            }
                            else {
                                setchecked(-1)
                                setHeadline(headlinetemp)

                            }
                            // setEmploymentTypeErr('')
                        }} key={index} style={{ width: wp('90%'), alignSelf: 'center', borderWidth: 1, borderColor: '#E4EEF5', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: '#E4EEF5', paddingVertical: 12, marginVertical: 3 }}>

                            <View style={[styles.radioContent, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                                <View style={[styles.outerCircle, checked == index && styles.selectedOuterCircle]}>
                                    <View style={[styles.innerCircle, checked == index && styles.selectedInnerCircle]}></View>
                                </View>
                            </View>

                            <View style={{ flex: 4 }}>
                                <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: checked == index ? 'gray' : '#6F7482', lineHeight: 18 }}>{item}</Text>
                            </View>
                        </Pressable>

                    ))} */}

            </View>
            <BottomCoupleButton BackBtn={false} nextHandler={() => handleSaveResumeHeadline()} isLoad={loading} title1='Back' title2='Save' />
            <Modal
                animationType="fade"
                transparent={false}
                visible={confirmationModal}
                onRequestClose={() => {
                    setConfirmationModal(!confirmationModal)
                }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={{
                        // alignItems: 'center',
                        backgroundColor: 'white',
                        // marginVertical: 60,
                        width: '80%',
                        height: hp('28%'),
                        padding: 16,

                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 12,
                        elevation: 10,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ color: 'black', fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold", marginBottom: 12 }}>Delete Resume?</Text>
                            <TouchableOpacity onPress={() => setConfirmationModal(false)}>
                                <Ionicons name='close' color="black" size={22} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", color: 'gray', marginBottom: 12 }}>Your chance of being hired would be limited without a resume. Are you sure you want to delete resume?</Text>


                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginVertical: 25,
                                alignItems: "center",

                            }}
                        >
                            {
                                deleteload ? <TouchableOpacity
                                    style={{
                                        borderRadius: 13,
                                        height: 44,
                                        borderWidth: 1,
                                        width: 110,
                                        borderColor: '#C7D3E3',
                                        backgroundColor: '#C7D3E3',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 13, fontFamily: "Poppins-Medium",
                                        color: "white",
                                    }}>Deleting....</Text>
                                </TouchableOpacity> :
                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 13,
                                            height: 44,
                                            borderWidth: 1,
                                            width: 110,
                                            borderColor: '#C7D3E3',
                                            backgroundColor: '#C7D3E3',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 16,
                                        }}
                                        onPress={() => handleDeleteResume()}
                                    >
                                        <Text style={{
                                            fontSize: 14, fontFamily: "Poppins-Medium",
                                            color: "white",
                                        }}>Yes</Text>
                                    </TouchableOpacity>
                            }
                            <TouchableOpacity
                                style={{
                                    borderRadius: 13,
                                    height: 44,
                                    borderWidth: 1,
                                    width: 110,
                                    borderColor: '#395987',
                                    backgroundColor: '#395987',

                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 16,

                                }}
                                onPress={() => setConfirmationModal(false)}
                            >
                                <Text
                                    style={{
                                        fontSize: 14, fontFamily: "Poppins-Medium",
                                        color: "white",
                                    }}
                                >
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </BottomSheet>

    )
}

const styles = StyleSheet.create({
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
        height: 650,
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
        height: 55,
        paddingHorizontal: 20
    },
    headerTitle: {
        color: '#395987',
        fontSize: 16,
        // fontWeight: '700',
        fontFamily: 'Poppins-SemiBold',
    },
    emptyView: {
        height: 8,
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
});