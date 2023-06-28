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
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import Datepickpopup from '../Components/Datepickpopup';
import {TextInput} from 'react-native-gesture-handler';
import Create_Timesheet from '../Components/CreateTimesheet';
import db from '../constants/db';
import color from '../constants/color';
import SynchData from '../Sync/SynchData';
import Processing from './Processing';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
const SubmitPopup = ({
  navigation,
  setSubmitModalVisible,
  setshowDatas,
  deleteRecord,
  FinalizeModalData,
  DelClicked,
  SendReport,
  GetData,
}) => {
  var dates = moment();

  var currentDate = dates.format('MM/DD/YYYY');
  const networkStatus = checkNetworkStatus();
  const offset = useSharedValue(-100);
  ///Yes Or No Popup//////////////
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const [isDateModalVisible, setDateModalVisible] = useState(false);

  function Combined() {
    setDateModalVisible(true);
    //  setShowDate(false);
  }

  function Cancel() {
    setSubmitModalVisible(false);
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

  const GetDateTime = () => {
    let dateTime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    return dateTime;
  };
  const Submit = async () => {
    // setprocess_loader(true);
    var DateTime = CurrentUTCTime();
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    let SubmittedBy = await AsyncStorage.getItem('SubmitUserID');

    db.transaction(tx => {
      var query = `update Timesheet set StatusId = 2 , SubmittedBy = ${SubmittedBy},SubmittedOn = '${DateTime}' ,UpdatedBy = ${SubmittedBy},UpdatedOn= '${DateTime}' WHERE TimesheetID =
      '${DelClicked.TimesheetID}' and CreatedOn = '${DelClicked.CreatedOn}'`;
      tx.executeSql(query, [], (tx, res) => {
        let columnname = [
          'StatusID',          
          'SubmittedOn',
          'SubmittedBy',
          'UpdatedBy',
          'UpdatedOn',
        ];
        let columnvalue = [2, DateTime,SubmittedBy,  SubmittedBy, DateTime];
        for (let i = 0; i < columnname.length; i++) {
          tx.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'U',
              'Timesheet',
              DelClicked.TimesheetID,
              columnname[i],
              columnvalue[i],
              DateTime,
              Deviceid,
              0,
              0,
              '-',
            ],
          );
        }
      });
    });
    setSubmitModalVisible(false);
    GetData();
  };

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
                Submit Timesheet
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
              Are you sure you want to Submit time through {''}
              {DelClicked.WeekEndDate} ?
            </Text>
            <View
              style={{
                top: '10%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Submit();
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

export default SubmitPopup;

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
