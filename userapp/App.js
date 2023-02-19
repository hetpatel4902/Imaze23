import 'react-native-gesture-handler';
import '@azure/core-asynciterator-polyfill';
import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationContainer} from '@react-navigation/native';
import Router from './Router/index';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AuthContextProvider from './src/Context/AuthContext';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
        <AuthContextProvider>
          <Router />
          {/* <Text>JAY SHREE KRISHNA</Text> */}
        </AuthContextProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
