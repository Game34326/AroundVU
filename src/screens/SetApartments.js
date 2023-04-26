import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Button,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, RadioButton, Menu, Divider} from 'react-native-paper';
import Colors from '../components/Colors';
import {db, auth, storage} from '../../Firebase';
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import Apploader from '../components/Apploader';
import MapView, {Marker} from 'react-native-maps';
import InputSpinner from 'react-native-input-spinner';

buttons = [
  {label: 'ไวไฟ', value: 'ไวไฟ', icon: 'wifi'},
  {label: 'แอร์', value: 'แอร์', icon: 'air-conditioner'},
  {label: 'เตียง', value: 'เตียง', icon: 'bed-empty'},
  {label: 'พัดลม', value: 'พัดลม', icon: 'fan'},
  {label: 'ตู้เย็น', value: 'ตู้เย็น', icon: 'fridge-outline'},
  {label: 'โซฟา', value: 'โซฟา', icon: 'sofa-outline'},
  {label: 'โต๊ะ', value: 'โต๊ะ', icon: 'desk'},
  {label: 'เครื่องทำน้ำอุ่น', value: 'เครื่องทำน้ำอุ่น', icon: 'water-boiler'},
  {label: 'โทรทัศน์', value: 'โทรทัศน์', icon: 'television'},
  {label: 'เครื่องซักผ้า', value: 'เครื่องซักผ้า', icon: 'washing-machine'},
  {label: 'ไมโครเวฟ', value: 'ไมโครเวฟ', icon: 'microwave'},
  {label: 'ที่จอดรถยนต์', value: 'ที่จอดรถยนต์', icon: 'car'},
  {label: 'อ่างล้างมือ', value: 'อ่างล้างมือ', icon: 'hand-wash-outline'},
  {label: 'การซ่อมบำรุง', value: 'การซ่อมบำรุง', icon: 'wrench'},
  {label: 'ตู้กดน้ำดื่ม', value: 'ตู้กดน้ำดื่ม', icon: 'cup-water'},
  {label: 'ลิฟต์', value: 'ลิฟต์', icon: 'apps-box'},
];

btnsecurity = [
  {label: 'กุญแจ', value: 'กุญแจ', icon: 'key-variant'},
  {label: 'คีย์การ์ด', value: 'คีย์การ์ด', icon: 'id-card'},
  {label: 'แสกนนิ้ว', value: 'แสกนนิ้ว', icon: 'fingerprint'},
  {label: 'กล้องวงจรปิด', value: 'กล้องวงจรปิด', icon: 'cctv'},
  {label: 'รปภ', value: 'รปภ', icon: 'account-tie-hat'},
  {label: 'ตาแมว', value: 'ตาแมว', icon: 'eye-outline'},
  {label: 'ระบบเตือนภัย', value: 'ระบบเตือนภัย', icon: 'fire-alert'},
  {label: 'คนนอกห้ามเข้า', value: 'คนนอกห้ามเข้า', icon: 'account-off-outline'},
  {label: 'แสงสว่าง', value: 'แสงสว่าง', icon: 'lightbulb-on-outline'},
  {label: 'ประตูรั้ว', value: 'ประตูรั้ว', icon: 'fence'},
];

