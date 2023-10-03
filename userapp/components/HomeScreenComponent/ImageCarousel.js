import React, {useRef, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const ImageCarousel = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const data = [
    require('../../data/carousel4.png'),
    require('../../data/carousel1.png'),
    require('../../data/carousel2.jpg'),
    require('../../data/carousel41.png'),
  ];

  const renderItem = ({item}) => (
    <Image
      source={item}
      resizeMode="contain"
      style={{
        width: 250,
        height: 140,
        borderRadius: 10,
        marginHorizontal: 10,
        borderWidth: 1,
      }}
    />
  );

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      setCurrentIndex(nextIndex);
      carouselRef.current.scrollToIndex({index: nextIndex, animated: true});
    }, 3000); // Auto-scroll every 3 seconds (adjust as needed)

    return () => {
      clearInterval(scrollInterval);
    };
  }, [currentIndex]);

  return (
    <View style={{height: 190}}>
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
            marginBottom: 8,
            marginTop: 5,
          }}>
          Our Sponsors
        </Text>
      </View>
      <FlatList
        ref={carouselRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: screenWidth - 60,
          offset: (screenWidth - 125) * index,
          index,
        })}
        style={{marginBottom: 15}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
});

export default ImageCarousel;
