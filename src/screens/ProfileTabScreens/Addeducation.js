import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from "react";
import SingleItemBottomSheet from '../../components/singleItemBottomSheet/singleItemBottomSheet';
import SelectButton from '../../components/selectButton/selectButton';
import MultiSelectButton from '../../components/multiSelectButton/multiSelectButton';
import MultiSelectBottomSheet from '../../components/multiSelectBottomSheet/multiSelectBottomSheet';
import BottomCoupleButton from '../../components/BottomCoupleButton/BottomCoupleButton';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { gqlquery } from '../../api/doctorFlow';
import { QUERY_UNIVERSITYID } from '../../graphql';
import ErrorText from '../../components/ErrorText/ErrorText';
import { getEducationList, setSelectedEducation } from '../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { showMessage } from 'react-native-flash-message'
import { BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProfileTabScreenHeader from '../../components/header/profileTabScreenHeader';

export default function Education() {
    let resText = /^[ A-Za-z,.&]*$/;
    let resTextCourse = /^[a-zA-Z.,\-\)\(`,"]*$/;
    let numRgex = /^\d+$/;
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const dispatchAction = useDispatch();
    const [active, setActive] = useState(false)
    const currentYear = new Date().getFullYear();
    const [saveload, setSaveload] = useState(false);
    // ---------------MODAL STATE----------------//
    const [courseModal, setCourseModal] = useState(false);
    const [specializationModal, setSpecializationModal] = useState(false);
    const [collegeModal, setCollegeModal] = useState(false);
    const [skillModal, setSkillModal] = useState(false);

    //Fetch State 
    const [allQualification, setAllQualification] = useState([]);
    const [allSpecialization, setAllSpecialization] = useState([])
    const [allCourses, setAllCourses] = useState([]);
    const [allUniversity, setAllUniversity] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [allSkillsSuggestion, setAllSkillsSuggestion] = useState([]);

    //Field State 
    const [course, setCourse] = useState('');
    const [specialization, setSpecialization] = useState({});
    const [passingYear, setPassingYear] = useState('');
    const [qualification, setQualification] = useState({});
    const [selectedSkillArr, setSelectedSkillArr] = useState([])
    const [university, setUniversity] = useState({});
    const [suggestionSelectArr, setSuggestionSelectArr] = useState([])
    const [finalSelectedSkill, setFinalSelectedSkill] = useState([])

    //Other field state
    const [universityOther, setUniversityOther] = useState('')
    const [courseOther, setCourseOther] = useState('');
    const [specializationOther, setSpecializationOther] = useState('');
    const [qualificationOther, setQualificationOther] = useState('');

    // ------------Edit State----------//
    const [editQualification, setEditQualification] = useState('');
    const [EditCourse, setEditCourse] = useState('');

    //store state
    const [courseStore, setCourseStore] = useState([]);
    const [specializationStore, setSpecializationStore] = useState([])
    const [versityStore, setVersityStore] = useState([])
    const [skillStore, setSkillStore] = useState([])

    //Redux State 
    const qualificationMaster = useSelector((state) => state.dropDownDataStore.qualificationMaster);
    const courseMaster = useSelector((state) => state.dropDownDataStore.courseMaster);
    const specializationMaster = useSelector((state) => state.dropDownDataStore.specializationMaster);
    const selectedEducation = useSelector((state) => state.profiletabstore.selectedEducation);

    // -------------Errors State----------//
    const [qualificationErr, setQualificationErr] = useState('')
    const [courseErr, setCourseErr] = useState('');
    const [specializationErr, setSpecializationErr] = useState('')
    const [versityErr, setVersityErr] = useState('');
    const [passingYearErr, setPassingYearErr] = useState('');
    const [skillsErr, setSkillsErr] = useState('')
    const [qualificationOtherErr, setQualificationOtherErr] = useState('');
    const [courseOtherErr, setCourseOtherErr] = useState('');
    const [specializationOtherErr, setSpecializationOtherErr] = useState('');
    const [universityOtherErr, setUniversityOtherErr] = useState('');
    
    //Geting Qualification
    useEffect(() => {
        setAllQualification(qualificationMaster)
    }, [isFocused, qualificationMaster, qualificationMaster?.length])

    //Getting Course
    const getCourse = async () => {
        // const newToken = await tokenRefresher();
        // tokenRef.current = newToken;
        // if (qualification !== "" || editQualification !== "") {
        const GET_COURSES = {
            query: `query MyQuery {
              getCourse(industry: "Other", qualification: "${qualification?.qualification ? qualification?.qualification : editQualification}") {
                course
              }
            }
          `,
            variables: null,
            operationName: "MyQuery",
        };
        // tokenRef.current?.access_token
        gqlquery(GET_COURSES, null)
            .then((res) => res.json())
            .then((datas) => {
                setCourseStore(datas?.data?.getCourse)
                setAllCourses(datas?.data?.getCourse)
            }
            );
        // };
    }

    useEffect(() => {
        getCourse()
    }, [qualification])

    // Getting Specialization
    const getSpecializationData = async () => {
        // const newToken = await tokenRefresher();
        // tokenRef.current = newToken;

        const GET_SPECIALIZATION = {
            query: `query MyQuery {
            getSpecialization(course: "${course}", industry: "Other", qualification: "${qualification?.qualification}", specialization: "") {
              course
              emID
              healthcareIndustry
              qualification
              specialization
            }
        }
      `,
            variables: null,
            operationName: "MyQuery",
        };

        gqlquery(GET_SPECIALIZATION, null,)
            .then((res) => res.json())
            .then((datas) => {
                const specialData = datas?.data?.getSpecialization;
                setSpecializationStore(specialData)
                setAllSpecialization(specialData)
            });
    }

    useEffect(() => {
        getSpecializationData()
    }, [course, qualification, editQualification, isFocused])

    //getting university data
    const getUniversityColleges = (text = '') => {

        const val = text?.split(" ")?.length - 1;
        const valtwo = text?.length - val

        if (text && text !== " " && text !== "" && valtwo >= 2) {

            const GET_UNIVERSITY = {
                query: `query MyQuery {
            getUniversityColleges(university: "${text}") {
              name
              umID
            }
          }`,
                variables: null,
                operationName: "MyQuery",
            };

            gqlquery(GET_UNIVERSITY, null)
                .then((res) => res.json())
                .then((datas) => {
                    setAllUniversity([...datas?.data?.getUniversityColleges])
                });
        }
        else {
            gqlquery(QUERY_UNIVERSITYID, null)
                .then((res) => res.json())
                .then((datas) => {
                    setVersityStore(datas?.data?.getUniversityMaster)
                    setAllUniversity(datas?.data?.getUniversityMaster)
                });

        }
    }

    useEffect(() => {
        getUniversityColleges();
    }, [isFocused]);

    //getting skills
    const getAllSkills = (text = '') => {
        const val = text.split(" ").length - 1;
        const valtwo = text.length - val
        if (text && text !== " " && text !== "" && valtwo >= 2) {
            setAllSkills([]);
            const GET_SKILLS = {
                query: `query MyQuery {
                searchSkill(name: "${text}") {
                name
                skillID
              }
            }
          `,
                variables: null,
                operationName: "MyQuery",
            };

            gqlquery(GET_SKILLS, null)
                .then((res) => res.json())
                .then((datas) => {
                    // console.log('skill datas', datas?.data?.searchSkill)
                    setAllSkills(datas?.data?.searchSkill);
                });
        } else {
            const GET_SKILL_MASTER = {
                query: `query MyQuery {
                getSkillMaster  {
                name
                skillID
              }
            }`,
                variables: null,
                operationName: "MyQuery",
            };

            gqlquery(GET_SKILL_MASTER, null)
                .then((res) => res.json())
                .then((datas) => {
                    setSkillStore(datas?.data?.getSkillMaster)
                    setAllSkills(datas?.data?.getSkillMaster)
                });
        }
    };

    const getSuggestionSkill = () => {
        const GET_SKILL_MASTER_SUGGESTION = {
            query: `query MyQuery {
            getFresherSKillSuggestion(course: "${course}", specialization: "${specialization?.specialization}") {
              name
              skillID
            }
          }`,
            variables: null,
            operationName: "MyQuery",
        };

        gqlquery(GET_SKILL_MASTER_SUGGESTION, null)
            .then((res) => res.json())
            .then((datas) => {
                // console.log("tetsing", datas?.data?.getFresherSKillSuggestion)
                setAllSkillsSuggestion(datas?.data?.getFresherSKillSuggestion)
            });
    }

    useEffect(() => {
        getAllSkills()
        getSuggestionSkill()
    }, [qualification?.qualification, course, specialization?.specialization])

    useEffect(() => {
        dispatchAction(getEducationList());
    }, [isFocused])

    //Select Handler
    const CourseSelectHandler = (item) => {
        setCourse(item?.course)
        setCourseOther('')
        setCourseModal(false)
        setCourseErr('')
        setCourseOtherErr('')
    }

    const SpecializationSelectHandler = (item) => {
        setSpecialization(item)
        setSpecializationModal(false)
        setSpecializationErr('')
    }

    const versitySelectHandler = (item) => {
        setUniversity(item)
        setVersityErr('')
        setCollegeModal(false)
        setUniversityOther('')
    }

    const skillSelectHandler = (item, froms) => {
        setSkillsErr('')
        const isSkillExists = selectedSkillArr?.find((item2) => item2?.skillID == item?.skillID);

        if (froms == 'suggest') {
            const filterData = allSkillsSuggestion?.filter((item2) => item2?.skillID !== item?.skillID)
            setAllSkillsSuggestion(filterData)
            setSuggestionSelectArr([...suggestionSelectArr, item])
            if (!isSkillExists?.skillID) {
                setSelectedSkillArr([...selectedSkillArr, item])
            }
        }
        else if (froms == 'search') {
            // const filterData = allSkills?.filter((item2) => item2?.skillID !== item?.skillID)
            // setAllSkills(filterData)
            if (!isSkillExists?.skillID) {
                setSelectedSkillArr([...selectedSkillArr, item])
            }
        }
        else if (froms == 'unselect') {
            console.log('unsssss')
            const findSuggestSkill = suggestionSelectArr?.find((item2) => item2?.skillID == item?.skillID)
            if (findSuggestSkill?.skillID) {
                const findSkill = selectedSkillArr?.find((item2) => item2?.skillID == item?.skillID)
                console.log('unsssss 2')
                if (findSkill?.skillID) {
                    console.log('unsssss 3')
                    const filterData = selectedSkillArr?.filter((item2) => item2?.skillID !== item?.skillID)
                    setSelectedSkillArr([...filterData])
                    setAllSkillsSuggestion([...allSkillsSuggestion, item])
                }
            }
            else {
                const findSkill = selectedSkillArr?.find((item2) => item2?.skillID == item?.skillID)
                if (findSkill?.skillID) {
                    const filterData = selectedSkillArr?.filter((item2) => item2?.skillID !== item?.skillID)
                    setSelectedSkillArr([...filterData])
                }
            }
        }
        else if (selectedSkillArr?.length > 4) {
            // setAllSkills([])
            return
        }
    }

    const unSelectHandler = (item) => {
        const filterData = selectedSkillArr?.filter((item2) => item2?.skillID !== item?.skillID)
        const filterData2 = finalSelectedSkill?.filter((item2) => item2?.skillID !== item?.skillID)
        setSelectedSkillArr([...filterData])
        setFinalSelectedSkill(filterData2)
    }

    //FreeTextHandler 
    const SpecializationFreeTextAdd = (text) => {
        setSpecialization({ specialization: text, emID: 0 })
        setSpecializationErr('')
        setSpecializationModal(false)
        setAllSpecialization(specializationStore)
    }

    const VersityFreeTextAdd = (text) => {
        setUniversity({ name: text, umID: 0 })
        setUniversityOtherErr('')
        setVersityErr('')
        setCollegeModal(false)
        setAllUniversity(versityStore)
    }

    const CourseFreeTextAdd = (text) => {
        setCourse(text)
        setCourseErr('')
        setCourseOtherErr('')
        setCourseModal(false)
        setAllCourses(courseStore)
    }

    const skillFreeTextAdd = (text) => {

        if (text) {
            setAllSkills(skillStore)
            setSelectedSkillArr([...selectedSkillArr, {skillID: text, name: text, freeText: true}])

            // const GET_SKILLS = {
            //     query: `mutation MyMutation {
            //       addSkill(name: "${text}") {
            //         name
            //         skillID
            //       }
            //     }`,
            //     variables: null,
            //     operationName: "MyMutation",
            // };

            // gqlquery(GET_SKILLS, null)
            //     .then((res) => res.json())
            //     .then((datas) => {
             
            //         setAllSkills(skillStore)
            //         setSelectedSkillArr([...selectedSkillArr, datas?.data?.addSkill])
            //     });
        }
        else {
            return
        }
    }

    //For Adding and Updating Education
    const SaveEducationDetails = () => {
        const FinalSkillFilter = finalSelectedSkill?.filter((item) => !item?.freeText)
        const FreeTextArr = finalSelectedSkill?.filter((item) => item?.freeText)
        const SkilIdArr = FinalSkillFilter?.map((skill) => skill?.skillID)
        const FreeTextArrName = FreeTextArr?.map((item) => item?.name)

        const QUERY_POSTEDUCATION = {
            query: `mutation MyMutation {
                addEducation(
                courseType: "", 
                emID: ${specialization?.emID || 0}, 
                universityID: ${Number(university?.umID) || 0},
                yearOfPassing: ${Number(passingYear) || 0},
                otherCourse: "${courseOther ? courseOther : course ? course : ""}", 
                otherQualification: "${qualification?.qualification.toLocaleLowerCase() === "other" ? qualificationOther : qualification?.qualification}", 
                otherSpecialization: "${specializationOther ? specializationOther : specialization?.specialization ? specialization?.specialization : ""}", 
                otherUniversity: "${university?.umID === 0 ? university?.name : universityOther}",
                skillIDs: "${FinalSkillFilter?.length > 0 ? SkilIdArr : ""}",
                otherSkills: "${FreeTextArrName?.join(',')}"
                ) 
      }
      `,
            variables: null,
            operationName: "MyMutation",
        };

        gqlquery(QUERY_POSTEDUCATION, null)
            .then((res) => res.json())
            .then((datas) => {
                console.log('edu data', QUERY_POSTEDUCATION, datas)
                dispatchAction(getEducationList());

                setFinalSelectedSkill([])
                setQualification({})
                setUniversity({})
                setPassingYear('')
                setSpecialization({})
                dispatchAction(setSelectedEducation({}))

                showMessage({
                    message: "Education added Successfully",
                    type: "success",
                });
                navigation.navigate('Profile')
            })
    }

    const SaveUpdateEducationDetails = () => {
        const FinalSkillFilter = finalSelectedSkill?.filter((item) => !item?.freeText)
        const FreeTextArr = finalSelectedSkill?.filter((item) => item?.freeText)
        const SkilIdArr = FinalSkillFilter?.map((skill) => skill?.skillID)
        const FreeTextArrName = FreeTextArr?.map((item) => item?.name)

        const QUERY_POSTEDUCATION = {
            query: `mutation MyMutation {
                updateEducation(
                courseType: "", 
                eduID: ${Number(selectedEducation?.eduID) || 0},
                emID: ${specialization?.emID || 0}, 
                universityID: ${Number(university?.umID) || 0},
                yearOfPassing: ${Number(passingYear) || 0},
                otherCourse: "${courseOther ? courseOther : course ? course : ""}", 
                otherQualification: "${qualification?.qualification.toLocaleLowerCase() === "other" ? qualificationOther : qualification?.qualification}", 
                otherSpecialization: "${specializationOther ? specializationOther : specialization?.specialization ? specialization?.specialization : ""}", 
                otherUniversity: "${university?.umID === 0 ? university?.name : universityOther}",
                skillIDs: "${selectedSkillArr?.length > 0 ? SkilIdArr : ""}",
                otherSkills: "${FreeTextArrName?.join(',')}"
                ) 
      }
      `,
            variables: null,
            operationName: "MyMutation",
        };

        gqlquery(QUERY_POSTEDUCATION, null)
            .then((res) => res.json())
            .then((datas) => {
                console.log('edu data', QUERY_POSTEDUCATION, datas)
                dispatchAction(getEducationList());
                setFinalSelectedSkill([])
                setQualification({})
                setUniversity({})
                setPassingYear('')
                setSpecialization({})
                dispatchAction(setSelectedEducation({}))
                showMessage({
                    message: "Education added Successfully",
                    type: "success",
                });
                navigation.navigate('Profile')
            })
    }

    const educationHandler = () => {
        setSaveload(true)

        if (qualification?.qualification !== '10/12th' && qualification?.qualification !== 'Below 10th') {
            let isValid = true
            if (!qualification?.qualification) {
                setQualificationErr('Please select qualification')
                isValid = false
                console.log('asche qualification')
                setSaveload(false);
            }
            if (!course) {
                setCourseErr('Please select course')
                isValid = false
                console.log('asche course')
                setSaveload(false);
            }
            if (!specialization?.specialization) {
                setSpecializationErr('Please select specialization')
                isValid = false
                console.log('asche specialization')
                setSaveload(false);
            }
            if (!university.name) {
                setVersityErr('Please select university')
                isValid = false
                console.log('asche university')
                setSaveload(false);
            }
            if (!passingYear) {
                setPassingYearErr('Please select passing year')
                isValid = false
                console.log('asche passingYear')
                setSaveload(false);
            }
            if (passingYear?.toString().length != 4) {
                setPassingYearErr('Passing year should be 4-digit')
                isValid = false
                console.log('asche passingYear')
                setSaveload(false);
            }
            if (Number(passingYear) > Number(currentYear)) {
                setPassingYearErr('Future Year is not acceptable')
                isValid = false
                console.log('asche passingYear')
                setSaveload(false);
            }
            if (numRgex.test(passingYear) === false) {
                setPassingYearErr('This field only accept number digit')
                isValid = false
                console.log('asche passingYear', passingYear)
                setSaveload(false);
            }
            if (qualification?.qualification?.toLocaleUpperCase() == "OTHER" && !qualificationOther) {
                setQualificationOtherErr('Text input cannot be empty')
                isValid = false
                console.log('asche qualification')
                setSaveload(false);
            }
            if (course?.toLocaleUpperCase() == "OTHER" && !courseOther) {
                setCourseOtherErr('Text input cannot be empty')
                isValid = false
                console.log('asche course')
                setSaveload(false);
            }
            if (finalSelectedSkill.length == 0) {
                setSkillsErr('Please select Skills')
                isValid = false
                setSaveload(false)
                console.log('asche setOtherInstitutionNameErr')
            }
            if (specialization?.specialization?.toLocaleUpperCase() == "OTHER" && !specializationOther) {
                setSpecializationOtherErr('Text input cannot be empty')
                isValid = false
                console.log('asche course')
                setSaveload(false);
            }
            if (university?.name?.toLocaleUpperCase() == "OTHER" && !universityOther && !resText.test(universityOther)) {
                setUniversityOtherErr('This field accept only Alphabets and some special characters.')
                isValid = false
                console.log('asche course')
                setSaveload(false);
            }
            if (specialization?.specialization?.toLocaleUpperCase() == "OTHER" && specializationOther && !resText.test(specializationOther)) {
                setSpecializationOtherErr('This field accept only Alphabets and some special characters.');
                isValid = false;
                setSaveload(false)
            }
            if (course.toLocaleUpperCase() == "OTHER" && courseOther && !resTextCourse.test(courseOther)) {
                setCourseErr('and some special characters.');
                isValid = false;
                setSaveload(false)
            }
            if (qualification?.qualification?.toLocaleUpperCase() == "OTHER" && qualificationOther && !resText.test(qualificationOther)) {
                setQualificationOtherErr('This field accept only Alphabets.');
                isValid = false;
                setSaveload(false)
            }
            if (isValid) {
                if (selectedEducation?.eduID) {
                    SaveUpdateEducationDetails()
                }
                else {
                    SaveEducationDetails()
                }

            }

        }
        else {
            if (!qualification?.qualification) {
                setQualificationErr('Please select qualification')
                isValid = false
                setSaveload(false);
            } else {
                if (selectedEducation?.eduID) {
                    SaveUpdateEducationDetails()
                }
                else {
                    SaveEducationDetails()
                }
            }

        }
    }

    const backHandler = () => {
        dispatchAction(setSelectedEducation({}))
        navigation.navigate('Profile')
    } 

    //For Editing Purpose
    useEffect(() => {

        if (selectedEducation?.qualification) {
            const existData = qualificationMaster?.find((item) => item?.qualification == selectedEducation?.qualification)
            console.log("exis qual", existData)
            if (existData?.qualification) {
                setQualification({ qualification: selectedEducation?.qualification })
            }
            else {
                setQualificationOther(selectedEducation?.qualification)
                setQualification({ qualification: 'Other' })
            }
        }

        if (selectedEducation?.course) {
            const existData = courseMaster?.find((item) => item?.course == selectedEducation?.course)
            console.log("exis", existData)
            if (existData?.course) {
                setCourse(selectedEducation?.course)
            }
            else {
                setCourseOther(selectedEducation?.course)
                setCourse("Other")
            }
        }

        if (selectedEducation?.emID) {
            const existData = specializationMaster?.find((item) => item?.specialization == selectedEducation?.specialization)

            if (existData?.specialization) {
                setSpecialization({ emID: selectedEducation?.emID, specialization: selectedEducation?.specialization })
            }
            else {
                setSpecialization({ emID: 0, specialization: selectedEducation?.specialization })
            }

        }
        if (selectedEducation?.university) {
            if (selectedEducation?.isOtherUniversity == false) {
                setUniversity({ name: selectedEducation?.university, umID: selectedEducation?.universityID })
            } else {
                setUniversity({ name: selectedEducation?.university, umID: 0 })
            }
        }
        if (selectedEducation?.yearOfPassing !== 0) {
            setPassingYear(selectedEducation?.yearOfPassing)
        }
        if (selectedEducation?.eduID) {
            getEditSkills()
        }
    }, [selectedEducation?.yearOfPassing]);

    const getEditSkills = async () => {

        const GET_SKILLS_BY_EDU_ID = {
            query: `query MyQuery {
                  getFresherSkillsByEduID(eduID: ${Number(selectedEducation?.eduID)}) {
                    name
                    skillID
                  }
                }`,
            variables: null,
            operationName: "MyQuery",
        };

        gqlquery(GET_SKILLS_BY_EDU_ID, null)
            .then((res) => res.json())
            .then((data) => {
                setSelectedSkillArr(data?.data?.getFresherSkillsByEduID)
                setFinalSelectedSkill(data?.data?.getFresherSkillsByEduID)
            });
    }

    const HandleDeleteEducation = async (e) => {

        const QUERY_DELETEEDUCATION = {
            query: `mutation MyMutation {
              deleteEducation(eduID: "${selectedEducation?.eduID}")
            }`,
            variables: null,
            operationName: "MyMutation",
        };
        gqlquery(QUERY_DELETEEDUCATION, null)
            .then((res) => res.json())
            .then((datas) => {
  
                if (datas?.data?.deleteEducation) {
                    dispatchAction(getEducationList());
                  
                    showMessage({
                        message: "Education deleted Successfully",
                        type: "success",
                    });

                navigation.goBack()
                } else {

                }
            })
            .finally((e) =>
                console.log("Deleting educational details in database")
            );

    }

    return (
    <View style={{ flex: 1 , backgroundColor: 'white'}}>
    {/* ----------------Header------------------ */}
        <ProfileTabScreenHeader deleteConfirmHandler={HandleDeleteEducation} title={!selectedEducation?.eduID ? 'Add Education' : 'Update Education'} deleteBtn={selectedEducation?.eduID ? true : false} />

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 , backgroundColor: 'white'}}>
            {/* ------------------Height Qualification-------------- */}
            <View>
                <Text style={styles.labelText}>Highest Qualification</Text>
                <View style={styles.qualificationChipView}>
                    {
                        allQualification?.map((item, i) => (
                            <Pressable onPress={() => {
                                setQualification(item)
                                setCourse('')
                                setSpecialization('')
                                setCourseOther('')
                                setQualificationOther('')
                                setSpecializationOther('')
                                setEditCourse('')
                                setEditQualification('')
                                setQualificationErr('')
                                if (item?.qualification == '10th' && item?.qualification == '12th' && item?.qualification == 'Below 10th') {
                                    setSelectedSkillArr([])
                                    setPassingYear('')
                                    setUniversity({})
                                }
                            }} key={i} style={[qualification?.qualification == item?.qualification ? styles.chipsSelected : styles.chipsNotSelected]}>
                                <Text style={[qualification?.qualification == item?.qualification ? styles.chipsSelectedText : styles.chipsNotSelectedText]}>{item?.qualification}</Text>
                            </Pressable>
                        ))
                    }
                </View>
                {qualificationErr && <ErrorText error={qualificationErr} />}
                {
                    qualification?.qualification == 'Other' &&
                    <View style={styles.inputView}>
                        <TextInput onChangeText={(text) => {
                            setQualificationOther(text.trimStart())
                            setQualificationOtherErr('')
                        }}
                            onFocus={() => setActive(true)} onBlur={() => setActive(false)}
                            value={qualificationOther.replace(/  +/g, " ")}
                            style={{
                                color: 'black',
                                borderColor: active ? '#395987' : '#B8BCCA50',
                                borderWidth: 1,
                                borderRadius: 10,
                                height: 45,
                                paddingLeft: 15,
                                marginTop: 10
                            }} placeholder='Write Qualification' placeholderTextColor='gray' />
                    </View>
                }
                {qualificationOtherErr && <ErrorText error={qualificationOtherErr} />}
            </View>

            {
                qualification?.qualification !== '10/12th' && qualification?.qualification !== 'Below 10th' && qualification?.qualification ? <View>
                    {/* ---------------Course-------------- */}
                    <View>
                        <SelectButton selected={course} title='Course' placeHolder="Select Course" onPressHandler={() => {
                            setCourseModal(true)
                        }} />
                        {courseErr && <ErrorText error={courseErr} />}
                        {
                            (EditCourse?.toUpperCase() == 'OTHER' || course.toUpperCase() == 'OTHER') &&
                            <View style={styles.inputView}>
                                <TextInput onChangeText={(text) => {
                                    setCourseOther(text.trimStart())
                                    setCourseOtherErr('')
                                    setCourseErr('')
                                }}
                                    onFocus={() => setActive(true)} onBlur={() => setActive(false)}
                                    value={courseOther.replace(/  +/g, " ")}
                                    style={{
                                        color: 'black',
                                        borderColor: active ? '#395987' : '#B8BCCA50',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        height: 45,
                                        paddingLeft: 15,
                                        marginTop: 10
                                    }} placeholder='Write course name' placeholderTextColor='gray' />
                            </View>
                        }
                        {courseOtherErr && <ErrorText error={courseOtherErr} />}
                    </View>

                    {/* ---------------Specialization-------------- */}
                    <SelectButton selected={specialization?.specialization} title='Specialization' placeHolder="Select Specialization" onPressHandler={() => {
                        if (course && qualification?.qualification) {
                            setSpecializationModal(true)
                        }
                    }} />
                    {specializationErr && <ErrorText error={specializationErr} />}
                    {/* ---------------College Name-------------- */}
                    <SelectButton selected={university?.name} title='College Name' placeHolder="Select college/university" onPressHandler={() => setCollegeModal(true)} />
                    {versityErr && <ErrorText error={versityErr} />}
                    {
                        university?.name == 'Other' && <View style={styles.inputView}>
                            <TextInput onChangeText={(text) => {
                                setUniversityOther(text.trimStart())
                                setUniversityOtherErr('')
                                setVersityErr('')
                            }}
                                onFocus={() => setActive(true)} onBlur={() => setActive(false)}
                                value={universityOther.replace(/  +/g, " ")}
                                style={{
                                    color: 'black',
                                    borderColor: active ? '#395987' : '#B8BCCA50',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    height: 45,
                                    paddingLeft: 15,
                                    marginTop: 10
                                }} placeholder='Write college/university' placeholderTextColor='gray' />
                        </View>
                    }
                    {universityOtherErr && <ErrorText error={universityOtherErr} />}

                    {/* ---------------Passing Year-------------- */}
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>Passing Year</Text>
                        <TextInput value={passingYear?.replace(/  +/g, " ")} onFocus={() => setActive(true)} onBlur={() => setActive(false)} onChangeText={(text) => {
                            if (Number(text) <= Number(currentYear)) {
                                setPassingYear(text.trimStart())
                                setPassingYearErr('')
                            }
                            else {
                                setPassingYear(text.trimStart())
                                setPassingYearErr('Future Year is not acceptable')
                            }
                        }} maxLength={4} keyboardType='number-pad' style={{
                            color: 'black',
                            borderColor: active ? '#395987' : '#B8BCCA50',
                            borderWidth: 1,
                            borderRadius: 10,
                            height: 45,
                            paddingLeft: 15,
                            marginTop: 10
                        }} placeholder='YYYY' placeholderTextColor='gray' />
                        <Text style={styles.suggestionText}>For e.g. 2021 </Text>
                        {passingYearErr && <ErrorText error={passingYearErr} />}
                    </View>

                    <MultiSelectButton setSelectItem={unSelectHandler} selectedArr={finalSelectedSkill} title='Skills' placeHolder="Enter Skill" onPressHandler={() => setSkillModal(true)} />
                    {skillsErr && <ErrorText error={skillsErr} />}
                </View> : ''
            }
        </ScrollView>

        {
            qualification && <BottomCoupleButton title2="Save" title1="Cancel" isLoad={saveload} backHandler={backHandler} nextHandler={educationHandler} />
        }

        {
            courseModal && <SingleItemBottomSheet storeData={courseStore} addHandler={CourseFreeTextAdd} setSearchResult={setAllCourses} setSelectItem={CourseSelectHandler} dropDownData={allCourses} title={'Course'} modalShow={courseModal} setModalShow={setCourseModal} />
        }
        {
            specializationModal && <SingleItemBottomSheet storeData={specializationStore} addHandler={SpecializationFreeTextAdd} setSearchResult={setAllSpecialization} setSelectItem={SpecializationSelectHandler} dropDownData={allSpecialization} title={'Specialization'} modalShow={specializationModal} setModalShow={setSpecializationModal} />
        }
        {
            collegeModal && <SingleItemBottomSheet addHandler={VersityFreeTextAdd} isApiSearch={true} dropDownData={allUniversity} setSelectItem={versitySelectHandler} title={'University'} modalShow={collegeModal} setModalShow={setCollegeModal} onSearch={getUniversityColleges} />
        }

        {
            skillModal && <MultiSelectBottomSheet fieldName="skill" addHandler={skillFreeTextAdd} dropDownData={allSkillsSuggestion?.length > 0 ? [] : allSkills} onSubmit={setFinalSelectedSkill} onSearch={getAllSkills} selectedData={selectedSkillArr} setSelectItem={skillSelectHandler} suggestionData={allSkillsSuggestion} title={'Skills'} modalShow={skillModal} setModalShow={setSkillModal} searchData={allSkills} />
        }
    </View>
    )
}

const styles = StyleSheet.create({
    inputView: {
        marginTop: 20
    },
    chipsNotSelected: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        marginLeft: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginRight: 5
    },
    chipsSelected: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        marginLeft: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginRight: 5,
        backgroundColor: '#395987'
    },
    qualificationChipView: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chipsNotSelectedText: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    chipsSelectedText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    labelText: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    passingYearInput: {
        color: 'black',
        borderColor:'#B8BCCA50',
        borderWidth: 1,
        borderRadius: 10,
        height: 45,
        paddingLeft: 15,
        marginTop: 10
    },
    suggestionText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: '#6F7482',
        marginTop: 10,
        marginLeft: 5
    },

});