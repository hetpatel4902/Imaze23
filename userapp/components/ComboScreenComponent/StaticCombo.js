import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import ComboDetail from './ComboDetail';

const StaticCombo = ({data}) => {
  const [events, setEvents] = useState(data?.events);
  //   const events = data.events;
  //   console.log(events);
  const onBuyPressed = () => {};
  return (
    <View style={{backgroundColor: '#ffffff'}}>
      <Text
        style={{fontFamily: 'Poppins-Medium', color: '#232323', fontSize: 14}}>
        {data?.name}
      </Text>
      <FlatList
        style={{marginBottom: 25}}
        data={events}
        renderItem={({item}) => <ComboDetail info={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            color: '#191919',
            alignSelf: 'center',
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
          }}>
          Rs. {data.price}
        </Text>
        <Pressable
          onPress={onBuyPressed}
          style={{
            shadowColor: '#4b2be3',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#6949ff',
            paddingVertical: 8,
            borderRadius: 14,
          }}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'center',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              marginHorizontal: 30,
            }}>
            Buy Now
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          height: 0.5,
          marginVertical: 16,
          backgroundColor: 'grey',
          paddingHorizontal: 40,
        }}></View>
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
