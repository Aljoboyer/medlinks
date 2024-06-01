import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LoginHeader from '../components/header/loginheader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { DataContext } from "../Context/GlobalState";
import { gqlOpenQuery, gqlquery } from "../api/doctorFlow";
import { QUERY_LISTPROFILES, QUERY_SEARCHTOPFOURJOBS_TWO, QUERY_SINGLEJOBDETAIL } from "../graphql";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getProfileData } from "../Redux_Mine/Redux_Slices/ProfileSlice";
import { getSavedJobs } from "../Redux_Mine/Redux_Slices/JobSlice";
import { Avatar } from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Bullets } from "react-native-easy-content-loader";
import JobCard from '../components/JobCard/JobCard';
import Share from 'react-native-share';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HTMLView from 'react-native-htmlview';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


export default function SingleJobPage({ route }) {
  const [displayedDescription, setDisplayedDescription] = useState('');
  const [isCollapsedDescription, setIsCollapsedDescription] = useState(false);
  const [jobdescription, setJobDescription] = useState('')
  const [displayedSkills, setDisplayedSkills] = useState([]);
  const [isCollapsedSkills, setIsCollapsedSkills] = useState(false);
  const [jobSkills, setJobSkills] = useState([])
  const navigation = useNavigation()
  const dispatchAction = useDispatch()
  const [singleJobDetail, setSingleJobDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const { vacancyID, hospitalID, hospitalName } = route.params;
  const [isJobAppliedOrSaved, setIsJobAppliedOrSaved] = useState([]);
  const [update, setUpdate] = useState(false);
  const [hospitalDetails, setHospitalDetails] = useState({});
  const [changeRoute, setChangeRoute] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [youtubeId, setYoutubeId] = useState("");
  const [jobUpdate, setJobUpdate] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [isSingleImage, setIsSingleImage] = useState(false);
  const [sliderURL, setSliderURL] = useState([]);
  const [primarySpecialization, setPrimarySpecialization] = useState([]);
  const [secondarySpecialization, setSecondarySpecialization] = useState({})
  const [getJobPostSkill, setGetJobPostSkill] = useState({});
  const isFocused = useIsFocused()
  const [singleJobLoader, setSingleJobLoader] = useState(false)
  const allSavedJobs = useSelector((state) => state.JobSliceStore.allSavedJobs);
  const [hospitalContactDetails, setHospitalContactDetails] = useState({})
  const [similarJobLoading, setSimilarJobLoading] = useState(false)
  const [similarJObs, setSimilarJObs] = useState([]);

  const isLogged = useSelector((state) => state.globalSettingStore.isLogged);

  useEffect(() => {
    dispatchAction(getProfileData())
  }, []);

  useEffect(() => {
    setSingleJobLoader(true)
    getAllInfo();
  }, [vacancyID, update, isFocused]);

  const getAllInfo = async () => {

    let allSingleVacancyInfo = {};

    const QUERY_GETAVACANCY = {
      query: `query MyQuery {
          getAVacancy(vacancyID: ${Number(vacancyID)}) 
             {
              vacancyType
              vacancyID
              userAddedJobRoleID
              systemUser
              skill
              secondarySpecialization
              savedJob
              qualification
              primarySpecialization
              postedOn
              otherJobRole
              numberOfVacancies
              name
              minimumSalary
              maximumSalary
              logo
              location
              jobRoleID
              jobRole
              lastDateToApply
              isSalaryDisclosed
              hospitalName
              hospitalID
              expiredOn
              expMin
              expMax
              employmentType
              description
              department
              announcedDate
              otherJobRole
              includeWalkInInterviewDetails
              course
              gender
              shift
            }
          }`,
      variables: null,
      operationName: "MyMutation",
    };
    await gqlOpenQuery(QUERY_GETAVACANCY, null)
      .then((res) => res.json())
      .then((data) => {
        console.log('Job Found >>', data)
        Object.assign(allSingleVacancyInfo, data?.data?.getAVacancy);

        if (data?.data?.getAVacancy?.includeWalkInInterviewDetails) {
          const QUERY_GETWALKININTERVIEWDETAILS = {
            query: `query MyQuery {
              getWalkInInteviewDetails(vacancyID: ${Number(vacancyID)}) {
                startDate
                endDate
                startTime
                endTime
                contactPersonName
                contactPersonPhone
                address
                googleMapURL
              }
            }
          `,
            variables: null,
            operationName: "MyMutation",
          };
          gqlOpenQuery(QUERY_GETWALKININTERVIEWDETAILS, null)
            .then((res) => res.json())
            .then((data) => Object.assign(allSingleVacancyInfo, data?.data?.getWalkInInteviewDetails));

          const QUERY_GETJOBROLEANDDEPARTMENT = {
            query: `query MyQuery {
                getJobRoleAndDepartment(vacancyID: ${Number(vacancyID)}) {
                  department
                  jobRole
                }
              }
            `,
            variables: null,
            operationName: "MyMutation",
          };
          gqlOpenQuery(QUERY_GETJOBROLEANDDEPARTMENT, null)
            .then((res) => res.json())
            .then((data) => Object.assign(allSingleVacancyInfo, data?.data?.getJobRoleAndDepartment));
        }

      })
      .finally(() => setLoading(false));


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
    await gqlOpenQuery(QUERY_GETPRIMARYSPECIALIZATION, null)
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
    await gqlOpenQuery(QUERY_GETSECONDARYSPECIALIZATION, null)
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

    await gqlOpenQuery(QUERY_GETJOBJPOSTSKILL, null)
      .then((res) => res.json())
      .then((data) => {
        Object.assign(allSingleVacancyInfo, data?.data);
      });

    const QUERY_JOBROLE = {
      query: `query MyQuery {
          getJobRoleAndDepartment(vacancyID: ${vacancyID}) {
            department
            jobRole
          }
        }`,
    };
    await gqlOpenQuery(QUERY_JOBROLE, null)
      .then((res) => res.json())
      .then((datas) => {

        Object.assign(allSingleVacancyInfo, { jobRole: datas?.data?.getJobRoleAndDepartment?.jobRole, department: datas?.data?.getJobRoleAndDepartment?.department });
     
      });

    setSingleJobDetail(allSingleVacancyInfo)
    setDisplayedSkills(allSingleVacancyInfo?.getJobPostSkill?.slice(0,4))
    setJobSkills(allSingleVacancyInfo?.getJobPostSkill)
    setJobDescription(allSingleVacancyInfo?.description)
    setDisplayedDescription(allSingleVacancyInfo?.description?.slice(0, 50))
    setSingleJobLoader(false)
  }

  useEffect(() => {
    dispatchAction(getSavedJobs())
  }, [])

  useEffect(() => {
    fetchJobDetails();
    // --------Specialization---------//
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
        // console.log('primary', data?.data?.getJobPostPrimarySpecialization)
        setPrimarySpecialization(data?.data?.getJobPostPrimarySpecialization)
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
        // console.log('second', data)
        setSecondarySpecialization(data?.data?.getJobPostSecondarySpecialization)
      });
  }, [vacancyID, changeRoute, isFocused]);

  const fetchJobDetails = async () => {

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

    await gqlOpenQuery(QUERY_GETJOBJPOSTSKILL, null)
      .then((res) => res.json())
      .then((data) => {
        console.log("getjobdetails", data?.data?.getJobPostSkill)
        setGetJobPostSkill(data?.data?.getJobPostSkill[0]?.skill)
      });

    // --------Hospital Name query-----------
    const QUERY_HOSPITALNAME = {
      query: `query MyQuery {
              getHospitalByVacancy(vacancyID: ${Number(vacancyID)}) 
                       {
                          name
                      }
                    }
                  `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlOpenQuery(QUERY_HOSPITALNAME, null)
      .then((res) => res.json())
      .then((data) => {
        // console.log('nameees', data)
        // setHospitalName(data?.data?.getHospitalByVacancy)
      });

  };

  useEffect(() => {
    getSaveOrApplyJob();
  }, [vacancyID, changeRoute, jobUpdate]);

  const getSaveOrApplyJob = async () => {

    const QUERY_ISJOBSAVEDORAPPLIED = {
      query: `query MyQuery {
            isJobApplied(vacancyID: ${Number(vacancyID)}) 
                     {
                       appliedAt
                       jaID
                       savedJob
                       appliedJob
                       vacancyID
                    }
                  }
                `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_ISJOBSAVEDORAPPLIED, null)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setIsJobAppliedOrSaved(data?.data?.isJobApplied);
      });
  };

  const handleApplyForJob = async (e) => {
    setLoading(true)

    const QUERY_APPLYFORJOB = {
      query: `mutation MyMutation {
                     applyForAJob (vacancyID: ${Number(vacancyID)})
                     }
                  `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_APPLYFORJOB, null)
      .then((res) => res.json())
      .then((datas) => {
        setJobUpdate(!jobUpdate);
        setLoading(false)
        showMessage({
          message: "Applied job successfully",
          type: "success",
          hideStatusBar: true,
          duration: 2000,
        });
      })
      .finally((e) => console.log("applying for a job"));
  };


  useEffect(() => {
    setSimilarJobLoading(true)

    let allSingleVacancyInfo = {};

    const getAllInfo = async () => {
      const QUERY_GETAVACANCY = {
        query: `query MyQuery {
          getAVacancy(vacancyID: ${Number(vacancyID)}) {
            vacancyType
            vacancyID
            userAddedJobRoleID
            systemUser
            skill
            secondarySpecialization
            savedJob
            qualification
            primarySpecialization
            postedOn
            otherJobRole
            numberOfVacancies
            systemUserHospital
            minimumSalary
            maximumSalary
            logo
            location
            jobRoleID
            jobRole
            isSalaryDisclosed
            hospitalName
            hospitalID
            expiredOn
            expMin
            expMax
            employmentType
            description
            department
            announcedDate
            otherJobRole
            includeWalkInInterviewDetails
            course
            gender
            shift
          }
        }`,
        variables: null,
        operationName: "MyMutation",
      };
      await gqlOpenQuery(QUERY_GETAVACANCY, null)
        .then((res) => res.json())
        .then(async (data) => {
          const vacancyInfo = data?.data?.getAVacancy
         
          Object.assign(allSingleVacancyInfo, vacancyInfo);

          if (vacancyInfo?.includeWalkInInterviewDetails) {
            const QUERY_GETWALKININTERVIEWDETAILS = {
              query: `query MyQuery {
                getWalkInInteviewDetails(vacancyID: ${Number(vacancyID)}) {
                  startDate
                  endDate
                  startTime
                  endTime
                  contactPersonName
                  contactPersonPhone
                  address
                  googleMapURL
                }
              }
            `,
              variables: null,
              operationName: "MyMutation",
            };
            gqlOpenQuery(QUERY_GETWALKININTERVIEWDETAILS, null)
              .then((res) => res.json())
              .then((data) => {
                const walkInInfo = data?.data?.getWalkInInteviewDetails;
                
              });
          }
          
        })
        .finally(() => setLoading(false));

      const QUERY_SEARCHSIMILARJOBS = {
        query: `query MyQuery {
            similarJobs(
              vacancyID: ${Number(vacancyID)},
              expMin: ${allSingleVacancyInfo?.expMin || 0},
              expMax: ${allSingleVacancyInfo?.expMax || 0},
              location: "${allSingleVacancyInfo?.location || ""}",
              maximumSalary: ${allSingleVacancyInfo?.maximumSalary || 9999999},
              minimumSalary: ${allSingleVacancyInfo?.minimumSalary || 1},
              specialization: "${allSingleVacancyInfo?.primarySpecialization || ""}",
              skill: "${allSingleVacancyInfo?.skill || ""}",
              description: "${allSingleVacancyInfo?.description || ""}",
              keyword: "${allSingleVacancyInfo?.jobRole || ""}"
            )
          }`
      };

      setSimilarJobLoading(false)

      await gqlOpenQuery(QUERY_SEARCHSIMILARJOBS, null)
        .then((res) => res.json())
        .then((datas) => {
          const getAllVacancyInfo = async () => {
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
                    const logo = `data:image/png;base64,${downloadDocument?.response?.content}`;
                    Object.assign(searchResult, { logo });
                  };
                });
            };

            let similarJobs = JSON.parse(datas?.data?.similarJobs)?.data;
            const allTopVacancies = similarJobs?.map(async (sR, index) => {
              await logo(sR);
              // await getInfo(sR);
            });
            await Promise.all(allTopVacancies);
            setVacancies(similarJobs);
            setSimilarJObs(similarJobs);
            setSimilarJobLoading(false)
          }
          getAllVacancyInfo();
        });
    }

    getAllInfo();
  }, [vacancyID, changeRoute, update]);

  useEffect(() => {
    getHospitalDetails();
    
  }, [hospitalID, isFocused]);

  const getHospitalDetails = async () => {

    const QUERY_HOSPITALDETAILS = {
      query: `query MyQuery {
          getHospitalDetails(hospitalID: "${hospitalID}") {
            about
            additionalPhone1
            additionalPhone2
            address
            city
            companyType
            contactPerson
            country
            designation
            gstin
            hospitalID
            industryType
            mobile
            pan
            pincode
            reportingManager
            role
            state
            video
            website
            name  
            profilePicURL
        }
              }
            `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlOpenQuery(QUERY_HOSPITALDETAILS, null)
      .then((res) => res.json())
      .then((data) => {

        setHospitalDetails(data?.data?.getHospitalDetails);

        const QUERY_DOWNLOADRESUME = {
          query: `query MyQuery {
                  downloadDocument (url: "${data?.data?.getHospitalDetails?.profilePicURL}")
                }`,
        };
        gqlquery(QUERY_DOWNLOADRESUME, null)
          .then((res) => res.json())
          .then((datas) => {
            // console.log('Hospital img', datas)
            const downloadDocument = JSON.parse(datas?.data?.downloadDocument);

            if (downloadDocument?.response.content) {
              const imageSource = `data:image/png;base64,${downloadDocument?.response?.content}`;
              setBase64Image(imageSource);
              setIsSingleImage(true);
            }
          });
      });
  };

  useEffect(() => {
    if (singleJobDetail?.systemUser === true) {
      const QUERY_HOSPITALNAME = {
        query: `query MyQuery {
          getHospitalContactDetails(vacancyID: "${singleJobDetail?.vacancyID}") {
            aboutHospital
            contactPersonDesignation
            contactPersonEmail
            contactPersonName
            contactPersonPhone
            hospitalName
            logoURL
          }
        }`,
        variables: null,
        operationName: "MyMutation",
      };

      gqlOpenQuery(QUERY_HOSPITALNAME, null)
        // gqlquery(QUERY_HOSPITALNAME, null)
        .then((res) => res.json())
        .then((data) => {
          setHospitalContactDetails(data?.data?.getHospitalContactDetails);
          // const QUERY_DOWNLOADDOCUMENT = {
          //   query: `query MyQuery {
          //       downloadDocument (url: "${data?.data?.getHospitalContactDetails?.logoURL}")
          //     }`,
          // };
          // gqlOpenQuery(QUERY_DOWNLOADDOCUMENT, null)
          //   .then((res) => res.json())
          //   .then((datas) => {
          //     const downloadDocument = JSON.parse(datas?.data?.downloadDocument);
          //     const imageSource = `data:image/png;base64,${downloadDocument?.response?.content}`;
          //     // setBase64ImageForSystem(imageSource);
          //   }).catch((err) => { })
        });
    };
  }, [singleJobDetail?.vacancyID]);


  const handleSavedJob = async (vacancyID) => {

    const QUERY_SAVEAJOB = {
      query: `mutation MyMutation {
          saveAJob (vacancyID: ${Number(vacancyID)})}`,
      variables: null,
      operationName: "MyMutation",
    };
    gqlquery(QUERY_SAVEAJOB, null)
      .then((res) => res.json())
      .then((datas) => {
        dispatchAction(getSavedJobs())
        showMessage({
          message: "Saved Job Successfully",
          type: "success",
          hideStatusBar: true
        });
      })
      .finally((e) => console.log("saved this job"));
  };


  const handleDelete = async (vacancyID) => {
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
          // console.log()
          // setIsSaved(!isSaved);
          // setSavedVacancy(vacancyID);
          dispatchAction(getSavedJobs())
          showMessage({
            message: "Job unsaved",
            type: "danger",
            hideStatusBar: true
          });
        }
      })
      .finally((e) => console.log("Deleting Save Job from database"));
  };

  useEffect(() => {
    hospitalGallery();
  }, [vacancyID, changeRoute]);

  const hospitalGallery = async () => {

    const QUERY_ALLHOSPITALPICTURES = {
      query: `query MyQuery {
          getHospitalPictures(hospitalID: "${hospitalID}") {
            haID
            name
            type
            url
          }
        }`,
      variables: null,
      operationName: "MyMutation",
    };

    gqlOpenQuery(QUERY_ALLHOSPITALPICTURES, null)
      .then((res) => res.json())
      .then((data) => {
        // console.log('all images', data)
        setSliderURL(data?.data?.getHospitalPictures);
      });
  };


  const sharefile = () => {
    // console.log('single job >>>', singleJobDetail?.jobRole?.split('/'))
    // return
    const temprole = singleJobDetail?.jobRole?.split('/').join('%2f');

    if (singleJobDetail?.jobRole.includes('/')) {
      Share.open({ url: `${process.env.REACT_APP_WEBSITE_URL}/job/${temprole}/${singleJobDetail?.vacancyID}/${singleJobDetail?.postedOn.split(" ")}` })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    }
    else {
      Share.open({ url: `${process.env.REACT_APP_WEBSITE_URL}/job/${singleJobDetail?.jobRole.split(' ').join('-')}/${singleJobDetail?.vacancyID}/${singleJobDetail?.postedOn.split(" ")}` })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    }
  }

  const GoogleMapOpenHandler = (mapLink) => {
    Linking.openURL(mapLink);
  }