const SetApartments = ({navigation, route}) => {
  const [apartmentName, setApartmentName] = useState('');
  const [price, setPrice] = useState('');
  const [detail, setDetail] = useState('');
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radioButtons, setRadioButtons] = useState('');
  const [waterPrice, setWaterPrice] = useState('');
  const [totalRoom, setTotalRoom] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [securityBtn, setSecurityBtn] = useState([]);
  const [room, setRoom] = useState('');
  const [lightPrice, setLightPrice] = useState('');
  const [firstCome, setFirstCome] = useState('');
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [contract, setContract] = useState('');
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const {item} = route.params;

  const ReadData = async () => {
    try {
      setAddLoading(true);
      const docRef = doc(db, 'apartments', item.apartmentId);
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setApartmentName(data.Apartment_Name);
          setDetail(data.Apartment_Detail);
          setPrice(data.Apartment_Price);
          setRadioButtons(data.Apartment_Type);
          setWaterPrice(data.Apartment_Water);
          setTotalRoom(data.Apartment_TotalRoom);
          setRoomSize(data.Apartment_Size);
          setSecurityBtn(data.Apartment_Security);
          setRoom(data.Apartment_Room);
          setLightPrice(data.Apartment_Light);
          setFirstCome(data.Apartment_FirstCome);
          setSelectedButtons(data.Apartment_Convenient);
          setContract(data.Apartment_Contract);
          setUrl(data.Apartment_Picture);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
        setAddLoading(false);
      });
    } catch (error) {
      console.error(error);
      // handle the error and show a message to the user
      setAddLoading(false);
    }
  };
  
  useEffect(() => {
    ReadData();
  }, []);
  
  
  const MultipleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0,
    });
    if (!result.didCancel) {
      // setImages(result.assets);
      // console.log(result.assets);
      let results = [];
      result.assets.forEach(imageInfo => results.push(imageInfo.uri));
      if (result.assets.length > 1) {
        // multi images. ***it doesn't work!!!***
        setImages([...results, ...images]); // a list
        console.log([...results, ...images]);
      } else {
        //image only 1  **it works!**
        setImages(results); // a list
        console.log(results);
      }
    }
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
                  navigation.navigate('Home');
                }}
                title="หน้าแรก"
              />
              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  navigation.navigate('SetOwners');
                }}
                title="แก้ไขข้อมูลส่วนตัว"
              />
              <Divider bold={true} />
              <Menu.Item
                onPress={() => {
                  handleMenuItemPress();
                  Alert.alert(
                    'ลบข้อมูลหอพัก',
                    'คุณต้องการลบข้อมูลหอพักหรือไม่?',
                    [
                      {
                        text: 'ไม่',
                        style: 'cancel',
                      },
                      {
                        text: 'ใช่',
                        onPress: () => {
                          handleMenuItemPress();
                          // Add code to delete apartment data here
                          try {
                            const apartmentId = item.apartmentId; // Replace with the ID of the apartment document to delete
                            deleteDoc(
                              doc(collection(db, 'apartments'), apartmentId),
                            ).then(() => {
                              navigation.replace('Owners');
                            });
                          } catch (error) {
                            // console.error('Error deleting document: ', error);
                          }
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}
                title="ลบข้อมูลหอพัก"
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

  useEffect(() => {
    const {latitude, longitude} = route.params ?? {};
    setLatitude(latitude);
    setLongitude(longitude);
  }, [route.params]);

  const handleDelete = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDeleteUrl = async index => {
    const newImages = [...url];
    const urlToDelete = newImages[index];
    newImages.splice(index, 1);
    setUrl(newImages);

    try {
      const urlRef = doc(db, 'apartments', item.apartmentId);
      await updateDoc(urlRef, {
        Apartment_Picture: arrayRemove(urlToDelete),
      });
    } catch (error) {
      // handle the error
    }
  };

  const handleUpload = async () => {
    const newUrls = [];
  
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const imageBlob = await response.blob();
  
      const storageRef = ref(storage, 'Apartments/' + Date.now() + i);
      setLoading(true);
      await uploadBytes(storageRef, imageBlob)
        .then(async snapshot => {
          await getDownloadURL(snapshot.ref)
            .then(downloadUrl => {
              newUrls.push(downloadUrl);
              console.log('file available at', downloadUrl);
            })
            .then(() => {
              setLoading(false);
            });
        })
        .catch(error => {
          setLoading(false);
          alert(error.message);
        });
    }
    return newUrls; // Return array of new image URLs
  };
  

  function validateForm() {
    const newErrors = {};

    if (!apartmentName) {
      newErrors.apartmentName = 'กรุณากรอกชื่อหอพัก';
    }

    const regex = /^\d+(\.\d+)?$/;
    if (!regex.test(price)) {
      newErrors.price = 'กรุณากรอกราคาค่าเช่าเป็นตัวเลข';
    } else if (parseFloat(price) <= 0) {
      newErrors.price = 'กรุณากรอกราคาค่าเช่าให้มากกว่า 0';
    }

    if (!images) {
      newErrors.images = 'กรุณาเพิ่มรูปภาพ';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleUpdateApartment = async () => {
    if (validateForm()) {
      Alert.alert('ยืนยันการแก้ไข', 'คุณต้องการแก้ไขข้อมูลหอพัก ?', [
        {
          text: 'ไม่',
          style: 'cancel',
        },
        {
          text: 'ใช่',
          onPress: async () => {
            setAddLoading(true);

            if (latitude && longitude) {
              // Check if latitude and longitude are defined and not falsy

              const urls = await handleUpload(); // upload images and get url array

              const apartmentRef = doc(db, 'apartments', item.apartmentId);

              // Get current Apartment_Picture array from Firestore
              const apartmentDoc = await getDoc(apartmentRef);
              const currentUrls = apartmentDoc.data().Apartment_Picture;

              // Concatenate currentUrls with urls
              const updatedUrls = currentUrls.concat(urls);

              // Update document with merged array
              updateDoc(apartmentRef, {
                Apartment_Name: apartmentName,
                Apartment_Type: radioButtons,

                Apartment_Price: price,
                Apartment_Water: waterPrice,
                Apartment_Light: lightPrice,
                Apartment_Contract: contract,
                Apartment_FirstCome: firstCome,

                Apartment_TotalRoom: totalRoom,
                Apartment_Room: room,
                Apartment_Size: roomSize,

                Apartment_Convenient: selectedButtons,
                Apartment_Security: securityBtn,
                Apartment_Detail: detail,
                Apartment_Picture: updatedUrls, // update Apartment_Picture with urls
                latitude: latitude,
                longitude: longitude,
              })
                .then(() => {
                  alert('แก้ไขข้อมูลหอพักสำเร็จ');
                  setAddLoading(false);
                  navigation.replace('Owners');
                })
                .catch(error => {
                  console.error('Error updating document: ', error);
                  alert('ไม่สามารถแก้ไขข้อมูลหอพักได้ โปรดลองอีกครั้ง');
                  setAddLoading(false);
                });
            } else {
              alert('กรุณากรอกข้อมูลพิกัด');
              setAddLoading(false);
            }
          },
        },
      ]);
    } else {
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
    }
  };

  const handleInputTotal = newValue => {
    setTotalRoom(newValue);
  };

  const handleInputRoom = newValue => {
    setRoom(newValue);
  };

  const handletRoomSize = newValue => {
    setRoomSize(newValue);
  };

  const handleButtonPress = useCallback(
    (value) => {
      setSelectedButtons((buttons) => {
        const index = buttons.indexOf(value);
        if (index === -1) {
          return [...buttons, value];
        } else {
          return buttons.filter((button) => button !== value);
        }
      });
    },
    []
  );
  
  const handleSecurityPress = useCallback(
    (value) => {
      requestAnimationFrame(() => {
        setSecurityBtn((securityBtn) => {
          const index = securityBtn.indexOf(value);
          if (index === -1) {
            return [...securityBtn, value];
          } else {
            return securityBtn.filter((security) => security !== value);
          }
        });
      });
    },
    []
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            ข้อมูลหอพัก{' '}
          </Text>

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ชื่อหอพัก"
              onChangeText={text => setApartmentName(text)}
              value={apartmentName}
              left={<TextInput.Icon icon="greenhouse" />}
            />
          </View>
          {errors.apartmentName && (
            <Text style={styles.errors}>{errors.apartmentName}</Text>
          )}

          <View style={styles.input}>
            <Text style={{color: Colors.black, fontSize: 16}}>
              ประเภทหอพัก:{' '}
            </Text>
            <RadioButton.Group //change to orange
              onValueChange={newValue => setRadioButtons(newValue)}
              value={radioButtons}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text style={{color: Colors.detailText, fontSize: 16}}>
                  ชาย
                </Text>
                <RadioButton value="ชาย" color="orange" />

                <Text style={{color: Colors.detailText, fontSize: 16}}>
                  หญิง
                </Text>
                <RadioButton value="หญิง" color="orange" />

                <Text style={{color: Colors.detailText, fontSize: 16}}>
                  รวม
                </Text>
                <RadioButton value="รวม" color="orange" />
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.line} />
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            รายละเอียดค่าเช่าของหอพัก{' '}
          </Text>
          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ค่าเช่าหอพัก/เดือน"
              onChangeText={text => setPrice(text)}
              value={price}
              left={<TextInput.Icon icon='account-cash' />}
            />
          </View>
          {errors.price && <Text style={styles.errors}>{errors.price}</Text>}

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="รายละเอียดค่าน้ำ"
              onChangeText={text => setWaterPrice(text)}
              value={waterPrice}
              left={<TextInput.Icon icon='water-pump' />}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="รายละเอียดค่าไฟ"
              onChangeText={text => setLightPrice(text)}
              value={lightPrice}
              left={<TextInput.Icon icon='lamp-outline' />}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ค่าประกัน/มัดจำ"
              onChangeText={text => setContract(text)}
              value={contract}
              left={<TextInput.Icon icon='newspaper-variant-outline' />}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              style={{backgroundColor: '#F6F1F1'}}
              placeholder="ค่าใช้จ่ายแรกเข้า"
              onChangeText={text => setFirstCome(text)}
              value={firstCome}
              left={<TextInput.Icon icon='cash' />}
            />
          </View>


          <View style={styles.line} />
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            รายละเอียดของห้องพัก{' '}
          </Text>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '60%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                color: Colors.black,
                marginTop: 10,
              }}>
              จำนวนห้องทั้งหมด
            </Text>
            <InputSpinner
              max={100}
              min={0}
              step={1}
              value={totalRoom}
              rounded={false}
              showBorder
              onChange={handleInputTotal}
              color="green"
              fontSize={16}
            />
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                color: Colors.black,
                marginTop: 10,
              }}>
              จำนวนห้องว่าง
            </Text>
            <InputSpinner
              max={totalRoom}
              min={0}
              step={1}
              value={room}
              rounded={false}
              showBorder
              onChange={handleInputRoom}
              color="green"
              fontSize={16}
            />
             <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                color: Colors.black,
                marginTop: 10,
              }}>
              ขนาดของห้องพัก (ตารางเมตร)
            </Text>
            <InputSpinner
              max={1000}
              min={0}
              step={1}
              value={roomSize}
              rounded={false}
              showBorder
              onChange={handletRoomSize}
              color="green"
              fontSize={16}
            />
          </View>

          <View style={styles.line} />
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            บริการและสิ่งอำนวยความสะดวก{' '}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            {buttons.map((button) => (
              <TouchableOpacity
                key={button.value}
                onPress={() => handleButtonPress(button.value)}
                style={{
                  padding: 8,
                  margin: 4,
                  width: '35%' ,
                  borderRadius: 20,
                  backgroundColor: selectedButtons.includes(button.value)
                    ? Colors.bgButton
                    : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={button.icon}
                  color={
                    selectedButtons.includes(button.value) ? 'white' : 'black'
                  }
                  size={22}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    color: selectedButtons.includes(button.value)
                      ? 'white'
                      : 'black',
                  }}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.line} />
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            ความปลอดภัยของหอพัก{' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            {btnsecurity.map((security) => (
              <TouchableOpacity
                key={security.value}
                onPress={() => handleSecurityPress(security.value)}
                style={{
                  padding: 8,
                  margin: 4,
                  width: '35%',
                  borderRadius: 20,
                  backgroundColor: securityBtn.includes(security.value)
                    ? Colors.bgButton
                    : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={security.icon}
                  color={
                    securityBtn.includes(security.value) ? 'white' : 'black'
                  }
                  size={22}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    color: securityBtn.includes(security.value)
                      ? 'white'
                      : 'black',
                  }}>
                  {security.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.line} />
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            รายละเอียดอื่นๆของหอพัก{' '}
          </Text>
          <View style={styles.input}>
            <TextInput
              placeholder="รายละเอียดอื่นๆ..."
              style={{backgroundColor: '#F6F1F1'}}
              onChangeText={text => setDetail(text)}
              value={detail}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            เลือกรูปภาพหอพัก{' '}
          </Text>
          <TouchableOpacity
            onPress={MultipleImagePicker}
            style={{alignSelf: 'center'}}>
            <Image
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
                marginTop: 20,
              }}
              source={require('../assets/add-images-icon.png')}
            />
          </TouchableOpacity>
          <ScrollView horizontal={true}>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                marginLeft: 10,
                marginTop: 20,
              }}>
              {url.length !== 0 &&
                url.map((image, index) => (
                  <View style={{padding: 5}} key={index}>
                    <Image
                      style={{width: 120, height: 120, borderRadius: 10}}
                      source={{uri: image}}
                    />
                    <TouchableOpacity
                      style={styles.buttonDelete}
                      onPress={() => handleDeleteUrl(index)}>
                      <Entypo name="squared-cross" color={'red'} size={15} />
                    </TouchableOpacity>
                  </View>
                ))}
              {images.length !== 0 &&
                images.map((image, index) => (
                  <View style={{padding: 5}} key={index}>
                    <Image
                      style={{width: 120, height: 120, borderRadius: 10}}
                      source={{uri: image}}
                    />
                    <TouchableOpacity
                      style={styles.buttonDelete}
                      onPress={() => handleDelete(index)}>
                      <Entypo name="squared-cross" color={'red'} size={15} />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </ScrollView>
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              marginTop: 15,
              color: Colors.black,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            เลือกพิกัดหอพัก{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.push('SetMap')}
            style={{
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <MaterialIcons
              name="add-location-alt"
              size={80}
              color={Colors.black}
            />
          </TouchableOpacity>

          <View>
            {latitude && longitude ? (
              <MapView
                key={`${latitude}-${longitude}`}
                style={{
                  height: 250,
                  width: '90%',
                  marginTop: 20,
                  alignSelf: 'center',
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
            ) : null}
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => handleUpdateApartment(item, item.apartmentId)}>
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
      </SafeAreaView>
      {addLoading ? <Apploader /> : null}
    </View>
  );
};

export default SetApartments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8CCB6',
    height: '100%',
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
  buttonDelete: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ffffff92',
    borderRadius: 4,
  },
  errors: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    color: '#FA0606',
    alignSelf: 'center',
    fontSize: 16,
  },
  line: {
    marginTop: 15,
    borderBottomColor: '#9C9C99',
    borderBottomWidth: 1,
    alignSelf: 'center',
    width: '95%',
  },
});
