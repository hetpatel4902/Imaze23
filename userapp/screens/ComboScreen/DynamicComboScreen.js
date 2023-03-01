import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../src/Context/AuthContext';

const DynamicComboScreen = () => {
  const {techArr, nonTechArr, workshopArr, visible} = useAuthContext();
  const navigation = useNavigation();
  const width = Dimensions.get('screen').width;
  // useEffect(() => {
  //   check();
  // }, [techArr.length, nonTechArr.length, workshopArr.length]);
  // const check = () => {
  //   if (
  //     techArr.length == 2 &&
  //     nonTechArr.length == 1 &&
  //     workshopArr.length == 1
  //   ) {
  //     setVisible(true);
  //   }
  // };
  const techEvents = () => {
    navigation.navigate('DynamicTechSelectScreen');
  };
  const nontechEvents = () => {
    navigation.navigate('DynamicNonTechSelectScreen');
  };
  const workshop = () => {
    navigation.navigate('DynamicWorkshopSelectScreen');
  };
  const onBuy = () => {};
  return (
    <View style={styles.mainView}>
      <Text style={styles.mainTitle}>Select Dynamic Combo</Text>
      <Pressable onPress={techEvents} style={styles.eventBundle}>
        <View style={styles.eventImageView}>
          <Image
            source={require('../../data/events.jpg')}
            style={styles.eventImage}
          />
        </View>
        <View style={styles.eventTextView}>
          <Text style={styles.eventText}>Tech Events</Text>
        </View>
      </Pressable>
      <Pressable onPress={nontechEvents} style={styles.eventBundle}>
        <View style={styles.eventImageView}>
          <Image
            source={require('../../data/nonevents.jpg')}
            style={styles.eventImage}
          />
        </View>
        <View style={styles.eventTextView}>
          <Text style={styles.eventText}>Non-Tech Events</Text>
        </View>
      </Pressable>
      <Pressable onPress={workshop} style={styles.eventBundle}>
        <View style={styles.eventImageView}>
          <Image
            source={require('../../data/workshop.jpg')}
            style={styles.eventImage}
          />
        </View>
        <View style={styles.eventTextView}>
          <Text style={styles.eventText}>Workshops</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onBuy}
        disabled={visible}
        style={{
          shadowColor: '#6949ff',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 14,
          alignContent: 'center',
          alignSelf: 'center',
          marginTop: 25,
          backgroundColor: visible ? '#6949ff' : 'grey',
          paddingVertical: 13,
          borderRadius: 13,
          marginTop: 40,
          // flex: 1,
          maxWidth: width,
          paddingHorizontal: width / 2 - 72,
        }}>
        <Text
          style={{
            color: 'white',
            alignSelf: 'center',
            fontFamily: 'Poppins-SemiBold',
            fontSize: 15,
          }}>
          Buy Combo
        </Text>
      </Pressable>
      {!visible && (
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            color: 'grey',
            marginTop: 15,
          }}>
          *Please Select Events to Buy Combo
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    color: '#101010',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  eventBundle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    borderRadius: 14,
  },
  eventView: {
    backgroundColor: 'white',
    marginVertical: 10,
    textAlign: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    height: 80,
    padding: 20,
  },
  eventImageView: {
    flex: 1,
  },
  eventImage: {
    height: 80,
    width: 80,
    borderRadius: 14,
  },
  eventTextView: {flex: 3.7},
  eventText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#000000',
  },
});

export default DynamicComboScreen;
