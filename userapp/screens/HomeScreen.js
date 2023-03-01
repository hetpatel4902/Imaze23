import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/HomeScreenComponent/ImageCarousel';
import {useAuthContext} from '../src/Context/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FamousEvents from '../components/HomeScreenComponent/FamousEvents';
import PartyLoader from '../components/PartyLoader';
const HomeScreen = () => {
  const {name, loading, setLoading} = useAuthContext();
  // const [loading, setLoading] = useState(false);
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
  var today = new Date();
  // var today = moment().utcOffset('+05:30').format('hh');
  const greeting = () => {
    if (today.getHours() < 12 && today.getHours() > 6) {
      return 'Good Morning';
    } else if (today.getHours() > 12 && today.getHours() < 16) {
      return 'Good Afternoon!';
    } else if (today.getHours() > 16 && today.getHours() < 23) {
      return 'Good Evening!';
    } else {
      return 'Good Night!';
    }
  };

  return (
    <>
      <ScrollView
        style={{backgroundColor: 'white', flex: 1}}
        showsVerticalScrollIndicator={false}>
        {/* <Text>HomeScreen</Text> */}
        <Image
          source={require('../data/imazelogo.png')}
          style={{width: 250, height: 43, alignSelf: 'center', marginTop: 15}}
        />
        <Pressable
          style={styles.searchSection}
          onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons
            style={styles.searchIcon}
            name="ios-search"
            size={18}
            color="#6949ff"
          />
          <View style={styles.input}>
            <Text style={{fontFamily: 'Poppins-Regular'}}>
              Search Events...
            </Text>
          </View>
        </Pressable>
        <View>
          <ImageCarousel />
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fffced',
            borderRadius: 15,
            padding: 5,
            // marginTop: 5,
            paddingHorizontal: 15,
            shadowColor: 'grey',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}>
          <View style={{}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Medium',
                fontSize: 15,
              }}>
              Hey {name},
            </Text>
            <Text
              style={{
                color: '#424242',
                fontSize: 13,
                // marginTop: -3,
                marginLeft: -5,
                fontFamily: 'Poppins-Regular',
              }}>
              {' '}
              {greeting()}
            </Text>
          </View>

          <View style={{alignContent: 'center', alignItems: 'center'}}>
            {/* <FontAwesome5 name="coins" size={26} color={'#fad505'} /> */}
            <View
              style={{
                height: 45,
                width: 45,
                marginTop: 7,
                borderRadius: 23,
                backgroundColor: '#fffced',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome5
                name="coins"
                size={26}
                color={'#fad505'}
                style={{margin: 5}}
              />
            </View>
            <Text
              style={{
                color: '#2e2e2e',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 11,
              }}>
              100
            </Text>
          </View>
        </View>
        <View>
          <FamousEvents />
        </View>
        <Text
          style={{
            color: '#000000',
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            paddingHorizontal: 20,
          }}>
          Buy Specific Events...
        </Text>
        <View
          style={{
            marginHorizontal: 20,
            paddingHorizontal: 18,
            marginTop: 10,
            backgroundColor: '#6949ff',
            marginBottom: 90,
            paddingBottom: 21,
            padding: 15,
            borderRadius: 15,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 17,
                  color: 'white',
                  marginRight: 6,
                }}>
                Exciting Events
              </Text>
            </View>
            <MaterialIcons name="event-available" size={18} color={'white'} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Pressable
              onPress={techEvents}
              style={{
                marginTop: 15,
                flex: 1,
                height: 195,
                borderRadius: 15,
                marginRight: 10,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../data/events.jpg')}
                style={{
                  height: 130,
                  width: 148,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                Tech Events
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                255 participants
              </Text>
            </Pressable>
            <Pressable
              onPress={nontechEvents}
              style={{
                marginTop: 15,
                flex: 1,
                height: 195,
                borderRadius: 15,
                // width: 50,
                marginLeft: 10,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../data/nonevents.jpg')}
                style={{
                  height: 130,
                  width: 148,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                Non-Tech Events
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                286 participants
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Pressable
              onPress={culturalEvents}
              style={{
                marginTop: 15,
                flex: 1,
                height: 195,
                borderRadius: 15,
                width: 70,
                marginRight: 10,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../data/cultural.jpg')}
                style={{
                  height: 130,
                  width: 148,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                Cultural Events
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                305 participants
              </Text>
            </Pressable>
            <Pressable
              onPress={workshop}
              style={{
                marginTop: 15,
                flex: 1,
                height: 195,
                borderRadius: 15,
                width: 70,
                marginLeft: 10,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../data/workshop.jpg')}
                style={{
                  height: 130,
                  width: 148,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                Workshops
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 13,
                  color: '#181818',
                  alignSelf: 'center',
                  // marginTop: 5,
                }}>
                50 participants
              </Text>
            </Pressable>
          </View>
          {/* <Pressable onPress={culturalEvents}>
          <Text>cultural Events</Text>
          </Pressable>
          <Pressable onPress={workshop}>
          <Text>workshop Events</Text>
        </Pressable> */}
        </View>
      </ScrollView>
      {loading ? <PartyLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginHorizontal: 20,
    marginVertical: 8,
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
    color: '#6949ff',
    height: 45,
    justifyContent: 'center',
    // fontFamily: 'Poppins-SemiBold',
  },
});

export default HomeScreen;
