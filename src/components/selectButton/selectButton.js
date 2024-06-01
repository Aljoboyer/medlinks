import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function SelectButton({ title, placeHolder, onPressHandler, labelShow = true, selected }) {

    return (
        <View style={styles.inputView}>
            {
                labelShow && <Text style={styles.labelText}>{title}</Text>
            }
            <View style={styles.inputView}>
                <Pressable onPress={onPressHandler} style={styles.selectBtn}>
                    <Text style={[styles.selectText, {color: selected ? 'black' : '#B8BCCA'}]}>{selected || placeHolder}</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    selectBtn: {
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        borderRadius: 6,
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        marginTop: 10
    },
    selectBtnText: {
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        borderRadius: 6,
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        fontFamily: 'Poppins-Regular',
        fontSize: 14, lineHeight: 21,
        marginTop: 10
    },
    selectText: {
        fontSize: 14,
        // fontWeight: '400',
        fontFamily: 'Poppins-Regular',
    },
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-SemiBold',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5,
        marginTop: 10
    },
    inputView: {
        marginTop: 5
    },
});