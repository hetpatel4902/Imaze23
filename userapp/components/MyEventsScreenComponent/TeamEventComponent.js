import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {USER_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {Linking} from 'react-native';
import {useAuthContext} from '../../src/Context/AuthContext';
const TeamEventComponent = ({tech, certificate}) => {
  const navigation = useNavigation();
  const {users, tokens} = useAuthContext();
  const onPress = () => {};
  const download = async () => {
    const response1 = await axios.get(
      `http://3.109.100.118:8000/api/v1/user/certificates/${users}/visibility/${tech.event?._id}?type=${tech.event?.event_type}`,
      {
        headers: {Authorization: `Bearer ${tokens}`},
      },
    );
    if (response1.data.data) {
      const response = await axios.get(
        `http://3.109.100.118:8000/api/v1/user/certificates/${users}/event/${tech.event?._id}?type=${tech.event?.event_type}`,
        {
          headers: {Authorization: `Bearer ${tokens}`},
        },
      );
      // console.log(response.data);
      Linking.openURL(`${response?.data?.data}`);
      // setEventDetail(response.data.data);
    } else {
      Alert.alert('You have to attend event in order to get certificate.');
    }
  };
  const participants = tech?.event?.participants;
  return (
    <Pressable onPress={onPress} style={styles.mainView}>
      <Image source={{uri: tech.event?.image}} style={styles.image} />
      <View style={styles.nameView}>
        <Text style={styles.name}>{tech.event?.name}</Text>
        <View>
          <Text style={styles.participants}>Team Name: {tech?.team_name}</Text>
        </View>
      </View>
      {certificate && (
        <Pressable
          onPress={download}
          style={{flex: 1.7, justifyContent: 'center', alignItems: 'center'}}>
          <Feather
            name="download"
            size={24}
            color={'#1655BC'}
            style={{alignSelf: 'center'}}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    marginTop: 7,
  },
  imageView: {
    flex: 2.4,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    // flex: 1,
    height: 52,
    width: 52,
    borderRadius: 26,
  },
  nameView: {flex: 5, paddingHorizontal: 9},
  name: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    flex: 7,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainerDate: {
    fontFamily: 'Poppins-Medium',
    color: '#242424',
    fontSize: 13,
  },
  subContainerTime: {
    fontFamily: 'Poppins-Regular',
    color: '#242424',
    fontSize: 12,
  },
  participants: {
    color: '#191919',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  priceContainer: {
    backgroundColor: '#05fa9c',
    // backgroundColor: '#05fa9c',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 3.5,
    borderRadius: 18,
    shadowColor: '#05fa9c',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  priceContainerText: {color: 'white', fontFamily: 'Poppins-Medium'},
});

export default TeamEventComponent;
