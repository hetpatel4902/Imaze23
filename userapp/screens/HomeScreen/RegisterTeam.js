import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Animated,
  useWindowDimensions,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

// import {useAuthContext} from '../../src/Context/AuthContext';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import SearchComponent from '../../components/HomeScreenComponent/SearchComponent';
import {USER_IP} from '@env';
import {useAuthContext} from '../../src/Context/AuthContext';
const SearchTeamMate = ({searchResult, isSelected, onSelect, clearSearch}) => {
  const onPress = () => {
    if (isSelected) {
      // Remove the user if already selected
      onSelect(prevSelectedUsers =>
        prevSelectedUsers.filter(user => user._id !== searchResult._id),
      );
    } else {
      // Add the user to the selected list
      onSelect(prevSelectedUsers => [...prevSelectedUsers, searchResult]);
    }
    clearSearch();
  };

  return (
    <View>
      <View
        //   onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isSelected ? '#1655BC' : 'white',
          borderRadius: 15,
          marginVertical: 10,
        }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 4}}>
            <Text
              style={{
                color: isSelected ? 'white' : 'black',
                fontFamily: isSelected ? 'Poppins-Medium' : 'Poppins-Regular',
                fontSize: 14,
              }}>
              {searchResult?.enrolment}
            </Text>
            <Text
              style={{
                color: isSelected ? 'white' : 'gray',
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
              }}>
              {searchResult.name} (Branch: {searchResult.branch})
            </Text>
          </View>
          <Pressable
            onPress={onPress}
            style={{
              backgroundColor: isSelected ? 'white' : '#1655BC',
              // padding: 3,
              borderRadius: 8,
              // paddingHorizontal: 8,
              flex: 1.3,
            }}>
            <Text
              style={{
                color: isSelected ? 'black' : 'white',
                fontFamily: isSelected ? 'Poppins-Medium' : 'Poppins-Regular',
                fontSize: 11,
                marginHorizontal: 10,
                marginVertical: 5,
                textAlign: 'center',
              }}>
              {isSelected ? 'Remove' : 'Select'}
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'gray',
          height: 0.9,
          marginHorizontal: 20,
        }}></View>
    </View>
  );
};

