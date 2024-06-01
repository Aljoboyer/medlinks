import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import JobCard from '../components/JobCard/JobCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { gqlOpenQuery, gqlquery } from '../api/doctorFlow';
import { Bullets } from "react-native-easy-content-loader"; 
import { useSelector } from 'react-redux';

export default function Home() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading,setLoading] = useState(false);
    const [recommendedJobs,setRecommendedJobs] = useState([]);
    const [sort, setSort] = useState("");
    const [trendingjob, settrendingjob] = useState([])

    const isLogged = useSelector((state) => state.globalSettingStore.isLogged);

// --------------Fetching Remcoanded job--------//
    useEffect(() => {
       if(isLogged){
        setLoading(pre => !pre);
        const QUERY_FOUR_RECOMMANDEDJOBS = {
          query: `query MyQuery {
            getRecommendedJobs(
                pageNumber: ${Number(1)}, 
                education: "", 
                expMin: ${Number(0)}, 
                expMax: ${Number(59)}, 
                hospital: "", 
                jobType: "", 
                location: "", 
                maximumSalary: ${Number(9999999)}, 
                minimumSalary: ${Number(1)}, 
                sortBy: "postedOn desc", 
                specialization: "",
                filterValue: ${false},
                userLocation:"",
              )
          }`,
          variables: null,
          operationName: "MyMutation",
        };
    
        gqlquery(QUERY_FOUR_RECOMMANDEDJOBS, null)
          .then((res) => res.json())
          .then((data) => {
         
            let getRecommendedJobsData = data?.data?.getRecommendedJobs;
            getRecommendedJobsData = JSON.parse(getRecommendedJobsData)?.data;
            
            getInfo(getRecommendedJobsData)

          });
       }
      }, []);

// --------------Fetching Trending job--------//
      useEffect(() => {
        if(!isLogged){
            handleFetch()
        }
    }, [isFocused])

  const handleFetch = async () => {
        setLoading(pre => !pre);

        const QUERY_SEARCHJOBS = {
            query: `query MyQuery {
                searchJobs(
                  location: "${""}", 
                  keyword: "", 
                  education: "${""}", 
                  expMax: ${Number(20)},
                  expMin: ${Number(0)},
                  hospital: "${""}", 
                  jobType: "${""}", 
                  maximumSalary: ${Number(0)}, 
                  specialization: "${""}", 
                  minimumSalary: ${Number(1000)},
                  pageNumber: ${Number(1)},
                  sortBy: "${((sort === "" || sort === "Relevance") && "relevance") || (sort === "Date" && "postedOn desc") || (sort === "Salary" && "maximumSalary desc")}"
                  )
                }
        `,
            variables: null,
            operationName: "MyMutation",
        };

    gqlOpenQuery(QUERY_SEARCHJOBS, null)
        .then((res) => res.json())
        .then((data) => {
            const jobData = JSON?.parse(data?.data?.searchJobs)?.data;

            getInfo(jobData)
        })
    };
    
    const getInfo = async (searchResultsParams) => {

      const logo = async (searchResult) => {
          const QUERY_DOWNLOADHOSPITALLOGO = {
              query: `query MyQuery {
            downloadDocument (url: "${searchResult?.logo}")
          }`,
          };

          await gqlOpenQuery(QUERY_DOWNLOADHOSPITALLOGO, null)
              .then((res) => res.json())
              .then((datas) => {
                  if (datas?.data?.downloadDocument) {
                      const downloadDocument = JSON?.parse(datas?.data?.downloadDocument);
                      const imageSource = { "imageSource": `data:image/png;base64,${downloadDocument?.response?.content}` };
                      Object.assign(searchResult, imageSource);
                  };
              });
      };

      const getAllInfo = searchResultsParams?.map(async (sR, index) => {
          await logo(sR);

      });

      const getOtherInfos = async () => {

          const newJobs = searchResultsParams?.map((searchResult, index) => {
             
              return {

                  jobTitle: searchResult?.jobTitle,
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
                  hospitalName: searchResult?.hospitalName,
                  employmentType: searchResult?.employmentType,
                  logo: searchResult?.imageSource
              };
          });

          if(isLogged){
            setRecommendedJobs(newJobs)
          }
          else{
            settrendingjob(newJobs);
          }

          setLoading(pre => !pre);
      };
      try {
          await Promise.all(getAllInfo);
          await getOtherInfos();
      } catch (err) {

      }

  };

  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        
        <View style={styles.homeHeader}>
            <Pressable onPress={() => {
              if(isLogged){
                navigation.navigate('SearchJob')
              }
              else{
                navigation.navigate('SearchJobs')
              }
            }} style={styles.searchBtn}>
                <Ionicons name="search" size={20} color='#6F7482' />
                <Text style={styles.pleaceHolderTxt}>Search jobs by ‘Job role’</Text>
            </Pressable>
        </View>
 
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20,}}>

          <View style={styles.recomandedJobHeader}>
              <Text style={styles.recomandedTxt}>{isLogged ? "Recommended Jobs" : "Trending Jobs"}</Text>

              {/* <Pressable>
                  <Text style={styles.viewAllBtnTxt}>View All</Text>
              </Pressable> */}
          </View>

        {/* ---------------Recomanded Job View---------------- */}
        {
          loading ?  <Bullets active listSize={15} /> : 
          <>
            {
              recommendedJobs?.slice(0, 30)?.map((item) => (
                  <JobCard  jobItem={item} />
              ))
            }
          </>
        }
        
      {/* ---------------trendingjob Job View---------------- */}
      {
          loading ?  <Bullets active listSize={15} /> : 
          <>
            {
              trendingjob?.slice(0, 30)?.map((item) => (
                  <JobCard  jobItem={item} />
              ))
            }
          </>
        }

        </ScrollView>
        {
  !isLogged && <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginBtn}>
  <Text style={styles.loginBtnTxt}>Register/Login</Text>
</Pressable>
}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    homeHeader:{
        height: 90,
        backgroundColor: '#395987',
        paddingVertical: 10,
        paddingHorizontal: 18
    },
    searchBtn:{
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10
    },
    pleaceHolderTxt:{
        color: '#B8BCCA',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginLeft: 5
    },
    recomandedJobHeader:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20
    },
    recomandedTxt:{
        color: '#000000',
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
    },
    viewAllBtnTxt:{
        color: '#395987',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
    loginBtn:{
      backgroundColor: '#395987',
      width: '100%',
      height: 54,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
    },
    loginBtnTxt:{
      fontSize: 14,
      fontWeight: '500',
      color: 'white'
    },
});