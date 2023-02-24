import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const EventComponent = ({tech}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('EventDetailScreen', {eventId: tech._id});
  };
  return (
    <View>
      <Pressable onPress={onPress}>
        <Text>{tech.name}</Text>
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
