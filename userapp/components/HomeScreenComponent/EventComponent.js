import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EventComponent = ({tech}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('EventDetailScreen', {eventId: tech._id});
  };

  const participants = tech?.participants;
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'blue',
          marginBottom: 10,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Image
            source={{uri: `http://10.0.2.2:8000/${tech.image}`}}
            style={{
              height: 100,
              width: 100,
            }}
          />
        </View>
        <View style={{flex: 3, paddingHorizontal: 5}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
            }}>
            {tech.name}
          </Text>
          <View></View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="calendar-week"
              size={16}
              color={'#33e835'}
            />
            <View
              style={{
                flex: 7,
                marginHorizontal: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: '#242424',
                  fontSize: 13,
                }}>
                {tech?.date}{' '}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#242424',
                  fontSize: 12,
                }}>
                ({tech?.time})
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: '#191919',
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
              }}>
              {participants.length} participants
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#33e835',
            // paddingHorizontal: 14,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            paddingVertical: 3.5,
            borderRadius: 18,
            shadowColor: '#33e835',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}>
          <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
            Rs.{tech?.price}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

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
