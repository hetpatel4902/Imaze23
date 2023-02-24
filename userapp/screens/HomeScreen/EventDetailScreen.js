import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';

const EventDetailScreen = () => {
  const route = useRoute();
  const {tokens} = useAuthContext();
  const eventId = route?.params.eventId;
  const [eventDetail, setEventDetail] = useState(null);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/${eventId}`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(response.data.data.category);
    setEventDetail(response.data.data);
  };
  return (
    <View>
      <Text>{eventDetail?.name}</Text>
    </View>
  );
};

export default EventDetailScreen;

// {
//    "__v":0,
//    "_id":"63f0e0bae6a372318c77c18e",
//    "attendance":[
//       "63d2ca8457c9b94490687651",
//       "63f112d1e76d880f2cc83b99"
//    ],
//    "category":"Tech",
//    "date":"18-2-2023",
//    "description":"Super Event",
//    "event_coordinator":[
//       {
//          "name":"Kandarp",
//          "phoneno":"7016763640"
//       }
//    ],
//    "image":"abc",
//    "isAvailable":true,
//    "name":"Techy Ludo",
//    "participants":[
//       "63f112d1e76d880f2cc83b99",
//       "63f112e3e76d880f2cc83b9b",
//       "63d2ca8457c9b94490687651",
//       "63f1cebe4271243798c03f5f"
//    ],
//    "price":100,
//    "time":"10:45",
//    "totalwinners":3,
//    "venue":"GFL2",
//    "winner":[
//       "63f112e3e76d880f2cc83b9b",
//       "63f112d1e76d880f2cc83b99",
//       "63d2ca8457c9b94490687651"
//    ]
// }
