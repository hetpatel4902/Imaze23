import {View, Text, Pressable} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../src/Context/AuthContext';

const ProfileScreen = () => {
  const {dbUser} = useAuthContext();
  // const navigation = useNavigation();
  const {
    setUser,
    users,
    tokens,
    jsonValue,
    setTokens,
    loginPending,
    setLoginPending,
  } = useAuthContext();
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
