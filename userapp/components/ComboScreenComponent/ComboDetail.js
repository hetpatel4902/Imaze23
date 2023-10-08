import {View, Text, Image, Pressable, Animated} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {USER_IP, COLOR} from '@env';
const ComboDetail = ({info}) => {
  // console.log(info);
  const navigation = useNavigation();
  const participants = info?.participants;
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: info?._id,
      selected: true,
      type: info?.event_type,
    });
  };
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 9,
          paddingHorizontal: 5,
        }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            // height: 53,
            // width: 52,
          }}>
          <Image
            source={{uri: info?.image}}
            style={{height: 55, width: 55, borderRadius: 28}}
          />
        </View>
        <View style={{flex: 3, paddingHorizontal: 8}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#191919',
              fontSize: 13,
            }}>
            {info.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#383838',
              fontSize: 11,
            }}>
            {info.category}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#191919',
              fontSize: 11,
            }}>
            {participants.length} participants
          </Text>
        </View>
        <Pressable
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPress}>
          <Text
            style={{
              color: '#000000',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            View
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default ComboDetail;

// [
//   {
//     __v: 0,
//     _id: '63f0e0bae6a372318c77c18e',
//     attendance: ['63d2ca8457c9b94490687651', '63f112d1e76d880f2cc83b99'],
//     category: 'Tech',
//     date: '18-2-2023',
//     description: 'Super Event',
//     event_coordinator: [['Object']],
//     image: 'Techy Ludo.png',
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
// ];
