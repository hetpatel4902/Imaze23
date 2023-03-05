import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useAuthContext} from '../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import MyEventsComponent from '../components/MyEventsScreenComponent/MyEventsComponent';
import SearchLoader from '../components/SearchLoader';
import PendingEventComponent from '../components/MyEventsScreenComponent/PendingEventComponent';
import PendingComboComponent from '../components/MyEventsScreenComponent/PendingComboComponent';
import StaticCombo from '../components/ComboScreenComponent/StaticCombo';
const MyEvents = () => {
  const {tokens, users} = useAuthContext();
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchDetail();
    events();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/user/${users}`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    console.log(response.data.data.pending.combos);
    setEvent(response.data.data);
    setLoading(false);
  };
  return (
    <>
      <ScrollView
        style={{backgroundColor: 'white', flex: 1, padding: 15}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {event?.pending?.combos?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
              }}>
              Combos Pending to Verify
            </Text>
            <FlatList
              style={{marginBottom: 20}}
              data={event.pending?.combos}
              renderItem={({item}) => (
                <StaticCombo data={item} pending={true} />
              )}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
        {event?.pending?.individual?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
              }}>
              Events Pending to Verify
            </Text>
            <FlatList
              style={{marginBottom: 15}}
              data={event.pending?.individual}
              renderItem={({item}) => <PendingEventComponent tech={item} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
        {event?.purchased_events?.length > 0 && (
          <>
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
          </>
        )}
        {event?.purchased_events?.length == 0 &&
          event?.pending?.individual?.length == 0 &&
          event?.pending?.combos?.length == 0 && (
            <>
              <Image
                source={require('../data/cartEmpty.jpg')}
                style={{
                  height: 400,
                  width: 400,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 17,
                  color: '#191919',
                  textAlign: 'center',
                }}>
                Your Cart is Empty
              </Text>
            </>
          )}
      </ScrollView>
      {loading ? <SearchLoader /> : null}
    </>
  );
};

export default MyEvents;
