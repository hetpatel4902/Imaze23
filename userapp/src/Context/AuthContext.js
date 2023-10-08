import {View, Text} from 'react-native';
import React, {useEffect, useState, createContext, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppLoader from '../../components/AppLoader';
import SearchLoader from '../../components/SearchLoader';
// import {PAYMENT_IP} from '@env';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [dbUser, setDbUser] = useState(null);
  const [user, setUser] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [users, setUsers] = useState(null);
  const [choice1, setChoice1] = useState(false);
  const [choice2, setChoice2] = useState(false);
  const [nonTechArr, setNonTechArr] = useState([]);
  const [techArr, setTechArr] = useState([]);
  const [workshopArr, setWorkshopArr] = useState([]);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loginPending, setLoginPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [cvmu, setCvmu] = useState('');
  const [college, setCollege] = useState('');
  // const [name,setName] = useState()
  let jsonValue;
  let jsonValue1;
  let favourite;
  let Arr;
  useEffect(() => {
    getData();
  }, []);
  // const set = arr => {
  //   setTechArr(arr);
  //   console.log('from context arr:', techArr);
  // };
  const check = () => {
    console.log('tech:', techArr.length);
    console.log('nontech:', nonTechArr.length);
    console.log('workshop:', workshopArr.length);
    if (
      techArr.length == 2 &&
      nonTechArr.length == 1 &&
      workshopArr.length == 1
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  const getData = async () => {
    setLoginPending(true);
    const value = await AsyncStorage.getItem('userDetail');
    // const collegeDetail = await AsyncStorage.getItem('collegeDetail');
    // jsonValue1 = JSON.parse(collegeDetail);
    jsonValue = JSON.parse(value);
    if (value != null) {
      console.log('user in auth context:', jsonValue);
      setUser(true);
      setUsers(jsonValue?.userID);
      setTokens(jsonValue?.token);
      setName(jsonValue?.name);
      setDbUser(jsonValue);
      // setCvmu(jsonValue1?.cvmuStudent);
      // setCollege(jsonValue1?.college);
    } else {
      setUser(false);
    }

    setLoginPending(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        dbUser,
        tokens,
        users,
        setTokens,
        jsonValue,
        getData,
        loginPending,
        setLoginPending,
        name,
        setName,
        setUserId,
        userId,
        choice1,
        setChoice1,
        choice2,
        setChoice2,
        techArr,
        setTechArr,
        nonTechArr,
        setNonTechArr,
        workshopArr,
        setWorkshopArr,
        loading,
        setLoading,
        check,
        visible,
        setVisible,
        Arr,
        price,
        setPrice,
        // cvmu,
        // college,
      }}>
      {children}
      {loginPending ? <SearchLoader /> : null}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
