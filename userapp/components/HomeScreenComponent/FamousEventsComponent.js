import {View, Text, ScrollView, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const FamousEventsComponent = ({tech}) => {
  const participants = tech?.participants;
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('EventDetailScreen', {eventId: tech._id});
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 207,
        width: 180,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        // marginTop: 10,
        marginBottom: 18,
        marginHorizontal: 15,
        paddingHorizontal: 13,
      }}>
      <Image
        source={{uri: `http://10.0.2.2:8000/${tech?.image}`}}
        style={{
          height: 80,
          width: 80,
          borderRadius: 40,
          alignSelf: 'center',
          position: 'relative',
          marginBottom: 33,
          marginTop: 10,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 15,
          //   left: 110,
          right: -20,
          backgroundColor: '#05fa9c',
          borderRadius: 6,
          padding: 3,
          paddingHorizontal: 5,
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Poppins-Regular',
            fontSize: 11,
          }}>
          {participants.length} participants
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 14,
          color: '#191919',
          marginTop: -30,
          alignSelf: 'center',
        }}>
        {tech?.name}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          marginTop: -5,
          color: 'grey',
          alignSelf: 'center',
        }}>
        {tech?.category}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View>
          <MaterialCommunityIcons
            name="calendar-week"
            size={16}
            color={'#05fa9c'}
          />
        </View>
        <View
          style={{
            flex: 7,
            marginHorizontal: 4,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#242424',
              fontSize: 12,
            }}>
            {tech?.date}{' '}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: '#242424',
              fontSize: 11,
            }}>
            ({tech?.time})
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#6949ff',
          paddingHorizontal: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 3.5,
          marginTop: 8,
          borderRadius: 18,
        }}>
        <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
          Rs.{tech?.price}
        </Text>
      </View>
    </Pressable>
  );
};

export default FamousEventsComponent;
