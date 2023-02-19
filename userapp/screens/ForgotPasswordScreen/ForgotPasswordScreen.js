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
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
// import {useForm} from 'react-hook-form';
import axios from 'axios';
// import AppLoader from '../../components/AppLoader';
// import {PAYMENT_IP} from '@env';
// import {Auth} from 'aws-amplify';

const ForgotPasswordScreen = () => {
  // const {control, handleSubmit} = useForm();
  const navigation = useNavigation();
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const onSendPressed = async data => {
    setCheck(false);
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://10.0.2.2:3000/api/v1/user/forgotpassword`,
        {email: email},
      );
      // console.log(response.data);
      // if (response.data.otpsent) {
      navigation.navigate('ConfirmEmail', {email: email});
      // }
      setLoading(false);
    } catch (err) {
      setCheck(true);
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
            source={require('../../data/forgotpass.jpg')}
            style={{
              height: 230,
              width: 230,
              borderRadius: 20,
              marginTop: 30,
              alignSelf: 'center',
            }}
          />
          <Text style={styles.title}>Reset your password</Text>

          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Fredoka-Regular',
            }}>
            Email:
          </Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            style={{
              height: 36,
              borderWidth: 0.5,
              borderColor: '#d1cfcf',
              marginTop: 5,
              borderRadius: 8,
              paddingHorizontal: 10,
              fontSize: 13,
              fontFamily: 'Fredoka-Regular',
              color: 'black',
            }}
          />
          <View style={{alignContent: 'flex-start'}}>
            <Text
              style={{
                color: 'red',
                fontFamily: 'Fredoka-Regular',
                fontSize: 12,
                textAlign: 'left',
                opacity: check ? 1 : 0,
              }}>
              Email is never registered.
            </Text>
          </View>

          {/* <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} /> */}
          <Pressable
            onPress={onSendPressed}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
              backgroundColor: '#f35858',
              paddingVertical: 12,
              borderRadius: 9,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Fredoka-Medium',
                paddingHorizontal: 127,
                fontSize: 15,
              }}>
              Send
            </Text>
          </Pressable>
          {/* <CustomButton
            text="Back to Sign in"
            onPress={onSignInPress}
            type="TERTIARY"
          /> */}
          <Pressable
            onPress={onSignInPress}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'black', fontFamily: 'Fredoka-Regular'}}>
              Back to Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* {AppLoader ? loading : null} */}
      {/* {loading ? <AppLoader /> : null} */}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    // alignItems: 'center',
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