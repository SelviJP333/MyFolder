import React, {useEffect, useState} from 'react';
import db from '../constants/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import epochTime from '../constants/epochTime';
import axios from 'axios';
import moment from 'moment';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import { BaseURL } from '../constants/BaseURL';
const SynchInsertData = ({
  aTable,
  aData,
  setaTable, setaData
}) => {
  useEffect(() => {
    if (aTable.length > 0) {
      update();
    }
  }, [aTable]);
 
  var aFiles = [];
console.log("aData",aData);
  const update = async () => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');
    let device_id = await AsyncStorage.getItem('device_id');
    let oData = aTable.map(item => {
      if (item.Columns[0] != undefined) {
        return {
          TableName: item.TableName,
          Columns: item.Columns[0],
          InsertedRows: item.InsertedRows,
          UpdatedRows: [],
          DeletedRows: [],
        };
      }
    });

    oData = oData.filter(function (element) {
      return element !== undefined;
    });
 
    let newArray = [
      {
        name: 'data',
        value: {
          userID: user_id,
          deviceID: JSON.parse(device_id),
          pushNotificationRegistrationID: 0,
          deviceSynchHistoryID: 0,
          version: '4.032',
          platform: 'ipad',
          data: oData,
          files: aFiles,
          currentSynchDateTimeDevice: epochTime(),
          currentSynchDateTimeServer: 0,
          dataSynchIDs: [],
          fileSynchIDs: [],
        },
      },
    ];
 
    let dateTime = CurrentUTCTime();
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    var config = {
      method: 'post',
      url:`${BaseURL}Synch/SynchDataWithServer`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: newArray,
    };

    axios(config).then(async function (response) {
      console.log('Insert response', response.data);
      if (response.data && response.data.response && response.data.response.data ) {
      db.transaction(txn => {
        txn.executeSql(
          `UPDATE Device SET UpdatedBy=?,UpdatedOn=?,LastSynchDateTime=? ,LastSynchBy=? WHERE DeviceID =?`,
          [
            SubmitUserID,
            dateTime,
            response.data.response.currentSynchDateTimeDevice,
            SubmitUserID,
            Deviceid,
          ],
          async function (tx, res) {
            // console.log('Update Device', res.rowsAffected);
             aData.map(item => {
              console.log("f", 1,
              response.data.response.currentSynchDateTimeDevice,
              'Complete',
              item.RowID,
              item.DataLogID);
              txn.executeSql(
                `UPDATE DeviceSynchDataLog set IsObsolete = ?,SynchedDateTime=?,SynchMessage=? where RowID=? and Action='I' and IsObsolete=0 and DatalogID=?`,
                [
                  1,
                  response.data.response.currentSynchDateTimeDevice,
                  'Complete',
                  item.RowID,
                  item.DataSynchID
                ],
                async function (tx, res) {
                  console.log('UPDATE DeviceSynchDataLog', res.rowsAffected);
                  setaTable([]);
                  setaData([])
                },
              );
            });
          },
        );
      });
    }});
 
  };
};

export default SynchInsertData;
