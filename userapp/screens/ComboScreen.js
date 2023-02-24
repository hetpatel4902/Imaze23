import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
const ComboScreen = () => {
  const navigation = useNavigation();
  const onStaticCombo = () => {
    navigation.navigate('StaticComboScreen');
  };
  const onDynamicCombo = () => {
    navigation.navigate('DynamicComboScreen');
  };
  return (
    <View>
      <Pressable onPress={onStaticCombo}>
        <Text>Static Combos</Text>
      </Pressable>
      <Pressable onPress={onDynamicCombo}>
        <Text>Dynamic Combos</Text>
      </Pressable>
    </View>
  );
};

export default ComboScreen;
