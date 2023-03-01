import {
  View,
  Text,
  Image,
  ScrollView,
  // Pressable,
  useWindowDimensions,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
const EventDetailScreen = () => {
  const width = useWindowDimensions().width;
  const route = useRoute();
  const {tokens} = useAuthContext();
  const navigation = useNavigation();
  const eventId = route?.params.eventId;
  const selected = route?.params.selected;
  const [eventDetail, setEventDetail] = useState(null);
  const participant = eventDetail?.participants;
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  // const width = Dimensions.get('screen').width;
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    console.log(e.nativeEvent);
  }, []);

  useEffect(() => {
    events();
  }, []);
  const onPress = () => {};
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/${eventId}`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(response.data.data.category);
    setEventDetail(response.data.data);
  };
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View style={{}}>
      {/* <Text>{eventDetail?.name}</Text> */}
      <View style={{backgroundColor: '#ededed'}}>
        <Image
          source={{uri: `http://10.0.2.2:8000/${eventDetail?.image}`}}
          style={{height: 250, alignSelf: 'center', width: width}}
        />
        <Pressable
          onPress={onBack}
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            height: 32,
            width: 32,
            borderRadius: 16,
            position: 'absolute',
            top: 12,
            left: 12,
          }}>
          <AntDesign name="arrowleft" size={24} color={'#141414'} />
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          backgroundColor: 'white',
          height: 1000,
          width: width,
          position: 'absolute',
          top: 215,
        }}>
        <View style={{alignContent: 'center', alignSelf: 'center'}}>
          <Octicons name="dash" color={'grey'} size={45} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            justifyContent: 'space-between',
            marginTop: -7,
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 17,
                color: '#191919',
              }}>
              {eventDetail?.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 13,
                marginTop: -5,
                color: 'grey',
              }}>
              {eventDetail?.category}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#33e835',
              paddingHorizontal: 14,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3.5,
              borderRadius: 18,
              shadowColor: '#33e835',
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 14,
            }}>
            <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
              Rs.{eventDetail?.price}
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 20, marginTop: 2}}>
          <Text style={{fontFamily: 'Poppins-Medium'}}>
            Participants: {participant?.length}
          </Text>
        </View>
        <View style={{marginHorizontal: 20, marginTop: 5}}>
          <Text style={{fontFamily: 'Poppins-SemiBold', color: '#191919'}}>
            Description
          </Text>
          <Text
            onTextLayout={onTextLayout}
            numberOfLines={textShown ? undefined : 2}
            style={{lineHeight: 21, fontFamily: 'Poppins-Regular'}}>
            {eventDetail?.description}
          </Text>

          {lengthMore ? (
            <Text
              onPress={toggleNumberOfLines}
              style={{
                lineHeight: 21,
                marginTop: 4,
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
                color: '#6949ff',
              }}>
              {textShown ? 'Read less...' : 'Read more...'}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 7,
          }}>
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: '#f0faf0',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              // alignItems: 'center',
            }}>
            <FontAwesome5 name="map-marker-alt" size={16} color={'#33e835'} />
          </View>
          <View style={{flex: 7, marginHorizontal: 10}}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#242424',
                fontSize: 14,
              }}>
              {eventDetail?.venue}{' '}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <View
            style={{
              height: 30,
              width: 30,
              marginTop: 7,
              borderRadius: 15,
              backgroundColor: '#f0faf0',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              // alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="calendar-week"
              size={16}
              color={'#33e835'}
            />
          </View>
          <View style={{flex: 7, marginHorizontal: 10}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: '#242424',
                fontSize: 12,
              }}>
              {eventDetail?.date}{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#242424',
                fontSize: 13,
              }}>
              {eventDetail?.time}
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 20, marginTop: 9}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#242424',
            }}>
            Event Coordinator:
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#242424',
              fontSize: 13,
            }}>
            {eventDetail?.event_coordinator[0]?.name} (
            {eventDetail?.event_coordinator[0]?.phoneno})
          </Text>
          {eventDetail?.event_coordinator[1] && (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: '#242424',
                fontSize: 13,
              }}>
              {eventDetail?.event_coordinator[1]?.name} (
              {eventDetail?.event_coordinator[1]?.phoneno})
            </Text>
          )}
        </View>
        {/* {!selected && ( */}
        <Pressable
          onPress={onPress}
          style={{
            shadowColor: '#4b2be3',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
            alignContent: 'center',
            alignSelf: 'center',
            marginTop: 13,
            backgroundColor: '#6949ff',
            paddingVertical: 10,
            borderRadius: 13,
            flex: 1,
            maxWidth: width,
            paddingHorizontal: width / 2 - 54,
            marginBottom: 630,
            opacity: selected ? 0 : 1,
          }}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'center',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 15,
            }}>
            Buy
          </Text>
        </Pressable>
        {/* // )} */}
      </ScrollView>
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
