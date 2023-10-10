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
  ScrollView,
  TextInput,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ComboDetail from './ComboDetail';
import {launchImageLibrary} from 'react-native-image-picker';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
// import Entypo from 'react-native-vector-icons/Entypo';
import {COLOR} from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

const StaticCombo = ({data, pending, bought, index}) => {
  const width = Dimensions.get('screen').width;
  const [events, setEvents] = useState(data?.events);
  const {tokens, users} = useAuthContext();
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [checkDetail, setCheckDetail] = useState(null);
  const [modal1, setModal1] = useState(null);
  const [image, setImage] = useState(null);
  const [transId, setTransId] = useState('');
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
  const showToastWithGravityAndOffset = async msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  const onlineTransaction = async () => {
    // console.log({
    //   orderId: checkDetail?.data._id,
    //   transId,
    //   transUrl: 'data:image/jpeg;base64' + image,
    //   isCombo: true,
    // });
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/online`,
      {
        orderId: checkDetail?.data._id,
        transId,
        transUrl: 'data:image/jpeg;base64' + image,
        isCombo: true,
      },
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    if (res.data.res == 'success') {
      setModal(false);
      setModal1(false);
      showToastWithGravityAndOffset(
        'Partially Registered,Your payment will be verified soon...',
      );
      navigation.goBack();
      navigation.goBack();
    }
  };

  const payOnline = () => {
    setModal(true);
    // console.log(eventDetail);
  };
  const scrollToTop = () => {
    setShow(true);
  };
  const payOffline = async () => {
    // console.log(checkDetail.data._id);
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: checkDetail?.data._id, isCombo: true},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setModal1(false);
    showToastWithGravityAndOffset('Show this otp at registration desk.');
    navigation.navigate('MyEvents');
  };
  const onBuyPressed = async () => {
    await check();
  };
  const downloadReceipt = () => {
    // console.log(tech);
    if (data?.receipt == '') {
      Alert.alert('Receipt not yet generated.Sorry for inconvenience.');
    } else {
      Linking.openURL(`${data?.receipt}`);
    }
  };
  // const payOnline = () => {};
  // const payOffline = async () => {
  //   const res = await axios.post(
  //     `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
  //     {orderId: checkDetail?.data._id, isCombo: true},
  //     {headers: {Authorization: `Bearer ${tokens}`}},
  //   );
  //   // console.log('event detail:', res.data);
  //   setModal(false);
  //   showToastWithGravityAndOffset();
  //   navigation.navigate('MyEvents');
  // };
  const check = async () => {
    const checkEvent = async () => {
      // console.log('event_id:', data._id);
      const response = await axios.post(
        `http://${USER_IP}/api/v1/user/combos/${users}/check`,
        {events: data.events, combotype: 'STATIC', price: data?.price},
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      // console.log(response.data);
      setCheckDetail(response.data);
      if (response.data.flag) {
        setModal1(true);
      } else {
        Alert.alert(`Your event timings are clashing.`);
      }
    };
    await checkEvent();
  };
  const [details, setDetails] = useState(null);
  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    // setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    // console.log(response.data.data);
    setDetails(response.data.data);
    // setLoginPending(false);
  };
  return (
    <>
      <View
        style={{
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 5,
          margin: 6,
          // padding: 10,
          paddingHorizontal: 10,
          // paddingVertical: 15,
          paddingBottom: 15,
          borderRadius: 20,
          marginTop: 15,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: '#232323',
            fontSize: 15,
            textAlign: 'center',
            marginTop: 15,
          }}>
          Combo {index + 1}
        </Text>
        <FlatList
          style={{marginBottom: 0}}
          data={events}
          renderItem={({item}) => <ComboDetail info={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: '#191919',
              alignSelf: 'center',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
            }}>
            Rs.{' '}
            {details?.university == 'CVMU'
              ? data?.price
              : Math.ceil(data?.price + data?.price * 0.18)}
          </Text>
          {/* {pending && ( */}
          {!bought && (
            <Pressable
              onPress={onBuyPressed}
              disabled={pending}
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
                backgroundColor: '#1655BC',
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
                {pending
                  ? data.payment_mode == 'ONLINE'
                    ? 'Pending'
                    : `OTP : ${data.cash_otp}`
                  : 'Buy Now'}
              </Text>
            </Pressable>
          )}
          {bought && (
            <Pressable
              onPress={downloadReceipt}
              // disabled={pending}
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
                backgroundColor: '#1655BC',
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
                Download Receipt
              </Text>
            </Pressable>
          )}
          {/* )} */}
        </View>
        {/* {!pending && (
          // <View
          //   style={{
          //     height: 0.5,
          //     marginVertical: 16,
          //     backgroundColor: 'grey',
          //     paddingHorizontal: 40,
          //   }}></View>
        )} */}
      </View>
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
                {'\u20B9'} {data?.price}
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
              any discrepancies found ,serious action will be taken against you.
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
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Submit
              </Text>
            </Pressable>
            <View style={{height: 40}}></View>
          </ScrollView>
        </View>
      </Modal>
      <Modal transparent={true} visible={modal1} animationType={'slide'}>
        <View style={{flex: 1, backgroundColor: '#000000aa'}}>
          <View style={{height: 175, alignItems: 'center'}}>
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
