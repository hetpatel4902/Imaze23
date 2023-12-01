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
  TouchableWithoutFeedback,
  // Picker,
  ToastAndroid,
  TouchableOpacity,
  Modal,
} from 'react-native';
// import Pick
// import Picker from 'react-native-picker';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpScreen = () => {
  const showToastWithGravityAndOffset = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  const {height} = useWindowDimensions();
  const width = Dimensions.get('window').width;
  // const [selectedYear, setSelectedYear] = useState('1');
  // const [visible, setVisible] = useState(false);/

  // const {control, handleSubmit, watch} = useForm();
  // const pwd = watch('password');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setLoadingPending(true);
    setModalVisible(!modalVisible);
    setLoadingPending(false);
  };
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
  const [mbit, setMbit] = useState(false);
  const [adit, setAdit] = useState(false);
  const [gcet, setGcet] = useState(false);
  const [others, setOthers] = useState(false);
  const [cp, setCp] = useState(false);
  const [csd, setCsd] = useState(false);
  const [it, setIt] = useState(false);
  const [iot, setIot] = useState(false);
  const [ch, setCh] = useState(false);
  const [ee, setEe] = useState(false);
  const [ec, setEc] = useState(false);
  const [cl, setCl] = useState(false);
  const [me, setMe] = useState(false);
  const [mc, setMc] = useState(false);
  const [other, setOther] = useState(false);
  const [college, setCollege] = useState('');
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [diploma, setDiploma] = useState(false);
  const [year, setYear] = useState('');
  const [enrolment, setEnrolment] = useState('');
  const [branch, setBranch] = useState('');
  const [university, setUniversity] = useState('');
  const [cvmu, setCvmu] = useState(false);
  const [nonCvmu, setNonCvmu] = useState(false);
  const onRegisterPressed = async data => {
    setPasswordMin(false);
    setEmailWrong(false);

    // setPasswordWrong(false);
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !password ||
      !college ||
      !year ||
      !enrolment ||
      !branch
    ) {
      Alert.alert('Enter all required details.');
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        setEmailWrong(true);
      } else {
        if (password.length >= 8) {
          try {
            setLoadingPending(true);
            if (
              year == '1' &&
              college == 'GCET' &&
              enrolment.length != 7 &&
              enrolment.length != 8
            ) {
              Alert.alert(`Your Enrolment No. doesn't matches with College`);
            } else if (
              year == '2' &&
              college == 'GCET' &&
              enrolment.length != 14 &&
              enrolment.length != 8 &&
              enrolment.length != 9
            ) {
              Alert.alert(`Your Enrolment No. doesn't matches with College`);
            } else if (
              year == 'DIPLOMA' &&
              college == 'GCET' &&
              enrolment.length != 8
            ) {
              Alert.alert(`Your Enrolment No. doesn't matches with College`);
            } else if (
              (year == 3 || year == 4) &&
              college == 'GCET' &&
              enrolment.length != 14
            ) {
              Alert.alert(`Your Enrolment No. doesn't matches with College`);
            } else {
              if (
                enrolment.length == 14 &&
                (enrolment[8] != 5 || enrolment[9] != 0) &&
                college == 'GCET'
              ) {
                Alert.alert(`Your Enrolment No. doesn't matches with College`);
              } else {
                console.log({
                  name: name,
                  email: email.toLowerCase(),
                  password: password,
                  college: college,
                  phonenumber: phoneNumber,
                  enrolment: enrolment,
                  year: year,
                  branch: branch,
                  university: university,
                });
                const response = await axios.post(
                  `http://${AUTH_IP}/api/v1/user/register`,
                  {
                    name: name,
                    email: email.toLowerCase(),
                    password: password,
                    college: college,
                    phonenumber: phoneNumber,
                    enrolment: enrolment,
                    year: year,
                    branch: branch,
                    university: university,
                  },
                );
                console.log(response.data);
                const obj = {
                  token: response.data.token,
                  userID: response.data.user.id,
                  name: response.data.user.name,
                };
                const jsonValue = JSON.stringify(obj);
                await AsyncStorage.setItem('userDetail', jsonValue);
                navigation.navigate('SignIn');
                setLoadingPending(false);
              }
            }
            // }else{

            // }
            //     if (enrolment.length == 14) {
            //       // identity['cvmuStudent'] = 'true';
            //       if (enrolment[8] == 5 && enrolment[9] == 0) {
            //         // identity['college'] = 'GCET';
            //         if (college != 'GCET') {
            //           Alert.alert(
            //             `Your Enrolment No. doesn't matches with College`,
            //           );
            //           setLoadingPending(false);
            //         } else {
            //           const response = await axios.post(
            //             `http://${AUTH_IP}/api/v1/user/register`,
            //             {
            //               name: name,
            //               email: email.toLowerCase(),
            //               password: password,
            //               college: college,
            //               phonenumber: phoneNumber,
            //               enrolment: enrolment,
            //               year: year,
            //               branch: branch,
            //               university: university,
            //             },
            //           );
            //           console.log(response.data);
            //           const obj = {
            //             token: response.data.token,
            //             userID: response.data.user.id,
            //             name: response.data.user.name,
            //             // cvmuStudent: 'true',
            //             // college: 'GCET',
            //           };
            //           const jsonValue = JSON.stringify(obj);
            //           const jsonValue1 = JSON.stringify({
            //             cvmuStudent: 'true',
            //             college: 'GCET',
            //           });
            //           await AsyncStorage.setItem('collegeDetail', jsonValue1);
            //           // <PartySprayLoader />;
            //           await AsyncStorage.setItem('userDetail', jsonValue);
            //           const cvalue = await AsyncStorage.getItem('userDetail');
            //           console.log(JSON.parse(cvalue));
            //           navigation.navigate('SignIn');
            //           setLoadingPending(false);
            //         }
            //       } else {
            //         // identity['college'] = 'NONGCET';
            //         if (college == 'GCET') {
            //           Alert.alert(
            //             `Your Enrolment No. doesn't matches with College`,
            //           );
            //           setLoadingPending(false);
            //         } else {
            //           const response = await axios.post(
            //             `http://${AUTH_IP}/api/v1/user/register`,
            //             {
            //               name: name,
            //               email: email,
            //               password: password,
            //               college: college,
            //               phonenumber: parseInt(phoneNumber, 10),
            //               enrolment: parseInt(enrolment, 10),
            //               year: year,
            //               branch: branch,
            //             },
            //           );
            //           const obj = {
            //             token: response.data.token,
            //             userID: response.data.user.id,
            //             name: response.data.user.name,
            //           };
            //           const jsonValue = JSON.stringify(obj);
            //           const jsonValue1 = JSON.stringify({
            //             cvmuStudent: 'true',
            //             college: 'NONGCET',
            //           });
            //           await AsyncStorage.setItem('collegeDetail', jsonValue1);
            //           await AsyncStorage.setItem('userDetail', jsonValue);
            //           const cvalue = await AsyncStorage.getItem('userDetail');
            //           console.log(JSON.parse(cvalue));
            //           navigation.navigate('SignIn');
            //           setLoadingPending(false);
            //         }
            //       }
            //     } else {
            //       const response = await axios.post(
            //         `http://${AUTH_IP}/api/v1/user/register`,
            //         {
            //           name: name,
            //           email: email,
            //           password: password,
            //           college: college,
            //           phonenumber: parseInt(phoneNumber, 10),
            //           enrolment: parseInt(enrolment, 10),
            //           year: parseInt(year, 10),
            //           branch: branch,
            //         },
            //       );
            //       const obj = {
            //         token: response.data.token,
            //         userID: response.data.user.id,
            //         name: response.data.user.name,
            //       };
            //       const jsonValue = JSON.stringify(obj);
            //       const jsonValue1 = JSON.stringify({
            //         cvmuStudent: 'false',
            //         college: 'NONCVMU',
            //       });
            //       await AsyncStorage.setItem('collegeDetail', jsonValue1);
            //       await AsyncStorage.setItem('userDetail', jsonValue);
            //       const cvalue = await AsyncStorage.getItem('userDetail');
            //       console.log(JSON.parse(cvalue));
            //       navigation.navigate('SignIn');
            //       setLoadingPending(false);
            // }
          } catch (err) {
            setLoadingPending(false);
            Alert.alert('Already registered.');
          }
          setLoadingPending(false);
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
        <TouchableWithoutFeedback>
          <View style={styles.root}>
            {/* <Image
              source={require('../../data/register.jpg')}
              style={[styles.logo]}
              resizeMode="contain"
            /> */}
            {/* </View> */}
            {/* <Text style={styles.title}>Register</Text> */}
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Poppins-SemiBold',
                color: '#353535',
                textAlign: 'center',
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
                  marginTop: 10,
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

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <FontAwesome5
                name="university"
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
                Select College:
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 15,
                  marginTop: 15,
                  marginBottom: 8,
                }}>
                <Pressable
                  style={{
                    width: 90,
                    marginHorizontal: 6,
                    backgroundColor: gcet ? '#1655BC' : '#edeef0',
                    height: 30,
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: gcet ? 0.5 : 0,
                    borderColor: gcet ? '#1655BC' : 'white',
                  }}
                  onPress={() => {
                    setGcet(true);
                    setAdit(false);
                    setMbit(false);
                    setOthers(false);
                    // setMess(false);
                    setCollege('GCET');
                  }}>
                  <Text
                    style={{
                      color: gcet ? '#ffffff' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      marginTop: 3,
                    }}>
                    GCET
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setAdit(true);
                    setGcet(false);
                    setMbit(false);
                    setOthers(false);
                    setCollege('ADIT');
                  }}
                  style={{
                    width: 90,
                    marginHorizontal: 6,
                    backgroundColor: adit ? '#1655BC' : '#edeef0',
                    height: 30,
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: adit ? 0.5 : 0,
                    borderColor: adit ? '#1655BC' : 'white',
                  }}>
                  <Text
                    style={{
                      color: adit ? '#ffffff' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      marginTop: 3,
                    }}>
                    ADIT
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setMbit(true);
                    setGcet(false);
                    setAdit(false);
                    setOthers(false);
                    setCollege('MBIT');
                  }}
                  style={{
                    width: 90,
                    marginHorizontal: 6,
                    backgroundColor: mbit ? '#1655BC' : '#edeef0',
                    height: 30,
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: mbit ? 0.5 : 0,
                    borderColor: mbit ? '#1655BC' : 'white',
                    // marginBottom: 40,
                  }}>
                  <Text
                    style={{
                      color: mbit ? '#ffffff' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      marginTop: 3,
                    }}>
                    MBIT
                  </Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  setMbit(false);
                  setGcet(false);
                  setAdit(false);
                  setOthers(true);
                  setCollege('');
                }}
                style={{
                  width: width - 65,
                  marginHorizontal: 6,
                  backgroundColor: others ? '#1655BC' : '#edeef0',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 8,
                  justifyContent: 'center',
                  borderWidth: others ? 0.5 : 0,
                  borderColor: others ? '#1655BC' : 'white',
                  marginLeft: 20,
                  marginTop: 5,
                  // marginBottom: 40,
                }}>
                <Text
                  style={{
                    color: others ? 'white' : '#191919',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    marginTop: 3,
                  }}>
                  Others
                </Text>
              </Pressable>
              {others && (
                <TextInput
                  onChangeText={setCollege}
                  placeholderTextColor="grey"
                  placeholder="College Name"
                  value={college}
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
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <FontAwesome5
                  name="university"
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
                  Select University:
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginTop: 10,
                }}>
                <Pressable
                  onPress={() => {
                    setCvmu(true);
                    setNonCvmu(false);
                    setUniversity('CVMU');
                  }}
                  style={{
                    width: 90,
                    marginHorizontal: 6,
                    backgroundColor: cvmu ? '#1655BC' : '#edeef0',
                    height: 30,
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: cvmu ? 0.5 : 0,
                    borderColor: cvmu ? '#1655BC' : 'white',
                    // marginBottom: 40,
                  }}>
                  <Text
                    style={{
                      color: cvmu ? '#ffffff' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      marginTop: 3,
                    }}>
                    CVMU
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCvmu(false);
                    setNonCvmu(true);
                    setUniversity('NONCVMU');
                  }}
                  style={{
                    width: 90,
                    marginHorizontal: 6,
                    backgroundColor: nonCvmu ? '#1655BC' : '#edeef0',
                    height: 30,
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: nonCvmu ? 0.5 : 0,
                    borderColor: nonCvmu ? '#1655BC' : 'white',
                    // marginBottom: 40,
                  }}>
                  <Text
                    style={{
                      color: nonCvmu ? '#ffffff' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      marginTop: 3,
                    }}>
                    NON-CVMU
                  </Text>
                </Pressable>
              </View>
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
                  keyboardType="phone-pad"
                  style={{
                    height: 40,
                    marginLeft: 4,
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: '#d1cfcf',
                    marginVertical: 17,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingBottom: 6,
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#212121',
                    marginTop: 10,
                  }}
                />
              </View>
            </View>
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

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 23,
              }}>
              <AntDesign
                name="profile"
                size={20}
                color={'#757575'}
                style={{marginRight: 3}}
              />
              <Text
                style={{
                  paddingHorizontal: 10,
                  // paddingBottom: 9,
                  fontSize: 13,
                  fontFamily: 'OpenSans-Medium',
                  color: 'grey',
                  marginLeft: 4,
                  flex: 1,
                }}>
                Select Branch:
              </Text>
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign
                name="profile"
                size={20}
                color={'#757575'}
                style={{marginRight: 3}}
              />
              <TextInput
                onChangeText={setBranch}
                placeholderTextColor="grey"
                placeholder="Select Branch"
                value={branch}
                onFocus={toggleModal}
                style={{
                  height: 40,
                  marginLeft: 4,
                  flex: 1,
                  borderBottomWidth: 1,
                  borderColor: '#d1cfcf',
                  marginVertical: 5,
                  borderRadius: 8,
                  paddingLeft: 10,
                  marginRight: -10,
                  paddingBottom: 9,
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: '#212121',
                }}
              />
              <AntDesign name="caretdown" size={15} color={'gray'} />
            </View>

            {/* <View>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Text>Show Dropdown</Text>
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={visible}
                onRequestClose={() => setVisible(false)}>
                <View>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setVisible(false);
                        // Handle selected option
                      }}>
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Modal>
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome
                name="user-o"
                size={20}
                color={'#757575'}
                style={{marginRight: 3}}
              />
              <TextInput
                onChangeText={setEnrolment}
                placeholderTextColor="grey"
                placeholder="Enrolment No."
                value={enrolment}
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
                // keyboardType="phone-pad"
                style={{
                  height: 40,
                  marginLeft: 4,
                  flex: 1,
                  borderBottomWidth: 1,
                  borderColor: '#d1cfcf',
                  marginTop: 10,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingBottom: 9,
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: '#212121',
                }}></TextInput>
              <FontAwesome5
                name={hidePass ? 'eye-slash' : 'eye'}
                size={17}
                color={'#454545'}
                style={{margin: 5}}
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
                  shadowColor: '#1655BC',
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
                  backgroundColor: '#1655BC',
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

            {/* <Text style={styles.text}>
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
            </Text> */}
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
                marginTop: 25,
                marginBottom: 30,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'grey', fontFamily: 'Poppins-Medium'}}>
                  Have an account?
                </Text>
                <Text
                  style={{
                    color: '#1655BC',
                    // color: '#19347d',
                    fontFamily: 'Poppins-SemiBold',
                    marginLeft: 5,
                  }}>
                  Login
                </Text>
              </View>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
        <Modal
          animationType="slide" // You can choose different animation types
          transparent={true}
          visible={modalVisible}>
          <Pressable
            onPress={toggleModal}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                height: height - 110,
                width: width - 40,
                borderRadius: 20,
                shadowColor: 'grey',
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,
                elevation: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <AntDesign
                  name="profile"
                  size={20}
                  color={'#757575'}
                  style={{marginRight: 3}}
                />
                <Text
                  style={{
                    color: 'gray',
                    marginLeft: 6,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Select Branch:
                </Text>
              </View>
              <View style={{marginTop: 15, alignSelf: 'center'}}>
                <Pressable
                  onPress={() => {
                    setCp(true);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('CP');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Computer Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: cp ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: cp ? 0.5 : 0,
                    borderColor: cp ? '#1655BC' : 'white',
                  }}>
                  <Text
                    style={{
                      color: cp ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Computer Engineering
                  </Text>
                </Pressable>
                <Pressable
                  // style={{marginTop: 15}}
                  onPress={() => {
                    setCp(false);
                    setCsd(true);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setOther(false);
                    setEe(false);
                    setBranch('CSD');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Computer Science and Design Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: csd ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: csd ? 0.5 : 0,
                    borderColor: csd ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: csd ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Computer Science & Design
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(true);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('IT');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Information Tecgnology Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: it ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: it ? 0.5 : 0,
                    borderColor: it ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: it ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Information Technology
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(true);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('IOT');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Internet Of Things Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: iot ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: iot ? 0.5 : 0,
                    borderColor: iot ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: iot ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Internet of Things
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(true);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('CH');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Chemical Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: ch ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: ch ? 0.5 : 0,
                    borderColor: ch ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: ch ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Chemical Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(true);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('CL');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset('Civil Engineering Selected');
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: cl ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: cl ? 0.5 : 0,
                    borderColor: cl ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: cl ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Civil Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(true);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('MC');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Mechatronics Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: mc ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: mc ? 0.5 : 0,
                    borderColor: mc ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: mc ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Mechatronics Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(true);
                    setEc(false);
                    setEe(false);
                    setOther(false);
                    setBranch('ME');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Mechnical Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: me ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: me ? 0.5 : 0,
                    borderColor: me ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: me ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Mechanical Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(true);
                    setEe(false);
                    setOther(false);
                    setBranch('EC');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Electonics and Communication Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: ec ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: ec ? 0.5 : 0,
                    borderColor: ec ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: ec ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Electronics & Communication Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(true);
                    setOther(false);
                    setBranch('EE');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset(
                      'Electrical Engineering Selected',
                    );
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: ee ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: ee ? 0.5 : 0,
                    borderColor: ee ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: ee ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Electrical Engineering
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCp(false);
                    setCsd(false);
                    setIt(false);
                    setIot(false);
                    setCh(false);
                    setCl(false);
                    setMc(false);
                    setMe(false);
                    setEc(false);
                    setEe(false);
                    setOther(true);
                    setBranch('OTHER');
                    setModalVisible(!modalVisible);
                    showToastWithGravityAndOffset('Other Branch Selected');
                  }}
                  style={{
                    width: 270,
                    marginHorizontal: 6,
                    backgroundColor: other ? '#1655BC' : '#edeef0',
                    alignItems: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    borderWidth: other ? 0.5 : 0,
                    borderColor: other ? '#1655BC' : 'white',
                    marginTop: 13,
                  }}>
                  <Text
                    style={{
                      color: other ? 'white' : '#191919',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      paddingVertical: 9,
                    }}>
                    Other
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
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
