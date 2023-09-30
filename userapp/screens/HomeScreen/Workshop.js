import {View, Text, FlatList, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import EventComponent from '../../components/HomeScreenComponent/EventComponent';
import {USER_IP} from '@env';
const Workshop = () => {
  const {tokens} = useAuthContext();
  const [event, setEvent] = useState([]);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/category`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(response.data.data.Tech);
    console.log(response.data.data);
    setEvent(response.data.data.Workshop);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{padding: 15, backgroundColor: 'white', flex: 1}}>
      <Text
        style={{color: '#191919', fontFamily: 'Poppins-Medium', fontSize: 17}}>
        Workshop 🎉
      </Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={event}
        renderItem={({item}) => <EventComponent tech={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default Workshop;
