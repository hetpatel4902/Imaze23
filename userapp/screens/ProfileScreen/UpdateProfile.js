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
import {USER_IP, COLOR} from '@env';

const UpdateProfile = () => {
  const {height, width} = useWindowDimensions();
  const {users, tokens, loginPending, setLoginPending} = useAuthContext();
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