const DescriptionToggle = (isShow) => {
    if(isShow){
      setDisplayedDescription(jobdescription);
      setIsCollapsedDescription(isShow);
    }
    else{
      setDisplayedDescription(jobdescription?.slice(0, 50));
      setIsCollapsedDescription(isShow);
    }
}
const SkillsToggle = (isShow) => {
  if(isShow){
    setDisplayedSkills(jobSkills);
    setIsCollapsedSkills(isShow);
  }
  else{
    setDisplayedSkills(jobSkills?.slice(0, 4));
    setIsCollapsedSkills(isShow);
  }
}

  const scrollViewRef = useRef(null);
  const [bottomBtnShow, setBottomBtnShow] = useState(false);

  const scrollToPosition = () => {
    // Specify the X and Y coordinates you want to scroll to.
    const x = 0;
    const y = 970; // Adjust this value to the desired scroll position.

    // Scroll to the specified position.
    scrollViewRef.current.scrollTo({ x, y, animated: true });

    setBottomBtnShow(true)
  };

  handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    const specificPortion = 500; // Adjust this value to your desired scroll position
    // console.log('Y----->', y)
    // Check if the user has scrolled to the specific portion
    if (y > specificPortion) {
      setBottomBtnShow(true)
    } else {
      setBottomBtnShow(false)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView onScroll={handleScroll} ref={scrollViewRef} style={{flex: 1,}}>

        <View style={styles.headerView}>

          <LoginHeader backarrow={"chevron-back-outline"} arrow={true} title={""} colorname={'#395987'} lefticon={true} onRightclick={sharefile} />
        </View>

        <View style={{ height: hp('25%'), flexDirection: 'column', borderBottomWidth: 2, borderBottomColor: '#E4EEF5' }}>

          <View style={{ flex: 2, flexDirection: 'row', paddingHorizontal: wp('8%') }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
              <View>

                {base64Image ? (
                  <Image
                    source={{
                      uri: `${base64Image}`,
                    }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#D9D9D9",
                      resizeMode: "cover",
                    }}
                  />) :
                  <Avatar
                    size={32}
                    title={singleJobDetail?.hospitalName?.split(" ")[0]?.charAt(0)?.toUpperCase().concat(singleJobDetail?.singleJobDetail?.hospitalName?.split(" ")?.length > 1 ? singleJobDetail?.hospitalName?.split(" ")[1]?.charAt(0)?.toUpperCase() : "")}
                    containerStyle={{ backgroundColor: "rgb(242, 153, 74)", borderRadius: 4, fontSize: 12, color: "white" }}
                  />}
              </View>
            </View>
            <View style={{ flex: 4, flexDirection: 'column', justifyContent: 'center' }}>

              <Text style={[styles.fourteenBold,{fontFamily: "Poppins-SemiBold", marginHorizontal: 5 }]}>{singleJobDetail?.jobRole}</Text>

              <Text style={[styles.regularTxt, { marginHorizontal: 5}] }>{singleJobDetail?.hospitalName}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp('8%') }}>
            <Ionicons name="location-outline" size={20} color="#6F7482"></Ionicons><Text  style={[styles.regularTxt, { marginHorizontal: 5}] }>{singleJobDetail?.location}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp('8%') }}>

            <MaterialCommunityIcons name="wallet" size={20} color='#6F7482' />
            <Text  style={[styles.regularTxt, { marginHorizontal: 5}] }>{singleJobDetail?.minimumSalary / 100000 === 0 && singleJobDetail?.maximumSalary / 100000 === 0 ? "Not Disclosed" : (
              <>
                ₹{singleJobDetail?.minimumSalary / 100000 > 0 && singleJobDetail?.maximumSalary / 100000 > 0 ?
                  `${singleJobDetail?.minimumSalary / 100000} - ${singleJobDetail?.maximumSalary / 100000} Lakhs`
                  : `${singleJobDetail?.minimumSalary / 100000 > 1 ? `${singleJobDetail?.minimumSalary / 100000} Lakhs` : `${singleJobDetail?.minimumSalary / 100000} Lakh`}`}
              </>)}</Text>
          </View>
          
          {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp('8%') }}>
            <MaterialCommunityIcons name='briefcase-outline' size={20} color='#6F7482' />
            <Text  style={[styles.regularTxt, { marginHorizontal: 5}] }>{`${singleJobDetail?.expMin} Months - ${singleJobDetail?.expMax} Years`}
            </Text>
          </View> */}

          <View style={{ flex: 2, flexDirection: 'row', paddingHorizontal: wp('8%'), paddingTop: 5, justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ height: hp('4%'), width: wp('20%'), backgroundColor: '#6F748230', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.twilveSemi, { marginHorizontal: 5 }]}>{singleJobDetail?.employmentType}</Text>
              </View>
              <View style={{ height: hp('4%'), marginLeft: 7, width: wp('24%'), backgroundColor: '#6F748230', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.twilveSemi, { marginHorizontal: 5 }]}>{singleJobDetail?.numberOfVacancies} opening</Text>
              </View>
            </View>
            <View>{allSavedJobs?.find((j) => j.vacancyID == vacancyID)?.vacancyID ? (
              <TouchableOpacity
                onPress={() =>

                  handleDelete(vacancyID)

                }
              >
                <Ionicons name="bookmark" size={21} color="#395987" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => isLogged ?
                  handleSavedJob(vacancyID) :
                  navigation.navigate('Login')}

              >
                <Ionicons name="bookmark-outline" size={21} color="#395987" />
              </TouchableOpacity>
            )}</View>
          </View>
        </View>

        <View style={{ flex: 1, marginHorizontal: wp('6%'), paddingTop: 30, borderBottomColor: '#E4EEF5', borderBottomWidth: 2, marginBottom: hp('2.8%') }}>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Ionicons name='bag-outline' size={20} color='black'  />
            <Text style={styles.mediumTxt}>Experience</Text>
          </View>

            <Text style={[styles.fourteenGray, {marginTop: 8}]}>{singleJobDetail?.employmentType}</Text>
          </View>

          <View style={{ marginTop: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <SimpleLineIcons name="graduation" size={20} color="black"></SimpleLineIcons><Text style={styles.mediumTxt}>Education</Text>
          </View>
            <Text style={styles.fourteenGray}>{singleJobDetail?.qualification}, {singleJobDetail?.course} </Text>
          </View>

          <View style={{ marginTop: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
                source={require('../assets/iconImg/departmentIcons.png')}
               
              />
            <Text style={[styles.mediumTxt, {marginHorizontal: 5}]}>Department</Text>
          </View>
            <Text style={styles.fourteenGray}>{singleJobDetail?.department}</Text>
          </View>

          <View style={{ marginTop: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Image
                source={require('../assets/iconImg/gendarICons.png')}
               style={{height: 22, width: 22}}
              />
            <Text style={[styles.mediumTxt,{marginHorizontal: 5}]}>Gender</Text>
          </View>
            <Text style={[styles.fourteenGray, {marginTop: 8}]}>{singleJobDetail?.gender}</Text></View>
          <View style={{ marginTop: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Ionicons name="time-outline" size={20} color="black"></Ionicons><Text style={[styles.mediumTxt, {marginHorizontal: 5}]}>Shift</Text>
          </View>
            <Text style={[styles.fourteenGray, {marginHorizontal: 5}]}>{singleJobDetail?.shift}</Text></View>

          <View style={{ marginTop: 12, borderBottomColor: '#E4EEF5', borderBottomWidth: 2, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                source={require('../assets/iconImg/skillIcon.png')}
               style={{height: 22, width: 22}}
              />
            <Text style={{ fontSize: 12, lineHeight: 18, color: '#6F7482', fontFamily: "Poppins-Medium", marginHorizontal: 5 }}>Skills</Text>
          </View>

            <View style={styles.chipBox}>
              {

                displayedSkills?.map((item, i) => (
                  <Pressable key={i} style={styles.chipsSelected}>
                    <Text style={styles.chipsSelectedText}>{item?.skill}</Text>
                  </Pressable>
                ))

              }
              {!isCollapsedSkills && jobSkills?.length > 4 ? <TouchableOpacity onPress={() => SkillsToggle(true)}><Text style={styles.skillShowBtnTxt}>+ Show more</Text>
              </TouchableOpacity> :  <TouchableOpacity onPress={() => SkillsToggle(false)} >
                <Text  style={styles.skillShowBtnTxt}>- Show Less</Text>
                </TouchableOpacity>
                }
            </View></View>

          <View style={{ marginTop: 12, flex: 1, }}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Text style={styles.fourteenBold}>Job Description</Text>
          </View>

            <HTMLView
                value={displayedDescription}
                stylesheet={styles.description_html_style}
              />
            {
              (jobdescription?.length > 25 && !isCollapsedDescription ) ?  <TouchableOpacity onPress={() => DescriptionToggle(true)}>
                <Text style={styles.showBtnText}>+ Show more</Text>
                </TouchableOpacity>  :   
              <>
                {
                  isCollapsedDescription && <TouchableOpacity onPress={() => DescriptionToggle(false)} >
                  <Text style={styles.showBtnText}>- Show Less</Text>
                </TouchableOpacity>
                }
              </>
            }

            </View>
        </View>
{/* ----------------Walk In Address View------------------- */}
        {singleJobDetail?.includeWalkInInterviewDetails &&
          <View style={{ paddingHorizontal: wp('6%'), marginBottom: hp('4%') }}>
            <View style={styles.walkInView} >
              
              <Text style={styles.fourteenBold}>Walk-in Details</Text>

              <View style={{ marginTop: 12 }}>
                <Text style={[styles.mediumTxt, {marginHorizontal: 0}]}>Walk-In Date</Text>
                <Text style={styles.walkAddTxt}>{singleJobDetail?.startDate} to {singleJobDetail?.endDate}</Text>
              </View>
                
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.mediumTxt, {marginHorizontal: 0}]}>Walk-In Time</Text>
                <Text style={styles.walkAddTxt}>{singleJobDetail?.startTime} AM - {singleJobDetail?.endTime} PM</Text>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={[styles.mediumTxt, {marginHorizontal: 0}]}>Contact Person Name</Text>
                <Text style={styles.walkAddTxt}>{singleJobDetail?.contactPersonName}</Text>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={[styles.mediumTxt, {marginHorizontal: 0}]}>Contact Person Phone</Text>
                <Text style={styles.walkAddTxt}>+91-{singleJobDetail?.contactPersonPhone}</Text>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.mediumTxt}>Walk-In Address</Text>
                <Text style={styles.walkAddTxt}>{singleJobDetail?.address}</Text>
              </View>

              {singleJobDetail?.googleMapURL && <View style={{ marginTop: 12 }}>
                <Text style={[styles.mediumTxt, {marginHorizontal: 0}]}>Map Url</Text>
                <Pressable onPress={() => GoogleMapOpenHandler(singleJobDetail?.googleMapURL)}>
                  <Text style={styles.walkAddTxt}>{singleJobDetail?.googleMapURL}</Text>
                </Pressable>
              </View>}

            </View>
          </View>}
{/* ----------------Walk In Address View end------------------- */}

        <View style={{ borderTopColor: '#E4EEF5', borderTopWidth: singleJobDetail?.includeWalkInInterviewDetails ? 2 : 0, marginHorizontal: wp('6%'), paddingVertical: 12 }}>

          <Text style={styles.fourteenBold}>About Company</Text>

          <View style={{ marginTop: 12, flexDirection: 'row', }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
              <Image
                source={require("../assets/rectangle.png")}
                style={{
                  // height: 40,
                  // width: 40,
                  // borderRadius: 10,
                  // borderWidth: 1,
                  // borderColor: "#D9D9D9",
                  // resizeMode: "cover",
                }}
              />
            </View>
            <View style={{ flex: 4, flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={[styles.fourteenBold,{marginHorizontal: 5}]}>{singleJobDetail?.jobRole}</Text>

              <Text style={[styles.regularTxt, { marginHorizontal: 5 }]}>{singleJobDetail?.systemUserHospital || singleJobDetail?.hospitalName}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, lineHeight: 21, color: 'black', fontFamily: "Poppins-Regular", marginTop: 8 }}>
            {singleJobDetail?.systemUser === true ? hospitalContactDetails?.aboutHospital === "" ? hospitalDetails?.about?.replaceAll("<br />", "\n") : hospitalContactDetails?.aboutHospital?.replaceAll("<br />", "\n") : hospitalDetails?.about?.replaceAll("<br />", "\n")}
            </Text>
        </View>

        <View style={styles.similarJobView}>
            {
              bottomBtnShow && <Pressable onPress={() => {
                if( isJobAppliedOrSaved?.appliedJob === true || loading){
                  return
                }
                else if(isLogged){
                  handleApplyForJob()
                }
                else{
                  navigation.navigate('Login')
                }
              }} style={styles.createBtn}>
                {
                  loading ? 
                  <ActivityIndicator name="circle" color="white" />
                : 
                  <Text style={styles.createBtnText}>{isLogged &&  isJobAppliedOrSaved?.appliedJob === true ? 'Applied' : isLogged ? 'Apply Now' : 'Login to Apply'}</Text>
                }
              </Pressable>
            }

          <Text style={styles.fourteenBold}>Similar Jobs</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
            {
              similarJobLoading ? <Bullets active listSize={15} /> :
                <>

                  {
                    similarJObs?.slice(0, 30)?.map((item) => (
                      <JobCard jobItem={item} />
                    ))
                  }
                </>
            }
          </ScrollView>
        </View>
     
      </ScrollView>

        
      {
        !bottomBtnShow && <View style={styles.createBtnView}>
            
        <Pressable onPress={scrollToPosition} style={styles.similarBtn}>
          <Text><MaterialIcons name='all-inbox' size={20} color='#6F7482' /></Text>
        <Text style={styles.similarBtnTxt}>Similar Jobs</Text>
        </Pressable>

        <Pressable onPress={() => {
          if( isJobAppliedOrSaved?.appliedJob === true || loading){
            return
          }
          else if(isLogged){
            handleApplyForJob()
          }
          else{
            navigation.navigate('Login')
          }
        }} style={styles.createBtn}>
          {
            loading ? 
            <ActivityIndicator name="circle" color="white" />
          : 
            <Text style={styles.createBtnText}>{isLogged &&  isJobAppliedOrSaved?.appliedJob === true ? 'Applied' : isLogged ? 'Apply Now' : 'Login to Apply'}</Text>
          }
      </Pressable>
      
  </View> 
      }
   
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  chipsSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: '#395987',
    borderWidth: 1,
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    marginRight: 5,
    backgroundColor: 'white'
  },
  chipsSelectedText: {
    color: '#395987',
    fontFamily: 'Poppins-Regular',
    fontSize: 12
  },
  chipBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  showBtnText:{ fontSize: 12, lineHeight: 18, color: '#395987', fontFamily: "Poppins-Medium", textAlignVertical: 'center', marginTop: 7 },
  description_html_style:{ fontSize: 14, lineHeight: 21, color: 'black', fontFamily: "Poppins-Regular", marginTop: 8 },
  skillShowBtnTxt:{ fontSize: 12, lineHeight: 18, color: '#395987', fontFamily: "Poppins-Medium", 
  textAlignVertical: 'center', marginTop: 7 },
  createBtnView:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: 100,
    borderColor: '#E4EEF5',
    borderWidth: 2
  },
  createBtn:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#395987',
    // marginTop: 20,
    borderRadius: 10,
    width: '45%',
    alignSelf: 'center',
    height: 48,
  },
  createBtnText:{
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: 'white'
  },
  similarBtn:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
    borderRadius: 10,
    width: '45%',
    alignSelf: 'center',
    height: 48,
  },
  similarBtnTxt:{
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#395987'
  },
  fourteenGray:{ fontSize: 14, lineHeight: 21, color: '#474D6A', fontFamily: "Poppins-Medium" },
  fourteenBold:{ fontSize: 14, lineHeight: 21, color: 'black', fontFamily: "Poppins-SemiBold" },
  headerView:{ height: hp('10%'), alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingHorizontal: wp('6%'), },
  regularTxt: { fontSize: 12, lineHeight: 18, color: '#6F7482', fontFamily: "Poppins-Regular", },
  twilveSemi:{ fontSize: 12, lineHeight: 18, color: '#6F7482', fontFamily: "Poppins-SemiBold",},
  mediumTxt:{ fontSize: 12, lineHeight: 18, color: 'black', fontFamily: "Poppins-Medium", marginHorizontal: 5 },
  walkAddTxt:{ fontSize: 12, color: 'black', fontFamily: "Poppins-Medium", marginTop: 2 },
  walkInView:{ backgroundColor: '#E4EEF5', borderRadius: 12, padding: 20 },
  similarJobView:{ borderTopColor: '#E4EEF5', borderTopWidth: 2, marginHorizontal: wp('6%'), paddingVertical: 12, marginBottom: 6 },
  
});