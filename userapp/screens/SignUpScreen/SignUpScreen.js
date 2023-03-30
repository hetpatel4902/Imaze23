import React, {useState} from 'react';
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
  Linking,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
// import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {USER_IP, AUTH_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AppLoader from '../../components/AppLoader';
// import {PAYMENT_IP} from '@env';
import PartySprayLoader from '../../components/PartySprayLoader';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpScreen = () => {
  const {height} = useWindowDimensions();
  const width = Dimensions.get('window').width;
  // const {control, handleSubmit, watch} = useForm();
  // const pwd = watch('password');
  const navigation = useNavigation();
  const [loadingPending, setLoadingPending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [collegeName, setCollegeName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordWrong, setPasswordWrong] = useState(false);
  const [emailWrong, setEmailWrong] = useState(false);
  const [passwordMin, setPasswordMin] = useState(false);

  const onRegisterPressed = async data => {
    setPasswordMin(false);
    setEmailWrong(false);

    // setPasswordWrong(false);
    if (!name || !phoneNumber || !email || !password || !collegeName) {
      Alert.alert('Enter all required details.');
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        setEmailWrong(true);
      } else {
        if (password.length >= 8) {
          // if (password == passwordRepeat) {
          try {
            setLoadingPending(true);
            // setTimeout(() => {},1000)
            const response = await axios.post(
              `http://${AUTH_IP}/api/v1/user/register`,
              {
                name: name,
                email: email,
                phonenumber: phoneNumber,
                college: collegeName,
                password: password,
              },
            );
            const obj = {
              token: response.data.token,
              userID: response.data.user.id,
              name: response.data.user.name,
            };
            const jsonValue = JSON.stringify(obj);
            // <PartySprayLoader />;
            await AsyncStorage.setItem('userDetail', jsonValue);
            navigation.navigate('SignIn');
            setLoadingPending(false);
          } catch (err) {
            // setCheck(true);
            setLoadingPending(false);
            Alert.alert('Already registered.');
          }
          // } else {
          //   setPasswordWrong(true);
          // }
        } else {
          setPasswordMin(true);
        }
      }
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'white'}}>
        <View style={styles.root}>
          <Image
            source={require('../../data/register.jpg')}
            style={[styles.logo]}
            resizeMode="contain"
          />
          {/* </View> */}
          {/* <Text style={styles.title}>Register</Text> */}
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Poppins-SemiBold',
              color: '#353535',
            }}>
            Register
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="user-o"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              onChangeText={setName}
              placeholderTextColor="grey"
              placeholder="Name"
              value={name}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name="alternate-email"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              onChangeText={setEmail}
              placeholderTextColor="grey"
              placeholder="Email ID"
              value={email}
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
          {emailWrong && (
            <Text
              style={{
                color: 'red',
                fontFamily: 'Fredoka-Regular',
                fontSize: 9,
                // opacity: emailWrong ? 1 : 0,
              }}>
              Email is invalid
            </Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              name="phone"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              onChangeText={setPhoneNumber}
              placeholderTextColor="grey"
              placeholder="Phone Number"
              value={phoneNumber}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5
              name="building"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              onChangeText={setCollegeName}
              placeholderTextColor="grey"
              placeholder="College Name"
              value={collegeName}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              name="lock"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              secureTextEntry={hidePass ? true : false}
              onChangeText={setPassword}
              placeholderTextColor="grey"
              placeholder="Password"
              value={password}
              style={{
                height: 40,
                marginLeft: 4,
                flex: 1,
                borderBottomWidth: 1,
                borderColor: '#d1cfcf',
                marginTop: 5,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingBottom: 9,
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: '#212121',
              }}></TextInput>
            <FontAwesome5
              name={hidePass ? 'eye-slash' : 'eye'}
              size={15}
              color={'#454545'}
              onPress={() => setHidePass(!hidePass)}
            />
          </View>
          {passwordMin && (
            <Text
              style={{
                color: 'red',
                fontSize: 10,
                fontFamily: 'Fredoka-Regular',
                // opacity: passwordMin ? 1 : 0,
              }}>
              Password should be of minimum 8 characters
            </Text>
          )}
          <View style={{borderRadius: 9}}>
            <Pressable
              onPress={onRegisterPressed}
              style={{
                shadowColor: '#4b2be3',
                shadowColor: '#19347d',
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
                backgroundColor: '#6268fc',
                // backgroundColor: '#19347d',
                paddingVertical: 8,
                borderRadius: 13,
                flex: 1,
                width: width - 47,
                // paddingHorizontal: width / 2 - 50,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Register
              </Text>
            </Pressable>
          </View>

          <Text style={styles.text}>
            By registering, you confirm that you accept our{' '}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(
                  'https://www.privacypolicies.com/live/2eefdb92-5ac6-4457-87db-172f4af94760',
                )
              }>
              Terms of Use
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(
                  'https://www.privacypolicies.com/live/2eefdb92-5ac6-4457-87db-172f4af94760',
                )
              }>
              Privacy Policy
            </Text>
          </Text>
          {/* <Pressable
            onPress={onSignInPress}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
              Have an account? Sign in
            </Text>
          </Pressable> */}
          <Pressable
            onPress={onSignInPress}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 30,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: 'grey', fontFamily: 'Poppins-Medium'}}>
                Have an account?
              </Text>
              <Text
                style={{
                  color: '#6268fc',
                  // color: '#19347d',
                  fontFamily: 'Poppins-SemiBold',
                  marginLeft: 5,
                }}>
                Login
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      {loadingPending ? <PartySprayLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    textAlign: 'left',
    marginBottom: 10,
  },
  text: {
    color: 'gray',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  link: {
    color: '#FDB075',
  },
  logo: {
    width: 220,
    height: 220,
    // maxWidth: 260,
    // maxHeight: 260,
    alignSelf: 'center',
  },
});

export default SignUpScreen;
