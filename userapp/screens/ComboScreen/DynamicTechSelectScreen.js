import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../src/Context/AuthContext';
import DynamicTechEventComponent from '../../components/ComboScreenComponent/DynamicTechEventComponent';
import {USER_IP} from '@env';

const DynamicTechSelectScreen = () => {
  const {tokens} = useAuthContext();
  const [event, setEvent] = useState([]);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/events/category`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setEvent(response.data.data.Tech);
  };
  return (
    <View style={styles.mainView}>
      <Text style={styles.mainTitle}>Tech Events</Text>
      <Text style={styles.subTitle}>
        Note: You can select only 2 Tech events
      </Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={event}
        renderItem={({item}) => <DynamicTechEventComponent tech={item} />}
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
    color: '#393939 ',
    fontSize: 14,
  },
});
export default DynamicTechSelectScreen;
