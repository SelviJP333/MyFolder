import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {Row, Rows, Table, TableWrapper} from 'react-native-table-component';
import Scroll_Pagination from '../Components/Scroll_Pagination';
import FinalizePopup from '../Components/FinalizePopup';
import color from '../constants/color';
import db from '../constants/db';
import Processing from '../Components/Processing';
import {Total} from '../Components/Add_Hours';
// var db = openDatabase({ name: "Offline.sqlite" });
function FinalizeReport({props, route, navigation}) {
  const [tableHead, settableHead] = useState([
    'Employee',
    'Company',
    'Job',
    'Phase Code',
    'Reg',
    'Ot',
    'Dbl',
    'Submitted By',
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

  const [open_popup, setopen_popup] = useState(false);

  const [UserName, set_UserName] = useState([]);
  const [Self_Approve, set_Self_Approve] = useState(null);
  const [Self_Approve_TimesheetID, set_Self_Approve_TimesheetID] =
    useState(null);
  const [More_than_one, setMore_than_one] = useState([]);

  //Finalize 30/3
  const [FinalizeModalVisible, setFinalizeModalVisible] = useState(false);
  const [FinalizeModalData, setFinalizeModalData] = useState();
  const [process_loader, setprocess_loader] = useState(false);
  const [rowLimit, setrowLimit] = useState(10);
  const [Initialselect_row, setInitialselect_row] = useState(0);
  const [FilteredUserName, set_FilteredUserName] = useState([]);
  const [name, setname] = useState([]);
  const [select_row, setselect_row] = useState(10);
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
    // if (select_row===10) {
    //   set_FilteredUserName(UserName.slice(Initialselect_row, rowLimit));

    // }
    // else{
    set_FilteredUserName(UserName.slice(Initialselect_row, select_row));
    // setselect_row(rowLimit)
    // }
  }, [UserName, rowLimit, select_row, Initialselect_row]);
  const FinalizeReportModal = item => {
    setFinalizeModalVisible(true);
    setFinalizeModalData(item);
    // setDelClicked(item);
    // navigation.navigate('SendReport', {
    //   paramKeyTimesheetJobId: item.JobID,
    //   paramKeyTimesheetID: item.TimesheetID,
    //   paramKeyPhaseCodeID: item.PhaseCodeID,
    // });
  };

  let All = [];
  let pushing = [];
  useEffect(() => {
    setprocess_loader(true);
    db.transaction(txn => {
      txn.executeSql(
        `select e2.FullName AS submittedname,t.StatusID,t.SubmittedBy,t.FinalizedByUserID, t.TimesheetID,t.WeekEndDate,te.TimesheetEmployeeID, te.EmployeeId,e.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tpc.* ,lp.PhaseCodeName,lp.PhaseCode from Timesheet t
        LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
        LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
        LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
        LEFT JOIN TimesheetPhaseCode tpc ON tj.TimesheetJobID = tpc.TimesheetJobID
        LEFT JOIN Employee e ON e.EmployeeID = te.EmployeeID
        LEFT JOIN [User] u ON u.UserID = coalesce(t.SubmittedBy,t.FinalizedByUserID)
        LEFT JOIN Employee e2 ON e2.EmployeeID = u.EmployeeID
        LEFT JOIN LkpCompany lc ON lc.CompanyID = tc.CompanyID
        LEFT JOIN LkpJob lj ON lj.JobID = tj.JobID
        LEFT JOIN LkpPhaseCode lp ON lp.PhaseCodeID = tpc.PhaseCodeID
        where t.TimesheetID=?
        `,
        [route.params.paramKeyTimesheetID],

        async function (tx, res) {
          var temp = [];
          let SubmitUserID = await AsyncStorage.getItem('UserDetails2');
          let EmployeeID = JSON.parse(SubmitUserID)[0]['value'];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          // Check if logged user is present in timesheet
          temp.forEach(e_s => {
            if (e_s.EmployeeID === EmployeeID) {
              if (e_s.TimesheetEmployeeID !== null) {
                set_Self_Approve(e_s.TimesheetEmployeeID);
              }
            } else if (e_s.EmployeeID !== EmployeeID) {
              setMore_than_one(Prev => [...Prev, e_s.TimesheetEmployeeID]);
            }
          });

          // push name

          temp.forEach((e, i) => {
            let arrname = All.map(e => e[0][0]);
            arrname.indexOf(e.FullName) === -1
              ? All.push([[e.FullName, e.submittedname]])
              : null;
          });

          //
          // filter by name
          All.map((e, all_index) => {
            if (temp.filter(f => f.FullName === e[0][0])) {
              let filtered = temp.filter(f => f.FullName === e[0][0]);

              let f = filtered.forEach((ff, i) => {
                if (pushing.length === 0) {
                  pushing.push([
                    [e[0][0], e[0][1]],
                    [
                      '',
                      ff.CompanyName,
                      ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                      ff.PhaseCode !== null
                        ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                        : '-',
                      Total(ff, 'reg'),
                      Total(ff, 'ot'),
                      Total(ff, 'dbl'),
                      '',
                    ],
                  ]);
                } else if (all_index !== 0) {
                  if (pushing[all_index] === undefined) {
                    pushing[all_index] = [
                      [e[0][0], e[0][1]],
                      [
                        '',
                        ff.CompanyName,
                        ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                        ff.PhaseCode !== null
                          ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                          : '-',
                        Total(ff, 'reg'),
                        Total(ff, 'ot'),
                        Total(ff, 'dbl'),
                        '',
                      ],
                    ];
                  } else {
                    pushing[all_index].push([
                      '',
                      ff.CompanyName,
                      ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                      ff.PhaseCode !== null
                        ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                        : '-',
                      Total(ff, 'reg'),
                      Total(ff, 'ot'),
                      Total(ff, 'dbl'),
                      '',
                    ]);
                  }
                } else {
                  pushing[all_index].push([
                    '',
                    ff.CompanyName,
                    ff.JobName !== null ? `${ff.JobNo}-${ff.JobName}` : '-',
                    ff.PhaseCode !== null
                      ? `${ff.PhaseCode}-${ff.PhaseCodeName}`
                      : '-',
                    Total(ff, 'reg'),
                    Total(ff, 'ot'),
                    Total(ff, 'dbl'),
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

    setTimeout(() => {
      setprocess_loader(false);
    }, 800);
  }, []);

  //
  //

  let a = [
    // user1
    [
      ['user1'],
      [
        ['', 'company1', 'job1', 'phase1', '4', '5', '5', ''],

        ['', 'company2', 'job2', 'phase2', '4', '5', '5', ''],
      ],
    ],

    // user2
    [
      ['user2'],
      [
        ['', 'company3', 'job3', 'phase3', '4', '5', '5', ''],

        ['', 'company4', 'job4', 'phase4', '4', '5', '5', ''],
      ],
    ],
    // user3
    [
      ['user2'],
      [
        ['', 'company3', 'job3', 'phase3', '4', '5', '5', ''],

        ['', 'company4', 'job4', 'phase4', '4', '5', '5', ''],
        ['', 'company4', 'job4', 'phase4', '4', '5', '5', ''],
        [
          '',
          'company4uasydgduayvbzjchsudvyuyg',
          'job4',
          'phase4',
          '4',
          '5',
          '5',
          '',
        ],
      ],
    ],
  ];

  const GetUserData = async () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT User.Username ,  LkpPhaseCode.PhaseCodeID,LkpPhaseCode.PhaseCodeName,LkpPhaseCode.JobID,LkpJob.JobName,LkpJob.CompanyID ,LkpCompany.CompanyName
      FROM TimesheetPhaseCode
      INNER JOIN User
      ON TimesheetPhaseCode.CreatedBy = User.EmployeeID
      inner join LkpPhaseCode on LkpPhaseCode.PhaseCodeID=TimesheetPhaseCode.PhaseCodeID
      inner join LkpJob on LkpJob.JobID=LkpPhaseCode.JobID
      inner join LkpCompany on LkpCompany.CompanyID=LkpJob.CompanyID
        where TimesheetPhaseCodeID=? `,
        [route.params.paramKeyTimesheetPhaseCodeID],
        async function (tx, res) {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          // setTableData(Object.values(temp[0]))
          let item = res.rows.item(0);

          setMonday(
            item.MonRegularHours +
              '/' +
              item.MonOvertimeHours +
              '/' +
              item.MonDoubleTimeHours,
          );
          setTuesday(
            item.TueRegularHours +
              '/' +
              item.TueOvertimeHours +
              '/' +
              item.TueDoubleTimeHours,
          );
          setWednesday(
            item.WedRegularHours +
              '/' +
              item.WedOvertimeHours +
              '/' +
              item.WedDoubleTimeHours,
          );
          setThursday(
            item.ThuRegularHours +
              '/' +
              item.ThuOvertimeHours +
              '/' +
              item.ThuDoubleTimeHours,
          );
          setFriday(
            item.FriRegularHours +
              '/' +
              item.FriOvertimeHours +
              '/' +
              item.FriDoubleTimeHours,
          );
          setSaturday(
            item.SatRegularHours +
              '/' +
              item.SatOvertimeHours +
              '/' +
              item.SatDoubleTimeHours,
          );
          setSunday(
            item.SunRegularHours +
              '/' +
              item.SunOvertimeHours +
              '/' +
              item.SunDoubleTimeHours,
          );

          // setUserData((prev) => [...prev,res.rows.item(0)]);
          setdefaultUsername(res.rows.item(0).CreatedBy);
          setCompanyID(
            res.rows.item(0).CompanyID + ' - ' + res.rows.item(0).CompanyName,
          );
          setJobID(res.rows.item(0).JobID + ' - ' + res.rows.item(0).JobName);
          setPhaseID(
            res.rows.item(0).PhaseCodeID +
              ' - ' +
              res.rows.item(0).PhaseCodeName,
          );
        },
      );
    });
  };

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

  return (
    <>
      <View style={styles.container}>
        <Scroll_Pagination
          open_popup={open_popup}
          setopen_popup={setopen_popup}
          setselect_row={setselect_row}
          select_row={select_row}
          setrowLimit={setrowLimit}
          setInitialselect_row={setInitialselect_row}
        />
        {process_loader ? <Processing /> : null}
        <View style={styles.headcontainer}>
          <Text style={styles.headertitle}>
            Submitting timesheets for week ending:{' '}
            {route.params.paramkeyWeekEndDate}
          </Text>
          <Text></Text>
          <Text style={styles.subtitle}>
            Please review all details below. Click on the edit icon for any row
            to make changes{' '}
          </Text>
          <Text></Text>
        </View>

        <Table>
          <Row
            data={tableHead}
            flexArr={[0.6, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6]}
            style={styles.head}
            textStyle={styles.text}
          />
          <TouchableOpacity onPress={() => Edit(route.params.item)}>
            <Image
              source={require('../Image/icon_edit.png')}
              style={{
                width: 100,
                height: 100,
                top: 10,
                left: 20,
              }}
            />
          </TouchableOpacity>

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
                <TableWrapper
                  style={{
                    borderWidth: 0,
                    backgroundColor: index % 2 != 0 ? '#E0E0E0' : 'transaprent',
                  }}
                  //borderStyle={{borderWidth: 1, borderColor: 'black'}}
                >
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Rows
                      data={[[e[0][0], '', '', '', reg, ot, Dbl, e[0][1]]]}
                      flexArr={[0.6, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6]}
                      style={styles.row}
                      textStyle={styles.Datatext}
                    />
                  </View>

                  {e.map((ee, index2) => {
                    return index2 !== 0 ? (
                      <>
                        <Rows
                          data={[ee]}
                          flexArr={[0.7, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6]}
                          style={styles.row}
                          textStyle={styles.Datatext}
                        />
                      </>
                    ) : (
                      <Rows data={[[]]} />
                    );
                  })}
                </TableWrapper>
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
              marginTop: '1%',
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
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {' '}
                  {rowLimit}
                </Text>
                <View
                  style={{
                    height: '100%',
                    width: '35%',
                    //backgroundColor: '#636163',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{height: 15, width: 20}}
                    source={require('../Image/dropdown.png')}
                  />
                </View>
              </Pressable>
              {/* </Pressable> */}

              <Text
                style={{fontSize: 18, color: color.gray, fontWeight: '500'}}>
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
          <TouchableOpacity
            style={{
              width: 200,
              height: '8%',
              backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              left: '50%',
              backgroundColor: '#002D62',
              transform: [{translateX: -200}],
              bottom: '9%',
            }}
            onPress={() => FinalizeReportModal(route.params.item)}>
            <Text style={{color: 'white', fontSize: 25}}>Finalize</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 200,
              height: '8%',
              backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              left: '70%',
              bottom: '17%',

              backgroundColor: '#002D62',
              transform: [{translateX: -200}],
            }}
            onPress={() => navigation.navigate('My TimeSheet')}>
            <Text style={{color: 'white', fontSize: 25}}>Cancel</Text>
          </TouchableOpacity>
        </Table>
      </View>
      {FinalizeModalVisible ? (
        <FinalizePopup
          setprocess_loader={setprocess_loader}
          navigation={navigation}
          setFinalizeModalVisible={setFinalizeModalVisible}
          FinalizeModalData={FinalizeModalData}
          Self_Approve={Self_Approve}
          More_than_one={More_than_one}
        />
      ) : null}
    </>
  );
}

export default FinalizeReport;
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
