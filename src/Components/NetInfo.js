import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import db from '../constants/db';
const NetInfo = () => {
  const netInfo = useNetInfo();
  const [sqlrow, setsqlrow] = useState(null);
  const [Connected, setConnected] = useState('');
  const [Current, setCurrent] = useState(
    'Last Sync ' +
      moment(new Date()).format('DD/MM/YYYY hh:mm A') +
      ' (up to date)',
  );
  const [lastUpdate, setlastUpdate] = useState(null);
  const [tempdata, settempdata] = useState([]);
  const isInitialRender = useRef(true);
  useEffect(() => {
    setInterval(() => {
      if (netInfo.isConnected) {
        setConnected(GetDateTIme());
        if (!Connected) {
          isInitialRender.current = true;
        }
      } else if (netInfo.isConnected === false) {
      }
    }, 5000);
    if (sqlrow !== null) {
      UpdateTable();
    }
    if (netInfo.isConnected == true) {
      // if (isInitialRender.current) {

      //   isInitialRender.current = false;

      // }
      setInterval(() => {
        checkpress();
      }, 5000);
    } else {
      if (tempdata.length != 0) {
        createTable();

        let secTimer = setInterval(() => {
          offlinesync();
          getLastSync();
        }, 1000);
        return () => clearInterval(secTimer);
      }
    }
  }, [netInfo]);

  const offlinesync = async () => {
    let get = await AsyncStorage.getItem('Last');
    let a = await AsyncStorage.getItem('currenttime');
    var startTime = moment(a).format('yyyy-MM-DD HH:mm:ss');
    var endTime = moment(new Date(), 'yyyy-MM-DD HH:mm:ss');
    var hoursDiff = endTime.diff(startTime, 'hours');
    var minutesDiff = endTime.diff(startTime, 'minutes');
    var secondsDiff = endTime.diff(startTime, 'seconds');
    if (hoursDiff >= 1) {
      setlastUpdate('Last sync:' + get + ' (' + hoursDiff + 'h ago)');
    } else if (minutesDiff >= 1) {
      setlastUpdate('Last sync:' + get + ' (' + minutesDiff + 'm ago)');
    } else if (secondsDiff >= 1) {
      setlastUpdate('Last sync:' + get + ' (' + secondsDiff + 's ago)');
    }
  };

  //get last sync time
  const getLastSync = async () => {
    let Userid = await AsyncStorage.getItem('Userid');
    if (Userid != null) {
      db.transaction(txn => {
        txn.executeSql(
          `select * from LkpSync where Userid=?`,
          [Userid.toString()],
          async function (tx, res) {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }

            await AsyncStorage.setItem('currenttime', temp[0].LastSyncTime);
          },
        );
      });
    }
  };

  //update the last sync
  const UpdateTable = () => {
    db.transaction(async function (txn) {
      let Userid = await AsyncStorage.getItem('Userid');
      if (Userid != null) {
        txn.executeSql(`Update LkpSync set LastSyncTime=? where Userid=?`, [
          moment(new Date()).format('yyyy-MM-DD HH:mm:ss').toString(),
          Userid.toString(),
        ]);
      }
    });
  };

  const createTable = () => {
    var count = 1;
    db.transaction(async function (txn) {
      let Userid = await AsyncStorage.getItem('Userid');

      if (Userid != null) {
        txn.executeSql(
          `select * from LkpSync where Userid=?`,
          [Userid.toString()],
          async function (tx, res) {
            setsqlrow(res.rows.length);
            count = res.rows.length;
          },
        );
      }
    });

    if (count == 0) {
      db.transaction(async function (txn) {
        txn.executeSql(
          `INSERT INTO LkpSync (Userid, LastSyncTime, CreatedDate)` +
            `VALUES (?,?,?);`,
          [
            Userid.toString(),
            moment(new Date()).format('yyyy-MM-DD HH:mm:ss').toString(),
            moment(new Date()).format('yyyy-MM-DD HH:mm:ss').toString(),
          ],
        );
      });
    }
  };
  const checkpress = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * from TimesheetPhaseCode', [], (tx, res) => {
        var temp = [];

        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        settempdata(temp);
        let formdata = new FormData();

        formdata.append(`TimesheetPhaseCodeID`, JSON.stringify(temp));

        axios
          .post(
            'https://myios.thatscool.in/api/TimeSheet/AddTimesheetPhaseCode',
            formdata,
            {
              headers: {'Content-Type': 'multipart/form-data'},
            },
          )
          .then(async response => {
            await AsyncStorage.setItem(
              'Last',
              moment(new Date()).format('DD/MM/YYYY hh:mm A'),
            );
            let get = await AsyncStorage.getItem('Last');
            setCurrent('Last sync:' + get + ' (up to date)');
          })
          .catch(err => {
            //      console.error(err);
          });
      });
    });
  };
  const GetDateTIme = () => {
    let current = new Date();
    let cDate =
      current.getFullYear() +
      '-' +
      (current.getMonth() + 1) +
      '-' +
      current.getDate();
    let cTime =
      current.getHours() +
      ':' +
      current.getMinutes() +
      ':' +
      current.getSeconds() +
      ':' +
      current.getMilliseconds();
    let dateTime = cDate + ' ' + cTime;
    return dateTime;
  };
  return (
    <View>
      {netInfo.isConnected ? (
        <View style={styles.synccontainer}>
          {Current != null ? (
            <Image source={require('../Image/sync.png')} />
          ) : null}
          <Text style={styles.synctxt}>{Current}</Text>
        </View>
      ) : (
        <View style={styles.synccontainer}>
          {lastUpdate != null ? (
            <Image source={require('../Image/not_sync.png')} />
          ) : null}
          <Text style={styles.offlinesynctxt}>{lastUpdate}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  synctxt: {
    textAlign: 'center',
    color: '#089c44',
    fontWeight: '600',
  },
  synccontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  offlinesynctxt: {
    textAlign: 'center',
    color: '#dc2428',
  },
});
export default NetInfo;
