import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import AppLoader from '../../components/AppLoader';
import {USER_IP, AUTH_IP} from '@env';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchLoader from '../../components/SearchLoader';

const ForgotPasswordScreen = () => {
  const width = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const emailC = email.split(' ')[0];
  const onSendPressed = async data => {
    // console.log(emailC);
    setCheck(false);
    try {
      setLoading(true);
      console.log('hello');
      const response = await axios.patch(
        `http://${USER_IP}/api/v1/user/forgotpassword`,
        {email: emailC},
      );
      if (response.data.otpsent) {
        navigation.navigate('ConfirmEmail', {email: email});
      }
      setLoading(false);
    } catch (err) {
      setCheck(true);
      Alert.alert('Email not registered.');
      setLoading(false);
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
            source={require('../../data/loginunsuccessful.png')}
            style={{
              height: 230,
              width: 230,
              borderRadius: 20,
              marginTop: 30,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              marginTop: 30,
              fontSize: 22,
              fontFamily: 'Poppins-SemiBold',
              color: '#242424',
            }}>
            Forgot Password?
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: 'grey',
            }}>
            Don't worry! It happens. Please enter the address associated with
            your account.
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 50}}>
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
                marginTop: 5,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingBottom: 9,
                fontSize: 15,
                fontFamily: 'Poppins-Medium',
                color: '#212121',
              }}
            />
          </View>

          <View style={{borderRadius: 9}}>
            <Pressable
              onPress={onSendPressed}
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
                marginTop: 40,
                backgroundColor: '#1655BC',
                paddingVertical: 8,
                borderRadius: 13,
                flex: 1,
                maxWidth: width,
                paddingHorizontal: width / 2 - 46,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Send
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={onSignInPress}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: '#000000', fontFamily: 'Poppins-Medium'}}>
              Back to Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {loading ? <SearchLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    // alignItems: 'center',
    // marginTop: 20,
    padding: 20,
  },
  title: {
    fontSize: 19,
    color: 'black',
    margin: 10,
    fontFamily: 'Fredoka-Medium',
    textAlign: 'center',
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ForgotPasswordScreen;
