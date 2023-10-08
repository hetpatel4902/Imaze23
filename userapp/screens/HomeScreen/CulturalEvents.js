import {View, Text, FlatList, ScrollView, Animated} from 'react-native';
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
    console.log(response.data);
    setEvent(response.data.data.CULTURAL);
  };
  const scrollY = new Animated.Value(0);

  // Create a function to handle the scroll event
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false}, // set to true if using RN 0.63 or above
  );

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
            Cultural Events
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{padding: 15, backgroundColor: 'white', flex: 1, marginTop: 45}}>
        {/* <Text
          style={{
            color: '#191919',
            fontFamily: 'Poppins-Medium',
            fontSize: 17,
          }}>
          Cultural Events 🎉
        </Text> */}
        <FlatList
          style={{marginBottom: 30, marginTop: 5}}
          data={event}
          renderItem={({item}) => (
            <EventComponent tech={item} type={'CULTURAL'} />
          )}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
};

export default CulturalEvents;
