// export const QUERY_LISTPROFILES = {
//   query: `query MyQuery {
//         getProfile {
//             name
//             city
//             exp
//             phone
//             salary
//             salaryThousands    
//             specialization
//             activelySearching
//         }
//     }`,
// };

import AsyncStorage from "@react-native-async-storage/async-storage";


export const QUERY_LISTPROFILES = {
    query: `query MyQuery {
        getProfile {
            name
            phone
            email
            newsletter
            cityWithState
            phoneVerified
            emailVerified
            exp
            expMonths
            salary
            activelySearching
            profilePicURL
            workStatus
            locationID
            isCurrentlyStduying
            isOutsideIndia
            linkedInURL
            getLocationOutsideIndia {
                area
                country
                loiID
              }
        }
      }`
};
export const QUERY_GETRESUME = {
    query: `query MyQuery {
        getResume {
            filename
            headline
            uploadedAt
            url
            videoURL
        }
    }`
};

export const QUERY_GETRESUMEHEADLINE = {
    query: `query MyQuery {
        getResume {
            headline
        }
    }`
};

export const QUERY_GETSKILLSLIST = {
    query: `query MyQuery {
        getSkillsList  {          
            name
        }
    }`
};

export const QUERY_GETEDUCATIONLIST = {
    query: `query MyQuery {
        getEducationList   {          
            courseName
        }
    }`
};

export const QUERY_GETEXPERIENCE = {
    query: `query MyQuery {
        getExperienceList    {          
            hospital
        }
    }`
};
export const QUERY_GETMEMBERSHIPS = {
    query: `query MyQuery {
        getMemberships     {          
            organization
        }
    }`
};

export const QUERY_GETPERSONALDETAILS = {
    query: `query MyQuery {
        getPersonalDetails     {          
            gender
        }
    }`
};

export const QUERY_GETCAREERPROFILEPERCENTAGE = {
    query: `query MyQuery {
        getCareerProfile     {          
            departmentName
        }
    }`
};

export const QUERY_COURSEID = {
    query: `query MyQuery {
        getCourseMaster {
            cmID
            name
        }
    }`
};

export const QUERY_SPECIALIZATIONID = {
    query: `query MyQuery {
        getSpecializationMaster  {
            name
            smID
        }
    }`
};

export const QUERY_UNIVERSITYID = {
    query: `query MyQuery {
        getUniversityMaster   {
            name 
            umID
        }
    }`
};

export const QUERY_GETEDUCATION = {
    query: `query MyQuery {
        getEducationList {
            course
            courseType
            eduID
            emID
            healthcareIndustry
            specialization
            qualification
            university
            universityID
            yearOfPassing
            isOtherUniversity
        }
    }`
};
export const QUERY_LISTSKILLS = {
    query: `query MyQuery {
      getSkillMaster {
          name
          skillID
        }
      }
    `
}

export const QUERY_SAVED_SKILL = {
    query: `query MyQuery {
        getSkillsList {
            sID
            name
            smID
           }
        }`
};
export const QUERY_DESIGNMASTER = {
    query: `query MyQuery {
        getDesignationMaster {
            dmID 
            name
        }
    }`
};

export const QUERY_HOSPITALMASTER = {
    query: `query MyQuery {
        getHospitalMaster {
            hmID 
            name
        }
    }`
};

export const QUERY_NOTICEMASTER = {
    query: `query MyQuery {
        getNoticePeriodMasters {
            npID 
            notice
        }
    }`
};

export const QUERY_GETEXPERIENCELIST = {
    query: `query MyQuery {
        getExperienceList {
            currentlyWorking
            description
            designation
            designationID
            employmentType
            expID
            healthInstituteID
            healthInstituteTypeID 
            instituteName
            instituteType
            jobType
            noticePeriodID
            startingMonth
            startingYear
            workingMonth
            workingYear
            isOtherSkill
            isOtherIndustry
            isOtherInstitute
            lastWorkingDay
            departmentID
        }
    }`
};


export const QUERY_GETMEMBERSHIP = {
    query: `query MyQuery {
         getMemberships {
            lifeMembership
            memID
            organization
            positionHeld
        }
    }`
};

export const QUERY_GETPAPERS = {
    query: `query MyQuery {
         getPapers {
            description
            fileURL
            month
            paperID
            title
            url
            year 
            fileName
        }
    }`
};

export const QUERY_GETCAREERPROFILE = {
    query: `query MyQuery {
        getCareerProfile {
            industryID
            roleCategoryID
            desiredJobType
            desiredEmploymentType
            expectedSalaryStart
            expectedSalaryEnd
            departmentName
            emailOpted
            phoneOpted
            whatsappOpted
            smsOpted
            industryName
            roleCategoryName
            isOtherIndustry
            isOtherRoleCategory
            isAnywhereFromIndia
            cpID
            desiredShift
                }
    }`
};

