import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SelectButton from '../../components/selectButton/selectButton';
import MultiSelectButton from '../../components/multiSelectButton/multiSelectButton';
import BottomCoupleButton from '../../components/BottomCoupleButton/BottomCoupleButton';
import MultiSelectBottomSheet from '../../components/multiSelectBottomSheet/multiSelectBottomSheet';
import SingleItemBottomSheet from '../../components/singleItemBottomSheet/singleItemBottomSheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native';
import { totalExperienceData } from '../../utils/StaticDropdownData';
import ErrorText from '../../components/ErrorText/ErrorText';
import { useDispatch, useSelector } from 'react-redux';
import { gqlquery } from '../../api/doctorFlow';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getExperienceList, setSelectedExperience } from '../../Redux_Mine/Redux_Slices/CompleteProfileTabSlice';
import { setMonthlyData, setTotalData, setTotalExpData } from '../../Redux_Mine/Redux_Slices/ProfileSlice';
import { showMessage } from 'react-native-flash-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BackHandler } from 'react-native';
import ProfileTabScreenHeader from '../../components/header/profileTabScreenHeader';

const IsExperienceData = ['Yes', 'No']

export default function Addexperience() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [loading, setLoading] = useState(false);
  const dispatchAction = useDispatch();
  const currentYear = new Date().getFullYear();
  let resText = /^[A-Za-z\s]+$/;
  let numRgex = /^\d+$/;

  //Store State
  const [active, setActive] = useState(false)
  const [allDepartmentStore, setAllDepartmentStore] = useState([]);
  const [perAnnumText, setPerAnnumText] = useState('')
  const [skillStore, setSkillStore] = useState([]);

  //Fetch State
  const [jobRoleData, setJobRoleData] = useState([]);
  const [allInstitutionName, setAllInstitutionName] = useState([]);
  const [allNoticePeriod, setAllNoticePeriod] = useState([]);
  const [allDepartment, setAllDepartments] = useState([])
  const [allSkills, setAllSkills] = useState([]);
  const [allSkillsSuggestion, setAllSkillsSuggestion] = useState([]);

  //Field State
  const [isExperience, setIsExperience] = useState('');
  const [isNoticePeriod, setIsNoticePeriod] = useState('');
  const [totalExp, setTotalExp] = useState({})
  const [jobRole, setJobRole] = useState({})
  const totalExperienceDatas = totalExperienceData;
  const [institutionName, setInstitutionName] = useState('');
  const [noticePeriod, setNoticePeriod] = useState({});
  const [industry, setIndustry] = useState({});
  const [industryOther, setIndustryOther] = useState('');
  const [department, setDepartment] = useState({});
  const [departmentOther, setDepartmentOther] = useState('');
  const [selectedSkillArr, setSelectedSkillArr] = useState([])
  const [suggestionSelectArr, setSuggestionSelectArr] = useState([])
  const [finalSelectedSkill, setFinalSelectedSkill] = useState([])
  const [monthlySalary, setMonthlySalary] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [joiningMonth, setJoiningMonth] = useState('')
  const [joiningYear, setJoiningYear] = useState('')
  const [relievingDate, setRelievingDate] = useState('')
  const [relievingMonth, seRelievingMonth] = useState('')
  const [relievingYear, setRelievingYear] = useState('')

  //Error State
  const [totalExpErr, setTotalExpErr] = useState(false)
  const [jobeRoleErr, setJobRoleErr] = useState('')
  const [institutionNameErr, setInstitutionNameErr] = useState('');
  const [noticePeriodErr, setNoticePeriodErr] = useState('');
  const [industryErr, setIndustryErr] = useState('');
  const [industryOtherErr, setIndustryOtherErr] = useState('');
  const [departmentErr, setDepartmentErr] = useState('');
  const [departmentOtherErr, setDepartmentOtherErr] = useState('');
  const [skillsErr, setSkillsErr] = useState('')
  const [monthlySalaryErr, setMonthlySalaryErr] = useState('');
  const [joiningDateErr, setJoiningDateErr] = useState('')
  const [relievingDateErr, setRelievingDateErr] = useState('')

  //Modal
  const [IndustryModal, setIndustryModal] = useState(false);
  const [departmentModal, setDepartmentModal] = useState(false);
  const [totalExpModal, setTotalExpModal] = useState(false)
  const [jobRoleModal, setJobRoleModal] = useState(false)
  const [skillModal, setSkillModal] = useState(false);
  const [currentHospitalModal, setCurrentHospitalModal] = useState(false)
  const [currentlyWorking, setCurrentlyWorking] = useState(false);


  //Redux State
  const jobRoleMaster = useSelector((state) => state.dropDownDataStore.jobRoleData);
  const hospitalCompanyData = useSelector((state) => state.dropDownDataStore.hospitalCompanyData);
  const allNoticePeriodData = useSelector((state) => state.dropDownDataStore.allNoticePeriod);
  const allIndustry = useSelector((state) => state.dropDownDataStore.desiredIndustry);
  const monthlySalaryData = useSelector((state) => state.profilestore.monthlySalaryData);
  const totalExpData = useSelector((state) => state.profilestore.totalExpData);
  const selectedExperience = useSelector((state) => state.profiletabstore.selectedExperience);
  const profile = useSelector((state) => state.profilestore.profileData);

  //Getting ob Role
  useEffect(() => {
    setJobRoleData(jobRoleMaster)
    setAllInstitutionName(hospitalCompanyData)
  }, [jobRoleMaster?.length, jobRoleMaster, hospitalCompanyData?.length])

  useEffect(() => {
    setAllNoticePeriod(allNoticePeriodData)
  }, [allNoticePeriodData?.length])

  const searchSkillOrJobRole = (text) => {
    const val = text?.split(" ")?.length - 1;
    const valtwo = text?.length - val;

    const seacrhtext = text.trim();
    if (text && text !== " " && text !== "" && valtwo >= 2) {
      setJobRoleData([]);
      const GET_SEARCH_SKILL = {
        query: `query MyQuery {
                getHCISpecialty(specialty: "${text}") {
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

      gqlquery(GET_SEARCH_SKILL, null)
        .then((res) => res.json())
        .then((datas) => {
          setJobRoleData(datas?.data?.getHCISpecialty);
        });
    } else {
      setJobRoleData(jobRoleMaster)
    }
  };

  //Hospital/Company search
  const SearchInstitutionName = (text) => {

    const val = text.split(" ").length - 1;
    const valtwo = text.length - val
    const seacrhtext = text.trim();

    if (text && text !== " " && text !== "" && valtwo >= 2) {

      const GET_INSTITUTE = {
        query: `query MyQuery {
                getHealthInstitutes(institute: "${seacrhtext}") {
                  himID
                  name
                }
              }
            `,
        variables: null,
        operationName: "MyQuery",
      };

      gqlquery(GET_INSTITUTE, null)
        .then((res) => res.json())
        .then((datas) => {
          console.log(datas)
          setAllInstitutionName([...datas?.data?.getHealthInstitutes])
        });
    }
    else {
      setAllInstitutionName(hospitalCompanyData)
    }

  }

  //Department Getting
  useEffect(() => {
    const QUERY_DEPARTMENTS = {
      query: `query MyQuery {
               getDepartments {
                   departmentID
                   name
               }
           }`
    };
    gqlquery(QUERY_DEPARTMENTS, null)
      .then((res) => res.json())
      .then((datas) => {
        // console.log("department", datas?.data?.getDepartments)
        setAllDepartments([...datas?.data?.getDepartments, { departmentID: 0, name: "Other" }])
        setAllDepartmentStore([...datas?.data?.getDepartments, { departmentID: 0, name: "Other" }])
      });
  }, [isFocused, ])

  const searchDepartments = (text) => {
    const val = text?.split(" ")?.length - 1;
    const valtwo = text?.length - val;

    if (text && text !== " " && text !== "" && valtwo >= 2) {
      setAllDepartments([]);
      const QUERY_SEARCH_DEPARTMENTS = {
        query: `query MyQuery {
            searchDepartment(name: "${text}") {
              departmentID
              name
            }
          }`
      }

      gqlquery(QUERY_SEARCH_DEPARTMENTS, null)
        .then((res) => res.json())
        .then((datas) => {
          setAllDepartments(datas?.data?.searchDepartment)
        });
    } else {

      setAllDepartments(allDepartmentStore)
    }
  }

  //Getting Skills
  const searchSkills = (text = '') => {
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
          setAllSkills(datas?.data?.searchSkill);
        });
    } else {
      const GET_SKILL_MASTER = {
        query: `query MyQuery {
                getSkillMaster {
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

  useEffect(() => {
    if (jobRole?.specialty) {
      const GET_SKILL_MASTER_SUGGESTION = {
        query: `query MyQuery {
                  getExpSkillSuggestion(role: "${jobRole?.specialty}") {
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
          setAllSkillsSuggestion(datas?.data?.getExpSkillSuggestion)
        });
    }
  }, [jobRole?.specialty]);

  const unSelectHandler = (item) => {
    const filterData = selectedSkillArr?.filter((item2) => item2?.skillID !== item?.skillID)
    const filterData2 = finalSelectedSkill?.filter((item2) => item2?.skillID !== item?.skillID)
    setSelectedSkillArr([...filterData])
    setFinalSelectedSkill(filterData2)
  }

  const JoiningDateBlurHandler = () => {
    if (joiningDate) {
      const joiningDateSpliting = joiningDate?.split('/')
      const joiningMonthData = joiningDateSpliting[0]
      const JoiningYearData = joiningDateSpliting[1]
      setJoiningMonth(joiningMonthData)
      setJoiningYear(JoiningYearData)
      // console.log('JoiningYearData', JoiningYearData)
    }
    setActive(false);
  }

  const RelievingDateBlurHandler = () => {
    if (relievingDate) {
      const relievingDateSpliting = relievingDate?.split('/')
      const relievingMonthData = relievingDateSpliting[0]
      const relievingYearData = relievingDateSpliting[1]
      seRelievingMonth(relievingMonthData)
      setRelievingYear(relievingYearData)
   
    }
    setActive(false);
  }

  //Select Item Handler
  const jobRoleSelect = (item) => {
    setJobRole(item)
    setJobRoleErr('')
    setJobRoleModal(false)
  }

  const hospitalCompanySelect = (item) => {
    setInstitutionName(item)
    setInstitutionNameErr('')
    setCurrentHospitalModal(false)
  }

  const noticePeriodSelect = (item) => {
    if (noticePeriod?.npID == item?.npID) {
      setNoticePeriod('')
      setIsNoticePeriod('')
      setNoticePeriodErr('')

    } else {
      setNoticePeriod(item)
      setAllNoticePeriod([item])
      setNoticePeriodErr('')
    }
  }

  const industrySelect = (item) => {
    setIndustry(item)
    setIndustryErr('')
    setIndustryModal(false)
  }

  const departmentSelect = (item) => {
    setDepartment(item)
    setDepartmentErr('')
    setDepartmentOtherErr('')
    setDepartmentModal(false)
  }

  const skillSelectHandler = (item, froms) => {
    const isSkillExists = selectedSkillArr?.find((item2) => item2?.skillID == item?.skillID)
    setSkillsErr('')
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

  //Free Text Handler 
  const jobRoleFreeTextAdd = (text) => {
    setJobRole({ specialty: text, hciID: 0 })
    setJobRoleErr('')
    setJobRoleModal(false)
    setJobRoleData(jobRoleMaster)
  }

  const InistitutionFreeTextAdd = (text) => {
    setInstitutionName({ name: text, hciID: 0 })
    setInstitutionNameErr('')
    setCurrentHospitalModal(false)
    setAllInstitutionName(hospitalCompanyData)
  }

  const departmentFreeTextAdd = (text) => {
    setDepartment({ name: text, departmentID: 0 })
    setDepartmentErr('')
    setDepartmentOtherErr('')
    setDepartmentModal(false)
    setAllDepartments([...allDepartmentStore, { departmentID: 0, name: "Other" }])
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

  //For adding and updating Experience
  const savingExperienceData = () => {
    const FinalSkillFilter = finalSelectedSkill?.filter((item) => !item?.freeText)
    const FreeTextArr = finalSelectedSkill?.filter((item) => item?.freeText)
    const SkilIdArr = FinalSkillFilter?.map((skill) => skill?.skillID)
    const FreeTextArrName = FreeTextArr?.map((item) => item?.name)

    const QUERY_UPDATE_EXPSALARY = {
      query: `mutation MyMutation {
              updateExpSalary(
                exp: ${totalExp?.label !== '6 Months' ? Number(totalExp?.value) : 0}, 
                expMonths: ${totalExp?.label == '6 Months' ? Number(totalExp?.value) : 0},
                salary: ${Number(monthlySalary)},
                workStatus: "${isExperience == 'Yes' ? 'Experienced' : 'Fresher'}"
              )
            }
            `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_UPDATE_EXPSALARY, null)
      .then((res) => res.json())
      .then((data) => {
        console.log('QUERY_UPDATE_EXPSALARY ===>', QUERY_UPDATE_EXPSALARY)
      })

    const QUERY_POSTEXPERIENCE = {
      query: `mutation MyMutation {
                  addExperience(
                    departmentID:${department?.departmentID},
                    otherDepartment:"${department?.name === 'Other' ? departmentOther : ""}",
                  skillIDs: "${finalSelectedSkill?.length > 0 ? SkilIdArr : ""}",
                    healthInstituteID: ${Number(institutionName?.himID)},
                    healthInstituteTypeID: ${Number(industry?.hciID)},
                    otherInstituteType : "${industry?.industry == 'Other' ? industryOther : ""}"
                    description: "",
                    designationID: ${Number(jobRole?.hciID)},
                    jobType: "",
                    startingMonth: ${Number(joiningMonth)},
                    startingYear: ${Number(joiningYear)},
                    workingMonth: ${Number(relievingMonth)},
                    workingYear: ${Number(relievingYear)},
                    currentlyWorking: ${currentlyWorking ? Boolean(Number(1)) : Boolean(Number(0))},
                    noticePeriodID: ${Number(noticePeriod?.npID) ? Number(noticePeriod?.npID) : 0},
                    employmentType: "",
                    otherHealthInstitutionName: "${institutionName?.himID === 0 ? institutionName?.name : ""}", 
                    otherDesignationName: "${jobRole?.hciID === 0 ? jobRole?.specialty : ""}",
                    lastWorkingDay:"${""}",
                    otherSkills: "${FreeTextArrName?.join(',')}"
                    )
                }`,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_POSTEXPERIENCE, null,)
      .then((res) => res.json())
      .then((datas) => {
        console.log('add exp data', datas)
        console.log('QUERY_POSTEXPERIENCE', QUERY_POSTEXPERIENCE)

        setLoading(false)
        dispatchAction(getExperienceList())
        dispatchAction(setMonthlyData(monthlySalary))
        dispatchAction(setTotalData(totalExp))
        setDepartment({})
        setFinalSelectedSkill([])
        setJobRole({})
        setCurrentlyWorking(false)
        setNoticePeriod({})
        setJoiningYear('')
        setJoiningMonth('')
        setIndustry({})
        setInstitutionName({})

        showMessage({
          message: "Experience added Successfully",
          type: "success",
        });
        navigation.goBack()
      })
  }

  const updateingExperienceData = () => {
    const FinalSkillFilter = finalSelectedSkill?.filter((item) => !item?.freeText)
    const FreeTextArr = finalSelectedSkill?.filter((item) => item?.freeText)
    const SkilIdArr = FinalSkillFilter?.map((skill) => skill?.skillID)
    const FreeTextArrName = FreeTextArr?.map((item) => item?.name)

    const QUERY_UPDATE_EXPSALARY = {
      query: `mutation MyMutation {
              updateExpSalary(
                exp: ${totalExp?.label !== '6 Months' ? Number(totalExp?.value) : 0}, 
                expMonths: ${totalExp?.label == '6 Months' ? Number(totalExp?.value) : 0},
                salary: ${Number(monthlySalary)},
                workStatus: "${isExperience == 'Yes' ? 'Experienced' : 'Fresher'}"
              )
            }
            `,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_UPDATE_EXPSALARY, null)
      .then((res) => res.json())
      .then((data) =>        console.log('QUERY_UPDATE_EXPSALARY ===>', QUERY_UPDATE_EXPSALARY)
      )

    const QUERY_UPDATE_EXPERIENCE = {
      query: `mutation MyMutation {
          updateExperience(
            expID: "${selectedExperience.expID}",
                departmentID:${department?.departmentID},
              otherDepartment:"${department.name === 'Other' ? departmentOther : ""}",
              skillIDs: "${finalSelectedSkill?.length > 0 ? SkilIdArr : ""}",
                healthInstituteID: ${Number(institutionName?.himID)},
                healthInstituteTypeID: ${industry?.hciID ? Number(industry?.hciID) : 0},
                otherInstituteType : "${industry?.industry == 'Other' ? industryOther : ""}"
                description: "",
                designationID: ${Number(jobRole?.hciID)},
                jobType: "",
                startingMonth: ${Number(joiningMonth) ? Number(joiningMonth) : selectedExperience?.startingMonth ? selectedExperience?.startingMonth : 0},
                startingYear: ${Number(joiningYear) ? Number(joiningYear) : selectedExperience?.startingYear ? selectedExperience?.startingYear : 0},
                workingMonth: ${Number(relievingMonth)},
                workingYear: ${Number(relievingYear)},
                currentlyWorking: ${currentlyWorking ? Boolean(Number(1)) : Boolean(Number(0))},
                noticePeriodID: ${Number(noticePeriod?.npID) ? Number(noticePeriod?.npID) : 0},
                employmentType: "",
                otherHealthInstitutionName: "${institutionName?.himID === 0 ? institutionName?.name : ""}", 
                otherDesignationName: "${jobRole?.hciID === 0 ? jobRole?.specialty : ""}",
                lastWorkingDay:"${""}",
                otherSkills: "${FreeTextArrName?.join(',')}"
                )
            }`,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_UPDATE_EXPERIENCE, null,)
      .then((res) => res.json())
      .then((datas) => {
        console.log('add exp data', datas)
        console.log('QUERY_UPDATE_EXPERIENCE', QUERY_UPDATE_EXPERIENCE)
        setLoading(false)

        dispatchAction(getExperienceList())
        dispatchAction(setMonthlyData(monthlySalary))
        dispatchAction(setTotalData(totalExp))

        setDepartment({})
        setFinalSelectedSkill([])
        setJobRole({})
        setCurrentlyWorking(false)
        setNoticePeriod({})
        setJoiningYear('')
        setJoiningMonth('')
        setIndustry({})
        setInstitutionName({})
        dispatchAction(setSelectedExperience({}))
        showMessage({
          message: "Experience added Successfully",
          type: "success",
        });
        navigation.goBack()
      })
  }

  const experienceHandler = () => {

    setLoading(true)

      let isValid = true

      if (!totalExp?.label) {
        setTotalExpErr('Please select total experience')
        isValid = false
        setLoading(false)
        console.log('asche totalExp')
      }
      if (!jobRole?.specialty) {
        setJobRoleErr('Please select jobe role')
        isValid = false
        setLoading(false)
        console.log('asche totalExp')
      }
      if (!institutionName?.name) {
        setInstitutionNameErr('Please write institution name')
        isValid = false
        setLoading(false)
        console.log('asche institutionName')
      }
      if ((!isNoticePeriod || (isNoticePeriod == 'Yes' && !noticePeriod?.npID)) && currentlyWorking ) {
        setNoticePeriodErr('Please select notice period')
        isValid = false
        setLoading(false)
        console.log('asche isNoticePeriod')
      }
      if (!industry?.industry) {
        setIndustryErr('Please select industry')
        isValid = false
        setLoading(false)
        console.log('asche sIndustryErr')
      }
      if (industry?.industry == 'Other' && !industryOther) {
        setIndustryOtherErr('Please write industry')
        isValid = false
        setLoading(false)
        console.log('asche sIndustryOtherErr')
      }
      if (!department?.name) {
        setDepartmentErr('Please select department')
        isValid = false
        setLoading(false)
        console.log('asche departmenterr')
      }
      if (department?.name == 'Other' && !departmentOther) {
        setDepartmentOtherErr('Please write department name')
        isValid = false
        setLoading(false)
        console.log('asche department')
      }
      if (finalSelectedSkill.length == 0) {
        setSkillsErr('Please select Skills')
        isValid = false
        setLoading(false)
        console.log('asche finalSelectedSkill')
      }
      if (!monthlySalary) {
        setMonthlySalaryErr('Please write your monthly salary')
        isValid = false
        setLoading(false)
        console.log('asche monthlySalary')
      }
      if (monthlySalary?.toString()?.split('')[0] == 0) {
        setMonthlySalaryErr('First digit 0 is not acceptable')
        isValid = false
        setLoading(false)
        console.log('asche monthlySalary')
      }
      if (Number(monthlySalary) < 5000 || Number(monthlySalary) > 10000000) {
        setMonthlySalaryErr('Salary range should be 5000 - 10000000')
        isValid = false
        setLoading(false)
        console.log('asche monthlySalary')
      }
      if (!joiningDate) {
        setJoiningDateErr('Please write your joining date')
        isValid = false
        setLoading(false)
        console.log('asche joiningDate')
      }
      if (joiningMonth > 12 || joiningMonth.toString() == '00') {
        setJoiningDateErr('Month cannot be grater than 12 or less than 01')
        isValid = false
        setLoading(false)
        console.log('asche joiningMonth', joiningMonth)
      }
      if (numRgex.test(joiningMonth) === false) {
        setJoiningDateErr('This field only accept number digit')
        isValid = false
        console.log('asche joiningMonth', joiningMonth)
        setLoading(false);
      }
      if (joiningYear > Number(currentYear)) {
        setJoiningDateErr('Future date are not acceptable')
        isValid = false
        setLoading(false)
        console.log('asche joiningYear')
      }
      if (joiningYear.toString().split('')[0] == 0) {
        setJoiningDateErr('Please entar a valid year')
        isValid = false
        setLoading(false)
        console.log('asche joiningYear')
      }
      if(!currentlyWorking){
        if (!relievingDate) {
          setRelievingDateErr('Please write your joining date')
          isValid = false
          setLoading(false)
          console.log('asche relieving')
        }
        if (relievingMonth > 12 || relievingMonth.toString() == '00') {
          setJoiningDateErr('Month cannot be grater than 12 or less than 01')
          isValid = false
          setLoading(false)
          console.log('asche relievingMonth', relievingMonth)
        }
        if (numRgex.test(relievingMonth) === false) {
          setJoiningDateErr('This field only accept number digit')
          isValid = false
          console.log('asche relievingMonth', relievingMonth)
          setLoading(false);
        }
        // if (relievingYear > Number(currentYear)) {
        //   setJoiningDateErr('Future date are not acceptable')
        //   isValid = false
        //   setLoading(false)
        //   console.log('asche relievingYear')
        // }
        if (relievingYear.toString().split('')[0] == 0) {
          setJoiningDateErr('Please entar a valid year')
          isValid = false
          setLoading(false)
          console.log('asche relievingYear')
        }
      }
      if (numRgex.test(joiningYear) === false) {
        setJoiningDateErr('This field only accept number digit')
        isValid = false
        console.log('asche joiningYear')
        setLoading(false);
      }
      if (isValid) {
        if (selectedExperience?.expID) {
          updateingExperienceData()
        } else {
          savingExperienceData()
        }

      }
   
  }

  const backHandler = () => {
    navigation.goBack()
  }

  //Editing purpose
  useEffect(() => {
    getEditSkills()
    if (selectedExperience?.startingYear) {
      setCurrentlyWorking(selectedExperience?.currentlyWorking)
      const dates = selectedExperience?.startingMonth + '/' + selectedExperience?.startingYear
      setJoiningDate(dates)
      setJoiningMonth(selectedExperience?.startingMonth)
      setJoiningYear(selectedExperience?.startingYear)

    }
    if (selectedExperience?.workingYear) {
      
      const dates = selectedExperience?.workingMonth + '/' + selectedExperience?.workingYear
      setRelievingDate(dates)
      seRelievingMonth(selectedExperience?.workingMonth)
      setRelievingYear(selectedExperience?.workingYear)

    }
    if (selectedExperience?.expID) {
      getEditDepartMent()
      setTotalExp({label: `${profile?.exp ? `${profile?.exp} Years` : `${profile?.expMonths} Months`}`, value: profile?.exp || profile?.expMonths})
      setMonthlySalary(profile?.salary?.toString())
      const findNotice = allNoticePeriodData?.find((item) => item?.npID == selectedExperience?.noticePeriodID)
      if (findNotice?.npID) {
        setAllNoticePeriod([{ ...findNotice }])
        setNoticePeriod({ ...findNotice })

        setIsNoticePeriod('Yes')
      }
      else if (!findNotice?.npID) {
        setIsNoticePeriod('No')
      }
    }
    if (selectedExperience?.designationID) {

      if (selectedExperience?.isOtherSkill) {
        setJobRole({ specialty: selectedExperience?.designation, hciID: 0 })

      } else {
        setJobRole({ specialty: selectedExperience?.designation, hciID: selectedExperience?.designationID })
      }
    }

    if (selectedExperience?.healthInstituteID) {
      setIsExperience('Yes')
      if (selectedExperience?.isOtherInstitute == false) {
        setInstitutionName({ name: selectedExperience?.instituteName, himID: selectedExperience?.healthInstituteID })
      } else {
        setInstitutionName({ name: selectedExperience?.instituteName, himID: 0 })

      }
    }

    if (selectedExperience?.isOtherIndustry) {
      console.log('other e dukse')
      setIndustry({ industry: 'Other', hciID: selectedExperience?.healthInstituteTypeID })
      setIndustryOther(selectedExperience?.instituteType)
    }

    if (!selectedExperience?.isOtherIndustry) {
      console.log('oeanother')
      setIndustry({ industry: selectedExperience?.instituteType, hciID: selectedExperience?.healthInstituteTypeID })
    }

    if (!selectedExperience?.expID) {
      setIsExperience('No')
    }
  }, [selectedExperience?.expID, isFocused, ])

  const getEditDepartMent = async () => {
    const QUERY_GET_DEPARTMENT_BY_ID = {
      query: `query MyQuery {
                    getDepartmentByID(departmentID: ${selectedExperience?.departmentID}) {
                      departmentID
                      name
                    }
                  }`
    }
    gqlquery(QUERY_GET_DEPARTMENT_BY_ID, null)
      .then((res) => res.json())
      .then((response) => {
        console.log("repsonse", response)
        setDepartment({ departmentID: selectedExperience?.departmentID, name: response?.data?.getDepartmentByID?.name })
        if (response?.data?.getDepartmentByID?.name == 'Other') {
          setDepartmentOther(response?.data?.getDepartmentByID?.name)
        }
      });
  }

  const getEditSkills = async () => {

    if (selectedExperience?.departmentID) {

      const GET_SKILLS_BY_EXP_ID = {
        query: `query MyQuery {
              getSkillsByExpID(expID: ${Number(selectedExperience?.expID)}) {
                name
                skillID
              }
            }`,
        variables: null,
        operationName: "MyQuery",
      };

      gqlquery(GET_SKILLS_BY_EXP_ID, null)
        .then((res) => res.json())
        .then((data) => {

          setSelectedSkillArr(data?.data?.getSkillsByExpID)
          setFinalSelectedSkill(data?.data?.getSkillsByExpID)
        });
    }
  }

  function numberToText(inputnumber) {

    var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    
    function convert_millions(num) {
      if (num >= 1000000) {
        return convert_millions(Math.floor(num / 1000000)) + " million " + convert_lakhs(num % 1000000);
      } 
    
      else {
       
        return convert_lakhs(num);
      }
    }
    
    function convert_lakhs (num){
    
      if(num >= 900000){
        return convert_lakhs(Math.floor(num / 100000)) + " lakhs " + convert_thousands(num % 100000);
      }
      else{
        return convert_thousands(num);
      }
     
    }
    function convert_thousands(num) {
      if (num >= 1000) {
        return convert_hundreds(Math.floor(num / 1000)) + " thousand " + convert_hundreds(num % 1000);
      } else {
        return convert_hundreds(num);
      }
    }
    
    function convert_hundreds(num) {
      if (num > 99) {
        return ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100);
      } else {
        return convert_tens(num);
      }
    }
    
    function convert_tens(num) {
      if (num < 10) return ones[num];
      else if (num >= 10 && num < 20) return teens[num - 10];
      else {
        return tens[Math.floor(num / 10)] + " " + ones[num % 10];
      }
    }
    
    function convert(num) {
      if (num == 0) return "zero";
      else return convert_millions(num);
    }
    
    //end of conversion code
    
    //testing code begins here
    
    function main() {
      const words = convert(inputnumber)
      setPerAnnumText(words)
    }
    
    main();
    }
    
  const handleDeleteExperience = async (e) => {

    const QUERY_DELETEEDUCATION = {
      query: `mutation MyMutation {
        deleteExperience(expID: "${selectedExperience?.expID}")
      }`,
      variables: null,
      operationName: "MyMutation",
    };

    gqlquery(QUERY_DELETEEDUCATION, null)
      .then((res) => res.json())
      .then((datas) => {

        if (datas?.data?.deleteExperience) {
          dispatchAction(getExperienceList())
          navigation.goBack()
        
          showMessage({
            message: "Experience Deleted",
            type: 'success',
            autoHide: true,
            hideStatusBar: true,
            icon: 'success',
            position: 'left'
          })
        } else {

        }
      })
      .finally((e) => console.log("Deleting experience details in database"));

  };
// console.log('profile >>>', profile)
  return (
    <View style={{ flex: 1,  backgroundColor: 'white'}}>
        {/* ----------------Header------------------ */}
        <ProfileTabScreenHeader deleteConfirmHandler={handleDeleteExperience} title={!selectedExperience?.expID ? 'Add Experience' : 'Update Experience'} deleteBtn={selectedExperience?.expID ? true : false} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}>
     
        <View>
            {/* ---------------Total experience-------------- */}
            <SelectButton selected={totalExp?.label ? totalExp?.label : ''} title='Total experience' placeHolder="Select Total experience" onPressHandler={() => { setTotalExpModal(true); setTotalExpErr(''); }} />
            {totalExpErr && <ErrorText error={totalExpErr} />}

            {/* ---------------Current Job Role-------------- */}
            <SelectButton selected={jobRole?.specialty} title='Current Job Role' placeHolder="Select Job Role" onPressHandler={() => { setJobRoleErr(''); setJobRoleModal(true); }} />
            {jobeRoleErr && <ErrorText error={jobeRoleErr} />}

            {/* ---------------Skills-------------- */}
            <MultiSelectButton setSelectItem={unSelectHandler} selectedArr={finalSelectedSkill} title='Skills' placeHolder="Enter Skill" onPressHandler={() => { setSkillsErr(''); setSkillModal(true); }} />
            {skillsErr && <ErrorText error={skillsErr} />}

            {/* ---------------Current Hospital/Company Name-------------- */}
            <SelectButton selected={institutionName?.name} title='Current Hospital/Company Name' placeHolder="Select Hospital/Company Name" onPressHandler={() => setCurrentHospitalModal(true)} />
            <View style={styles.currentlyWorkingView}>
              {
                currentlyWorking ? <Pressable onPress={() => setCurrentlyWorking(false)}>
                  <MaterialIcons name='check-box' style={{ marginRight: 7 }} size={18} color="#395987" />
                </Pressable> : <Pressable onPress={() => setCurrentlyWorking(true)}>
                  <MaterialIcons style={{ marginRight: 7 }} name='check-box-outline-blank' size={18} color="#E4EEF5" />
                </Pressable>
              }
              <Text style={styles.currentlyWorkingText}>Currently work here</Text>
            </View>
            {institutionNameErr && <ErrorText error={institutionNameErr} />}

            {/* ---------------Joining Month & Year-------------- */}
            <View style={[styles.inputView, { marginVertical: 10 }]}>
              <Text style={styles.labelText}>Joining Month & Year</Text>
              <TextInput onBlur={JoiningDateBlurHandler} maxLength={7} defaultValue={joiningDate} onChangeText={(text) => {
                console.log('joining date length ==>', text?.length)
                if (text?.length == 2) {
                  const addingSlash = text + '/'
                  setJoiningDate(addingSlash);
                  setJoiningDateErr('')
                }
                else if (text?.length == 3) {
                  setJoiningDate(text?.replace('/', ''));
                  setJoiningDateErr('');
                }
                else {
                  setJoiningDate(text);
                  setJoiningDateErr('');
                }
              }} onFocus={() => setActive(true)} keyboardType='number-pad' style={{
                color: 'black',
                borderColor: active ? '#395987' : '#B8BCCA50',
                borderWidth: 1,
                borderRadius: 10,
                height: 45,
                paddingLeft: 15,
                marginTop: 10
              }} placeholder='MM/YYYY' placeholderTextColor='gray' />
              <Text style={styles.suggestionText}>For e.g. 12/2021</Text>
              {joiningDateErr && <ErrorText error={joiningDateErr} />}
            </View>

            {/* ---------------Relieving Month & Year-------------- */}
              {
                !currentlyWorking &&  
              <View style={[styles.inputView, { marginVertical: 10 }]}>
                <Text style={styles.labelText}>Relieving Month & Year</Text>
                <TextInput onBlur={RelievingDateBlurHandler} maxLength={7} defaultValue={relievingDate} onChangeText={(text) => {
                  console.log('Relieving date length ==>', text?.length)
                  if (text?.length == 2) {
                    const addingSlash = text + '/'
                    setRelievingDate(addingSlash);
                    setRelievingDateErr('')
                  }
                  else if (text?.length == 3) {
                    setRelievingDate(text?.replace('/', ''));
                    setRelievingDateErr('');
                  }
                  else {
                    setRelievingDate(text);
                    setRelievingDateErr('');
                  }
                }} onFocus={() => setActive(true)} keyboardType='number-pad' style={{
                  color: 'black',
                  borderColor: active ? '#395987' : '#B8BCCA50',
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 45,
                  paddingLeft: 15,
                  marginTop: 10
                }} placeholder='MM/YYYY' placeholderTextColor='gray' />
                <Text style={styles.suggestionText}>For e.g. 12/2021</Text>
                {relievingDateErr && <ErrorText error={relievingDateErr} />}
              </View>
              }

            {/* ------------------Notice Period-------------- */}
            {
              currentlyWorking && 
              <View style={{ marginTop: 10 }}>
                <Text style={styles.labelText}>Are you currently serving notice period?</Text>
                <View style={styles.qualificationChipView}>
                  {
                    isNoticePeriod == 'Yes' ?
                      <>
                        {
                          allNoticePeriod?.map((item, i) => (
                            <Pressable onPress={() => {
                              noticePeriodSelect(item)
                            }} key={i} style={[noticePeriod?.npID == item?.npID ? styles.chipsSelected : styles.chipsNotSelected]}>
                              <Text style={[noticePeriod?.npID == item?.npID ? styles.chipsSelectedText : styles.chipsNotSelectedText]}>{item?.notice}</Text>
                            </Pressable>
                          ))
                        }
                      </> :
                      <>
                        {
                          IsExperienceData?.map((item, i) => (
                            <Pressable onPress={() => {
                              setIsNoticePeriod(item)
                              setNoticePeriodErr('')
                              if (item == 'Yes') {
                                setAllNoticePeriod(allNoticePeriodData)
                              }
                            }} key={i} style={[isNoticePeriod == item ? styles.chipsSelected : styles.chipsNotSelected]}>
                              <Text style={[isNoticePeriod == item ? styles.chipsSelectedText : styles.chipsNotSelectedText]}>{item}</Text>
                            </Pressable>
                          ))
                        }
                      </>
                  }
                </View>
                {noticePeriodErr && <ErrorText error={noticePeriodErr} />}
            </View>
            }

            {/* ---------------Industry-------------- */}
            <SelectButton selected={industry?.industry} title='Industry' placeHolder="Select Industry" onPressHandler={() => setIndustryModal(true)} />
            {industryErr && <ErrorText error={industryErr} />}
            {
              industry?.industry == 'Other' &&
              <View style={[styles.inputView, { marginVertical: 10 }]}>
                <TextInput value={industryOther.replace(/  +/g, " ")} onChangeText={(text) => {
                  setIndustryOther(text.trimStart())
                  setIndustryOtherErr('')
                  setIndustryErr('')
                }} onFocus={() => setActive(true)} onBlur={() => setActive(false)} style={{
                  color: 'black',
                  borderColor: active ? '#395987' : '#B8BCCA50',
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 45,
                  paddingLeft: 15,
                  marginTop: 10
                }} placeholder='Write industry name' placeholderTextColor='gray' />
                {industryOtherErr && <ErrorText error={industryOtherErr} />}
              </View>
            }
            {/* ---------------Department-------------- */}
            <SelectButton selected={department?.name} title='Department' placeHolder="Select Department" onPressHandler={() => setDepartmentModal(true)} />
            {departmentErr && <ErrorText error={departmentErr} />}
            {
              department?.name == 'Other' &&
              <View style={[styles.inputView, { marginVertical: 10 }]}>
                <TextInput onFocus={() => setActive(true)} onBlur={() => setActive(false)} value={departmentOther.replace(/  +/g, " ")} onChangeText={(text) => {
                  setDepartmentOther(text.trimStart())
                  setDepartmentOtherErr('')
                  setDepartmentErr('')
                }} style={{
                  color: 'black',
                  borderColor: active ? '#395987' : '#B8BCCA50',
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 45,
                  paddingLeft: 15,
                  marginTop: 10
                }} placeholder='Write department name' placeholderTextColor='gray' />
                {departmentOtherErr && <ErrorText error={departmentOtherErr} />}
              </View>
            }
            {/* ---------------Monthly Salary-------------- */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.labelText}>Monthly Salary</Text>
              <View style={styles.monthlySalaryView}>
                <View style={styles.rupiIconView}>
                  <MaterialCommunityIcons name='currency-inr' size={16} color="black" />
                </View>
                <View style={styles.SalaryinputView}>
                  <TextInput onFocus={() => setActive(true)} onBlur={() => {
                    numberToText(Number(monthlySalary));
                    setActive(false);
                  }} maxLength={8} defaultValue={monthlySalaryData} keyboardType='number-pad' onChangeText={(text) => {
                    setMonthlySalary(text.trimStart())
                    setMonthlySalaryErr('')
                  }}
                    value={monthlySalary.replace(/  +/g, " ")} 
                    style={{
                      color: 'black',
                      borderColor: active ? '#395987' : '#B8BCCA50',
                      borderWidth: 1,
                      borderRadius: 10,
                      height: 45,
                      paddingLeft: 15,
                      marginTop: 10
                    }} placeholder='Enter salary' placeholderTextColor='gray' />
                </View>
              </View>
              <Text style={styles.suggestionText}>Per Annum: {perAnnumText}</Text>
              {monthlySalaryErr && <ErrorText error={monthlySalaryErr} />}
            </View>
        </View>

      </ScrollView>

      {
        isExperience && <BottomCoupleButton title2="Save" title1="Cancel" isLoad={loading} backHandler={backHandler} nextHandler={experienceHandler} />
      }

      {
        totalExpModal && <SingleItemBottomSheet setSelectItem={(item) => {
          setTotalExp(item)
          setTotalExpErr('')
          setTotalExpModal(false)
        }} isSearch={false} dropDownData={totalExperienceDatas} title={'Total Experience'} modalShow={totalExpModal} setModalShow={setTotalExpModal} />
      }

      {
        jobRoleModal && <SingleItemBottomSheet addHandler={jobRoleFreeTextAdd} isApiSearch={true} onSearch={searchSkillOrJobRole} setSelectItem={jobRoleSelect} dropDownData={jobRoleData} title={'Job Role'} modalShow={jobRoleModal} setModalShow={setJobRoleModal} isAddBtn={false} />
      }

      {
        skillModal && <MultiSelectBottomSheet fieldName="skill" addHandler={skillFreeTextAdd} onSubmit={setFinalSelectedSkill} onSearch={searchSkills} selectedData={selectedSkillArr} setSelectItem={skillSelectHandler} suggestionData={allSkillsSuggestion} title={'Skills'} modalShow={skillModal} setModalShow={setSkillModal} searchData={allSkills} dropDownData={allSkillsSuggestion?.length > 0 ? [] : allSkills} />
      }

      {
        currentHospitalModal && <SingleItemBottomSheet addHandler={InistitutionFreeTextAdd} onSearch={SearchInstitutionName} setSelectItem={hospitalCompanySelect} isApiSearch={true} dropDownData={allInstitutionName} title={'Hospital/Company'} modalShow={currentHospitalModal} setModalShow={setCurrentHospitalModal} />
      }

      {
        IndustryModal && <SingleItemBottomSheet setSelectItem={industrySelect} isSearch={false} dropDownData={allIndustry} title={'Industry'} modalShow={IndustryModal} setModalShow={setIndustryModal} />
      }

      {
        departmentModal && <SingleItemBottomSheet onSearch={searchDepartments} addHandler={departmentFreeTextAdd} setSelectItem={departmentSelect} dropDownData={allDepartment} isApiSearch={true} title={'Department'} modalShow={departmentModal} setModalShow={setDepartmentModal} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  SalaryinputView: {
    width: 280,

  }
  ,
  inputView: {
    width: '100%',
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
    fontWeight: '400',
    fontSize: 12
  },
  chipsSelectedText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
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
    borderColor: '#B8BCCA50',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    paddingLeft: 15,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6F7482',
    marginTop: 10,
    marginLeft: 5
  },
  customStyle: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: "100%",
    elevation: 5,
  },
  currentlyWorkingView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  currentlyWorkingText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#B8BCCA'
  },
  rupiIconView: {
    borderColor: '#B8BCCA50',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    marginRight: 7.
  },
  monthlySalaryView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    alignContent: 'center'
  }
});