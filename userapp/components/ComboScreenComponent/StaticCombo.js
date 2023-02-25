import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import ComboDetail from './ComboDetail';

const StaticCombo = ({data}) => {
  const [events, setEvents] = useState(data?.events);
  //   const events = data.events;
  //   console.log(events);
  return (
    <View>
      <Text>{data.price}</Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={events}
        renderItem={({item}) => <ComboDetail info={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default StaticCombo;

// [
//   {
//     _id: '63f131713d0a313b08b35e4c',
//     events: [[Object], [Object], [Object], [Object]],
//     price: 400,
//   },
// ];
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
