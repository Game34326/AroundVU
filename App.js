import {
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import OwnerScreen from './src/screens/OwnerScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DetailScreen from './src/screens/DetailScreen';
import AddApartment from './src/screens/AddApartment';
import SetOwners from './src/screens/SetOwners';
import SetApartments from './src/screens/SetApartments';
import MapScreen from './src/screens/MapScreen';
import SetMap from './src/screens/SetMap';
import ShowMap from './src/screens/ShowMap';
import * as React from 'react';
import { Provider, } from 'react-native-paper';
import OwnerDetail from './src/screens/OwnerDetail';

const Stack = createNativeStackNavigator();

function App() {
    return (
      
      <Provider>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false, 
          // navigationBarColor: '#E5DEAE'
          }}></Stack.Screen>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'เข้าสู่ระบบ',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#585554',
            },
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'สมัครสมาชิก',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#585554',
            },
          }}
        />

        <Stack.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            title: 'สำรวจหอพัก',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#585554',
            },
          }}></Stack.Screen>

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: 'ข้อมูลหอพัก',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#585554',
            },
          }}
        />
      <Stack.Screen
        name="Owners"
        component={OwnerScreen}
        options={{
          title: 'เจ้าของหอพัก',
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="AddApartment"
        component={AddApartment}
        options={{
          title: 'เพิ่มข้อมูลหอพัก',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
      <Stack.Screen
        name="SetOwners"
        component={SetOwners}
        options={{
          title: 'แก้ไขข้อมูลส่วนตัว',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
       <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'แผนที่',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#585554',
            },
          }}
        />
      <Stack.Screen
        name="SetApartment"
        component={SetApartments}
        options={{
          title: 'แก้ไขข้อมูลหอพัก',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
      <Stack.Screen
        name="OwnerDetail"
        component={OwnerDetail}
        options={{
          title: '',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
      <Stack.Screen
        name="SetMap"
        component={SetMap}
        options={{
          title: 'แผนที่',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
      <Stack.Screen
        name="ShowMap"
        component={ShowMap}
        options={{
          title: 'แผนที่',
          headerTintColor: '#fff',
          // headerBackVisible: false,
          headerStyle: {
            backgroundColor: '#585554',
          },
        }}
      />
    </Stack.Navigator>
    </Provider>
    
  );
};

export default () => {
  return(
    <NavigationContainer>
      <App />
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({});

// "scripts": {
  //   "android": "react-native run-android",
  //   "ios": "react-native run-ios",
  //   "start": "react-native start",
  //   "test": "jest",
  //   "lint": "eslint ."
  // },
