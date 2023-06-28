import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import db from '../constants/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrentUTCTime from '../constants/CurrentUTCTime';
function Timesheet_popup({
  setpopup_twentyfour,
  setpopup_entry,
  type,
  cmnts_popup_detail,
  setadd_cmnt,
  TableData,
  Save,
  SelectedTimesheetPhaseCodeID,
  GetDateTime,
}) {
  let jobname = cmnts_popup_detail.cmnt_job.split('*#^*').slice(1).join(' ');
  let Phasename = cmnts_popup_detail.cmnt_phase
    .split('*#^*')
    .slice(1)
    .join(' ');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [phase_Comts, setphase_Comts] = React.useState(
    cmnts_popup_detail.actual_cmt ? cmnts_popup_detail.actual_cmt : '',
  );
  const Done = async () => {
    TableData[cmnts_popup_detail.cmt_companyI][1][
      cmnts_popup_detail.cmt_jobI
    ][1][cmnts_popup_detail.cmt_phaseI].splice(9, 1, phase_Comts);
    setadd_cmnt(false);
    if (SelectedTimesheetPhaseCodeID != undefined) {
      let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
      var DateTime = CurrentUTCTime();
      let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));

      db.transaction(txn => {
        txn.executeSql(
          `UPDATE TimesheetPhaseCode set Comment=?,UpdatedBy=?,UpdatedOn=? where TimesheetPhaseCodeID=?`,
          [
            phase_Comts,
            SubmitUserID,
            DateTime,
            SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
          ],
          async function (tx, res) {
            console.log('Comment Update', res.rowsAffected);
            txn.executeSql(
              'INSERT INTO DeviceSynchDataLog (Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
              [
                'U',
                'TimesheetPhaseCode',
                SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
                'Comment',
                phase_Comts,
                DateTime,
                Deviceid,
                0,
                0,
                '-',
              ],
              function (tx, result) {},
            );
          },
        );
      });
    }
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
        {type === '24hourspopup' ? (
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: '60%',
              height: '25%',
              borderRadius: 0,
              position: 'absolute',
              top: '6%',
            }}>
            {/* header */}
            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '22%',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
              {/* <Image src={Warning} style={{height:50,width:50,zIndex:99,position:'relative'}}/> */}

              <Image
                source={require('../Image/warning.png')}
                style={{height: 50, width: 50, marginLeft: '5%'}}></Image>
              <Text
                style={{fontSize: 30, color: '#483D8B', fontWeight: 'bold'}}>
                Timesheet Warning
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setpopup_twentyfour(false);
                }}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>X</Text>
              </TouchableOpacity>
              {/* <View style={{display:"flex",flexGrow:0.2}}></View> */}
            </View>
            <Text
              style={{
                marginTop: '2%',
                marginLeft: '2%',
                fontSize: 20,
                color: '#A9A9A9',
              }}>
              Total Time Exceed 24 hours
            </Text>
            <TouchableOpacity
              onPress={() => {
                setpopup_twentyfour(false);
              }}
              style={{
                height: '45%',
                width: 250,
                backgroundColor: 'grey',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                left: '50%',
                transform: [{translateX: -125}],
                marginTop: '5%',
              }}>
              <Text style={{fontSize: 22, color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : type === '24hourspopup' ? (
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: '60%',
              height: '25%',
              borderRadius: 0,
              position: 'absolute',
              top: '6%',
            }}>
            {/* header */}
            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '22%',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
              {/* <Image src={Warning} style={{height:50,width:50,zIndex:99,position:'relative'}}/> */}

              <Image
                source={require('../Image/error.png')}
                style={{height: 40, width: 40, marginLeft: '5%'}}></Image>
              <Text
                style={{fontSize: 30, color: '#483D8B', fontWeight: 'bold'}}>
                Copy Employee
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setpopup_entry(false);
                }}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>X</Text>
              </TouchableOpacity>
              {/* <View style={{display:"flex",flexGrow:0.2}}></View> */}
            </View>
            <Text
              style={{
                marginTop: '2%',
                marginLeft: '2%',
                fontSize: 20,
                color: '#A9A9A9',
              }}>
              No Entry for Employee to copy
            </Text>
            <TouchableOpacity
              onPress={() => {
                setpopup_entry(false);
              }}
              style={{
                height: '45%',
                width: 250,
                backgroundColor: 'grey',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                left: '50%',
                transform: [{translateX: -125}],
                marginTop: '5%',
              }}>
              <Text style={{fontSize: 22, color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : type === 'emptyentry' ? (
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: '60%',
              height: '25%',
              borderRadius: 0,
              position: 'absolute',
              top: '6%',
            }}>
            {/* header */}

            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '22%',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
              {/* <Image src={Warning} style={{height:50,width:50,zIndex:99,position:'relative'}}/> */}

              <Image
                source={require('../Image/error.png')}
                style={{height: 40, width: 40, marginLeft: '5%'}}></Image>
              <Text
                style={{fontSize: 30, color: '#483D8B', fontWeight: 'bold'}}>
                Copy Employee
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setpopup_entry(false);
                }}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>X</Text>
              </TouchableOpacity>
              {/* <View style={{display:"flex",flexGrow:0.2}}></View> */}
            </View>
            <Text
              style={{
                marginTop: '2%',
                marginLeft: '2%',
                fontSize: 20,
                color: '#A9A9A9',
              }}>
              No Entry for Employee to copy
            </Text>
            <TouchableOpacity
              onPress={() => {
                setpopup_entry(false);
              }}
              style={{
                height: '45%',
                width: 250,
                backgroundColor: 'grey',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                left: '50%',
                transform: [{translateX: -125}],
                marginTop: '5%',
              }}>
              <Text style={{fontSize: 22, color: 'white'}}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : type === 'comments' ? (
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: '60%',
              height: '70%',
              borderRadius: 0,
              position: 'absolute',
              top: '6%',
            }}>
            {/* header */}

            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '15%',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
              {/* <Image src={Warning} style={{height:50,width:50,zIndex:99,position:'relative'}}/> */}

              <Image
                source={require('../Image/error.png')}
                style={{
                  height: 40,
                  width: 40,
                  marginLeft: '5%',
                  opacity: 0,
                }}></Image>
              <Text
                style={{
                  fontSize: 30,
                  color: '#483D8B',
                  fontWeight: 'bold',
                }}>
                ENTER COMMENTS
              </Text>
              <Pressable
                onPress={() => {
                  setadd_cmnt(false);
                }}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>X</Text>
              </Pressable>
              {/* <View style={{display:"flex",flexGrow:0.2}}></View> */}
            </View>
            {!isKeyboardVisible ? (
              <>
                <Text
                  style={{
                    marginTop: '2%',
                    marginLeft: '4%',
                    fontSize: 20,
                    color: '#A9A9A9',
                  }}>
                  {cmnts_popup_detail.cmnt_user}
                </Text>
                <Text
                  style={{
                    marginTop: '2%',
                    marginLeft: '4%',
                    fontSize: 20,
                    color: '#A9A9A9',
                  }}>
                  {jobname} {' - '}
                  {Phasename}
                </Text>

                {/* phase align */}

                <View style={{marginTop: '3%', flexDirection: 'row'}}>
                  {cmnts_popup_detail.phase_hours.map((e, i) => {
                    if (e[0] === 'Total' || e[0] === undefined) {
                      return null;
                    } else {
                      return (
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '4%',
                          }}>
                          <Text style={{fontSize: 22}}>{e[0]}</Text>
                          <Text style={{fontSize: 22}}>{e[1]}</Text>
                        </View>
                      );
                    }
                  })}
                </View>
              </>
            ) : null}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              style={{flex: 1}}>
              <TextInput
                defaultValue={
                  cmnts_popup_detail.actual_cmt == 'null' ||
                  cmnts_popup_detail.actual_cmt == ''
                    ? null
                    : cmnts_popup_detail.actual_cmt
                }
                onChangeText={e => setphase_Comts(e)}
                multiline={true}
                numberOfLines={10}
                style={{
                  fontSize: 20,
                  textAlignVertical: 'top',
                  marginTop: '3%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  width: 700,
                  height: '60%',
                  position: 'relative',
                  borderWidth: 3,
                  borderColor: '#A9A9A9',
                  paddingLeft: '2%',
                  left: '65%',
                  transform: [{translateX: -475}],
                }}
              />
            </KeyboardAvoidingView>
            <Pressable
              onPress={() => Done()}
              style={{
                width: '10%',
                height: '10%',
                backgroundColor: '#483D8B',
                position: 'absolute',
                right: 0,
                bottom: 15,
                right: '4%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 20, color: 'white'}}>DONE</Text>
            </Pressable>
            {/* <TouchableOpacity onPress={() => { setpopup_entry(false) }} style={{ height: "45%", width: 250, backgroundColor: "grey", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", left: "50%", transform: [{ translateX: -125 }], marginTop: "5%" }}><Text style={{ fontSize: 22, color: "white" }}>Close</Text></TouchableOpacity> */}
          </View>
        ) : null}
      </SafeAreaView>
    </>
  );
}

export default Timesheet_popup;
