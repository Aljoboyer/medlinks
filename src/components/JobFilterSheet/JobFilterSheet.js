import { View, Text } from 'react-native'
import React from 'react'
import { BottomSheet } from '@rneui/base';
import { Pressable } from 'react-native';
import BottomCoupleButton from '../BottomCoupleButton/BottomCoupleButton';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native'
import { TextInput } from 'react-native';
const screenHeight = Dimensions.get('window').height;

const SideBarData = ['Sort By', 'Location','Salary', 'Experience', 'Job Type']


const JobTypeOp = ['Full Time', 'Part Time', 'Locum'];

export default function JobFilterSheet({
    filterSheetShow, 
    setFilterSheetShow,
    selectedFilter,
    setSelectedFilter,
    salary1,
    salary2,
    setSalaryMax,
    setSalaryMin,
    exp1,
    exp2,
    setExpmin,
    setExpMax,
    setExperienceChecked,
    experienceChecked,

//-----------Checked state--------\--//
    locationChecked,
    setLocationChecked,
    sortchecked,
    setSortchecked,
    jobTypeChecked,
    setJobTypeChecked,
    salaryChecked,
    setSalaryChecked,
//---------Filter Main Option Array------//
    locationOptionArray,
    jobTypeOptionArray,
    salaryOptions,
    experienceOptions,

//-----------Check Handler--------//
    handleCheckboxLocation,
    handleCheckboxJobType,

//-----------FilterHandler-------------//
    FilterHandler,
    clearFilterHandler
}) {

    const LocationCheckHandler = (item) => {

        handleCheckboxLocation(item)
        if (locationChecked.includes(item)) {
          const filterLocation = locationChecked?.filter((loc) => loc !== item)
          setLocationChecked([...filterLocation])
        }
        else {
          setLocationChecked([...locationChecked, item])
        }
    
      }

    const JobTypeCheckHandler = (item) => {
    handleCheckboxJobType(item)
    if (jobTypeChecked.includes(item)) {
        const filterJobtype = jobTypeChecked?.filter((job) => job !== item)
        setJobTypeChecked([...filterJobtype])
    }
    else {
        setJobTypeChecked(prevstate => [...prevstate, item])
    }
    }
    const SalaryCheckHandler = (item) => {
        const salExists = salaryChecked?.find((sal) => sal?.checkData == item?.checkData)

        if (salExists?.checkData) {
            const filterSalary = salaryChecked?.filter((salary) => salary?.checkData !== item?.checkData)
            if(filterSalary?.length > 0){
                const maxArr = filterSalary?.map((item) => {
                    
                    return item?.max
                })
                const minArr = filterSalary?.map((item) => {
                    
                    return item?.min
                })
                
                const max = Math.max(...maxArr)
                const min = Math.min(...minArr)
                setSalaryMax(max)
                setSalaryMin(min)
            }

            setSalaryChecked([...filterSalary])
        }
        else {
            const salaryArr = [...salaryChecked, item]
            if(salaryArr?.length > 0){
                const maxArr = salaryArr?.map((item) => {
                    
                    return item?.max
                })
                const minArr = salaryArr?.map((item) => {
                    
                    return item?.min
                })
                console.log(maxArr)

                const max = Math.max(...maxArr)
                const min = Math.min(...minArr)
                setSalaryMax(max)
                setSalaryMin(min)
            }
            setSalaryChecked(prevstate => [...prevstate, item])
        }
    }
    const ExpCheckHandler = (item) => {
        const expExists = experienceChecked?.find((exp) => exp?.checkData == item?.checkData)

        if (expExists?.checkData) {
            const filterExp = experienceChecked?.filter((exp) => exp?.checkData !== item?.checkData)

            if(filterExp?.length > 0){
                const maxArr = filterExp?.map((item) => {
                    
                    return item?.max
                })
                const minArr = filterExp?.map((item) => {
                    
                    return item?.min
                })
               
                const max = Math.max(...maxArr)
                const min = Math.min(...minArr)
                setExpMax(max)
                setExpmin(min)
            }

            setExperienceChecked([...filterExp])
        }
        else {
            const expArr = [...experienceChecked, item]
            if(expArr?.length > 0){
                const maxArr = expArr?.map((item) => {
                    
                    return item?.max
                })
                const minArr = expArr?.map((item) => {
                    
                    return item?.min
                })
           

                const max = Math.max(...maxArr)
                const min = Math.min(...minArr)
                setExpMax(max)
                setExpmin(min)
            }
            setExperienceChecked(prevstate => [...prevstate, item])
        }
        }
  return (
<BottomSheet
 onBackdropPress={() => setFilterSheetShow(false)} 
 modalProps={{}} isVisible={filterSheetShow}>

    <View style={styles.BottomSheetView}>
{/* ----------------Filter Header---------- */}
        <View style={styles.bottomSheetHeader}>
            <Text style={styles.headerTitle}>All Filters</Text>
            <Pressable onPress={() => clearFilterHandler()}>
                <Text style={styles.headerBtnTxt}>Clear All</Text>
            </Pressable>
        </View>
{/* -----------------Filter Main View------------- */}
        <View style={styles.filterMainView}>

        {/* ----------Filter SideBar------ */}
            <View style={styles.filterSideBar}>
                {
                SideBarData?.map((item) => (
                    <Pressable 
                    onPress={() => setSelectedFilter(item)}

                        style={selectedFilter?.toLowerCase() == item?.toLowerCase() ? styles.selectedItem : styles.sidebarItem} 
            
                        key={item}>

                        <Text style={selectedFilter?.toLowerCase() == item?.toLowerCase() ? styles.selectedText: styles.sideBarItemTxt} >{item}</Text>

                        {
                            (sortchecked == 1 || sortchecked == 0 ) && item == 'Sort By' && <Octicons name='dot-fill' style={{ color: '#395987', fontSize: 15}} />
                        }
                        
                        {
                            locationChecked?.length > 0 && item == 'Location' && <Octicons name='dot-fill' style={{ color: '#395987', fontSize: 15}} />
                        }

                        {
                            salaryChecked?.length > 0 && item == 'Salary' && <Octicons name='dot-fill' style={{ color: '#395987', fontSize: 15}} />
                        }

                        {
                            experienceChecked?.length > 0 && item == 'Experience' && <Octicons name='dot-fill' style={{ color: '#395987', fontSize: 15}} />
                        }

                        {
                            jobTypeChecked?.length > 0 && item == 'Job Type' && <Octicons name='dot-fill' style={{ color: '#395987', fontSize: 15}} />
                        }
                    </Pressable>
                ))
                }
            </View>

{/* -------------------Filter item view----------------------- */}
    <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 200}}>
       {/* -----------Sort By--------- */}
            {
                selectedFilter == 'Sort By' && <View>
                <Pressable onPress={() => setSortchecked(0)} style={styles.filterItem}>
                    {
                      sortchecked == 0 ?  <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                    }
                    <Text style={[sortchecked == 0 ? styles.filterItemSelectedTxt : styles.filterItemNonSelectedTxt]}>Relevance</Text>
                </Pressable>

                <Pressable onPress={() => setSortchecked(1)} style={styles.filterItem}>
                    {
                     sortchecked == 1 ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                    }
                    <Text style={[sortchecked == 1 ? styles.filterItemSelectedTxt : styles.filterItemNonSelectedTxt]}>Date</Text>
                </Pressable>
            </View>
            }
        {/* -----------Location--------- */}
             {
            selectedFilter == 'Location' && 
            <View>
            {/* --------Search View------ */}
                <View style={styles.searchInputView} >
                    <TextInput style={styles.searchInput} placeholder='Search' placeholderTextColor='gray' />
                    <Ionicons name="search" size={16} color='#395987' />
                </View>
                
                {/* --------Popular Search-------- */}
                <View>
                    <Text style={styles.populartitle}>Popular Searches</Text>
                    {
                    locationOptionArray?.map((item, index) => (
                        <Pressable key={index} onPress={() => LocationCheckHandler(item)} style={styles.filterItem}>
                        {
                        locationChecked?.find((idx) => idx == item) ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                        }
                    
                        <Text style={[ locationChecked?.find((idx) => idx == item) ? styles.filterItemSelectedTxt : styles.filterItemNonSelectedTxt]}>{item}</Text>
                        </Pressable>
                    ))
                    }
                </View>
            </View>
            }

        {/* -----------Salary--------- */}
            {
            selectedFilter == 'Salary' && 
            <View>
                {
                salaryOptions?.map((item, index) => (
                    <Pressable onPress={() => {
                        SalaryCheckHandler(item)
                    }} key={index} style={styles.filterItem}>
                       {
                        salaryChecked?.find((idx) => idx?.checkData == item?.checkData)?.checkData ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                        }

                        <Text style={styles.filterItemNonSelectedTxt}>
                            {
                                `${item?.min?.length >= 5 ? item?.min.slice(0, 2) + ',' + item?.min.slice(1) : item?.max} - ${item?.max?.length >= 5 ? item?.max.slice(0, 2) + ',' + item?.max.slice(1) : item?.max}`
                            }
                              </Text>
                    </Pressable>
                ))
                }
                 <Pressable onPress={() => {
                      SalaryCheckHandler({min: salary1, max: salary2, checkData: 'More'})
                       
                    }} style={styles.filterItem}>
                       {
                        salaryChecked?.find((idx) => idx?.checkData == 'More')?.checkData ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                        }

                        <Text style={styles.filterItemNonSelectedTxt}>
                            {
                                (Number(salary2) > 50000) && (Number(salary2) < 90000) ?  'More than 50000' : 'More than 90000'
                            }
                              </Text>
                </Pressable>
            </View>
            }   
       {/* -----------Experience--------- */}
            {
            selectedFilter == 'Experience' && 
            <View>
                <Pressable onPress={() => {
                        ExpCheckHandler({min: 0, max: 1, checkData: 'Fresher'})
                    }} style={styles.filterItem}>
                     {
                        experienceChecked?.find((idx) => idx?.checkData == 'Fresher')?.max ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                    }
                    <Text style={styles.filterItemNonSelectedTxt}>Fresher</Text>
                </Pressable>
                {
                    experienceOptions?.map((item) => (
                    <Pressable onPress={() => {
                        ExpCheckHandler(item)
                    }} style={styles.filterItem}>
                         {
                        experienceChecked?.find((idx) => idx?.checkData == item?.checkData)?.checkData ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                        }
                        <Text style={styles.filterItemNonSelectedTxt}>{item?.min} - {`${item?.max} Years`}</Text>
                    </Pressable>
                    ))
                }
                {
                    exp2 > 10 &&  <Pressable onPress={() => {
                        ExpCheckHandler({min: exp1, max: exp2, checkData: 'More'})
                     
                    }} style={styles.filterItem}>

                      {
                        experienceChecked?.find((idx) => idx?.checkData == 'More')?.max ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                    }

                    <Text style={styles.filterItemNonSelectedTxt}>More Than 10 Years</Text>
                </Pressable>
                }
            </View>
            }  

        {/* -----------Job Type--------- */}
            {
            selectedFilter == 'Job Type' && 
            <View>
            {
                jobTypeOptionArray?.map((item, index) => (
                    <Pressable key={index} onPress={() => JobTypeCheckHandler(item)} style={styles.filterItem}>
                    {
                    jobTypeChecked?.find((idx) => idx == item) ? <AntDesign name='checksquare' style={{ color: '#395987', fontSize: 15}} /> : <Ionicons name='square-outline' style={{ color: 'gray', fontSize: 15}} />
                    }
                
                    <Text style={[ jobTypeChecked?.find((idx) => idx == item) ? styles.filterItemSelectedTxt : styles.filterItemNonSelectedTxt]}>{item}</Text>
                    </Pressable>
                ))
            }
            </View>
            }   

        </ScrollView>
    </View>
