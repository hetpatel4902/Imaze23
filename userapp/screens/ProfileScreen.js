import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../src/Context/AuthContext';
import {USER_IP} from '@env';
import axios from 'axios';

const ProfileScreen = () => {
  const {dbUser} = useAuthContext();
  const {setUser, users, tokens, setTokens, setLoginPending} = useAuthContext();
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    userDetail();
  }, []);
  const userDetail = async () => {
    setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    // console.log(response.data.data);
    setUserDetails(response.data.data);
    setLoginPending(false);
  };
  // const navigation = useNavigation();
  const logout = async () => {
    setLoginPending(true);
    await AsyncStorage.clear();
    // setItems([]);
    setTimeout(() => setTokens(null), 200);
    setTimeout(() => setUser(false), 500);
    setLoginPending(false);
  };

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Pressable onPress={logout}>
        <Text>logout</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
