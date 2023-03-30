import {View, Text, ScrollView, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
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
        height: 196,
        width: 160,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 8,
        marginTop: 5,
        marginBottom: 18,
        marginHorizontal: 15,
        paddingHorizontal: 13,
      }}>
      <Image
        source={{uri: `http://${USER_IP}/${tech?.image}`}}
        style={{
          height: 74,
          width: 74,
          borderRadius: 37,
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
        numberOfLines={1}
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          color: '#191919',
          marginTop: -25,
          alignSelf: 'center',
        }}>
        {tech?.name}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 11,
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
            size={15}
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
              fontSize: 11,
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
          backgroundColor: '#6268fc',
          paddingHorizontal: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 3.5,
          marginTop: 8,
          borderRadius: 18,
        }}>
        <Text
          style={{color: 'white', fontFamily: 'Poppins-Medium', fontSize: 12}}>
          Rs.{tech?.price}
        </Text>
      </View>
    </Pressable>
  );
};

export default FamousEventsComponent;
