import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Swiper from 'react-native-swiper';
import Colors from '../components/Colors';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../Firebase';
import MapView, {Marker} from 'react-native-maps';
import haversine from 'haversine';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const convenienceIconMapping = {
  ไวไฟ: {name: 'wifi', size: 20, color: Colors.black},
  แอร์: {name: 'air-conditioner', size: 20, color: Colors.black},
  เตียง: {name: 'bed-empty', size: 20, color: Colors.black},
  พัดลม: {name: 'fan', size: 20, color: Colors.black},
  ตู้เย็น: {name: 'fridge-outline', size: 20, color: Colors.black},
  โซฟา: {name: 'sofa-outline', size: 20, color: Colors.black},
  โต๊ะ: {name: 'desk', size: 20, color: Colors.black},
  เครื่องทำน้ำอุ่น: {name: 'water-boiler', size: 20, color: Colors.black},
  โทรทัศน์: {name: 'television', size: 20, color: Colors.black},
  เครื่องซักผ้า: {name: 'washing-machine', size: 20, color: Colors.black},
  ไมโครเวฟ: {name: 'microwave', size: 20, color: Colors.black},
  ที่จอดรถยนต์: {name: 'car', size: 20, color: Colors.black},
  อ่างล้างมือ: {name: 'hand-wash-outline', size: 20, color: Colors.black},
  การซ่อมบำรุง: {name: 'wrench', size: 20, color: Colors.black},
  ตู้กดน้ำดื่ม: {name: 'cup-water', size: 20, color: Colors.black},
  ลิฟต์: {name: 'apps-box', size: 20, color: Colors.black},
};

const securityIconMapping = {
  กุญแจ: {name: 'key-variant', size: 20, color: Colors.black},
  คีย์การ์ด: {name: 'id-card', size: 20, color: Colors.black},
  แสกนนิ้ว: {name: 'fingerprint', size: 20, color: Colors.black},
  กล้องวงจรปิด: {name: 'cctv', size: 20, color: Colors.black},
  รปภ: {name: 'account-tie-hat', size: 20, color: Colors.black},
  ตาแมว: {name: 'eye-outline', size: 20, color: Colors.black},
  ระบบเตือนภัย: {name: 'fire-alert', size: 20, color: Colors.black},
  คนนอกห้ามเข้า: {name: 'account-off-outline', size: 20, color: Colors.black},
  แสงสว่าง: {name: 'lightbulb-on-outline', size: 20, color: Colors.black},
  ประตูรั้ว: {name: 'fence', size: 20, color: Colors.black},
};

