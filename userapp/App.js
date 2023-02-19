import 'react-native-gesture-handler';
import '@azure/core-asynciterator-polyfill';
import {View, Text} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <View>
        <Text style={{fontFamily: 'Fredoka-Medium'}}>JAY SHREE KRISHNA</Text>
        <Text>App</Text>
        <AntDesign name="caretup" size={23} />
      </View>
    </NavigationContainer>
  );
};

export default App;
