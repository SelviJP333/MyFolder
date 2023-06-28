import React, {useState} from 'react';
//import react in our code.
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
//import all the components we are going to use.
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
//import menu and menu item

const NavigationDrawerHeader = ({
  isIcon,
  menuText,
  textStyle,
  route,
  navigation,
}) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  const Logout = () => {
    setVisible(false);
    Alert.alert(
      'Wait !!!',
      'Are you sure you want to Logout',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            navigation.navigate('LoginScreen');
          },
          // style: "cancel",
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  return (
    <View>
      <Menu
        style={{
          top: 75,
          height: 200,
          maxHeight: 210,
          width: 190,
          maxWidth: 200,
        }}
        visible={visible}
        animationDuration={200}
        anchor={
          isIcon ? (
            <TouchableOpacity onPress={showMenu}>
              <Image
                source={require('../Image/menu.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          ) : (
            <Text onPress={showMenu} style={textStyle}>
              {menuText}
            </Text>
          )
        }
        onRequestClose={hideMenu}>
        {
          (route.name === 'FirstPage',
          'MyEwa',
          'Report' ? (
            <MenuItem
              style={styles.menuitem}
              onPress={() => {
                navigation.navigate('TimeSheetScreen');
                hideMenu();
              }}>
              <View>
                <Image
                  source={require('../Image/timer.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>
              <View>
                <Text style={{top: 13, paddingLeft: 15}}>My Time Cards</Text>
              </View>
            </MenuItem>
          ) : null)
        }
        {
          (route.name === 'FirstPage',
          'MyEwa',
          'Report' ? (
            <MenuItem
              style={styles.menuitem}
              onPress={() => {
                navigation.navigate('MyEwa');
                hideMenu();
              }}>
              <View>
                <Image
                  source={require('../Image/timer.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>
              <View>
                <Text style={{paddingBottom: 5, paddingLeft: 15}}>My EWAs</Text>
              </View>
            </MenuItem>
          ) : null)
        }
        {
          (route.name === 'FirstPage',
          'MyEwa',
          'Report' ? (
            <MenuItem
              style={styles.menuitem}
              onPress={() => {
                navigation.navigate('Report');
                hideMenu();
              }}>
              <View>
                <Image
                  source={require('../Image/Report.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>
              <View>
                <Text style={{paddingBottom: 5, paddingLeft: 15}}>Report</Text>
              </View>
            </MenuItem>
          ) : null)
        }
        <MenuItem style={styles.menuitem} onPress={Logout}>
          <View>
            <Image
              source={require('../Image/Logout.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </View>
          <View>
            <Text style={{paddingBottom: 5, paddingLeft: 10}}> Log Out</Text>
          </View>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default NavigationDrawerHeader;

const styles = StyleSheet.create({
  menuitem: {
    left: 15,
  },
});
