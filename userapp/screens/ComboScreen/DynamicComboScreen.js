import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const DynamicComboScreen = () => {
  const navigation = useNavigation();
  const techEvents = () => {
    navigation.navigate('DynamicTechSelectScreen');
  };
  const nontechEvents = () => {
    navigation.navigate('DynamicNonTechSelectScreen');
  };
  const workshop = () => {
    navigation.navigate('DynamicWorkshopSelectScreen');
  };
  return (
    <View>
      <Text>DynamicComboScreen</Text>
      <Pressable onPress={techEvents}>
        <Text>tech Events</Text>
      </Pressable>
      <Pressable onPress={nontechEvents}>
        <Text>non tech Events</Text>
      </Pressable>
      <Pressable onPress={workshop}>
        <Text>workshop Events</Text>
      </Pressable>
    </View>
  );
};

export default DynamicComboScreen;
