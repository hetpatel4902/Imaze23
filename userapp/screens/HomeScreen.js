import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  FlatList,
  Animated,
  TextInput,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/HomeScreenComponent/ImageCarousel';
import {useAuthContext} from '../src/Context/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FamousEvents from '../components/HomeScreenComponent/FamousEvents';
import PartyLoader from '../components/PartyLoader';
import MainEventComponent from '../components/MainEventsComponent/MainEventComponent';
import LinearGradient from 'react-native-linear-gradient';
import FlagshipEventComponent from '../components/FlagshipEventComponents/FlagshipEventComponent';
import * as Animatable from 'react-native-animatable';
const HomeScreen = () => {
  const {name, loading, setLoading} = useAuthContext();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      // Calculate the next index to scroll to
      const nextIndex = (currentIndex + 1) % data.length;
      const nextOffset = nextIndex * 181; // Replace ITEM_WIDTH with the width of your list item

      // Scroll to the next item
      flatListRef.current.scrollToOffset({offset: nextOffset, animated: true});

      // Update the current index
      setCurrentIndex(nextIndex);
    }, 2550); // Replace AUTO_SCROLL_INTERVAL with the interval in milliseconds (e.g., 3000 for 3 seconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(scrollInterval);
  }, [currentIndex]);

  const flatListRef2 = useRef(null);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      // Calculate the next index to scroll to
      const nextIndex = (currentIndex2 + 1) % flagshipData.length;
      const nextOffset = nextIndex * 181; // Replace ITEM_WIDTH with the width of your list item

      // Scroll to the next item
      flatListRef2.current.scrollToOffset({
        offset: nextOffset,
        animated: true,
      });

      // Update the current index
      setCurrentIndex2(nextIndex);
    }, 2550); // Replace AUTO_SCROLL_INTERVAL with the interval in milliseconds (e.g., 3000 for 3 seconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(scrollInterval);
  }, [currentIndex2]);

  const data = [
    {
      redirect: 'TechEvents',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/tech+(2).png`,
      name: 'Tech Events',
      colors: ['#BDD6FE', '#D9D6FB', '#F2D4F6'],
    },
    {
      redirect: 'NonTechEvents',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/nontech.png`,
      name: 'Non Tech Events',
      colors: ['#EEFDFD', '#C8FBF2', '#C7E1FC', '#C1D4FF'],
    },
    {
      redirect: 'CulturalEvents',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/cultural.png`,
      name: 'Cultural Events',
      colors: ['#FBECD7', '#FADFD1', '#F7D2CC', '#F6CBCA'],
    },
    {
      redirect: 'Workshop',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/Vocational.png`,
      name: 'Vocational',
      colors: ['#CDFAD9', '#D8F8C9', '#E6F2B6', '#F0F0A8'],
    },
  ];
  const flagshipData = [
    {
      redirect: 'Ideathon',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/Ideathon+(1).png`,
      name: 'Ideathon',
      colors: ['#B1802F', '#D0B144', '#ECE4AE', '#C19B45'],
    },
    {
      redirect: 'HappyStreet',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/happystreet.png`,
      name: 'Happy Street',
      colors: ['#B1802F', '#D0B144', '#ECE4AE', '#C19B45'],
    },
    {
      redirect: 'Itk',
      image: `https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/itk.png`,
      name: 'Indian Traditional Knowledge',
      colors: ['#B1802F', '#D0B144', '#ECE4AE', '#C19B45'],
    },
  ];
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
    if (today.getHours() <= 12 && today.getHours() >= 6) {
      return 'Good Morning';
    } else if (today.getHours() > 12 && today.getHours() <= 16) {
      return 'Good Afternoon!';
    } else if (today.getHours() > 16 && today.getHours() <= 23) {
      return 'Good Evening!';
    } else {
      return 'Good Night!';
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const scrollY = new Animated.Value(0);

  // Create a function to handle the scroll event
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false}, // set to true if using RN 0.63 or above
  );

  return (
    <>
      {/* <Text>HomeScreen</Text> */}
      {/* <StatusBar
        animated={true}
        backgroundColor={'#000000'}
        barStyle={'light-content'}
      /> */}
      {/* <View
          style={{
            // position: 'sticky',
            // top: 82, // Adjust this value according to your layout
            zIndex: 1, // Add zIndex to make sure it stays above other content
            // backgroundColor: 'white',
            height: 70, // Height of the header
            alignSelf: 'center',
            marginTop: 12,
          }}>
          <Image
            source={require('../data/imazelogot1.png')}
            resizeMode={'contain'}
            style={{width: 250, height: 70}}
          />
        </View> */}
      {/* <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: 'white',
          height: 70,
          alignSelf: 'center',
          // marginTop: 7,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 70], // Adjust the range for sticky effect
                outputRange: [0, 0], // Adjust the value for sticky offset
                extrapolate: 'clamp', // Keeps the value within the range
              }),
            },
          ],
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../data/top.png')}
            resizeMode={'contain'}
            style={{width: 170, height: 70}}
          />
          <Image
            source={require('../data/imazelogot.png')}
            resizeMode={'contain'}
            style={{width: 170, height: 70}}
          />
        </View>
      </Animated.View> */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: 'white',
          height: 72,
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../data/top.png')}
            resizeMode={'contain'}
            style={{width: 120, height: 50, marginLeft: 25, marginRight: -25}}
          />
          <Image
            source={require('../data/imazelogot.png')}
            resizeMode={'contain'}
            style={{
              width: 160,
              height: 66,
              marginLeft: 0,
              alignSelf: 'center',
            }}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          backgroundColor: 'white',
          height: 67,
          alignSelf: 'center',
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
          opacity: scrollY.interpolate({
            inputRange: [0, 70],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }}>
        <Image
          source={require('../data/imazelogot.png')}
          resizeMode={'contain'}
          style={{width: 160, height: 66, alignSelf: 'center'}}
        />
      </Animated.View>
      <ScrollView
        style={{backgroundColor: 'white', flex: 1, marginTop: 24}}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll} // Attach the scroll event handler
        scrollEventThrottle={16} // Adjust the throttle value as needed
      >
        <View style={{marginLeft: 0, marginTop: 45}}>
          <ImageCarousel />
        </View>

        <Pressable
          style={styles.searchSection}
          onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons
            style={styles.searchIcon}
            name="ios-search"
            size={18}
            color="#000000"
          />
          <View style={styles.input}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
                color: '#303030',
              }}>
              Search Events...
            </Text>
          </View>
        </Pressable>
        <View>
          <Text
            style={{
              color: '#000000',
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            Event Categories...
          </Text>
          <FlatList
            ref={flatListRef}
            data={data}
            horizontal
            style={{marginBottom: 0, marginTop: 2, marginLeft: 10}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <MainEventComponent tech={item} />}
            keyExtractor={item => item.name}
          />
        </View>
        <View
          style={{
            marginHorizontal: 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fffced',
            borderRadius: 15,
            padding: 1,
            paddingHorizontal: 15,
            shadowColor: 'grey',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 7,
            marginTop: 5,
          }}>
          <View style={{}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}>
              Hey {name},
            </Text>
            <Text
              style={{
                color: '#424242',
                fontSize: 12,
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
                marginTop: 6,
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
                style={{margin: 1}}
              />
            </View>
            <Text
              style={{
                color: '#202020',
                fontFamily: 'Poppins-Medium',
                fontSize: 11,
                marginTop: -3,
                marginBottom: 8,
              }}>
              100 coins
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              color: '#000000',
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
              paddingHorizontal: 20,
              marginTop: 15,
            }}>
            Flagship Events
          </Text>
          <FlatList
            ref={flatListRef2}
            data={flagshipData}
            horizontal
            style={{marginBottom: 0, marginTop: 5, marginLeft: 10}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <FlagshipEventComponent tech={item} />}
            keyExtractor={item => item.name}
          />
        </View>
        {/* <View style={styles.searchContainer}>
          <Animatable.View
            animation={isFocused ? 'slideInLeft' : 'slideOutRight'}
            duration={300}
            style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </Animatable.View>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholderTextColor={isFocused ? 'black' : 'transparent'}
            placeholder="Search Events..."
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View> */}
        <View style={{marginBottom: 40, marginTop: -17}}>
          <FamousEvents />
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
    marginBottom: -5,
    borderRadius: 30,
    marginHorizontal: 20,
    marginVertical: 8,
    borderColor: '#ededed',
    borderWidth: 1,
  },
  searchIcon: {
    padding: 7,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    paddingLeft: 0,
    borderRadius: 30,
    backgroundColor: '#fff',
    color: '#6268fc',
    height: 40,
    justifyContent: 'center',
    fontSize: 12,
  },
});

export default HomeScreen;
