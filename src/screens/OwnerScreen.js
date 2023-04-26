import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import {signOut} from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../components/Colors';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import {auth, db} from '../../Firebase';
import {Menu, Divider} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import haversine from 'haversine';

const OwnerScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [aName, setAName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async currentUser => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data());
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const ReadAData = async () => {
    const apartmentRef = collection(db, 'apartments');
    const queryRef = query(
      apartmentRef,
      where('User_ID', '==', auth.currentUser.uid),
    );
    const apartmentSnapshot = await getDocs(queryRef);

    const apartmentData = apartmentSnapshot.docs.map(doc => ({
      apartmentId: doc.id,
      ...doc.data(),
    }));

    setAName(apartmentData);
  };

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
                  navigation.navigate('SetOwners');
                }}
                title="แก้ไขข้อมูลส่วนตัว"
              />
              {/* <Menu.Item
                onPress={async () => {
                  const apartmentRef = doc(
                    db,
                    'apartments',
                    auth.currentUser.uid,
                  );
                  const apartmentSnap = await getDoc(apartmentRef);
                  if (!apartmentSnap.exists()) {
                    handleMenuItemPress();
                    Alert.alert(
                      'ไม่มีข้อมูลหอพัก',
                      'คุณต้องเพิ่มข้อมูลหอพักก่อนทำการแก้ไข',
                      [
                        {
                          text: 'ตกลง',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else {
                    handleMenuItemPress();
                    navigation.navigate('SetApartment');
                  }
                }}
                title="แก้ไขข้อมูลหอพัก"
              /> */}
              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  navigation.navigate('AddApartment');
                }}
                title="เพิ่มข้อมูลหอพัก"
              />
              <Divider bold={true} />
              <Menu.Item
                onPress={() => {
                  Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
                    {
                      text: 'ไม่',
                      style: 'cancel',
                    },
                    {
                      text: 'ใช่',
                      onPress: () => {
                        handleMenuItemPress();
                        logout();
                      },
                    },
                  ]);
                }}
                title="ออกจากระบบ"
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

    const logout = () => {
      signOut(auth)
        .then(() => {
          alert('ออกจากระบบแล้ว');
          navigation.replace('Home');
        })
        .catch(error => {
          // An error happened.
        });
    };
  }, []);

  useEffect(() => {
    ReadAData();
  }, []);

  const start = {latitude: 15.001748, longitude: 102.118391};

  const itemDistance = (latitude, longitude) => {
    const end = {latitude, longitude};
    const distance = haversine(start, end, {unit: 'km'}).toFixed(2);
    return distance;
  };

  const handleItemClick = async (item, apartmentId) => {
    // console.log('Item clicked:', item, 'Apartment id:', apartmentId);
    navigation.navigate('OwnerDetail', {item, apartmentId});
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <Image style={styles.profileImage} source={{uri: name.Profile}} />
          <View style={styles.detailText}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Colors.black,
                padding: 5,
              }}>
              {name.Name}
            </Text>
            <Text style={{color: Colors.black, padding: 5, fontSize: 16}}>
              อีเมล: {auth.currentUser?.email}{' '}
            </Text>
            <Text style={{color: Colors.black, padding: 5, fontSize: 16}}>
              เบอร์โทรศัพท์: {name.Phone}
            </Text>
            {name.Connect && (
              <Text style={{color: Colors.black, padding: 5, fontSize: 16}}>
                ข้อมูลการติดต่อ: {name.Connect}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.listCOntainer}>
          <View>
            {aName && aName.length > 0 ? (
              <View>
                {aName.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      height: 430,
                      borderRadius: 10,
                    }}>

                    <Swiper
                      loadMinimal
                      loadMinimalSize={1}
                      // index={0}
                      style={styles.wrapper}>
                      {item.Apartment_Picture.length !== 0 &&
                        item.Apartment_Picture.map((image, index) => (
                          <Pressable
                            style={{borderRadius: 10}}
                            key={index}
                            onPress={() => handleItemClick(item, item.apartmentId)}>
                            <Image
                              key={index}
                              style={{
                                width: '100%',
                                height: 300,
                                borderRadius: 10,
                                alignSelf: 'center',
                              }}
                              source={{uri: image}}
                            />
                          </Pressable>
                        ))}
                    </Swiper>
                    <View key={item.id} style={{marginLeft: 10}}>
                      <TouchableOpacity
                        onPress={() => handleItemClick(item, item.apartmentId)}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.name}>
                            ชื่อหอพัก{' '}
                            <Text style={{fontWeight: 'bold'}}>
                              {item.Apartment_Name}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              color: item.Apartment_Room > 0 ? 'green' : 'red',
                              fontSize: 16,
                              textDecorationLine: 'underline',
                              marginRight: 20,
                            }}>
                            {item.Apartment_Room === 0 ? 'เต็ม' : 'ว่าง'}
                          </Text>
                        </View>
                        <Text style={styles.type}>
                          ประเภทหอพัก {item.Apartment_Type}
                        </Text>
                        {itemDistance != null ? (
                          <Text
                            style={{
                              color: Colors.detailText,
                              fontSize: 16,
                            }}>
                            ห่างจากมหาวิทยาลัยวงษ์ชวลิตกุล{' '}
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: Colors.black,
                              }}>
                              {itemDistance(item.latitude, item.longitude)} km
                            </Text>
                          </Text>
                        ) : null}
                        <Text style={styles.prices}>
                          ฿{Number(item.Apartment_Price).toLocaleString()}{' '}
                          บาท/เดือน
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.line} />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => navigation.push('AddApartment')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons name="add-business" size={50} color="gray" />
              <Text style={{marginLeft: 10, color: 'gray'}}>
                เพิ่มข้อมูลหอพัก
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
      </ScrollView>
    </View>
  );
};

export default OwnerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE8DF',
  },
  profileImageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginLeft: 10,
    backgroundColor: '#E5DEAE',
    marginTop: 10,
  },
  formContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  detailText: {
    fontSize: 16,
    marginTop: 5,
    flex: 1,
    marginLeft: 20,
  },
  text: {
    marginLeft: 10,
    color: Colors.black,
    fontSize: 16,
    padding: 5,
  },
  listCOntainer: {
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    borderRadius: 10,
    height: 300,
    justifyContent: 'center',
    marginTop: 30,
  },
  line: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: '#9C9C99',
    borderBottomWidth: 1,
    alignSelf: 'center',
    width: '100%',
  },
  textCon: {
    marginTop: 20,
    color: Colors.black,
    padding: 3,
    fontSize: 16,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    padding: 3,
    color: 'green',
  },
  name: {
    fontWeight: 'bold',
    color: Colors.black,
    padding: 3,
    fontSize: 16,
  },
  type: {
    color: Colors.black,
    padding: 3,
    fontSize: 16,
  },
  detail: {
    maxWidth: 250,
    color: Colors.black,
    padding: 3,
    fontSize: 16,
  },
  prices: {
    fontWeight: 'bold',
    color: Colors.black,
    padding: 3,
    fontSize: 16,
  },
  clickCount: {
    color: 'green',
    padding: 3,
    fontSize: 16,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  btn: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#585554',
    color: '#fff',
  },
  // appbar: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // }
});
