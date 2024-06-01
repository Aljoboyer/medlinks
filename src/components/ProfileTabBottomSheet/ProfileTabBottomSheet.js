import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { BottomSheet } from "@rneui/themed";
import Entypo from 'react-native-vector-icons/Entypo';

export default function ProfileTabBottomSheet({ modalShow, setModalShow, title, children}) {

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
            {children}
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
        height: '60%',
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
        height: 55,
        margin: 20
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
        alignSelf: 'center',
        marginTop: 5
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