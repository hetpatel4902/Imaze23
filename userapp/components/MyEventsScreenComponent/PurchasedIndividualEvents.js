import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
const PurchasedIndividualEvents = ({tech, certificate}) => {
  const navigation = useNavigation();
  const {users, tokens} = useAuthContext();
  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: tech.event._id,
      pending: false,
      bought: true,
      type: tech.event.event_type,
      certificate,
    });
  };
  const [details, setDetails] = useState(null);
  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    // setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    // console.log(response.data.data);
    setDetails(response.data.data);
    // setLoginPending(false);
  };
  const downloadReceipt = () => {
    // console.log(tech);
    if (tech?.receipt == null) {
      Alert.alert('Receipt not yet generated.Sorry for inconvenience.');
    } else {
      Linking.openURL(`${tech?.receipt}`);
    }
  };
  const participants = tech?.event?.participants;
  return (
    <Pressable onPress={onPress} style={styles.mainView}>
      {/* <View style={styles.imageView}> */}
      <Image source={{uri: tech?.event?.image}} style={styles.image} />
      {/* </View> */}
      <View style={styles.nameView}>
        <Text style={styles.name}>{tech?.event?.name}</Text>
        {!certificate && (
          <View style={{}}>
            <Text style={{color: '#202020', fontFamily: 'Poppins-SemiBold'}}>
              {'\u20B9'}{' '}
              {details?.university == 'CVMU'
                ? tech?.event?.price
                : tech?.event?.price + tech?.event?.price * 0.18}
            </Text>
          </View>
        )}
        {certificate && (
          <View style={styles.container}>
            <MaterialCommunityIcons
              name="calendar-week"
              size={16}
              color={'#ff9600'}
            />
            <View style={styles.subContainer}>
              <Text style={styles.subContainerDate}>{tech?.event?.date} </Text>
              <Text style={styles.subContainerTime}>({tech?.event?.time})</Text>
            </View>
          </View>
        )}
      </View>

      {!certificate && (
        <Pressable
          onPress={downloadReceipt}
          style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: '#1655BC',
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
              textAlign: 'center',
            }}>
            Download Receipt
          </Text>
        </Pressable>
      )}
      {certificate && (
        <Pressable
          onPress={onPress}
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
    // marginBottom: 7,
    // marginTop: 7,
    marginVertical: 10,
    // backgroundColor: 'orange',
  },
  imageView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    // flex: 1.1,
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  nameView: {flex: 5, paddingHorizontal: 9, marginLeft: 8},
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
    flex: 5,
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

export default PurchasedIndividualEvents;
