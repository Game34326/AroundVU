import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput, Avatar} from 'react-native-paper';
import {auth, db, storage} from '../../Firebase';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc} from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';
import Colors from '../components/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
import Apploader from '../components/Apploader';

const RegisterForm = ({navigation}) => {
  //User Information
  const [image, setImage] = useState(null);
  const [flname, setflname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hcPassword, setHcPassword] = useState(true);
  const [tel, setTel] = useState('');
  const [connect, setConnect] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const registerWithImage = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
  
        if (!image) {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            Name: flname,
            Email: email,
            Phone: tel,
            Connect: connect,
          })
          setLoading(false);
          alert('สมัครสมาชิกสำเร็จ');
        } else {
          const response = await fetch(image);
          const imageBlob = await response.blob();
  
          const storageRef = ref(storage, 'Profiles/' + Date.now());
  
          const snapshot = await uploadBytes(storageRef, imageBlob);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            Name: flname,
            Email: email,
            Phone: tel,
            Connect: connect,
            Profile: downloadUrl,
          });
          setLoading(false);
          alert('สมัครสมาชิกสำเร็จ');
          navigation.replace('Owners');
        }
      } catch (error) {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          alert('อีเมล์นี้มีอยู่ในระบบแล้ว');
        } else {
          alert(error.message);
        }
      }
    }
  };
  

  const imagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel) {
      setImage(result.assets[0].uri);
    }
  };

  function validateForm() {
    const newErrors = {};

    if (!flname) {
      newErrors.flname = 'กรุณากรอกชื่อผู้ใช้';
    }
    if (!email) {
      newErrors.email = 'กรุณากรอกอีเมลล์';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลล์ไม่ถูกต้อง';
    }
    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (password.length < 8) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    }
    if (password !== conPassword) {
      newErrors.conPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    if (!tel) {
      newErrors.tel = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (
      !/^\(?([0]{1})\)?[-. ]?([6,8,9]{1})[-. ]?([0-9]{8})$/.test(tel)
    ) {
      newErrors.tel = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.headerText}> สมัครสมาชิกเจ้าของหอพัก </Text>
          <Text style={{textAlign: 'center', textDecorationLine: 'underline', fontSize: 16, color: Colors.detailText,}}>
            {' '}
            ข้อมูลส่วนตัว{' '}
          </Text>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginTop: 20,
              alignItems: 'center',
            }}
            onPress={imagePicker}>
            {image !== null ? (
              <Avatar.Image
                size={100}
                source={{uri: image}}
                style={{backgroundColor: Colors.brown}}
              />
            ) : (
              <Avatar.Icon
                size={100}
                icon="account-circle-outline"
                style={{backgroundColor: Colors.brown}}
              />
            )}
          </TouchableOpacity>
          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ชื่อผู้ใช้"
              onChangeText={flname => setflname(flname)}
              value={flname}
              left={<TextInput.Icon icon="account" />}
            />
          </View>
          {errors.flname && <Text style={styles.errors}>{errors.flname}</Text>}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="อีเมล"
              onChangeText={email => setEmail(email)}
              value={email}
              left={<TextInput.Icon icon="email" />}
            />
          </View>
          {errors.email && <Text style={styles.errors}>{errors.email}</Text>}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="รหัสผ่าน"
              secureTextEntry={hidePassword}
              onChangeText={password => setPassword(password)}
              value={password}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={hidePassword ? 'eye' : 'eye-off'}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
            />
          </View>
          {errors.password && (
            <Text style={styles.errors}>{errors.password}</Text>
          )}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ยืนยันรหัสผ่าน"
              secureTextEntry={hcPassword}
              onChangeText={conPassword => setConPassword(conPassword)}
              value={conPassword}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={hcPassword ? 'eye' : 'eye-off'}
                  onPress={() => setHcPassword(!hcPassword)}
                />
              }
            />
          </View>
          {errors.conPassword && (
            <Text style={styles.errors}>{errors.conPassword}</Text>
          )}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="เบอร์โทรศัพท์"
              onChangeText={tel => setTel(tel)}
              value={tel}
              left={<TextInput.Icon icon="phone" />}
            />
          </View>
          {errors.tel && <Text style={styles.errors}>{errors.tel}</Text>}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ข้อมูลการติดต่ออื่นๆ..."
              onChangeText={text => setConnect(text)}
              value={connect}
              left={<TextInput.Icon icon="earth-plus" />}
              numberOfLines={4}
              multiline={true}
            />
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={registerWithImage}>
              <View style={styles.btn1}>
                <AntDesign name="save" size={22} color={Colors.white} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: Colors.white,
                  }}>
                  บันทึก
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading ? <Apploader /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8CCB6',
    height: '100%',
  },
  headerText: {
    marginTop: 50,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '70%',
    backgroundColor: '#F6F1F1',
    borderRadius: 10,
    padding: 5,
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 16,
  },

  errors: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    color: '#FA0606',
    alignSelf: 'center',
    fontSize: 16,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  btn1: {
    height: 60,
    width: '80%',
    marginTop: 30,
    borderRadius: 20,
    backgroundColor: '#6C6357',
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginRight: 20,
    flexDirection: 'row',
  },
});

export default RegisterForm;
