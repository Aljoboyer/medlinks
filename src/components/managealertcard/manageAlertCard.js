import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { gqlquery } from '../../api/doctorFlow';
import { BottomSheet as JobAlertBottomSheet } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { setSearchParams, setSelectedJobAlert } from '../../Redux_Mine/Redux_Slices/GlobalSettingSlice';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function ManageAlertCard({ item, setChanges }) {
    const [loading, setLoading] = useState(false);
    const [jobAlertDeleteModal, setJobAlertDeleteModal] = useState(false);
    const dispatchAction = useDispatch()
    const [flag, setflag] = useState(false)
    const [deleteID, setDeleteID] = useState('')
    const navigation = useNavigation();
    
    const showConfirmDialog = (deleteID) => {
        // deletealert(deleteID)
        setDeleteID(deleteID)
        setJobAlertDeleteModal(true)
    };

    const deletealert = async () => {
        setLoading(true)
        setJobAlertDeleteModal(false)


        const QUERY_DELETEALERT = {
            query: `mutation MyMutation {
            deleteAlert(jsaID:${Number(deleteID)})
            }`,
            variables: null,
            operationName: "MyMutation",
        };
        // const QUERY_DELETEALERT = {
        //     query: `mutation MyMutation {
        //             deleteAlert(jsaID: "${deleteID}") {
        //               alertName
        //               education
        //               expMax
        //               expMin
        //               hospitals
        //               jobType
        //               jsaID
        //               keyword
        //               location
        //               locationTop
        //               maximumSalary
        //               specialization
        //               minimumSalary
        //               profession
        //             }
        //           }
        //         `,
        //     variables: null,
        //     operationName: "MyMutation",
        // };
        gqlquery(QUERY_DELETEALERT, null)
            .then((res) => res.json())
            .then((data) => {
                console.log("deleted alerts", data);
                // setAllalerts(data);

                showMessage({
                    message: "Deleted Job Successfully",
                    type: "success",
                    hideStatusBar: true
                });
                setLoading(false)
                setChanges((prev) => !prev);
            });
    }

    return (
        <View style={{ width: wp('90%'), marginVertical: 4, borderRadius: 18, borderWidth: 1.5, borderColor: "#E4EEF5", padding: 8, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp('2%') }}>
                <Text style={{ color: 'black', fontSize: 14, lineHeight: 21, fontFamily: "Poppins-SemiBold", marginTop: 4 }}>{item?.alertName || item?.keyword}</Text>
                <View style={{ flexDirection: 'row', }}>
                   

                    {flag === false ? <TouchableOpacity onPress={() => setflag(prev => !prev)}
                    >
                        <Ionicons name='ellipsis-vertical' size={20} color="#6F7482"></Ionicons>
                    </TouchableOpacity> : <TouchableOpacity onPress={() => setflag(prev => !prev)}
                    >
                        <Ionicons name='ellipsis-vertical-circle' size={25} color="#6F7482" ></Ionicons>
                    </TouchableOpacity>}
                </View>
            </View>
            <View style={{ flexDirection: 'row', height: hp('8%') }}>
                <View style={{ flexDirection: 'column', flex: 2, paddingTop: hp('2%'), }}>
                    <View style={styles.iconView}>
                        <Ionicons name="location" size={18} color='#E4EEF5' />
                        <Text style={[styles.regularTxt, { marginLeft: 5 }]}>{item?.locationTop ? item?.locationTop : item?.location ? item?.location : "NA"}</Text>
                    </View>
                    <View style={[styles.iconView, { marginTop: 6 }]}>
                        <Ionicons name="bag" size={18} color='#E4EEF5' />
                        <Text style={[styles.regularTxt, { marginLeft: 5 }]}>
                            {item?.exp ? item?.exp : item?.expMax}
                        </Text>
                    </View></View>
                <View style={{ height: hp('8%'), flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 15 }}>
                    {flag === true &&
                        <View style={{ flexDirection: 'column', height: hp('8%'), width: wp('20%'), borderWidth: 1, borderColor: '#E4EEF5', borderRadius: 6 }}>
                            <TouchableOpacity onPress={() => {
                                dispatchAction(setSelectedJobAlert(item))
                                
                                navigation.navigate('CreateAlertScreen')}} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4EEF5' }}>
                                <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", textAlign: 'center', textAlignVertical: 'center' }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showConfirmDialog(item?.jsaID)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", textAlign: 'center', textAlignVertical: 'center' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            </View>
            
            <View style={{ flexDirection: 'column', paddingHorizontal: wp('2%') }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                   
                    <TouchableOpacity onPress={() => {
                        dispatchAction(setSearchParams({
                            keyword: item?.keyword || item?.alertName,
                            searchlocation: item?.location,
                            searchmaximumSalary: item?.maximumSalary,
                            searchminimumSalary: item?.minimumSalary,
                            searchminexp: item?.expMin,
                            searchmaxexp: item?.expMax,
                            searchedu: item?.education,
                            searchhospital: item?.hospitals,
                            alertSearchSkill: item?.skill,
                            alertSearchSpecialization: item?.specialization,
                            alertSearchJobType: item?.jobType
                        }))
                        navigation.navigate("SearchJob");
                    }} style={{ height: hp('5%'), borderRadius: 6, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: '#395987', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Medium", alignSelf: 'center' }}>View Jobs</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <JobAlertBottomSheet onBackdropPress={() => setJobAlertDeleteModal(false)} modalProps={{}} isVisible={jobAlertDeleteModal}>
                <View style={{ padding: 20, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <Text style={{ color: 'black', fontSize: 16, lineHeight: 18, fontFamily: "Poppins-SemiBold", marginBottom: 12 }}>Are you sure want to delete this job alert ?</Text>

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: 'flex-end', marginTop: 30 }}>
                        <TouchableOpacity style={[styles.button2, { marginRight: 10 }]} onPress={() => { setJobAlertDeleteModal(false) }}>
                            <Text style={{ color: "black", fontSize: 13, lineHeight: 18, fontFamily: "Poppins-Medium", }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.saveButton, { marginLeft: 10 }]} onPress={deletealert}>
                            <Text style={[styles.title, { color: '#395987' }]}>Yes</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </JobAlertBottomSheet>

            
        </View>
    )
}

const styles = StyleSheet.create({
    iconView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    regularTxt: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#6F7482',
    },
});