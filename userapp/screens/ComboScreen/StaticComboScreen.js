import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuthContext} from '../../src/Context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {USER_IP} from '@env';
import StaticCombo from '../../components/ComboScreenComponent/StaticCombo';

const StaticComboScreen = () => {
  const {tokens} = useAuthContext();
  const [combo, setCombo] = useState([]);
  useEffect(() => {
    combos();
  }, []);
  const combos = async () => {
    const response = await axios.get(`http://${USER_IP}/api/v1/user/combos`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    // console.log(response.data.data.Tech);
    console.log(response.data.data);
    setCombo(response.data.data);
  };
  return (
    <View>
      <Text>Static Combos</Text>
      <FlatList
        style={{marginBottom: 30, marginTop: 5}}
        data={combo}
        renderItem={({item}) => <StaticCombo data={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default StaticComboScreen;
