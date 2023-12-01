import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Linking,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AboutUsScreen = () => {
  const {width} = useWindowDimensions();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: 'white',
        flex: 1,
        padding: 14,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <FontAwesome5
          name="users"
          size={17}
          color={'#000000'}
          style={{marginRight: 3}}
        />
        <Text
          style={{
            marginLeft: 3,
            fontFamily: 'Poppins-Medium',
            color: '#000000',
            fontSize: 19,
            marginTop: 3,
            // marginBottom: 10,
          }}>
          About Developers
        </Text>
      </View>
      <View
        style={{
          margin: 10,
          borderRadius: 25,
          backgroundColor: 'white',
          height: 415,
          width: width - 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
        }}>
        <Image
          source={require('../../data/Het.jpg')}
          style={{
            height: 310,
            width: '100%',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Medium',
            color: '#000000',
            fontSize: 16,
            marginTop: 7,
            textAlign: 'center',
          }}>
          Het Patel
        </Text>
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Regular',
            color: '#000000',
            fontSize: 14,
            marginTop: 4,
            textAlign: 'center',
          }}>
          App & AWS Developer
        </Text>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/het-patel-462236201/',
              )
            }>
            <FontAwesome name="linkedin" size={18} color={'#0077b5'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:hetpatel5542@gmail.com`)}>
            <Ionicons name="ios-mail" size={18} color={'#ea4335'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/917698545581')}>
            <FontAwesome name="whatsapp" size={20} color={'#59ce72'} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          margin: 10,
          marginTop: 15,
          borderRadius: 25,
          backgroundColor: 'white',
          height: 415,
          width: width - 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
        }}>
        <Image
          source={require('../../data/Pratham1.jpeg')}
          style={{
            height: 310,
            width: '100%',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Medium',
            color: '#000000',
            fontSize: 16,
            marginTop: 7,
            textAlign: 'center',
          }}>
          Pratham Shah
        </Text>
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Regular',
            color: '#000000',
            fontSize: 14,
            marginTop: 4,
            textAlign: 'center',
          }}>
          Backend Developer
        </Text>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/pratham-shah-269a93205/',
              )
            }>
            <FontAwesome name="linkedin" size={18} color={'#0077b5'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:prathamshah019@gmail.com`)}>
            <Ionicons name="ios-mail" size={18} color={'#ea4335'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/918200470050')}>
            <FontAwesome name="whatsapp" size={20} color={'#59ce72'} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          margin: 10,
          marginTop: 15,
          borderRadius: 25,
          backgroundColor: 'white',
          height: 400,
          width: width - 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
          marginBottom: 20,
        }}>
        <Image
          source={require('../../data/Kandarp.jpg')}
          style={{
            height: 300,
            width: '100%',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Medium',
            color: '#000000',
            fontSize: 16,
            marginTop: 7,
            textAlign: 'center',
          }}>
          Kandarp Shah
        </Text>
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Regular',
            color: '#000000',
            fontSize: 14,
            marginTop: 4,
            textAlign: 'center',
          }}>
          Backend Developer
        </Text>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/kandarp-shah-88b732196/',
              )
            }>
            <FontAwesome name="linkedin" size={18} color={'#0077b5'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:shahkandarp24@gmail.com`)}>
            <Ionicons name="ios-mail" size={18} color={'#ea4335'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/917016763640')}>
            <FontAwesome name="whatsapp" size={20} color={'#59ce72'} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          margin: 10,
          marginTop: 15,
          borderRadius: 25,
          backgroundColor: 'white',
          height: 400,
          width: width - 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
          marginBottom: 20,
        }}>
        <Image
          source={require('../../data/Krish.jpeg')}
          style={{
            height: 300,
            width: '100%',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Medium',
            color: '#000000',
            fontSize: 16,
            marginTop: 7,
            textAlign: 'center',
          }}>
          Krish Jotaniya
        </Text>
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Regular',
            color: '#000000',
            fontSize: 14,
            marginTop: 4,
            textAlign: 'center',
          }}>
          App Developer
        </Text>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/krishjotaniya/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
              )
            }>
            <FontAwesome name="linkedin" size={18} color={'#0077b5'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:krishjotaniya71@gmail.com`)}>
            <Ionicons name="ios-mail" size={18} color={'#ea4335'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/918160704091')}>
            <FontAwesome name="whatsapp" size={20} color={'#59ce72'} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          margin: 10,
          marginTop: 15,
          borderRadius: 25,
          backgroundColor: 'white',
          height: 400,
          width: width - 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          elevation: 7,
          marginBottom: 100,
        }}>
        <Image
          source={require('../../data/Dipanshu.jpeg')}
          style={{
            height: 300,
            width: '100%',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Medium',
            color: '#000000',
            fontSize: 16,
            marginTop: 7,
            textAlign: 'center',
          }}>
          Dipanshu Bharatiya
        </Text>
        <Text
          style={{
            // marginLeft: 3,
            fontFamily: 'Fredoka-Regular',
            color: '#000000',
            fontSize: 14,
            marginTop: 4,
            textAlign: 'center',
          }}>
          UI/UX Developer
        </Text>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/dipanshubharatia?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
              )
            }>
            <FontAwesome name="linkedin" size={18} color={'#0077b5'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:dbharatia09@gmail.com`)}>
            <Ionicons name="ios-mail" size={18} color={'#ea4335'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/919429792431')}>
            <FontAwesome name="whatsapp" size={20} color={'#59ce72'} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUsScreen;
