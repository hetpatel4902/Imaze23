import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ComboScreen = () => {
  const width = Dimensions.get('window').width;
  const navigation = useNavigation();
  const onStaticCombo = () => {
    navigation.navigate('StaticComboScreen');
  };
  const onDynamicCombo = () => {
    navigation.navigate('DynamicComboScreen');
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1, padding: 15}}>
      <Text
        style={{color: '#000000', fontFamily: 'Poppins-Medium', fontSize: 17}}>
        Select Type of Combo
      </Text>
      <Image
        source={require('../data/design3.jpg')}
        style={{height: 200, width: width}}
      />
      <Pressable onPress={onStaticCombo} style={styles.combos}>
        <Text style={styles.comboText}>Static Combos</Text>
      </Pressable>
      <Pressable onPress={onDynamicCombo} style={styles.combos}>
        <Text style={styles.comboText}>Dynamic Combos</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  combos: {
    backgroundColor: 'white',
    marginVertical: 10,
    textAlign: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    height: 80,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  comboText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
  },
});

export default ComboScreen;
