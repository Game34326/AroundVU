import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../components/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
import {Avatar, TextInput, Menu, Divider} from 'react-native-paper';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import {db, auth, storage} from '../../Firebase';
import Apploader from '../components/Apploader';
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';

const SetOwners = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [flname, setflname] = useState(null);
  const [tel, setTel] = useState(null);
  const [connect, setConnect] = useState(null);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ReadData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setflname(docSnap.data().Name);
        setTel(docSnap.data().Phone);
        setPicture(docSnap.data().Profile);
        setConnect(docSnap.data().Connect);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    };
    ReadData();
  }, []);

  useEffect(() => {
    const CustomMenu = () => {
      const [showMenu, setShowMenu] = useState(false);

      const handleMenuItemPress = () => {
        setShowMenu(false);
      };

      return (
        <View style={{marginBottom: 10}}>
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => setShowMenu(true)}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  style={{color: 'white'}}
                />
              </TouchableOpacity>
            }>
            <View>
              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  navigation.navigate('Home');
                }}
                title="หน้าแรก"
              />

              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  navigation.navigate('Owners');
                }}
                title="หน้าเจ้าของหอพัก"
              />

              <Divider bold={true} />

              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  Alert.alert(
                    'ลบบัญชีผู้ใช้',
                    'คุณต้องการลบบัญชีผู้ใช้หรือไม่?',
                    [
                      {
                        text: 'ไม่',
                        style: 'cancel',
                      },
                      {
                        text: 'ใช่',
                        onPress: async () => {
                          handleMenuItemPress();
                          setLoading(true);
                          try {
                            // Delete apartments data associated with the user
                            const apartmentsRef = collection(
                              db,
                              'users',
                              auth.currentUser.uid,
                              'apartments',
                            );
                            const apartmentsQuerySnapshot = await getDocs(
                              apartmentsRef,
                            );
                            const apartmentsBatch = writeBatch(db);

                            // Delete each apartment document in the user's subcollection
                            apartmentsQuerySnapshot.forEach(apartmentDoc => {
                              apartmentsBatch.delete(apartmentDoc.ref);
                            });

                            await apartmentsBatch.commit();

                            // Delete user's document in users collection
                            await deleteDoc(
                              doc(
                                collection(db, 'users'),
                                auth.currentUser.uid,
                              ),
                            );

                            // Delete user's document in apartments collection
                            const apartmentsCollectionRef = collection(
                              db,
                              'apartments',
                            );
                            const apartmentsCollectionQueryRef = query(
                              apartmentsCollectionRef,
                              where('User_ID', '==', auth.currentUser.uid),
                            );
                            const apartmentsCollectionQuerySnapshot =
                              await getDocs(apartmentsCollectionQueryRef);
                            const apartmentsCollectionBatch = writeBatch(db);

                            // Delete each apartment document in the apartments collection that matches the user's ID
                            apartmentsCollectionQuerySnapshot.forEach(
                              apartmentDoc => {
                                apartmentsCollectionBatch.delete(
                                  apartmentDoc.ref,
                                );
                              },
                            );

                            await apartmentsCollectionBatch.commit();

                            // Delete user's authentication data
                            const user = auth.currentUser;
                            await user.delete();

                            // Navigate to home screen
                            navigation.replace('Home');
                          } catch (error) {
                            // Handle error
                            console.error(
                              'Error deleting user and apartments data: ',
                              error,
                            );
                          }
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}
                title="ลบบัญชีผู้ใช้"
                titleStyle={{color: 'red'}}
              />
            </View>
          </Menu>
        </View>
      );
    };

    navigation.setOptions({
      headerRight: () => <CustomMenu />,
      headerStyle: {
        backgroundColor: '#585554',
      },
    });
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!flname) {
      newErrors.flname = 'กรุณากรอกชื่อ - นามสกุล';
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

  const imagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (validateForm()) {
      Alert.alert(
        'ยืนยันการแก้ไข',
        'คุณต้องการแก้ไขข้อมูลส่วนตัว ?',
        [
          {text: 'ไม่', style: 'cancel'},
          {
            text: 'ใช่',
            onPress: async () => {
              setLoading(true);
              if (!image) {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(docRef, {
                  Name: flname,
                  Phone: tel,
                  Connect: connect,
                })
                  .then(() => {
                    setLoading(false);
                    alert('แก้ไขข้อมูลสำเร็จ');
                    navigation.replace('Owners');
                  })
                  .catch(error => {
                    setLoading(false);
                    alert(error.message);
                  });
              } else {
                const response = await fetch(image);
                const imageBlob = await response.blob();

                const storageRef = ref(storage, 'Profiles/' + Date.now());

                await uploadBytes(storageRef, imageBlob).then(
                  async snapshot => {
                    await getDownloadURL(snapshot.ref).then(
                      async downloadUrl => {
                        const docRef = doc(db, 'users', auth.currentUser.uid);
                        await updateDoc(docRef, {
                          Name: flname,
                          Phone: tel,
                          Profile: downloadUrl,
                        })
                          .then(() => {
                            setLoading(false);
                            alert('แก้ไขข้อมูลสำเร็จ');
                            navigation.replace('Owners');
                          })
                          .catch(error => {
                            setLoading(false);
                            alert(error.message);
                          });
                      },
                    );
                  },
                );
              }
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}> แก้ไขข้อมูลส่วนตัว </Text>
        <Text
          style={{
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: Colors.detailText,
            fontSize: 16,
          }}>
          {' '}
          ข้อมูลส่วนตัว{' '}
        </Text>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}
          onPress={() => imagePicker()}>
          {image == null ? (
            <Avatar.Image
              size={100}
              source={{uri: picture}}
              style={{backgroundColor: Colors.brown}}
            />
          ) : (
            <Avatar.Image
              size={100}
              source={{uri: image}}
              style={{backgroundColor: Colors.brown}}
            />
          )}
        </TouchableOpacity>
        <KeyboardAvoidingView>
          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ชื่อผู้ใช้"
              value={flname}
              onChangeText={text => setflname(text)}
              left={<TextInput.Icon icon="account" />}
            />
          </View>
          {errors.flname && <Text style={styles.errors}>{errors.flname}</Text>}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="เบอร์โทรศัพท์"
              onChangeText={text => setTel(text)}
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
        </KeyboardAvoidingView>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={handleUpdateProfile}>
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
      </ScrollView>
      {loading ? <Apploader /> : null}
    </View>
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

export default SetOwners;
