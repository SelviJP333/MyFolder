import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createRef, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import epochTime from '../constants/epochTime';
import SynchData from '../Sync/SynchData';
import moment from 'moment';
import {BaseURL} from '../constants/BaseURL';
import DeviceInfo from 'react-native-device-info';
import ToastManager, {Toast} from 'toastify-react-native';
import Loader from '../Components/Loader';
import BgImage from '../Image/bg.jpg';
import axios from 'axios';
import db from '../constants/db';
import PercentageBar from '../Components/PercentageBar';
import tick from '../Image/tickcircle.png';
import databaseConfig from '../constants/databaseConfig';
import color from '../constants/color';
import CurrentUTCTime from '../constants/CurrentUTCTime'; 
const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('CJHogan@leopardo.com');
  const [userPassword, setUserPassword] = useState('8806');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();
  const [ShouldShow, setShouldShow] = useState(false);
  const [Visible, setVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [device_id, setdevice_id] = useState('');
  const [datatemp, setdatatemp] = useState([]);
  const [percentage, setpercentage] = useState('0%');
  const [aTable, setaTable] = useState([]);
  const [data, setData] = useState('');
  let dateTime = CurrentUTCTime();
  useEffect(() => {
    (async () => {
      let uniqueId = await DeviceInfo.getUniqueId();
      setdevice_id(uniqueId);
    })();
  }, []);
  const RepeatFuntion = () => {
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
  // Generate random user id
  const generateGuidQuickly = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };
  useEffect(() => {
    const getUser = () => {
      db.transaction(function (txn) {
        txn.executeSql('SELECT * FROM User', [], async function (tx, res) {
          for (let i = 0; i < res.rows.length; i++) {
            datatemp.push(res.rows.item(i));
            setdatatemp(datatemp);
          }
        });
      });
    };
    getUser();
  }, []);

  const FirstSave = async userId => {
    setpercentage('95%');

    let oData = [
      {
        TableName: 'Device',
        Columns: [
          'DeviceID',
          'DeviceName',
          'Platform',
          'JoinDateTime',
          'IsActive',
          'LastSynchDateTime',
          'CreatedBy',
          'CreatedOn',
          'LastSynchBy',
        ],
        InsertedRows: [
          [
            device_id,
            device_id,
            'ipad',
            dateTime,
            1,
            epochTime(),
            userId,
            dateTime,
            userId,
          ],
        ],
        UpdatedRows: [],
        DeletedRows: [],
      },
    ];

    let newArray = [
      {
        name: 'data',
        value: {
          userID: userId,
          deviceID: device_id,
          pushNotificationRegistrationID: 0,
          deviceSynchHistoryID: 0,
          version: '4.032',
          platform: 'ipad',
          data: oData,
          files: [],
          currentSynchDateTimeDevice: epochTime(),
          currentSynchDateTimeServer: epochTime(),
          dataSynchIDs: [],
          fileSynchIDs: [],
          password: userPassword,
          username: userEmail,
          deviceName: device_id,
        },
      },
    ];
    setpercentage('96%');

    var config = {
      method: 'post',
      url: `${BaseURL}Synch/SetupDatabase`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: newArray,
    };

    axios(config).then(async function (response) {
      console.log('response', response.data);
      setpercentage('98%');

      setpercentage('100%');
      await AsyncStorage.setItem('SubmitUserID', JSON.stringify(userId));
      RepeatFuntion();
      setTimeout(() => {
        setLoading(false);
        setStatus(false);
        setMessage(null);
        navigation.replace('My TimeSheet');
      }, 1000);
    });
  };

  const getLogin = async () => {
    setErrortext('');
    if (!userEmail) {
      alert('USERNAME IS REQUIRED');
      return;
    }
    if (!userPassword) {
      alert('PASSWORD IS REQUIRED');
      return;
    }

    if (datatemp.length != 0) {
      setLoading(true);
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT * FROM User where Username ='" +
            userEmail +
            "' and Password='" +
            userPassword +
            "'and IsActive = 1",
          [],
          async (tx, res) => {
            var temp = [];
            if (res.rows.length > 0) {
              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }

              // device1

              db.transaction(async function (tx) {
                // device
                tx.executeSql(
                  `select * from Device`,
                  [],
                  async function (tx, res) {
                    let temp2 = [];
                    for (let i = 0; i < res.rows.length; i++) {
                      temp2.push(res.rows.item(i));
                    }
                    if (res.rows.length === 0) {
                      try {
                        let query = `UPDATE Device SET UpdatedBy= '${temp[0].UserID}',UpdatedOn='${dateTime}' WHERE DeviceID = '${device_id}'`;
                        tx.executeSql(
                          query,
                          [],

                          err => {
                            console.error('err  $', err);
                          },
                        );
                      } catch (e) {}
                    }
                  },
                );
              });
              // var deviceid=[];
              await AsyncStorage.setItem(
                'device_id',
                JSON.stringify(device_id),
              );
              var UserDetails = [];

              var json = JSON.stringify(temp[0]);
              UserDetails.push(temp[0]);
              let newArray2 = UserDetails.map(item => {
                return {
                  key: item.Username,
                  value: item.EmployeeID,
                  status: false,
                  check: false,
                };
              });
              await AsyncStorage.setItem(
                'UserDetails',
                JSON.stringify(newArray2),
              );
              await AsyncStorage.setItem(
                'SubmitUserID',
                JSON.stringify(temp[0].UserID),
              );
              RepeatFuntion();
              setLoading(false);
              navigation.replace('My TimeSheet');
            } else {
              setLoading(false);
              Toast.error('Username and Password is incorrect');
              return;
            }
          },
        );
      });
    } else if (datatemp.length == 0) {
      setStatus(true);
      let existsUser;
      const Deviceurl = `https://coolboiler.com/api/Devices/GetDeviceSynchTable?username=${userEmail}&password=${userPassword}`;
      const timesheetstatusurl = `https://coolboiler.com/api/Devices/GetLkpTimesheetStatus?username=${userEmail}&password=${userPassword}`;
      const LkpCompanyurl = `https://coolboiler.com/api/Devices/GetLkpCompany?username=${userEmail}&password=${userPassword}`;
      const LkpJobsurl = `https://coolboiler.com/api/Devices/GetLkpJob?username=${userEmail}&password=${userPassword}`;
      const LkpPhaseCodesurl = `https://coolboiler.com/api/Devices/GetLkpPhaseCode?username=${userEmail}&password=${userPassword}`;
      const Employeeurl = `https://coolboiler.com/api/Devices/GetActiveEmployees?username=${userEmail}&password=${userPassword}`;
      const Userurl = `https://coolboiler.com/api/Devices/Login?username=${userEmail}&password=${userPassword}`;
      const responseDevice = await axios
        .get(Deviceurl)
        .then(async ({data}) => {
          databaseConfig.DeviceSynchTable(data);
        })
        .catch(function (error) {
          if (error.response) {
            existsUser = error.response.data;
          }
        });

      if (existsUser != 'UnAuthorized User') {
        setpercentage('10%');
        setMessage('LkpTimesheetStatus table Sync ');
        const responsetimesheetstatus = await axios
          .get(timesheetstatusurl)
          .then(async ({data}) => {
            databaseConfig.LkpTimesheetStatusTable(data);
            setpercentage('13%');
            setpercentage('16%');
            setpercentage('22%');
            setpercentage('34%');
          });
        setpercentage('38%');
        //  setMessage("LkpCompany table Sync ")
        const responseLkpCompanystatus = await axios
          .get(LkpCompanyurl)
          .then(async ({data}) => {
            databaseConfig.LkpCompanyTable(data);
            setpercentage('40%');
            setpercentage('42%');
            setpercentage('43%');
            setpercentage('44%');
          });

        //  setMessage("LkpJob table Sync ")
        const responseLkpJobstatus = await axios
          .get(LkpJobsurl)
          .then(async ({data}) => {
            databaseConfig.LkpJobsTable(data);
            setpercentage('45%');
            setpercentage('48%');
            setpercentage('50%');
          });
        //  setMessage("LkpPhaseCode table Sync ")
        const responseLkpPhaseCodesstatus = await axios
          .get(LkpPhaseCodesurl)
          .then(async ({data}) => {
            databaseConfig.LkpPhaseCodesTable(data);
            setpercentage('52%');
            setpercentage('54%');
          });
        setpercentage('58%');

        setMessage('Employee Table Sync');
        const responseEmployee = await axios
          .get(Employeeurl)
          .then(async ({data}) => {
            setpercentage('59%');

            setpercentage('60%');
            setpercentage('62%');

            databaseConfig.EmployeeTable(data);
          });
        setMessage('User table Sync');
        const response = await axios.get(Userurl).then(async ({data}) => {
          databaseConfig.UserTable(data);

          setpercentage('65%');
          let getUser = data.find(
            x =>
              x.username.toUpperCase() === userEmail.toUpperCase() &&
              x.password === userPassword &&
              x.isActive === true,
          );

          if (getUser) {
            var UserDetails = [];
            UserDetails.push(getUser);
            let newArray2 = UserDetails.map(item => {
              return {
                key: item.Username,
                value: item.EmployeeID,
                status: false,
                check: false,
              };
            });

            await AsyncStorage.setItem(
              'UserDetails',
              JSON.stringify(newArray2),
            );

            setpercentage('69%');
            db.transaction(async function (tx) {
              // device
              tx.executeSql(
                `select * from Device`,
                [],
                async function (tx, res) {
                  setpercentage('71%');
                  let temp2 = [];
                  for (let i = 0; i < res.rows.length; i++) {
                    temp2.push(res.rows.item(i));
                  }
                  if (res.rows.length === 0) {
                    try {
                      let query = `INSERT INTO Device (DeviceID,DeviceName, Platform,JoinDateTime,IsActive,LastSynchDateTime,CreatedBy,CreatedOn,LastSynchBy)
                      VALUES ('${device_id}','${device_id}','ipad','${dateTime}', 1,'${epochTime()}', '${
                        getUser.userId
                      }','${dateTime}', '${getUser.userId}')`;

                      tx.executeSql(
                        query,
                        [],
                        async function (tx, res) {
                          await AsyncStorage.setItem(
                            'device_id',
                            JSON.stringify(device_id),
                          );
                          FirstSave(getUser.userId);
                        },
                        err => {
                          console.error('err', err);
                        },
                      );
                    } catch (e) {}
                  }
                },
              );
            });
          }
        });
      } else {
        setStatus(false);
        Toast.error('Username and Password is incorrect');
        return;
      }
    }
  };

  return (
    <ImageBackground
      source={BgImage}
      resizeMode="cover"
      style={{height: '100%', width: '100%'}}>
      {aTable.length > 0 ? (
        <SynchData
          aTable={aTable}
          setaTable={setaTable}
          data={data}
          setData={setData}
        />
      ) : null}
      {status == true ? (
        <SafeAreaView style={styles.popupcontainer}>
          <View style={styles.popuptextcontainer}>
            <View style={{alignItems: 'center'}}>
              {percentage != '100%' ? (
                <View>
                  <Text style={styles.waittext}>Initial Sync Started....</Text>
                  <Text style={styles.waittext}>Please wait....</Text>
                  <Text style={styles.waittext1}>
                    Note: Do not press the Home button{' '}
                  </Text>
                </View>
              ) : (
                <Text style={styles.donetext}>Completed!!!</Text>
              )}
              <View style={styles.percentagecontainer}>
                <View style={styles.percentagetxt}>
                  {percentage == '100%' ? (
                    <Image source={tick}></Image>
                  ) : (
                    <ActivityIndicator size={110} color={'#307ecc'} />
                  )}
                </View>

                <PercentageBar
                  height={20}
                  backgroundColor={'grey'}
                  completedColor={'#33cc33'}
                  percentage={percentage}
                />
                <Text style={styles.popuptext}>{/* {message} */}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : null}
      {/* <KeyboardAwareScrollView> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.mainBody}>
            <Loader loading={loading} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View style={styles.ContainerStyle}>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../Image/logo.png')}
                      style={{
                        width: '50%',
                        height: 100,
                        resizeMode: 'contain',
                        margin: 30,
                      }}
                    />
                  </View>
                  <View style={styles.SectionStyle}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={UserEmail => setUserEmail(UserEmail)}
                      placeholder="Username" //dummy@abc.com
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        passwordInputRef.current &&
                        passwordInputRef.current.focus()
                      }
                      underlineColorAndroid="#f000"
                      blurOnSubmit={false}
                    />
                  </View>
                  <View style={styles.SectionStyle}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={UserPassword =>
                        setUserPassword(UserPassword)
                      }
                      placeholder="Password" //12345
                      placeholderTextColor="#8b9cb5"
                      keyboardType="default"
                      ref={passwordInputRef}
                      onSubmitEditing={Keyboard.dismiss}
                      blurOnSubmit={false}
                      secureTextEntry={!Visible}
                      underlineColorAndroid="#f000"
                      returnKeyType="next"
                    />
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setShouldShow(!ShouldShow), setVisible(!Visible);
                        }}></TouchableOpacity>
                    </View>
                  </View>
                  {errortext != '' ? (
                    <Text style={styles.errorTextStyle}> {errortext} </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={getLogin}>
                    <Text style={styles.buttonTextStyle}>Log In</Text>
                  </TouchableOpacity>
                  <ToastManager />
                </View>
              </View>
            </ScrollView>
          </View>
          {/* </KeyboardAwareScrollView> */}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',

    alignContent: 'center',
  },
  ContainerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#F8F8F8',
    width: '40%',
    marginLeft: '30%',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    borderColor: 'white',
  },
  buttonStyle: {
    backgroundColor: '#1b386a',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#cc0000',
    height: 40,
    alignItems: 'center',

    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderColor: '#E8E8E8',
    fontSize: 20,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  popupcontainer: {
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popuptextcontainer: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#cbe91e',
    width: '40%',
    height: '42%',
    borderRadius: 0,
    justifyContent: 'center',
  },
  popuptext: {
    textAlign: 'center',
    fontSize: 20,
  },
  waittext: {fontSize: 25, margin: 5, textAlign: 'center', color: '#000'},
  waittext1: {fontSize: 10, margin: 5, textAlign: 'center', color: color.red},
  donetext: {fontSize: 20, margin: 5, textAlign: 'center', color: '#33cc33'},
  percentagetxt: {justifyContent: 'center', alignItems: 'center'},

  percentagecontainer: {width: '80%', justifyContent: 'center'},
  donebutton: {
    alignItems: 'center',
    backgroundColor: '#33cc33',
    padding: 5,
    width: 150,
    borderRadius: 5,
  },
});
