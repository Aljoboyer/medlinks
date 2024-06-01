import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gqlquery } from '../../api/doctorFlow';
import { Auth, Amplify } from 'aws-amplify'
import {QUERY_GETAWARDS} from '../../graphql';
import aws_config_doctor from '../../../aws-config.doctor';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
Amplify.configure(aws_config_doctor);

//Refreshing TOKEN
export const getAccessToken = createAsyncThunk(
  'globalSettings/getAccessToken',
  async () => {
    // const newToken = await Auth?.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    // return accessToken?.jwtToken
  }
)

//Geting users all notification
export const getUserNotifications= createAsyncThunk(
  'globalSettings/getUserNotifications',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;
    const QUERY_GET_NOTIFICATION = {
      query: `query MyQuery {
        getNotifications {
          description
          nID
          status
          title
          createdAt
          redirectTo
        }
      } 
    `
    }
    const dataFun =  gqlquery(QUERY_GET_NOTIFICATION, null)
    .then((res) => res.json())
    .then((datas) => {

      return datas.data.getNotifications
    });
   
    return dataFun
  }
)

export const GlobalSettingSlice = createSlice({
  name: 'GlobalSetting',
  initialState: { 
    accessTokenValue: '',
    strengthUpdate: 0,
    deviceToken: '',
    isLogged: false,
    loginScreenLoading: false,
    deviceNotification: {},
    notificationPermission: 2,
    searchParams: {},
    allNotifications: [],
    loginPage: 0,
    authCommonScreenLoader: true,
    selectedJobAlert: {}
  },
  reducers: {
    strengthUpdateHandler: (state, {payload}) => {
      state.strengthUpdate = payload
    },
    userLoggedHandler: (state, {payload}) => {
      state.isLogged = payload
    },
    setDeviceToken: (state, {payload}) => {
      state.deviceToken = payload
    },
    setDeviceNotification: (state, {payload}) => {
      state.deviceNotification = payload
    },
    setNotificationPermission: (state, {payload}) => {
      state.notificationPermission = payload
    },
    setSearchParams: (state, {payload}) => {
      state.searchParams = payload
    },
    setLoginScreenLoader: (state, {payload}) => {
      state.loginScreenLoading = payload
    },
    setLoginPageNo: (state, {payload}) => {
      state.loginPage = payload
    },
    setAuthCommonScreenLoader: (state, {payload}) => {
      state.authCommonScreenLoader = payload
    },
    setSelectedJobAlert: (state, {payload}) => {

      state.selectedJobAlert = payload
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getAccessToken.fulfilled, (state, action) => {
      state.accessTokenValue = action.payload
    })
    builder.addCase(getUserNotifications.fulfilled, (state, action) => {
      state.allNotifications = action.payload
    })
  }
});

export const {
  setDeviceNotification,
   strengthUpdateHandler, 
   userLoggedHandler , 
   setDeviceToken, 
   SearchJobsScreen,
   setSearchParams,
   setNotificationPermission,setLoginScreenLoader,setLoginPageNo,
   setAuthCommonScreenLoader,
   setSelectedJobAlert
  } = GlobalSettingSlice.actions;

export default GlobalSettingSlice.reducer;
