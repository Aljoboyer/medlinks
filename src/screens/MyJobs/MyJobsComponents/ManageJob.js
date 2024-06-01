import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React,{useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import LoginHeader from '../../../components/header/loginheader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useState } from 'react';
import ManageAlertCard from '../../../components/managealertcard/manageAlertCard';
import { useIsFocused } from '@react-navigation/native';
import { gqlquery, gqlOpenQuery } from "../../../api/doctorFlow";

export default function ManageJOb() {
    const [allalerts, setAllalerts] = useState([])
    const isFocused = useIsFocused();
    const [changes,setChanges] = useState(true)
    useEffect(() => {
        getalerts();

    }, [isFocused,changes])

    const getalerts = async () => {
        console.log('called')

        const QUERY_GETALERT = {
            query: `query MyQuery {
                getAlerts {
                  alertName
                  education
                  hospitals
                  jobType
                  jsaID
                  keyword
                  location
                  locationTop
                  maximumSalary
                  minimumSalary
                  profession
                  specialization
                }
              }
                `,
            variables: null,
            operationName: "MyQuery",
        };
        gqlquery(QUERY_GETALERT, null)
            .then((res) => res.json())
            .then((data) => {
                setAllalerts(data?.data?.getAlerts);
                // setAlertLoader(false)
                console.log("get alert data --------->>>",data)
            });
    }
    
    return (

        <View style={{ paddingHorizontal: wp('5%'), marginTop: 6 }}>
            {
                allalerts?.length > 0 &&

                allalerts?.map((item, index) => (
                    <ManageAlertCard item={item} key={index} setChanges={setChanges} />

                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
  
});