export const QUERY_GETAWARDS = {
    query: `query MyQuery {
         getAwards {
            awardID
            description
            month
            name
            url
            year             
        }
    }`
};

export const QUERY_PERSONAL_DETAILS = {
    query: `query MyQuery {
        getPersonalDetails {
            bothAddressSame
            dateofBirth
            differentlyAbled
            gender
            maritalStatus
            pdID
            permanentAddressL1
            permanentAddressL2
            permanentCity
            permanentCountry
            permanentLocationID
            permanentState
            permanentZip
            personalInterest
            presentAddressL1
            presentAddressL2
            presentCity
            presentCountry
            presentLocationID
            presentState
            presentZip
            professionalInterest
            spouseName
            spouseOccupation
            IsOtherPermanentCity
            IsOtherPresentCity
            }
        }`
};

export const QUERY_LANGUAGES_KNOWN = {
    query: `query MyQuery {
        getLanguagesKnown {
            language
            lknID
            proficiency
            read
            speak
            write
            }
        }`
}

export const QUERY_SAVEDJOBS = {
    query: `query MyQuery {
        getSavedJobs {
            description
            employmentType
            expMax
            expMin
            hospitalID
            isSalaryDisclosed
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
            }
            }`
};
export const QUERY_DEPARTMENTS = {
    query: `query MyQuery {
        getDepartments {
            departmentID
            name
            }
    }`
};


export const GET_PREFERRED_LOCATION = {
    query: `query MyQuery {
      getPreferredWorkLocation {
        cityWithState
        locationID
        pwlID
      }
    }
  `
};

export const QUERY_GETCANDIDATEAVAILABILITY = {
    query: `query MyQuery {
        getCandidateAvailability {
            availID
            day
            fromTime
            toTime
        }
    }`
};

export const QUERY_GETHOSPITAL = {
    query: `query MyQuery {
         getHospital {
            contactEmail
            contactName
            contactPhone
            hospitalID
            location
            name 
            shortName
            taxNumber
            type             
        }
    }`
};

export const QUERY_SINGLEJOBDETAIL = {
    query: `query MyQuery {
        searchTop4Jobs {
            description
            employmentType
            experience
            jobTitle
            lastDateToApply
            location
            maximumSalary
            minimumSalary
            postedOn
            primarySpecialization
            qualification
            vacancyID
            secondarySpecialization
            vacancyType
            hospitalID     
            name      
        }
    }`
};

export const QUERY_SEARCHTOPFOURJOBS = {

    query: `query MyQuery {
        getRecommendedJobs(paginateFrom: 0, sortBy: "v.vacancyType") {
            vacancyType
            vacancyID
            savedJob
            qualification
            postedOn
            name
            minimumSalary
            maximumSalary
            location
            lastDateToApply
            jobTitle
            hospitalID
            experience
            employmentType
            description
        }
      }`
};



export const QUERY_SEARCHTOPFOURJOBS_TWO = {

    query: `query MyQuery {
                searchTop4Jobs {
                    description
                    experience
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
                }

                }

              `,

    variables: null,

    operationName: "MyMutation",

};

export const QUERY_GET_NOTIFICATION = {

    query: `query MyQuery {
        getNotificationSettings {
         communicationEmail
           jobApplied
           newJobAlert
           newRecommendedJob
           profileStrength
           profilePicture
           updateProfile
           uploadResume
           userID
           communicationPush
           jobAppliedPush
           newJobAlertPush
           newRecommendedJobPush
           uploadResumePush
           profileStrengthPush
           profilePicturePush
           updateProfilePush
        }
      }`
};

export const QUERY_GET_APPLIED_JOBS={
    query:`query MyQuery {
        getAppliedJobs {
            description
            employmentType
            expMax
            expMin
            hospitalID
            isSalaryDisclosed
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
        }
      }
      `
}

export const gqlquery = (query, variables) => {
    const access_token = AsyncStorage.getItem("accessToken");
    const gquery = {
        query: query.query,
        variables: variables
    }
    return fetch(
        `${process.env.REACT_APP_DOCTORS_FLOW_GRAPHQL_MAIN_URL}`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authority:
                    `${process.env.REACT_APP_DOCTORS_FLOW_AUTHORITYL}`,
                authorization: access_token,
                referer: `${process.env.REACT_APP_DOCTORS_FLOW_REFERER}`,
                "accept-language": "en-US,en;q=0.9",
            },
            body: JSON.stringify(gquery),
        }
    )
}
