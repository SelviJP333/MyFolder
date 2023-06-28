//Update Approve report page

import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Row, Rows, Table, TableWrapper} from 'react-native-table-component';
import Scroll_Pagination from '../Components/Scroll_Pagination';
import color from '../constants/color';
import db from '../constants/db';
import CheckBox from '@react-native-community/checkbox';
import Create_Timesheet from '../Components/CreateTimesheet';
import Approve_popup from '../Components/Approve_popup';
import ApproveSubmit_popup from '../Components/ApproveSubmit_popup';
import moment from 'moment';
import {Total} from '../Components/Add_Hours';
import SynchData from '../Sync/SynchData';
import Processing from '../Components/Processing';
import {useFocusEffect} from '@react-navigation/native';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
import CurrentUTCTime from '../constants/CurrentUTCTime';
// var db = openDatabase({ name: "Offline.sqlite" });

function Approve_Report({props, route, navigation}) {
  const [process_loader, setprocess_loader] = useState(false);
  const networkStatus = checkNetworkStatus();
  const [tableHead, settableHead] = useState([
    'Employee',
    'Company',
    'Job',
    'Phase Code',
    'Reg',
    'Ot',
    'Dbl',
    'Finalized By',
    '',
  ]);
  const [tableData, settableData] = useState([
    [
      '99-Test Company #99',
      11,
      'A&E - Land Planner',
      99,
      'Lurie Co. 23rd Floor Remodel',
      4809,
      'CLNovak@leopardo.com',
    ],
  ]);
  const [Monday, setMonday] = useState('');
  const [Tuesday, setTuesday] = useState('');
  const [Wednesday, setWednesday] = useState('');
  const [Thursday, setThursday] = useState('');
  const [Friday, setFriday] = useState('');
  const [Saturday, setSaturday] = useState('');
  const [Sunday, setSunday] = useState('');
  const [TableData, setTableData] = useState([
    ['Mani qwuwydguhabuyegwuygkkjn', '', '', '', 12, 5, 6, ''],
  ]);
  const [TableData2, setTableData2] = useState([
    ['', '99-Test Company #99', 'OH Overhead', '20- health care', 3, 5, 6, ''],
  ]);
  const [TableData3, setTableData3] = useState([
    ['', '99-Test Company #99', 'OH Overhead', '20- health care', 3, 5, 6, ''],
  ]);
  const [CompanyID, setCompanyID] = useState([]);
  const [JobID, setJobID] = useState([]);
  const [PhaseID, setPhaseID] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [Approve_Confirm, setApprove_Confirm] = useState(false);
  const [Approve_Success, setApprove_Success] = useState(false);
  const [rowLimit, setrowLimit] = useState(10);
  const [open_popup, setopen_popup] = useState(false);
  const [select_row, setselect_row] = useState(10);
  const [call_back, setcall_back] = useState(null);
  const [UserName, set_UserName] = useState([]);
  const [Trigger_Approve, setTrigger_Approve] = useState(false);
  const [Initialselect_row, setInitialselect_row] = useState(0);
  const [Empcount, setEmpcount] = useState(0);
  const [FilteredUserName, set_FilteredUserName] = useState([]);

  useEffect(() => {
    if (rowLimit > UserName.length) {
      setselect_row(rowLimit);

      setInitialselect_row(0);
    } else {
      if (parseInt(Initialselect_row) + parseInt(rowLimit) < UserName.length) {
        setselect_row(parseInt(Initialselect_row) + parseInt(rowLimit));
      }
    }

    // setInitialselect_row( parseInt(Initialselect_row)+parseInt(rowLimit))
  }, [rowLimit]);

  useEffect(() => {
    set_FilteredUserName(UserName.slice(Initialselect_row, select_row));
    // setselect_row(rowLimit)
    // }
  }, [UserName, rowLimit, select_row, Initialselect_row]);

  const Fetch_All_Data = async () => {
    //
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');

    let All = [];
    let pushing = [];

    db.transaction(txn => {
      let Approvequery = `select e2.FullName AS submittedname,t.StatusID,t.SubmittedBy,t.FinalizedByUserID, t.TimesheetID,t.WeekEndDate,te.TimesheetEmployeeID, te.EmployeeId,e.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tpc.* ,lp.PhaseCodeName,lp.PhaseCode from Timesheet t
LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
LEFT JOIN Employee e ON e.EmployeeID = te.EmployeeID
LEFT JOIN [User] u ON u.UserID = t.FinalizedByUserID
LEFT JOIN Employee e2 ON e2.EmployeeID = u.EmployeeID
LEFT JOIN LkpCompany lc ON lc.CompanyID = tc.CompanyID
LEFT JOIN LkpJob lj ON lj.JobID = tj.JobID
LEFT JOIN LkpPhaseCode lp ON lp.PhaseCodeID = tpc.PhaseCodeID
where    te.TimesheetEmployeeID in (
  select TimesheetEmployeeID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${route.params.paramKeySubmited} )

) and t.TimesheetID in (

select TimesheetID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${route.params.paramKeySubmited} )

) and t.WeekEndDate='${route.params.paramkeyWeekEndDate}' and t.StatusID IN (3) and te.IsApproved is not null`;

      let TimesheetQuery = `select e2.FullName AS submittedname,t.StatusID,t.SubmittedBy,t.FinalizedByUserID, t.TimesheetID,t.WeekEndDate,te.TimesheetEmployeeID, te.EmployeeId,e.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tpc.* ,lp.PhaseCodeName,lp.PhaseCode from Timesheet t
LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
LEFT JOIN Employee e ON e.EmployeeID = te.EmployeeID
LEFT JOIN [User] u ON u.UserID = t.FinalizedByUserID
LEFT JOIN Employee e2 ON e2.EmployeeID = u.EmployeeID
LEFT JOIN LkpCompany lc ON lc.CompanyID = tc.CompanyID
LEFT JOIN LkpJob lj ON lj.JobID = tj.JobID
LEFT JOIN LkpPhaseCode lp ON lp.PhaseCodeID = tpc.PhaseCodeID
where    

t.TimesheetID ='${route.params.paramKeyTimesheetID}'  and t.CreatedBy = ${SubmitUserID} `;

      txn.executeSql(
        route.params.page === 'Approve' ? Approvequery : TimesheetQuery,

        [],

        async function (tx, res) {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
          var DateTime = CurrentUTCTime();
          db.transaction(txn => {
            txn.executeSql(
              'select * from timesheetemployee where timesheetId = ? and IsApproved is null',
              [route.params.paramKeyTimesheetID],
              function (tx, result) {
                var emplist = [];
                for (let i = 0; i < result.rows.length; i++) {
                  emplist.push(result.rows.item(i));
                }

                if (emplist.length === 0) {
                  db.transaction(txn => {
                    txn.executeSql(
                      `UPDATE Timesheet set StatusID=3  where TimesheetID=?`,
                      [route.params.paramKeyTimesheetID],
                      function (tx, result) {
                        txn.executeSql(
                          'INSERT INTO DeviceSynchDataLog (Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                            ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                          [
                            'U',
                            'Timesheet',
                            route.params.paramKeyTimesheetID,
                            'StatusID',
                            '3',
                            DateTime,
                            Deviceid,
                            0,
                            0,
                            '-',
                          ],
                          function (tx, result) {
                            if (temp.length === 0 && emplist.length === 0) {
                              // navigation.navigate('My TimeSheet');
                            }
                            //    navigation.navigate('My TimeSheet');
                          },
                        );
                      },
                    );
                  });
                }
              },
            );
          });

          const Checking = (first, second) => {
            //console.log("1",first);
            //   console.log("indexxx",first);
            let result = first.find(ele => {
              //   console.log("2",ele[0][0],      second);
              // [["Kleniuk, Szymon Pawel", "Miranda, Osvaldo "]]

              // console.log("dont enter");
              return ele[0][0] === second;
            });

            return result;
          };

          temp.forEach((e, i) => {
            if (All.length !== 0) {
              Checking(All, e.FullName) === undefined
                ? All.push([
                    [e.FullName],
                    [false],
                    [e.TimesheetID],
                    [e.TimesheetEmployeeID],
                    [e.WeekEndDate],
                    [e.CreatedBy],
                    [e.CreatedOn],
                    [e.submittedname],
                  ])
                : null;
            } else {
              All.push([
                [e.FullName],
                [false],
                [e.TimesheetID],
                [e.TimesheetEmployeeID],
                [e.WeekEndDate],
                [e.CreatedBy],
                [e.CreatedOn],
                [e.submittedname],
              ]);
            }
          });

          // filter by name
          All.map((e, all_index) => {
            if (temp.filter(f => f.FullName === e[0][0])) {
              let filtered = temp.filter(f => f.FullName === e[0][0]);

              let f = filtered.forEach((ff, i) => {
                if (pushing.length === 0) {
                  pushing.push([
                    [
                      e[0][0],
                      e[1][0],
                      e[2][0],
                      e[3][0],
                      e[4][0],
                      e[5][0],
                      e[6][0],
                      e[7][0],
                    ],
                    [
                      `${ff.TimesheetID}***${ff.TimesheetEmployeeID}`,
                      ff.CompanyName,

                      ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                      ff.PhaseCode !== null
                        ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                        : '-',
                      Total(ff, 'reg'),
                      Total(ff, 'ot'),
                      Total(ff, 'dbl'),
                      ff.submittedname,
                      '',
                    ],
                  ]);
                } else if (all_index !== 0) {
                  if (pushing[all_index] === undefined) {
                    pushing[all_index] = [
                      [
                        e[0][0],
                        e[1][0],
                        e[2][0],
                        e[3][0],
                        e[4][0],
                        e[5][0],
                        e[6][0],
                        e[7][0],
                      ],
                      [
                        `${ff.TimesheetID}***${ff.TimesheetEmployeeID}`,
                        ff.CompanyName,
                        ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                        ff.PhaseCode !== null
                          ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                          : '-',
                        Total(ff, 'reg'),
                        Total(ff, 'ot'),
                        Total(ff, 'dbl'),
                        ff.submittedname,
                        '',
                      ],
                    ];
                  } else {
                    pushing[all_index].push([
                      `${ff.TimesheetID}***${ff.TimesheetEmployeeID}`,
                      ff.CompanyName,
                      ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                      ff.PhaseCode !== null
                        ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                        : '-',
                      Total(ff, 'reg'),
                      Total(ff, 'ot'),
                      Total(ff, 'dbl'),
                      ff.submittedname,
                      '',
                    ]);
                  }
                } else {
                  pushing[all_index].push([
                    `${ff.TimesheetID}***${ff.TimesheetEmployeeID}`,
                    ff.CompanyName,
                    ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                    ff.PhaseCode !== null
                      ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                      : '-',
                    Total(ff, 'reg'),
                    Total(ff, 'ot'),
                    Total(ff, 'dbl'),
                    ff.submittedname,
                    '',
                  ]);
                  //  pushing.push([ [e[0][0]] , ["",ff.CompanyName,ff.JobName??"-",ff.PhaseCodeName??"-",(ff.Total_Reg===0?"-":ff.Total_Reg) ,ff.Total_Ot===0?"-":ff.Total_Ot,ff.Total_Dbl===0?"-":ff.Total_Dbl,""]])
                }

                // return [ [e[0][0]] , ["",ff.CompanyName,"j","p","1","2","3",""]]
              });

              //
              return pushing;
            }
            //

            return pushing;
          });

          // filtered.forEach(e=>{
          //
          //   All.push([[All[0][0]]])
          // })
          var arr = [];
          var final = [...pushing];
          final.forEach(function (item) {
            arr.push(item);
          });
          set_UserName(arr);
        },
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      Fetch_All_Data();

      return () => {};
    }, [Trigger_Approve]),
  );

  //
  //

  // useEffect(() => {
  //   GetUserData();
  // }, [])

  const Arrows = type => {
    if (rowLimit < UserName.length) {
      if (type === 'arrowleft') {
        setInitialselect_row(0);

        setselect_row(rowLimit);

        // setselect_row(10);
      }

      if (type === 'backward') {
        if (Initialselect_row - rowLimit > 0) {
          if (select_row === UserName.length) {
            setInitialselect_row(UserName.length - rowLimit * 2);

            setselect_row(UserName.length - rowLimit);
          } else {
            setselect_row(Initialselect_row);

            setInitialselect_row(Initialselect_row - rowLimit);
          }
        } else {
          setInitialselect_row(0);

          setselect_row(rowLimit);
        }
      }

      if (type === 'forward') {
        // if (select_row + 10 < UserName.length) {

        //   setInitialselect_row(Initialselect_row + rowLimit);

        //   setselect_row(Initialselect_row + rowLimit);

        // } else if (select_row !== UserName.length) {

        //   //

        //   setInitialselect_row(select_row);

        //   // setselect_row(UserName.length);

        // }

        if (UserName.length > parseInt(select_row) + parseInt(rowLimit)) {
          setselect_row(parseInt(select_row) + parseInt(rowLimit));

          if (Initialselect_row === 0) {
            setInitialselect_row(0 + parseInt(rowLimit));
          } else {
            setInitialselect_row(
              parseInt(Initialselect_row) + parseInt(rowLimit),
            );
          }
        } else if (
          UserName.length <
          parseInt(select_row) + parseInt(rowLimit)
        ) {
          if (select_row < UserName.length) {
            setInitialselect_row(select_row);

            setselect_row(
              parseInt(select_row) + (UserName.length - parseInt(select_row)),
            );
          }
        }
      }

      if (type === 'arrowright') {
        setInitialselect_row(UserName.length - rowLimit);

        setselect_row(UserName.length);
      }
    }
  };
  const img_url = [
    {
      Image: require('../Image/arrowleft.png'),
      func: () => Arrows('arrowleft'),
    },
    {
      Image: require('../Image/backward.png'),
      func: () => Arrows('backward'),
    },
    {
      Image: require('../Image/forward.png'),
      func: () => Arrows('forward'),
    },
    {
      Image: require('../Image/arrowright.png'),
      func: () => Arrows('arrowright'),
    },
  ];

  const CheckBoxing = (i, status, ee, first_full_arry) => {
    return (
      <TouchableOpacity>
        <View style={{display: 'flex', alignItems: 'center'}}>
          <CheckBox
            value={status}
            onValueChange={() => {
              let modified = UserName.map((e, index) => {
                if (i === index) {
                  splite = ee => {
                    return ee.splice(1);
                  };

                  splite2 = data => {
                    return data.splice(2);
                  };

                  return [
                    [e[0][0], !status, ...splite2(first_full_arry[0])],
                    ...splite(e),
                  ];
                } else {
                  return e;
                }
              });

              setEmpcount(
                modified.map(e => e[0][1]).filter(w => w === true).length,
              );

              set_UserName(modified);
            }}
          />
        </View>

        {/* <TouchableOpacity onPress={toggleModal}><Text>Button</Text></TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  //--- Working Functionality

  // return [
  //   [e[0][0], !status, '', '', reg, ot, Dbl, e[0][7], '', ''],
  //   ...splite(e),
  // ];

  // --------------

  //  [[e[0][0], !status], ...splite(e)];

  // [
  //   [
  //     e[0][0],!status,
  //     '',
  //     '',
  //     reg,
  //     ot,
  //     Dbl,
  //     e[0][7],
  //   ],
  // ];

  const Edit = item => {
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

  const Navigate_to_Edit = (e, index, ee) => {
    let first = ee.split('***')[0];
    let second = ee.split('***')[1];

    navigation.navigate('Approve_ViewTimesheet', {
      //  paramKeyTimesheetJobId: null,
      paramKeyTimesheetID: first,
      paramKeyPhaseCodeID: null,
      paramkeyWeekEndDate: e[0][4],
      paramKeyEmployeeID: second,
      paramKeyCreatedOn: null,
      paramKeyCreatedBy: null,
      pass_paramKeyTimesheetID: route.params.paramKeyTimesheetID,
      functions: Fetch_All_Data,
      Usernamelists: UserName.map(e => e[0][0]),
    });
  };
  const GetDateTime = () => {
    let dateTime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    return dateTime;
  };
  const Approved = async () => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    let checked_user = UserName.filter(e => {
      return e[0][1] === true;
    });
    var DateTime = CurrentUTCTime();
    checked_user.forEach((e, index) => {
      e.forEach((s, s_index) => {
        console.log('rrr', s);
        db.transaction(tx => {
          tx.executeSql(
            `UPDATE TimesheetEmployee set IsApproved=1 , ApprovedByUserID=?, UpdatedBy=?, UpdatedOn=? where TimesheetEmployeeID=?`,
            [
              SubmitUserID,
              SubmitUserID,
              DateTime,
              s_index === 0 ? null : s[0].split('***')[1],
            ],
            async (tx, res) => {
              if (s_index !== 0) {
                var newArray = [
                  {ColumnName: 'IsApproved', ColumnValue: 1},
                  {ColumnName: 'ApprovedByUserID', ColumnValue: SubmitUserID},
                ];
                newArray.map(item =>
                  tx.executeSql(
                    'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                      ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                    [
                      'U',
                      'TimesheetEmployee',
                      s[0].split('***')[1],
                      item.ColumnName,
                      item.ColumnValue,
                      DateTime,
                      Deviceid,
                      0,
                      0,
                      '-',
                    ],
                    function (tx, res) {
                      setApprove_Confirm(false);
                      setTimeout(() => {
                        setTrigger_Approve(!Trigger_Approve);
                      }, 10);
                    },
                  ),
                );
              }
            },
          );
        });
      });
    });
  };
  const Finalize = async () => {
    setApprove_Confirm(true);
  };
  //
  return (
    <View style={styles.container}>
      {/* {process_loader ? <Processing /> : null} */}

      {Approve_Confirm ? (
        <Approve_popup
          navigation={navigation}
          setApprove_Confirm={setApprove_Confirm}
          setApprove_Success={setApprove_Success}
          Approved={Approved}
          Empcount={Empcount}
          UserName={UserName}
        />
      ) : null}

      {/* {isModalVisible ? (
          <ApproveSubmit_popup
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
        ) : null} */}
      {Approve_Success ? (
        <ApproveSubmit_popup
          Empcount={Empcount}
          setEmpcount={setEmpcount}
          setApprove_Success={setApprove_Success}
          setTrigger_Approve={setTrigger_Approve}
          setApprove_Confirm={setApprove_Confirm}
          Approved={Approved}
        />
      ) : null}
      <Scroll_Pagination
        open_popup={open_popup}
        setopen_popup={setopen_popup}
        setselect_row={setselect_row}
        select_row={select_row}
        setrowLimit={setrowLimit}
        setInitialselect_row={setInitialselect_row}
      />

      <View style={styles.headcontainer}>
        <Text style={styles.headertitle}>
          Approving timesheets for week ending:{' '}
          {route.params.paramkeyWeekEndDate}
        </Text>
        <Text></Text>
        <Text style={styles.subtitle}>
          Please review all details below. Click on the edit icon for any row to
          make changes to that timesheet.{' '}
        </Text>
        <Text></Text>
      </View>

      <Table>
        <Row
          data={tableHead}
          flexArr={[0.6, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6, 0.2]}
          style={styles.head}
          textStyle={styles.text}
        />

        <ScrollView style={styles.wrapper}>
          {/* a.map(e=>{

        }) */}

          {FilteredUserName.map((e, index) => {
            //

            let reg = 0;
            let ot = 0;
            let Dbl = 0;

            e.forEach((ee, i) => {
              if (i === 0) {
              } else {
                ee[4] === '-' ? null : (reg += ee[4]);
                ee[5] === '-' ? null : (ot += ee[5]);
                ee[6] === '-' ? null : (Dbl += ee[6]);
              }
            });
            return (
              <Pressable onPress={() => null}>
                <TableWrapper
                  style={{
                    borderWidth: 0,
                    backgroundColor: index % 2 != 0 ? '#E0E0E0' : 'transaprent',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Rows
                      data={[[e[0][0], '', '', '', reg, ot, Dbl, '', '']]}
                      flexArr={[0.6, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6, 0.2]}
                      style={styles.row}
                      textStyle={styles.Datatext}
                    />
                  </View>

                  {e.map((ee, index2) => {
                    //
                    const sliced = datas => {
                      let b = datas.slice(1);
                      console.log(b.length);
                      return ['', ...b];
                    };
                    return index2 !== 0 ? (
                      <>
                        <Pressable
                          onPress={() => Navigate_to_Edit(e, index, ee[0])}>
                          <Rows
                            data={[sliced(ee)]}
                            flexArr={[
                              0.7, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6, 0.2,
                            ]}
                            style={styles.row}
                            textStyle={styles.Datatext}
                          />
                        </Pressable>
                      </>
                    ) : (
                      <Rows data={[[]]} />
                    );
                  })}
                </TableWrapper>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* BOTTOM PAGINATION */}
        <View
          style={{
            width: '100%',
            height: '8%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '4%',
          }}>
          {/* left div */}
          <View
            style={{
              width: '30%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 18}}>
              {Initialselect_row} - {select_row} of {UserName.length}{' '}
              <Text
                style={{fontSize: 18, color: color.gray, fontWeight: '500'}}>
                {' '}
                Show{' '}
              </Text>
            </Text>
            {/* <Pressable > */}
            <Pressable
              onPress={() => setopen_popup(true)}
              style={{
                width: '20%',
                height: '80%',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderStartWidth: 5,
                borderStartColor: '#dbd8db',
              }}>
              <Text style={{fontSize: 18, fontWeight: '500'}}> {rowLimit}</Text>
              <View
                style={{
                  height: '100%',
                  width: '35%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{height: 25, width: 30}}
                  source={require('../Image/dropdown.png')}
                />
              </View>
            </Pressable>
            {/* </Pressable> */}

            <Text style={{fontSize: 18, color: color.gray, fontWeight: '500'}}>
              {' '}
              Rows
            </Text>
          </View>

          {/* right div */}
          <View
            style={{
              width: '23%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {img_url.map(e => {
              return (
                <View
                  style={{
                    width: '20%',
                    height: '0%',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: color.lightgray,
                    borderWidth: 1,
                  }}>
                  <TouchableOpacity onPress={e.func}>
                    <Image source={e.Image} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* SUBMIT BUTTON */}

        {/* credits < 30 ? "freshman" : credits <= 59 ? "sophomore" : credits <= 89  */}

        <TouchableOpacity
          style={{
            width: 200,
            height: '8%',
            backgroundColor: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            left: '57%',
            bottom: '13%',
            backgroundColor: '#002D62',
            transform: [{translateX: -200}],
          }}
          onPress={() => navigation.navigate('My TimeSheet')}>
          <Text style={{color: 'white', fontSize: 25}}>Back</Text>
        </TouchableOpacity>
      </Table>
    </View>
  );
}

export default Approve_Report;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#FBFBF9'},
  head: {height: 60, backgroundColor: '#B6B6B4', color: '#fff'},
  wrapper: {
    flexDirection: 'column',
    height: '53%',
    borderColor: color.lightgray,
    borderWidth: 2,
  },
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {minHeight: 20, borderColor: 'transparent', borderWidth: 2},
  text: {margin: 6, textAlign: 'center', color: '#fff', fontSize: 18},
  Datatext: {margin: 6, textAlign: 'center', color: '#9c9a9a', fontSize: 15},
  headertitle: {
    color: color.bluebgcolor,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    color: color.gray,
  },
  headcontainer: {
    padding: 10,
  },
});
