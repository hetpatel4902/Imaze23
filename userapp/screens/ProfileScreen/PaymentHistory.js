import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {USER_IP} from '@env';
import {useAuthContext} from '../../src/Context/AuthContext';

const PaymentHistory = () => {
  const {users, tokens} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    events();
  }, []);
  const events = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://${USER_IP}/api/v1/user/${users}/payment/history`,
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    console.log(response.data.data.combos);
    setHistory(response.data.data);
    setLoading(false);
  };
  return (
    <View>
      <Text>PaymentHistory</Text>
    </View>
  );
};

export default PaymentHistory;
