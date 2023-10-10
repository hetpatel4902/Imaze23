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
  Platform,
  PermissionsAndroid,
  PermissionStatus,
  Permission,
  Button,
  TextInput,
  Linking,
  // PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'rn-fetch-blob';

import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
// import PartyLoader from '../../components/PartyLoader';
import PartySprayLoader from '../../components/PartySprayLoader';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Entypo from 'react-native-vector-icons/Entypo';
import {COLOR} from '@env';
import {launchImageLibrary} from 'react-native-image-picker';
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
  const certificate = route?.params.certificate;
  const type = route?.params.type;
  const [status, setStatus] = useState(false);
  // const [transId,setTransId] = useState(null);
  // const [modal2, setModal2] = useState(false);
  // const certificateStatus = route?.params.certificateStatus;
  const [eventDetail, setEventDetail] = useState(null);
  const participant = eventDetail?.participants;
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [checkDetail, setCheckDetail] = useState(null);
  const [arr, setArr] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const registerSa = async () => {
    // const checkUser = async () => {
    const response = await axios.post(
      `http://${USER_IP}/api/v1/user/flagship/register`,
      {eid: eventDetail?._id, uid: users},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    console.log(response.data);
    showToastWithGravityAndOffset('Registered Successfully');
    // console.log(response.data.flag);
    //   setVerifyGroup(response.data);
    // };
  };
  useEffect(() => {
    fetchUserDetail();
  }, []);
  const [details, setDetails] = useState(null);
  const fetchUserDetail = async () => {
    setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    console.log(response.data.data);
    setDetails(response.data.data);
    setLoginPending(false);
  };
  // const width = Dimensions.get('screen').width;
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  const showToastWithGravityAndOffset = async msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
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
  const [verifyGroup, setVerifyGroup] = useState(null);
  const onParticipate = async () => {
    if (eventDetail?.event_type == 'CULTURAL') {
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/cultural/participate/group`,
          {
            uid: users,
            eid: eventDetail?._id,
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data.flag);
        setVerifyGroup(response.data);
      };
      await checkUser();
      if (response.data.flag) {
        // setModal1(true);
        navigation.navigate('RegisterTeam', {
          eid: eventDetail?._id,
          eventDetail: eventDetail,
        });
      } else {
        showToastWithGravityAndOffset(
          'You have already registered for this event',
        );
      }
      // console.log('hello');
    } else if (eventDetail?.event_type == 'NORMAL') {
      // console.log('this is not cultural event');
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/normal/participate/group`,
          {eid: eventDetail?._id, uid: users},
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data);
        setVerifyGroup(response.data);
      };
      await checkUser();
      if (response.data.flag) {
        // setModal1(true);
        navigation.navigate('RegisterTeam', {
          eid: eventDetail?._id,
          eventDetail: eventDetail,
        });
      } else {
        // console.log(eventDetail.name);
        if (response.data.data == 'You are already in a team!') {
          Alert.alert(response.data.data);
        } else {
          const count = response.data.data
            .flat()
            .filter(event => event === eventDetail?.name).length;
          if (count == 2) {
            showToastWithGravityAndOffset(
              'You have already registered for this event',
            );
          } else {
            showToastWithGravityAndOffset(
              'Your event timings are clashing with previously registered events.',
            );
          }
        }
      }
    } else if (eventDetail?.event_type == 'FLAGSHIP') {
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/flagship/participate/group`,
          {eid: eventDetail?._id, uid: users},
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data.flag);
        setVerifyGroup(response.data);
      };
      await checkUser();
      if (response.data.flag) {
        // setModal1(true);
        navigation.navigate('RegisterTeam', {
          eid: eventDetail?._id,
          eventDetail: eventDetail,
        });
      } else {
        // console.log(eventDetail.name);
        if (response.data.data == 'You are already in a team!') {
          Alert.alert(response.data.data);
        } else {
          const count = response.data.data
            .flat()
            .filter(event => event === eventDetail?.name).length;
          if (count == 2) {
            showToastWithGravityAndOffset(
              'You have already registered for this event',
            );
          } else {
            showToastWithGravityAndOffset(
              'Your event timings are clashing with previously registered events.',
            );
          }
        }
      }
    }
  };
  const payOnline = () => {
    setModal(true);
  };
  const [transId, setTransId] = useState('');
  const [transUrl, setTransUrl] = useState('');
  const [onSubmit, setOnSubmit] = useState(false);
  const onlineTransaction = async () => {
    // console.log('transId:', transId);
    // console.log('transUrl:', image);
    setOnSubmit(true);
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/online`,
      {
        orderId: verify?.data._id,
        transId,
        transUrl: image,
        isCombo: false,
      },
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(res.data.res);

    if (res.data.res == 'success') {
      setOnSubmit(false);
      setModal(false);
      setModal1(false);
      showToastWithGravityAndOffset(
        'Partially Registered,Your payment will be verified soon...',
      );
      navigation.goBack();
    }
  };
  const payOffline = async () => {
    // console.log(verify.data._id);
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: verify?.data._id, isCombo: false},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setModal1(false);
    showToastWithGravityAndOffset('Show this otp at registration desk.');
    navigation.navigate('MyEvents');
  };
  // Function to pick an image from the device
  const [image, setImage] = useState(null);

  const openImagePicker = async () => {
    // console.log(image);
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Set this to true to include base64 data
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const base64Image = response.base64; // Get the base64 representation

        // console.log(response.assets[0].base64);
        setImage(response.assets[0].base64); // Log the base64 data
        // setImage(imageUri);
      }
    });
  };
  const [verify, setVerify] = useState(null);
  const check = async () => {
    if (eventDetail?.event_type == 'CULTURAL') {
      // console.log(users);
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/cultural/participate/solo`,
          {
            eid: eventDetail?._id,
            uid: users,
            price:
              details?.university == 'CVMU'
                ? eventDetail?.price
                : Math.ceil(eventDetail?.price + eventDetail?.price * 0.18),
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data.flag);
        setVerify(response.data);
      };
      await checkUser();
      if (response.data.flag) {
        setModal1(true);
      } else {
        showToastWithGravityAndOffset(
          'You have already registered for this event',
        );
      }
      // console.log('hello');
    } else if (eventDetail?.event_type == 'NORMAL') {
      // console.log('this is not cultural event');
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/normal/participate/solo`,
          {
            uid: users,
            eid: eventDetail?._id,
            price:
              details?.university == 'CVMU'
                ? eventDetail?.price
                : Math.ceil(eventDetail?.price + eventDetail?.price * 0.18),
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data);
        setVerify(response.data);
      };
      await checkUser();

      if (response.data.flag) {
        setModal1(true);
      } else {
        // console.log(eventDetail.name);
        const count = response.data.data
          .flat()
          .filter(event => event === eventDetail?.name).length;
        if (count == 2) {
          showToastWithGravityAndOffset(
            'You have already registered for this event',
          );
        } else {
          showToastWithGravityAndOffset(
            'Your event timings are clashing with previously registered events.',
          );
        }
      }
    } else if (eventDetail?.event_type == 'FLAGSHIP') {
      let response;
      const checkUser = async () => {
        response = await axios.post(
          `http://${USER_IP}/api/v1/user/flagship/participate/solo`,
          {
            eid: eventDetail?._id,
            uid: users,
            price:
              details?.university == 'CVMU'
                ? eventDetail?.price
                : Math.ceil(eventDetail?.price + eventDetail?.price * 0.18),
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        // console.log(response.data);
        setVerify(response.data);
      };
      await checkUser();

      if (response.data.flag) {
        setModal1(true);
      } else {
        // console.log(eventDetail.name);
        Alert.alert('You have already registered for this event');
        showToastWithGravityAndOffset(
          'You have already registered for this event',
        );
      }
    }
    // const checkEvent = async () => {
    //   // console.log(users);
    //   // console.log(tokens);
    //   const response = await axios.post(
    //     `http://${USER_IP}/api/v1/user/events/${users}/check`,
    //     {price: eventDetail?.price, eid: eventDetail?._id},
    //     {headers: {Authorization: `Bearer ${tokens}`}},
    //   );
    //   setCheckDetail(response.data);
    //   if (response.data.flag == true) {
    //     Alert.alert(`Your ${response.data.data} events are clashing.`);
    //   } else {
    //     setModal(true);
    //   }
    // };
    // await checkEvent();
  };
  // let response;
  // useEffect(() => {
  //   checkCertificateVisibility();
  // }, []);
  // const checkCertificateVisibility = async () => {
  //   console.log(eventDetail?.event_type);
  //   const response = await axios.get(
  //     `http://3.109.100.118:8000/api/v1/user/certificates/${users}/visibility/${eventId}?type=${eventDetail?.event_type}`,
  //     {
  //       headers: {Authorization: `Bearer ${tokens}`},
  //     },
  //   );
  //   console.log(response.data.data);
  // };
  const download = async () => {
    const response1 = await axios.get(
      `http://3.109.100.118:8000/api/v1/user/certificates/${users}/visibility/${eventId}?type=${eventDetail?.event_type}`,
      {
        headers: {Authorization: `Bearer ${tokens}`},
      },
    );
    if (response1.data.data) {
      const response = await axios.get(
        `http://3.109.100.118:8000/api/v1/user/certificates/${users}/event/${eventId}?type=${eventDetail?.event_type}`,
        {
          headers: {Authorization: `Bearer ${tokens}`},
        },
      );
      // console.log(response.data);
      Linking.openURL(`${response?.data?.data}`);
      // setEventDetail(response.data.data);
    } else {
      Alert.alert('You have to attend event in order to get certificate.');
    }
  };

  const events = async () => {
    const response = await axios.get(
      `http://3.109.100.118:8000/api/v1/user/events/${eventId}?type=${type}`,
      {
        headers: {Authorization: `Bearer ${tokens}`},
      },
    );
    console.log(response.data.data);
    setEventDetail(response.data.data);
    // if (certificate) {
    //   const res = await axios.get(
    //     `http://${USER_IP}/api/v1/user/certificates/${users}/visibility/${response.data.data._id}`,
    //     {headers: {Authorization: `Bearer ${tokens}`}},
    //   );
    //   console.log(res.data.data);
    //   setStatus(res.data.data);
    // }
  };
  console.log(eventDetail?.image);
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <View style={{}}>
        <View style={{backgroundColor: '#000000'}}>
          <Image
            source={{uri: `${eventDetail?.image}`}}
            // source={require('../../data/groupSinging.png')}
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
                  fontSize: 16,
                  width:
                    eventDetail?.price == 0 || eventDetail?.price == -1
                      ? // eventDetail?.price == -2
                        'auto'
                      : 200,
                  color: '#191919',
                }}>
                {eventDetail?.name}
              </Text>
            </View>
            {eventDetail?.price != 0 && eventDetail?.price != -1 && (
              <View
                style={{
                  backgroundColor: '#ff9600',
                  paddingHorizontal: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 3.5,
                  borderRadius: 18,
                  shadowColor: 'gray',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 14,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 13,
                  }}>
                  {eventDetail?.category == 'HappyStreet'
                    ? '1 token/event'
                    : eventDetail?.type == 'GROUP'
                    ? `Rs.${
                        details?.university == 'CVMU'
                          ? `${eventDetail?.price}/Team`
                          : `${Math.ceil(
                              eventDetail?.price + eventDetail?.price * 0.18,
                            )}/Team`
                      }`
                    : `Rs.${
                        details?.university == 'CVMU'
                          ? eventDetail?.price
                          : Math.ceil(
                              eventDetail?.price + eventDetail?.price * 0.18,
                            )
                      }`}
                </Text>
              </View>
            )}
          </View>

          {eventDetail?.type == 'GROUP' && (
            <View style={{marginHorizontal: 20, marginTop: 2}}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12}}>
                Group Event
              </Text>
            </View>
          )}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 15,
              fontSize: 13,
              // paddingHorizontal: 5,
              // backgroundColor: 'blue',
            }}>
            <Text style={{fontFamily: 'Poppins-SemiBold', color: '#191919'}}>
              Description
            </Text>
            {eventDetail?.type == 'GROUP' && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  // marginTop: 10,
                  color: 'grey',
                  // width: 200,
                  // marginHorizontal: 20,
                }}>
                {/* {eventDetail?.category} */}- Max. members:{' '}
                {eventDetail?.max_members}
              </Text>
            )}
            {eventDetail?.type == 'GROUP' && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  // marginTop: 10,
                  color: 'grey',
                  // width: 200,
                  // marginHorizontal: 20,
                }}>
                {/* {eventDetail?.category} */}- Min. members:{' '}
                {eventDetail?.min_members}
              </Text>
            )}

            <Text
              onTextLayout={onTextLayout}
              numberOfLines={
                textShown
                  ? undefined
                  : eventDetail?.category == 'ITK_exhibition'
                  ? 8
                  : 2
              }
              style={{
                lineHeight: 21,
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
                color: 'gray',
                // textAlign: 'justify',
              }}>
              {eventDetail?.description}
            </Text>
            {lengthMore ? (
              <Text
                onPress={toggleNumberOfLines}
                style={{
                  lineHeight: 21,
                  marginTop: 4,
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: '#1655BC',
                }}>
                {textShown ? 'Read less...' : 'Read more...'}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 12,
              // backgroundColor: 'blue',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                flex: 1,
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 17,
                  backgroundColor: '#fff7eb',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={18}
                  color={'#ff9600'}
                />
              </View>
              <View style={{flex: 7, marginHorizontal: 10}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#242424',
                    fontSize: 13,
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
                // marginTop: 10,
                flex: 1,
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  marginTop: 7,
                  borderRadius: 17,
                  backgroundColor: '#fff7eb',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialCommunityIcons
                  name="calendar-week"
                  size={18}
                  color={'#ff9600'}
                />
              </View>
              <View style={{flex: 7, marginHorizontal: 10, marginTop: 8}}>
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
                    fontSize: 12,
                  }}>
                  {eventDetail?.time}
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginHorizontal: 20, marginTop: 9}}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#242424',
                fontSize: 13,
              }}>
              Event Coordinator:
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: '#242424',
                fontSize: 12,
              }}>
              {eventDetail?.event_coordinator[0]?.name} (
              {eventDetail?.event_coordinator[0]?.phoneno})
            </Text>
            {eventDetail?.event_coordinator[1] && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#242424',
                  fontSize: 12,
                  marginBottom:
                    eventDetail?.category == 'ITK_exhibition' ? 600 : 0,
                }}>
                {eventDetail?.event_coordinator[1]?.name} (
                {eventDetail?.event_coordinator[1]?.phoneno})
              </Text>
            )}
          </View>
          {otp > 0 && (
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
                marginTop: 10,
                marginHorizontal: 20,
              }}>
              Show this otp at Registration desk for verfiying your payment:{' '}
              {otp}
            </Text>
          )}
          {otp == 0 && (
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
                marginTop: 10,
                marginHorizontal: 20,
              }}>
              Your payment will be verified within 2 working days.
            </Text>
          )}
          {certificate && (
            <Pressable
              onPress={download}
              // disabled={!status}
              style={{
                shadowColor: '#1655BC',
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
                backgroundColor: '#1655BC',
                paddingVertical: 10,
                borderRadius: 13,
                width: width - 50,
                opacity: selected ? 0 : 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                Download Certificate
              </Text>
            </Pressable>
          )}
          {!status && eventDetail?.category != 'ITK_exhibition' && (
            <Text
              style={{
                color: '#303030',
                // alignSelf: 'center',
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
                marginTop: 10,
                marginHorizontal: 20,
              }}>
              *Attend the event to get the certificate
            </Text>
          )}
          {!status &&
            eventDetail?.isAvailable &&
            eventDetail?.type == 'SOLO' &&
            eventDetail?.category != 'HappyStreet' &&
            !certificate &&
            eventDetail?.category != 'ITK_sa' &&
            eventDetail?.price != -1 && (
              <Pressable
                onPress={onPress}
                disabled={bought || pending}
                style={{
                  shadowColor: '#1655BC',
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
                  backgroundColor: '#1655BC',
                  paddingVertical: 10,
                  borderRadius: 13,
                  flex: 1,
                  width: width - 50,
                  marginBottom: 630,
                  opacity: selected ? 0 : 1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}>
                  {bought ? 'Already Bought' : pending ? 'Pending' : 'Buy'}
                </Text>
              </Pressable>
            )}
          {eventDetail?.price == 0 && (
            <Pressable
              onPress={registerSa}
              // disabled={bought || pending}
              style={{
                shadowColor: '#1655BC',
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
                backgroundColor: '#1655BC',
                paddingVertical: 10,
                borderRadius: 13,
                flex: 1,
                width: width - 50,
                marginBottom: 630,
                opacity: selected ? 0 : 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                Register
              </Text>
            </Pressable>
          )}
          {eventDetail?.category == 'HappyStreet' && (
            <Pressable
              onPress={() => navigation.navigate('BuyTokenScreen')}
              // disabled={bought || pending}
              style={{
                shadowColor: '#1655BC',
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
                backgroundColor: '#1655BC',
                paddingVertical: 10,
                borderRadius: 13,
                flex: 1,
                width: width - 50,
                marginBottom: 630,
                opacity: selected ? 0 : 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                Buy tokens
              </Text>
            </Pressable>
          )}
          {!status &&
            eventDetail?.isAvailable &&
            eventDetail?.type == 'GROUP' && (
              <Pressable
                onPress={onParticipate}
                disabled={bought || pending}
                style={{
                  shadowColor: '#1655BC',
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
                  backgroundColor: '#1655BC',
                  paddingVertical: 10,
                  borderRadius: 13,
                  flex: 1,
                  width: width - 50,
                  marginBottom: 630,
                  opacity: selected ? 0 : 1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}>
                  {bought
                    ? 'Already Bought'
                    : pending
                    ? 'Pending'
                    : 'Register Team'}
                </Text>
              </Pressable>
            )}
          <View style={{height: 50}}></View>
          {/* // )} */}
        </ScrollView>
        <Modal transparent={true} visible={modal} animationType={'slide'}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View style={{height: 145, alignItems: 'center'}}>
              <Pressable
                onPress={() => setModal(false)}
                style={{
                  backgroundColor: 'white',
                  height: 35,
                  width: 35,
                  padding: 7,
                  borderRadius: 17,
                  alignItems: 'center',
                  marginTop: 60,
                }}>
                <Entypo name="cross" size={21} color={'#000000'} />
              </Pressable>
            </View>
            <ScrollView
              style={{
                backgroundColor: '#ffffff',
                height: '100%',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#191919',
                    fontSize: 17,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  Pay{'  '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: '#1655BC',
                    fontSize: 19,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  {'\u20B9'}{' '}
                  {details?.university == 'CVMU'
                    ? eventDetail?.price
                    : Math.ceil(eventDetail?.price + eventDetail?.price * 0.18)}
                  {'  '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#191919',
                    fontSize: 17,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  Online
                </Text>
              </View>
              <Image
                source={{
                  uri: 'https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/qrcode.jpeg',
                }}
                style={{
                  height: 225,
                  width: 267,
                  alignSelf: 'center',
                  marginTop: 0,
                  resizeMode: 'contain',
                }}
              />
              {/* <Button title="Pick Image" onPress={openImagePicker} /> */}
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#000000',
                }}>
                *Note: Your payment will be verified by accouts team, in case of
                any discrepancies found ,serious action will be taken against
                you.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <MaterialCommunityIcons
                  name="cash"
                  size={20}
                  color={'#757575'}
                  style={{marginRight: 3}}
                />
                <TextInput
                  onChangeText={setTransId}
                  placeholderTextColor="grey"
                  placeholder="Transaction ID"
                  value={transId}
                  style={{
                    height: 40,
                    marginLeft: 4,
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: '#d1cfcf',
                    marginVertical: 5,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingBottom: 9,
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#212121',
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#000000',
                }}>
                *Note: Transaction ID should be visible in your screenshot
              </Text>
              <View style={{}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: '#000000',
                  }}>
                  Transaction Image:
                </Text>
                {image && (
                  <Image
                    source={{uri: `data:image/jpeg;base64,${image}`}}
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                )}
                <Pressable
                  onPress={openImagePicker}
                  style={{
                    height: 38,
                    width: 205,
                    borderRadius: 5,
                    backgroundColor: '#1655BC',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 15,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    {image ? 'Update Image' : 'Upload Image'}
                  </Text>
                  <Feather
                    name="upload"
                    size={20}
                    color={'white'}
                    style={{marginLeft: 8}}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={onlineTransaction}
                disabled={onSubmit}
                style={{
                  shadowColor: '#ff9600',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#ff9600',
                  paddingVertical: 10,
                  borderRadius: 13,
                  maxWidth: width,
                  width: width - 46,
                  opacity: onSubmit ? 0.7 : 1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  {onSubmit ? `Processing...` : `Submit`}
                </Text>
              </Pressable>
              <View style={{height: 40}}></View>
            </ScrollView>
          </View>
        </Modal>
        <Modal transparent={true} visible={modal1} animationType={'slide'}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View style={{height: 145, alignItems: 'center'}}>
              <Pressable
                onPress={() => setModal1(false)}
                style={{
                  backgroundColor: 'white',
                  height: 35,
                  width: 35,
                  padding: 7,
                  borderRadius: 17,
                  alignItems: 'center',
                  marginTop: 60,
                }}>
                <Entypo name="cross" size={21} color={'#000000'} />
              </Pressable>
            </View>
            <ScrollView
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
                  shadowColor: '#1655BC',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#1655BC',
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
                // disabled={onSubmit}
                style={{
                  shadowColor: '#ff9600',
                  // shadowColor: '#19347d',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#ff9600',
                  // backgroundColor: '#19347d',
                  paddingVertical: 10,
                  borderRadius: 13,
                  maxWidth: width,
                  // paddingHorizontal: width / 2 - 64,
                  width: width - 46,
                  // opacity: onSubmit ? 0.6 : 1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  Pay Online
                </Text>
              </Pressable>
              <View style={{height: 40}}></View>
            </ScrollView>
          </View>
        </Modal>
      </View>
      {loginPending ? <PartySprayLoader /> : null}
    </>
  );
};

export default EventDetailScreen;
