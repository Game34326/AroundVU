import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default function WavyHeader({customStyles}) {
  return (
    <View style={customStyles}>
      <View style={{backgroundColor: '#585554', height: 200}}>
        <Svg
          height="60%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{position: 'absolute', top: 180}}>
          <Path
            fill="#585554"
            fill-opacity="1"
            d="M0,288L80,288C160,288,320,288,480,245.3C640,203,
                800,117,960,90.7C1120,64,1280,96,1360,112L1440,128L1440,
                0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
          
        </Svg>
      </View>
    </View>
  );
}
