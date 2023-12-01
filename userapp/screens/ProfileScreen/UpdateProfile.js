import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  useWindowDimensions,
  TextInput,
  Pressable,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import AppLoader from '../../components/AppLoader';
// import AppLoader from '../components/AppLoader';
// import {useAuthContext} from '../src/Context/AuthContext';
import {useAuthContext} from '../../src/Context/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {USER_IP, COLOR} from '@env';

const UpdateProfile = () => {
  const {height, width} = useWindowDimensions();
  const {users, tokens, loginPending, setLoginPending} = useAuthContext();
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [diploma, setDiploma] = useState(false);
  const [year, setYear] = useState('');
  // const {control, handleSubmit, watch} = useForm();
  // const pwd = watch('password');
  const navigation = useNavigation();
  const [details, setDetails] = useState(null);
  // const [loadingPending, setLoadingPending] = useState(false);
  const [name, setName] = useState('');
  // const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async data => {
    {
      try {
        setLoginPending(true);
        // const fetchUserDetail = async () => {
        setLoginPending(true);
        const response = await axios.get(
          `http://${USER_IP}/api/v1/user/${users}`,
          {
            headers: {Authorization: `Bearer ${tokens}`},
          },
        );
        // console.log(response.data.data);
        // console.log(response.data.data);
        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setYear(response.data.data.year);
        if (response.data.data.year == '1') {
          setOne(true);
        } else if (response.data.data.year == '2') {
          setTwo(true);
        } else if (response.data.data.year == '3') {
          setThree(true);
        } else if (response.data.data.year == '4') {
          setFour(true);
        } else {
          setDiploma(true);
        }
        setDetails(response.data.data);
        setLoginPending(false);
        // };
        // setName(response.data.data.name);
        // setAddress(response.data.data.address);
        // setLoginPending(false);
      } catch (err) {
        setLoginPending(false);
        Alert.alert(err);
      }
    }
  };
  const onUpdatePressed = async data => {
    {
      try {
        setLoginPending(true);
        const response = await axios.post(
          `http://${USER_IP}/api/v1/user/${users}`,
          {
            name: name,
            email: email,
            year: year,
          },
          {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          },
        );
        const obj = {
          token: tokens,
          userID: users,
          name: name,
        };
        const jsonValue = JSON.stringify(obj);
        await AsyncStorage.setItem('userDetail', jsonValue);
        navigation.navigate('ProfileScreen');
        setLoginPending(false);
      } catch (err) {
        setLoginPending(false);
        Alert.alert(err);
      }
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <FontAwesome5
              name="user-edit"
              size={15}
              color={'#ffffff'}
              style={{marginRight: 3}}
            />
            <Text
              style={{
                marginLeft: 3,
                color: '#ffffff',
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
              }}>
              Update Your Profile
            </Text>
          </View>
        </View>
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'white', flex: 1, padding: 14, marginTop: 35}}>
        <View style={styles.root}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              marginTop: 15,
            }}>
            Name:
          </Text>
          <TextInput
            onChangeText={setName}
            value={name}
            style={{
              height: 44,
              borderWidth: 0.5,
              borderColor: '#d1cfcf',
              marginTop: 5,
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
              color: 'black',
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
            }}>
            Email:
          </Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            style={{
              height: 44,
              borderWidth: 0.5,
              borderColor: '#d1cfcf',
              marginTop: 5,
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
              color: 'black',
              marginBottom: 10,
            }}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Entypo
                name="calendar"
                size={20}
                color={'#757575'}
                style={{marginRight: 3}}
              />
              <Text
                style={{
                  paddingHorizontal: 10,
                  // paddingBottom: 9,
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: 'grey',
                  marginLeft: 4,
                  flex: 1,
                }}>
                Select Year:
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 15,
                marginTop: 10,
                marginBottom: 8,
              }}>
              <Pressable
                style={{
                  width: 45,
                  marginHorizontal: 5,
                  backgroundColor: one ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: one ? 0.5 : 0,
                  borderColor: one ? '#1655BC' : 'white',
                }}
                onPress={() => {
                  setOne(true);
                  setTwo(false);
                  setThree(false);
                  setFour(false);
                  setDiploma(false);
                  // setMess(false);
                  setYear('1');
                }}>
                <Text
                  style={{
                    color: one ? '#ffffff' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  1
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setTwo(true);
                  setOne(false);
                  setThree(false);
                  setFour(false);
                  setDiploma(false);
                  setYear('2');
                }}
                style={{
                  width: 45,
                  marginHorizontal: 5,
                  backgroundColor: two ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: two ? 0.5 : 0,
                  borderColor: two ? '#1655BC' : 'white',
                }}>
                <Text
                  style={{
                    color: two ? '#ffffff' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  2
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setThree(true);
                  setOne(false);
                  setTwo(false);
                  setFour(false);
                  setDiploma(false);
                  setYear('3');
                }}
                style={{
                  width: 45,
                  marginHorizontal: 5,
                  backgroundColor: three ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: three ? 0.5 : 0,
                  borderColor: three ? '#1655BC' : 'white',
                  // marginBottom: 40,
                }}>
                <Text
                  style={{
                    color: three ? '#ffffff' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  3
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFour(true);
                  setOne(false);
                  setTwo(false);
                  setThree(false);
                  setDiploma(false);
                  setYear('4');
                }}
                style={{
                  width: 45,
                  marginHorizontal: 5,
                  backgroundColor: four ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: four ? 0.5 : 0,
                  borderColor: four ? '#1655BC' : 'white',
                  // marginBottom: 40,
                }}>
                <Text
                  style={{
                    color: four ? '#ffffff' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  4
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFour(false);
                  setOne(false);
                  setTwo(false);
                  setThree(false);
                  setDiploma(true);
                  setYear('DIPLOMA');
                }}
                style={{
                  width: 65,
                  marginHorizontal: 5,
                  backgroundColor: diploma ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: diploma ? 0.5 : 0,
                  borderColor: diploma ? '#1655BC' : 'white',
                  // marginBottom: 40,
                }}>
                <Text
                  style={{
                    color: diploma ? 'white' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  Diploma
                </Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={onUpdatePressed}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
              backgroundColor: '#1655BC',
              paddingVertical: 9,
              borderRadius: 20,
              width: width - 50,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Medium',
                // marginHorizontal: 120,
                textAlign: 'center',
                fontSize: 15,
              }}>
              Update
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* {loadingPending ? <AppLoader /> : null} */}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Fredoka-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: 'gray',
    marginTop: 10,
    fontFamily: 'Fredoka-Regular',
    fontSize: 12,
  },
  link: {
    color: '#FDB075',
  },
  logo: {
    width: 260,
    maxWidth: 260,
    maxHeight: 260,
    alignSelf: 'center',
  },
});

export default UpdateProfile;
