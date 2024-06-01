import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function RegisterHeader({page}) {
  return (
   <View style={{height: 80,width: '100%',backgroundColor: '#395987'}}>
     <View style={styles.headerView}>
        <View>
           {
            page == 1 ?  <Image source={require('../../assets/iconImg/peopleSelected.png')} /> :  <Image source={require('../../assets/iconImg/successIcon.png')} />
           }
          
        </View>

        <Image source={require('../../assets/iconImg/RectangleIcon.png')} />

        <View>
           {
            page <= 2 ?  <Image source={require('../../assets/iconImg/suitCaseNonSelected.png')} /> :  <Image source={require('../../assets/iconImg/successIcon.png')} />
           }
           
        </View>

        <Image source={require('../../assets/iconImg/RectangleIcon.png')} />

        <View>
           {
            page <= 3 ?  <Image source={require('../../assets/iconImg/listNonSelected.png')} /> :  <Image source={require('../../assets/iconImg/successIcon.png')} />
           }
            
        </View>
    </View>

    <View style={styles.textView}>
      <Text style={[styles.headerText, {marginLeft: 15}]}>Education</Text>
      <Text style={styles.headerText}>Experience</Text>
      <Text style={[styles.headerText, {marginRight: 15}]}>Preferences</Text>
    </View>

   </View>
  )
}

const styles = StyleSheet.create({
    headerView:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    headerText:{
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: 'white',
      marginTop:5
    },
    textView:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
});