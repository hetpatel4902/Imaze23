import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import MyEventsComponent from '../../components/MyEventsScreenComponent/MyEventsComponent';
import SearchLoader from '../../components/SearchLoader';
import PendingEventComponent from '../../components/MyEventsScreenComponent/PendingEventComponent';
import PendingComboComponent from '../../components/MyEventsScreenComponent/PendingComboComponent';
import StaticCombo from '../../components/ComboScreenComponent/StaticCombo';
import PurchasedIndividualEvents from '../../components/MyEventsScreenComponent/PurchasedIndividualEvents';
import TeamEventComponent from '../../components/MyEventsScreenComponent/TeamEventComponent';
const PaymentHistory = () => {
  const {tokens, users} = useAuthContext();
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/${users}/payment/history`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    console.log(response.data.data.combos);
    setEvent(response.data.data);
    setLoading(false);
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    events();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const scrollY = new Animated.Value(0);

  return (
    <>
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
            Purchase History
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{backgroundColor: 'white', flex: 1, padding: 15}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{marginTop: 55}}></View>
        {event?.combos?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
                // marginTop: 55,
              }}>
              Combos:
            </Text>
            <FlatList
              style={{marginBottom: 20, marginTop: 5}}
              data={event?.combos}
              renderItem={({item}) => <StaticCombo data={item} bought={true} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
        {event?.individual_events?.length > 0 && (
          <>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 16,
              }}>
              Events:
            </Text>
            <FlatList
              style={{
                marginBottom: 70,
              }}
              data={event?.individual_events}
              renderItem={({item}) => <PurchasedIndividualEvents tech={item} />}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {event?.combos?.length == 0 &&
          event?.individual_events?.length == 0 && (
            <>
              {/* <Image
                source={require('../../data/cartEmpty.jpg')}
                style={{
                  height: 400,
                  width: 400,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
              /> */}
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 17,
                  color: '#191919',
                  textAlign: 'center',
                }}>
                You have not bought any event
              </Text>
            </>
          )}
      </ScrollView>
      {loading ? <SearchLoader /> : null}
    </>
  );
};

export default PaymentHistory;
