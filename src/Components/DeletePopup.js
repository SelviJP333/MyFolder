import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Datepickpopup from '../Components/Datepickpopup';
import {TextInput} from 'react-native-gesture-handler';
import Create_Timesheet from '../Components/CreateTimesheet';
import db from '../constants/db';
import color from '../constants/color';

const DeletePopup = ({setModalVisible, DelClicked, deleteRec}) => {
  const [SlideDates, setSlideDates] = useState([]);
  const [DefaultDate, setDefaultDate] = useState('');
  const [SelectedDate, setSelectedDate] = useState('');
  const [created_data, setCreated_Data] = useState([]);
  const [GetDate, setGetDate] = useState('');
  const [InitialSelectDate, setInitialSelectDate] = useState('');

  const offset = useSharedValue(-100);
  ///Yes Or No Popup//////////////
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const [isDateModalVisible, setDateModalVisible] = useState(false);

  function Combined() {
    setDateModalVisible(true);
    //  setShowDate(false);
  }

  function Cancel() {
    setModalVisible(false);
    offset.value = withSpring(-250);
  }


  useEffect(() => {
    // Get the current date
    offset.value = withSpring(15);
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: offset.value}],
    };
  });

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
        <Animated.View style={[styles.box, animatedStyles]}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: '75%',
              height: '38%',
              borderRadius: 0,
              marginBottom: '40%',
            }}>
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
              <Text
                style={{
                  color: '#1b386a',
                  fontSize: 25,
                  fontWeight: '800',
                  textAlign: 'center',
                  // left: 15,
                }}>
                Delete Timesheet
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
                    <Text onPress={() => Cancel()} style={{color: '#000'}}>
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: 23,
                top: 10,
                padding: 20,
              }}>
              {/* Are you sure you want to delete the entire timesheet for the{' '}
              {DelClicked.WeekEndDate}. This action cannot be undone */}
              Are you sure you want to permanently erase the entire timesheet for the date{' '}
              {DelClicked.WeekEndDate}. You can't undo this action.
            </Text>
            <View
              style={{
                top: '10%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  deleteRec(DelClicked);
                }}
                style={{
                  backgroundColor: '#113467',
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
                  Yes{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Cancel()}
                style={{
                  backgroundColor: 'grey',
                  height: 50,
                  padding: 10,
                  width: '23%',
                  left: '53%',
                  bottom: 50,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default DeletePopup;

const styles = StyleSheet.create({
  touch: {
    backgroundColor: '#1b386a',
    paddingTop: 10,
    width: '90%',
    // marginTop: 30,
    // zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    top: 120,
    height: 60,
    // left: 110,
  },

  SlideinputStyle: {
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderColor: '#E8E8E8',
    width: '50%',
  },
});
