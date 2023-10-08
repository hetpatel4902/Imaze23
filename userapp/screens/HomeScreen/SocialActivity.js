import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import axios from 'axios';
import EventComponent from '../../components/HomeScreenComponent/EventComponent';
import {USER_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
const SocialActivity = () => {
  const {tokens} = useAuthContext();
  const [event, setEvent] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/category`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    console.log(response.data.data.ITK_sa);
    setEvent(response.data.data.ITK_sa);
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
            Social Activity
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{padding: 10, backgroundColor: 'white', flex: 1, marginTop: 20}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather
              name="chevron-left"
              size={27}
              color={'#404040'}
              style={{marginTop: -2}}
            />
          </Pressable>
          {/* <Text
            style={{
              color: '#191919',
              fontFamily: 'Poppins-Medium',
              fontSize: 17,
              marginLeft: 5,
            }}>
            Tech Events 🎉
          </Text> */}
        </View>
        <FlatList
          style={{marginBottom: 30, marginTop: 5, marginHorizontal: 5}}
          data={event}
          renderItem={({item}) => (
            <EventComponent tech={item} type={'FLAGSHIP'} />
          )}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
};

export default SocialActivity;
