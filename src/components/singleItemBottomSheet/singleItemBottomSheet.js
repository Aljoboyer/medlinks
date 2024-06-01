import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';

export default function SingleItemBottomSheet({ modalShow, setModalShow, title, dropDownData, setSelectItem, isApiSearch = false, setSearchResult, onSearch, isSearch = true, addHandler, isAddBtn = true , storeData}) {
    const [searchText, setSearchText] = useState('');
    let resText = /^[a-zA-Z\s.\&"/",\-\)\(]*$/;
    let resTextCourse = /^[a-zA-Z\s.&,\-\)\(]*$/;
    const [active, setActive] = useState(false)
    const [freetextErr, setFreetextErr] = useState('')

    const HandlerFreeTextlocation = async (text) => {
        if (title === 'Course') {
            if (resTextCourse.test(text) === false) {
                setFreetextErr('Please search city without special characters.');
                // isValid = false
                // console.log('asche name2', nameErr)
            }
            else {
                setSearchText(text)
                setFreetextErr('')
            }
        }
        else {
            if (resText.test(text) === false) {
                setFreetextErr('Please search city without special characters.');
                // isValid = false
                // console.log('asche name2', nameErr)
            }
            else {
                setSearchText(text)
                setFreetextErr('')
            }
        }

    }

    const searchHandler = (text) => {
        HandlerFreeTextlocation(text)
        if (text?.length >= 2 && !isApiSearch) {

            const searchData = dropDownData?.filter((item) => {
                const searchItem = text.toLocaleLowerCase();

                return (
                    item?.specialization?.toLocaleLowerCase()?.indexOf(searchItem) > -1 ||
                    item?.course?.toLocaleLowerCase()?.indexOf(searchItem) > -1
                );
            });

            setSearchResult(searchData);
        }
        else if (!isApiSearch) {
            setSearchResult([...storeData]);
        }
        else {
            onSearch(text)
        }
    }
    return (

        <BottomSheet onBackdropPress={() => setModalShow(false)} modalProps={{}} isVisible={modalShow}>
            <View style={styles.BottomSheetView}>
                <View style={styles.emptyView}></View>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Pressable onPress={() => setModalShow(false)}>
                        <Entypo color="#6F7482" name="cross" size={24} />
                    </Pressable>
                </View>
                {
                    isSearch &&
                    <View style={{borderColor:active ? "#395987" : '#B8BCCA50',
                    borderWidth: 1,
                    borderRadius: 10,
                    height: 45,
                    marginTop: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: 10}}>
                        <TextInput onFocus={() => setActive(true)} onBlur={() => setActive(false)} value={searchText?.replace(/  +/g, " ")} onChangeText={(text) => searchHandler(text.trimStart())} placeholderTextColor='gray' placeholder='Search' style={{
                            paddingLeft: 10,
                            width: '80%',
                            color: 'black',
                            borderColor: active ? "#395987" : '#B8BCCA50',
                            fontFamily: 'Poppins-Regular'
                        }} />
                        {
                            isAddBtn && <Pressable onPress={() => addHandler(searchText)} >
                                <Text style={styles.addText}>+ Add</Text>
                            </Pressable>
                        }
                    </View>
                }
                {freetextErr && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{freetextErr}</Text>}
                <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 15, paddingHorizontal: 10, }} showsVerticalScrollIndicator={true} >
                    {
                        dropDownData?.map((item, i) => (
                            <Pressable key={i} style={styles.dropDownItem} onPress={() => {setSelectItem(item);setModalShow(false)}} >
                                <Text style={{ color: '#6F7482', fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21 }}>{item?.specialization || item?.course || item?.name || item?.cityWithState || item?.label || item?.specialty || item?.industry || item?.state || item}</Text>
                            </Pressable>
                        ))
                    }
                </ScrollView>
            </View>
        </BottomSheet>

    )
}

const styles = StyleSheet.create({
    searchInputView: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        height: 45,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10
    },
    searchInput: {
        paddingLeft: 10,
        width: '80%',
        color: 'black',
        fontFamily: 'Poppins-Regular'
    },
    BottomSheetView: {
        backgroundColor: 'white',
        height: 600,
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    bottomSheetHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        height: 55
    },
    headerTitle: {
        color: '#395987',
        fontSize: 16,
        // fontWeight: '700',
        fontFamily: 'Poppins-SemiBold',
    },
    emptyView: {
        height: 8,
        width: 50,
        backgroundColor: '#D9D9D9',
        alignSelf: 'center'
    },
    addText: {
        color: '#395987',
        fontSize: 14,
        // fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    dropDownItem: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        paddingVertical: 15
    }
});