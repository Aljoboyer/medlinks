import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gqlquery } from '../../api/doctorFlow';
import { Auth, Amplify } from 'aws-amplify'
import {GET_HEALTCARE, QUERY_GETRESUME, QUERY_GETAWARDS, QUERY_GETPAPERS, QUERY_GETMEMBERSHIP, QUERY_GETCANDIDATEAVAILABILITY, QUERY_GETEXPERIENCELIST , QUERY_GETEDUCATION, QUERY_PERSONAL_DETAILS, QUERY_GETCAREERPROFILE, GET_PREFERRED_LOCATION, QUERY_LANGUAGES_KNOWN, QUERY_GETRESUMEHEADLINE} from '../../graphql';
import aws_config_doctor from '../../../aws-config.doctor';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
Amplify.configure(aws_config_doctor);

//fethcing experience data from database
export const getExperienceList = createAsyncThunk(
  'completerprofile/GetExperienceList',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun =  gqlquery(QUERY_GETEXPERIENCELIST, null)
    .then((res) => res.json())
    .then((datas) => {
      console.log('Datas Exp...', datas)
      if (datas?.data.getExperienceList) {
        return datas?.data.getExperienceList
      }
    })
    return dataFun
  }
)

//fethcing Education data from database
export const getEducationList = createAsyncThunk(
  'completerprofile/GetEducationList',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETEDUCATION, null)
    .then((res) => res.json())
    .then((datas) => {
    //  console.log('educations slice-----> ', datas)
      if(datas?.data?.getEducationList) {
        return datas?.data?.getEducationList
      }
    })
    return dataFun
  }
)

//fethcing PersonalDetails data from database
export const getPersonalDetails = createAsyncThunk(
  'completerprofile/getPersonalDetails',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_PERSONAL_DETAILS, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas?.data?.getPersonalDetails
    })
    
    return dataFun
  }
)

//fethcing Language data from database
export const getLanguageList = createAsyncThunk(
  'completerprofile/getLanguageList',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_LANGUAGES_KNOWN, null)
      .then((res) => res.json())
      .then((data) => {
        
        return data?.data?.getLanguagesKnown;
      })
    return dataFun
  }
)

//fethcing Language data from database
export const getCareerProfileData = createAsyncThunk(
  'completerprofile/getCareerProfile',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETCAREERPROFILE, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas.data?.getCareerProfile;
    })
    return dataFun
  }
)

//fethcing availablity data from database
export const getCareerProfileAvailablity = createAsyncThunk(
  'completerprofile/getCareerProfileAvailablity',
  async () => {

    const dataFun = gqlquery(QUERY_GETCANDIDATEAVAILABILITY, null)
    .then((res) => res.json())
    .then((datas) =>
      {
        return datas?.data?.getCandidateAvailability
      }
    );
    return dataFun
  }
)

//fethcing availablity data from database
export const getPreferredWorkLocation = createAsyncThunk(
  'completerprofile/getPreferredWorkLocation',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(GET_PREFERRED_LOCATION, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas?.data?.getPreferredWorkLocation
  })
    
    return dataFun
  }
)

//getMemberShipdata from database
export const getMemberShip = createAsyncThunk(
  'completerprofile/getMemberShip',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETMEMBERSHIP, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas.data?.getMemberships;
    });
  
    return dataFun
  }
)

//getMemberShipdata from database
export const getPapersList= createAsyncThunk(
  'completerprofile/getPapersList',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETPAPERS, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas.data?.getPapers;
    });
    
    return dataFun
  }
)

//getMemberShipdata from database
export const getAwardList= createAsyncThunk(
  'completerprofile/getAwardList',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETAWARDS, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas.data?.getAwards;
    });
  
    return dataFun
  }
)

//get resume details from database
export const getResumeDetails= createAsyncThunk(
  'completerprofile/getResumeDetails',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETRESUME, null)
    .then((res) => res.json())
    .then((datas) => {  
      return datas.data?.getResume
    });
    return dataFun
  }
)

//get resume details from database
export const getResumeHeadline = createAsyncThunk(
  'completerprofile/getResumeHeadline',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun = gqlquery(QUERY_GETRESUMEHEADLINE, null)
    .then((res) => res.json())
    .then((datas) => {  
      return datas?.data?.getResume
    });
    return dataFun
  }
)

export const CompleteProfileTabSlice = createSlice({
  name: 'CompleteProfileTab',
  initialState: { 
    experienceList: [],
    educationList: [],
    personalDetails: {},
    languageList: [],
    careerProfileData: {},
    userAvailablity: [],
    preferredLocation: [],
    memberShipData: [],
    paperList: [],
    awardList: [],
    months: [],
    resumeDetails: {},
    resumeHeadline: '',
    selectedEducation: {},
    selectedExperience: {},
  },
  reducers: {
    allMonths: (state, {payload}) => {
       state.months = [...payload]
    },
    setSelectedEducation: (state, {payload}) => {
      state.selectedEducation = payload
    },
    setSelectedExperience: (state, {payload}) => {
      state.selectedExperience = payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getExperienceList.fulfilled, (state, action) => {
      state.experienceList = action.payload
    })
    builder.addCase(getEducationList.fulfilled, (state, action) => {
      state.educationList = action.payload
    })
    builder.addCase(getPersonalDetails.fulfilled, (state, action) => {
      state.personalDetails = action.payload
    })
    builder.addCase(getLanguageList.fulfilled, (state, action) => {
      state.languageList = action.payload
    })
    builder.addCase(getCareerProfileData.fulfilled, (state, action) => {
      state.careerProfileData = action.payload
    })
    builder.addCase(getCareerProfileAvailablity.fulfilled, (state, action) => {
      state.userAvailablity = action.payload
    })
    builder.addCase(getPreferredWorkLocation.fulfilled, (state, action) => {
      state.preferredLocation = action.payload
    })
    builder.addCase(getMemberShip.fulfilled, (state, action) => {
      state.memberShipData = action.payload
    })
    builder.addCase(getPapersList.fulfilled, (state, action) => {
      state.paperList = action.payload
    })
    builder.addCase(getAwardList.fulfilled, (state, action) => {
      state.awardList = action.payload
    })
    builder.addCase(getResumeDetails.fulfilled, (state, action) => {
      state.resumeDetails = action.payload
    })
    builder.addCase(getResumeHeadline.fulfilled, (state, action) => {
      state.resumeHeadline = action.payload
    })
  }
});

export const { allMonths , setSelectedEducation, setSelectedExperience} = CompleteProfileTabSlice.actions;

export default CompleteProfileTabSlice.reducer;
