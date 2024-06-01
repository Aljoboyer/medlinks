import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState, useRef } from 'react';
import Register from "../screens/auth/registration";
import Boarding from "../screens/boarding";
import Login from "../screens/auth/login";
const Stack = createNativeStackNavigator();
import CreateProfile from "../screens/auth/registrationComponents/createProfile"
import Home from "../screens/Home";
import SearchJob from "../screens/SearchJob";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import OnBoardLoader from "../components/OnBoardLoader/OnBoardLoader";
import AuthCommonScreen from "../screens/AuthCommonScreen";
import SingleJobPage from "../screens/SingleJobPage";
import MyJobs from "../screens/MyJobs/MyJobs";
import JobCard from "../components/JobCard/JobCard";  
import Profile from "../screens/Profile";
import ProfileSettings from "../screens/ProfileSettings";
import Addeducation from "../screens/ProfileTabScreens/Addeducation";
import Addexperience from "../screens/ProfileTabScreens/Addexperience";
import AddcareerProfile from "../screens/ProfileTabScreens/AddcareerProfile";
import CreateAlertScreen from "../screens/CreateAlertScreen";
import AccountSettings from "../screens/AccountSettings";


export const AuthStack = ({ userTokenValTwo }) => {
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused()
  const dispatchAction = useDispatch();

  const isLogged = useSelector((state) => state.globalSettingStore.isLogged);
  const NotificationPermission = useSelector((state) => state.globalSettingStore.notificationPermission);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, []);

  return (
<>
{loading ? (
  // <Loader visible={true} />
  <OnBoardLoader visible={true} />
) : (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#ffffff" },
    }}
  >
    {
      isLogged ?
        (
          <>
           
            <Stack.Screen name="AuthCommonScreen" component={AuthCommonScreen} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SearchJob" component={SearchJob} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} /> 
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="JobCard" component={JobCard} />
            <Stack.Screen name="SingleJobPage" component={SingleJobPage} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
            <Stack.Screen name="Addeducation" component={Addeducation} />
            <Stack.Screen name="Addexperience" component={Addexperience} />
            <Stack.Screen name="AddcareerProfile" component={AddcareerProfile} />
            <Stack.Screen name="CreateAlertScreen" component={CreateAlertScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} />
            
          </>
        ) : (
          <>
           
            <Stack.Screen name="Boarding" component={Boarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SearchJobs" component={SearchJob} />
            <Stack.Screen name="CreateAlertScreen" component={CreateAlertScreen} />
             <Stack.Screen name="SingleJobPage" component={SingleJobPage} />
             <Stack.Screen name="Home" component={Home} />
          </>
        )}

  </Stack.Navigator>
)}
</>

  );
};