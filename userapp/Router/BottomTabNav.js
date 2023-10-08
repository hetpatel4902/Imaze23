import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createStackNavigator} from '@react-navigation/stack';
// import HistoryScreen from '../screens/MyEvents';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Ionicons from 'react-native-vector-icons/Font';
import HomeScreen from '../screens/HomeScreen';
// import BasketScreen from '../screens/BasketScreen';
import TechEvents from '../screens/HomeScreen/TechEvents';
import RegisterTeam from '../screens/HomeScreen/RegisterTeam';
import NonTechEvents from '../screens/HomeScreen/NonTechEvents';
import CulturalEvents from '../screens/HomeScreen/CulturalEvents';
import Workshop from '../screens/HomeScreen/Workshop';
import EventDetailScreen from '../screens/HomeScreen/EventDetailScreen';
import SearchScreen from '../screens/HomeScreen/SearchScreen';
import ComboScreen from '../screens/ComboScreen';
import MyEvents from '../screens/MyEvents';
import StaticComboScreen from '../screens/ComboScreen/StaticComboScreen';
import DynamicComboScreen from '../screens/ComboScreen/DynamicComboScreen';
import DynamicTechSelectScreen from '../screens/ComboScreen/DynamicTechSelectScreen';
import DynamicNonTechSelectScreen from '../screens/ComboScreen/DynamicNonTechSelectScreen';
import DynamicWorkshopSelectScreen from '../screens/ComboScreen/DynamicWorkshopSelectScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PaymentHistory from '../screens/ProfileScreen/PaymentHistory';
import UpdateProfile from '../screens/ProfileScreen/UpdateProfile';
import AboutUsScreen from '../screens/ProfileScreen/AboutUsScreen';
import DownloadCertificate from '../screens/ProfileScreen/DownloadCertificate';
import Itk from '../screens/Itk';
import HappyStreet from '../screens/HappyStreet';
import Ideathon from '../screens/Ideathon';
import BuyTokenScreen from '../screens/HomeScreen/BuyTokenScreen';
import Toyathon from '../screens/HomeScreen/Toyathon';
import WorkshopItk from '../screens/HomeScreen/WorkshopItk';
import SocialActivity from '../screens/HomeScreen/SocialActivity';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BottomTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#e3edfc',
        tabBarActiveTintColor: '#1655BC',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 50,
          position: 'absolute',
          bottom: 5,
          right: 16,
          left: 16,
          borderRadius: 13,
          paddingBottom: 6,
        },
      }}>
      <Tab.Screen
        component={HomeStack}
        name="Home"
        options={{
          // unmountOnBlur: true,

          headerShown: false,
          tabBarLabelStyle: {
            marginTop: -8,
            marginBottom: 2,
            fontSize: 9,
            // color: 'black',
          },
          tabBarIcon: ({color}) => (
            <Entypo name="home" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        component={ComboStack}
        name="Combos"
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabelStyle: {marginTop: -8, marginBottom: 2, fontSize: 9},
          tabBarIcon: ({color}) => (
            <AntDesign name="appstore1" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        component={MyEventStack}
        name="Cart"
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabelStyle: {marginTop: -8, marginBottom: 2, fontSize: 9},
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="shopping-cart" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        component={ProfileScreenStack}
        name="Profile"
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabelStyle: {marginTop: -8, marginBottom: 2, fontSize: 9},
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="user-alt" size={18} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNav;

const MyEventStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={MyEvents} name="MyEvents" />
      <Stack.Screen component={EventDetailScreen} name="EventDetailScreen" />
    </Stack.Navigator>
  );
};

const ComboStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={ComboScreen} name="ComboScreen" />
      <Stack.Screen component={StaticComboScreen} name="StaticComboScreen" />
      <Stack.Screen component={DynamicComboScreen} name="DynamicComboScreen" />
      <Stack.Screen
        component={DynamicTechSelectScreen}
        name="DynamicTechSelectScreen"
      />
      <Stack.Screen
        component={DynamicNonTechSelectScreen}
        name="DynamicNonTechSelectScreen"
      />
      <Stack.Screen
        component={DynamicWorkshopSelectScreen}
        name="DynamicWorkshopSelectScreen"
      />
      <Stack.Screen component={EventDetailScreen} name="EventDetailScreen" />
      <Stack.Screen component={MyEvents} name="MyEvents" />
    </Stack.Navigator>
  );
};
const ProfileScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={ProfileScreen} name="ProfileScreen" />
      <Stack.Screen component={PaymentHistory} name="PaymentHistory" />
      <Stack.Screen component={UpdateProfile} name="UpdateProfile" />
      <Stack.Screen component={MyEvents} name="MyEvents" />
      <Stack.Screen component={AboutUsScreen} name="AboutUsScreen" />
      <Stack.Screen
        component={DownloadCertificate}
        name="DownloadCertificate"
      />
      <Stack.Screen component={EventDetailScreen} name="EventDetailScreen" />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen component={MyEvents} name="MyEvents" />
      <Stack.Screen component={TechEvents} name="TechEvents" />
      <Stack.Screen component={NonTechEvents} name="NonTechEvents" />
      <Stack.Screen component={CulturalEvents} name="CulturalEvents" />
      <Stack.Screen component={Workshop} name="Workshop" />
      <Stack.Screen component={EventDetailScreen} name="EventDetailScreen" />
      <Stack.Screen component={RegisterTeam} name="RegisterTeam" />
      <Stack.Screen component={SearchScreen} name="SearchScreen" />
      <Stack.Screen component={Ideathon} name="Ideathon" />
      <Stack.Screen component={HappyStreet} name="HappyStreet" />
      <Stack.Screen component={Itk} name="Itk" />
      <Stack.Screen component={BuyTokenScreen} name="BuyTokenScreen" />
      <Stack.Screen component={Toyathon} name="Toyathon" />
      <Stack.Screen component={WorkshopItk} name="WorkshopItk" />
      <Stack.Screen component={SocialActivity} name="SocialActivity" />
    </Stack.Navigator>
  );
};
