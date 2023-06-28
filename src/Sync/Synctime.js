import React, {useState, useEffect,useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import color from '../constants/color';
import db from '../constants/db';
import SynchData from '../Sync/SynchData';
import checkNetworkStatus from './checkNetworkStatus';
import SyncOnlineData from './SyncOnlineData';

const Synctime = () => {
  const [time, setTime] = useState(null);
  const [aTable, setaTable] = useState([]);
  const [data, setData] = useState('');
  const [load, setLoad] = useState('');
  const [date, setDate] = useState(false);
  let isConnected = checkNetworkStatus();
  function epochToRelative(epochTime) {
    if (epochTime != null) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDifferenceInSeconds = currentTime - epochTime;
      const formattedDate = moment.unix(epochTime).format('MM/DD/YYYY h:mm A');
      const currentDateTime = moment().format('MM/DD/YYYY h:mm A');

      if (isConnected == true) {
        if (currentDateTime == formattedDate) {
          setTime(`Last sync: ${formattedDate} (up to date)`);
          setDate(true);
        } else {
          setDate(false);
          if (timeDifferenceInSeconds < 60) {
            setTime(
              `Last sync: ${
                formattedDate + ' (<' + timeDifferenceInSeconds
              } s ago)`,
            );
          } else if (timeDifferenceInSeconds < 3600) {
            const minutes = Math.floor(timeDifferenceInSeconds / 60);
            setTime(`Last sync: ${formattedDate + ' (< ' + minutes} m ago)`);
          } else if (timeDifferenceInSeconds < 86400) {
            const hours = Math.floor(timeDifferenceInSeconds / 3600);
            setTime(`Last sync: ${formattedDate + ' (< ' + hours} h ago)`);
          } else {
            const days = Math.floor(timeDifferenceInSeconds / 86400);
            setTime(`Last sync: ${days} (< d ago)`);
          }
        }
      } else {
        if (timeDifferenceInSeconds < 60) {
          setTime(
            `Last sync: ${
              formattedDate + ' (<' + timeDifferenceInSeconds
            } s ago)`,
          );
        } else if (timeDifferenceInSeconds < 3600) {
          const minutes = Math.floor(timeDifferenceInSeconds / 60);
          setTime(`Last sync: ${formattedDate + ' (< ' + minutes} m ago)`);
        } else if (timeDifferenceInSeconds < 86400) {
          const hours = Math.floor(timeDifferenceInSeconds / 3600);
          setTime(`Last sync: ${formattedDate + ' (< ' + hours} h ago)`);
        } else {
          const days = Math.floor(timeDifferenceInSeconds / 86400);
          setTime(`Last sync: ${days} (< d ago)`);
        }
      }
    } else {
      setTime(null);
    }
  }
  const RotatingImage = () => {
    const rotation = new Animated.Value(0);

    useEffect(() => {
      if (load == true) {
        Animated.loop(
          Animated.timing(rotation, {
            toValue: 1,
            duration: 2000, // Duration for each rotation (in milliseconds)
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ).start();
      }
    }, [load]);

    const spin = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.Image
        style={{
          transform: [{rotate: load == true ? spin : '0deg'}],
          width: 30,
          height: 25,
        }}
        source={
          date == true
            ? require('../Image/sync.png')
            : require('../Image/sync2.png')
        }
      />
    );
  }; 
  const intervalRef = useRef(null);
  useEffect(() => {
     
      async function getInitialValue() {
        let user_id = await AsyncStorage.getItem('SubmitUserID');
        let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
        if (user_id != null) {
          db.transaction(txn => {
            // company
            txn.executeSql(
              `select * from Device WHERE DeviceID ='${Deviceid}'`,
              [],
              async function (tx, res) {
                if (res.rows.item(0) != undefined) {
                  epochToRelative(res.rows.item(0).LastSynchDateTime);
                }
              },
            );
          });
        } else {
          epochToRelative(null);
        }
      
      // Call the next iteration after six second
      intervalRef.current = setTimeout(getInitialValue, 1000);
    };

    // Start the first iteration after one second
    intervalRef.current = setTimeout(getInitialValue, 1000);

    return () => {
      // Clean up by clearing the timeout when the component unmounts
      clearTimeout(intervalRef.current);
    };
  }, []); // Empty dependency array to run the effect only once
  const RepeatFuntion = () => {
    setLoad(true);
    let aInsertedRows = [];
    let newArray = {
      TableName: 'Timesheet',
      Columns: [
        [
          'RowID',
          'DateTime',
          'DataSynchID',
          'FinalizedByUserID',
          'StatusID',
          'UpdatedBy',
          'CreatedOn',
          'DataLogDateTime',
          'UpdatedOn',
          'WeekEndDate',
          'SubmittedBy',
          'CopiedFromTimesheetID',
          'ReviewDateTime',
          'SubmittedOn',
          'CreatedBy',
          'TimesheetID',
          'TableName',
        ],
      ],
      InsertedRows: [],
      UpdatedRows: [],
      DeletedRows: [],
    };

    aInsertedRows.push(newArray);
    setaTable(aInsertedRows);
  };
  const handleChildClick = () => {
    // This function will be called when the child component is clicked
    console.log('Child component clicked!');
  };
  return isConnected == true ? (
    time != null ? (
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          height: 55,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity 
        //  onPress={RepeatFuntion}
          >
            <RotatingImage />
          </TouchableOpacity>
          <Text
            style={{
              color: date == true ? color.green : color.red,
              left: 10,
              top: 5,
            }}>
            {time}{' '}
          </Text>
          {aTable.length > 0 ? (
            <SynchData 
              aTable={aTable}
              setaTable={setaTable}
              data={"data"}
              setData={setData}
              setLoad={setLoad}
            />
          ) : null}
        </View>
        {load==true? (   <SyncOnlineData load={load}/>):null}
      </View>
    ) : null
  ) : time != null ? (
    <View
      style={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: 55,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../Image/unsync_icon2.png')}
          style={{
            width: 30,
            height: 25,
          }}
        />
        <Text style={{color: color.red, left: 10, top: 5}}>{time}</Text>
      </View>
    </View>
  ) : null;

};

export default Synctime;
