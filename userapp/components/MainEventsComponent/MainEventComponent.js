import {View, Text, ScrollView, Image, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {USER_IP} from '@env';
import LinearGradient from 'react-native-linear-gradient';

const MainEventComponent = ({tech}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(`${tech.redirect}`);
  };

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={tech?.colors}
        style={{
          height: 196,
          width: 150,
          borderRadius: 20,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 8,
          marginTop: 5,
          marginBottom: 18,
          marginHorizontal: 12,
          paddingHorizontal: 13,
        }}>
        <Image
          source={{
            uri: `${tech.image}`,
          }}
          style={{
            height: 90,
            width: 90,
            alignSelf: 'center',
            marginBottom: 37,
            marginTop: 33,
            resizeMode: 'contain',
          }}
        />
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
            color: '#191919',
            marginTop: -25,
            alignSelf: 'center',
          }}>
          {tech?.name}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

export default MainEventComponent;
// import React, {useRef, useEffect} from 'react';
// import {View, Text, Image, Animated, Easing} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const MainEventComponent = ({tech}) => {
//   const shineAnimation = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const startShineAnimation = () => {
//       Animated.loop(
//         Animated.timing(shineAnimation, {
//           toValue: 1,
//           duration: 1000, // Adjust the duration as needed
//           easing: Easing.linear,
//           useNativeDriver: false,
//         }),
//       ).start();
//     };

//     startShineAnimation();
//   }, [shineAnimation]);

//   const translateX = shineAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-150, 150], // Adjust the shine width as needed
//   });

//   return (
//     <View style={{marginHorizontal: 12, marginBottom: 18}}>
//       <View
//         style={{
//           width: 150,
//           height: 196,
//           borderRadius: 20,
//           overflow: 'hidden',
//         }}>
//         <Image
//           source={{
//             uri: `${tech.image}`,
//           }}
//           style={{
//             height: 90,
//             width: 90,
//             alignSelf: 'center',
//             marginBottom: 37,
//             marginTop: 33,
//             resizeMode: 'contain',
//           }}
//         />
//         <Text
//           numberOfLines={1}
//           style={{
//             fontFamily: 'Poppins-Regular',
//             fontSize: 14,
//             color: '#191919',
//             marginTop: -25,
//             alignSelf: 'center',
//           }}>
//           {tech?.name}
//         </Text>
//         <Animated.View
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             transform: [{translateX}],
//             backgroundColor: 'rgba(255, 255, 255, 0.4)', // Adjust the shine color and opacity as needed
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// export default MainEventComponent;
