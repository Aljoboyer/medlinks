import { View, Text, StyleSheet, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BottomCoupleButton from '../BottomCoupleButton/BottomCoupleButton';
import { DataContext } from '../../Context/GlobalState';
import TextBoxes from '../textBoxes/textBoxes';

import { ScrollView } from 'react-native';
import {getProfileData} from "../../Redux_Mine/Redux_Slices/ProfileSlice"

import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from 'react-redux';
import { gqlquery } from '../../api/doctorFlow';
export default function DeleteAccountBottomSheet({ modalShow, setModalShow }) {
    const [state, dispatch] = useContext(DataContext)
    const reasonsToDelete = [
        { label: "Want to remove my digital footprint" },
        { label: "Not interested" },
        { label: "Not looking for a job" },
        { label: "Did not find a job" },
        { label: "Found job" },
        { label: "Not satisfied with the service" },
        { label: "Too many spam calls/emails" },
        { label: "Not willing to share feedback" },
        { label: "Reason not listed" }
    ];
    const [reason, setReason] = useState("")
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const profile = useSelector((state) => state.profilestore.profileData);
    console.log("const profile = useSelector((state) => state.profilestore.profileData);",profile)
    const handleDeleteAccount = async () => {
        const MUTATION_DELETE_ACCOUNT_REQUEST = {
            query: `mutation MyMutation {
            deleteJSAccountRequest(emailID: "${profile?.email || ""}", phoneNumber: "${profile?.phone || ""}", reason: "${reason}")
          }`,
            variables: null,
            operationName: "MyMutation",
        };

        gqlquery(MUTATION_DELETE_ACCOUNT_REQUEST, null)
            .then((res) => res.json())
            .then((datas) => {

                // setdeleteModal(true);
                console.log("dats pf delete ", datas, MUTATION_DELETE_ACCOUNT_REQUEST)
                if (datas?.data?.deleteJSAccountRequest === "SentRequest") {
                    showMessage({ type: 'success', message: 'Request to delete account sent successfully', duration: 2000 })
                } else showMessage({ type: 'danger', message: 'Request to delete account failed', duration: 2000 })
                setModalShow(false);
                // handleCloseDeleteAccountModal();
            });
    }
    return (

        <BottomSheet onBackdropPress={() => setModalShow(false)} modalProps={{}} isVisible={modalShow}>
            {/* <ScrollView style={{ flex: 1 }}> */}
                <View style={styles.BottomSheetView}>
                    <View style={styles.emptyView}></View>
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.headerTitle}>Request Delete Account</Text>
                        <Pressable onPress={() => setModalShow(false)}>
                            <Entypo color="#6F7482" name="cross" size={24} />
                        </Pressable>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <TextBoxes title='Primary Email' placeHolder="Enter full name" extra={false}
                        value={profile?.email}
                        editable={false}
                        />
                        <TextBoxes title='Contact Number' placeHolder="Enter full name" extra={false}
                            keyboardType='number-pad'
                            maxLength={10}
                            value={profile?.phone}
                            editable={false}
                        />
                        <View style={{ marginTop: hp('3%'), height: hp('0.2%'), backgroundColor: '#E4EEF5' }}></View>
                        <Text style={{ color: 'black', fontSize: 16, lineHeight: 24, fontFamily: "Poppins-SemiBold", marginBottom: 3 }}>Reason For Account Delete</Text>
                        <View style={{ flexDirection: 'column' }}>
                            {reasonsToDelete?.map((item, index) => {
                                return (
                                    <Pressable onPress={() => setReason(item?.label)} style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginVertical: 5,
                                    }} key={index}>
                                        <View style={[styles.outerCircle, reason == item?.label && styles.selectedOuterCircle]}>
                                            <View style={[styles.innerCircle, reason == item?.label && styles.selectedInnerCircle]}></View>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21, color: reason == item?.label ? 'black' : '#6F7482' }}>{item?.label}</Text>
                                    </Pressable>)
                            })}

                        </View>

                    </View>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    // alignItems: 'flex-start',
                    height: hp('17%'),
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
                    position: 'absolute',
                    bottom: 0,
                    width: "100%",
                }}>
                    <Text style={{ color: '#6F7482', fontSize: 12, lineHeight: 18, fontFamily: "Poppins-Regular", marginBottom: 8, textAlign: 'center', paddingHorizontal: wp('6%') }}>This is one time process and request
                        cannot be undone</Text>
                    <View style={[styles.btnView]}>

                        <Pressable style={styles.backBtn} onPress={()=>setModalShow(false)} >
                            <Text style={styles.backBtnText}>Cancel & go back</Text>
                        </Pressable>


                        {
                            loading ? <Pressable style={styles.nextBtn}>
                                <Text style={styles.nextBtnText}>Saving...</Text>
                            </Pressable> : <Pressable style={styles.nextBtn} onPress={handleDeleteAccount} >
                                <Text style={styles.nextBtnText}>Confirm</Text>
                            </Pressable>
                        }

                    </View>
                </View>

            {/* </ScrollView> */}
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
    btnView: {

        flexDirection: 'row',
        justifyContent: 'center'
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
    searchInput: {
        paddingLeft: 10,
        width: '80%',
        color: 'black',
        fontFamily: 'Poppins-Regular'
    },
    BottomSheetView: {
        backgroundColor: 'white',
        height: 700,
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
});