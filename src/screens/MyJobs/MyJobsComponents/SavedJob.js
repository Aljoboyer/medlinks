import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import JobCard from '../../../components/JobCard/JobCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { QUERY_SAVEDJOBS } from '../../../graphql';
import { gqlOpenQuery, gqlquery } from '../../../api/doctorFlow';
import { Bullets } from 'react-native-easy-content-loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { showMessage } from 'react-native-flash-message';

export default function SavedJob() {
    const isFocused = useIsFocused()
    const [loading, setLoading] = useState(false);
    const [savedjobsfilter, setSavedJobsfilter] = useState([])
    const [storeJob, setStoreJob] = useState([]);
    const navigation = useNavigation()
    const [searchKey, SetSearchKey] = useState('')

    const filtersavedjob = (text) => {
      SetSearchKey(text);
      if(text?.length > 1 ){
        const filterjobs = storeJob.filter((item) => item?.jobRole?.toLowerCase().includes(text.toLowerCase()) || item?.jobTitle?.toLowerCase().includes(text.toLowerCase()) );
        setSavedJobsfilter(filterjobs)
      }
      else{
          setSavedJobsfilter(storeJob)
      }
  }

    const handleFetch = async () => {
        setLoading(true);

        gqlquery(QUERY_SAVEDJOBS, null)
            .then((res) => res.json())
            .then((data) => {
                // console.log('save job data', data?.data?.getSavedJobs);
               
                getInfo(data?.data?.getSavedJobs)
   
            });
    };

    useEffect(() => {
        handleFetch();
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
              const imageSource = { "imageSource": downloadDocument?.response?.content ? `data:image/png;base64,${downloadDocument?.response?.content || ""}` : 'data:image/png;base64,'};
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
              jobTitle: searchResult?.jobRole || searchResult?.otherJobRole,
              jobRole: searchResult?.jobRole || searchResult?.otherJobRole,
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
          setLoading(false);
          setSavedJobsfilter(newJobs);
          setStoreJob(newJobs)
          console.log('New jobs >>', newJobs)
        };
        try {
          await Promise.all(getAllInfo);
          await getOtherInfos();
        } catch (err) {
          
        }
    
      };

      const unSaveHandler = async (vacancyID) => {
        
        const QUERY_REMOVEJOBFROMSAVEDLIST = {
          query: `mutation MyMutation {
                  removeJobFromSavedList (vacancyID: ${Number(vacancyID)})
                  }`,
          variables: null,
          operationName: "MyMutation",
        };
    
        gqlquery(QUERY_REMOVEJOBFROMSAVEDLIST, null)
          .then((res) => res.json())
          .then((data) => {
            if (data) {
     
              handleFetch()

              showMessage({
                message: "Job unsaved",
                type: "danger",
                hideStatusBar: true
              });
            }
          })
          .finally((e) => console.log("Deleting Save Job from database"));
      };

return (

<View style={{flex: 1}}>
    {/* <View style={styles.searchBtn}>
        <TextInput 
          onChangeText={(text) => filtersavedjob(text)}
            style={{width: widthPercentageToDP('80%'), color: 'black'}}
            placeholderTextColor="gray" 
            placeholder="Search saved jobs" />
        <Ionicons name="search" size={20} color='#6F7482' />
    </View> */}
      
    <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: 15, paddingBottom: 50}}>
        {
            loading ?  <Bullets active listSize={15} /> : <>
                {
                savedjobsfilter?.map((job) => (
                    <JobCard unSaveHandler={unSaveHandler} from='save job' jobItem={job} />
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
        // width: 320,
        borderColor: '#E4EEF5',
        borderWidth: 1,
        alignSelf: 'center'
    },
});