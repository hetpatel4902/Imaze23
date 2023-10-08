import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Animated,
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
            Search Events
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{padding: 15, backgroundColor: 'white', flex: 1, marginTop: 55}}>
        {/* <Image
          source={require('../../data/imazelogot1.png')}
          resizeMode={'contain'}
          style={{width: 270, height: 80, alignSelf: 'center'}}
        /> */}
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
      </ScrollView>
    </>
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
    fontFamily: 'Poppins-Regular',
    paddingTop: 12,
  },
});
export default SearchScreen;
