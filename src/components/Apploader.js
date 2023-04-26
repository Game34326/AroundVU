import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lottie  from 'lottie-react-native'
import Colors from './Colors'

const Apploader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]} >
      <Lottie  source={require('../assets/135627-loading-golden-dots.json')} autoPlay loop  />
    </View>
  )
}

export default Apploader

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
       backgroundColor: 'rgba(0,0,0,0.3)',
       
    }
})