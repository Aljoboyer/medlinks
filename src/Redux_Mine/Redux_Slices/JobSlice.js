import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gqlOpenQuery, gqlquery } from '../../api/doctorFlow';
import { Auth, Amplify } from 'aws-amplify'
import {QUERY_SAVEDJOBS} from '../../graphql';
import aws_config_doctor from '../../../aws-config.doctor';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
Amplify.configure(aws_config_doctor);

//fethcing saved jobs data from database
export const getSavedJobs = createAsyncThunk(
  'savedJobs/savejobs',
  async () => {
    // const newToken = await Auth.currentSession();
    // const { accessToken, idToken, refreshToken } = newToken;

    const dataFun =  gqlquery(QUERY_SAVEDJOBS, null)
    .then((res) => res.json())
    .then((datas) => {

      if (datas?.data.getSavedJobs) {
        return datas?.data.getSavedJobs
      }
    })
    return dataFun
  }
)

//fethcing similar jobs data from database
export const getSimilarJobs = createAsyncThunk(
  'savedJobs/getSimilarJobs',
  async (vacancyID) => {

    const dataFun =  () => {
      let allSingleVacancyInfo = {};
      let Data = []
      const QUERY_GETAVACANCY = {
        query: `query MyQuery {
            getAVacancy(vacancyID: ${Number(vacancyID)}) 
               {
                description
                employmentType
                hospitalID
                jobTitle
                lastDateToApply
                location
                maximumSalary
                minimumSalary
                name
                postedOn
                qualification
                savedJob
                vacancyID
                vacancyType
                expMax
                expMin
                isSalaryDisclosed
              }
            }`,
        variables: null,
        operationName: "MyMutation",
      };
       gqlOpenQuery(QUERY_GETAVACANCY, null)
        .then((res) => res.json())
        .then((data) => {
          Object.assign(allSingleVacancyInfo, data?.data?.getAVacancy);
        })

      const QUERY_GETPRIMARYSPECIALIZATION = {
        query: `query MyQuery {
          getJobPostPrimarySpecialization(vacancyID: ${Number(vacancyID)}) {
            jpsID
            specialization
            vacancyID
          }
        }
      `,
        variables: null,
        operationName: "MyMutation",
      };
       gqlOpenQuery(QUERY_GETPRIMARYSPECIALIZATION, null)
        .then((res) => res.json())
        .then((data) => {
          Object.assign(allSingleVacancyInfo, data?.data);
        });

      const QUERY_GETSECONDARYSPECIALIZATION = {
        query: `query MyQuery {
          getJobPostSecondarySpecialization(vacancyID: ${Number(vacancyID)}) {
            jpsID
            specialization
            vacancyID
          }
        }
      `,
        variables: null,
        operationName: "MyMutation",
      };
       gqlOpenQuery(QUERY_GETSECONDARYSPECIALIZATION, null)
        .then((res) => res.json())
        .then((data) => {
          Object.assign(allSingleVacancyInfo, data?.data);
        });

      const QUERY_GETJOBJPOSTSKILL = {
        query: `query MyQuery {
          getJobPostSkill(vacancyID: ${Number(vacancyID)}) {
            vacancyID
            userID
            skillID
            skill
            jpsID
            hospitalID
          }
        }
      `};

       gqlOpenQuery(QUERY_GETJOBJPOSTSKILL, null)
        .then((res) => res.json())
        .then((data) => {
          Object.assign(allSingleVacancyInfo, data?.data);
        });


      let spec1 = allSingleVacancyInfo?.getJobPostPrimarySpecialization?.map(ps => ps?.specialization);
      let spec2 = allSingleVacancyInfo?.getJobPostSecondarySpecialization?.map(ss => ss?.specialization);
      let skills = allSingleVacancyInfo?.getJobPostSkill?.map(ss => ss?.skill);
      let allSpec = [...spec1, ...spec2]?.join(", ");
      const allSkill = [...skills]?.join(", ");
  
      const QUERY_SEARCHSIMILARJOBS = {
        query: `query MyQuery {
            searchTop5Jobs(
              vacancyID: ${Number(vacancyID)},
              expMin: ${allSingleVacancyInfo?.expMin || 0},
              expMax: ${allSingleVacancyInfo?.expMax || 0},
              location: "${allSingleVacancyInfo?.location || ""}",
              maximumSalary: ${allSingleVacancyInfo?.maximumSalary || 9999999},
              minimumSalary: ${allSingleVacancyInfo?.minimumSalary || 1},
              specialization: "${allSpec || ""}",
              skill: "${allSkill || ""}",
              description: "${allSingleVacancyInfo?.description || ""}",
              title: "${allSingleVacancyInfo?.jobTitle || ""}"
            )
          }`
      };

      const SimilarJobHere =  gqlOpenQuery(QUERY_SEARCHSIMILARJOBS, null)
        .then((res) => res.json())
        .then((datas) => {
          const getAllVacancyInfo = async () => {
            
            const primarySpec = async (searchResult) => {
              const QUERY_GETPRIMARYSPECIALIZATION = {
                query: `query MyQuery {
                getJobPostPrimarySpecialization(vacancyID: ${Number(searchResult?.vacancyID)}) {
                  jpsID
                  specialization
                  vacancyID
                }
              }
            `,
                variables: null,
                operationName: "MyMutation",
              };
              await gqlOpenQuery(QUERY_GETPRIMARYSPECIALIZATION, null)
                .then((res) => res.json())
                .then((data) => {
                  Object.assign(searchResult, data?.data);
                });
            };

            const secondarySpec = async (searchResult) => {
              const QUERY_GETSECONDARYSPECIALIZATION = {
                query: `query MyQuery {
                getJobPostSecondarySpecialization(vacancyID: ${Number(searchResult?.vacancyID)}) {
                  jpsID
                  specialization
                  vacancyID
                }
              }
            `,
                variables: null,
                operationName: "MyMutation",
              };
              await gqlOpenQuery(QUERY_GETSECONDARYSPECIALIZATION, null)
                .then((res) => res.json())
                .then((data) => {
                  Object.assign(searchResult, data?.data);
                });
            };

            const allSkills = async (searchResult) => {
              const QUERY_GETJOBJPOSTSKILL = {
                query: `query MyQuery {
                  getJobPostSkill(vacancyID: ${Number(searchResult?.vacancyID)}) {
                    vacancyID
                    userID
                    skillID
                    skill
                    jpsID
                    hospitalID
                  }
                }
              `};

              await gqlOpenQuery(QUERY_GETJOBJPOSTSKILL, null)
                .then((res) => res.json())
                .then((data) => {
                  Object.assign(searchResult, data?.data);
                });
            }

            let similarJobs = JSON.parse(datas?.data?.searchTop5Jobs)?.data;

            const allTopVacancies = similarJobs?.map(async (sR, index) => {
              await primarySpec(sR);
              await secondarySpec(sR);
              await allSkills(sR);
            });
            await Promise.all(allTopVacancies);
            console.log("Ekhaneee ====>>", similarJobs)
            Data = similarJobs
          }
      
        });
        console.log("SimilarJobHere ====>>", SimilarJobHere)
        return SimilarJobHere
    }
    console.log('Similar job slice ===>>', dataFun)
    // return dataFun
  }
)

export const JobSlice = createSlice({
  name: 'SavedJobs',
  initialState: { 
    allSavedJobs: [],
    jobVacancyID: '',
    allSearchJobs: {}
  },
  reducers: {
    setJobVacancyID: (state, {payload}) => {
       state.jobVacancyID = payload;
       console.log('payload >>>', payload)
    },
    setSearchData: (state, {payload}) => {
      state.allSearchJobs = payload;
   },
  },

  extraReducers: (builder) => {
    builder.addCase(getSavedJobs.fulfilled, (state, action) => {
      state.allSavedJobs = action.payload
    })
  }
});

export const { setJobVacancyID, setSearchData } = JobSlice.actions;

export default JobSlice.reducer;
