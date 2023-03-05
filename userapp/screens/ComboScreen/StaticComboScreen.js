import {View, Text, FlatList, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {USER_IP} from '@env';
import StaticCombo from '../../components/ComboScreenComponent/StaticCombo';
import PartyLoader from '../../components/PartyLoader';

const StaticComboScreen = () => {
  const {tokens} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [combo, setCombo] = useState([]);
  useEffect(() => {
    combos();
  }, []);
  const combos = async () => {
    setLoading(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/combos`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    // console.log(response.data.data.Tech);
    // console.log('static combo:', response.data.data);
    setCombo(response.data.data);
    setLoading(false);
  };
  return (
    <>
      <ScrollView style={{backgroundColor: 'white', flex: 1, padding: 15}}>
        <Text
          style={{
            color: '#000000',
            fontFamily: 'Poppins-Medium',
            fontSize: 17,
          }}>
          Static Combos
        </Text>
        <FlatList
          style={{marginBottom: 30, marginTop: 5}}
          data={combo}
          renderItem={({item}) => <StaticCombo data={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      {loading ? <PartyLoader /> : null}
    </>
  );
};

export default StaticComboScreen;
