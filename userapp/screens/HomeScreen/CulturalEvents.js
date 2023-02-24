import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import EventComponent from '../../components/HomeScreenComponent/EventComponent';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
const CulturalEvents = () => {
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
    // console.log(response.data.data);
    setEvent(response.data.data.Cultural);
  };
  return (
    <View>
      <Text>Cultural Events</Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={event}
        renderItem={({item}) => <EventComponent tech={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CulturalEvents;
