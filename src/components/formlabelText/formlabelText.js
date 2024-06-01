import { View, Text } from 'react-native'
import React from 'react'

export default function FormLabelText({title, CustomStyle, star = true}) {
  return (

      <Text style={[{fontFamily:'Poppins-SemiBold',fontSize:12,lineHeight:18,color:'#6F7482'}, CustomStyle]}>{title} <Text style={{ color: 'red' }}>{star && '*'}</Text></Text>
  )
}