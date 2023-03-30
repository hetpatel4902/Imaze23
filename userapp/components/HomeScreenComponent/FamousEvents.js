import {View, Text, ScrollView, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {USER_IP} from '@env';
import {useAuthContext} from '../../src/Context/AuthContext';
import FamousEventsComponent from './FamousEventsComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PartyLoader from '../PartyLoader';
// import {FlatList} from 'react-native-gesture-handler';
// import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
const FamousEvents = () => {
  const [event, setEvent] = useState([]);
  // const [loginPending, setLoginPending] = useState(false);
  const [tokens, setTokens] = useState(null);
  const {loading, setLoading} = useAuthContext();
  let jsonValue;
  const getData = async () => {
    const value = await AsyncStorage.getItem('userDetail');
    jsonValue = JSON.parse(value);
    setTokens(jsonValue.token);
  };
  useEffect(() => {
    getData();
    setTimeout(() => events(), 100);
  }, []);
  const events = async () => {
    setLoading(true);
    // console.log(jsonValue.token);
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/?sort=noOfParticipants`,
      {headers: {Authorization: `Bearer ${jsonValue.token}`}},
    );
    console.table(response.data.data);
    setEvent(response.data.data);
    setLoading(false);
  };
  return (
    <>
      <View style={{paddingHorizontal: 5}}>
        {/* <Text>FamousEvents</Text> */}
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
            color: '#191919',
            marginTop: 16,
            paddingHorizontal: 15,
          }}>
          Most Selling Events...
        </Text>
        <FlatList
          data={event}
          horizontal
          style={{marginBottom: 10, marginTop: 5}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <FamousEventsComponent tech={item} />}
          keyExtractor={item => item.name}
        />
      </View>
      {/* {loading ? <PartyLoader /> : null} */}
    </>
  );
};

export default FamousEvents;
// [
//    {
//       "__v":0,
//       "_id":"63f12fc88e820e481055dec6",
//       "attendance":[

//       ],
//       "category":"NonTech",
//       "date":"18-2-2023",
//       "description":"Super Event",
//       "event_coordinator":[
//          [
//             "Object"
//          ]
//       ],
//       "image":"Maze It Out.png",
//       "isAvailable":true,
//       "name":"Maze It Out",
//       "noOfParticipants":2,
//       "participants":[
//          "63f112e3e76d880f2cc83b9b",
//          "63f1cebe4271243798c03f5f"
//       ],
//       "price":100,
//       "time":"10:00",
//       "totalwinners":3,
//       "venue":"GFL4",
//       "winner":[
//          "63f112e3e76d880f2cc83b9b",
//          "63f112d1e76d880f2cc83b99"
//       ]
//    },
// ]
