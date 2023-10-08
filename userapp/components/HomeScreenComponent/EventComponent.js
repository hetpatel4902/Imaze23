import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
const EventComponent = ({tech, type}) => {
  const navigation = useNavigation();

  const onPress = () => {
    // console.log(tech);
    navigation.navigate('EventDetailScreen', {eventId: tech._id, type: type});
  };

  const participants = tech?.participants;
  return (
    <Pressable onPress={onPress} style={styles.mainView}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: tech?.image}}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: 'black',
            }}
          />
        </View>
      </View>
      <View style={styles.nameView}>
        <Text style={styles.name}>{tech.name}</Text>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="calendar-week"
            size={16}
            color={'#000000'}
          />
          <View style={styles.subContainer}>
            <Text style={styles.subContainerDate}>{tech?.date} </Text>
            <Text style={styles.subContainerTime}>({tech?.time})</Text>
          </View>
        </View>
        <View>
          <Text style={styles.participants}>
            {participants.length} participants
          </Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceContainerText}>Rs.{tech?.price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  imageView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 23,
  },
  nameView: {flex: 3, paddingHorizontal: 10},
  name: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    flex: 7,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainerDate: {
    fontFamily: 'Poppins-Medium',
    color: '#242424',
    fontSize: 12,
  },
  subContainerTime: {
    fontFamily: 'Poppins-Regular',
    color: '#242424',
    fontSize: 11,
  },
  participants: {
    color: '#191919',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  priceContainer: {
    backgroundColor: '#1655BC',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 3.5,
    borderRadius: 18,
    shadowColor: '#1655BC',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 5,
  },
  priceContainerText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
});
export default EventComponent;

// [
//   {
//     __v: 0,
//     _id: '63f0e0bae6a372318c77c18e',
//     attendance: ['63d2ca8457c9b94490687651', '63f112d1e76d880f2cc83b99'],
//     category: 'Tech',
//     date: '18-2-2023',
//     description: 'Super Event',
//     event_coordinator: [['Object']],
//     image: 'abc',
//     isAvailable: true,
//     name: 'Techy Ludo',
//     participants: [
//       '63f112d1e76d880f2cc83b99',
//       '63f112e3e76d880f2cc83b9b',
//       '63d2ca8457c9b94490687651',
//       '63f1cebe4271243798c03f5f',
//     ],
//     price: 100,
//     time: '10:45',
//     totalwinners: 3,
//     venue: 'GFL2',
//     winner: [
//       '63f112e3e76d880f2cc83b9b',
//       '63f112d1e76d880f2cc83b99',
//       '63d2ca8457c9b94490687651',
//     ],
//   },
//   {
//     __v: 0,
//     _id: '63f12ff78e820e481055dec8',
//     attendance: [],
//     category: 'Tech',
//     date: '18-2-2023',
//     description: 'Super Event',
//     event_coordinator: [['Object']],
//     image: 'abc',
//     isAvailable: true,
//     name: 'Codeyuddha',
//     participants: ['63f112e3e76d880f2cc83b9b', '63f1cebe4271243798c03f5f'],
//     price: 100,
//     time: '10:00',
//     totalwinners: 3,
//     venue: 'GFL4',
//     winner: ['63f112e3e76d880f2cc83b9b', '63f112d1e76d880f2cc83b99'],
//   },
// ];
