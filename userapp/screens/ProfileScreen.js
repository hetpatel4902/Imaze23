// import {View, Text, Pressable} from 'react-native';
// import React, {useState, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useAuthContext} from '../src/Context/AuthContext';
// import {USER_IP} from '@env';
// import axios from 'axios';

// const ProfileScreen = () => {
//   const {dbUser} = useAuthContext();
//   const {setUser, users, tokens, setTokens, setLoginPending} = useAuthContext();
//   const [userDetails, setUserDetails] = useState(null);
//   useEffect(() => {
//     userDetail();
//   }, []);
//   const userDetail = async () => {
//     setLoginPending(true);
//     const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
//       headers: {Authorization: `Bearer ${tokens}`},
//     });
//     // console.log(response.data.data);
//     setUserDetails(response.data.data);
//     setLoginPending(false);
//   };
//   // const navigation = useNavigation();
//   const logout = async () => {
//     setLoginPending(true);
//     await AsyncStorage.clear();
//     // setItems([]);
//     setTimeout(() => setTokens(null), 200);
//     setTimeout(() => setUser(false), 500);
//     setLoginPending(false);
//   };

//   return (
//     <View>
//       <Text>ProfileScreen</Text>
//       <Pressable onPress={logout}>
//         <Text>logout</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default ProfileScreen;

import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Pressable,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Linking,
  Dimensions,
} from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../src/Context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AppLoader from '../components/AppLoader';
import Foundation from 'react-native-vector-icons/Foundation';
import {USER_IP} from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default function ProfileScreen() {
  // const {users,tokens} = useAuthContext();
  const navigation = useNavigation();
  const {
    setUser,
    users,
    tokens,
    jsonValue,
    setTokens,
    setItems,
    loginPending,
    setLoginPending,
  } = useAuthContext();
  const [wallet, setWallet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState(null);
  const width = Dimensions.get('screen').width;
  // const [name, setName] = useState(null);
  // const [address, setAddress] = useState(null);
  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    console.log(response.data.data);
    setDetails(response.data.data);
    setLoginPending(false);
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // walletDetail();
    fetchUserDetail();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const logout = async () => {
    setLoginPending(true);
    await AsyncStorage.clear();
    // setItems([]);
    setTimeout(() => setTokens(null), 200);
    setTimeout(() => setUser(false), 500);
    setLoginPending(false);
  };

  // const walletDetail = async () => {
  //   const response = await axios.get(
  //     `http://65.0.189.107:8000/api/v1/user/${users}/wallet`,
  //     {headers: {Authorization: `Bearer ${tokens}`}},
  //   );
  //   setWallet(response.data.data);
  // };
  // const walletDetail = async () => {
  //   const response = await axios.get(
  //     `http://${PAYMENT_IP}:6990/api/v1/user/${users}`,
  //     {headers: {Authorization: `Bearer ${tokens}`}},
  //   );
  //   setWallet(response.data.data.wallet);
  //   setAddress(response.data.data.address);
  //   setName(response.data.data.name);
  // };
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 40,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                }}>
                {details?.name}
              </Text>
              <Text
                style={{
                  marginRight: 10,
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: 'grey',
                }}>
                {details?.college}
              </Text>
            </View>
          </View>
          <View style={{padding: 7, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'black',
                fontSize: 16,
              }}>
              Current Points:
              {details?.points}
            </Text>
          </View>

          <View style={{marginHorizontal: 18, marginTop: 5}}>
            <Pressable
              onPress={() => navigation.navigate('MyEvents')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Ionicons
                name="wallet-outline"
                size={21}
                color="#6949ff"
                style={{}}
              />
              <Text style={styles.textcolour}>Purchase History</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('DownloadCertificate')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <MaterialCommunityIcons
                name="certificate-outline"
                size={21}
                color="#6949ff"
                style={{}}
              />
              <Text style={styles.textcolour}>Download Certificate</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={() => navigation.navigate('UpdateProfile')}>
              {/* <MaterialCommunityIcons
                name="home-city-outline"
                size={21}
                color="#6949ff"
              /> */}
              <FontAwesome5 name="user-edit" size={17} color={'#6949ff'} />
              <Text style={styles.textcolour}>Update Profile</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('AboutUsScreen')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Ionicons
                name="information-circle-outline"
                size={21}
                color="#6949ff"
              />
              <Text style={styles.textcolour}>About</Text>
            </Pressable>
          </View>

          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <Text
              style={styles.textcolour}
              onPress={() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.ssip.governmentsachivalay',
                )
              }>
              Give Feedback
            </Text>
            <Text
              style={styles.textcolour}
              onPress={() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.ssip.governmentsachivalay',
                )
              }>
              Rate Us On PlayStore
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#6949ff',
                borderRadius: 15,
                marginTop: 50,
                padding: 10,
                paddingHorizontal: 28,
                alignItems: 'center',
                width: width - 60,
                alignSelf: 'center',
              }}
              onPress={logout}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '500',
                  fontSize: 17,
                  fontFamily: 'Poppins-Medium',
                }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* {loginPending ? <AppLoader /> : null} */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  textcolour: {
    fontSize: 15,
    color: '#4d4d4d',
    marginBottom: 7,
    marginTop: 5,
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  like: {
    alignSelf: 'center',
    fontSize: 13,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  likr1: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'black',
  },
});
