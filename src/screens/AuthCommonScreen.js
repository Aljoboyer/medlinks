import { SafeAreaView , Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import OnBoardLoader from './../components/OnBoardLoader/OnBoardLoader';
import { QUERY_LISTPROFILES } from '../graphql';
import { gqlquery } from '../api/doctorFlow';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { allMonths, getCareerProfileData, getEducationList, getExperienceList, getPersonalDetails } from '../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { getMonths } from '../utils/getYear';
import { getProfileData, getProfileImg, getProfileStrength } from '../Redux_Mine/Redux_Slices/ProfileSlice';
import { getUserNotifications, setAuthCommonScreenLoader, setDeviceNotification, setDeviceToken, setLoginScreenLoader, userLoggedHandler } from '../Redux_Mine/Redux_Slices/GlobalSettingSlice';
import { Amplify } from 'aws-amplify'
import aws_config_doctor from '../../aws-config.doctor';
Amplify.configure(aws_config_doctor);
import CreateProfile from './auth/registrationComponents/createProfile';
import Home from './Home';
import { BottomStack } from '../navigations/bottomNavigator';
import { Pressable } from 'react-native';
import { getAllNoticePeriod, getCourseMaster, getDesiredIndustryMaster, getHealthInstitutions, getJobRole, getPreferredWorkLocationDropDownData, getQualificationMaster, getSpecializationMaster } from '../Redux_Mine/Redux_Slices/DropDownDataSlice';

export default function AuthCommonScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [isProfile, setIsProfile] = useState(false)
  const [isLoading, setIsloading] = useState(true);

  const profile = useSelector((state) => state.profilestore.profileData);
  const notificationShow = useSelector((state) => state.profilestore.notificationShow);
  const authCommonScreenLoader = useSelector((state) => state.globalSettingStore.authCommonScreenLoader);

  const dispatchAction = useDispatch();

  useEffect(() => {
    const newMonth = getMonths();
    dispatchAction(allMonths(newMonth))
    dispatchAction(getProfileData())
    dispatchAction(setAuthCommonScreenLoader(true))

    dispatchAction(getQualificationMaster())
    dispatchAction(getCourseMaster())
    dispatchAction(getSpecializationMaster())
    dispatchAction(getJobRole());
    dispatchAction(getHealthInstitutions());
    dispatchAction(getAllNoticePeriod());
    dispatchAction(getDesiredIndustryMaster())
    dispatchAction(getPreferredWorkLocationDropDownData())
    dispatchAction(getExperienceList())
    dispatchAction(getEducationList()); 
    dispatchAction(getCareerProfileData());
    dispatchAction(getProfileStrength())
    dispatchAction(getPersonalDetails())
    dispatchAction(getUserNotifications())
  }, [isFocused]);

  useEffect(() => {
    getProifleData()
  }, [isFocused, authCommonScreenLoader])
  
  const getProifleData = async () => {

    gqlquery(QUERY_LISTPROFILES, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log('from auth common profile', datas)
        if (datas?.data?.getProfile?.name) {
          dispatchAction(setAuthCommonScreenLoader(false))
          dispatchAction(getProfileImg(datas?.data?.getProfile?.profilePicURL))
          setIsProfile(true)
          setIsloading(false)
        } else {
          dispatchAction(setAuthCommonScreenLoader(false))
          setIsProfile(false)
          setIsloading(false)
        }
      })
      .catch((err) => {
        console.log('from auth common error', err)
        // setIsProfile(false)
        // dispatchAction(setAuthCommonScreenLoader(false))
      })
  }

  const NotificationHandler = async () => {
    const notifyJson = await AsyncStorage.getItem('DeviceNotify');
    const notify = JSON.parse(notifyJson);
    dispatchAction(setDeviceNotification(notify))
  }

  useEffect(() => {
    NotificationHandler()
  }, [])

  const Logout = () => {
    dispatchAction(setDeviceToken(''))
    dispatchAction(setLoginScreenLoader(false))
    dispatchAction(setAuthCommonScreenLoader(true))
    dispatchAction(userLoggedHandler(false));
  }
  return (
    <SafeAreaView onRefresh={() => console.log('Refreesh')} style={{ flex: 1 }}>
      {
        isLoading ? <OnBoardLoader visible={true} /> :
          <>
            {
              isProfile ? <BottomStack /> : <CreateProfile />

            }
          </>
      }

      {/* <Pressable onPress={() => {
        Logout()
      }}><Text>Logout</Text></Pressable>  */}
    </SafeAreaView>
  )
}