import {View, Text, FlatList, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
import axios from 'axios';
import EventComponent from '../../components/HomeScreenComponent/EventComponent';
import {USER_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
const TechEvents = () => {
  const {tokens} = useAuthContext();
  const [event, setEvent] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/category`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log(response.data.data.Tech);
    setEvent(response.data.data.Tech);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{padding: 10, backgroundColor: 'white', flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={27}
            color={'#404040'}
            style={{marginTop: -2}}
          />
        </Pressable>
        <Text
          style={{
            color: '#191919',
            fontFamily: 'Poppins-Medium',
            fontSize: 17,
            marginLeft: 5,
          }}>
          Tech Events 🎉
        </Text>
      </View>
      <FlatList
        style={{marginBottom: 30, marginTop: 5, marginHorizontal: 5}}
        data={event}
        renderItem={({item}) => <EventComponent tech={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default TechEvents;
