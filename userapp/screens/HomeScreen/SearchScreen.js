import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useAuthContext} from '../src/Context/AuthContext';
import {useAuthContext} from '../../src/Context/AuthContext';
import axios from 'axios';
// import SearchComponent from '../components/HomeScreenComponent/SearchComponent';
import SearchComponent from '../../components/HomeScreenComponent/SearchComponent';
import {USER_IP} from '@env';

const SearchScreen = () => {
  const {dbUser, tokens} = useAuthContext();
  const [search, setSearch] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const onPress = async () => {
    // console.log(tokens);
    if (search?.length >= 2) {
      const response = await axios.get(
        `http://${USER_IP}/api/v1/user/events?search=${search}`,
        {headers: {Authorization: `Bearer ${tokens}`}},
      );
      // console.log(response.data.data);
      // console.log(search);
      setSearchResult(response.data.data);
    } else {
      setSearchResult(null);
    }
  };
  // const today = new Date();
  // const greeting = () => {
  //   if (today.getHours() < 12 && today.getHours() > 6) {
  //     return 'Good Morning';
  //   } else if (today.getHours() > 12 && today.getHours() < 16) {
  //     return 'Good Afternoon!';
  //   } else if (today.getHours() > 16 && today.getHours() < 23) {
  //     return 'Good Evening!';
  //   } else {
  //     return 'Good Night!';
  //   }
  // };
  return (
    <View style={{padding: 15, backgroundColor: 'white', flex: 1}}>
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}></View> */}
      {/* <View style={{flexDirection: 'row', marginTop: 14}}>
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Fredoka-Regular',
          }}>
          Hey {dbUser?.name},
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Fredoka-Medium',
          }}>
          {greeting()}
        </Text>
      </View> */}
      <Image
        source={require('../../data/imazelogot1.png')}
        resizeMode={'contain'}
        style={{width: 270, height: 80, alignSelf: 'center'}}
      />
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="ios-search"
          size={20}
          color="gray"
        />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          onTextInput={onPress}
          placeholder="Search Events..."
          placeholderTextColor={'grey'}
          underlineColorAndroid="transparent"
        />
      </View>
      <View>
        <FlatList
          data={searchResult}
          renderItem={({item}) => <SearchComponent searchResult={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: 200,
    backgroundColor: '#fff',
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 25,
    borderColor: '#ededed',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,
    // elevation: 10,
  },
  searchIcon: {
    padding: 7,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    // marginBottom: 10,
    paddingLeft: 0,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#424242',
  },
});
export default SearchScreen;
