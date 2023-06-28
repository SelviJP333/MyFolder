import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Pressable,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  AppRegistry,
  SectionList,
  Alert,
  ScrollView,
} from 'react-native';
import Create_Timesheet from '../Components/CreateTimesheet';
import color from '../constants/color';
const window = Dimensions.get('window');

const EmployeePopup = ({setCheck, Check}) => {
  return (
    <>
      <SafeAreaView
        style={{
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Search Container */}
        <View style={styles.EmployeeContainer}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              height: '30%',
              justifyContent: 'flex-end',
            }}>
            <Image
              source={require('../Image/warning.png')}
              style={{
                width: '60%',
                height: 30,
                resizeMode: 'contain',
                margin: 10,
              }}
            />
            <Text style={{color: '#1b386a', fontWeight: 'bold', fontSize: 20}}>
              TIMESHEET WARNING
            </Text>
            <View
              style={{
                display: 'flex',
                fontWeight: 'bold',
                justifyContent: 'center',
                alignItems: 'flex-end',
                width: '35%',
                paddingEnd: '3%',
              }}>
              <View>
                <TouchableOpacity>
                  <Text onPress={() => setCheck(false)} style={{color: '#000'}}>
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={{fontSize: 20, textAlign: 'left', left: 15, top: 25}}>
            Please select at least one employee{' '}
          </Text>
          <View
            style={{
              top: '25%',
              left: '12%',
            }}>
            <TouchableOpacity
              onPress={() => setCheck(false)}
              style={{
                backgroundColor: color.gray,
                height: 50,
                padding: 10,
                width: '22%',
                left: '28%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '500',
                  color: 'white',
                }}>
                Close{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EmployeePopup;
const styles = StyleSheet.create({
  EmployeeContainer: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#cbe91e',
    width: '60%',
    height: '60%',
    position: 'absolute',
    top: 1,
  },
  EmployeeTotalContainer: {
    paddingBottom: 70,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  EmployeeLeftContainer: {
    // backgroundColor:'pink'
  },
  EmployeeRightContainer: {
    width: 500,
  },

  EmployeeSubmitcontainer: {
    width: '100%',
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  EmployeeSubmitTextContain: {
    marginRight: 40,
  },
  EmployeeSubmitText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#84d7d1',
  },
  EmployeeSearch: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  EmployeeText: {
    borderBottomWidth: 1,
    borderBottomColor: '#84d7d1',
    fontSize: 17,
  },
  container: {
    flex: 1,
    marginTop: 0,
    paddingBottom: 40,
  },
  item: {
    paddingTop: 10,
    marginVertical: 0,
    marginHorizontal: 2,
    //backgroundColor: 'red',
    width: 40,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
  },

  checkbox: {
    position: 'absolute',
    left: '3%',
    // backgroundColor:'yellow',
    marginTop: 18,
  },
  labeltext: {
    marginTop: 12,
    color: '#808080',
    fontSize: 28,
    textAlign: 'center',
  },
  lists: {
    backgroundColor: '#fff',
  },
  Alphatext: {
    marginTop: 12,
    color: '#808080',
    fontSize: 23,
    textAlign: 'left',
    marginLeft: 50,
  },
  EmptyDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  listItem: {
    flex: 1,
    height: 50,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    paddingLeft: 10,
  },
});
