import React, {useEffect, useState} from 'react';
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
import color from '../constants/color';
import db from '../constants/db';
import CheckBox from '@react-native-community/checkbox';
import Processing from '../Components/Processing';

// var db = openDatabase({ name: "Offline.sqlite" });
function ApproveTimesheet({props, route, navigation}) {
  const [tableHead, settableHead] = useState([
    'Employee',
    'Company',
    'Job',
    'Phase Code',
    'Reg',
    'Ot',
    'Dbl',
    'Submitted By',
    'Check',
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
  const [select_row, setselect_row] = useState(10);
  const [rowLimit, setrowLimit] = useState(10);
  const [Initialelect_row, setInitialelect_row] = useState(1);
  const [process_loader, setprocess_loader] = useState(false);

  const [UserName, set_UserName] = useState([]);
  const [FilteredUserName, set_FilteredUserName] = useState([]);

  // const[a,b]=useState([])
 
  // useEffect(()=>{
  //   set_FilteredUserName(UserName.slice(0,rowLimit))
  
  // },[rowLimit])
  useEffect(()=>{
    set_FilteredUserName(UserName.slice(0,rowLimit))
  
  },[UserName,rowLimit])

  //
  let users = [
    '1321a794-8672-432a-b48e-0a9d8f9a2806',
    'd215b69d-3914-4aa2-9e13-3e75920a7809',
  ];
  let All = [];
  let pushing = [];
  useEffect(() => {
    setprocess_loader(true)

    db.transaction(txn => {
      txn.executeSql(
        `select Ee.FullName,lc.CompanyName,lj.JobName,lp.PhaseCodeName,* from Timesheet ts
        left join TimesheetEmployee te on ts.TimesheetID=te.TimesheetID
        left join User u on u.UserID=te.EmployeeID
        left join TimesheetCompany tc on tc.TimesheetEmployeeID=te.TimesheetEmployeeID
        left join TimesheetJob tj on tj.TimesheetCompanyID =tc.TimesheetCompanyID
        left join TimesheetPhaseCode tp on tp.TimesheetJobID=tj.TimesheetJobID
        left join LkpPhaseCode lp on lp.PhaseCodeID = tp.PhaseCodeID
        left join LkpJob lj on lj.JobID=tj.JobID
        left join LkpCompany lc on lc.CompanyID=Tc.CompanyID
        left join Employee Ee on Ee.EmployeeID=te.EmployeeID
        where ts.TimesheetID= ? order by Ee.fullname asc`,
        [route.params.paramKeyTimesheetID],

        async function (tx, res) {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          // let fil=temp.filter(e=>e.MonDoubleTimeHours!==null)

          // push name
          temp.forEach((e, i) => {
            if (All.length !== 0) {
              All.flat(2).indexOf(e.FullName) === -1
                ? All.push([
                    [e.FullName],
                    [false],
                    [e.TimesheetID],
                    [e.TimesheetEmployeeID],
                  ])
                : null;
            } else {
              All.push([
                [e.FullName],
                [false],
                [e.TimesheetID],
                [e.TimesheetEmployeeID],
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
                    [e[0][0], e[1][0], e[2][0], e[3][0]],
                    [
                      '',
                      ff.CompanyName,
                      ff.JobName ?? '-',
                      ff.PhaseCodeName ?? '-',
                      ff.Total_Reg === 0 ? '-' : ff.Total_Reg,
                      ff.Total_Ot === 0 ? '-' : ff.Total_Ot,
                      ff.Total_Dbl === 0 ? '-' : ff.Total_Dbl,
                      '',
                      '',
                    ],
                  ]);
                } else if (all_index !== 0) {
                  if (pushing[all_index] === undefined) {
                    pushing[all_index] = [
                      [e[0][0], e[1][0], e[2][0], e[3][0]],
                      [
                        '',
                        ff.CompanyName,
                        ff.JobName ?? '-',
                        ff.PhaseCodeName ?? '-',
                        ff.Total_Reg === 0 ? '-' : ff.Total_Reg,
                        ff.Total_Ot === 0 ? '-' : ff.Total_Ot,
                        ff.Total_Dbl === 0 ? '-' : ff.Total_Dbl,
                        '',
                        '',
                      ],
                    ];
                  } else {
                    pushing[all_index].push([
                      '',
                      ff.CompanyName,
                      ff.JobName ?? '-',
                      ff.PhaseCodeName ?? '-',
                      ff.Total_Reg === 0 ? '-' : ff.Total_Reg,
                      ff.Total_Ot === 0 ? '-' : ff.Total_Ot,
                      ff.Total_Dbl === 0 ? '-' : ff.Total_Dbl,
                      '',
                      '',
                    ]);
                  }
                } else {
                  pushing[all_index].push([
                    '',
                    ff.CompanyName,
                    ff.JobName ?? '-',
                    ff.PhaseCodeName ?? '-',
                    ff.Total_Reg === 0 ? '-' : ff.Total_Reg,
                    ff.Total_Ot === 0 ? '-' : ff.Total_Ot,
                    ff.Total_Dbl === 0 ? '-' : ff.Total_Dbl,
                    '',
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
    set_FilteredUserName(UserName.slice(0,rowLimit))
    setTimeout(() => {
      setprocess_loader(false)

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
        where TimesheetPhaseCodeID=?`,
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

  // const img_url = [
  //   require('../Image/arrowleft.png'),
  //   require('../Image/backward.png'),
  //   require('../Image/forward.png'),
  //   require('../Image/arrowright.png'),
  // ];

  const Arrows = type => {
    if (type === 'arrowleft') {
      setInitialelect_row(0);
      setselect_row(10);
    }

    if (type === 'backward') {
      if (Initialelect_row - 10 > 0) {
        if (select_row === FilteredUserName.length) {
          setInitialelect_row(FilteredUserName.length - 20);
          setselect_row(FilteredUserName.length - 10);
        } else {
          setselect_row(Initialelect_row);

          setInitialelect_row(Initialelect_row - 10);
        }
      } else {
        setInitialelect_row(0);
        setselect_row(10);
      }
    }

    if (type === 'forward') {
      if (select_row + 10 < FilteredUserName.length) {
        setInitialelect_row(Initialelect_row + 10);
        setselect_row(select_row + 10);
      } else if (select_row !== FilteredUserName.length) {
        // 
        setInitialelect_row(select_row);
        setselect_row(FilteredUserName.length);
      }
    }

    if (type === 'arrowright') {
      setInitialelect_row(FilteredUserName.length - 10);
      setselect_row(FilteredUserName.length);
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

  const CheckBoxing = (i, status) => {
    return (
      <View style={{display: 'flex', alignItems: 'center'}}>
        <CheckBox
          value={status}
          onValueChange={() => {
            let modified = UserName.map((e, index) => {
              if (index === i) {
                const splite = ee => {
                  return ee.splice(1);
                };
                return [[e[0][0], !status], ...splite(e)];
              } else {
                return e;
              }
            });
            set_UserName(modified);
          }}
        />
      </View>
    );
  };

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
    <View style={styles.container}>
      <Scroll_Pagination
        open_popup={open_popup}
        setopen_popup={setopen_popup}
        setselect_row={setselect_row}
        select_row={select_row}
        setrowLimit={setrowLimit}
        setInitialelect_row={setInitialelect_row}
      />
      {process_loader ? <Processing /> : null}

      <View style={{width: '25%'}}>
        <TouchableOpacity onPress={() => navigation.navigate('My TimeSheet')}>
          <Text style={styles.backbtn}>&#60; Back to all Timesheets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headcontainer}>
        <Text style={styles.headertitle}>
          Approving timesheets for week ending :{' '}
          {route.params.paramkeyWeekEndDate}
        </Text>
        <Text></Text>
        <Text style={styles.subtitle}>
          Please review all details below.Click on the any row to make changes
          to that timesheets.{' '}
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

          {FilteredUserName.slice(Initialelect_row, select_row).map((e, index) => {
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
                    data={[
                      [
                        e[0][0],
                        '',
                        '',
                        '',
                        reg,
                        ot,
                        Dbl,
                        '',
                        CheckBoxing(index, e[0][1]),
                      ],
                    ]}
                    flexArr={[0.6, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6, 0.2]}
                    style={styles.row}
                    textStyle={styles.Datatext}
                  />
                </View>

                {e.map((ee, index2) => {
                  return index2 !== 0 ? (
                    <>
                      <Rows
                        data={[ee]}
                        flexArr={[0.7, 1.0, 1.0, 0.9, 0.2, 0.2, 0.2, 0.6, 0.2]}
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
              {Initialelect_row} - {rowLimit} of {UserName.length}{' '}
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
                  height: '70%',
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
        <TouchableOpacity
          style={{
            width: 200,
            height: '10%',
            backgroundColor: 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            left: '57%',
            backgroundColor: '#002D62',
            transform: [{translateX: -200}],
            bottom:"7%",

          }}>
          <Text style={{color: 'white', fontSize: 25}}>Approve</Text>
        </TouchableOpacity>
      </Table>
    </View>
  );
}

export default ApproveTimesheet;
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#FBFBF9'},
  head: {height: 60, backgroundColor: '#B6B6B4', color: '#fff'},
  wrapper: {
    flexDirection: 'column',
    // height: 'auto',
    height: '58%',
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
  backbtn: {
    fontSize: 25,
    color: '#6ca4d6',
    fontWeight: '500',
  },
});

//  const pageCount = allVentures? Math.ceil(allVentures.length/pageSize) :0;const pages = _.range(1, pageCount+1)

// const pagination =(pageNo)=>{
//   setcurrentPage(pageNo);
//   const startIndex = (pageNo - 1) * pageSize;  const paginatedPost = _(allVentures).slice(startIndex).take(pageSize).value();
//    setpaginatedPosts(paginatedPost)}
