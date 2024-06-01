import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';

export default function MultiSelectButton({selectedArr, title, placeHolder, onPressHandler, setSelectItem}) {
  return (
   <View>
        {
        selectedArr?.length == 0 ? <View style={styles.inputView}>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable onPress={onPressHandler} style={styles.selectBtn}>
            <Text style={styles.selectText}>{placeHolder}</Text>
        </Pressable>
        </View> : 
    <View style={styles.inputView}>
        <Text style={styles.labelText}>{title}</Text>
           <View style={styles.selectArrBox}>
                <View style={styles.chipBox}>
                    {
                        selectedArr?.map((item, i) => (
                            <Pressable onPress={() => setSelectItem(item, 'unselect')} key={i} style={styles.chipsSelected}>
                            <Text style={styles.chipsSelectedText}>{item?.name}</Text>
                        </Pressable>
                        ))
                    }
                </View>
                <Pressable onPress={onPressHandler}>
                     <Entypo color="#6F7482" name="plus" size={24} />
                </Pressable>
            </View>
        </View> 
        }
   </View>
  )
}

const styles = StyleSheet.create({
    selectBtn:{
        borderColor: '#B8BCCA50',
        borderWidth: 1,
        borderRadius: 10,
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:  15,
        marginTop: 10
    },
    selectText:{
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'gray'
    },
    labelText:{
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#6F7482',
        lineHeight: 18,
        marginLeft: 5
    },
    inputView:{
        marginTop: 20
    },
    selectArrBox:{
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        // height: 45,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft:  15,
        marginTop: 10,
        paddingRight: 10,
        paddingVertical: 10
    },
    chipsSelected:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginLeft: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        marginRight: 5,
        backgroundColor: '#395987'
    },
    chipsSelectedText:{
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    chipBox:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: 300,
    }
});