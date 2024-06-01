import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';QUERY_LISTPROFILES
import { gqlquery } from '../../api/doctorFlow';
import { Auth, Amplify } from 'aws-amplify'
import {QUERY_GETAWARDS, QUERY_GETPAPERS, QUERY_GETMEMBERSHIP, QUERY_GETCANDIDATEAVAILABILITY, QUERY_GETEXPERIENCELIST , QUERY_GETEDUCATION, QUERY_PERSONAL_DETAILS, QUERY_GETCAREERPROFILE, GET_PREFERRED_LOCATION, QUERY_LISTPROFILES} from '../../graphql';
import aws_config_doctor from '../../../aws-config.doctor';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
Amplify.configure(aws_config_doctor);

//fethcing ProfileData data from database
export const getProfileData = createAsyncThunk(
  'completerprofile/getProfileData',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_LISTPROFILES, null)
    .then((res) => res.json())
    .then((datas) => {
      console.log('Profile Slice >>>', datas)
        return datas?.data?.getProfile;
    })
    return dataFun
  }
)
export const getProfileImg = createAsyncThunk(
    'completerprofile/getProfileImg',
    async (profileUrl) => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;

      const QUERY_DOWNLOADIMAGE = {
        query: `query MyQuery {
              downloadDocument (url: "${profileUrl}")
            }`,
      };
      const dataFun =  gqlquery(QUERY_DOWNLOADIMAGE, null)
        .then((res) => res.json())
        .then((datas) => {
          const downloadDocument = JSON.parse(
            datas?.data?.downloadDocument
          );
          const imageSource = `data:image/png;base64,${downloadDocument?.response?.content}`;
          return imageSource;
        });

      return dataFun
    }
  )
export const getProfileStrength = createAsyncThunk(
  'completerprofile/getProfileStrength',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const QUERY_PROFILE_STRENGTH = {
      query: `query MyQuery {
        getProfileStrength {
          completed
          strength
        }
      }`,
    };
    const dataFun =  gqlquery(QUERY_PROFILE_STRENGTH, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log('profile strengths >>>', datas)
        return datas?.data?.getProfileStrength;
      });

    return dataFun
  }
)
export const getVirtualCardData = createAsyncThunk(
  'completerprofile/getVirtualCardData',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const QUERY_VIRTUAL_CARD_STATUS = {
      query: `query MyQuery {
        getCardEligibleStatus {
          isEligible
          isCardCreated
        }
      }`,
    };
    const dataFun =  gqlquery(QUERY_VIRTUAL_CARD_STATUS, null)
      .then((res) => res.json())
      .then((datas) => {
        console.log('QUERY_VIRTUAL_CARD_STATUS >>>', datas)
        return datas?.data?.getCardEligibleStatus;
      });

    return dataFun
  }
)

export const ProfileSlice = createSlice({
  name: 'Profiles',
  initialState: { 
    profileData: {},
    profleImg: '',
    notificationShow: false,
    profileStrength: 0,
    virtualCardStatus: {},
    firstTimeCard: false,
    monthlySalaryData: '',
    totalExpData: ''
  },
  reducers: {
    notificationBottomsheetShow: (state, {payload}) => {
      state.notificationShow = payload
    },
    setFirstTimeCard: (state, {payload}) => {
      state.firstTimeCard = payload
    },
    setMonthlyData: (state, {payload}) => {
      state.monthlySalaryData = payload
    },
    setTotalData: (state, {payload}) => {
      state.totalExpData = payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.profileData = action.payload
    })
    builder.addCase(getProfileImg.fulfilled, (state, action) => {
        state.profleImg = action.payload
      }),
    builder.addCase(getProfileStrength.fulfilled, (state, action) => {
      state.profileStrength = action.payload
    }),
    builder.addCase(getVirtualCardData.fulfilled, (state, action) => {
      state.virtualCardStatus = action.payload
    })
  }
});

export const { notificationBottomsheetShow , setFirstTimeCard, setMonthlyData, setTotalData} = ProfileSlice.actions;

export default ProfileSlice.reducer;
