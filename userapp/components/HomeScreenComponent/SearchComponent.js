import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {USER_IP} from '@env';
const SearchComponent = ({searchResult}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: searchResult._id,
      type: searchResult.event_type,
    });
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        // marginBottom: 4,
      }}>
      <View style={{padding: 10}}>
        <Image
          source={{uri: searchResult?.image}}
          style={{height: 56, width: 56, alignSelf: 'center', borderRadius: 28}}
        />
      </View>
      <View>
        <Text
          style={{color: 'black', fontFamily: 'Poppins-Regular', fontSize: 13}}>
          {searchResult.name}
        </Text>
        <Text
          style={{
            color: '#606060',
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
          }}>
          Category: {searchResult?.category}
        </Text>
      </View>
      {/* <Image
        source={{uri: dish.imageUrl}}
        style={{width: 40, height: 40, borderRadius: 20}}
      /> */}
    </Pressable>
  );
};

export default SearchComponent;
