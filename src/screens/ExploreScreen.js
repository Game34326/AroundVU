import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  updateDoc,
  collection,
  getDocs,
  increment,
  doc,
} from 'firebase/firestore';
import {Searchbar} from 'react-native-paper';
import haversine from 'haversine';
import {db} from '../../Firebase';
import Colors from '../components/Colors';
import Swiper from 'react-native-swiper';
import Apploader from '../components/Apploader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckInternet from '../components/CheckInternet';

const ExploreScreen = ({navigation}) => {
  const [name, setName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [swipingEnabled, setSwipingEnabled] = useState(true);
  const onChangeSearch = query => setSearchQuery(query);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showType, setShowType] = useState(false);
  const [showRangePrice, setShowRangePrice] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showIcon, setShowIcon] = useState(false);
  const [connected, setConnected] = useState(false);

  const getUsers = async () => {
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

    setName([...result]);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleItemClick = async (item, apartmentId) => {
    // console.log('Item clicked:', item, 'Apartment id:', apartmentId);
    setSwipingEnabled(false);
    // Increment the click count for the apartment
    const apartmentRef = doc(db, 'apartments', apartmentId);
    await updateDoc(apartmentRef, {
      clickCount: increment(1),
    });
    setTimeout(() => {
      setSwipingEnabled(true), 500;
    });
    navigation.navigate('Detail', {item, apartmentId});
  };

  const handleSwiperIndexChange = () => {
    // console.log("handleSwiperIndexChange called");
    setSwipingEnabled(true);
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

  const handleFilterButtonClick = () => {
    setShowRangePrice(!showRangePrice);
    setShowType(!showType);
    setShowIcon(!showIcon);
  };

  const handlePriceRangeChange = values => {
    setPriceRange(values);
  };

  const renderItem = ({item, index, apartmentId}) => {
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

    if (
      priceRange[0] > item.Apartment_Price ||
      priceRange[1] < item.Apartment_Price
    ) {
      return null;
    }

    return (
      <View key={index}>
        {item.Apartment_Picture && item.Apartment_Picture.length > 0 && (
          <View
            style={{
              width: '100%',
              height: 300,
              borderRadius: 10,
            }}>
            <Swiper
              loadMinimal
              loadMinimalSize={1}
              onIndexChanged={handleSwiperIndexChange}
              style={styles.wrapper}>
              {item.Apartment_Picture.map((image, index) => (
                <Pressable
                  style={{borderRadius: 10}}
                  key={index}
                  onPress={() => handleItemClick(item, item.id)}>
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
          </View>
        )}

        {item.Apartment_Picture && item.Apartment_Picture.length > 0 && (
          <View key={item.id} style={{marginLeft: 10}}>
            <TouchableOpacity onPress={() => handleItemClick(item, item.id)}>
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
              <Text style={styles.type}>ประเภทหอพัก {item.Apartment_Type}</Text>
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
                    {itemDistance} km
                  </Text>
                </Text>
              ) : null}
              <Text style={styles.prices}>
                ฿{Number(item.Apartment_Price).toLocaleString()}{' '}
                บาท/เดือน
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const CustomMarker = ({currentValue}) => {
    return (
      <View style={styles.customMarkerContainer}>
        <Text style={styles.customMarkerText}></Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {connected == true ? (
        <View style={styles.container}>
          <View style={styles.searchbarCon}>
            <Searchbar
              style={styles.searchbar}
              placeholder="ค้นหาชื่อหอพัก..."
              placeholderTextColor={'grey'}
              fontSize={16}
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            <TouchableOpacity onPress={handleFilterButtonClick}>
              {showIcon ? (
                <Ionicons
                  color={Colors.black}
                  name="close-outline"
                  size={25}
                  style={styles.filterIcon}
                />
              ) : (
                <Ionicons
                  color={Colors.black}
                  name="options-outline"
                  size={25}
                  style={styles.filterIcon}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={{alignSelf: 'center'}}>
            {showRangePrice && (
              <View style={styles.priceRangeContainer}>
                <Text style={{color: Colors.black}}>ช่วงราคาหอพัก:</Text>
                <MultiSlider
                  values={priceRange}
                  sliderLength={300}
                  onValuesChange={handlePriceRangeChange}
                  min={0}
                  max={10000}
                  step={100}
                  markerSize={25}
                  customMarker={e => {
                    return <CustomMarker currentValue={e.currentValue} />;
                  }}
                />
                <Text style={{color: Colors.black}}>
                  ขั้นต่ำ: {priceRange[0]} ฿ สูงสุด: {priceRange[1]} ฿
                </Text>
              </View>
            )}
          </View>

          {showType && (
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
                    color={
                      selectedButton === 'ชาย' ? Colors.white : Colors.black
                    }
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
                    color={
                      selectedButton === 'หญิง' ? Colors.white : Colors.black
                    }
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
                    color={
                      selectedButton === 'รวม' ? Colors.white : Colors.black
                    }
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity 
            onPress={() => console.log('Press')}
            style={{justifyContent: 'center', alignSelf: 'center', marginTop: 10, padding: 5, backgroundColor: '#3CA1CA', borderRadius: 10,}}>
          <Text style={{color: Colors.white, fontSize: 16, padding: 5}} >Filter</Text>
        </TouchableOpacity> */}
            </View>
          )}

          <FlatList
            style={styles.listCOntainer}
            showsVerticalScrollIndicator={false}
            data={name}
            renderItem={renderItem}
            // ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ShowMap')}
            style={styles.bottomButton}>
            <View style={{flexDirection: 'row'}}>
              <Entypo name="map" color={Colors.white} size={22} />
              <Text style={[styles.bottomButtonText, {paddingLeft: 10}]}>
                แผนที่
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.list}></View>
          {isLoading ? <Apploader /> : null}
        </View>
      ) : (
        <CheckInternet connected={connected} setConnected={setConnected} />
      )}
    </View>
  );
};

export default ExploreScreen;

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
  searchbarCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  filterIcon: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  searchbar: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
    marginTop: 5,
  },
  btnSelect: {
    padding: 5,
    backgroundColor: Colors.white,
    width: '20%',
    height: 55,
    borderRadius: 20,
    alignItems: 'center',
  },
  wrapper: {},
  name: {
    color: Colors.black,
    padding: 2,
    fontSize: 16,
    width: '80%',
  },
  type: {
    color: Colors.black,
    padding: 2,
    fontSize: 16,
  },
  detail: {
    maxWidth: 250,
    padding: 2,
    fontSize: 16,
    color: '#5B5A57',
  },
  prices: {
    fontWeight: 'bold',
    color: Colors.black,
    padding: 2,
    marginTop: 5,
    marginBottom: 30,
    fontSize: 16,
  },
  bottomButton: {
    position: 'absolute', //let button display on the font
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: Colors.detailText,
    padding: 13,
    borderRadius: 10,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  customMarkerContainer: {
    backgroundColor: 'green',
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customMarkerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
