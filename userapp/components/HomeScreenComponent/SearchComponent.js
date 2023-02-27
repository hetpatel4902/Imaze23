import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const SearchComponent = ({searchResult}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {eventId: searchResult._id});
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 4,
      }}>
      <View>
        <Image
          source={{uri: `http://10.0.2.2:8000/${searchResult?.image}`}}
          style={{height: 70, width: 70}}
        />
      </View>
      <Text
        style={{color: 'black', fontFamily: 'Poppins-Regular', fontSize: 13}}>
        {searchResult.name}
      </Text>
      {/* <Image
        source={{uri: dish.imageUrl}}
        style={{width: 40, height: 40, borderRadius: 20}}
      /> */}
    </Pressable>
  );
};

export default SearchComponent;
