import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MyJobs from '../screens/MyJobs/MyJobs';
import Profile from "../screens/Profile";
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
const { width, height } = Dimensions.get("window")



export const BottomStack = () => {
  const navigation = useNavigation()
  const DeviceNotification = useSelector((state) => state.globalSettingStore.deviceNotification);
  const dispatchAction = useDispatch();

  return (<View style={{
    width,
    height,
  }}>
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#e91e63',
      tabBarStyle: {
        backgroundColor: 'white', height: hp('9%'),
        // position:'absolute',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: hp('1%'),
        paddingBottom: hp('2%'),
        keyboardHidesTabBar: true,
        
        // unmountOnBlur:true,
        // unmountOnBlur: true
        // alignItems:'center',
        // position: 'absolute',
      }

    }}
      // keyboardHidesTabBar={'true'}

      initialRouteName={'HomeScreen'}
    >
      <Tab.Screen name="HomeScreen" component={Home} options={{
        unmountOnBlur: true,
        tabBarShowLabel: false, tabBarIcon: ({ focused }) => (
          <View style={{ flexDirection: 'column', alignItems: 'center', }}>

            <Ionicons name={focused ? 'bag' : 'bag-outline'} size={22} color= {focused ? '#395987' :"#0C0C0C"} style={{ marginBottom: 5 }} />
            <Text style={{ color: '#395987', fontSize: 12, fontFamily: 'Poppins-Regular' }}>Jobs</Text>
          </View>

        ),
      }} />

      <Tab.Screen name="MyJobs" component={MyJobs} options={{
        unmountOnBlur: true,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{ flexDirection: 'column', alignItems: 'center', }}>
            <MaterialCommunityIcons name={focused ? 'chart-timeline-variant' : 'chart-line-variant' } size={22} color= {focused ?'#395987' :"#0C0C0C"}  style={{ marginBottom: 5 }} />
            <Text style={{ color: '#395987', fontSize: 12, fontFamily: 'Poppins-Regular' }}>My Jobs</Text>
             </View>
        ),
      }} />
      <Tab.Screen name="Notifications" component={Notifications} options={{
        unmountOnBlur: true,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{ flexDirection: 'column', alignItems: 'center', }}>
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color= {focused ? '#395987' :"#0C0C0C"}  style={{ marginBottom: 5 }} />
            <Text style={{ color: '#395987', fontSize: 12, fontFamily: 'Poppins-Regular' }}>Notifications</Text> 
            </View>
        ),
      }} />
      <Tab.Screen name="Profile" component={Profile} options={{
        unmountOnBlur: true,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={{ flexDirection: 'column', alignItems: 'center', }}>
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={24} color= {focused?'#395987' :"#0C0C0C"}  style={{ marginBottom: 5 }} />
            <Text style={{ color: '#395987', fontSize: 12, fontFamily: 'Poppins-Regular' }}>Profile</Text>
            </View>
        ),
      }} />
    </Tab.Navigator></View>
  );
}

