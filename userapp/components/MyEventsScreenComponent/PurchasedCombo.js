import {View, Text, Pressable, StyleSheet, Image, Linking} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
const PurchasedCombo = ({tech, certificate}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: tech._id,
      pending: false,
      bought: true,
      type: tech.event_type,
      certificate,
    });
  };
  // const downloadReceipt = () => {
  //   // console.log(tech);
  //   if (tech?.receipt == '') {
  //     Alert.alert('Receipt not yet generated.Sorry for inconvenience.');
  //   } else {
  //     Linking.openURL(`${tech?.receipt}`);
  //   }
  // };
  const participants = tech?.participants;
  return (
    <Pressable onPress={onPress} style={styles.mainView}>
      {/* <View style={styles.imageView}> */}
      <Image source={{uri: tech?.image}} style={styles.image} />
      {/* </View> */}
      <View style={styles.nameView}>
        <Text style={styles.name}>{tech?.name}</Text>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="calendar-week"
            size={16}
            color={'#ff9600'}
          />
          <View style={styles.subContainer}>
            <Text style={styles.subContainerDate}>{tech?.date} </Text>
            <Text style={styles.subContainerTime}>({tech?.time})</Text>
          </View>
        </View>
      </View>
      {!certificate && (
        <View
          style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#202020', fontFamily: 'Poppins-SemiBold'}}>
            {'\u20B9'} {tech?.price}
          </Text>
        </View>
      )}
      {certificate && (
        <Pressable
          onPress={onPress}
          style={{flex: 1.7, justifyContent: 'center', alignItems: 'center'}}>
          <Feather
            name="download"
            size={24}
            color={'#1655BC'}
            style={{alignSelf: 'center'}}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 7,
    // marginTop: 7,
    marginVertical: 10,
    // backgroundColor: 'orange',
  },
  imageView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    // flex: 1.1,
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  nameView: {flex: 5, paddingHorizontal: 9},
  name: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    flex: 5,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainerDate: {
    fontFamily: 'Poppins-Medium',
    color: '#242424',
    fontSize: 13,
  },
  subContainerTime: {
    fontFamily: 'Poppins-Regular',
    color: '#242424',
    fontSize: 12,
  },
  participants: {
    color: '#191919',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  priceContainer: {
    backgroundColor: '#05fa9c',
    // backgroundColor: '#05fa9c',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 3.5,
    borderRadius: 18,
    shadowColor: '#05fa9c',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  priceContainerText: {color: 'white', fontFamily: 'Poppins-Medium'},
});

export default PurchasedCombo;