const RegisterTeam = () => {
  const route = useRoute();
  const [modal, setModal] = useState(false);
  const eid = route?.params?.eid;
  const {dbUser, tokens} = useAuthContext();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const {width} = useWindowDimensions();
  const [name, setName] = useState('');
  const {users} = useAuthContext();
  const eventDetail = route?.params?.eventDetail;
  const [transId, setTransId] = useState('');
  const [image, setImage] = useState(null);
  const [modal1, setModal1] = useState(false);
  const navigation = useNavigation();
  const [verify, setVerify] = useState(null);
  const [idCardImage, setIdCardImage] = useState(null);
  const [posterImage, setPosterImage] = useState(null);
  const scrollViewRef = useRef(null);
  const [show, setShow] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');

  const openIdImagePicker = async () => {
    // console.log(image);
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Set this to true to include base64 data
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const base64Image = response.base64; // Get the base64 representation

        // console.log(response.assets[0].base64);
        setIdCardImage(response.assets[0].base64); // Log the base64 data
        // setImage(imageUri);
      }
    });
  };
  const openPosterImagePicker = async () => {
    // console.log(image);
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Set this to true to include base64 data
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const base64Image = response.base64; // Get the base64 representation

        // console.log(response.assets[0].base64);
        setPosterImage(response.assets[0].base64); // Log the base64 data
        // setImage(imageUri);
      }
    });
  };
  const openImagePicker = async () => {
    // console.log(image);
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Set this to true to include base64 data
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const base64Image = response.base64; // Get the base64 representation

        // console.log(response.assets[0].base64);
        setImage(response.assets[0].base64); // Log the base64 data
        // setImage(imageUri);
      }
    });
  };
  const showToastWithGravityAndOffset = async msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  const onlineTransaction = async () => {
    // console.log('transId:', transId);
    // console.log('transUrl:', image);
    // console.log('hi');
    // console.log({
    //   orderId: verify?.data._id,
    //   transId,
    //   //   transUrl: 'data:image/jpeg;base64' + image,
    //   isCombo: false,
    // });
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/online`,
      {
        orderId: verify?.data._id,
        transId,
        transUrl: 'data:image/jpeg;base64' + image,
        isCombo: false,
      },
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    // console.log('hello');
    // console.log(res.data.res);
    if (res.data.res == 'success') {
      setModal(false);
      setModal1(false);
      showToastWithGravityAndOffset(
        'Partially Registered,Your payment will be verified soon...',
      );
      navigation.goBack();
      navigation.goBack();
    }
  };
  //   const [search, setSearch] = useState('');
  //  const scrollViewRef = useRef(null);
  // const [buttonYPosition, setButtonYPosition] = useState(0);

  // useEffect(() => {
  //   // Measure the position of the "Add Member" button after it's rendered
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.measure((x, y, width, height, pageX, pageY) => {
  //       setButtonYPosition(pageY);
  //     });
  //   }
  // }, []);

  const payOnline = () => {
    setModal(true);
    // console.log(eventDetail);
  };
  const scrollToTop = () => {
    setShow(true);
  };
  const payOffline = async () => {
    // console.log(verify.data._id);
    const res = await axios.post(
      `http://${USER_IP}/api/v1/user/${users}/payment/offline`,
      {orderId: verify?.data._id, isCombo: false},
      {headers: {Authorization: `Bearer ${tokens}`}},
    );
    setModal1(false);
    showToastWithGravityAndOffset('Show this otp at registration desk.');
    // navigation.navigate('MyEvents');
  };

  const addMember = () => {
    // console.log(eventDetail);
    // if (scrollViewRef.current) {
    //   // Calculate the scroll position to go 50 pixels above the "Add Member" button
    //   const scrollToY = buttonYPosition + 100; // Adjust 50 as needed

    //   // Scroll to the calculated position with animation
    //   scrollViewRef.current.scrollTo({y: scrollToY, animated: true});
    // }
    if (selectedUsers.length >= eventDetail?.max_members) {
      Alert.alert(`You can only select maximum ${eventDetail?.max_members}.`);
    } else {
      setShowSearch(true);
    }
  };
  const onPress = async () => {
    // if (scrollViewRef.current) {
    //   scrollViewRef.current.scrollTo({y: 0, animated: true});
    // }
    if (search?.length >= 2) {
      if (eventDetail?.event_type == 'CULTURAL') {
        const response = await axios.get(
          `http://${USER_IP}/api/v1/user/cultural/list?enrolment=${search}&eid=${eid}`,
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        setSearchResult(response.data.data);
      } else if (eventDetail?.event_type == 'NORMAL') {
        const response = await axios.get(
          `http://${USER_IP}/api/v1/user/normal/list?enrolment=${search}&eid=${eid}`,
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        setSearchResult(response.data.data);
      } else if (eventDetail?.event_type == 'FLAGSHIP') {
        const response = await axios.get(
          `http://${USER_IP}/api/v1/user/flagship/list?enrolment=${search}&eid=${eid}`,
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        setSearchResult(response.data.data);
      } else {
        setSearchResult([]);
      }
    }
  };
  // Function to clear the search input
  const clearSearch = () => {
    setSearch('');
    setSearchResult([]);
    setShowSearch(false);
  };
  const scrollY = new Animated.Value(0);
  const [userId, setUserId] = useState([]);
  const [details, setDetails] = useState(null);
  useEffect(() => {
    fetchUserDetail();
  }, []);
  const fetchUserDetail = async () => {
    // setLoginPending(true);
    const response = await axios.get(`http://${USER_IP}/api/v1/user/${users}`, {
      headers: {Authorization: `Bearer ${tokens}`},
    });
    console.log(response.data.data.university);
    setDetails(response.data.data);
    // setLoginPending(false);
  };
  const registerTeam = async () => {
    // console.log(eventDetail);
    if (eventDetail?.event_type == 'CULTURAL') {
      if (selectedUsers.length < 1) {
        Alert.alert('Add atleast 1 member.');
      } else if (name == '') {
        Alert.alert('Team name is necessary');
      } else {
        const userIds = selectedUsers.map(user => user._id);
        const response = await axios.post(
          `http://${USER_IP}/api/v1/user/cultural/submit/group`,
          {
            eid,
            team_name: name,
            uid: users,
            members: userIds,
            price:
              details?.university == 'CVMU'
                ? eventDetail?.price
                : eventDetail?.price + eventDetail.price * 0.18,
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        //   console.log(response.data);
        setVerify(response.data);
        if (response.data.flag) {
          setModal1(true);
        }
      }
    } else if (eventDetail?.event_type == 'NORMAL') {
      // console.log('hi');
      if (selectedUsers.length < 1) {
        Alert.alert('Add atleast 1 member.');
      } else if (name == '') {
        Alert.alert('Team name is necessary');
      } else {
        const userIds = selectedUsers.map(user => user._id);
        const response = await axios.post(
          `http://${USER_IP}/api/v1/user/normal/submit/group`,
          {
            eid,
            team_name: name,
            uid: users,
            members: userIds,
            price:
              details?.university == 'CVMU'
                ? eventDetail?.price
                : eventDetail?.price + eventDetail.price * 0.18,
          },
          {headers: {Authorization: `Bearer ${tokens}`}},
        );
        //   console.log(response.data);
        setVerify(response.data);
        if (response.data.flag) {
          setModal1(true);
        }
      }
    } else if (eventDetail?.event_type == 'FLAGSHIP') {
      if (eventDetail?.category == 'Ideathon') {
        if (selectedUsers.length < 1) {
          Alert.alert('Add atleast 1 member.');
        } else if (name == '') {
          Alert.alert('Team name is necessary.');
        } else if (idCardImage == null) {
          Alert.alert('Id card is necessary.');
        } else if (posterImage == null) {
          Alert.alert('Idea Poster is necessary.');
        } else if (projectTitle == null) {
          Alert.alert('Project title is necessary.');
        } else {
          const userIds = selectedUsers.map(user => user._id);
          const response = await axios.post(
            `http://${USER_IP}/api/v1/user/flagship/submit/group`,
            {
              eid,
              team_name: name,
              uid: users,
              members: userIds,
              poster_url: posterImage,
              leader_ID: idCardImage,
              project_title: projectTitle,
              price:
                details?.university == 'CVMU'
                  ? eventDetail?.price
                  : eventDetail?.price + eventDetail.price * 0.18,
            },
            {headers: {Authorization: `Bearer ${tokens}`}},
          );
          //   console.log(response.data);
          setVerify(response.data);
          if (response.data.flag) {
            setModal1(true);
          }
        }
      } else if (eventDetail?.category == 'ITK_toyothon') {
        if (selectedUsers.length < 1) {
          Alert.alert('Add atleast 1 member.');
        } else if (name == '') {
          Alert.alert('Team name is necessary');
        } else {
          const userIds = selectedUsers.map(user => user._id);
          console.log(userIds);
          console.log(eid);
          console.log(name);
          console.log(users);
          const response = await axios.post(
            `http://${USER_IP}/api/v1/user/flagship/submit/group`,
            {
              eid,
              team_name: name,
              uid: users,
              members: userIds,
              price:
                details?.university == 'CVMU'
                  ? eventDetail?.price
                  : eventDetail?.price + eventDetail.price * 0.18,
            },
            {headers: {Authorization: `Bearer ${tokens}`}},
          );
          //   console.log(response.data);
          setVerify(response.data);
          if (response.data.flag) {
            setModal1(true);
          }
        }
      }
    }
  };

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
            Register Team
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        ref={scrollViewRef}
        style={{padding: 15, backgroundColor: 'white', flex: 1, marginTop: 50}}>
        {/* <Text>RegisterTeam</Text> */}
        {/* Search input */}
        <View>
          {/* <Text
          style={{fontFamily: 'Poppins-Medium', fontSize: 17, color: 'black'}}>
          Register Team:
        </Text> */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <FontAwesome5
              name="users"
              size={20}
              color={'#757575'}
              style={{marginRight: 3}}
            />
            <TextInput
              onChangeText={setName}
              placeholderTextColor="grey"
              placeholder="Team Name"
              value={name}
              style={{
                height: 40,
                marginLeft: 4,
                flex: 1,
                borderBottomWidth: 1,
                borderColor: '#d1cfcf',
                marginVertical: 5,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingBottom: 9,
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: '#212121',
              }}
            />
          </View>
          {eventDetail?.category == 'Ideathon' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                marginBottom: 10,
              }}>
              <Octicons
                name="project"
                size={20}
                color={'#757575'}
                style={{marginRight: 3}}
              />
              <TextInput
                onChangeText={setProjectTitle}
                placeholderTextColor="grey"
                placeholder="Project Title"
                value={projectTitle}
                style={{
                  height: 40,
                  marginLeft: 4,
                  flex: 1,
                  borderBottomWidth: 1,
                  borderColor: '#d1cfcf',
                  // marginVertical: 5,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingLeft: 15,
                  paddingBottom: 9,
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: '#212121',
                }}
              />
            </View>
          )}

          {/* {selectedUsers.length <= 0 && ( */}
          {eventDetail?.category == 'Ideathon' && (
            <View style={{marginTop: 13}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Upload Your ID Card:
              </Text>
              {idCardImage && (
                <Image
                  source={{uri: `data:image/jpeg;base64,${idCardImage}`}}
                  style={{
                    width: 200,
                    height: 200,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                />
              )}
              <Pressable
                onPress={openIdImagePicker}
                style={{
                  height: 38,
                  width: 205,
                  borderRadius: 10,
                  backgroundColor: '#1655BC',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  {idCardImage ? 'Update ID card' : 'Upload ID card'}
                </Text>
                <Feather
                  name="upload"
                  size={20}
                  color={'white'}
                  style={{marginLeft: 8}}
                />
              </Pressable>
            </View>
          )}
          {eventDetail?.category == 'Ideathon' && (
            <View style={{marginTop: 20, marginBottom: 8}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                  color: '#000000',
                }}>
                Upload Your Idea Poster:
              </Text>
              {posterImage && (
                <Image
                  source={{uri: `data:image/jpeg;base64,${posterImage}`}}
                  style={{
                    width: 200,
                    height: 200,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                />
              )}
              <Pressable
                onPress={openPosterImagePicker}
                style={{
                  height: 38,
                  width: 205,
                  borderRadius: 10,
                  backgroundColor: '#1655BC',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  {posterImage ? 'Update Poster' : 'Upload Poster'}
                </Text>
                <Feather
                  name="upload"
                  size={20}
                  color={'white'}
                  style={{marginLeft: 8}}
                />
              </Pressable>
            </View>
          )}
          {selectedUsers.length <= 0 && (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'black',
                fontSize: 12,
                marginVertical: 4,
                marginTop: 10,
              }}>
              *Note: You have to select atleast 1 Member
            </Text>
          )}
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'black',
              fontSize: 12,
              marginVertical: 4,
              marginTop: 10,
            }}>
            *Note: Member must be registered on this app, otherwise they won't
            be shown in recommendation.
          </Text>
          {/* )} */}

          {selectedUsers.length > 0 && (
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: 'black',
                fontSize: 15,
                marginVertical: 12,
              }}>
              Selected Team Members :
            </Text>
          )}
          <FlatList
            style={{marginTop: 0}}
            data={selectedUsers}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 5,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flex: 0.6,
                    // backgroundColor: 'green',
                    alignItems: 'center',
                  }}>
                  <FontAwesome
                    name="user"
                    size={24}
                    color={'#1655BC'}
                    // style={{marginRight: 10}}
                  />
                </View>
                <View style={{flex: 3}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                    }}>
                    {item.enrolment}
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 13,
                    }}>
                    {item.name} (Branch: {item.branch})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedUsers(prevSelectedUsers =>
                      prevSelectedUsers.filter(user => user._id !== item._id),
                    )
                  }
                  style={{
                    flex: 1,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  {/* <MaterialIcons name="cancel" size={20} color="red" /> */}
                  <MaterialIcons name="delete" size={23} color={'gray'} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item._id}
          />
        </View>
        {show && (
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'black',
              fontSize: 12,
              // marginVertical: 4,
              marginTop: 15,
              marginLeft: 20,
            }}>
            *Scrolldown to select team member
          </Text>
        )}
        {showSearch && (
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
              onFocus={scrollToTop}
              placeholder="Search Team Member's Enrolment No."
              placeholderTextColor={'grey'}
              underlineColorAndroid="transparent"
            />
          </View>
        )}
        <FlatList
          data={searchResult}
          renderItem={({item}) => (
            <SearchTeamMate
              clearSearch={clearSearch}
              searchResult={item}
              isSelected={selectedUsers.some(user => user._id === item._id)}
              onSelect={setSelectedUsers}
            />
          )}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 10}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            marginBottom: 100,
          }}>
          <Pressable
            onPress={addMember}
            style={{
              alignContent: 'center',
              marginTop: 25,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#1655BC',
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
              }}>
              +{' '}
            </Text>
            <Text
              style={{
                color: '#1655BC',
                alignSelf: 'center',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 15,
              }}>
              Add Member
            </Text>
          </Pressable>
          <Pressable>
            <Pressable
              onPress={registerTeam}
              style={{
                shadowColor: '#ff9600',
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,
                elevation: 8,
                alignContent: 'center',
                //   alignSelf: 'center',
                marginTop: 25,
                backgroundColor: '#ff9600',
                paddingVertical: 10,
                borderRadius: 13,
                //   maxWidth: width,
                width: 150,
              }}>
              <Text
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 15,
                }}>
                Register Team
              </Text>
            </Pressable>
          </Pressable>
        </View>

        <Modal transparent={true} visible={modal} animationType={'slide'}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View style={{height: 145, alignItems: 'center'}}>
              <Pressable
                onPress={() => setModal(false)}
                style={{
                  backgroundColor: 'white',
                  height: 35,
                  width: 35,
                  padding: 7,
                  borderRadius: 17,
                  alignItems: 'center',
                  marginTop: 60,
                }}>
                <Entypo name="cross" size={21} color={'#000000'} />
              </Pressable>
            </View>
            <ScrollView
              style={{
                backgroundColor: '#ffffff',
                height: '100%',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#191919',
                    fontSize: 17,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  Pay{'  '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: '#1655BC',
                    fontSize: 19,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  {'\u20B9'}{' '}
                  {details?.university == 'CVMU'
                    ? eventDetail?.price
                    : eventDetail?.price + eventDetail.price * 0.18}{' '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#191919',
                    fontSize: 17,
                    textAlign: 'center',
                    marginTop: 6,
                  }}>
                  Online
                </Text>
              </View>
              <Image
                source={{
                  uri: 'https://imaze-bucket.s3.ap-south-1.amazonaws.com/imaze_static_images/qrcode.jpeg',
                }}
                style={{
                  height: 225,
                  width: 267,
                  alignSelf: 'center',
                  marginTop: 0,
                  resizeMode: 'contain',
                }}
              />
              {/* <Button title="Pick Image" onPress={openImagePicker} /> */}
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#000000',
                }}>
                *Note: Your payment will be verified by accouts team, in case of
                any discrepancies found ,serious action will be taken against
                you.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <MaterialCommunityIcons
                  name="cash"
                  size={20}
                  color={'#757575'}
                  style={{marginRight: 3}}
                />
                <TextInput
                  onChangeText={setTransId}
                  placeholderTextColor="grey"
                  placeholder="Transaction ID"
                  value={transId}
                  style={{
                    height: 40,
                    marginLeft: 4,
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: '#d1cfcf',
                    marginVertical: 5,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingBottom: 9,
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#212121',
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#000000',
                }}>
                *Note: Transaction ID should be visible in your screenshot
              </Text>
              <View style={{}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: '#000000',
                  }}>
                  Transaction Image:
                </Text>
                {image && (
                  <Image
                    source={{uri: `data:image/jpeg;base64,${image}`}}
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                )}
                <Pressable
                  onPress={openImagePicker}
                  style={{
                    height: 38,
                    width: 205,
                    borderRadius: 5,
                    backgroundColor: '#1655BC',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 15,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    {image ? 'Update Image' : 'Upload Image'}
                  </Text>
                  <Feather
                    name="upload"
                    size={20}
                    color={'white'}
                    style={{marginLeft: 8}}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={onlineTransaction}
                style={{
                  shadowColor: '#ff9600',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#ff9600',
                  paddingVertical: 10,
                  borderRadius: 13,
                  maxWidth: width,
                  width: width - 46,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  Submit
                </Text>
              </Pressable>
              <View style={{height: 40}}></View>
            </ScrollView>
          </View>
        </Modal>
        <Modal transparent={true} visible={modal1} animationType={'slide'}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View style={{height: 145, alignItems: 'center'}}>
              <Pressable
                onPress={() => setModal1(false)}
                style={{
                  backgroundColor: 'white',
                  height: 35,
                  width: 35,
                  padding: 7,
                  borderRadius: 17,
                  alignItems: 'center',
                  marginTop: 60,
                }}>
                <Entypo name="cross" size={21} color={'#000000'} />
              </Pressable>
            </View>
            <ScrollView
              style={{
                backgroundColor: '#ffffff',
                height: '100%',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                padding: 20,
              }}>
              <Image
                source={require('../../data/paymentMode.jpg')}
                style={{
                  height: 217,
                  width: 267,
                  alignSelf: 'center',
                  marginTop: 12,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  color: '#191919',
                  fontSize: 17,
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                Choose the Payment Mode
              </Text>
              <Pressable
                onPress={payOffline}
                style={{
                  shadowColor: '#1655BC',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#1655BC',
                  paddingVertical: 10,
                  borderRadius: 13,
                  maxWidth: width,
                  width: width - 46,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  Pay Offline
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <View
                  style={{backgroundColor: 'grey', height: 1, flex: 3}}></View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: '#454545',
                    fontSize: 13,
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  OR
                </Text>
                <View
                  style={{flex: 3, backgroundColor: 'grey', height: 1}}></View>
              </View>
              <Pressable
                onPress={payOnline}
                style={{
                  shadowColor: '#ff9600',
                  // shadowColor: '#19347d',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,
                  elevation: 8,
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: 25,
                  backgroundColor: '#ff9600',
                  // backgroundColor: '#19347d',
                  paddingVertical: 10,
                  borderRadius: 13,
                  maxWidth: width,
                  // paddingHorizontal: width / 2 - 64,
                  width: width - 46,
                }}>
                <Text
                  style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 15,
                  }}>
                  Pay Online
                </Text>
              </Pressable>
              <View style={{height: 40}}></View>
            </ScrollView>
          </View>
        </Modal>
        {/* Display selected users */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 16,
    // marginBottom: 1000,
    borderRadius: 25,
    borderColor: '#ededed',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingTop: 5,
  },
  searchIcon: {
    padding: 7,
    marginHorizontal: 4,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    paddingLeft: 0,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#424242',
    height: 40,
    fontFamily: 'Poppins-Regular',
    // marginTop: 10,
  },
});

export default RegisterTeam;
