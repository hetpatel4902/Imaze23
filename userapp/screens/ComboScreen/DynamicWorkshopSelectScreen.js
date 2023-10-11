import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../src/Context/AuthContext';
import DynamicWorkshopComponent from '../../components/ComboScreenComponent/DynamicWorkshopComponent';
import {USER_IP} from '@env';
import Feather from 'react-native-vector-icons/Feather';
const DynamicWorkshopSelectScreen = () => {
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
    // console.log(response.data.data);
    setEvent(response.data.data.Workshop);
  };
  return (
    <View style={styles.mainView}>
      {/* <Text style={styles.mainTitle}>Workshops</Text> */}
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
          Workshops
        </Text>
      </View>
      <Text style={styles.subTitle}>*Note: You can select only 1 Workshop</Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={event}
        renderItem={({item}) => <DynamicWorkshopComponent tech={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    padding: 15,
    flex: 1,
  },
  mainTitle: {
    fontFamily: 'Poppins-Medium',
    color: '#101010',
    fontSize: 16,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'grey',
    fontSize: 12,
    marginHorizontal: 31,
  },
});
export default DynamicWorkshopSelectScreen;
