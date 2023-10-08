import React, {useRef, useEffect} from 'react';
import {View, Text, Image, Animated, Easing, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
const FlagshipEventComponent = ({tech}) => {
  const shineAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  //   useEffect(() => {
  //     const startShineAnimation = () => {
  //       Animated.loop(
  //         Animated.timing(shineAnimation, {
  //           toValue: 1,
  //           duration: 3000, // Adjust the duration as needed
  //           easing: Easing.linear,
  //           useNativeDriver: false,
  //         }),
  //       ).start();
  //     };

  //     startShineAnimation();
  //   }, [shineAnimation]);

  //   const translateY = shineAnimation.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [-196, 0], // Adjust the shine height as needed
  //   });

  const onPress = () => {
    navigation.navigate(`${tech.redirect}`, {
      eventId: tech?.eventId,
      type: tech?.type,
    });
  };

  return (
    <Pressable onPress={onPress} style={{marginVertical: 8}}>
      <View
        style={{
          marginHorizontal: 8,
          marginBottom: 18,
          width: 110,
          height: 140,
          borderRadius: 20,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={['#B1802F', '#D0B144', '#F0CE37', '#D0B144', '#B1802F']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <Image
          source={{
            uri: `${tech.image}`,
          }}
          style={{
            height: 85,
            width: 85,
            alignSelf: 'center',
            marginBottom: 7,
            marginTop: 20,
            resizeMode: 'contain',
            paddingHorizontal: 8,
          }}
        />
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 12.5,
            color: '#000000', // Text color
            marginTop: -22,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          {tech?.name}
        </Text>
        {/* <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: [{translateY}],
            backgroundColor: 'rgba(255, 255, 255, 0.4)', // Shine color and opacity
          }}
        /> */}
      </View>
    </Pressable>
  );
};

export default FlagshipEventComponent;

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
