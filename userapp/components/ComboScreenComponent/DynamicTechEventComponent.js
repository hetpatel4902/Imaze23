import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
import axios from 'axios';

const DynamicTechEventComponent = ({tech}) => {
  const navigation = useNavigation();
  const [details, setDetails] = useState(null);
  const {users, tokens} = useAuthContext();

  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: tech._id,
      selected: true,
      type: 'NORMAL',
    });
  };
  const participants = tech?.participants;
  const {techArr, setTechArr, check, price, setPrice} = useAuthContext();
  const [selected, setSelected] = useState(false);
  const [done, setDone] = useState(false);
  let Arr = techArr;
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

  useEffect(() => {
    // func();
    // setTechArr(Arr);
  }, []);
  useEffect(() => {
    fun();
  }, [Arr]);
  const fun = () => {
    if (Arr.length == 2) {
      setDone(true);
    }
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        setSelected(true);
      }
    }
  };

  // const change = useCallback(() => {
  //   setTechArr(Arr);
  // }, []);

  const func = () => {
    let flag = 0;
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        if (i > -1) {
          Arr.splice(i, 1);
        }
        console.log('current price:', price);
        setPrice(price - tech.price);
        setTechArr(Arr);
        setSelected(false);
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      if (Arr.length < 2) {
        Arr.push(tech._id);
        setPrice(price + tech.price);
        setTechArr(Arr);
        console.log(techArr);
      }
    }
  };
  const onClick = () => {
    func();
    fun();
    check();
  };
  return (
    <View>
      {tech?.type == 'SOLO' && (
        <Pressable
          onPress={onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 3,
            borderRadius: 20,
            padding: 10,
            paddingHorizontal: selected ? 15 : 10,
            borderWidth: selected ? 1 : 0,
            borderColor: selected ? '#1655BC' : '#ffffff',
            // height: 60,
          }}>
          <View
            style={{
              flex: selected ? 1.15 : 1,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'blue',
              // height: 55,
              // width: 55,
              // backgroundColor: 'black',
              borderRadius: 27,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: tech?.image}}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: 'black',
                }}
              />
            </View>
          </View>
          <View style={styles.nameView}>
            <Text style={styles.name} numberOfLines={1}>
              {tech.name}
            </Text>
            <View>
              <Text style={styles.participants} numberOfLines={1}>
                {tech?.description}
              </Text>
            </View>
            <View style={styles.subContainer}>
              <Text style={styles.priceText}>
                Rs.
                {details?.university == 'CVMU'
                  ? tech?.price
                  : Math.ceil(tech?.price + tech?.price * 0.18)}
              </Text>
            </View>
          </View>
          <Pressable
            style={{
              backgroundColor: selected ? 'red' : '#1655BC',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3,
              borderRadius: 18,
              shadowColor: '#1655BC',
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 14,
              paddingHorizontal: 11,
            }}
            onPress={onClick}>
            <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
              {selected ? 'Discard' : 'Select'}
            </Text>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    height: 58,
    width: 58,
    borderRadius: 33,
  },
  nameView: {flex: 3, paddingHorizontal: 10},
  name: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
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
  priceText: {
    fontFamily: 'Poppins-Medium',
    color: '#242424',
    fontSize: 12,
    marginLeft: -4,
  },
  subContainerTime: {
    fontFamily: 'Poppins-Regular',
    color: '#242424',
    fontSize: 11,
  },
  participants: {
    color: '#454545',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  selectContainer: {
    backgroundColor: '#05fa9c',
    alignItems: 'center',
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
    paddingHorizontal: 13,
  },
  selectContainerText: {color: 'white', fontFamily: 'Poppins-Medium'},
});
export default DynamicTechEventComponent;
