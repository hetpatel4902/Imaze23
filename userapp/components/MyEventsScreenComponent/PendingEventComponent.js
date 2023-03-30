import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
const PendingEventComponent = ({tech}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: tech.event_details._id,
      pending: true,
      otp: tech.cash_otp,
    });
  };
  const participants = tech?.participants;
  return (
    <Pressable onPress={onPress} style={styles.mainView}>
      {/* <View style={styles.imageView}> */}
      <Image
        source={{uri: `http://${USER_IP}/${tech?.event_details.image}`}}
        style={styles.image}
      />
      {/* </View> */}
      <View style={styles.nameView}>
        <Text style={styles.name}>{tech?.event_details.name}</Text>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="calendar-week"
            size={16}
            color={'#05fa9c'}
          />
          <View style={styles.subContainer}>
            <Text style={styles.subContainerDate}>
              {tech?.event_details.date}{' '}
            </Text>
            <Text style={styles.subContainerTime}>
              ({tech?.event_details.time})
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.participants}>Otp: {tech?.cash_otp}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    marginTop: 7,
    // backgroundColor: 'orange',
  },
  imageView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    flex: 1,
    height: 56,
    width: 56,
    borderRadius: 29,
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

export default PendingEventComponent;
