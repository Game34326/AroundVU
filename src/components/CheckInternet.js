import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import Colors from './Colors';

const CheckInternet = ({connected, setConnected}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setConnected(state.isConnected);
    });

    // Unsubscribe
    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnected = () => {
    NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      setConnected(state.isConnected);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image
          source={require('../assets/no-conexion1.png')}
          style={styles.image}
        />
        <Text style={styles.message}>
          {connected == true ? '' : 'ไม่มีอินเตอร์เน็ต กรุณาลองอีกครั้ง'}
        </Text>
        <TouchableOpacity
          style={styles.refresh}
          onPress={() => {
            checkConnected();
          }}>
          <Text style={styles.text}>ลองอีกครั้ง</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 150,
  },
  message: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  refresh: {
    backgroundColor: '#6C6357',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: 200,
    height: 50,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.white,
  },
});
