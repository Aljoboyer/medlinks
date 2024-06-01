import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';
import { useState } from 'react';

export default function MultiSelectBottomSheet({ modalShow, setModalShow, title, selectedData, setSelectItem, suggestionData, onSearch, searchData, onSubmit, isAddBtn = true, isSearch = true, addHandler, fieldName }) {
    const [searchText, setSearchText] = useState('')
    const [active, setActive] = useState(false)
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
                    <View style={{
                        borderColor: active ? '#395987' : '#B8BCCA50',
                        borderWidth: 1,
                        borderRadius: 10,
                        height: 45,
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 10
                    }}>
                        <TextInput value={searchText} onChangeText={(text) => {
                            onSearch(text)
                            setSearchText(text)
                        }} onFocus={() => setActive(true)} onBlur={() => setActive(false)} placeholderTextColor='gray' placeholder='Search' style={styles.searchInput} />

                        {
                            isAddBtn && <Pressable onPress={() => {
                                addHandler(searchText)
                                setSearchText('')
                            }
                            }>
                                <Text style={styles.addText}>+ Add</Text>
                            </Pressable>
                        }
                    </View>
                }

                {
                    selectedData?.length > 0 && <View style={styles.selectedView}>
                        {
                            selectedData?.map((item, i) => (
                                <Pressable onPress={() => setSelectItem(item, 'unselect')} key={i} style={styles.chipsSelected}><Text style={styles.chipsSelectedText}>{item?.name || item?.city || item?.specialty || item?.cityWithState }</Text></Pressable>
                            ))
                        }
                    </View>
                }

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {
                        searchData?.length > 0 && <View style={styles.searchDatView}>
                            {
                                searchData?.map((item, i) => (
                                    <>
                                        {
                                            fieldName == 'skill' && <Pressable key={i} style={[styles.dropDownItem, selectedData?.find((item2) => item2?.skillID == item?.skillID)?.skillID && styles.dropDownSelected]} onPress={() => setSelectItem(item, 'search')}>
                                                <Text style={{ color: '#6F7482' }}>{item?.name || item?.city}</Text>
                                            </Pressable>
                                        }
                                        {
                                            fieldName == 'preferredLocation' && <Pressable key={i} style={[styles.dropDownItem, selectedData?.find((item2) => item2?.lmID == item?.lmID)?.lmID && styles.dropDownSelected]} onPress={() => setSelectItem(item, 'search')}>
                                                <Text style={{ color: '#6F7482' }}>{item?.name || item?.city}</Text>
                                            </Pressable>
                                        }
                                        {
                                            fieldName == 'cummonication' && <Pressable key={i} style={[styles.dropDownItem, selectedData?.find((item2) => item2?.name == item?.name)?.name && styles.dropDownSelected]} onPress={() => setSelectItem(item, 'search')}>
                                                <Text style={{ color: '#6F7482' }}>{item?.name || item?.city}</Text>
                                            </Pressable>
                                        }
                                        {
                                            fieldName == 'job role' && <Pressable key={i} style={[styles.dropDownItem, selectedData?.find((item2) => item2?.specialty == item?.specialty)?.specialty && styles.dropDownSelected]} onPress={() => setSelectItem(item, 'search')}>
                                                <Text style={{ color: '#6F7482' }}>{item?.specialty}</Text>
                                            </Pressable>
                                        }

                                        {
                                            fieldName == 'alert_preferredLocation' && <Pressable key={i} style={[styles.dropDownItem, selectedData?.find((item2) => item2?.cityWithState == item?.cityWithState)?.cityWithState && styles.dropDownSelected]} onPress={() => setSelectItem(item, 'search')}>
                                                <Text style={{ color: '#6F7482' }}>{item?.cityWithState}</Text>
                                            </Pressable>
                                        }
                                    </>
                                ))
                            }
                        </View>
                    }

                    {
                        searchData?.length == 0 && suggestionData?.length > 0 && <View style={styles.suggestionView}>
                            <Text style={styles.suggestionHeader}>Or select from suggested skills</Text>
                            <View style={styles.suggestionDataView}>
                                {
                                    suggestionData?.map((item, i) => (
                                        <Pressable key={i} onPress={() => setSelectItem(item, 'suggest')} style={styles.chipsNotSelected}><Text style={styles.chipsNotSelectedText}>{item?.name || item?.city}</Text></Pressable>
                                    ))
                                }
                            </View>
                        </View>
                    }

                </ScrollView>
                <Pressable onPress={() => {
                    setModalShow(false)
                    onSubmit(selectedData)
                }} style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                </Pressable>
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    searchInputView: {
        borderColor:  '#B8BCCA50',
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
        color: 'black'
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
        fontFamily: 'Poppins-Regular',
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
        fontFamily: 'Poppins-Regular',
    },
    submitBtnText: {
        color: 'white',
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Regular',
    },
    submitBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#395987',
        height: 45,
        width: 320,
        alignSelf: 'center',
        borderRadius: 10
    },
    selectedView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginTop: 10
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
    suggestionView: {
        marginTop: 10
    },
    suggestionHeader: {
        color: '#395987',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        marginLeft: 10
    },
    suggestionDataView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginTop: 10
    },
    dropDownItem: {
        color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingLeft: 5,
        marginTop: 5,
    },
    dropDownSelected: {
        backgroundColor: '#D9D9D9', color: '#6F7482',
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        borderBottomColor: '#E4EEF5',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingLeft: 5,
        borderRadius: 5,
        marginTop: 5,

    },
    searchDatView: {
        borderWidth: 1,
        borderColor: '#B8BCCA50',
        borderRadius: 10,
        padding: 10,
        marginTop: 15
    }
});