import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  Image,
  Animated,
  StatusBar,
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
import TeamEventComponent from '../components/MyEventsScreenComponent/TeamEventComponent';
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
    console.log(response.data.data.purchased.team_events);
    setEvent(response.data.data);
    setLoading(false);
  };
  const scrollY = new Animated.Value(0);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={'#1655BC'}
        barStyle={'light-content'}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: '#1655BC',
          height: 60,
          alignSelf: 'center',
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
          paddingTop: 5,

          opacity: scrollY.interpolate({
            inputRange: [0, 70],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Poppins-Medium',
              fontSize: 17,
              // marginLeft: 5,
              textAlign: 'center',
              marginTop: 12,
            }}>
            Cart
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{backgroundColor: 'white', flex: 1, padding: 15}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{marginTop: 55}}></View>
        {event?.pending?.combos?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
                // marginTop: 55,
              }}>
              Combos Pending to Verify:
            </Text>
            <FlatList
              style={{marginBottom: 20, marginTop: 5}}
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
              Events Pending to Verify:
            </Text>
            <FlatList
              style={{
                marginBottom:
                  event?.purchased?.team_events?.length > 0 ? 10 : 70,
              }}
              data={event.pending?.individual}
              renderItem={({item}) => <PendingEventComponent tech={item} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {event?.purchased?.team_events?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
              }}>
              Your Teams:
            </Text>
            <FlatList
              style={{marginBottom: 80, marginTop: 5}}
              data={event.purchased.team_events}
              renderItem={({item}) => <TeamEventComponent tech={item} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
        {/* {event?.purchased?.length == 0 && */}
        {event?.pending?.individual?.length == 0 &&
          event?.pending?.combos?.length == 0 &&
          event?.purchased?.team_events?.length == 0 && (
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 17,
                color: '#191919',
                textAlign: 'center',
              }}>
              Your cart is empty
            </Text>
          )}
      </ScrollView>
      {loading ? <SearchLoader /> : null}
    </>
  );
};

export default MyEvents;
