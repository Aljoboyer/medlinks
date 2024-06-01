import { View, Text, ScrollView, Pressable, StyleSheet, 
  TextInput, FlatList, Image, ActivityIndicator,TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState , useRef} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import JobFilterSheet from '../components/JobFilterSheet/JobFilterSheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import JobCard from '../components/JobCard/JobCard';
import { Bullets } from "react-native-easy-content-loader"; 
import { gqlOpenQuery, gqlquery } from '../api/doctorFlow';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorText from '../components/ErrorText/ErrorText';
import { showMessage } from 'react-native-flash-message';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FormLabelText from '../components/formlabelText/formlabelText';
import { Dropdown } from 'react-native-element-dropdown';
import SingleItemBottomSheet from '../components/singleItemBottomSheet/singleItemBottomSheet';
import { Auth } from 'aws-amplify';
import { useDispatch, useSelector } from 'react-redux'
import { setSearchParams } from '../Redux_Mine/Redux_Slices/GlobalSettingSlice';

const popularData = ['Nurse', 'Doctor', 'Lab Technician', 'Pharmacist']
const filterItemData = ['Sort By', 'Location', 'Salary', 'Experience', 'Job Type', 'Clear All'];

export default function SearchJob({route}) {
  const { keyword, searchlocation, searchmaximumSalary, searchminimumSalary, searchminexp, searchmaxexp, searchhospital, searchedu, alertSearchSkill, alertSearchSpecialization, alertSearchJobType } = useSelector((state) => state.globalSettingStore.searchParams); 
  // console.log('Hello Keyword >>>>>>', keyword, searchlocation)
    let listViewRef;
    let resText = /^[A-Za-z0-9\s]*$/;
    const navigation = useNavigation();
    const dispatchAction = useDispatch()
    const isFocused = useIsFocused();
    const dropDownlocation = useRef();
    const [scrollIndex, setScrollIndex] = useState(1);
    const [filterSheetShow, setFilterSheetShow] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [scrollLoading, setScrollLoading] = useState(false);
    const [alerLoader, setAlertLeader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filterLoader, setFilterLoader] = useState(false)
    const [form, setForm] = useState({
        jobTitle: "",
        location: "",
        education: "",
        jobType: "",
        experienceMax: 59,
        experienceMin: 0,
        lastDateToApply: new Date(),
        description: "",
        specialization: "",
        hospital: "",
        skill: "",
        annualSalary: [0, 9999999]
      });
    const [locationModal, setLocationModal] = useState(false)
    const [userId, setUserId] = useState('')

    // const userLocation = AsyncStorage.getItem("state");
    const userLocation = "";
    const [allCityLocation, setAllCityLocation] = useState([])
    const [cityLocation, setCityLocation] = useState({})

    const [jobAlertModalShow,setJobAlertModalShow] = useState(false)

    const [alertName, setAlertName] = useState('');
    const [alertNameErr, setAlertNameErr] = useState('')

// --------------For pagitnation -----------//
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [totalJobs, setTotalJobs] = useState('')

    //----------------Filter Field------------//
    const [exp1, setExp1] = useState(0);
    const [exp2, setExp2] = useState(59)
    const [salary1, setSalary1] = useState(0);
    const [salary2, setSalary2] = useState(9999999);
    const [sortchecked, setSortchecked] = useState(3);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [jobRoles, setJobRoles] = useState([])
    const [jobRoleSearchViewShow, setJobRoleSearchViewShow] = useState(false)
    const [allFilterOption, setAllFilterOption] = useState({
        jobTitle: "",
        location: "",
        education: "",
        specialization: "",
        skills: "",
        hospital: "",

      })
    const [salaryOptions, setSalaryOptions] = useState([]);
    const [experienceOptions, setExperienceOptions] = useState([]);
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('')
    const [expMax, setExpMax] = useState('');
    const [expMin, setExpmin] = useState('');

//-----------------Checked Array---------------//
const [locationChecked, setLocationChecked] = useState([]);
const [jobTypeChecked, setJobTypeChecked] = useState([]);
const [salaryChecked, setSalaryChecked] = useState([]);
const [experienceChecked, setExperienceChecked] = useState([]);

//-----------Filter Option--------------//
const [locationFilterOptions, setLocationFilterOptions] = useState([]);
const [jobTypeFilterOptions, setJobTypeFilterOptions] = useState([]);

//------------------All Jobs-----------------//
  const [allSearchJobs, setAllSearchJobs] = useState([])

  const profile = useSelector((state) => state.profilestore.profileData);
  const isLogged = useSelector((state) => state.globalSettingStore.isLogged);

  useEffect(() => {
    if(keyword){
      handleSearch()
      setSearchKeyword(keyword)
    }
  },[keyword, searchlocation, searchmaximumSalary, isFocused])
// -----------Searching job----------//
    const handleSearch = async (locationParam) => {
      setAllSearchJobs([])
      setLoading(true)
        
        const QUERY_SEARCHJOBS = {
            query: `query MyQuery {
            searchJobs(
                location: "${locationParam ? locationParam : searchlocation ? searchlocation : ""}", 
                keyword: "${searchKeyword ? searchKeyword : keyword ? keyword : ""}", 
                education: "", 
                expMax: ${form?.experienceMax ? form?.experienceMax : searchmaxexp ? searchmaxexp : 54},
                expMin: ${form?.experienceMin ? form?.experienceMin : searchminexp ? searchminexp : 0},
                hospital: "", 
                jobType: "${""}", 
                maximumSalary: ${form?.annualSalary[1] ? form?.annualSalary[1] : searchmaximumSalary ? searchmaximumSalary : 9999999}, 
                specialization: "${""}", 
                minimumSalary: ${form?.annualSalary[0] ? form?.annualSalary[0] : searchminimumSalary ? searchminimumSalary : 0},
                pageNumber: ${Number(1)},
                skill:"${""}",
                filterValue:false,
                userLocation:"${userLocation || ""}",
                sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") || (sortchecked == 1 && "postedOn desc") || (sortchecked == 2 && "maximumSalary desc")}"
            )
            }
            `,
            variables: null,
            operationName: "MyMutation",
        };

        gqlOpenQuery(QUERY_SEARCHJOBS, null)
            .then((res) => res.json())
            .then((data) => {
            console.log("QUERY_SEARCHJOBS query first search ===>", QUERY_SEARCHJOBS,data)

            const jobData = JSON?.parse(data?.data?.searchJobs)?.data;
            setLastPage(JSON.parse(data?.data?.searchJobs)?.number_of_page)
            setTotalJobs(JSON?.parse(data?.data?.searchJobs)?.totalJob)
            GetFilterOption()
            getInfo(jobData);
            }).finally(() => console.log('loaded'));
    };

// ----------Formating the job-----------//
    const getInfo = async (searchResultsParams) => {

    const logo = async (searchResult) => {
        console.log("searchResult?.logo", searchResult?.logo)
        if (searchResult?.logo) {
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
        }
        else {
        const imageSource = { imageSource: 'data:image/png;base64,' };
        Object.assign(searchResult, imageSource);
        }
        console.log("searchResult?.logo end.......", searchResult?.logo)
    };


    const getAllInfo = searchResultsParams?.map(async (sR, index) => {

        // await primarySpec(sR);
        // await secondarySpec(sR);
        await logo(sR);
        // await GetJobRole(sR)
    });

    const getOtherInfos = async () => {

      const newJobs = searchResultsParams?.map((searchResult, index) => {

      return {
          // date_diff_indays,
          jobTitle: searchResult?.jobTitle,
          jobRole: searchResult?.jobRole || searchResult?.otherJobRole,
          qualification: searchResult?.qualification,
          skill: searchResult?.skill,
          // primarySpecialization: searchResult?.getJobPostPrimarySpecialization,
          // secondarySpecialization: searchResult?.getJobPostSecondarySpecialization,
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

      setLoading(false)
      setAllSearchJobs((prev) => [...prev, ...newJobs]);
      setScrollLoading(false)
    };
    try {
        await Promise.all(getAllInfo);
        await getOtherInfos();
    } catch (err) {
        console.log('Error from getinfo ===>', err)
    }

    };

//--------------Getting Filter Options---------------//
const GetFilterOption = async () => {

    const QUERY_FILTEROPTIONSBYLOCATION = {
      query: `query MyQuery {
        getSearchJobFilter(
          keyword: "${searchKeyword ? searchKeyword : ""}", 
          location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
          education: "${form?.education ? form.education : ""}", 
          expMax: ${Number(exp2)},
          filterColumn: "location", 
          filterValue:false,
          expMin: ${Number(exp1)},
          hospital: "${form?.hospital || ""}",
          jobType: "${form?.jobType || ""}",
          maximumSalary: ${Number(form?.annualSalary[1])}, 
          minimumSalary: ${Number(form?.annualSalary[0])}, 
          pageNumber: 1,
          userLocation: "${userLocation || ""}", 
          specialization:"${form?.specialization || ""}",
          sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
        (sortchecked == 1 && "postedOn desc") ||
        (sortchecked == 2 && "maximumSalary desc")
        }" )}`,

      variables: null,
      operationName: "MyQuery",
    };
    // const QUERY_FILTEROPTIONSBYEDUCATION = {
    //   query: `query MyQuery {
    //     getSearchJobFilter(
    //       keyword: "${searchKeyword ? searchKeyword  : ""}", 
    //       location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
    //       education: "${form?.education ? form.education  : ""}", 
    //       expMax: ${Number(exp2)},
    //       filterColumn: "education", 
    //       filterValue:false,
    //       expMin: ${Number(exp1)},
    //       hospital: "${form?.hospital || ""}",
    //       jobType: "${form?.jobType || ""}",
    //       maximumSalary: ${Number(form?.annualSalary[1])}, 
    //       minimumSalary: ${Number(form?.annualSalary[0])}, 
    //       pageNumber: 1,
    //       userLocation: "${userLocation || ""}", 
    //       specialization:"${form?.specialization || ""}",
    //       sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
    //     (sortchecked == 1 && "postedOn desc") ||
    //     (sortchecked == 2 && "maximumSalary desc")
    //     }" )
    //     }
    //     `,

    //   variables: null,
    //   operationName: "MyQuery",
    // };
    const QUERY_FILTEROPTIONSBYJOBTYPE = {
      query: `query MyQuery {
        getSearchJobFilter(
          keyword: "${searchKeyword ? searchKeyword  : ""}",
          location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
          education: "${form?.education ? form.education  : ""}", 
          expMax: ${Number(exp2)},
          filterColumn: "jobsType", 
          filterValue:false,
          expMin: ${Number(exp1)},
          hospital: "${form?.hospital || ""}",
          jobType: "${form?.jobType || ""}",
          maximumSalary: ${Number(form?.annualSalary[1])}, 
          minimumSalary: ${Number(form?.annualSalary[0])}, 
          pageNumber: 1,
          userLocation: "${userLocation || ""}", 
          specialization:"${form?.specialization || ""}",
          sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
        (sortchecked == 1 && "postedOn desc") ||
        (sortchecked == 2 && "maximumSalary desc")
        }" )
        }
        `,

      variables: null,
      operationName: "MyQuery",
    };
    // const QUERY_FILTEROPTIONSBYHOSPITAL = {
    //   query: `query MyQuery {
    //     getSearchJobFilter(
    //       keyword: "${searchKeyword ? searchKeyword  : ""}",  
    //       location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
    //       education: "${form?.education ? form.education  : ""}", 
    //       expMax: ${Number(exp2)},
    //       filterColumn: "hospital", 
    //       filterValue:false,
    //       expMin: ${Number(exp1)},
    //       hospital: "${form?.hospital || ""}",
    //       jobType: "${form?.jobType || ""}",
    //       maximumSalary: ${Number(form?.annualSalary[1])}, 
    //       minimumSalary: ${Number(form?.annualSalary[0])}, 
    //       pageNumber: 1,
    //       userLocation: "${userLocation || ""}", 
    //       specialization:"${form?.specialization || ""}",
    //       sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
    //     (sortchecked == 1 && "postedOn desc") ||
    //     (sortchecked == 2 && "maximumSalary desc")
    //     }" )
    //     }
    //     `,

    //   variables: null,
    //   operationName: "MyMutation",
    // };
    // const QUERY_FILTEROPTIONSBYSPECIALIZATION = {
    //   query: `query MyQuery {
    //     getSearchJobFilter(
    //       keyword: "${searchKeyword ? searchKeyword  : ""}", 
    //       location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
    //       education: "${form?.education ? form.education  : ""}", 
    //       expMax: ${Number(exp2)},
    //       filterColumn: "specialization", 
    //       filterValue:false,
    //       expMin: ${Number(exp1)},
    //       hospital: "${form?.hospital || ""}",
    //       jobType: "${form?.jobType || ""}",
    //       maximumSalary: ${Number(form?.annualSalary[1])}, 
    //       minimumSalary: ${Number(form?.annualSalary[0])}, 
    //       pageNumber: 1,
    //       userLocation: "${userLocation || ""}", 
    //       specialization:"${form?.specialization || ""}",
    //       sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
    //     (sortchecked == 1 && "postedOn desc") ||
    //     (sortchecked == 2 && "maximumSalary desc")
    //     }" )
    //     }
    //     `,

    //   variables: null,
    //   operationName: "MQueryn",
    // };
    // const QUERY_FILTEROPTIONSBYSKILLS = {
    //   query: `query MyQuery {
    //     getSearchJobFilter(
    //       keyword: "${searchKeyword ? searchKeyword  : ""}", 
    //       location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
    //       education: "${form?.education ? form.education  : ""}", 
    //       expMax: ${Number(exp2)},
    //       filterColumn: "skill",
    //       filterValue:false,
    //       expMin: ${Number(exp1)},
    //       hospital: "${form?.hospital || ""}",
    //       jobType: "${form?.jobType || ""}",
    //       maximumSalary: ${Number(form?.annualSalary[1])}, 
    //       minimumSalary: ${Number(form?.annualSalary[0])}, 
    //       pageNumber: 1,
    //       userLocation: "${userLocation || ""}", 
    //       specialization:"${form?.specialization || ""}",
    //       sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
    //     (sortchecked == 1 && "postedOn desc") ||
    //     (sortchecked == 2 && "maximumSalary desc")
    //     }" )
    //     }
    //     `,

    //   variables: null,
    //   operationName: "MQueryn",
    // };
    const QUERY_FILTEROPTIONSBYEXPERIENCE = {
      query: `query MyQuery {
        getSearchJobFilter(
          keyword: "${searchKeyword ? searchKeyword  : ""}", 
          location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
          education: "${form?.education ? form.education  : ""}", 
          expMax: ${form?.experienceMax || 59},
          filterColumn: "experience", 
          filterValue:false,
          expMin: ${form?.experienceMin || 0},
          hospital: "${form?.hospital || ""}",
          jobType: "${form?.jobType || ""}",
          maximumSalary: ${Number(form?.annualSalary[1])}, 
          minimumSalary: ${Number(form?.annualSalary[0])}, 
          pageNumber: 1,
          userLocation: "${userLocation || ""}", 
          specialization:"${form?.specialization || ""}",
          sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
        (sortchecked == 1 && "postedOn desc") ||
        (sortchecked == 2 && "maximumSalary desc")
        }" )
        }
        `,

      variables: null,
      operationName: "MyQuery",
    };

    const QUERY_FILTEROPTIONSBYSALARY = {
      query: `query MyQuery {
        getSearchJobFilter(
          keyword: "${searchKeyword ? searchKeyword  : ""}", 
          location: "${form?.location ? form.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}",
          education: "${form?.education ? form.education  : ""}", 
          expMax: ${Number(exp2)},
          filterColumn: "salary", 
          filterValue:false,
          expMin: ${Number(exp1)},
          hospital: "${form?.hospital || ""}",
          jobType: "${form?.jobType || ""}",
          maximumSalary: ${Number(form?.annualSalary[1])}, 
          minimumSalary: ${Number(form?.annualSalary[0])}, 
          pageNumber: 1, 
          userLocation: "${userLocation || ""}",
          specialization:"${form?.specialization || ""}",
          sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
        (sortchecked == 1 && "postedOn desc") ||
        (sortchecked == 2 && "maximumSalary desc")
        }" )
        }
        `,

      variables: null,
      operationName: "MyQuery",
    };
   

    gqlOpenQuery(QUERY_FILTEROPTIONSBYLOCATION, null)
      .then((res) => res.json())
      .then((data) => {

        let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
        setAllFilterOption(prevstate => ({ ...prevstate, "location": jsonbject }));

      });
    // gqlOpenQuery(QUERY_FILTEROPTIONSBYEDUCATION, null)
    //   .then((res) => res.json())
    //   .then((data) => {

    //     let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
    //     setAllFilterOption(prevstate => ({ ...prevstate, "education": jsonbject }));
    //   });
    // gqlOpenQuery(QUERY_FILTEROPTIONSBYSPECIALIZATION, null)
    //   .then((res) => res.json())
    //   .then((data) => {

    //     let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
    //     setAllFilterOption(prevstate => ({ ...prevstate, "specialization": jsonbject }));
    //   });
    // gqlOpenQuery(QUERY_FILTEROPTIONSBYSKILLS, null)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('SKill Query ----->>>', QUERY_FILTEROPTIONSBYSKILLS)
    //     let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
    //     setAllFilterOption(prevstate => ({ ...prevstate, "skills": jsonbject }));

    //   });
    gqlOpenQuery(QUERY_FILTEROPTIONSBYSALARY, null)
      .then((res) => res.json())
      .then((data) => {
        let jsonbject = JSON.parse(data?.data?.getSearchJobFilter)
       
        if (jsonbject?.length > 0) {
            setSalary1(jsonbject[0])
            setSalary2(jsonbject[1])

            const start = jsonbject[0];
            const end = Number(jsonbject[1]) > 90000 ? 90000 : jsonbject[1];
            const step = 10000; 

            const result = [];

            for (let i = start; i <= end; i += step) {
              const rangeStart = i;
              const rangeEnd = Math.min(i + step, end);

              if(rangeEnd <= end){

                const rangeString = {min: `${rangeStart}`, max: `${rangeEnd}`, checkData: `${rangeStart}${rangeEnd}`};
                result.push(rangeString);
              }
              else{
                break;
              }

             
            }
            setSalaryOptions(result)
        }
      });

    gqlOpenQuery(QUERY_FILTEROPTIONSBYEXPERIENCE, null)
      .then((res) => res.json())
      .then((data) => {
        let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
    
        if (jsonbject?.length > 0) {
          setExp1(jsonbject[0])
          setExp2(jsonbject[1])

          const start = jsonbject[0];
          const end = jsonbject[1]
          const step = 1; 

          const result = [];

          for (let i = start; i <= end; i += step) {
            const rangeStart = i;
            const rangeEnd = Math.min(i + step, end);

            if(10 >= rangeEnd){

              const rangeString = {min: `${rangeStart}`, max: `${rangeEnd}`, checkData: `${rangeStart}${rangeEnd}`};
              result.push(rangeString);
            }
            else{
              break;
            }

           
          }
          setExperienceOptions(result)
      }
      });

    gqlOpenQuery(QUERY_FILTEROPTIONSBYJOBTYPE, null)
      .then((res) => res.json())
      .then((data) => {
        let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);

        setAllFilterOption(prevstate => ({ ...prevstate, "jobType": jsonbject }));
      });
    // gqlOpenQuery(QUERY_FILTEROPTIONSBYHOSPITAL, null)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     let jsonbject = JSON.parse(data?.data?.getSearchJobFilter);
    //     setAllFilterOption(prevstate => ({ ...prevstate, "hospital": jsonbject }));

    //   })

  }

//-----------Clear Filter-------------//
const clearFilterHandler = () => {
  setForm({
    jobTitle: "",
    location: "",
    education: "",
    jobType: "",
    experienceMax: 59,
    experienceMin: 0,
    lastDateToApply: new Date(),
    description: "",
    specialization: "",
    hospital: "",
    skill: "",
    annualSalary: [0, 9999999]
  })

  setLocationFilterOptions([]);
  setJobTypeFilterOptions([]);
  setSalaryOptions([])
  setExperienceOptions([])

  setLocationChecked([])
  setJobTypeChecked([])
  setSalaryChecked([])
  setExperienceChecked([])
  setSortchecked(3)

  setSalary1(0)
  setSalary2(9999999)
  setExp2(55)
  setExp1(0)

  setExpMax('')
  setExpmin('')
  setSalaryMax('')
  setSalaryMin('')

  handleSearch(false);

  setFilterSheetShow(false)
};

//-------------Refreshing---------//
const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const lodeMoreData = async () => {
    // ---------------new------------//

    let nextPage = currentPage + 1;
   
    const QUERY_SEARCHJOBS = {
      query: `query MyQuery {
        searchJobs(
          location: "${cityLocation?.cityWithState || ""}", 
          keyword: "${searchKeyword ?  searchKeyword : ""}", 
          education: "${""}", 
          expMax: ${Number(exp2)},
          expMin: ${Number(exp1)},
          hospital: "${""}", 
          jobType: "${""}", 
          maximumSalary: ${Number(salary2)}, 
          specialization: "${""}", 
          minimumSalary: ${Number(salary1)},
          pageNumber: ${nextPage},
          userLocation: "",
          skill:"${""}",
          filterValue: ${false},
          sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") ||
        (sortchecked == 1 && "postedOn desc") ||
        (sortchecked == 2 && "maximumSalary desc")
        }" )
        }
        `,
      variables: null,
      operationName: "MyMutation",
    };
    gqlOpenQuery(QUERY_SEARCHJOBS, null)
      .then((res) => res.json())
      .then((data) => {
        const jobData = JSON?.parse(data?.data?.searchJobs)?.data;
        setCurrentPage(nextPage)
        getInfo(jobData);
      }).finally(() => console.log('loaded'));
  }

//----------------Check Box Handler---------------//
const handleCheckboxLocation = (name) => {

    if (locationFilterOptions.includes(name)) {
      const filterData = locationFilterOptions?.filter((item) => item !== name)

      setForm({ ...form, "location": filterData?.join(",") })
      setLocationFilterOptions([...filterData])
    }
    else {
      const locationArr = [...locationFilterOptions, name]
      setForm({ ...form, "location": locationArr?.join(",") })
      setLocationFilterOptions([...locationArr])
    }
  
  };

  const handleCheckboxJobType = (name) => {

    if (jobTypeFilterOptions.includes(name)) {
      const xyz = jobTypeFilterOptions.indexOf(name);
      jobTypeFilterOptions.splice(xyz, 1);
      setForm({ ...form, "jobType": jobTypeFilterOptions?.join(",") })
      setJobTypeFilterOptions([...jobTypeFilterOptions])
    }
    else {
      const locate = [...jobTypeFilterOptions, name]
      setForm({ ...form, "jobType": locate?.join(",") })
      setJobTypeFilterOptions([...locate])
    }
  };

  const currentUserUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    
    setUserId(user?.attributes?.sub)
  }
    
//---------Calling Function On Focused
    useEffect(() => {
        GetFilterOption()
        currentUserUserData()
    },[isFocused])


//--------Location Search------------//
    const SearchLocation = (text) => {
      const val = text?.split(" ").length - 1;
      const valtwo = text?.length - val
      const searchtext = text.trim();
      if (text && text !== " " && text !== "" && valtwo >= 2) {

          const GET_CITY = {
              query: `query MyQuery {
                searchCity(city: "${searchtext}") {
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

          gqlOpenQuery(GET_CITY, null)
              .then((res) => res.json())
              .then((datas) => {
                  console.log(datas)
                  setAllCityLocation([...datas?.data?.searchCity])
                  setCityLocation(text)
              });
      }
      else {

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

          gqlOpenQuery(GET_CITY, null)
              .then((res) => res.json())
              .then((datas) => setAllCityLocation(datas?.data?.getCityMaster));
      }
    }

    useEffect(() => {
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

      gqlOpenQuery(GET_CITY, null)
          .then((res) => res.json())
          .then((datas) => {
              setAllCityLocation(datas?.data?.getCityMaster)
          });
    }, [])

//--------------Filtering the job-----------//
    const FilterHandler = async () => {
      
      setLoading(true)
      setFilterLoader(true)

      const QUERY_SEARCHJOBS = {
        query: `query MyQuery {
          searchJobs(
            location: "${form?.location ? form?.location : cityLocation?.cityWithState ? cityLocation?.cityWithState : ""}", 
            keyword: "${searchKeyword ? searchKeyword : ""}", 
            education: "${form?.education ? form?.education  : ""}", 
            expMax: ${expMax ? Number(expMax) : Number(exp2)},
            expMin: ${expMin ? Number(expMin) : Number(exp1)},
            hospital: "${form?.hospital ? form?.hospital  : ""}", 
            jobType: "${form?.jobType ? form?.jobType  : ""}", 
            maximumSalary: ${salaryMax ? Number(salaryMax) : Number(salary2)}, 
            specialization: "${form?.specialization ? form?.specialization  : ""}", 
            minimumSalary: ${salaryMin ? Number(salaryMin) : Number(salary1)},
            pageNumber: ${Number(1)},
            userLocation: "${userLocation || ""}",
            skill: "${form?.skill ? form?.skill  : ""}",
            filterValue: ${(form?.locationFilter || form?.educationFilter || form?.hospitalFilter || form?.jobTypeFilter || exp1 || exp2 || form?.specialization) ? true : false},
            sortBy: "${((sortchecked == 3 || sortchecked == 0) && "relevance") || (sortchecked == 1 && "postedOn desc") || (sortchecked == 2 && "maximumSalary desc")}"
            )
          }
          `,
        variables: null,
        operationName: "MyMutation",
      };

      gqlOpenQuery(QUERY_SEARCHJOBS, null)
        .then((res) => res.json())
        .then((data) => {
          console.log('Filter QUery', QUERY_SEARCHJOBS)
          const jobData = JSON?.parse(data?.data?.searchJobs)?.data;
      
          setTotalJobs(JSON?.parse(data?.data?.searchJobs)?.totalJob)
          setLastPage(JSON.parse(data?.data?.searchJobs)?.number_of_page)
          setFilterSheetShow(false)
      
          setAllSearchJobs([]);
          getInfo(jobData);
          setLoading(false);
          
        }).finally(() => {
          setFilterLoader(false)
          setLoading(false)
        }
        );


    }

    //------geting location---------//
    useEffect(() => {
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

      gqlOpenQuery(GET_CITY, null)
          .then((res) => res.json())
          .then((datas) => {
              setAllCityLocation(datas?.data?.getCityMaster)
            
          });
  }, [isFocused,locationModal])

  const cityLocationSelectHandler = (item) => {
    setCityLocation(item)
    setLocationModal(false)
    handleSearch(item?.cityWithState)
}

//---------Adding locaton free text---------//
const citylocationFreeText = (text) => {
  setCityLocation({ city: text, cityWithState: text, lmID: 0 });
  setLocationModal(false)
  handleSearch(false)
}

//-----------Scroll Handling-----------//
const OnBottomScroll = () => {
    
  if (currentPage < lastPage) {
  console.log('next page', lastPage);
  lodeMoreData();
  setScrollLoading(true)
  }
}

function hanldeTopScroll(event) {
  const yOffset = event.nativeEvent.contentOffset.y;
  if (yOffset === 0) {
  console.log('calling')
  setScrollLoading(false)
  }
}

const NextButton = () => {
  console.log(scrollIndex)
  if(scrollIndex < filterItemData?.length){
      listViewRef.scrollToIndex({ index: scrollIndex, animated: true })
  }
  else{
      return
  }
};

const FilterItem = ({item, index}) => (
<>
  {
    item == 'Sort By' ?
    <Pressable onPress={() => {
      setSelectedFilter(item)
      setFilterSheetShow(true)
  }}
  style={[styles.popularItem, {display: 'flex', flexDirection: 'row', alignItems: 'center'}, {backgroundColor: sortchecked == 0 || sortchecked == 1 ? '#395987' : '#E4EEF5'}]}
  key={item}>
      <Text style={[ {color: sortchecked == 0 || sortchecked == 1 ? 'white' : '#6F7482'}]}>{item}</Text>
  </Pressable> : 

    <>
      {
        (item !== 'Clear All') && (item !== 'Sort By') ?    
        
        <Pressable 
        onPress={() => {
        setSelectedFilter(item)
        setFilterSheetShow(true)
        }}
        style={[styles.popularItem, {display: 'flex', flexDirection: 'row', alignItems: 'center'}]}
        key={item}>
    
          {
          (locationChecked?.length > 0 && index == 1) && <View  style={styles.filterCountCircle}> 
          <Text style={styles.filterCountCircleTxt}>{locationChecked?.length}</Text>
          </View>
        }
    
        {
          (salaryChecked?.length > 0 && index == 2) && <View  style={styles.filterCountCircle}> 
          <Text style={styles.filterCountCircleTxt}>{salaryChecked?.length}</Text>
          </View>
        }
    
        {
          (experienceChecked?.length > 0 && index == 3) && <View  style={styles.filterCountCircle}> 
          <Text style={styles.filterCountCircleTxt}>{experienceChecked?.length}</Text>
          </View>
        }
    
        {
          (jobTypeChecked?.length > 0 && index == 4) && <View  style={styles.filterCountCircle}> 
          <Text style={styles.filterCountCircleTxt}>{jobTypeChecked?.length}</Text>
          </View>
        } 
        <Text>{item}</Text>
        </Pressable> : 

          <Pressable onPress={() => clearFilterHandler()}>
          <Text style={{fontSize: 12, color: '#395987',   fontFamily: 'Poppins-SemiBold', paddingHorizontal: 5}}>{item}</Text>
          </Pressable>
      }
    </>
  }
</>

)

//---------------For Search Key------//
const JobRoleSearchView = ({item, index}) => (
  <Pressable key={item?.hciID} onPress={() => {
    setSearchKeyword(item?.specialty)
    setJobRoleSearchViewShow(false)
    handleSearch(false)
  }} style={{borderBottomWidth: 1, borderBottomColor: '#E4EEF5'}}>
      <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black', paddingVertical: 7, paddingHorizontal: 7}}>{item?.specialty}</Text>
  </Pressable>
)
const searchingJobRole = (text) => {

  if (text && text !== " " && text !== "") {

    const GET_JOB_ROLE = {
      query: `query MyQuery {
        searchSpecialty(specialty: "${text}") {
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

    gqlOpenQuery(GET_JOB_ROLE, null)
      .then((res) => res.json())
      .then((datas) => {
        // console.log('search job role datas --->', datas?.data)
        if(datas?.data?.searchSpecialty?.length > 0){
          const jobRoleData = datas?.data?.searchSpecialty?.slice(0, 20)
          setJobRoles([...jobRoleData])
          setJobRoleSearchViewShow(true)
        }
       else{
        setJobRoleSearchViewShow(false)
       }
      });
  }
  else{
    setJobRoles([])
    setJobRoleSearchViewShow(false)
  }
}

  return (
<SafeAreaView style={{flex: 1}}>
        
    <View style={styles.homeHeader}>
        <Pressable onPress={() => {
          dispatchAction(setSearchParams({}))
          navigation.goBack()
        }}>
            <AntDesign style={{marginTop: 15, marginRight: 10}} name="left" size={24} color='white' />
        </Pressable>
       <View>
            <View style={[styles.searchBtn, {width: searchKeyword ? '90%' : '96%'}]}>
              <Ionicons name="search" size={20} color='#6F7482' />
              <TextInput 
              value={searchKeyword.replace(/  +/g, " ")}
              onChangeText={(text) => {
                searchingJobRole(text.trimStart())
                setSearchKeyword(text.trimStart())
                setAlertName(text)
              }}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch(false)}
                style={{width: '85%', color: 'black'}} placeholderTextColor="gray" placeholder="Search jobs by ‘Job role’" 
                
                />
              
                {
                  searchKeyword && <Pressable onPress={() => setSearchKeyword('')}>
                  <Entypo name="cross" size={24} style={{marginRight: 15}} color='#6F7482' />
                </Pressable>
                }
            </View>
  {/* ---------------Job Role Search Item view-------------- */}
            {
              jobRoleSearchViewShow && <View style={styles.jobRoleSearchItemView}>
              <FlatList
                data={jobRoles}
                renderItem={JobRoleSearchView}
                keyExtractor={item => item?.hciID}
                />
              </View>
            }

            <View style={[styles.searchBtn,  {width: searchKeyword ? '90%' : '96%'}]}>
                <Ionicons name="location-sharp" size={20} color='#6F7482' />
                <Pressable style={{width: '85%'}} onPress={() => setLocationModal(true)}>
                    <Text style={[styles.pleaceHolderTxt, {color: cityLocation?.cityWithState ? 'black' : '#B8BCCA'}]}>{cityLocation?.cityWithState ? cityLocation?.cityWithState : 'Search for an area or city'}</Text>
                </Pressable>
               {
                cityLocation?.cityWithState &&  <Pressable onPress={() => setCityLocation({})}>
                <Entypo name="cross" size={24} style={{marginRight: 15}} color='#6F7482' />
            </Pressable>
               }
            </View>
       </View>
    </View>

{/* ------------Filter and popular search view-------- */}

    <View style={{zIndex: -1}}>
        {
            searchKeyword ?
            <View style={styles.filterView}>
                <View style={styles.filterIconBox1}>
                    <Pressable onPress={() => setFilterSheetShow(true)}>
                        <Text><MaterialIcons name='filter-list-alt' style={{ color: '#6F7482', fontSize: 30}} /></Text>
                    </Pressable>
                   
                   {
                     (sortchecked == 1 || sortchecked == 0 ) || (locationChecked?.length > 0) || (salaryChecked?.length > 0) || (experienceChecked?.length > 0) || (jobTypeChecked?.length > 0) ? <Text style={styles.filterDotView}>
                        <Octicons name='dot-fill' style={{ color: '#EC0000', fontSize: 15}} />
                    </Text> : ''
                   }
                </View>
                <FlatList
                data={filterItemData}
                renderItem={FilterItem}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ref={(ref) => {
                    listViewRef = ref;
                    }}
                    onScroll={() => {
                        if(scrollIndex >= 5){
                            setScrollIndex(1)
                        }
                }}
                />

                <Pressable onPress={() => { setScrollIndex(scrollIndex + 1), NextButton()}}  style={styles.filterIconBox2}>
                    <Text>
                        <Octicons name='chevron-right' style={{ color: '#6F7482', fontSize: 30}} />
                    </Text>
                </Pressable>
            </View> :
            <>
                       {
        allSearchJobs?.length == 0 &&  <View style={{paddingHorizontal: 15, marginVertical: 15}}>
            <Text style={styles.popularTitle}>Popular Searches</Text>
            <View style={styles.popularItemView}>
                {
                    popularData?.map((item) => (
                    <Pressable onPress={() => {
                      setAlertName(item)
                        setSearchKeyword(item)
                        setTimeout(() => handleSearch(), 300)
                    }} style={[styles.popularItem, {marginTop: 7}]} key={item}>
                        <Text style={{color: 'gray',  fontFamily: 'Poppins-Regular',fontSize: 12}}>{item}</Text>
                    </Pressable>
                    ))
                }
            </View>
        </View>
       }
            </>
        }
    </View>

    <Pressable onPress={() => setJobRoleSearchViewShow(false)} style={{ paddingBottom: 240, paddingHorizontal: 20,}}>
     {allSearchJobs?.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{ backgroundColor: 'white' }}
              data={allSearchJobs}
              keyExtractor={item => item?.index}
              ListFooterComponent={() => (
                <View style={{ marginBottom: 50, marginTop: 10 }} >
                  {scrollLoading && (
                    <ActivityIndicator size="large" color={'black'} />)}
                </View>
              )}
              extraData={allSearchJobs}
              renderItem={({ item, index }) =>
                    <JobCard key={index} jobItem={item} />
              } 
              onScroll={hanldeTopScroll}
              scrollEventThrottle={16}
              onEndReached={OnBottomScroll}
              onEndReachedThreshold={0.5}
            />
            : (
              <View>{loading ? <Bullets active listSize={15} /> : ''
              }</View>
            )} 
    </Pressable>

{/* -----------Floating Button---------- */}
{
  allSearchJobs?.length > 0 &&  <Pressable onPress={() => navigation.navigate('CreateAlertScreen', {searchKeyWord: searchKeyword, searchlocation: locationChecked})} style={styles.floatingBtn}>
  <Text ><MaterialIcons name="add-alert" size={24} color='#395987' /></Text>
</Pressable>
}

{
  !isLogged && <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginBtn}>
  <Text style={styles.loginBtnTxt}>Register/Login</Text>
</Pressable>
}

{/* -----------Filter Section---------- */}
    <JobFilterSheet 
    filterSheetShow={filterSheetShow} 
    setFilterSheetShow={setFilterSheetShow} 
    selectedFilter={selectedFilter}
    setSelectedFilter={setSelectedFilter}
    salary1={salary1}
    salary2={salary2}
    setSalaryMax={setSalaryMax}
    setSalaryMin={setSalaryMin}
    exp1={exp1}
    exp2={exp2}
    setExpmin={setExpmin}
    setExpMax={setExpMax}
    //----------Check Handler----------------//
    handleCheckboxLocation={handleCheckboxLocation}
    handleCheckboxJobType={handleCheckboxJobType}

    //----------Checked state-----------//
    locationChecked={locationChecked}
    setLocationChecked={setLocationChecked}
    sortchecked={sortchecked}
    setSortchecked={setSortchecked}
    salaryChecked={salaryChecked}
    setSalaryChecked={setSalaryChecked}
    jobTypeChecked={jobTypeChecked}
    setJobTypeChecked={setJobTypeChecked}
    setExperienceChecked={setExperienceChecked}
    experienceChecked={experienceChecked}

    //---------Filter Main Option Array------//
    locationOptionArray={allFilterOption?.location}
    jobTypeOptionArray={allFilterOption?.jobType}
    salaryOptions={salaryOptions}
    experienceOptions={experienceOptions}

    //----------FilterHandler--------//
    FilterHandler={FilterHandler}
    clearFilterHandler={clearFilterHandler}
  />
   
  {
    locationModal && <SingleItemBottomSheet isAddBtn={false} isSearch={true} setSearchResult={setAllCityLocation} setSelectItem={cityLocationSelectHandler} title={'Location'} modalShow={locationModal} setModalShow={setLocationModal} dropDownData={allCityLocation} onSearch={SearchLocation} isApiSearch={true} addHandler={citylocationFreeText} />
}
</SafeAreaView>
  )
}

const styles = StyleSheet.create({
    homeHeader:{
        height: 150,
        backgroundColor: '#395987',
        paddingVertical: 10,
        paddingHorizontal: 18,
        display: 'flex',
        flexDirection: 'row',

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
        marginTop: 10,
        marginLeft: 10
    },
    pleaceHolderTxt:{
        color: '#B8BCCA',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginLeft: 5
    },
    popularTitle:{
        fontFamily: 'Poppins-SemiBold',
        color: 'black',
        fontSize: 14
    },
    popularItemView:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8
    },
    popularItem:{
        borderWidth: 1,
        borderColor: '#6F7482',
        borderRadius: 50,
        marginRight: 10,
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    filterView:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E4EEF5',
        paddingVertical: 10
    },
    filterIconBox1:{paddingLeft: 15,height: 38, width: 50, borderRightColor: '#6F748230', borderRightWidth: 1,      display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'},
    filterIconBox2:{paddingLeft: 15,height: 38, width: 44, borderLeftColor: '#6F748230', borderLeftWidth: 1,      display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'},
    modalSaveBtn:{
      borderRadius: 13,
      height: 44,
      borderWidth: 1,
      width: 110,
      borderColor: '#395987',
      backgroundColor: '#395987',
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    modalCancelBtn:{
      borderRadius: 13,
      height: 44,
      borderWidth: 1,
      width: 110,
      borderColor: '#C7D3E3',
      backgroundColor: '#C7D3E3',
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,

    },
    modalBtnTxt:{
      fontSize: 14, fontFamily: "Poppins-Medium",
      color: "white",
    },
    moodalBtnView:{
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 25,
      alignItems: "center",

    },
    alertModalView:{
      // alignItems: 'center',
      backgroundColor: 'white',
      // marginVertical: 60,
      width: '90%',
      height: hp('38%'),
      padding: 16,

      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 12,
      elevation: 10,
    },
    filterCountCircle:{height: 20, width: 20, 
      backgroundColor: '#395987', 
      borderRadius: 100,
      display: 'flex', flexDirection: 'row',
      justifyContent: 'center', alignItems: 'center',
      marginRight: 5
    },
    filterCountCircleTxt:{
      color: 'white',
    },
    floatingBtn:{
      display: 'flex', flexDirection: 'row',
      justifyContent: 'center', alignItems: 'center',
      position: 'absolute',
      height: 50,
      width: 50,
      backgroundColor: 'white',
      bottom: 70,
      borderRadius: 100,
      right: 15,
      borderWidth: 2,
      borderColor: '#E4EEF5'
    },
    
    locationDropdownView:{
      height: hp('7%'),
      backgroundColor: '#F8F8F8',
      // flexDirection: "row",
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('0.7%'),
      borderWidth: 1,
      borderColor: '#F8F8F8',
      marginVertical: hp('1%'),
      borderRadius: hp('2%'),
      // justifyContent: 'center',
      // alignItems: 'center',
      // paddingRight: wp('3%')
    },
    locationDropdownInput:{
      height: 40,
      fontSize: 14,
      paddingHorizontal: wp('3%')
      // backgroundColor: 'red'
    },
    locationDropdownSearchInput:{
      borderBottomWidth: 1,
      borderColor: '#E4EEF5',
      
      height: 40,
      width: wp('78%'),
      color: 'black', fontFamily: 'Poppins-Regular', fontSize: 14,
      // paddingTop: 10,
      paddingLeft: 12,
      
      textAlignVertical: 'center',
      color: 'black'
    },
    dropdownText: {
      color: 'black',fontFamily:'Poppins-Regular',fontSize:14,lineHeight:21,
    },
    dropdownItem:{
      paddingHorizontal: 10,
      paddingVertical: 10,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      borderBottomColor: '#E4EEF5',
      borderBottomWidth: 1,
      zIndex: 1,
      backgroundColor: 'white',
      color: 'red',
    },
    filterDotView:{
      position: 'absolute',
      left: 35,
      bottom: 20
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
    jobRoleSearchItemView:{
      width: '88%',
      backgroundColor: 'white',
      height: 200,
      zIndex: 1,
      marginLeft: 15,
      position: 'absolute',
      top: 58
    }
});