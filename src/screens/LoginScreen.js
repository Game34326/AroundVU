import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {auth} from '../../Firebase';
import {signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged} from 'firebase/auth';
import { TextInput } from 'react-native-paper';
import Apploader from '../components/Apploader';
import Colors from '../components/Colors';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = () => { 
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        alert('เข้าสู่ระบบสำเร็จ');
        navigation.replace('Owners');
      })
      .catch(error => {
        setLoading(false);
        alert("อีเมลล์หรือรหัสผ่านไม่ถูกต้อง")
      });
  };

  const resetPassword = () =>{

    if(email != null){
      sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        alert("คำขอเปลี่ยนรหัสผ่านถูกส่งไปยังอีเมลล์แล้ว")
      }).catch((error) => {
        alert('กรุณากรอกอีเมลล์ของคุณ')
      })
    }
    else{
      alert("กรุณากรอกอีเมลล์ของคุณ")
    }
  }

  useEffect (() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Owners");  
      } 
    });
  }, []);

  return (
    <>
    <ScrollView showsVerticalScrollIndicator={false}  style={styles.container}>
    <View>
      <Image
        source={ require('../assets/iconLogin1.png') }
        style={styles.icon}
      />
      <Text style={styles.headerText}>เข้าสู่ระบบเจ้าของหอพัก</Text>
      <KeyboardAvoidingView>
        <View style={styles.input}>
          
          <TextInput
            style={{backgroundColor: '#F6F1F1', color: Colors.black}}
            placeholder="อีเมล"
            value={email}
            onChangeText={text => setEmail(text)}
            left={
              <TextInput.Icon icon="email" />
            }
          />
        </View>

        <View style={styles.input}>
          <TextInput
            style={{backgroundColor: '#F6F1F1', color: Colors.black}}
            placeholder="รหัสผ่าน"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={hidePassword}
            left={
              <TextInput.Icon icon="lock" />
            }
            right={<TextInput.Icon 
              icon={hidePassword ? 'eye' : 'eye-off'}
              onPress={() => setHidePassword(!hidePassword)} 
            
              />}
          />
        </View>
        <View style={{width: '83%', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ width:'30%', alignSelf: 'flex-end'}}  onPress={resetPassword} >
        <Text
          style={{
            textDecorationLine: 'underline',
            color: '#000',
            fontSize: 16,
            fontWeight: 'regular',
            marginTop: 10,
            textAlign: 'right',
            justifyContent: 'flex-end'
          }}
          >
          ลืมรหัสผ่าน?
        </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading ? (<ActivityIndicator size="large" /> ): (
        <TouchableOpacity 
        style={{alignSelf: 'center', width: '70%', }}
        onPress={login}>
        <View style={styles.btn}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: Colors.white}}>
            เข้าสู่ระบบ
          </Text>
        </View>
      </TouchableOpacity>
      )}
      <View style={styles.register}>
        <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
          ยังไม่มีบัญชี ?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.push('Register')} >
        <Text
          style={{
            textDecorationLine: 'underline',
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          >
          สมัครสมาชิกเจ้าของหอพัก
        </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8CCB6',
    height: '100%',
  },
  headerText: {
    marginTop: 10,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: 200,
    height: 200,
  },
  input: {
    width: '70%',
    backgroundColor: '#F6F1F1',
    borderRadius: 10,
    padding: 5,
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 16,
    color: Colors.black,
  },
  inputHide: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '70%',
    backgroundColor: '#F6F1F1',
    borderRadius: 10,
    padding: 5,
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 16,
    flexDirection: 'row',
  },
  register: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  btn: {
    alignSelf: 'center',
    height: 60,
    width: '100%',
    marginTop: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6C6357',
  },
  eye: {},
});
