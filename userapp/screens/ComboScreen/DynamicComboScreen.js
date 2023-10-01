import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import {Alert} from 'react-native';

const DynamicComboScreen = () => {
  const {techArr, nonTechArr, workshopArr, visible, tokens, users, price} =
    useAuthContext();
  const navigation = useNavigation();
  const width = Dimensions.get('screen').width;
  const [modal, setModal] = useState(false);
  const [checkDetail, setCheckDetail] = useState(null);
  let arr = techArr.concat(nonTechArr);
  let varr = arr.concat(workshopArr);
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
    // console.log(price);
    // console.log(varr);
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
        {price: price, events: varr, combotype: 'DYNAMIC'},
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      console.log(response.data);
      setCheckDetail(response.data);
      if (response.data.flag == true) {
        Alert.alert(`Your event timings are clashing.`);
      } else {
        setModal(true);
      }
    };
    await checkEvent();
  };
  const techEvents = () => {
    navigation.navigate('DynamicTechSelectScreen');
  };
  const nontechEvents = () => {
    navigation.navigate('DynamicNonTechSelectScreen');
  };
  const workshop = () => {
    navigation.navigate('DynamicWorkshopSelectScreen');
  };
  const onBuy = () => {};
  return (
    <>
      <View style={styles.mainView}>
        <Text style={styles.mainTitle}>Select Dynamic Combo</Text>
        <Pressable onPress={techEvents} style={styles.eventBundle}>
          <View style={styles.eventImageView}>
            <Image
              source={require('../../data/events.jpg')}
              style={styles.eventImage}
            />
          </View>
          <View style={styles.eventTextView}>
            <Text style={styles.eventText}>Tech Events</Text>
          </View>
        </Pressable>
        <Pressable onPress={nontechEvents} style={styles.eventBundle}>
          <View style={styles.eventImageView}>
            <Image
              source={require('../../data/nonevents.jpg')}
              style={styles.eventImage}
            />
          </View>
          <View style={styles.eventTextView}>
            <Text style={styles.eventText}>Non-Tech Events</Text>
          </View>
        </Pressable>
        <Pressable onPress={workshop} style={styles.eventBundle}>
          <View style={styles.eventImageView}>
            <Image
              source={require('../../data/workshop.jpg')}
              style={styles.eventImage}
            />
          </View>
          <View style={styles.eventTextView}>
            <Text style={styles.eventText}>Workshops</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onBuyPressed}
          disabled={!visible}
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
            backgroundColor: visible ? '#6949ff' : 'grey',
            paddingVertical: 13,
            borderRadius: 13,
            marginTop: 40,
            // flex: 1,
            // maxWidth: width,
            // paddingHorizontal: width / 2 - 72,
            width: width - 45,
          }}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'center',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
            }}>
            Buy Combo
          </Text>
        </Pressable>
        {!visible && (
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              color: 'grey',
              marginTop: 15,
            }}>
            *Please Select Events to Buy Combo
          </Text>
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

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    color: '#101010',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  eventBundle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 7,
    borderRadius: 14,
  },
  eventView: {
    backgroundColor: 'white',
    marginVertical: 10,
    textAlign: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    height: 70,
    padding: 20,
  },
  eventImageView: {
    flex: 1,
  },
  eventImage: {
    height: 70,
    width: 70,
    borderRadius: 14,
  },
  eventTextView: {flex: 3.7},
  eventText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#000000',
  },
});

export default DynamicComboScreen;
