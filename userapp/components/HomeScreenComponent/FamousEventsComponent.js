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
        height: 85,
        // width: 160,
        backgroundColor: 'white',
        borderRadius: 22,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 5,
        marginTop: 5,
        marginBottom: 15,
        marginHorizontal: 15,
        paddingHorizontal: 13,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 14,
      }}>
      {/* 2a4173 */}
      <View style={{flex: 1}}>
        <View style={{backgroundColor: 'black', padding: 7, borderRadius: 30}}>
          <Image
            source={{uri: `http://${USER_IP}/${tech?.image}`}}
            style={{
              height: 44,
              width: 44,
              borderRadius: 10,
              // backgroundColor: 'black',
              // padding: 10,
              // alignSelf: 'center',
              // position: 'relative',
              // marginBottom: 33,
              // marginTop: 10,
            }}
          />
        </View>
      </View>
      <View style={{flex: 3, paddingHorizontal: 8}}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 13,
            color: '#191919',
            // marginTop: -25,
            // alignSelf: 'center',
          }}>
          {tech?.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 11,
            marginTop: -5,
            color: 'grey',
            // alignSelf: 'center',
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
              color={'#00e4ff'}
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
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: '#000000',
            paddingHorizontal: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 3.5,
            // marginTop: 8,
            borderRadius: 18,
            alignContent: 'center',
            // flex: 1,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            Rs.{tech?.price}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default FamousEventsComponent;