</View>

    <BottomCoupleButton nextHandler={FilterHandler} backHandler={() => setFilterSheetShow(false)} title1='Close' title2='Apply' /> 

</BottomSheet>
  )
}

const styles = StyleSheet.create({
    BottomSheetView: {
        backgroundColor: 'white',
        height: screenHeight,
        // padding: 10,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30
    },
    bottomSheetHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        height: 55,
        padding: 10,
    },
    headerTitle: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    headerBtnTxt:{
        color: '#395987',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    filterMainView:{
        display: 'flex',
        flexDirection: 'row',
        height: '100%'
    },
    filterSideBar:{
        backgroundColor: '#E4EEF5',
        width: 130,
        height: '100%'
    },
    sidebarItem:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomColor: '#6F748220',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10
    },
    sideBarItemTxt:{
        color: '#6F7482',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    selectedItem:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomColor: '#6F748220',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    selectedText:{
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    filterItem:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 7
    },
    filterItemNonSelectedTxt:{
        color: '#6F7482',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginLeft: 7
    },
    filterItemSelectedTxt:{
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginLeft: 7
    },
    searchInputView:{
        height: 42,
        width: 210,
        borderWidth: 1,
        borderColor: '#E4EEF5',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    searchInput:{
        width: 170
    },
    populartitle:{
        color: '#395987',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        marginTop: 10
    }
});