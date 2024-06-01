import { View, Text } from 'react-native'
import React from 'react'

export default function ErrorText({customStyle, title, error}) {
  return (
    <Text style={[{color: "red",fontFamily: 'Poppins-Regular',fontSize: 11, marginTop: 10}, customStyle]}>{title || error}</Text>
  )
}