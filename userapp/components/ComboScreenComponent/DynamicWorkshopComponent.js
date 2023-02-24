import {View, Text, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthContext} from '../../src/Context/AuthContext';
const DynamicWorkshopComponent = ({tech}) => {
  const {workshopArr, setWorkshopArr} = useAuthContext();
  const [selected, setSelected] = useState(false);
  const [done, setDone] = useState(false);
  let Arr = workshopArr;
  useEffect(() => {
    fun();
  }, [Arr]);
  const fun = () => {
    if (Arr.length == 1) {
      setDone(true);
    }
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        setSelected(true);
      }
    }
  };
  // const check = () => {};
  const func = () => {
    let flag = 0;
    for (let i = 0; i < Arr.length; ++i) {
      if (Arr[i] == tech._id) {
        Arr = Arr.filter(a => a != tech._id);
        setSelected(false);
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      if (Arr.length < 1) {
        Arr.push(tech._id);
      }
    }
    setWorkshopArr(Arr);
  };
  const onClick = () => {
    func();
    fun();
  };
  return (
    <View>
      <Pressable onPress={onClick}>
        <Text style={{color: selected ? 'blue' : 'black'}}>{tech.name}</Text>
      </Pressable>
    </View>
  );
};

export default DynamicWorkshopComponent;
