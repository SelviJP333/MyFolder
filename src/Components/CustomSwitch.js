import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeletePopup from '../Components/DeletePopup';
import SubmitPopup from '../Components/SubmitPopup';
import Copy from '../Image/icon-copy.png';
import Delete from '../Image/icon-delete.png';
import proposed from '../Image/icon-proposed.png';
import Send from '../Image/icon-send.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import db from '../constants/db';
import {RotateInUpLeft, round} from 'react-native-reanimated';
import epochTime from '../constants/epochTime';
import moment from 'moment';
import SynchData from '../Sync/SynchData';
import Processing from './Processing';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
import CurrentUTCTime from '../constants/CurrentUTCTime';
export default function CustomSwitch({
  setTimesheetData,
  navigation,
  setCopyModalVisible,
  isCopyModalVisible,
  Save,
  data,
  GetData,
  Submittedupdatetime,
  setome_active,
  route,
  passed_active,
  setCopied_Frm_Apprv,
}) {
  const [active, setActive] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitModalVisible, setSubmitModalVisible] = useState(false);
  const [DelClicked, setDelClicked] = useState('');
  const [color_func, setcolor_func] = useState(null);
  const [Deviceid, setDeviceid] = useState('');
  const getUser = useSelector(store => store);
  const [process_loader, setprocess_loader] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      let Deviceid_data = JSON.parse(await AsyncStorage.getItem('device_id'));
      setDeviceid(Deviceid_data);
    };
    CurrentUTCTime();
    getUsers(); // run it, run it
    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setome_active(active);

      if (getUser.Temp_Reducer.data.length !== 0) {
        const myPromise = new Promise((resolve, reject) => {
          Save();
          resolve('foo');
        }).then(async () => {
          setTimeout(() => {
            GetData();
          }, 100);
        });
      } else {
        if (active === 0) {
          GetData('Approve');
          console.log('data-----------------------------', data);
        } else {
          GetData();
        }
      }

      return () => {};
    }, [active, getUser.SyncReducer.data]),
  );

  const Edit = item => {
    setActive(1);
    navigation.navigate('EditTimeSheetScreen', {
      paramKeyJobId: item.JobID,
      paramKeyTimesheetID: item.TimesheetID,
      paramKeyPhaseCodeID: item.PhaseCodeID,
      paramkeyWeekEndDate: item.WeekEndDate,
      paramkeyTimesheetJobID: item.TimesheetJobID,
      paramkeyTimesheetCompanyID: item.TimesheetCompanyID,
      paramKeyCreatedOn: item.CreatedOn,
      paramKeyCreatedBy: item.CreatedBy,
      item: item,
    });
  };
  // passed_active
  const Approve = async (item, TimesheetId_Approve) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    setActive(0);
    navigation.navigate('Approve_Report', {
      paramKeyJobId: item.JobID,
      paramKeyTimesheetID: item.TimesheetID,
      paramKeyPhaseCodeID: item.PhaseCodeID,
      paramkeyWeekEndDate: item.WeekEndDate,
      paramkeyTimesheetJobID: item.TimesheetJobID,
      paramkeyTimesheetCompanyID: item.TimesheetCompanyID,
      paramKeyCreatedOn: item.CreatedOn,
      paramKeyCreatedBy: item.CreatedBy,
      paramKeySubmited: SubmitUserID,
      item: item,
      active: active,
      TimesheetId_Approve: TimesheetId_Approve,
    });
  };
  const VireApprove = async (item, page) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');

    page === 'Timesheet' ? setActive(1) : setActive(0);

    navigation.navigate('ViewApproved_Report', {
      paramKeyJobId: item.JobID,
      paramKeyTimesheetID: item.TimesheetID,
      paramKeyPhaseCodeID: item.PhaseCodeID,
      paramkeyWeekEndDate: item.WeekEndDate,
      paramkeyTimesheetJobID: item.TimesheetJobID,
      paramkeyTimesheetCompanyID: item.TimesheetCompanyID,
      paramKeyCreatedOn: item.CreatedOn,
      paramKeyCreatedBy: item.CreatedBy,
      paramKeySubmited: SubmitUserID,
      item: item,
      active: active,
      page: page,
    });
  };
  const SendReport = item => {
    setSubmitModalVisible(true);
    setDelClicked(item);
  };

  const FinalizeReport = item => {
    navigation.navigate('FinalizeReport', {
      // navigation.navigate('ApproveTimesheet', {
      paramKeyTimesheetJobId: item.JobID,
      paramKeyTimesheetID: item.TimesheetID,
      paramKeyPhaseCodeID: item.PhaseCodeID,
      paramkeyWeekEndDate: item.WeekEndDate,
      item: item,
    });
  };
  const CopytoggleModal = (item, type) => {
    setCopyModalVisible(!isCopyModalVisible);
    setTimesheetData(item);
    // setCopied_Frm_Apprv(true);
    if (type === 'Timesheet') {
      setCopied_Frm_Apprv(false);
    } else {
      setCopied_Frm_Apprv(true);
    }
  };

  const deleteRec = item => {
    db.transaction(txn => {
      let dateTime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
      let query = `
    INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)
      select  'D' as Action,'Timesheet'as TableName ,'${
        item.TimesheetID
      }' as RowID,'-' as ColumnValue,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage
      union

      select  'D' as Action,'TimesheetEmployee' as TableName,TimesheetEmployeeID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetEmployee  where TimesheetID = '${
        item.TimesheetID
      }'

   union
   select  'D' as Action,'TimesheetCompany' as TableName,TimesheetCompanyID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetCompany where TimesheetEmployeeID in (select TimesheetEmployeeID from TimesheetEmployee where TimesheetID = '${
        item.TimesheetID
      }')

    union
        select  'D' as Action,'TimesheetJob' as TableName,TimesheetJobID as   RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetJob where TimesheetJobID in (select TimesheetJobID from TimesheetJob where TimesheetCompanyID in  (select TimesheetCompanyID from TimesheetCompany where TimesheetEmployeeID in (select TimesheetEmployeeID from TimesheetEmployee where TimesheetID = '${
        item.TimesheetID
      }')))

    union
      select  'D' as Action,'TimesheetPhaseCode' as TableName,TimesheetPhaseCodeID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime,'${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetPhaseCode where TimesheetPhaseCodeID in (select TimesheetPhaseCodeID from TimesheetPhaseCode where TimesheetJobID in  (select TimesheetJobID from TimesheetJob where TimesheetCompanyID in  (select TimesheetCompanyID from TimesheetCompany where TimesheetEmployeeID in (select TimesheetEmployeeID from TimesheetEmployee where TimesheetID = '${
        item.TimesheetID
      }'))) )
      `;

      txn.executeSql(query, []);
    });

    db.transaction(txn => {
      if (item.TimesheetJobID != null) {
        txn.executeSql(
          `SELECT
                      t.TimesheetID,
                      te.TimesheetEmployeeID,
                      tc.TimesheetCompanyID,
                      tj.TimesheetJobID ,
                      te.CreatedBy
                   from
                      Timesheet t
                      left JOIN
                         TimesheetEmployee te
                         on te.TimesheetID = t.TimesheetID
                      left JOIN
                         TimesheetCompany tc
                         on tc.TimesheetEmployeeID = te.TimesheetEmployeeID
                      left JOIN
                         TimesheetJob tj
                         on tj.TimesheetCompanyID = tc.TimesheetCompanyID
                   where
                      te.CreatedBy = ?
                      and te.TimesheetID =?`,
          [item.CreatedBy, item.TimesheetID],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              tx.executeSql(
                'Delete from TimesheetPhaseCode where TimesheetJobID=?',
                [res.rows.item(i).TimesheetJobID],
              );

              tx.executeSql(
                'Delete from TimesheetJob where TimesheetCompanyID=?',
                [res.rows.item(i).TimesheetCompanyID],
              );

              tx.executeSql(
                'Delete from TimesheetCompany where TimesheetEmployeeID=?',
                [res.rows.item(i).TimesheetEmployeeID],
              );

              tx.executeSql(
                'Delete from TimesheetEmployee where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
              );

              tx.executeSql(
                'Delete from Timesheet  where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    setprocess_loader(false);
                    GetData();
                  }
                },
              );
            }
          },
        );
      } else if (item.TimesheetCompanyID != null) {
        txn.executeSql(
          `SELECT
                        t.TimesheetID,
                        te.TimesheetEmployeeID,
                        tc.TimesheetCompanyID,
                        te.CreatedBy
                     from
                        Timesheet t
                        left JOIN
                           TimesheetEmployee te
                           on te.TimesheetID = t.TimesheetID
                        left JOIN
                           TimesheetCompany tc
                           on tc.TimesheetEmployeeID = te.TimesheetEmployeeID
                        left JOIN
                           TimesheetJob tj
                           on tj.TimesheetCompanyID = tc.TimesheetCompanyID
                     where
                        te.CreatedBy = ?
                        and te.TimesheetID =?`,
          [item.CreatedBy, item.TimesheetID],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              tx.executeSql(
                'Delete from TimesheetJob where TimesheetCompanyID=?',
                [res.rows.item(i).TimesheetCompanyID],
              );

              tx.executeSql(
                'Delete from TimesheetCompany where TimesheetEmployeeID=?',
                [res.rows.item(i).TimesheetEmployeeID],
              );

              tx.executeSql(
                'Delete from TimesheetEmployee where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
              );

              tx.executeSql(
                'Delete from Timesheet  where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    setprocess_loader(false);
                    GetData();
                  }
                },
              );
            }
          },
        );
      } else if (item.TimesheetEmployeeID == null) {
        txn.executeSql(
          `SELECT
                        t.TimesheetID,
                        te.TimesheetEmployeeID
                     from
                        Timesheet t
                        left JOIN
                           TimesheetEmployee te
                           on te.TimesheetID = t.TimesheetID

                      where
                        te.CreatedBy = ?
                        and te.TimesheetID =?`,
          [item.CreatedBy, item.TimesheetID],
          async function (tx, res) {
            if (res.rows.length == 0) {
              tx.executeSql(
                'Delete from Timesheet  where TimesheetID=?',
                [item.TimesheetID],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    setprocess_loader(false);
                    GetData();
                  }
                },
              );
            }
          },
        );
      } else {
        txn.executeSql(
          `SELECT
                        t.TimesheetID,
                        te.TimesheetEmployeeID
                     from
                        Timesheet t
                        left JOIN
                           TimesheetEmployee te
                           on te.TimesheetID = t.TimesheetID

                      where
                        te.CreatedBy = ?
                        and te.TimesheetID =?`,
          [item.CreatedBy, item.TimesheetID],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              tx.executeSql(
                'Delete from TimesheetEmployee where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
              );

              tx.executeSql(
                'Delete from Timesheet  where TimesheetID=?',
                [res.rows.item(i).TimesheetID],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    setprocess_loader(false);
                    GetData();
                  }
                },
              );
            }
          },
        );
      }
    });
    setModalVisible(false);
  };

  const deleteRecord = item => {
    setModalVisible(true);
    setDelClicked(item);
  };

  const Color_Change_Approved = ID => {
    let temp123 = [];
    let d = db.transaction(txn => {
      txn.executeSql(
        'select * from TimesheetEmployee where TimesheetID =? and IsApproved is null',
        [ID],
        async function (tx, res) {
          for (let i = 0; i < res.rows.length; i++) {
            temp123.push(res.rows.item(i));
          }

          // const dd=()=>{

          //   return temp123
          // }

          // setcolor_func(()=>(temp123)=>{
          //   return temp123
          // }

          // )
          //  setcolor(temp)
          // setcolor_func(()=>()=>{
          //   return temp123
          // })
        },
      );
    });

    // const cc = (s) => {
    //   return setcolor_func(()=>()=>{
    //     return s
    //   })

    // }
  };

  useFocusEffect(
    React.useCallback(() => {
      GetData();
      return () => {};
    }, [getUser.SyncReducer.data]),
  );

  const renderItem = props => {
    let item = props.item[0] ? props.item[0] : props.item;

    let empty_ary = [];
    let status = [];
    let TimesheetId_Approve = [];
    let Status = null;
    let empty_ary_Timesheet = [];
    if (active == 0) {
      if (Array.isArray(props.item)) {
        props.item.forEach(d => {
          // console.log(d['WeekEndDate'], '===', d['TimesheetID']);
          //
          if (!status.includes(d['Status'])) {
            //["Rous, Andrew ",]
            status.indexOf(d['Status']) === -1
              ? status.push(d['Status'])
              : null;
          }

          if (!empty_ary.includes(d['SubmittedBy'])) {
            //["Rous, Andrew ",]

            empty_ary.push(d['SubmittedBy']);

            console.log(d['WeekEndDate'], '[[[[[[[[', empty_ary);
          }
          if (!empty_ary.includes(d['TimesheetID'])) {
            //["Rous, Andrew ",]
            TimesheetId_Approve.push("'" + d['TimesheetID'] + "'");
          }
        });
      }
      Status =
        status.indexOf('Finalized') === -1
          ? status.length === 0
            ? 'Finalized'
            : 'Approved'
          : 'Finalized';
    } else if (active == 1) {
      if (props.item.ApproverName) {
        empty_ary_Timesheet = props.item.ApproverName.split('$$');
      }
      empty_ary_Timesheet = empty_ary_Timesheet.filter(
        (item, index) => empty_ary_Timesheet.indexOf(item) === index,
      );
      //ApproverID
    }

    return active == 1 ? (
      <TouchableOpacity
        onPress={
          item.Status === 'Finalized'
            ? null
            : item.Status === 'Approved'
            ? () => VireApprove(item, 'Timesheet')
            : () => Edit(item)
        }
        style={[styles.card, styles.shadowProp]}>
        <View style={styles.containerblue}>
          <View
            style={
              item.Status === 'Approved'
                ? styles.headerApproved
                : item.Status !== 'Finalized'
                ? styles.headerblue
                : styles.headerFinalized
            }>
            <Text style={styles.headerbluetext}>
              {item.Status === 'Submitted' ? 'In Progress' : item.Status}
            </Text>
          </View>
        </View>
        <Text style={styles.weektext}>Week Ending: {item.WeekEndDate} </Text>
        <Text style={styles.submittxt}>
          {' '}
          {item.Status === 'Approved'
            ? +empty_ary_Timesheet.length === 1
              ? '' + item.Status + ' By : ' + empty_ary_Timesheet[0]
              : '' + item.Status + ' By : [ Multiple ]'
            : null}
          {item.Status === 'Finalized' || item.Status === 'Submitted' ? (
            <>
              <Text style={styles.submittxt}>
                {item.Status} {'By :'} {item.SubmittedBy}
                {item.Status === 'Submitted' ? (
                  <>
                    at{' '}
                    {moment
                      .utc(item.SubmittedOn)
                      .local()
                      .format('MM/DD/yyyy h:mm A')}
                  </>
                ) : null}
              </Text>
            </>
          ) : //Submitted
          item.Status === 'In Progress' ? (
            <>
              <Text style={styles.submittxt}>{'Submitted By :'}</Text>
            </>
          ) : null}{' '}
        </Text>
        <View
          style={
            item.Status !== 'Approved'
              ? styles.circlecontainer
              : styles.circlecontainer1
          }>
          <View style={[styles.flexcircles, styles.shadowProp]}>
            {item.Status === 'Finalized' || item.Status === 'Approved' ? (
              <>
                {item.Status === 'Approved' ? null : (
                  <View>
                    <TouchableOpacity
                      style={styles.circle}
                      underlayColor="#ccc"
                      onPress={() => CopytoggleModal(item, null)}>
                      <Image style={styles.logo} source={Copy} />
                    </TouchableOpacity>
                    <Text style={styles.circleundertxt}> Copy</Text>
                  </View>
                )}
                {/* <View>
       <TouchableOpacity
         style={styles.circle}
         underlayColor="#ccc"
         onPress={() => deleteRecord(item)}>
         <Image style={styles.logo} source={Delete} />
       </TouchableOpacity>
       <Text style={styles.circleundertxt}> Delete</Text>
     </View> */}
              </>
            ) : (
              <>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => FinalizeReport(item)}>
                    <Image style={styles.logo} source={Send} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Finalize</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => CopytoggleModal(item, 'Timesheet')}>
                    <Image style={styles.logo} source={Copy} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Copy</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => deleteRecord(item)}>
                    <Image style={styles.logo} source={Delete} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Delete</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => SendReport(item)}>
                    <Image style={styles.logo} source={proposed} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}>Submit</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={
          Status === 'Finalized'
            ? () => Approve(item, TimesheetId_Approve)
            : Status === 'Approved'
            ? () => VireApprove(item, 'Approve')
            : //null //Approve(item)
              () => Edit(item)
        }
        style={[styles.card, styles.shadowProp]}>
        <View style={styles.containerblue}>
          <View
            style={
              Status === 'Finalized'
                ? styles.headerFinalized
                : Status === 'Approved'
                ? styles.headerApproved
                : styles.headerblue
              // headerApproved
            }>
            <Text style={styles.headerbluetext}>{Status}</Text>
          </View>
        </View>
        <Text style={styles.weektext}>Week Ending: {item.WeekEndDate} </Text>
        <Text style={styles.submittxt}>
          {' '}
          {Status !== 'Approved'
            ? ` ${Status} By: ${
                empty_ary.length === 1 ? empty_ary[0] : '[ Multiple ]'
              }`
            : Status === 'Approved'
            ? ` ${Status} By: ${
                empty_ary.length === 1 ? item.ApproverName : '[ Multiple ]'
              }`
            : 'Submitted By: '}
          {Status === 'Submitted' ? (
            <>
              <Text style={styles.submittxt}> at {Submittedupdatetime}</Text>
            </>
          ) : null}{' '}
        </Text>
        <View style={styles.circlecontainer1}>
          <View style={[styles.flexcircles, styles.shadowProp]}>
            {Status === 'Finalized' ? (
              <>
                {/* <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => CopytoggleModal(item, null)}>
                    <Image style={styles.logo} source={Copy} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Copy</Text>
                </View> */}
                {/* <View>
               <TouchableOpacity
                 style={styles.circle}
                 underlayColor="#ccc"
                 onPress={() => deleteRecord(item)}>
                 <Image style={styles.logo} source={Delete} />
               </TouchableOpacity>
               <Text style={styles.circleundertxt}> Delete</Text>
             </View> */}
              </>
            ) : Status === 'Approved' ? (
              <>
                {/* <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => CopytoggleModal(item, null)}>
                    <Image style={styles.logo} source={Copy} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Copy</Text>
                </View> */}
                {/* <View>
             <TouchableOpacity
               style={styles.circle}
               underlayColor="#ccc"
               onPress={() => deleteRecord(item)}>
               <Image style={styles.logo} source={Delete} />
             </TouchableOpacity>
             <Text style={styles.circleundertxt}> Delete</Text>
           </View> */}
              </>
            ) : (
              <>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => FinalizeReport(item)}>
                    <Image style={styles.logo} source={Send} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Finalize</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => CopytoggleModal(item, null)}>
                    <Image style={styles.logo} source={Copy} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Copy</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => deleteRecord(item)}>
                    <Image style={styles.logo} source={Delete} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}> Delete</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.circle}
                    underlayColor="#ccc"
                    onPress={() => SendReport(item)}>
                    <Image style={styles.logo} source={proposed} />
                  </TouchableOpacity>
                  <Text style={styles.circleundertxt}>Submit</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  //get data

  return (
    <>
      <View style={styles.maincontainer}>
        {process_loader ? <Processing /> : null}
        <View style={styles.animi}>
          <View
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              top: 0,
              left: 0,
              borderRadius: 6,
            }}
          />

          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 5,
              borderTopColor: active === 0 ? '#253a6c' : 'transparent',
              backgroundColor: active === 0 ? '#fff' : 'transparent',
            }}
            onPress={() => setActive(0)}>
            <Text
              style={{
                color: active === 0 ? '#253a6c' : '#bdbabd',
                fontSize: 20,
                fontWeight: '700',
              }}>
              APPROVE TIMESHEETS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 5,
              borderTopColor: active === 1 ? '#253a6c' : 'transparent',
              backgroundColor: active === 1 ? '#fff' : 'transparent',
            }}
            onPress={() => setActive(1)}>
            <Text
              style={{
                color: active === 1 ? '#253a6c' : '#bdbabd',
                fontSize: 20,
                fontWeight: '700',
              }}>
              TIMESHEETS
            </Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.RectangleShapeView}>
          <FlatList
            columnWrapperStyle={{
              justifyContent: 'space-between',
              padding: 15,
              marginRight: 10,
              marginBottom: -10,
              marginTop: -15,
            }}
            extraData={data}
            data={data}
            numColumns={2}
            renderItem={renderItem}
            style={styles.container}
            contentContainerStyle={{minHeight: `100%`}}
            scrollEnabled={true}
          />
        </SafeAreaView>
      </View>

      {isModalVisible ? (
        <DeletePopup
          navigation={navigation}
          setModalVisible={setModalVisible}
          DelClicked={DelClicked}
          deleteRec={deleteRec}
          deleteRecord={deleteRecord}
        />
      ) : null}

      {isSubmitModalVisible ? (
        <SubmitPopup
          navigation={navigation}
          setSubmitModalVisible={setSubmitModalVisible}
          GetData={GetData}
          DelClicked={DelClicked}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    width: '50%',
    //height: '10%',
    marginLeft: '5%',
    // backgroundColor: 'red',
  },
  animi: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 0,
    height: 60,
  },
  RectangleShapeView: {
    width: '180%',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
    maxHeight: 720,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '49%',
    //marginVertical: 10,
    height: '90%',
    ///marginLeft: '2%',
    marginBottom: '5%',
    marginTop: '1%',
  },
  shadowProp: {
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  containerblue: {
    backgroundColor: '#f5f3f5',
    borderColor: '#fff',
    borderStyle: 'solid',
  },
  headerblue: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4478de',
    padding: 10,
  },
  headerFinalized: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcb601',
    padding: 10,
  },
  headerApproved: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#38c174',
    padding: 10,
  },
  headerbluetext: {
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  weektext: {
    fontSize: 25,
    color: '#253a6c',
    fontWeight: '700',
    padding: 15,
  },
  submittxt: {
    fontSize: 19,
    color: '#bdbabd',
    fontWeight: '700',
    paddingLeft: 15,
    paddingTop: 10,
  },
  circlecontainer: {
    backgroundColor: '#fcfafc',
    flex: 1,
    marginTop: 30,
  },
  circlecontainer1: {
    flex: 1,
    marginTop: 30,
  },
  flexcircles: {
    height: 120,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
  },
  circle: {
    borderRadius: 50,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    marginTop: 15,
  },
  circleundertxt: {
    textAlign: 'center',
    fontSize: 20,
    color: '#253a6c',
    fontWeight: '600',
    marginTop: 20,
  },
  logo: {
    width: 30,
    height: 30,
  },
  eyelogo: {
    width: 43,
    height: 27,
  },

  container: {
    width: '100%',
    height: 700,
    flexGrow: 0,
  },
});
