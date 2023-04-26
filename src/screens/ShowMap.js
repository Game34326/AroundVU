import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {db} from '../../Firebase';
import MapView, {Marker, Callout} from 'react-native-maps';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import Colors from '../components/Colors';
import haversine from 'haversine';
import customMarkerImage from '../assets/vu_marker3.png';
import {Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const ShowMap = ({navigation}) => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  

  const initialLocation = {
    latitude: 15.002378508699756, // Replace with your starting latitude
    longitude: 102.11759386584163, // Replace with your starting longitude
  };

  const getLocations = async () => {
    let result = [];
    const querySnapshot = await getDocs(collection(db, 'apartments'));
    querySnapshot.forEach(doc => {
      const data = doc.data();
      // Set the 'id' property to the document ID
      data.id = doc.id;
      result.push(data);
    });
    result.sort((a, b) => b.clickCount - a.clickCount);

    result.sort((a, b) => {
      if (a.Apartment_Room === 0 && b.Apartment_Room !== 0) {
        return 1;
      } else if (a.Apartment_Room !== 0 && b.Apartment_Room === 0) {
        return -1;
      } else {
        return 0;
      }
    });

    setMarkers([...result]);
    setRegion({
      latitude: 15.002378508699756,
      longitude: 102.11759386584163,
      latitudeDelta,
      longitudeDelta,
    });
    // console.log(...result)
  };

  useEffect(() => {
    getLocations();
  }, []);

  const handleItemClick = async (item, apartmentId) => {
    // console.log('Item clicked:', item, 'Apartment id:', apartmentId);
    // Increment the click count for the apartment
    const apartmentRef = doc(db, 'apartments', apartmentId);
    await updateDoc(apartmentRef, {
      clickCount: increment(1),
    });
    navigation.navigate('Detail', {item, apartmentId});
  };

  const go = (latitude, longitude, apartmentName) => {
    setRegion({
      ...region,
      latitude: latitude,
      longitude: longitude,
      apartmentName: apartmentName,
      showCallout: true, // Add a new flag to show the Callout
    });
  };
  

  const handleButtonPress = button => {
    if (selectedButton === button) {
      setSelectedButton(null); // deselect button
      setSelectedType('all');
    } else {
      setSelectedButton(button); // select button
      setSelectedType(button);
    }
  };

  const renderItem = ({item}) => {
    let itemDistance = null;
    if (item.latitude && item.longitude) {
      const start = {latitude: 15.001748, longitude: 102.118391};
      const end = {latitude: item.latitude, longitude: item.longitude};
      itemDistance = haversine(start, end, {unit: 'km'}).toFixed(2);
    }

    const isMatch = item.Apartment_Name.toLowerCase().includes(
      searchQuery.toLowerCase(),
    );

    if (searchQuery && !isMatch) {
      return null;
    }

    if (selectedType !== 'all' && item.Apartment_Type !== selectedType) {
      return null;
    }

    return (
      <View style={styles.listItem}>
        <Pressable onPress={() => go(item.latitude, item.longitude, item.id)}>
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 10,
              borderRadius: 20,
              flexDirection: 'row',
            }}>
            {item.Apartment_Picture.length > 0 && (
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                }}
                source={{uri: item.Apartment_Picture[0]}}
              />
            )}
            <View style={{marginLeft: 10}}>
              <Text
                style={{color: Colors.black, fontSize: 16, fontWeight: 'bold'}}>
                {item.Apartment_Name}
              </Text>
              <Text style={{color: Colors.gray, fontSize: 16}}>
                ประเภทหอพัก: {item.Apartment_Type}
              </Text>
              {itemDistance != null ? (
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 16,
                  }}>
                  ระยะทาง:
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: Colors.black,
                    }}>
                    {itemDistance} km
                  </Text>
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => handleItemClick(item, item.id)}
                style={styles.btnDetail}>
                <Text
                  style={{
                    color: item.Apartment_Room > 0 ? 'green' : 'red',
                    fontSize: 16,
                    textDecorationLine: 'underline',
                  }}>
                  ข้อมูลหอพัก
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {markers.length > 0 && region.latitude && region.longitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
            latitudeDelta,
            longitudeDelta,
          }}
          region={region}>
          <Marker
            coordinate={initialLocation}
            title="มหาวิทยาลัยวงษ์ชวลิตกุล"
            image={customMarkerImage}
            // pinColor='orange'
          >
            {/* <Image source={customMarkerImage} style={{width: 180, height:150,}} /> */}

            <Callout>
              <View>
                <Text style={{color: Colors.black}}>
                  มหาวิทยาลัยวงษ์ชวลิตกุล
                </Text>
              </View>
            </Callout>
          </Marker>
          
          {markers.map((item, index) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.Apartment_Name}>
              <Callout>
                <View>
                  <Text style={{color: Colors.detailText}}>
                    {item.Apartment_Name}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
      <View style={styles.searchbarCon}>
        <Searchbar
          style={styles.searchbar}
          placeholder="ค้นหาชื่อหอพัก..."
          placeholderTextColor={'grey'}
          fontSize={16}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <View style={styles.typeContainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => handleButtonPress('ชาย')}
              style={[
                styles.btnSelect,
                selectedButton === 'ชาย' && {
                  backgroundColor: Colors.bgButton,
                  borderRadius: 20,
                },
              ]}>
              <Text
                style={[
                  {flex: 1},
                  selectedButton === 'ชาย'
                    ? {color: 'white'}
                    : {color: 'black'},
                ]}>
                {'ชาย'}
              </Text>
              <MaterialCommunityIcons
                name="human-male"
                color={selectedButton === 'ชาย' ? Colors.white : Colors.black}
                size={22}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonPress('หญิง')}
              style={[
                styles.btnSelect,
                selectedButton === 'หญิง' && {
                  backgroundColor: Colors.bgButton,
                  borderRadius: 20,
                },
              ]}>
              <Text
                style={[
                  {flex: 1},
                  selectedButton === 'หญิง'
                    ? {color: 'white'}
                    : {color: 'black'},
                ]}>
                {'หญิง'}
              </Text>
              <MaterialCommunityIcons
                name="human-female"
                color={selectedButton === 'หญิง' ? Colors.white : Colors.black}
                size={22}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonPress('รวม')}
              style={[
                styles.btnSelect,
                selectedButton === 'รวม' && {
                  backgroundColor: Colors.bgButton,
                  borderRadius: 20,
                },
              ]}>
              <Text
                style={[
                  {flex: 1},
                  selectedButton === 'รวม'
                    ? {color: 'white'}
                    : {color: 'black'},
                ]}>
                {'รวม'}
              </Text>
              <MaterialCommunityIcons
                name="human-male-female"
                color={selectedButton === 'รวม' ? Colors.white : Colors.black}
                size={22}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.listView}>
        <FlatList
          data={markers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ShowMap;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchbarCon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  searchbar: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 0,
    width: '70%',
  },
  btnSelect: {
    padding: 5,
    backgroundColor: Colors.white,
    width: '20%',
    height: 55,
    borderRadius: 20,
    alignItems: 'center',
  },
  listView: {
    position: 'absolute', //อยู่ตรงไหนก็ได้ของหน้าจอ
    bottom: 5,
  },
  listItem: {
    padding: 5,
  },
  btnDetail: {
    alignSelf: 'center',
    marginTop: 5,
  },
});
