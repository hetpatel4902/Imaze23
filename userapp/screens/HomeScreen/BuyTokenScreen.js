import {
  View,
  Text,
  Animated,
  ScrollView,
  Pressable,
  useWindowDimensions,
  ToastAndroid,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const BuyTokenScreen = () => {
  const scrollY = new Animated.Value(0);
  const [detail, setDetail] = useState(null);
  const {users, tokens} = useAuthContext();
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  useEffect(() => {
    userDetail();
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
  const userDetail = async () => {
    const response = await axios.get(
      `http://3.109.100.118:8000/api/v1/user/${users}`,
      {
        headers: {Authorization: `Bearer ${tokens}`},
      },
    );
    console.log(response.data.data);
    setDetail(response.data.data);
  };
  const buytoken = async () => {
    if (detail?.coins < 25) {
      Alert.alert(`You don't have sufficient balance.`);
    } else {
      const response = await axios.post(
        `http://3.109.100.118:8000/api/v1/user/purchase/tokens/${users}`,
        {Concert: 0, HappyStreet: 1},
        {
          headers: {Authorization: `Bearer ${tokens}`},
        },
      );
      showToastWithGravityAndOffset('1 token bought successfully');
      await userDetail();
    }
    // navigation.goBack();
  };
  const buyConcert = async () => {
    console.log(detail?.tokens);
    if (detail?.coins < 150) {
      Alert.alert(`You don't have sufficient balance.`);
    } else {
      const response = await axios.post(
        `http://3.109.100.118:8000/api/v1/user/purchase/tokens/${users}`,
        {Concert: 1, HappyStreet: 0},
        {
          headers: {Authorization: `Bearer ${tokens}`},
        },
      );
      showToastWithGravityAndOffset('Concert Pass bought successfully');
      await userDetail();
    }
  };
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
              textAlign: 'center',
              marginTop: 12,
            }}>
            Buy Tokens
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        style={{flex: 1, backgroundColor: 'white', marginTop: 50, padding: 20}}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            color: '#191919',
            fontSize: 15,
            marginTop: 5,
          }}>
          Coins: {detail?.coins}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            color: '#191919',
            fontSize: 15,
            marginTop: 5,
          }}>
          Tokens: {detail?.tokens}
        </Text>
        {/* {detail?.college == 'GCET' && (
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#191919',
              fontSize: 15,
              marginTop: 5,
            }}>
            Concert Pass: {detail?.concertToken}
          </Text>
        )} */}

        {detail?.college == 'GCET' && (
          <View>
            {/* <View
              style={{
                backgroundColor: 'gray',
                height: 0.8,
                marginTop: 35,
              }}></View> */}
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: '#1655BC',
                fontSize: 16,
                marginTop: 30,
              }}>
              Concert Pass
            </Text>
            {detail?.concertToken == 0 && (
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: '#000000',
                  fontSize: 13,
                  marginTop: 1,
                }}>
                (Cost of Pass = 150 coins)
              </Text>
            )}
            <Image
              source={require('../../data/ac.jpg')}
              style={{
                height: 200,
                width: 310,
                borderRadius: 20,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginTop: 10,
                opacity: detail?.concertToken ? 1 : 0.3,
                backgroundColor: 'black',
              }}
            />
            {detail?.concertToken == 0 && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#505050',
                  fontSize: 13,
                  marginTop: 10,
                }}>
                *Buy this pass to attend Concert
              </Text>
            )}
            {detail?.concertToken == 0 && (
              <Pressable
                onPress={buyConcert}
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
                  marginTop: 20,
                  backgroundColor: '#ff9600',
                  paddingVertical: 8,
                  borderRadius: 13,
                  maxWidth: width,
                  width: width - 46,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  Buy Concert Pass
                </Text>
              </Pressable>
            )}
          </View>
        )}
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: '#1655BC',
              fontSize: 16,
              marginTop: 30,
            }}>
            Token
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#000000',
              fontSize: 13,
              marginTop: 1,
            }}>
            (Cost of 1 Token = 25 coins)
          </Text>
          {/* <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#505050',
              fontSize: 13,
              marginTop: 10,
            }}>
            *Use this token to play Nukkad Carnival events
          </Text> */}
          {/* {detail?.tokens == 0 && ( */}
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#505050',
              fontSize: 13,
              marginTop: 10,
            }}>
            *Use this token to play Nukkad Carnival events
          </Text>
          {/* )} */}
          <Image
            source={{
              uri: 'https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/nukkadtoken1.jpg',
            }}
            style={{
              height: 200,
              width: 310,
              borderRadius: 20,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 10,
              opacity: detail?.tokens > 0 ? 1 : 0.3,
              backgroundColor: 'black',
            }}
          />
          <Pressable
            onPress={buytoken}
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
              paddingVertical: 8,
              borderRadius: 13,
              maxWidth: width,
              width: width - 46,
              marginBottom: 100,
            }}>
            <Text
              style={{
                color: 'white',
                alignSelf: 'center',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              Buy Token
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

export default BuyTokenScreen;
