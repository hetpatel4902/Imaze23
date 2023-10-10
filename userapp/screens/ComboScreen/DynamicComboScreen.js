import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  ToastAndroid,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DynamicComboScreen = () => {
  const {techArr, nonTechArr, workshopArr, visible, tokens, users, price} =
    useAuthContext();
  const navigation = useNavigation();
  const width = Dimensions.get('screen').width;
  const [modal, setModal] = useState(false);
  const [checkDetail, setCheckDetail] = useState(null);
  const [modal1, setModal1] = useState(false);
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
  let arr = techArr.concat(nonTechArr);
  let varr = arr.concat(workshopArr);
  const showToastWithGravityAndOffset = async msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  const [details, setDetails] = useState('');
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
    } else {
      Alert.alert('Payment failed');
    }
  };

  const payOnline = () => {
    setModal(true);
    // console.log(eventDetail);
  };
  const onBuyPressed = async () => {
    await check();
    // console.log(price);
    // console.log(varr);
  };
  const payOffline = async () => {
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: checkDetail?.data._id, isCombo: true},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log('event detail:', res.data);
    setModal1(false);
    showToastWithGravityAndOffset('Show this otp at registration desk.');
    navigation.navigate('MyEvents');
  };
  const check = async () => {
    const checkEvent = async () => {
      // console.log('event_id:', varr);
      const response = await axios.post(
        `http://${USER_IP}/api/v1/user/combos/${users}/check`,
        {
          events: varr,
          combotype: 'DYNAMIC',
          price:
            details?.university == 'CVMU' ? 200 : Math.ceil(200 + 200 * 0.18),
        },
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      console.log(response.data);
      setCheckDetail(response.data);
      if (response.data.flag) {
        setModal1(true);
      } else {
        Alert.alert(`Your event timings are clashing.`);
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
            Select Dynamic Combo
          </Text>
        </View>
      </Animated.View>
      <ScrollView style={styles.mainView}>
        {/* <Text style={styles.mainTitle}>Select Dynamic Combo</Text> */}
        <Pressable onPress={techEvents} style={styles.eventBundle}>
          <View style={styles.eventImageView}>
            <Image
              source={require('../../data/tech.png')}
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
              source={require('../../data/nontech.png')}
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
              source={require('../../data/Vocational.png')}
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
            shadowColor: visible ? '#1655BC' : 'none',
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
            backgroundColor: visible ? '#1655BC' : 'grey',
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
              color: 'gray',
              marginTop: 15,
              marginHorizontal: 15,
            }}>
            *Please Select Events to Buy Combo
          </Text>
        )}
      </ScrollView>
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
                elevation: 14,
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
          </View>
        </View>
      </Modal>
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
                  ? 200
                  : Math.ceil(200 + 200 * 0.18)}
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
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    flex: 1,
    // padding: 16,
    marginTop: 60,
  },
  mainTitle: {
    color: '#101010',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    // marginLeft: 10,
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
    height: 68,
    marginHorizontal: 16,
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
    height: 38,
    width: 38,
    borderRadius: 5,
    marginHorizontal: 8,
    resizeMode: 'contain',
    marginLeft: 14,
  },
  eventTextView: {flex: 4.5},
  eventText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#000000',
    marginLeft: 5,
  },
});

export default DynamicComboScreen;
