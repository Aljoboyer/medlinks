import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native'
import React,{useReducer} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { setJobVacancyID}  from "../../Redux_Mine/Redux_Slices/JobSlice"

export default function JobCard({ jobItem, from = '', unSaveHandler }) {
    const navigation = useNavigation()
  const dispatchAction = useDispatch()
    return (
        <TouchableOpacity 
        onPress={() => {
            dispatchAction(setJobVacancyID(jobItem?.vacancyID))
            // dispatchAction(getSimilarJobs(item.vacancyID))
            // return;
            navigation.navigate('SingleJobPage', { vacancyID: jobItem?.vacancyID, hospitalID: jobItem?.hospitalID, hospitalName: jobItem?.hospitalName })
        }} 
        style={styles.JobCardMainView}>
            {/* -----------Header----------- */}
            <View style={styles.jobCardHeader}>
                <View>

                    {jobItem?.logo !== 'data:image/png;base64,' ? <Image
                        source={{
                            uri: `${jobItem?.logo}`,
                        }}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#D9D9D9",
                            resizeMode: "cover",
                        }}
                    /> :
                        <Avatar
                            size={32}
                            title={jobItem?.hospitalName?.split(" ")[0]?.charAt(0)?.toUpperCase().concat(jobItem?.jobItem?.hospitalName?.split(" ")?.length > 1 ? jobItem?.hospitalName?.split(" ")[1]?.charAt(0)?.toUpperCase() : "")}
                            containerStyle={{ backgroundColor: "rgb(242, 153, 74)", borderRadius: 4, fontSize: 12, color: "white" }}
                        />}
                </View>
                <View style={{ marginLeft: 13,flex:1 }}>
                    <View style={[styles.titleView]}>
                        <Text style={styles.cartTitle}>{jobItem?.jobRole}</Text>
                        <Text style={styles.regularTxt}>{jobItem?.hospitalName}</Text>
                    </View>
                </View>
            </View>

            {/* --------------Info content------------- */}
            <View style={{ marginTop: 15 }}>
                <View style={styles.iconView}>
                    <Ionicons name="location-sharp" size={20} color='#6F7482' />
                    <Text style={[styles.regularTxt, { marginLeft: 5 }]}>{jobItem?.location}</Text>
                </View>
                <View style={[styles.iconView, { marginTop: 15 }]}>
                    <MaterialCommunityIcons name="wallet" size={20} color='#6F7482' />
                    <Text style={[styles.regularTxt, { marginLeft: 5 }]}>
                        {jobItem?.minimumSalary / 100000 === 0 && jobItem?.maximumSalary / 100000 === 0 ? "Not Disclosed" : (
                            <>
                                ₹{jobItem?.minimumSalary / 100000 > 0 && jobItem?.maximumSalary / 100000 > 0 ?
                                    `${jobItem?.minimumSalary / 100000} - ₹${jobItem?.maximumSalary / 100000} Monthly`
                                    : `${jobItem?.minimumSalary / 100000 > 1 ? `${jobItem?.minimumSalary / 100000} Monthly` : `${jobItem?.minimumSalary / 100000} Monthly`}`}
                            </>)}
                    </Text>
                </View>

                <View style={styles.salaryView}>
                    <View style={[styles.iconView, { marginTop: 15 }]}>
                        <MaterialCommunityIcons name='briefcase-outline' size={20} color='#6F7482' />
                        <Text style={[styles.regularTxt, { marginLeft: 5 }]}>
                            {`${jobItem?.expMin} Months - ${jobItem?.expMax} Years`}
                        </Text>
                    </View>

                    {
                        from == 'save job' &&  
                    <Pressable onPress={() => unSaveHandler(jobItem?.vacancyID)} style={{marginTop: 10}}>
                        <Ionicons name="bookmark" size={21} color="#395987" />
                    </Pressable>
                    }
                </View>

            </View>
          
            {/* -----------box view---------- */}
            {/* <View style={[styles.jobCardHeader, { marginTop: 15 }]}>
                <View style={styles.boxBtn}>
                    <Text style={styles.boxBtnText}>{jobItem?.employmentType}</Text>
                </View>
                <View style={[styles.boxBtn, { marginLeft: 10 }]}>
                    <Text style={styles.boxBtnText}>Fresher</Text>
                </View>
            </View> */}

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    JobCardMainView: {
        borderWidth: 2,
        borderColor: '#E4EEF5',
        borderRadius: 10,
        padding: 15,
        marginTop: 10
    },
    cartTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: 'black',
    },
    regularTxt: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#6F7482',
    },
    titleView: {
        flex:1,
        // backgroundColor:'red'
        // alignItems: 'center',
        // width: '80%'
    },
    jobCardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6F748230',
        borderRadius: 5,
        height: 26,
        width: 65
    },
    boxBtnText: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: '#6F7482',
    },
    salaryView:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});