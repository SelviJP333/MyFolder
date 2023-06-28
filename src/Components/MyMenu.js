import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {Savefunc_Context} from '../App';

const MyMenu = ({navigation, name}) => {
  const value = useContext(Savefunc_Context);
  const getUser = useSelector(store => store); 
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const ewapressed = () => {
    value['values'][1](true);
    hideMenu();
    navigation.navigate('MyEwa');
  };

  const Homepressed = () => {
    // getUser["menu_save_time_reducer"]()
    value['values'][1](true);
    hideMenu();
    setTimeout(() => {
      navigation.navigate('My TimeSheet');
    }, 5000);
    //  navigation.navigate('My TimeSheet');
  };

  const Reportpressed = () => {
    value['values'][1](true);
    hideMenu();
    setTimeout(() => {
      navigation.navigate('SendReport');
    }, 5000);
  };

  const Logout = () => {
    value['values'][1](true);
    hideMenu();
    setTimeout(() => {
      AsyncStorage.clear();
      navigation.navigate('Auth');
    }, 5000);
  };

  return (
    <View
      style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <Menu
        style={{top: 75}}
        visible={visible}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <Image
              source={require('../Image/menu.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}>
        <MenuItem onPress={Homepressed}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={require('../Image/timer.png')}
              style={{
                width: 30,
                height: 30,
                left: 5,
                top: 10,
              }}
            />
            <Text style={{textAlignVertical: 'center', top: 17, left: 15}}>
              My TimeSheet
            </Text>
          </View>
        </MenuItem>

        <MenuItem onPress={ewapressed}>
          {' '}
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={require('../Image/timer.png')}
              style={{
                width: 30,
                height: 30,
                left: 5,
                top: 10,
              }}
            />
            <Text style={{textAlignVertical: 'center', top: 17, left: 15}}>
              My Ewa
            </Text>
          </View>
        </MenuItem>

        <MenuItem onPress={Reportpressed}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={require('../Image/Report.png')}
              style={{
                width: 30,
                height: 30,
                left: 10,
                top: 10,
              }}
            />
            <Text style={{textAlignVertical: 'center', top: 17, left: 15}}>
              Reports
            </Text>
          </View>
        </MenuItem>
        <MenuItem onPress={Logout}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={require('../Image/Logout.png')}
              style={{
                width: 30,
                height: 30,
                left: 10,
                top: 10,
              }}
            />
            <Text style={{textAlignVertical: 'center', top: 17, left: 15}}>
              Log Out
            </Text>
          </View>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MyMenu;
