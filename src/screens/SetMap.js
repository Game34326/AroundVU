import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import marker from '../assets/location-marker.png';
import Colors from '../components/Colors';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

export default class SetMap extends React.Component {
  state = {
    region: {
      latitudeDelta,
      longitudeDelta,
      latitude: 15.001748,
      longitude: 102.118391,
    },
    startingPoint: {
      latitude: 15.002378508699756,
      longitude: 102.11759386584163,
    },
  };

  onRegionChange = region => {
    this.setState({
      region,
    });
  };

  handleSelectLocation = () => {
    const {navigation} = this.props;
    navigation.navigate('SetApartment', {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    });
  };

  render() {
    const {region, startingPoint} = this.state;

    return (
      <View style={styles.map}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={this.onRegionChange}
          showsMyLocationButton={true}>
          <Marker coordinate={startingPoint} title="มหาวิทยาลัยวงษ์ชวลิตกุล" />
        </MapView>
        <View style={styles.markerFixed}>
          <Image style={styles.marker} source={marker} />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.handleSelectLocation}>
            <Text style={styles.region}>เลือกพิกัดหอพัก</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  footer: {
    backgroundColor: Colors.bgButton,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
