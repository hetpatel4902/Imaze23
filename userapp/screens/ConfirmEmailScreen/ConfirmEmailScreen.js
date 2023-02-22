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
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
// import AppLoader from '../../components/AppLoader';
// import {PAYMENT_IP} from '@env';x

const ConfirmEmailScreen = () => {
  const route = useRoute();
  const {users} = useAuthContext();
  // const {control, handleSubmit, watch} = useForm({
  //   defaultValues: {username: route?.params?.username},
  // });
  const email = route?.params.email;
  // const username = watch('username');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const navigation = useNavigation();

  const onConfirmPressed = async data => {
    try {
      // await Auth.confirmSignUp(data.username, data.code);
      console.log('email', email);
      setLoading(true);
      const response = await axios.post(
        `http://10.0.2.2:8000/api/v1/user/${users}/validateOtp`,
        {otp: otp},
      );
      console.log(response);
      navigation.navigate('NewPasswordScreen', {email});
      setLoading(false);
    } catch (e) {
      // Alert.alert();
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
            source={require('../../data/email1.jpg')}
            style={{
              height: 230,
              width: 230,
              borderRadius: 20,
              marginTop: 30,
              alignSelf: 'center',
            }}
          />
          <Text style={styles.title}>Confirm your email</Text>

          {/* <CustomInput
            name="otp"
            control={control}
            placeholder="Enter your confirmation code"
            rules={{
              required: 'Confirmation code is required',
            }}
          /> */}
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Fredoka-Regular',
            }}>
            OTP:
          </Text>
          <TextInput
            onChangeText={setOtp}
            value={otp}
            keyboardType={'numeric'}
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
              Invalid OTP
            </Text>
          </View>

          {/* <CustomButton
            text="Confirm"
            onPress={handleSubmit(onConfirmPressed)}
          /> */}
          <Pressable
            onPress={onConfirmPressed}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              marginTop: 8,
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
              Confirm
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
    fontSize: 18,
    color: 'black',
    margin: 10,
    marginTop: 15,
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

export default ConfirmEmailScreen;
