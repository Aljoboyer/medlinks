import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gqlOpenQuery, gqlquery } from '../../api/doctorFlow';
import { Auth, Amplify } from 'aws-amplify'
import {  QUERY_DESIGNMASTER, QUERY_NOTICEMASTER} from '../../graphql';
import aws_config_doctor from '../../../aws-config.doctor';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
Amplify.configure(aws_config_doctor);

//education Tab Healthcare Industry details from database
export const getEducationHCI= createAsyncThunk(
  'completerprofile/getEducationHCI',
  async () => {
  
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;
    const GET_HEALTCARE = {
      query: `query MyQuery {
        getIndustry {
          healthcareIndustry
        }
      }
    `,
      variables: null,
      operationName: "MyQuery",
    };

    const dataFun =  gqlquery(GET_HEALTCARE, null)
    .then((res) => res.json())
    .then((datas) => {
      console.log(datas)
      return datas?.data?.getIndustry
    });
   
    return dataFun
  }
)

//education Tab qualification from database
export const getQualificationMaster= createAsyncThunk(
    'completerprofile/getQualificationMaster',
    async () => {

      const GET_QUALIFICATIONS = {
        query: `query MyQuery {
          getQualification(industry: "other") {
            qualification
            emID
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };
  
      const dataFun = gqlquery(GET_QUALIFICATIONS, null)
      .then((res) => res.json())
      .then((datas) => {
        return datas?.data?.getQualification
      });

      return dataFun
    }
  )

//education Tab course from database
export const getCourseMaster= createAsyncThunk(
    'completerprofile/getCourseMaster',
    async () => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;

      const GET_COURSES = {
        query: `query MyQuery {
          getCourse(industry: "Other", qualification: "Other") {
            course
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };
  
      const dataFun = gqlquery(GET_COURSES, null)
      .then((res) => res.json())
      .then((datas) => {
        return datas?.data?.getCourse
      });

      return dataFun
    }
  )

//education Tab course from database
export const getSpecializationMaster= createAsyncThunk(
    'completerprofile/getSpecializationMaster',
    async () => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;
      
      const GET_SPECIALIZATION = {
        query: `query MyQuery {
          getSpecialization(course: "Other", industry: "Other", qualification: "Other", specialization: "") {
            emID
            specialization
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };

      const dataFun = gqlquery(GET_SPECIALIZATION, null)
      .then((res) => res.json())
      .then((datas) => {
        return datas?.data?.getSpecialization;
      });
      return dataFun
    }
  )

  //experience  Tab designation from database
export const getDesignationMaster= createAsyncThunk(
  'completerprofile/getDesignationMaster',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun =  gqlquery(QUERY_DESIGNMASTER, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas?.data?.getDesignationMaster
    });
  
    return dataFun
  }
)

//experience  Tab institute type from database
  export const getHealthInstituteTypeMaster = createAsyncThunk(
    'completerprofile/getHealthInstituteTypeMaster',
    async () => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;
      
      const GET_INSTITUTE_TYPE = {
        query: `query MyQuery {
          getHITypeMaster {
            hitmID
            type
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };

      const dataFun = gqlquery(GET_INSTITUTE_TYPE, null)
      .then((res) => res.json())
      .then((datas) => {

        return datas?.data?.getHITypeMaster 
      });
      return dataFun  
    }
  )

  //career profile tab desired industry  Tab institute type from database
export const getDesiredIndustryMaster = createAsyncThunk(
    'completerprofile/getDesiredIndustryMaster',
    async () => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;
      
      const GET_INDUSTRY = {
        query: ` query MyQuery {
          getHCIIndustry {
            hciID
            industry
            specialty
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };

      const dataFun = gqlquery(GET_INDUSTRY, null)
      .then((res) => res.json())
      .then((datas) => {
        // console.log('desired indus slice >>>', datas)
        return datas?.data?.getHCIIndustry
      });
      return dataFun  
    }
  )

  //Experience tab all notice period
  export const getAllNoticePeriod = createAsyncThunk(
    'completerprofile/getAllNoticePeriod',
    async () => {

      const dataFun = gqlquery(QUERY_NOTICEMASTER, null)
      .then((res) => res.json())
      .then((datas) => {
        // console.log(datas);
        return datas?.data?.getNoticePeriodMasters;
      });
      return dataFun  
    }
  )
 
   //Experience tab all PersonalDetails All Country
   export const getPersonalDetailsAllCountry = createAsyncThunk(
    'DropDownDataSlice/getPersonalDetailsAllCountry',
    async () => {
      // const newToken = await Auth.currentSession();
      // const { accessToken, idToken, refreshToken } = newToken;

      const GET_COUNTRY = {
        query: `query MyQuery {
          getCountryMaster {
            country
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };
      
      const dataFun = gqlquery(GET_COUNTRY, null)
      .then((res) => res.json())
      .then((datas) => {
        // console.log(datas);
        return datas?.data?.getCountryMaster;
      });
      return dataFun  
    }
  )
  
  //Experience tab all Job Role 
  export const getJobRole = createAsyncThunk(
  'DropDownDataSlice/getJobRole',
  async () => {

    const GET_JOB_ROLE = {
      query: `query MyQuery {
          getHCISpecialty(specialty: "") {
            hciID
            hciType
            industry
            specialty
            status
          }
        }`,
      variables: null,
      operationName: "MyQuery",
    };
    
    const dataFun = gqlquery(GET_JOB_ROLE, null)
    .then((res) => res.json())
    .then((datas) => {
      // console.log(datas);
      return datas?.data?.getHCISpecialty;
    });
    return dataFun  
  }
)

  //Experience tab all hospital/company All Country
  export const getHealthInstitutions = createAsyncThunk(
  'DropDownDataSlice/getHealthInstitutions',
  async () => {

    const GET_INSTITUTE = {
      query: `query MyQuery {
            getHealthInstituteMaster {
              himID
              name
            }
          }
        `,
      variables: null,
      operationName: "MyQuery",
    };
    
    const dataFun = gqlquery(GET_INSTITUTE, null)
    .then((res) => res.json())
    .then((datas) => {
      return datas?.data?.getHealthInstituteMaster;
    });
    return dataFun  
  }
)

  //preference tab all getPreferredWorkLocation All Country
  export const getPreferredWorkLocationDropDownData = createAsyncThunk(
    'DropDownDataSlice/getPreferredWorkLocationDropDownData',
    async () => {
      const GET_CITY = {
        query: `query MyQuery {
          getCityMaster {
            city
            cityWithState
            country
            lmID
            state
          }
        }
      `,
        variables: null,
        operationName: "MyQuery",
      };
      
      const dataFun = gqlOpenQuery(GET_CITY, null)
      .then((res) => res.json())
      .then((datas) => {
        return datas?.data?.getCityMaster;
      });
      return dataFun  
    }
  )
export const DropDownDataSlice = createSlice({
  name: 'DropDownDataSlice',
  initialState: { 
    educationHCIdata: [],
    qualificationMaster: [],
    courseMaster: [],
    specializationMaster: [],
    designationData: [],
    healthInstituteType: [],
    desiredIndustry: [],
    allNoticePeriod: [],
    personalDetailsCountry: [],
    jobRoleData: [],
    hospitalCompanyData: [],
    preferredWorkLocationData: []
  },
  reducers: {
    exampleRdc: (state, {payload}) => {
    //    state.months = [...payload]
    },
    
  },

  extraReducers: (builder) => {
    builder.addCase(getEducationHCI.fulfilled, (state, action) => {
      state.educationHCIdata = action.payload
    })
    builder.addCase(getQualificationMaster.fulfilled, (state, action) => {
        state.qualificationMaster = action.payload
      })
    builder.addCase(getCourseMaster.fulfilled, (state, action) => {
    state.courseMaster = action.payload
    })
    builder.addCase(getSpecializationMaster.fulfilled, (state, action) => {
        state.specializationMaster = action.payload
    })
    builder.addCase(getDesignationMaster.fulfilled, (state, action) => {
      state.designationData = action.payload
    })
    builder.addCase(getHealthInstituteTypeMaster.fulfilled, (state, action) => {
      state.healthInstituteType = action.payload
  })
  builder.addCase(getDesiredIndustryMaster.fulfilled, (state, action) => {
    state.desiredIndustry = action.payload
  })
  builder.addCase(getAllNoticePeriod.fulfilled, (state, action) => {
    state.allNoticePeriod = action.payload
  })
  builder.addCase(getPersonalDetailsAllCountry.fulfilled, (state, action) => {
    state.personalDetailsCountry = action.payload
  })
  builder.addCase(getJobRole.fulfilled, (state, action) => {
    state.jobRoleData = action.payload
  })
  builder.addCase(getHealthInstitutions.fulfilled, (state, action) => {
    state.hospitalCompanyData = action.payload
  })
  builder.addCase(getPreferredWorkLocationDropDownData.fulfilled, (state, action) => {
    state.preferredWorkLocationData = action.payload
  })
  }
});
export const { exampleRdc } = DropDownDataSlice.actions;

export default DropDownDataSlice.reducer;
