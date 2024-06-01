import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function TextBoxes({editable=true, title,maxLength,keyboardType = 'default', placeHolder,defaultValue, extra, iconname, colorshade, value, onChangeText, error }) {
    const [hidePassword, setHidePassword] = useState(true)
    const [active, setActive] = useState(false)
    return (
        <View style={styles.inputView}>
           {title &&  <Text style={styles.labelText}>{title}</Text>}
            {extra == false ? <TextInput onFocus={() => setActive(true)} onBlur={() => setActive(false)}
                value={value}
                maxLength={maxLength}
                onChangeText={onChangeText}
                defaultValue={defaultValue}
                keyboardType={keyboardType}
                editable={editable}
                underlineColorAndroid='transparent' style={{
                    borderColor: active ? '#395987' : '#B8BCCA50',
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 40,
                    // display: 'flex',
                    // flexDirection: 'row',
                    // alignItems: 'center',
                    paddingLeft: 15,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 13.5, lineHeight: 21,
                    marginTop: 10,
                    color: 'black',
                    textAlignVertical:'center',
                    alignContent:'center'
                }} placeholder={placeHolder} placeholderTextColor={'#B8BCCA'}>

            </TextInput> :
                <View style={{
                    borderColor: active ? '#395987' : '#B8BCCA50',
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 45,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 15,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14, lineHeight: 21,
                    marginTop: 10,

                }}>

                    <TextInput
                        autoCorrect={false}
                        placeholder={placeHolder}
                        keyboardType='default'
                        onFocus={() => setActive(true)} onBlur={() => setActive(false)}
                        // onChangeText={() => onChangeText()}
                        value={value}
                        defaultValue={defaultValue}
                        secureTextEntry={hidePassword ? true :false}
                        onChangeText={onChangeText}
                        // autoCapitalize={'words'}
                        style={{ flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21, color: 'black' }}
                        placeholderTextColor="#BBBCCA"
                    />
                    <View style={{ width: wp('10%'), flexDirection: 'row' }}>
                        <View style={{ height: hp('5%'), width: wp('10%'), alignItems: 'center', justifyContent: 'center' }}>
                            {iconname === "eye" ?
                                <TouchableOpacity style={{
                                    // position: 'absolute',
                                    right: 7,
                                    bottom: 2
                                }} onPress={() => setHidePassword(!hidePassword)}>
                                    {hidePassword ? (
                                        <Ionicons name="eye-off" size={22} color="#395987" />
                                    ) : (
                                        <Ionicons name="eye" size={22} color="#395987" />
                                    )}
                                </TouchableOpacity> :
                                <Ionicons name={iconname} size={22} color={colorshade} />
                            }
                        </View>
                    </View>
                </View>}
            {error && <Text style={[{ fontSize: 10, fontWeight: '400', color: 'red', fontFamily: "Poppins-Regular", marginTop: 10 }]}>{error}</Text>}
        </View>
    )
}



const styles = StyleSheet.create({

    selectText: {
        fontSize: 14,
        // fontWeight: '400',
        fontFamily: 'Poppins-Regular',
        color: '#B8BCCA'
    },
    labelText: {
        fontSize: 14,
        // fontWeight: '700',
        fontFamily: 'Poppins-Medium',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    inputView: {
        marginTop: 18
    },
});