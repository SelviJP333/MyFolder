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
import SynchData from '../Sync/SynchData';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  log,
} from 'react-native-reanimated';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
import db from '../constants/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Processing from './Processing';
import CurrentUTCTime from '../constants/CurrentUTCTime';
const FinalizePopup = ({
  setFinalizeModalVisible,
  navigation,
  FinalizeModalData,
  setprocess_loader,
  Self_Approve,
  More_than_one,
}) => {
  const [Is_Head, setIs_Head] = useState(null);
  useEffect(() => {
    (async () => {
      let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');

      db.transaction(txn => {
        txn.executeSql(
          `select * from Employee  where EmployeeId =(select EmployeeId from user where UserID=${SubmitUserID}) and  ApproverID =(select UserID from User where UserID=${SubmitUserID})`,
          [],
          async function (tx, res) {
            var temp = [];

            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }

            temp.length !== 0 ? setIs_Head(true) : setIs_Head(false);
          },
        );
      });
    })();
  }, []);

  const networkStatus = checkNetworkStatus();

  const offset = useSharedValue(-100);
  ///Yes Or No Popup///

  const [isDateModalVisible, setDateModalVisible] = useState(false);

  function Combined() {
    setDateModalVisible(true);
  }

  const Finalize = async () => {
    // setprocess_loader(true);
    var DateTime = CurrentUTCTime();
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    var query = `update Timesheet set StatusId = 5 , UpdatedBy = ${SubmitUserID},UpdatedOn = '${DateTime}',FinalizedByUserID='${SubmitUserID}' WHERE TimesheetID =
    '${FinalizeModalData.TimesheetID}'`;

    db.transaction(txn => {
      txn.executeSql(query, [], function (tx, res) {
        let columnname = [
          'StatusID',
          'FinalizedByUserID',
          'UpdatedBy',
          'UpdatedOn',
        ];
        let columnvalue = [5, SubmitUserID, SubmitUserID, DateTime];
        for (let i = 0; i < columnname.length; i++) {
          txn.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'U',
              'Timesheet',
              FinalizeModalData.TimesheetID,
              columnname[i],
              columnvalue[i],
              DateTime,
              Deviceid,
              0,
              0,
              '-',
            ],
            function (tx, res) {},
          );
        }

        let query2 = `UPDATE TimesheetEmployee set IsApproved=1, ApprovedByUserID= ${SubmitUserID},UpdatedBy= ${SubmitUserID},UpdatedOn='${DateTime}' where TimesheetEmployeeID= '${
          Is_Head ? Self_Approve : null
        }'`;

        console.log('query', query2);
        txn.executeSql(
          query2,
          [],
          function (tx, res) {
            console.log('res', res.rowsAffected);
            if (res.rowsAffected > 0) {
              let columnname = [
                'IsApproved',
                'ApprovedByUserID',
                'UpdatedBy',
                'UpdatedOn',
              ];
              let columnvalue = [1, SubmitUserID, SubmitUserID, DateTime];
              for (let i = 0; i < columnname.length; i++) {
                txn.executeSql(
                  'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                  [
                    'U',
                    'TimesheetEmployee',
                    Self_Approve,
                    columnname[i],
                    columnvalue[i],
                    DateTime,
                    Deviceid,
                    0,
                    0,
                    '-',
                  ],
                  function (tx, res) {
                    //passData();
                  },
                );
              }
            }
          },
          error => {
            console.error(error);
          },
        );

        {
          More_than_one.length === 0
            ? txn.executeSql(
                `UPDATE Timesheet set StatusID=3 ,UpdatedBy= ${SubmitUserID},
                UpdatedOn='${DateTime}' where TimesheetID='${
                  Is_Head ? FinalizeModalData.TimesheetID : null
                }'`,
                [],
                function (tx, res) {
                  if (Is_Head) {
                    let columnname = ['StatusID', 'UpdatedBy', 'UpdatedOn'];
                    let columnvalue = [3, SubmitUserID, DateTime];
                    for (let i = 0; i < columnname.length; i++) {
                      txn.executeSql(
                        'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                          ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                        [
                          'U',
                          'Timesheet',
                          FinalizeModalData.TimesheetID,
                          columnname[i],
                          columnvalue[i],
                          DateTime,
                          Deviceid,
                          0,
                          0,
                          '-',
                        ],
                        function (tx, res) {},
                      );
                    }
                  }
                },
                error => {
                  console.error('eeeeeeeeeeeeeeee', error);
                },
              )
            : null;
        }
      });
    });
    setprocess_loader(false);
    setFinalizeModalVisible(false);
    navigation.navigate('My TimeSheet');
  };

  function Cancel() {
    setFinalizeModalVisible(false);
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
                Finalize Timesheet
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
              Are you sure you want to Finalize the entire timesheet ?
            </Text>
            <View
              style={{
                top: '10%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Finalize();
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

export default FinalizePopup;

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
