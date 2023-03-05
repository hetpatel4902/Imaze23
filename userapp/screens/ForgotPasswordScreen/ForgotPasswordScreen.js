// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Image,
//   TextInput,
//   Pressable,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/core';
// // import {useForm} from 'react-hook-form';
// import axios from 'axios';
// // import AppLoader from '../../components/AppLoader';
// // import {PAYMENT_IP} from '@env';
// // import {Auth} from 'aws-amplify';

// const ForgotPasswordScreen = () => {
//   // const {control, handleSubmit} = useForm();
//   const navigation = useNavigation();
//   const [check, setCheck] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const onSendPressed = async data => {
//     setCheck(false);
//     try {
//       setLoading(true);
//       const response = await axios.patch(
//         `http://10.0.2.2:3000/api/v1/user/forgotpassword`,
//         {email: email},
//       );
//       // console.log(response.data);
//       // if (response.data.otpsent) {
//       navigation.navigate('ConfirmEmail', {email: email});
//       // }
//       setLoading(false);
//     } catch (err) {
//       setCheck(true);
//       setLoading(false);
//     }
//   };

//   const onSignInPress = () => {
//     navigation.navigate('SignIn');
//   };

//   return (
//     <>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={{backgroundColor: 'white'}}>
//         <View style={styles.root}>
//           <Image
//             source={require('../../data/forgotpass.jpg')}
//             style={{
//               height: 230,
//               width: 230,
//               borderRadius: 20,
//               marginTop: 30,
//               alignSelf: 'center',
//             }}
//           />
//           <Text style={styles.title}>Reset your password</Text>

//           <Text
//             style={{
//               color: 'black',
//               fontSize: 14,
//               fontFamily: 'Fredoka-Regular',
//             }}>
//             Email:
//           </Text>
//           <TextInput
//             onChangeText={setEmail}
//             value={email}
//             style={{
//               height: 36,
//               borderWidth: 0.5,
//               borderColor: '#d1cfcf',
//               marginTop: 5,
//               borderRadius: 8,
//               paddingHorizontal: 10,
//               fontSize: 13,
//               fontFamily: 'Fredoka-Regular',
//               color: 'black',
//             }}
//           />
//           <View style={{alignContent: 'flex-start'}}>
//             <Text
//               style={{
//                 color: 'red',
//                 fontFamily: 'Fredoka-Regular',
//                 fontSize: 12,
//                 textAlign: 'left',
//                 opacity: check ? 1 : 0,
//               }}>
//               Email is never registered.
//             </Text>
//           </View>

//           {/* <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} /> */}
//           <Pressable
//             onPress={onSendPressed}
//             style={{
//               alignContent: 'center',
//               alignSelf: 'center',
//               marginTop: 20,
//               backgroundColor: '#f35858',
//               paddingVertical: 12,
//               borderRadius: 9,
//             }}>
//             <Text
//               style={{
//                 color: 'white',
//                 fontFamily: 'Fredoka-Medium',
//                 paddingHorizontal: 127,
//                 fontSize: 15,
//               }}>
//               Send
//             </Text>
//           </Pressable>
//           {/* <CustomButton
//             text="Back to Sign in"
//             onPress={onSignInPress}
//             type="TERTIARY"
//           /> */}
//           <Pressable
//             onPress={onSignInPress}
//             style={{
//               alignContent: 'center',
//               alignSelf: 'center',
//               marginTop: 20,
//             }}>
//             <Text style={{color: 'black', fontFamily: 'Fredoka-Regular'}}>
//               Back to Sign in
//             </Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//       {/* {AppLoader ? loading : null} */}
//       {/* {loading ? <AppLoader /> : null} */}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     // alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 19,
//     color: 'black',
//     margin: 10,
//     fontFamily: 'Fredoka-Medium',
//     textAlign: 'center',
//   },
//   text: {
//     color: 'gray',
//     marginVertical: 10,
//   },
//   link: {
//     color: '#FDB075',
//   },
// });

// export default ForgotPasswordScreen;

// import React, {useState} from 'react';
// import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';
// import SocialSignInButtons from '../../components/SocialSignInButtons';
// import {useNavigation} from '@react-navigation/core';
// import {useForm} from 'react-hook-form';
// import axios from 'axios';
// // import {Auth} from 'aws-amplify';

// const ForgotPasswordScreen = () => {
//   const {control, handleSubmit} = useForm();
//   const navigation = useNavigation();

//   const onSendPressed = async data => {
//     // try {
//     //   // await Auth.forgotPassword(data.username);
//     //   navigation.navigate('NewPassword');
//     // } catch (e) {
//     //   Alert.alert('Oops', e.message);
//     // }
//     const response = await axios.patch(
//       'http://3.109.165.137:3000/api/v1/user/forgotpassword',
//       data,
//     );
//     console.log(response.data);
//     if (response.data.otpsent) {
//       navigation.navigate('ConfirmEmail', {email: data.email});
//     }
//   };

//   const onSignInPress = () => {
//     navigation.navigate('SignIn');
//   };

//   return (
//     <ScrollView showsVerticalScrollIndicator={false}>
//       <View style={styles.root}>
//         <Text style={styles.title}>Reset your password</Text>

//         <CustomInput
//           name="email"
//           control={control}
//           placeholder="Email"
//           rules={{
//             required: 'Email is required',
//           }}
//         />

//         <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />

//         <CustomButton
//           text="Back to Sign in"
//           onPress={onSignInPress}
//           type="TERTIARY"
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#051C60',
//     margin: 10,
//   },
//   text: {
//     color: 'gray',
//     marginVertical: 10,
//   },
//   link: {
//     color: '#FDB075',
//   },
// });

// export default ForgotPasswordScreen;
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
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';
// import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
// import {useForm} from 'react-hook-form';
import axios from 'axios';
import AppLoader from '../../components/AppLoader';
import {USER_IP, AUTH_IP} from '@env';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchLoader from '../../components/SearchLoader';

// import {PAYMENT_IP} from '@env';
// import {Auth} from 'aws-amplify';

const ForgotPasswordScreen = () => {
  // const {control, handleSubmit} = useForm();
  const width = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const onSendPressed = async data => {
    setCheck(false);
    try {
      setLoading(true);
      // console.log('hello');
      const response = await axios.patch(
        `http://${AUTH_IP}/api/v1/user/forgotpassword`,
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
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: '#212121',
              }}
            />
          </View>
          {/* <Text
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
          /> */}
          <View style={{alignContent: 'flex-start'}}>
            <Text
              style={{
                color: 'red',
                fontFamily: 'Fredoka-Regular',
                fontSize: 11,
                textAlign: 'left',
                opacity: check ? 1 : 0,
              }}>
              Email is never registered.
            </Text>
          </View>

          {/* <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} /> */}
          <View style={{borderRadius: 9}}>
            <Pressable
              onPress={onSendPressed}
              style={{
                shadowColor: '#4b2be3',
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
                marginTop: 40,
                backgroundColor: '#6949ff',
                // backgroundColor: '#19347d',
                paddingVertical: 10,
                borderRadius: 13,
                flex: 1,
                maxWidth: width,
                paddingHorizontal: width / 2 - 54,
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
          {/* <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'grey', alignSelf: 'center'}}>
              ---------------OR---------------
            </Text>
          </View> */}
          {/* <Pressable
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
          </Pressable> */}
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
            <Text style={{color: 'black', fontFamily: 'Poppins-Medium'}}>
              Back to Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* {AppLoader ? loading : null} */}
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
