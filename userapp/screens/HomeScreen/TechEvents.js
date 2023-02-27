import {View, Text, FlatList, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import axios from 'axios';
import EventComponent from '../../components/HomeScreenComponent/EventComponent';
import {USER_IP} from '@env';
const TechEvents = () => {
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
    setEvent(response.data.data.Tech);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{padding: 15}}>
      <Text
        style={{color: '#191919', fontFamily: 'Poppins-Medium', fontSize: 17}}>
        Tech Events 🎉
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

export default TechEvents;
