import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import JobCard from '../../../components/JobCard/JobCard';
import { useIsFocused } from '@react-navigation/native';
import { QUERY_GET_APPLIED_JOBS } from '../../../graphql';
import { gqlOpenQuery, gqlquery } from '../../../api/doctorFlow';
import { Bullets } from 'react-native-easy-content-loader';

export default function AppliedJob() {
    const isFocused = useIsFocused();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [appliedFilterJobs, setAppliedFilterJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKey, SetSearchKey] = useState('')

    const FilterAppliedJobs = (text) => {
      SetSearchKey(text);
      if (text?.length > 1) {
        const filterjobs = appliedJobs.filter((item) => item.jobRole?.toLowerCase().includes(text.toLowerCase()) || item.jobTitle?.toLowerCase().includes(text.toLowerCase()));
        setAppliedFilterJobs(filterjobs)
      }
      else {
        setAppliedFilterJobs(appliedJobs)
      }
    }

    const GetAllAppliedJobs = async () => {
        setLoading(true)
    
        gqlquery(QUERY_GET_APPLIED_JOBS, null)
          .then((res) => res.json())
          .then((datas) => {
            try {
    
              getInfo(datas.data.getAppliedJobs);
    
            } catch (err) {
              console.log('applied job errors', err);
            }
          });
      }
      useEffect(() => {
        GetAllAppliedJobs()
      }, [isFocused]);
    
      const getInfo = async (searchResultsParams) => {

        const logo = async (searchResult) => {
          const QUERY_DOWNLOADHOSPITALLOGO = {
            query: `query MyQuery {
                getHospitalLogo(hospitalID: "${searchResult?.hospitalID}")
              }`,
          };
          await gqlOpenQuery(QUERY_DOWNLOADHOSPITALLOGO, null)
            .then((res) => res.json())
            .then((datas) => {
              const downloadDocument = JSON?.parse(datas?.data?.getHospitalLogo);
              const imageSource = { "imageSource": `data:image/png;base64,${downloadDocument?.response?.content || ""}` };
              Object.assign(searchResult, imageSource);
            });
        };
        const GetJobRole = async (searchResult) => {
            const QUERY_JOBROLE = {
              query: `query MyQuery {
                getJobRoleAndDepartment(vacancyID: ${searchResult?.vacancyID}) {
                  department
                  jobRole
                }
              }`,
            };
            await gqlOpenQuery(QUERY_JOBROLE, null)
              .then((res) => res.json())
              .then((datas) => {
                
                Object.assign(searchResult, { jobRole: datas?.data?.getJobRoleAndDepartment?.jobRole });
              });
          };

        const getAllInfo = searchResultsParams?.map(async (sR, index) => {
          await logo(sR);
          await GetJobRole(sR);
        });
    
        const getOtherInfos = async () => {
          const newJobs = searchResultsParams?.map((searchResult, index) => {
    
            return {
              jobTitle: searchResult?.jobTitle,
              jobRole: searchResult?.jobRole,
              qualification: searchResult?.qualification,
              skill: searchResult?.skill,
              primarySpecialization: searchResult?.getJobPostPrimarySpecialization,
              secondarySpecialization: searchResult?.getJobPostSecondarySpecialization,
              description: searchResult?.description,
              maximumSalary: searchResult?.maximumSalary,
              minimumSalary: searchResult?.minimumSalary,
              location: searchResult?.location,
              postedOn: searchResult?.postedOn,
              expMin: searchResult?.expMin,
              expMax: searchResult?.expMax,
              isSalaryDisclosed: searchResult?.isSalaryDisclosed,
              vacancyID: searchResult?.vacancyID,
              hospitalID: searchResult?.hospitalID,
              savedJob: searchResult?.savedJob,
              hospitalName: searchResult?.name,
              employmentType: searchResult?.employmentType,
              logo: searchResult?.imageSource
            };
          });
          setLoading(false)
          setAppliedFilterJobs(newJobs)
          setAppliedJobs(newJobs)
          // console.log('New jobs >>', newJobs)
        };
        try {
          await Promise.all(getAllInfo);
          await getOtherInfos();
        } catch (err) {
    
        }
    
      };
     
  return (
<View style={{flex: 1}}>
    {/* <View style={styles.searchBtn}>
        <TextInput 
        onChangeText={(text) => FilterAppliedJobs(text)}
            style={{width: '92%', color: 'black'}}
            placeholderTextColor="gray" 
            placeholder="Search applied jobs" />
        <Ionicons name="search" size={20} color='#6F7482' />
    </View> */}

    <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: 15, paddingBottom: 50}}>
        {
            loading ?  <Bullets active listSize={15} /> : <>
                {
                appliedFilterJobs?.map((job) => (
                    <JobCard jobItem={job} />
                ))
                }
            </>
        }
    </ScrollView>

</View>
  )
}

const styles = StyleSheet.create({
    searchBtn:{
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 50,
        marginTop: 10,
        width: '88%',
        borderColor: '#E4EEF5',
        borderWidth: 1,
        alignSelf: 'center'
    },
});