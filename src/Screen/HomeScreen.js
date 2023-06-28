import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Copy_pop from '../Components/Copy_pop';
import Create_Weekend from '../Components/Create_Weekend';
import CustomSwitch from '../Components/CustomSwitch';
import color from '../constants/color';
import db from '../constants/db';
import {
  delete1,
  delete2,
  Remove_Date,
  Approve_Hold,
} from '../redux/actions/Action';
import CurrentUTCTime from '../constants/epochTime';
import Processing from '../Components/Processing';
import SynchData from '../Sync/SynchData';

const HomeScreen = ({navigation, route}) => {
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setCompany([]);
    setJob([]);
    setPhase([]);
    setEmployee([]);
  };

  const [Home_active, setome_active] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);
  const [Userdata, setUserData] = useState([]);
  const [Company, setCompany] = useState([]);
  const [Job, setJob] = useState([]);
  const [Phase, setPhase] = useState([]);
  const [Employee, setEmployee] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [Submittedupdatetime, setSubmittedpdatetime] = useState();
  const [Copied_Frm_Apprv, setCopied_Frm_Apprv] = useState(false);
  const [Is_Head, setIs_Head] = useState(null);
  const [Approve_Arry, setApprove_Arry] = useState([]);

  useEffect(() => {
    (async () => {
      let SubmitUserID;
      SubmitUserID = await AsyncStorage.getItem('SubmitUserID');

      db.transaction(txn => {
        txn.executeSql(
          `select FullName from Employee where ApproverID =(select UserID from User where UserID=${SubmitUserID})`,
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

  // date to update in database
  const GetDateTime = () => {
    let dateTime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    return dateTime;
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

  const getUser = useSelector(store => store);

  const Save = async () => {
    const myPromise = new Promise((resolve, reject) => {
      resolve('foo');
    }).then(async () => {
      let Userid = await AsyncStorage.getItem('Userid');
      let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
      //
      let resstatus = false;
      var TimesheetID2 = generateGuidQuickly();
      getUser.count.data.forEach(async e => {
        var TimesheetID = generateGuidQuickly();
        var DateTime = CurrentUTCTime();
        var Empresult;

        db.transaction(function (txn) {
          txn.executeSql('SELECT * FROM Employee', [], function (tx, res) {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }

            Empresult = temp.find(obj => {
              //
              return obj.FullName === Object.keys(e)[0];
            });
            //
            if (res.rows.length != 0) {
              if (resstatus == false) {
                tx.executeSql(
                  'INSERT INTO Timesheet (TimesheetID, SubmittedByUserID, WeekEndDate,StatusID, CreatedBy, CreatedOn)' +
                    ' VALUES (?, ?, ?, ?, ?, ?);',
                  [
                    TimesheetID2,
                    SubmitUserID,
                    getUser.Date_pending.data[0],
                    1,
                    SubmitUserID,
                    DateTime,
                  ],
                  function (tx, res) {
                    resstatus = true;
                  },
                );
              }

              txn.executeSql(
                'INSERT INTO TimesheetEmployee (TimesheetEmployeeID, TimesheetID, EmployeeID, CreatedBy, CreatedOn)' +
                  ' VALUES (?, ?, ?, ?, ?);',
                [
                  TimesheetID,
                  TimesheetID2,
                  Empresult.EmployeeID,
                  SubmitUserID,
                  DateTime,
                ],
                function (tx, res) {
                  // if (res.rowsAffected > 0) {
                  //   if (CompanyID.length == 0) {
                  //
                  //     navigation.navigate('My TimeSheet');
                  //   }
                  // } else {
                  //
                  //   navigation.navigate('My TimeSheet');
                  // }
                  //
                },
              );

              if (Object.values(e)[0].length !== 0) {
                //
                // insert data into TimesheetCompany table
                //
                // TimesheetID,
                // Object.values(e)[0][i][0][0].split('*#^*')[0],
                // SubmitUserID,
                // DateTime);
                for (let i = 0; i < Object.values(e)[0].length; i++) {
                  txn.executeSql(
                    'INSERT INTO TimesheetCompany (TimesheetCompanyID,TimesheetEmployeeID, CompanyID, CreatedBy, CreatedOn)' +
                      ' VALUES (?, ?, ?, ?, ?);',
                    [
                      Object.values(e)[0][i][0][0].split('+')[1],
                      TimesheetID,
                      Object.values(e)[0][i][0][0].split('*#^*')[0],
                      SubmitUserID,
                      DateTime,
                    ],
                    async function (tx, res) {
                      if (!Object.values(e)[0][i][1]) {
                        navigation.navigate('My TimeSheet');
                      } else {
                        if (
                          Object.values(e)[0][i][1] &&
                          Object.values(e)[0][i][1]
                        ) {
                          Object.values(e)[0][i][1].forEach((ee, job_i) => {
                            txn.executeSql(
                              'INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID, CreatedBy, CreatedOn)' +
                                'VALUES (?, ?, ?, ?, ?);',
                              [
                                ee[0].split('+')[2],
                                Object.values(e)[0][i][0][0].split('+')[1],
                                ee[0].split('*#^*')[0],
                                SubmitUserID,
                                DateTime,
                              ],

                              async function (tx, results) {
                                if (SelectedPhase.length == 0) {
                                  // navigation.navigate('My TimeSheet');
                                }

                                if (
                                  Object.values(e)[0][i][1] &&
                                  Object.values(e)[0][i][1][job_i] &&
                                  Object.values(e)[0][i][1][job_i][1]
                                ) {
                                  // let phasefilter = [].concat.apply(
                                  //   [],
                                  //   SelectedPhase
                                  // );

                                  for (
                                    let j = 0;
                                    j <
                                    Object.values(e)[0][i][1][job_i][1].length;
                                    j++
                                  ) {
                                    var Mon =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][1].split('/');
                                    var Tues =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][2].split('/');
                                    var Wed =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][3].split('/');
                                    var Thurs =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][4].split('/');
                                    var Fri =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][5].split('/');
                                    var Sat =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][6].split('/');
                                    var Sun =
                                      Object.values(e)[0][i][1][job_i][1][
                                        j
                                      ][7].split('/');

                                    txn.executeSql(
                                      'INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours, Comment, CreatedBy, CreatedOn,Total_Reg,Total_Ot,Total_Dbl)' +
                                        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?);',
                                      [
                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][0].split('+')[3],
                                        Object.values(e)[0][i][1][
                                          job_i
                                        ][0].split('+')[2],
                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][0].split('*#^*')[0],
                                        Mon[0],
                                        Mon[1],
                                        Mon[2],
                                        Tues[0],
                                        Tues[1],
                                        Tues[2],
                                        Wed[0],
                                        Wed[1],
                                        Wed[2],
                                        Thurs[0],
                                        Thurs[1],
                                        Thurs[2],
                                        Fri[0],
                                        Fri[1],
                                        Fri[2],
                                        Sat[0],
                                        Sat[1],
                                        Sat[2],
                                        Sun[0],
                                        Sun[1],
                                        Sun[2],
                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][9],
                                        SubmitUserID,
                                        DateTime,

                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][8].split('/')[0],
                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][8].split('/')[1],
                                        Object.values(e)[0][i][1][job_i][1][
                                          j
                                        ][8].split('/')[2],
                                      ],
                                      async function (tx, results) {},
                                    );
                                  }
                                }
                              },
                              err => {
                                console.error('err', err);
                              },
                            );
                          });
                        }
                      }
                    },
                  );
                }
                // navigation.navigate("HomeScreen");
              }
            }
          });
        });

        dispatch(delete1());
        dispatch(delete2());
        dispatch(Remove_Date());
      });
    });
  };
  useEffect(() => {
    (async () => {
      let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
      db.transaction(txn => {
        txn.executeSql(
          `select EmployeeID from User where UserID=${+SubmitUserID}`,
          [],
          async function (tx, res) {
            var temp2 = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp2.push(res.rows.item(i));
            }

            let store = [{value: temp2[0]['EmployeeID']}];
            await AsyncStorage.setItem('UserDetails2', JSON.stringify(store));
          },
          error => {},
        );
      });
    })();
  }, []);
  // })

  let datas = [
    // first company
    [
      ['leopardo'],
      [
        [
          'Painting',
          [
            [
              '239',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
            [
              '419',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
          ],
        ],
        [
          'carpentar',
          [
            [
              '539',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
            [
              '019',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
          ],
        ],
      ],
    ][
      // second
      (['leopardo2'],
      [
        [
          'Painting',
          [
            [
              '239',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
            [
              '419',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
          ],
        ],
        [
          'carpentar',
          [
            [
              '539',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
            [
              '019',
              'mon',
              'tues',
              'wednes',
              'thurs',
              'friday',
              'saturday',
              'sunday',
              'total',
            ],
          ],
        ],
      ])
    ],
    // third company
    // e
    [['nn'], [['Painting'], ['carpentar']]],
    // e
  ];

  //get data
  const GetData = async (type = null) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let query = '';
    let query2 = '';
    //
    switch (type) {
      case 'Approve':
        query2 = Is_Head
          ? `
          select t.CreatedOn,te.ApprovedByUserID, e.ApproverID,SubmittedOn, t.TimesheetID,u.EmployeeID,t.WeekEndDate,te.CreatedBy,te.TimesheetEmployeeID,t.TimesheetID,
          COUNT(DISTINCT tj.JobID) Jobs ,tc.TimesheetCompanyID, tj.TimesheetJobID,u.UserID,COUNT(DISTINCT tpc.PhaseCodeID) PhaseCodes,
          (Select FULLName from Employee where EmployeeId in (Select EmployeeId from User Where UserID=te.ApprovedByUserID)) ApproverName,
                  COUNT(DISTINCT te.EmployeeID) Employees ,lts.StatusName  Status,IFNULL(e.FullName,'') SubmittedBy from Timesheet t
                  LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
                  LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
                  LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
                  LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
                  LEFT JOIN LkpTimesheetStatus lts ON t.StatusID = lts.StatusID
                  LEFT JOIN User u ON u.UserID =  coalesce(t.SubmittedBy,t.FinalizedByUserID)
                  LEFT JOIN Employee e ON e.EmployeeID = u.EmployeeID
                   where t.TimesheetID in (
              select TimesheetID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${SubmitUserID} )
              ) and te.TimesheetEmployeeID in (
              select TimesheetEmployeeID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${SubmitUserID} )
              )
              AND (t.WeekEndDate> date('now','-28 day') OR t.StatusID IN (5,3))
                  GROUP BY  t.TimesheetID ORDER BY t.CreatedOn DESC
      `
          : `
          select t.CreatedOn,te.ApprovedByUserID, e.ApproverID,SubmittedOn, t.TimesheetID,u.EmployeeID,t.WeekEndDate,te.CreatedBy,te.TimesheetEmployeeID,t.TimesheetID,
          COUNT(DISTINCT tj.JobID) Jobs ,tc.TimesheetCompanyID, tj.TimesheetJobID,u.UserID,COUNT(DISTINCT tpc.PhaseCodeID) PhaseCodes,
          (Select FULLName from Employee where EmployeeId in (Select EmployeeId from User Where UserID=te.ApprovedByUserID)) ApproverName,
                  COUNT(DISTINCT te.EmployeeID) Employees ,lts.StatusName  Status,IFNULL(e.FullName,'') SubmittedBy from Timesheet t

                  LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
                  LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
                  LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
                  LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
                  LEFT JOIN LkpTimesheetStatus lts ON t.StatusID = lts.StatusID
                  LEFT JOIN User u ON u.UserID =  coalesce(t.SubmittedBy,t.FinalizedByUserID)
                  LEFT JOIN Employee e ON e.EmployeeID = u.EmployeeID
                   where t.TimesheetID in (
              select TimesheetID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${SubmitUserID} )
              ) and te.TimesheetEmployeeID in (
              select TimesheetEmployeeID from TimesheetEmployee where EmployeeId in ( select EmployeeID from Employee where ApproverID=${SubmitUserID} )
              ) and t.FinalizedByUserID<>${SubmitUserID}
              AND (t.WeekEndDate> date('now','-28 day') OR t.StatusID IN (5,3))
                  GROUP BY  t.TimesheetID ORDER BY t.CreatedOn DESC
        `;
        break;
      case null:
        query = `select t.CreatedOn,te.ApprovedByUserID, e.ApproverID,t.SubmittedOn, t.TimesheetID,u.EmployeeID,t.WeekEndDate,te.CreatedBy,te.TimesheetEmployeeID,t.TimesheetID,COUNT(DISTINCT tj.JobID) Jobs ,tc.TimesheetCompanyID, tj.TimesheetJobID,u.UserID,COUNT(DISTINCT tpc.PhaseCodeID) PhaseCodes,
        GROUP_CONCAT((Select FULLName from Employee where EmployeeId in (Select EmployeeId from User Where UserID=te.ApprovedByUserID)), '$$') ApproverName , 
        COUNT(DISTINCT te.EmployeeID) Employees ,lts.StatusName  Status,IFNULL(e.FullName,'') SubmittedBy from Timesheet t
        LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
        LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
        LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
        LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
        LEFT JOIN LkpTimesheetStatus lts ON t.StatusID = lts.StatusID
        LEFT JOIN User u ON u.UserID =  coalesce(t.SubmittedBy,t.FinalizedByUserID)
        LEFT JOIN Employee e ON e.EmployeeID = u.EmployeeID
        WHERE t.CreatedBy = ${SubmitUserID} AND (t.WeekEndDate> date('now','-28 day') OR t.StatusID IN (1,2,5,3))
        GROUP BY  t.TimesheetID ORDER BY t.CreatedOn DESC`;
        query2 = `
        select t.CreatedOn,t.SubmittedOn, t.TimesheetID,u.EmployeeID,t.WeekEndDate,te.CreatedBy,te.TimesheetEmployeeID,t.TimesheetID,
        COUNT(DISTINCT tj.JobID) Jobs ,tc.TimesheetCompanyID, tj.TimesheetJobID,u.UserID,COUNT(DISTINCT tpc.PhaseCodeID) PhaseCodes,
        GROUP_CONCAT((Select FULLName from Employee where EmployeeId in (Select EmployeeId from User Where UserID=te.ApprovedByUserID)), '$$') ApproverName , 
                COUNT(DISTINCT te.EmployeeID) Employees ,lts.StatusName  Status,IFNULL(e.FullName,'') SubmittedBy from Timesheet t
                LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
                LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
                LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
                LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
                LEFT JOIN LkpTimesheetStatus lts ON t.StatusID = lts.StatusID
                LEFT JOIN User u ON u.UserID = t.SubmittedBy
                LEFT JOIN Employee e ON e.EmployeeID = u.EmployeeID
                 where t.TimesheetID in (
            select TimesheetID from TimesheetEmployee where EmployeeId in ( select EmployeeId from Employee where ApproverID= ( select ApproverID from Employee where EmployeeId= (select EmployeeId from User where UserID=${SubmitUserID}) ))
            ) and te.TimesheetEmployeeID in (
            select TimesheetEmployeeID from TimesheetEmployee where EmployeeId in ( select EmployeeId from Employee where ApproverID= ( select ApproverID from Employee where EmployeeId= (select EmployeeId from User where UserID=${SubmitUserID}) ))
            )
            AND (t.WeekEndDate> date('now','-28 day') OR t.StatusID IN (1,2,3,5))
                GROUP BY  t.TimesheetID ORDER BY t.CreatedOn DESC
        `;
        break;
    }
    db.transaction(txn => {
      txn.executeSql(
        type === 'Approve' ? query2 : query,
        [],
        async function (tx, res) {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            if (res.rows.item(0).SubmittedOn !== undefined) {
              let date = moment(res.rows.item(0).SubmittedOn).format(
                'MM/DD/yyyy h:mm A',
              );

              setSubmittedpdatetime(date);
            }
            let Approve_Array = [];

            var temp3 = [];

            txn.executeSql(
              `select ApprovedByUserID from TimesheetEmployee where TimesheetID=?`,
              [res.rows.item(i).TimesheetID],
              function (tx, res3) {
                let combine = [];
                for (let i = 0; i < res3.rows.length; i++) {
                  combine.push(res3.rows.item(i)['ApprovedByUserID']);
                }
                temp3.push(combine);
                // duplicate_removed=temp3.filter((appr,appr_id)=>{
                //   return
                // })

                // Approve_Array.push(temp3)
                //
                // setApprove_Arry(prev=>([...prev,temp3]))
              },
              error => {
                console.error('eeeeeeeeeeeeeeee', error);
              },
            );
            setTimeout(() => {
              if (type === 'Approve') {
                dispatch(Approve_Hold(temp3));
              } else {
                dispatch(Approve_Hold([]));
              }
              //
            }, 100);
            temp.push({...res.rows.item(i)});

            // type!=='Approve'? temp.push({...res.rows.item(i)}):null
          }

          if (type === 'Approve') {
            let b = [];
            let Wholearray = {};
            for (let i = 0; i < temp.length; i++) {
              let timesheet = temp[i];
              let weekEndDate = timesheet.WeekEndDate;
              if (!Wholearray[weekEndDate]) {
                Wholearray[weekEndDate] = [];
              }
              Wholearray[weekEndDate].push(timesheet);
            }
            for (let key in Wholearray) {
              b.push(Wholearray[key]);
            }

            setData(b);
          }
          // merge own created and own appro
          if (type !== 'Approve') {
            tx.executeSql(query2, [], function (tx, res) {
              let temp2 = [];
              for (let i = 0; i < res.rows.length; i++) {
                temp2.push(res.rows.item(i));
              }
              // let with_duplicate = [...temp, ...temp2];
              let with_duplicate = [...temp];
              let obj = {};
              let output = [];
              // {"0fead9fc-6933-473a-ae8a-27989ae42179":{...}}

              with_duplicate.forEach(te => {
                if (!obj[te['TimesheetID']]) {
                  obj[te['TimesheetID']] = te;
                }
              });

              for (const property in obj) {
                output.push(obj[property]);
              }
              //
              setData(output);
              //
            });
          }
          // setprocess_loader(false);
        },
      );
    });
  };
  const called = useSelector(state => state.SyncReducer.called);

  useEffect(() => {
    if (called) {
      GetData();
    }
  }, [called]);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {/* {process_loader ? <Processing /> : null} */}
        {isModalVisible ? (
          <Create_Weekend
            Company={Company}
            Job={Job}
            Phase={Phase}
            Employee={Employee}
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
        ) : null}
        {isCopyModalVisible ? (
          <Copy_pop
            navigation={navigation}
            data={Userdata}
            setCompanyNew={setCompany}
            setJobNew={setJob}
            setPhaseNew={setPhase}
            setEmployeeNew={setEmployee}
            setCopyModalVisible={setCopyModalVisible}
            setModalVisible={setModalVisible}
            GetData={GetData}
            setData={setData}
            Copied_Frm_Apprv={Copied_Frm_Apprv}
            setCopied_Frm_Apprv={setCopied_Frm_Apprv}
          />
        ) : null}
        <View style={styles.btnContainer}>
          <Pressable
            onPress={() => (Home_active === 0 ? GetData('Approve') : GetData())}
            style={styles.PlusbuttonStyle}>
            <Text style={styles.refreshbuttonTextStyle}>{'⟲'}</Text>
          </Pressable>
          <Pressable onPress={toggleModal} style={styles.PlusbuttonStyle}>
            <Text style={styles.PlusbuttonTextStyle}>{'+'}</Text>
          </Pressable>
        </View>
        <CustomSwitch
          setome_active={setome_active}
          Save={Save}
          setTimesheetData={setUserData}
          setCopyModalVisible={setCopyModalVisible}
          isCopyModalVisible={isCopyModalVisible}
          navigation={navigation}
          data={data}
          GetData={GetData}
          setData={setData}
          Submittedupdatetime={Submittedupdatetime}
          setCopied_Frm_Apprv={setCopied_Frm_Apprv}
        />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  PlusbuttonStyle: {
    width: 70,
    height: 70,
    alignSelf: 'flex-end',
    marginTop: 30,
    marginRight: 20,
    borderRadius: 50,
    backgroundColor: color.bluebgcolor,
    borderStyle: 'solid',
    justifyContent: 'center',
    marginBottom: 0,
    // backgroundColor:"red"
  },
  PlusbuttonStyle2: {
    width: 70,
    height: 70,
    marginTop: 30,
    marginRight: 40,
    alignSelf: 'flex-end',
    borderRadius: 50,
    backgroundColor: color.bluebgcolor,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  PlusbuttonTextStyle: {
    color: color.white,
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  refreshbuttonTextStyle: {
    justifyContent: 'center',
    marginTop: 40,
    color: color.white,
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    width: 65,
    height: 80,
  },
  btnContainer: {
    alignSelf: 'flex-end',
    marginTop: 30,
    marginRight: 40,
    justifyContent: 'center',
    marginBottom: 0,
    flexDirection: 'row',
  },
});
