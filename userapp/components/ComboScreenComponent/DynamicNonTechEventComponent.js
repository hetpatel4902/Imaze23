import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
const DynamicNonTechEventComponent = ({tech}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('EventDetailScreen', {
      eventId: tech._id,
      selected: true,
      type: 'NORMAL',
    });
  };
  const participants = tech?.participants;
  const {nonTechArr, setNonTechArr, check, techArr, price, setPrice} =
    useAuthContext();
  const [selected, setSelected] = useState(false);
  const [done, setDone] = useState(false);
  let Arr = nonTechArr;

  useEffect(() => {
    fun();
  }, [Arr]);
  const fun = () => {
    if (Arr.length == 1) {
      setDone(true);
    }
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        setSelected(true);
      }
    }
  };

  const func = () => {
    let flag = 0;
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        // Arr = Arr.filter(a => a != tech._id);
        if (i > -1) {
          // only splice array when item is found
          Arr.splice(i, 1); // 2nd parameter means remove one item only
        }
        setPrice(price - tech.price);
        setNonTechArr(Arr);
        // console.log('techarr:', techArr);
        // console.log('nontecharr:', nonTechArr);
        setSelected(false);
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      if (Arr.length < 1) {
        Arr.push(tech._id);
        setPrice(price + tech.price);
        setNonTechArr(Arr);
      }
    }
  };
  const onClick = () => {
    func();
    fun();
    check();
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: selected ? 15 : 10,
        borderWidth: selected ? 1 : 0,
        borderColor: selected ? '#1655BC' : '#ffffff',
        // marginBottom: -10,
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
          // borderRadius: 27,
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
        <Text style={styles.name}>{tech.name}</Text>
        <View style={styles.subContainer}>
          <Text style={styles.priceText}>Rs.{tech?.price} </Text>
        </View>
        <View>
          <Text style={styles.participants}>
            {participants.length} participants
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: selected ? 'red' : '#1655BC',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 3.5,
          borderRadius: 18,
          shadowColor: '#1655BC',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 14,
          paddingHorizontal: 13,
        }}
        onPress={onClick}>
        <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
          {selected ? 'Discard' : 'Select'}
        </Text>
      </Pressable>
    </Pressable>
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
    height: 66,
    width: 66,
    borderRadius: 33,
  },
  nameView: {flex: 3, paddingHorizontal: 10},
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
  priceText: {
    fontFamily: 'Poppins-Medium',
    color: '#242424',
    fontSize: 12,
  },
  subContainerTime: {
    fontFamily: 'Poppins-Regular',
    color: '#242424',
    fontSize: 11,
  },
  participants: {
    color: '#454545',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
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
export default DynamicNonTechEventComponent;
