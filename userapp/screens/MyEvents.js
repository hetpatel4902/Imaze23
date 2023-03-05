import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthContext} from '../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import MyEventsComponent from '../components/MyEventsScreenComponent/MyEventsComponent';
import SearchLoader from '../components/SearchLoader';
const MyEvents = () => {
  const {tokens, users} = useAuthContext();
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/user/${users}`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setEvent(response.data.data);
    setLoading(false);
  };
  return (
    <>
      <View style={{backgroundColor: 'white', flex: 1, padding: 15}}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            color: '#191919',
            fontSize: 16,
          }}>
          Purchased Events
        </Text>
        <FlatList
          style={{marginBottom: 30, marginTop: 5}}
          data={event.purchased_events}
          renderItem={({item}) => <MyEventsComponent tech={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {loading ? <SearchLoader /> : null}
    </>
  );
};

export default MyEvents;
