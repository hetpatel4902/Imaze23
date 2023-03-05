import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  ToastAndroid,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ComboDetail from './ComboDetail';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

const StaticCombo = ({data, pending}) => {
  const width = Dimensions.get('screen').width;
  const [events, setEvents] = useState(data?.events);
  const {tokens, users} = useAuthContext();
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [checkDetail, setCheckDetail] = useState(null);

  const showToastWithGravityAndOffset = async () => {
    ToastAndroid.showWithGravityAndOffset(
      'Provide this otp at Registration desk!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  const onBuyPressed = async () => {
    await check();
  };
  const payOnline = () => {};
  const payOffline = async () => {
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: checkDetail?.data._id, isCombo: true},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log('event detail:', res.data);
    setModal(false);
    showToastWithGravityAndOffset();
    navigation.navigate('MyEvents');
  };
  const check = async () => {
    const checkEvent = async () => {
      // console.log('event_id:', data._id);
      const response = await axios.post(
        `http://${USER_IP}/api/v1/user/combos/${users}/check`,
        {price: data?.price, events: data.events, combotype: 'STATIC'},
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      // console.log(response.data);
      setCheckDetail(response.data);
      if (response.data.flag == true) {
        Alert.alert(`Your event timings are clashing.`);
      } else {
        setModal(true);
      }
    };
    await checkEvent();
  };
  return (
    <>
      <View style={{backgroundColor: '#ffffff'}}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            color: '#232323',
            fontSize: 14,
          }}>
          {data?.name}
        </Text>
        <FlatList
          style={{}}
          data={events}
          renderItem={({item}) => <ComboDetail info={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
        <Text
          style={{
            color: 'grey',
            alignSelf: 'center',
            fontFamily: 'Poppins-Regular',
            fontSize: 11,
            marginVertical: 10,
          }}>
          Please provide this OTP at Registration Desk for Verifying your
          Payment.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Text
            style={{
              color: '#191919',
              alignSelf: 'center',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
            }}>
            Rs. {data.price}
          </Text>
          {/* {pending && ( */}
          <Pressable
            onPress={onBuyPressed}
            disabled={pending}
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
              backgroundColor: '#6949ff',
              paddingVertical: 8,
              borderRadius: 14,
            }}>
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginHorizontal: 30,
              }}>
              {pending ? `OTP : ${data.cash_otp}` : 'Buy Now'}
            </Text>
          </Pressable>
          {/* )} */}
        </View>
        {!pending && (
          <View
            style={{
              height: 0.5,
              marginVertical: 16,
              backgroundColor: 'grey',
              paddingHorizontal: 40,
            }}></View>
        )}
      </View>
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
    </>
  );
};

export default StaticCombo;

// [
//   {
//     _id: '63f131713d0a313b08b35e4c',
//     events: [[Object], [Object], [Object], [Object]],
//     price: 400,
//   },
// ];
// [
//   {
//     __v: 0,
//     _id: '63f0e0bae6a372318c77c18e',
//     attendance: ['63d2ca8457c9b94490687651', '63f112d1e76d880f2cc83b99'],
//     category: 'Tech',
//     date: '18-2-2023',
//     description: 'Super Event',
//     event_coordinator: [['Object']],
//     image: 'Techy Ludo.png',
//     isAvailable: true,
//     name: 'Techy Ludo',
//     participants: [
//       '63f112d1e76d880f2cc83b99',
//       '63f112e3e76d880f2cc83b9b',
//       '63d2ca8457c9b94490687651',
//       '63f1cebe4271243798c03f5f',
//     ],
//     price: 100,
//     time: '10:45',
//     totalwinners: 3,
//     venue: 'GFL2',
//     winner: [
//       '63f112e3e76d880f2cc83b9b',
//       '63f112d1e76d880f2cc83b99',
//       '63d2ca8457c9b94490687651',
//     ],
//   },
// ];
