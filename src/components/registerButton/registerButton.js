import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function RegisterButton({customStyle, nextHandler, backHandler, isLoad, BackBtn = true}) {
  return (
    <View style={[styles.btnView, customStyle]}>
        {
            BackBtn && <Pressable onPress={backHandler} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        }
       
        {
            isLoad ?   <Pressable style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Saving...</Text>
        </Pressable> :   <Pressable onPress={nextHandler} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next</Text>
        </Pressable>
        }
      
    </View>
  )
}

const styles = StyleSheet.create({
    btnView:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 124,

      //shadow
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      
      elevation: 24,

        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        width: "100%",

    },
    backBtn:{
        height: 48,
        width: 155,
        borderWidth: 2,
        borderColor: '#395987',
        borderRadius:10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    nextBtn:{
        height: 48,
        width: 155,
        backgroundColor: '#395987',
        borderRadius:10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    nextBtnText:{
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    backBtnText:{
        fontSize: 12,
        color: '#395987',
        fontFamily: 'Poppins-Regular',
    }
});