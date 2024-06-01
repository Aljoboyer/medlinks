import { View, Text, TouchableOpacity, ScrollView, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginHeader from '../../components/header/loginheader';
import ManageJOb from './MyJobsComponents/ManageJob';
import SavedJob from './MyJobsComponents/SavedJob';
import AppliedJob from './MyJobsComponents/AppliedJob';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function MyJobs() {
    const [selected, setSelected] = useState(0)
    const navigation = useNavigation()
    console.log('selected', selected)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: hp('10%'), alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingHorizontal: wp('6%'), }}>
                <LoginHeader backarrow={"chevron-back-outline"} arrow={true} title={selected == 0 ? "Saved Jobs" : selected == 1 ? "Applied Jobs" : "Manage Alert"} colorname={'black'} lefticon={false} />
            </View>

            <View style={styles.myJobBtnView}>

                <TouchableOpacity onPress={() => setSelected(0)} style={[styles.MyJobsBtn, selected == 0 && styles.selectedStyle]}>
                    <Text style={{ fontSize: 10, lineHeight: 15, color: selected === 0 ? '#395987' : '#6F7482', fontFamily: "Poppins-Medium", }}>Saved Jobs</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelected(1)} style={[styles.MyJobsBtn, selected == 1 && styles.selectedStyle]}>
                    <Text style={{ fontSize: 10, lineHeight: 15, color: selected === 1 ? '#395987' : '#6F7482', fontFamily: "Poppins-Medium", }}>Applied Jobs</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setSelected(2)} style={[styles.MyJobsBtn, selected == 2 && styles.selectedStyle]}>
                    <Text style={{ fontSize: 10, lineHeight: 15, color: selected === 2 ?  '#395987' : '#6F7482', fontFamily: "Poppins-Medium", }}>Manage Alerts</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {
                    selected == 0 && <SavedJob />
                }
                {
                    selected == 1 && <AppliedJob />
                }
                {
                    selected == 2 && <ManageJOb />
                }

            </ScrollView>
            {/* -----------Floating Button---------- */}
            {
                selected == 2 && <Pressable onPress={() => navigation.navigate('CreateAlertScreen')} style={styles.floatingBtn}>
                    <Text style={styles.floatingBtnTxt}><MaterialIcons name="add-alert" size={20} color='#395987' /></Text>
                </Pressable>
            }
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    floatingBtn: {
        display: 'flex', flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute',
        height: 50,
        width: 50,
        backgroundColor: 'white',
        bottom: 20,
        borderRadius: 100,
        right: 25,
        elevation:12
    },
    floatingBtnTxt: {
        fontSize: 24,
        fontWeight: '500',
        color: 'white'
    },
    myJobBtnView:{
        borderColor: '#E4EEF5', borderBottomWidth: 2, borderTopWidth: 2,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    MyJobsBtn: {
        height: 45,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedStyle:{borderBottomColor: '#395987', borderBottomWidth: 2}
});
