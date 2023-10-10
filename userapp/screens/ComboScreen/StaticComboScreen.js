import {
  View,
  Text,
  FlatList,
  ScrollView,
  ToastAndroid,
  Animated,
} from 'react-native';
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
    console.log(response.data.data);
    setCombo(response.data.data);
    setLoading(false);
  };
  const scrollY = new Animated.Value(0);

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: '#1655BC',
          height: 60,
          alignSelf: 'center',
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
          paddingTop: 5,

          opacity: scrollY.interpolate({
            inputRange: [0, 70],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Poppins-Medium',
              fontSize: 17,
              // marginLeft: 5,
              textAlign: 'center',
              marginTop: 12,
            }}>
            Static Combos
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        style={{backgroundColor: 'white', flex: 1, padding: 10, marginTop: 60}}>
        {/* <Text
          style={{
            color: '#000000',
            fontFamily: 'Poppins-Medium',
            fontSize: 17,
          }}>
          Static Combos
        </Text> */}
        <FlatList
          style={{marginBottom: 100}}
          data={combo}
          renderItem={({item, index}) => (
            <StaticCombo data={item} pending={false} index={index} />
          )}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      {loading ? <PartyLoader /> : null}
    </>
  );
};

export default StaticComboScreen;
