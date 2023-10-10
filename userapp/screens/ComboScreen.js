import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
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
  const scrollY = new Animated.Value(0);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={'#1655BC'}
        barStyle={'light-content'}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: '#1655BC',
          height: 60,
          alignSelf: 'center',
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
          paddingTop: 5,

          opacity: scrollY.interpolate({
            inputRange: [0, 70],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Poppins-Medium',
              fontSize: 17,
              // marginLeft: 5,
              textAlign: 'center',
              marginTop: 12,
            }}>
            Select Type of Combo
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingTop: 20,
          marginTop: 48,
        }}>
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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  combos: {
    backgroundColor: 'white',
    marginVertical: 10,
    textAlign: 'center',
    borderRadius: 15,
    marginHorizontal: 18,
    justifyContent: 'center',
    height: 70,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  comboText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
  },
});

export default ComboScreen;
