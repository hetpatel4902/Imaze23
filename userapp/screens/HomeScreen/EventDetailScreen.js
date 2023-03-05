import {
  View,
  Text,
  Image,
  ScrollView,
  // Pressable,
  useWindowDimensions,
  Pressable,
  Dimensions,
  Modal,
  Alert,
  ToastAndroid,
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
import Entypo from 'react-native-vector-icons/Entypo';

const EventDetailScreen = () => {
  const width = useWindowDimensions().width;
  const route = useRoute();
  const [modal, setModal] = useState(false);
  const {tokens, users} = useAuthContext();
  const navigation = useNavigation();
  const eventId = route?.params.eventId;
  const selected = route?.params.selected;
  const pending = route?.params.pending;
  const bought = route?.params.bought;
  const otp = route?.params.otp;
  const [eventDetail, setEventDetail] = useState(null);
  const participant = eventDetail?.participants;
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [checkDetail, setCheckDetail] = useState(null);
  const [arr, setArr] = useState([]);
  // const width = Dimensions.get('screen').width;
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    console.log(e.nativeEvent);
  }, []);

  const showToastWithGravityAndOffset = async () => {
    ToastAndroid.showWithGravityAndOffset(
      'Provide this otp at Registration desk!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  useEffect(() => {
    events();
  }, []);
  const onPress = async () => {
    await check();
  };
  const payOnline = () => {};
  const payOffline = async () => {
    // console.log(checkDetail.data._id);
    // console.log(tokens);
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: checkDetail?.data._id, isCombo: false},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log('event detail:', res.data);
    setModal(false);
    showToastWithGravityAndOffset();
    navigation.navigate('MyEvents');
  };
  const check = async () => {
    const checkEvent = async () => {
      const response = await axios.post(
        `http://${USER_IP}/api/v1/user/events/${users}/check`,
        {price: eventDetail?.price, eid: eventDetail?._id},
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      setCheckDetail(response.data);
      if (response.data.flag == true) {
        Alert.alert(`Your ${response.data.data} events are clashing.`);
      } else {
        setModal(true);
      }
    };
    await checkEvent();
  };
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
              backgroundColor: '#05fa9c',
              paddingHorizontal: 14,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3.5,
              borderRadius: 18,
              shadowColor: '#05fa9c',
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
            <FontAwesome5 name="map-marker-alt" size={16} color={'#05fa9c'} />
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
              color={'#05fa9c'}
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
        {otp && (
          <Text
            style={{
              color: 'black',
              // alignSelf: 'center',
              fontFamily: 'Poppins-Regular',
              fontSize: 13,
              marginTop: 10,
              marginHorizontal: 20,
            }}>
            Show this otp at Registration desk for verfiying your payment: {otp}
          </Text>
        )}
        {/* {!selected && ( */}
        <Pressable
          onPress={onPress}
          disabled={bought || pending}
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
            paddingHorizontal: bought ? width / 2 - 90 : width / 2 - 54,
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
            {bought ? 'Already Bought' : pending ? 'Pending' : 'Buy'}
          </Text>
        </Pressable>
        {/* // )} */}
      </ScrollView>
      <Modal transparent={true} visible={modal} animationType={'slide'}>
        <View style={{flex: 1, backgroundColor: '#000000aa'}}>
          <View style={{height: 175, alignItems: 'center'}}>
            <Pressable
              onPress={() => setModal(false)}
              style={{
                backgroundColor: 'white',
                height: 35,
                width: 35,
                padding: 7,
                borderRadius: 17,
                alignItems: 'center',
                marginTop: 90,
              }}>
              <Entypo name="cross" size={21} color={'#000000'} />
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: '#ffffff',
              height: '100%',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              padding: 20,
            }}>
            <Image
              source={require('../../data/paymentMode.jpg')}
              style={{
                height: 217,
                width: 267,
                alignSelf: 'center',
                marginTop: 12,
              }}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#191919',
                fontSize: 17,
                textAlign: 'center',
                marginTop: 20,
              }}>
              Choose the Payment Mode
            </Text>
            <Pressable
              onPress={payOffline}
              style={{
                shadowColor: '#6949ff',
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,
                elevation: 14,
                alignContent: 'center',
                alignSelf: 'center',
                marginTop: 25,
                backgroundColor: '#6949ff',
                paddingVertical: 10,
                borderRadius: 13,
                maxWidth: width,
                width: width - 46,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Pay Offline
              </Text>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View
                style={{backgroundColor: 'grey', height: 1, flex: 3}}></View>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: '#454545',
                  fontSize: 13,
                  flex: 1,
                  textAlign: 'center',
                }}>
                OR
              </Text>
              <View
                style={{flex: 3, backgroundColor: 'grey', height: 1}}></View>
            </View>
            <Pressable
              onPress={payOnline}
              style={{
                shadowColor: '#53c2f0',
                // shadowColor: '#19347d',
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,
                elevation: 14,
                alignContent: 'center',
                alignSelf: 'center',
                marginTop: 25,
                backgroundColor: '#53c2f0',
                // backgroundColor: '#19347d',
                paddingVertical: 10,
                borderRadius: 13,
                maxWidth: width,
                // paddingHorizontal: width / 2 - 64,
                width: width - 46,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Paytm
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
