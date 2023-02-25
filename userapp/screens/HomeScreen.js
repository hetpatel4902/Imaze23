import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/HomeScreenComponent/ImageCarousel';

const HomeScreen = () => {
  const navigation = useNavigation();
  const techEvents = () => {
    navigation.navigate('TechEvents');
  };
  const nontechEvents = () => {
    navigation.navigate('NonTechEvents');
  };
  const culturalEvents = () => {
    navigation.navigate('CulturalEvents');
  };
  const workshop = () => {
    navigation.navigate('Workshop');
  };

  return (
    <View style={{backgroundColor: 'white', padding: 20}}>
      {/* <Text>HomeScreen</Text> */}
      <Image
        source={require('../data/imazelogo.png')}
        style={{width: 250, height: 60, alignSelf: 'center', marginTop: 5}}
      />
      <Pressable
        style={styles.searchSection}
        onPress={() => navigation.navigate('SearchScreen')}>
        <Ionicons
          style={styles.searchIcon}
          name="ios-search"
          size={18}
          color="gray"
        />
        <View style={styles.input}>
          <Text>Search Events</Text>
        </View>
      </Pressable>
      <View>
        <ImageCarousel />
      </View>
      <Pressable onPress={techEvents}>
        <Text>tech Events</Text>
      </Pressable>
      <Pressable onPress={nontechEvents}>
        <Text>non tech Events</Text>
      </Pressable>
      <Pressable onPress={culturalEvents}>
        <Text>cultural Events</Text>
      </Pressable>
      <Pressable onPress={workshop}>
        <Text>workshop Events</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  searchIcon: {
    padding: 7,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    paddingLeft: 0,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#424242',
    height: 45,
    justifyContent: 'center',
  },
});

export default HomeScreen;
