import React, {useRef, useState, useEffect} from 'react';
import {FlatList} from 'react-native';
// import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
// import ImageCarouselData from '../../data/ImageCarouselData';
// import {ScrollView} from 'react-native-gesture-handler';

const {width: screenWidth} = Dimensions.get('window');

const ImageCarousel = props => {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);
  return (
    <View style={{height: 210}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: '#191919',
            fontSize: 15,
            fontFamily: 'Poppins-Medium',
          }}>
          Our Sponsers
        </Text>
      </View>
      <View style={styles.container}>
        <ScrollView
          style={{paddingHorizontal: 7}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}>
          <View style={{}}>
            <Image
              source={require('../../data/design2.jpg')}
              style={{
                width: 260,
                height: 160,
                borderRadius: 10,
                marginHorizontal: 10,
                borderWidth: 1,
                borderColor: '#c2c2c2',
              }}
            />
          </View>
          <Image
            source={require('../../data/design3.jpg')}
            style={{
              width: 260,
              height: 160,
              borderRadius: 10,
              marginHorizontal: 10,
              borderWidth: 1,
              borderColor: '#c2c2c2',
            }}
          />
          <Image
            source={require('../../data/design1.jpg')}
            style={{
              width: 260,
              height: 160,
              borderRadius: 10,
              marginHorizontal: 10,
              borderWidth: 1,
              borderColor: '#c2c2c2',
            }}
          />
          <Image
            source={require('../../data/design4.jpg')}
            style={{
              width: 260,
              height: 160,
              borderRadius: 10,
              marginHorizontal: 10,
              borderWidth: 1,
              borderColor: '#c2c2c2',
            }}
          />
          {/* <Image
            source={{
              uri: 'https://www.jagannathskitchen.in/images/placeholder.jpg',
            }}
            style={{width: 260, height: 160, borderRadius: 10, margin: 10}}
          />
          <Image
            source={{
              uri: 'https://www.theloveofspice.com/wp-content/uploads/2019/01/kanda-poha-recipe.jpg',
            }}
            style={{width: 260, height: 160, borderRadius: 10, margin: 10}}
          />
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_1280.jpg',
            }}
            style={{width: 260, height: 160, borderRadius: 10, margin: 10}}
          /> */}
          {/* <Image
            source={{
              uri: 'https://www.eatthis.com/wp-content/uploads/sites/4/2021/07/mcdonalds-burgers-fries.jpg?quality=82&strip=1&resize=640%2C360',
            }}
            style={{width: 260, height: 160, borderRadius: 10, margin: 10}}
          /> */}
        </ScrollView>
        {/* <Carousel
          ref={carouselRef}
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 60}
          data={entries}
          renderItem={renderItem}
          hasParallaxImages={true}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 160,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}),
    backgroundColor: 'white',
    borderRadius: 20,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default ImageCarousel;
