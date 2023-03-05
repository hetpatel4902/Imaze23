import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ComboDetail = ({info}) => {
  // console.log(info);
  const navigation = useNavigation();
  const participants = info?.participants;
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: info?._id,
      selected: true,
    });
  };
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 7}}>
      <View style={{flex: 1}}>
        <Image
          source={{uri: `http://10.0.2.2:8000/${info.image}`}}
          style={{height: 50, width: 50, borderRadius: 25}}
        />
      </View>
      <View style={{flex: 4}}>
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
            fontSize: 12,
          }}>
          {info.category}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            color: '#191919',
            fontSize: 12,
          }}>
          {participants.length} participants
        </Text>
      </View>
      <Pressable style={{flex: 1, alignContent: 'center'}} onPress={onPress}>
        <Text
          style={{
            color: '#6949ff',
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
          }}>
          View Detail
        </Text>
      </Pressable>
    </View>
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