const DetailScreen = ({navigation, route, userId}) => {
  const [swipingEnabled, setSwipingEnabled] = useState(true);
  const {item} = route.params;
  const [user, setUser] = useState({});
  const [distance, setDistance] = useState(null);

  // Fetch user data with the same ID as the apartment ID
  const fetchUser = async () => {
    const apartmentSnapshot = await getDoc(doc(db, 'apartments', item.id));
    const userId = apartmentSnapshot.data().User_ID;
    const userSnapshot = await getDoc(doc(db, 'users', userId));
    if (userSnapshot.exists()) {
      setUser(userSnapshot.data());
    } else {
      console.log("No document found in users collection with ID:", userId);
    }
  };
  
  useEffect(() => {
    fetchUser();
    if (latitude && longitude) {
      const start = {latitude: 15.001748, longitude: 102.118391};
      const end = {latitude, longitude};
      const dist = haversine(start, end, {unit: 'km'});
      setDistance(dist);
    }
  }, []);

  const handleSwiperIndexChange = () => {
    setSwipingEnabled(true);
  };

  const latitude = item.latitude;
  const longitude = item.longitude;

  function renderConvenienceItem(convenient, index) {
    const icon = convenienceIconMapping[convenient];
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 5,
          marginLeft: 10,
        }}>
        {icon && (
          <MaterialCommunityIcons
            name={icon.name}
            size={icon.size}
            color={icon.color}
          />
        )}
        <Text style={{marginLeft: 5, fontSize: 16, color: Colors.black}}>
          {convenient}
        </Text>
      </View>
    );
  }

  function renderSecurityItem(security, index) {
    const icon = securityIconMapping[security];
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 5,
          marginLeft: 10,
        }}>
        {icon && (
          <MaterialCommunityIcons
            name={icon.name}
            size={icon.size}
            color={icon.color}
          />
        )}
        <Text style={{marginLeft: 5, fontSize: 16, color: Colors.black}}>
          {security}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 300,
            borderRadius: 10,
            alignSelf: 'center',
          }}>
          <Swiper
            loadMinimal
            loadMinimalSize={1}
            autoplay={true}
            onIndexChanged={handleSwiperIndexChange}
            style={styles.wrapper}>
            {item.Apartment_Picture.map((image, index) => (
              <Image
                key={index}
                style={{width: Dimensions.get('window').width, height: 300}}
                source={{uri: image}}
              />
            ))}
          </Swiper>
        </View>

        <View style={styles.infoContainer}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              marginTop: 20,
            }}>
            <Text style={[styles.name, {width: '55%'}]}>
              {item.Apartment_Name}{' '}
            </Text>
            <Text
              style={[
                styles.prices,
                {color: item.Apartment_Room > 0 ? 'green' : 'red'},
              ]}>
              ฿{Number(item.Apartment_Price).toLocaleString()} บาท / เดือน
            </Text>
          </View>

          <View style={styles.profileImageContainer}>
            <View style={styles.detailText}>
              <Text style={{color: Colors.black, fontSize: 20}}>
                หอพักให้เช่าโดย{' '}
                <Text style={{fontWeight: 'bold'}}>{user?.Name}</Text>
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  marginTop: 5,
                  fontSize: 16,
                  textDecorationLine: 'underline',
                }}>
                ข้อมูลการติดต่อ
              </Text>
              <Text style={{color: Colors.black, marginTop: 3, fontSize: 16}}>
                อีเมล: {user?.Email}{' '}
              </Text>
              <Text style={{color: Colors.black, marginTop: 3, fontSize: 16}}>
                เบอร์โทรศัพท์: {user?.Phone}
              </Text>
              <View style={{flexWrap: 'wrap', marginTop: 5}}>
                {user?.Connect && (
                  <View>
                    <Text
                      style={{
                        color: Colors.black,
                        marginTop: 3,
                        fontSize: 16,
                        textDecorationLine: 'underline',
                      }}>
                      ข้อมูลการติดต่ออื่นๆ
                    </Text>
                    <Text style={{color: Colors.black, fontSize: 16}}>
                      {user.Connect}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Image style={styles.profileImage} source={{uri: user?.Profile}} />
          </View>

          {/* <View style={styles.line} /> */}
          <View style={styles.detailApartment}>
            <Text style={styles.history}>
              จำนวนการเข้าดูหอพัก : {item.clickCount}
            </Text>
            <Text style={styles.type}>ประเภทหอพัก : {item.Apartment_Type}</Text>
            <Text style={styles.detail}>
              รายละเอียดหอพัก: {item.Apartment_Detail}
            </Text>
          </View>

          {/* <View style={styles.line} /> */}

          <View style={styles.whiteBox}>
            <Text style={styles.headerText}>รายละเอียดค่าเช่าของหอพัก</Text>
            <Text style={styles.text}>
              รายละเอียดค่าน้ำ: {item.Apartment_Water}
            </Text>
            <Text style={styles.text}>
              รายละเอียดค่าไฟ: {item.Apartment_Light}{' '}
            </Text>
            <Text style={styles.text}>
              ค่าประกัน/มัดจำ: {item.Apartment_Contract}
            </Text>
            <Text style={styles.text}>
              ค่าใช้จ่ายแรกเข้า: {item.Apartment_FirstCome}
            </Text>
          </View>

          {/* <View style={styles.line} /> */}
          <View style={styles.whiteBox}>
            <Text style={styles.headerText}>รายละเอียดของห้องพัก</Text>
            <Text style={styles.text}>
              จำนวนห้องทั้งหมด: {item.Apartment_TotalRoom}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.text}>
                จำนวนห้องว่าง: {item.Apartment_Room}
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    marginRight: 10,
                    color: item.Apartment_Room > 0 ? 'green' : 'red',
                  },
                ]}>
                สถานะ: {item.Apartment_Room === 0 ? 'เต็ม' : 'ว่าง'}
              </Text>
            </View>
            <Text style={styles.text}>
              ขนาดของห้องพัก: {item.Apartment_Size} ตารางเมตร
            </Text>
          </View>

          {/* <View style={styles.line} /> */}

          {item.Apartment_Convenient &&
          Array.isArray(item.Apartment_Convenient) &&
          item.Apartment_Convenient.length > 0 ? (
            <View style={styles.whiteBox}>
              <Text style={styles.headerText}>บริการและสิ่งอำนวยความสะดวก</Text>
              {item.Apartment_Convenient.map(renderConvenienceItem)}
            </View>
          ) : null}

          {item.Apartment_Security &&
          Array.isArray(item.Apartment_Security) &&
          item.Apartment_Security.length > 0 ? (
            <View style={styles.whiteBox}>
              <Text style={styles.headerText}>ความปลอดภัยของหอพัก</Text>
              {item.Apartment_Security.map(renderSecurityItem)}
            </View>
          ) : null}

          <View style={{marginTop: 20}}>
            {latitude && longitude ? (
              <View>
                {distance != null ? (
                  <Text
                    style={{
                      color: Colors.black,
                      marginLeft: 10,
                      fontSize: 16,
                    }}>
                    หอพักอยู่ห่างจากมหาวิทยาลัยวงษ์ชวลิตกุล:{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.black,
                      }}>
                      {distance.toFixed(2)} km
                    </Text>
                  </Text>
                ) : null}
                <View>
                  <MapView
                    style={{
                      height: 300,
                      width: Dimensions.get('window').width,
                      alignSelf: 'center',
                      marginBottom: 50,
                      marginTop: 20,
                    }}
                    initialRegion={{
                      latitude,
                      longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}>
                    <Marker coordinate={{latitude, longitude}} />
                  </MapView>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFE8DF',
    height: '100%',
    width: '100%',
  },
  listCOntainer: {
    alignSelf: 'center',
    padding: 20,
    marginTop: 0,
    width: '100%',
  },
  list: {},
  line: {
    borderBottomColor: '#9C9C99',
    borderBottomWidth: 1,
    alignSelf: 'center',
    width: '95%',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginLeft: 10,
    backgroundColor: '#E5DEAE',
    marginTop: 15,
  },
  profileImageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 10,
  },
  detailText: {
    width: '65%',
  },
  detailApartment: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  userInfo: {},
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  name: {
    color: Colors.black,
    padding: 2,
    fontWeight: 'normal',
    fontSize: 26,
    marginLeft: 10,
  },
  type: {
    color: Colors.black,
    padding: 2,
    fontSize: 16,
  },
  history: {
    color: 'green',
    padding: 2,
    fontSize: 16,
  },
  detail: {
    color: Colors.black,
    padding: 2,
    fontSize: 16,
  },
  prices: {
    fontWeight: 'bold',
    padding: 2,
    fontSize: 20,
  },
  text: {
    marginLeft: 10,
    color: Colors.black,
    fontSize: 16,
    padding: 5,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    padding: 3,
    marginLeft: 10,
    color: Colors.black,
    fontWeight: 'bold',
  },
  whiteBox: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 15,
  },
});
