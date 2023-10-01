import {View, Text, Image} from 'react-native';
import React from 'react';

const DownloadCertificate = () => {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Image
        source={require('../../data/cartEmpty.jpg')}
        style={{height: 600, width: 400, alignSelf: 'center'}}
        resizeMode={'contain'}
      />
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          marginTop: -130,
          textAlign: 'center',
          color: '#191919',
          fontSize: 15,
        }}>
        Attend the event in order to download certificate
      </Text>
    </View>
  );
};

export default DownloadCertificate;
