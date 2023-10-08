import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {USER_IP} from '@env';
const SearchTeamMate = ({searchResult}) => {
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
      }}>
      <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
          }}>
          {searchResult?.enrolment}
        </Text>
        <Text
          style={{color: 'gray', fontFamily: 'Poppins-Regular', fontSize: 13}}>
          {searchResult.name} (Branch: {searchResult.branch})
        </Text>
      </View>
    </Pressable>
  );
};

export default SearchTeamMate;
