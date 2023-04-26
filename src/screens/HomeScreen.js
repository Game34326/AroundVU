import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import WavyHeader from '../components/WavyHeader' 
import AntDesign from 'react-native-vector-icons/AntDesign';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/Colors';

const HomeScreen = ({navigation}) => {
  return (
    
    <View style={styles.container}>
        <ScrollView>
      <WavyHeader customStyles={styles.svgCurve} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Around <Text style={{color: '#C36C04'}} >VU</Text></Text>
      </View>
      <View style={styles.imgContainer}>
      <Image source={require('../assets/13_mk1yaa.webp')}
        style={styles.img1}
      />
      <Image source={require('../assets/legacyflats.3fae1c2e-35b7-474e-9c13-38ffeaf92b4d.jpg')}
        style={styles.img2}
      />
      </View>
            <TouchableOpacity
              onPress={() => navigation.push('Explore')}
              style={{width: '70%', alignSelf: 'center'}}>
              <View style={styles.btn}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color: Colors.white }}>
                  <MaterialCommunityIcons name='home-search-outline' color={Colors.white} size={22}/>
                  Explore
                </Text>
                <Text style={{fontSize:16, fontWeight: 'bold', color: '#2F1605', textDecorationLine: 'underline' }}>สำรวจหอพัก</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => navigation.push('Login')}
              style={{width: '70%', alignSelf: 'center'}}>
              <View style={styles.btn1}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color: Colors.white}}>
                  <AntDesign name='addusergroup' color={Colors.white} size={22}/>
                  For Owners
                </Text>
                <Text style={{fontSize:16, fontWeight: 'bold', color: '#2F1605', textDecorationLine: 'underline'}}>สำหรับเจ้าของหอพัก</Text>
              </View>
          </TouchableOpacity>
          </ScrollView>
          </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EFE8DF'

  },
  headerContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#F9F2C8',
    textAlign: 'right',
    marginTop: 35,
    
  },
  btn: {
    alignSelf: 'center',
    height: 60,
    width:'100%',
    marginTop: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A4A49A',
  },
  btn1: {
    alignSelf: 'center',
    height: 60,
    width: '100%',
    marginTop: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A4A49A',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly' ,
  },
  img1 :{
    borderRadius:80, 
    height:160, 
    width:160, 
    marginTop:60, 
    marginLeft:20, 
    
  },
  img2: {
    borderRadius:150, 
    height:250, 
    width:250, 
    
    padding: 10,
    marginTop: 130,
  }
})