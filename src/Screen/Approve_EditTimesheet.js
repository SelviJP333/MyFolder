/// Edit timesheet screen

/*
Created by : Ps,Balaji
last Modified : 28/03/2023,
Modified by : Balaji

Last Updatd By : Ps At: 19.04.2023

*/

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Cell,
  Row,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-table-component';
import {useDispatch, useSelector} from 'react-redux';
import db from '../constants/db';
import Delete_Company_Pop from '../Components/Delete_Comapany_pop';
import Delete_Job_Pop from '../Components/Delete_Job_pop';
import Delete_Phase_Pop from '../Components/Delete_Phase_pop';
import Processing from '../Components/Processing';
import Timesheet_popup from '../Components/timesheet_popup';
import Scroll_modal from '../Components/scroll_modal';
import Add from '../Image/Icon_New.png';
import Remove from '../Image/Icon_Remove.png';
import Copy from '../Image/Icon_Copy.png';
import WarningPopup from '../Components/WarningPopup';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import {
  AddData,
  RemoveData,
  Temp_Add,
  Temp_Remove,
  delete1,
  delete2,
  Add_Date,
  Remove_Date,
} from '../redux/actions/Action';
import AddCompany from './AddCompany';
import AddEmployee from './AddEmployee';
import AddJob from './AddJob';
import AddPhase from './AddPhase';
// import {a} from './dummy.js'
import {useFocusEffect} from '@react-navigation/native';
import color from '../constants/color';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DisplayEmployee from './DisplayEmployee';
import RemoveEmployee from '../Components/RemoveEmployee';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TimeSheet_Copypop from '../Components/TimeSheet_Copypop';
import {Total} from '../Components/Add_Hours';

let selectcom;
let selectjob;
let company_id;
let selectedjob_id;
let selectphaseid;
let deletephaseid;
let deleteCompanyid;
const Approve_EditTimeSheetScreen = ({route, navigation}) => {
  const [openmodalEmployeeVisible, setopenmodalEmployeeVisible] =
    useState(false);
  const [selectedJob, SetSelectedJob] = useState('');
  const [SelectedPhase, SetSelectedPhase] = useState([]);
  const [modalComapanyVisible, setmodalComapanyVisible] = useState(false);
  const [modalEmployeeVisible, setmodalEmployeeVisible] = useState(false);
  const [modalJobVisible, setmodalJobVisible] = useState(false);
  const [modalPhaseVisible, setmodalPhaseVisible] = useState(false);
  const [LoginUsername, setLoginUsername] = useState(0);
  const [job_index, setjob_index] = useState(null);
  const [company_index, setcompany_index] = useState(null);
  const [phasejob_index, setphasejob_index] = useState(null);
  const [data, setData] = useState(null);
  const [selectedphasename, setselectedphasename] = useState(null);
  const [selectedcompanyname, setselectedcompanyname] = useState(null);
  const [alreadyExist, setalreadyExist] = useState([]);
  const [Employee, setEmployee] = useState([]);
  const [deletejob_modal, setdeletejob_modal] = useState(false);
  const [deleteComapany_modal, setdeleteCompany_modal] = useState(false);
  const [deleteEmployee_modal, setdeleteEmployee_modal] = useState(false);
  const [Usernamelist, setUsernamelist] = useState([]);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [deletePhase_modal, setdeletePhase_modal] = useState(false);
  const [selected_data, setselected_data] = useState([]);
  const [hoursmodalVisible, sethoursmodalVisible] = useState(false);
  const [indexvalue, setindexvalue] = useState(0);
  const [empty, setempty] = useState([]);
  const [process_loader, setprocess_loader] = useState(false);
  const [popup_twentyfour, setpopup_twentyfour] = useState(false);
  const [popup_entry, setpopup_entry] = useState(false);
  const [weeekenddate, Setweekenddate] = useState([]);
  const [selected_Employee_Id, Setselected_Employee_Id] = useState([]);
  const [EarningsCode, SetEarningsCode] = useState('');
  const [VPEmployeeID, SetVPEmployeeID] = useState('');
  const [companyIndex, setcompanyIndex] = useState(null);
  const [SelectedJobId, setSelectedJobId] = useState('');
  const [UserID, setUserID] = useState('');
  const [SelectedUserRole, SetSelectedUserRole] = useState('');
  const [SelectedTimesheetPhaseCodeID, SetSelectedTimesheetPhaseCodeID] =
    useState('');
  const [timeindex, settimeindex] = useState(null);
  const [SelectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [TimesheetStatus, setTimesheetStatus] = useState('');
  const [
    HasEstimatedProjectCompletionDate,
    SetHasEstimatedProjectCompletionDate,
  ] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deletetime, setdeletetime] = useState(null);
  const [EstimatedCom, setEstimatedCom] = useState(null);
  const [EstimatedJob, setEstimatedJob] = useState(null);
  const [Rod, setRod] = useState(0);
  const [Check, setCheck] = useState(false);
  const [Checkk, setCheckk] = useState(false);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);
  const [GetEmpId, setGetEmpId] = useState([]);
  const [DispGetEmp, setDispGetEmp] = useState('');
  const [SelectedId, setSelectedId] = useState([]);
  const [copyjob, setcopyjob] = useState([]);
  const [Deviceid, setDeviceid] = useState('');
  const [FromUserDetails, SetFromUserDetails] = useState([]);
  const [copyphase, setcopyphase] = useState([]);
  const GetWholeData = async newArray => {
    db.transaction(tx => {
      tx.executeSql(
        `select ts.StatusName,tc.TimesheetCompanyID, u.EmployeeId,u.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tp.* ,tj.EstProjectCompletionDate,lp.PhaseCodeName from Timesheet t
        left join TimesheetEmployee te on t.TimesheetID=te.TimesheetID
        left join TimesheetCompany tc on te.TimesheetEmployeeID = tc.TimesheetEmployeeID
        left join TimesheetJob tj on tc.TimesheetCompanyID=tj.TimesheetCompanyID
        left join TimesheetPhaseCode tp on tj.TimesheetJobID=tp.TimesheetJobID
        left join Employee u on u.EmployeeId=te.EmployeeID
        left join LkpCompany lc on lc.CompanyID=tc.CompanyID
        left join LkpJob lj on lj.JobID=tj.JobID
        left join LkpPhaseCode lp on lp.PhaseCodeID=tp.PhaseCodeID
        left join LkpTimesheetStatus ts on t.StatusId = ts.StatusId
        where t.TimesheetID=? and te.TimesheetEmployeeID=?`,
        [route.params.paramKeyTimesheetID, route.params.paramKeyEmployeeID],
        async (tx, res) => {
          var temp = [];
          let CompanyExist = [];
          for (let i = 0; i < res.rows.length; i++) {
            setTimesheetStatus(res.rows.item(0).StatusName);
            //
            var JobID = generateGuidQuicklyJob();
            var PhaseCodID = generateGuidQuicklyPhase();
            var CompanyID = generateGuidQuicklyCompany();
            if (res.rows.item(i).CompanyName != null) {
              res.rows.item(i).CompanyName =
                res.rows.item(i).CompanyID +
                '*#^*' +
                res.rows.item(i).CompanyName +
                '' +
                '+' +
                CompanyID;
              let company = (
                res.rows.item(i).CompanyName +
                '' +
                '+' +
                CompanyID
              ).split('+')[0];
              CompanyExist.indexOf(company.split('*#^*')[1]) === -1
                ? CompanyExist.push(company.split('*#^*')[1])
                : null;
              // CompanyExist.indexOf(res.rows.item(i).CompanyName.split('+')[0]);
              // CompanyExist.push(...CompanyExist, ...[accumulator.toString()]);
            }
            setCJP(prev => ({
              company: CompanyExist,
              job: [],
              phase: [],
            }));
            if (res.rows.item(i).JobName != null) {
              res.rows.item(i).JobName =
                res.rows.item(i).JobID +
                '*#^*' +
                res.rows.item(i).JobNo +
                '*#^*' +
                res.rows.item(i).JobName +
                '' +
                '+' +
                JobID;
            }
            if (res.rows.item(i).PhaseCodeName != null) {
              res.rows.item(i).PhaseCodeName =
                res.rows.item(i).PhaseCodeID +
                '*#^*' +
                res.rows.item(i).PhaseCodeName +
                '' +
                '+' +
                PhaseCodID;
            }
            temp.push(res.rows.item(i));
          }
          //
          setWholeData(temp);
          for (let j = 0; j < newArray.length; j++) {
            // company push
            let result = [];
            // pushing
            temp
              .filter(item => item.FullName == newArray[j].key)
              .reduce((accumulator, currentValue) => {
                const check = (acc, cur) => {
                  let mapped = acc.flat(3).map(ee => {
                    return ee.split('+')[0];
                  });
                  let result = mapped.includes(cur);
                  return result;
                };
                //
                // insert if no elements
                if (accumulator.length === 0) {
                  currentValue.CompanyName
                    ? accumulator.push([[currentValue.CompanyName]])
                    : null;
                  //  acc=[['99-Test Company #99'],['99-Test Company #99']]
                } else if (
                  !check(accumulator, currentValue.CompanyName.split('+')[0])
                ) {
                  // insert if there s no already exist
                  accumulator.push([[currentValue.CompanyName]]);
                }
                // CompanyExist.push((result.toString()).split('+')[0]);
                return accumulator;
              }, result);
            setSelectedCompany(
              ...SelectedCompany,
              ...result.toString().split('+')[0],
            );
            // setSelectedCompany(prev => [...prev, ...[result.toString()]]);
            // job push
            let result2 =
              result.length !== 0
                ? result.map(e => {
                    let job_push = [];
                    let filtered_length;
                    let dd = [];
                    // if only one company
                    if (e) {
                      let final = temp.filter(job => {
                        if (job.CompanyName) {
                          return (
                            e[0][0].split('+')[0] ===
                              job.CompanyName.split('+')[0] &&
                            job.FullName === newArray[j].key
                          );
                        }
                      });
                      filtered_length = final.length;
                      dd = final;
                    }
                    if (filtered_length !== 0) {
                      // let s = temp.filter(job => e[0][0].split('+')[0] === job.CompanyName.split('+')[0] && job.FullName === newArray[j].key)
                      dd.forEach((ee, i) => {
                        //
                        const check = (acc, cur) => {
                          // job_push.flat().includes(ee.JobName)
                          let mapped = acc.flat().map(ee => {
                            return ee.split('+')[0];
                          });
                          let result = mapped.includes(cur);
                          return result;
                        };
                        if (ee.JobName !== null) {
                          if (!check(job_push, ee.JobName.split('+')[0])) {
                            if (ee.JobName !== null) {
                              job_push.push([
                                ee.JobName.split('+')[0] +
                                  `+` +
                                  ee.CompanyName.split('+')[1] +
                                  `+` +
                                  ee.JobName.split('+')[1] +
                                  `*#^*` +
                                  ee.EstProjectCompletionDate +
                                  `*#^*`,
                                //                                  ee.JobName,
                              ]);
                            } else {
                              // job_push=null
                            }
                          }
                        }
                      });
                      return job_push.length === 0
                        ? [[e[0][0]]]
                        : [[e[0][0]], job_push];
                    }
                    return [[e[0][0]]];
                  })
                : [];
            let total_RegularTime;
            let total_DBL;
            let total_Overtime;
            // result2.map(e=>{
            //
            // })
            // phase push
            let result3 = result2.map(e => {
              if (e[1] !== undefined) {
                let modified = e[1].map(ee => {
                  let phase_push = [];
                  if (ee[0]) {
                    // checking job is or not in temp
                    let phasefil = temp.filter(job => {
                      if (job.JobName) {
                        return (
                          ee[0].split('+')[0] === job.JobName.split('+')[0] &&
                          job.FullName == newArray[j].key
                        );
                      }
                    });
                    if (phasefil.length != 0) {
                      phasefil.forEach(item => {
                        if (item.PhaseCodeName !== null) {
                          total_RegularTime = item.Total_Reg;
                          total_DBL = item.Total_Dbl;
                          total_Overtime = item.Total_Ot;
                          phase_push.push([
                            item.PhaseCodeName.split('+')[0] +
                              `+` +
                              item.CompanyName.split(`+`)[1] +
                              `+` +
                              item.JobName.split(`+`)[1] +
                              `+` +
                              item.PhaseCodeName.split(`+`)[1],
                            `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
                            `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
                            `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
                            `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
                            `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
                            `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
                            `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
                            `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
                            `${Total(item, 'reg')}/${Total(item, 'ot')}/${Total(
                              item,
                              'dbl',
                            )}`,
                            `${
                              item.Comment == 'null' || item.Comment == null
                                ? ''
                                : item.Comment
                            }`,
                          ]);
                        }
                      });
                      return phase_push.length === 0
                        ? [ee[0]]
                        : [ee[0], phase_push];
                    }
                  }
                  return ee;
                });
                return [[e[0][0]], modified];
              }
              return e;
            });
            // push datas into tabledata
            if (j === 0) {
              setTableData(result3);
              let reg1 = 0;
              let ovt1 = 0;
              let dbl1 = 0;
              // 2
              let reg2 = 0;
              let ovt2 = 0;
              let dbl2 = 0;
              // 3
              let reg3 = 0;
              let ovt3 = 0;
              let dbl3 = 0;
              // 4
              let reg4 = 0;
              let ovt4 = 0;
              let dbl4 = 0;
              // 5
              let reg5 = 0;
              let ovt5 = 0;
              let dbl5 = 0;
              // 6
              let reg6 = 0;
              let ovt6 = 0;
              let dbl6 = 0;
              // 7
              let reg7 = 0;
              let ovt7 = 0;
              let dbl7 = 0;
              let b = result3.forEach(eee => {
                if (eee[1]) {
                  eee[1].forEach((d, j) => {
                    if (d[1]) {
                      d[1].forEach((a, k) => {
                        if (a) {
                          for (let i = 0; i <= a.length; i++) {
                            if (i === 0) {
                            } else {
                              if (i == 1) {
                                reg1 += parseFloat(a[i].split('/')[0]);
                                ovt1 += parseFloat(a[i].split('/')[1]);
                                dbl1 += parseFloat(a[i].split('/')[2]);
                              }
                              if (i === 2) {
                                reg2 += parseFloat(a[i].split('/')[0]);
                                ovt2 += parseFloat(a[i].split('/')[1]);
                                dbl2 += parseFloat(a[i].split('/')[2]);
                              }
                            }
                            if (i === 3) {
                              reg3 += parseFloat(a[i].split('/')[0]);
                              ovt3 += parseFloat(a[i].split('/')[1]);
                              dbl3 += parseFloat(a[i].split('/')[2]);
                            }
                            if (i === 4) {
                              reg4 += parseFloat(a[i].split('/')[0]);
                              ovt4 += parseFloat(a[i].split('/')[1]);
                              dbl4 += parseFloat(a[i].split('/')[2]);
                            }
                            if (i === 5) {
                              reg5 += parseFloat(a[i].split('/')[0]);
                              ovt5 += parseFloat(a[i].split('/')[1]);
                              dbl5 += parseFloat(a[i].split('/')[2]);
                            }
                            if (i === 6) {
                              reg6 += parseFloat(a[i].split('/')[0]);
                              ovt6 += parseFloat(a[i].split('/')[1]);
                              dbl6 += parseFloat(a[i].split('/')[2]);
                            }
                            if (i === 7) {
                              reg7 += parseFloat(a[i].split('/')[0]);
                              ovt7 += parseFloat(a[i].split('/')[1]);
                              dbl7 += parseFloat(a[i].split('/')[2]);
                            }
                          }
                        }
                      });
                    }
                  });
                }
              });
              settotalgroup1({
                reg1: reg1,
                ovt1: ovt1,
                dbl1: dbl1,
              });
              settotalgroup2({
                reg2: reg2,
                ovt2: ovt2,
                dbl2: dbl2,
              });
              settotalgroup3({
                reg3: reg3,
                ovt3: ovt3,
                dbl3: dbl3,
              });
              settotalgroup4({
                reg4: reg4,
                ovt4: ovt4,
                dbl4: dbl4,
              });
              settotalgroup5({
                reg5: reg5,
                ovt5: ovt5,
                dbl5: dbl5,
              });
              settotalgroup6({
                reg6: reg6,
                ovt6: ovt6,
                dbl6: dbl6,
              });
              settotalgroup7({
                reg7: reg7,
                ovt7: ovt7,
                dbl7: dbl7,
              });
            }
            // calculating whole
            let reg_time = 0;
            let ovt_time = 0;
            let dbl_time = 0;
            result3.map((ee, i) => {
              if (ee[1]) {
                ee[1].map((d, j) => {
                  if (d[1]) {
                    d[1].map((f, k) => {
                      if (f) {
                        f.map((g, h) => {
                          if (h === 0) {
                            // Ignore first position
                          } else if (h === 8 || h === 9) {
                          } else {
                            reg_time += parseFloat(g.split('/')[0]);
                            ovt_time += parseFloat(g.split('/')[1]);
                            dbl_time += parseFloat(g.split('/')[2]);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
            let obj = {};
            obj[newArray[j].key] = result3;
            obj['total_RegularTime'] = reg_time ? reg_time : 0;
            obj['total_DBL'] = dbl_time ? dbl_time : 0;
            obj['total_Overtime'] = ovt_time ? ovt_time : 0;
            dispatch(AddData(obj));
            // push All total
            if (j === 0) {
              settotal_RegularTime(reg_time ? reg_time : 0);
              settotal_Overtime(ovt_time ? ovt_time : 0);
              settotal_DBL(dbl_time ? dbl_time : 0);
            } else {
            }
            user_lists.push(newArray[j].key);
            userid.push(newArray[j].value);
          }
        },
      );
    });
    setUsernamelist(user_lists);
    setUserID(userid);
    get_Empl('Edit first click', null, user_lists);
    setPageLoading(false);
  };
  useEffect(() => {
    const getUsers = async () => {
      let Deviceid_data = JSON.parse(await AsyncStorage.getItem('device_id'));
      setDeviceid(Deviceid_data);
    };
    getUsers(); // run it, run it

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);
  const handleConfirm = async date => {
    let date_modified = new Date(date).toLocaleDateString('en-US');

    let splited_value =
      TableData[selected_data[0]][1][selected_data[1]][0].split('*#^*');
    splited_value[3] = `${date_modified}`;

    TableData[selected_data[0]][1][selected_data[1]].splice(
      0,
      1,
      splited_value.join('*#^*'),
    );

    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    var DateTime = CurrentUTCTime();
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    db.transaction(txn => {
      txn.executeSql(
        `select tj.TimesheetJobID from Timesheet t
  LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
  LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
  LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
left join LkpCompany lc on tc.CompanyId=lc.CompanyId
left join LkpJob lJ on tJ.JobID=lJ.JobID
  WHERE t.TimesheetID = ? and te.EmployeeId=?
and tj.JobID=? and tc.CompanyId=?`,
        [
          route.params.paramKeyTimesheetID,
          UserID[indexvalue],
          EstimatedJob,
          EstimatedCom,
        ],
        async function (tx, res) {
          txn.executeSql(
            `UPDATE TimesheetJob set EstProjectCompletionDate=?,UpdatedBy=?,UpdatedOn=? where TimesheetJobID=?`,
            [
              date_modified,
              SubmitUserID,
              DateTime,
              res.rows.item(0).TimesheetJobID,
            ],
            async function (tx, result) {
              let columnname = [
                'EstProjectCompletionDate',
                'UpdatedBy',
                'UpdatedOn',
              ];
              let columnvalue = [date_modified, SubmitUserID, DateTime];
              for (let i = 0; i < columnname.length; i++) {
                txn.executeSql(
                  'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                  [
                    'U',
                    'TimesheetJob',
                    res.rows.item(0).TimesheetJobID,
                    columnname[i],
                    columnvalue[i],
                    DateTime,
                    Deviceid,
                    0,
                    0,
                    '-',
                  ],
                );
              }
            },
          );
        },
      );
    });

    setDatePicker(false);
    hideDatePicker();
  };

  //company index 0
  const [SelectedCompany, setSelectedCompany] = useState([]);
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  //Edit Timesheet new states
  const [SelectedTimesheetID, setSelectedTimesheetID] = useState('');
  const [CreatedOn, setCreatedOn] = useState('');
  const [ExistingEmployee, setExistingEmployee] = useState([]);
  const [ExistingCompany, setExistingCompany] = useState([]);
  const [ExistingJob, setExistingJob] = useState([]);
  const [ExistingPhase, setExistingPhase] = useState([]);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(delete1());
        dispatch(delete2());
        dispatch(Remove_Date());
        setUsernamelist([]);
        SetSelectedPhase([]);
        setEmployeeID([]);
        setselected_data([]);
        Setweekenddate([]);
        Setselected_Employee_Id([]);
        setTableData([]);
      };
    }, []),
  );
  useEffect(() => {
    dispatch(Add_Date(route.params && route.params.paramKey)); // dispatch(delete1());    // dispatch(delete2());

    weeekenddates();
  }, []);
  useEffect(() => {
    SetFromUserDetails(
      WholeEmployee.filter(e => {
        if (e.FullName === timesheet_emp) {
          return e;
        }
      }),
    );
  }, [Usernamelist, indexvalue, WholeEmployee, isCopyModalVisible]);
  function showDatePicker(job_i, company_i, e, ss, job) {
    setSelectedDate(new Date(job[0].split('*#^*').slice(-2, -1)[0]));
    setDatePickerVisibility(true);

    setselected_data([company_i, job_i]);

    let pass_com = ss[0][0].split('*')[0];
    let pass_job = e.split('*')[0];
    setEstimatedCom(pass_com);
    setEstimatedJob(pass_job);
    // //
  }

  // function onDateSelected(event, value) {
  //   let date_modified = new Date(value).toLocaleDateString('en-US');

  //
  //   var splited_value =
  //     TableData[selected_data[0]][1][selected_data[1]][0].split('*#^*');
  //   splited_value[3] = `${date_modified}`;

  //   TableData[selected_data[0]][1][selected_data[1]].splice(
  //     0,
  //     1,
  //     splited_value.join('*#^*'),
  //   );

  //   setDatePicker(false);
  // }

  const weeekenddates = () => {
    const sundayDateString = route.params.paramkeyWeekEndDate;

    const sundayMoment = moment(sundayDateString, 'MM/DD/YYYY'); //

    const weekDates = [];

    for (let i = 6; i >= 0; i--) {
      const weekMoment = moment(sundayMoment).subtract(i, 'days');
      weekDates.push(weekMoment.format('MM/DD'));
    }
    Setweekenddate(weekDates);
  };

  const [CJP, setCJP] = useState({
    company: [],
    job: [],
    phase: [],
  });

  const [times, settimes] = useState({
    RegularTime: 0,
    Overtime: 0,
    DBL: 0,
  });

  const [totalgroup1, settotalgroup1] = useState({
    reg1: 0,
    ovt1: 0,
    dbl1: 0,
  });

  const [totalgroup2, settotalgroup2] = useState({
    reg2: 0,
    ovt2: 0,
    dbl2: 0,
  });

  const [totalgroup3, settotalgroup3] = useState({
    reg3: 0,
    ovt3: 0,
    dbl3: 0,
  });
  const [totalgroup4, settotalgroup4] = useState({
    reg4: 0,
    ovt4: 0,
    dbl4: 0,
  });
  const [totalgroup5, settotalgroup5] = useState({
    reg5: 0,
    ovt5: 0,
    dbl5: 0,
  });
  const [totalgroup6, settotalgroup6] = useState({
    reg6: 0,
    ovt6: 0,
    dbl6: 0,
  });
  const [totalgroup7, settotalgroup7] = useState({
    reg7: 0,
    ovt7: 0,
    dbl7: 0,
  });
  const [totalgroup8, settotalgroup8] = useState({
    reg8: 0,
    ovt8: 0,
    dbl8: 0,
  });

  const [total_RegularTime, settotal_RegularTime] = useState(0);
  const [total_Overtime, settotal_Overtime] = useState(0);
  const [total_DBL, settotal_DBL] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  let [Company, SetCompany] = useState([]);
  let [CompanyID, SetCompanyID] = useState([]);
  let [Jobs, setJobs] = useState([]);
  let [JobID, SetJobID] = useState([]);
  let [Phase, setPhase] = useState([]);
  let [AllCompany, SetAllCompany] = useState([]);
  let [AllJobs, setAllJobs] = useState([]);
  let [AllPhase, setAllPhase] = useState([]);
  const [Pageloading, setPageLoading] = useState(false);
  const [Jobloading, setJobLoading] = useState(false);
  const [Companyloading, setCompanyLoading] = useState(false);
  const [Phaseloading, setPhaseLoading] = useState(false);
  const [Employeeloading, setEmployeeloading] = useState(false);
  const [TableData, setTableData] = useState([]);
  const [WholeEmployee, SetWholeEmployee] = useState([]);
  const [UserCompanyID, SetUserCompanyID] = useState('');
  // cmt states
  const [add_cmnt, setadd_cmnt] = useState(false);

  const [cmnts_popup_detail, setcmnts_popup_detail] = useState({
    cmnt_user: null,
    cmnt_job: null,
    cmnt_phase: null,
    phase_hours: null,
    cmt_companyI: null,
    cmt_jobI: null,
    cmt_phaseI: null,
  });
  const [Edit_whole_Employee, SetEdit_whole_Employee] = useState([]);

  const [WholeData, setWholeData] = useState([]);
  const [cmnt_job, set_job] = useState(null);
  const [cmnt_phase, setcmnt_phase] = useState(null);
  const [phase_hours, setphase_hours] = useState([]);

  const getUser = useSelector(store => store);
  const counts = useRef(0);

  const [Timers, Settimers] = useState(null);
  const timesheet_emp = Usernamelist[indexvalue];
  const [UserList, setUserList] = useState('');
  useEffect(() => {
    counts.current = counts.current + 1;
  });
  //

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  let currentDate = new Date();
  let futureDate = new Date();
  futureDate.setFullYear(currentDate.getFullYear() + 15);
  useEffect(() => {
    get_Empl_intial('first click', null);
  }, [isCopyModalVisible]);
  const get_Empl_intial = async (type, selectedEmployeeID) => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');
    // setEmployeeloading(true);
    SetUserCompanyID('');

    if (type === 'first click' && selectedEmployeeID === null) {
      var query =
        "SELECT e.[EmployeeID], VPEmployeeID,CompanyID, IFNULL((CASE WHEN [Company1] = '' THEN '-99' ELSE [Company1] END), '-99') AS [Company1], IFNULL((CASE WHEN [Company2] = '' THEN '-99' ELSE [Company2] END), '-99') AS [Company2]," +
        "IFNULL((CASE WHEN [Company3] = '' THEN '-99' ELSE [Company3] END), '-99') AS [Company3], IFNULL((CASE WHEN [Company4] = '' THEN '-99' ELSE [Company4] END), '-99') AS [Company4]," +
        "IFNULL((CASE WHEN [Company5] = '' THEN '-99' ELSE [Company5] END), '-99') AS [Company5], (CASE WHEN IFNULL(e.[EmployeeID], '') = '' THEN '0' ELSE e.[EmployeeID] END) AS [EmployeeID]" +
        'FROM [Employee] e LEFT JOIN [User] u ON u.[EmployeeID] = e.[EmployeeID] WHERE u.[UserID] = ?';

      // fetch Employee ID using UserId
      db.transaction(function (txn) {
        txn.executeSql(query, [Number(user_id)], function (tx, res) {
          let temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          SetUserCompanyID(temp[0].CompanyID);
          // Fetching Employee Detailss
          db.transaction(function (txn) {
            txn.executeSql(
              'select * from  Employee where EmployeeId=? and IsActive=1 ',
              [temp[0].EmployeeID],
              function (tx, res) {
                let temp2 = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp2.push(res.rows.item(i));
                }

                // setUserRole(temp2[0].UserRole);

                //
                // fetch all employee
                // if (temp2[0].UserRole !== 'admin') {

                let query;
                switch (temp2[0].UserRole) {
                  case 'field supervisor':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                      `;
                    break;
                  case 'field':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'`;
                    break;
                  case 'office':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor')
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                      `;
                    break;
                  case 'admin':
                    query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor','admin','office')
                    union select * from employee where EmployeeId = ${temp[0].EmployeeID}

                    `;
                    break;
                }

                db.transaction(function (txn) {
                  txn.executeSql(query, [], function (tx, res) {
                    let temp3 = [];
                    for (let i = 0; i < res.rows.length; i++) {
                      temp3.push(res.rows.item(i));
                    }

                    SetWholeEmployee(temp3);
                    let newArray = temp3.map(item => {
                      return {
                        key: item.FullName,
                        value: item.EmployeeID,
                        status: false,
                        check: false,
                      };
                    });
                    // get all employee
                    // SetEdit_whole_Employee(newArray);
                    // setEmployee(newArray);
                    // setEmployeeloading(false);
                  });
                });
                // }
                // // fetch desired like field
                // else if (temp2[0].UserRole === 'admin') {
                //   setEmployee([]);
                //   setEmployeeloading(false);
                // }
              },
            );
          });
          // select * from  Employee where EmployeeId=9314
        });
      });
      // setmodalEmployeeVisible(true);
    }
  };
  const get_Empl = async (type, selectedEmployeeID, user_lists) => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');
    if (type !== 'Edit first click') {
      setEmployeeloading(true);
    }
    SetUserCompanyID('');

    if (type === 'first click' && selectedEmployeeID === null) {
      var query =
        "SELECT e.[EmployeeID], VPEmployeeID, CompanyID, IFNULL((CASE WHEN [Company1] = '' THEN '-99' ELSE [Company1] END), '-99') AS [Company1], IFNULL((CASE WHEN [Company2] = '' THEN '-99' ELSE [Company2] END), '-99') AS [Company2]," +
        "IFNULL((CASE WHEN [Company3] = '' THEN '-99' ELSE [Company3] END), '-99') AS [Company3], IFNULL((CASE WHEN [Company4] = '' THEN '-99' ELSE [Company4] END), '-99') AS [Company4]," +
        "IFNULL((CASE WHEN [Company5] = '' THEN '-99' ELSE [Company5] END), '-99') AS [Company5], (CASE WHEN IFNULL(e.[EmployeeID], '') = '' THEN '0' ELSE e.[EmployeeID] END) AS [EmployeeID]" +
        'FROM [Employee] e LEFT JOIN [User] u ON u.[EmployeeID] = e.[EmployeeID] WHERE u.[UserID] = ?';

      // fetch Employee ID using UserId
      db.transaction(function (txn) {
        txn.executeSql(query, [Number(user_id)], function (tx, res) {
          let temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          SetUserCompanyID(temp[0].CompanyID);
          // Fetching Employee Detailss
          db.transaction(function (txn) {
            txn.executeSql(
              'select * from  Employee where EmployeeId=? and IsActive=1 ',
              [temp[0].EmployeeID],
              function (tx, res) {
                let temp2 = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp2.push(res.rows.item(i));
                }
                //

                // fetch all employee
                // if (temp2[0].UserRole !== 'admin') {
                let query;
                switch (temp2[0].UserRole) {
                  case 'field supervisor':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                        `;
                    break;
                  case 'field':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'`;
                    break;
                  case 'office':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor')
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                        `;
                    break;
                  case 'admin':
                    query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor','admin','office')
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                      `;
                    break;
                }
                // let Query =  `select * from  Employee where IsActive=1 and EarningsCode=1 and CompanyId = ${UserCompanyID} ${temp2[0].UserRole===''}  and userrole=''`
                db.transaction(function (txn) {
                  txn.executeSql(query, [], function (tx, res) {
                    let temp3 = [];
                    for (let i = 0; i < res.rows.length; i++) {
                      temp3.push(res.rows.item(i));
                    }

                    let newArray = temp3.map(item => {
                      return {
                        key: item.FullName,
                        value: item.EmployeeID,
                        status: false,
                        check: false,
                      };
                    });

                    // get all employee

                    setEmployee(newArray);
                    setEmployeeloading(false);
                  });
                });
                // }
                // fetch desired like field
                // else if (temp2[0].UserRole === 'admin') {
                //   setEmployee([]);
                //   setEmployeeloading(false);
                // }
              },
            );
          });
          // select * from  Employee where EmployeeId=9314
        });
      });
      setmodalEmployeeVisible(true);
    } else if (type === 'Edit first click' && selectedEmployeeID === null) {
      var query =
        "SELECT CompanyID, IFNULL((CASE WHEN [Company1] = '' THEN '-99' ELSE [Company1] END), '-99') AS [Company1], IFNULL((CASE WHEN [Company2] = '' THEN '-99' ELSE [Company2] END), '-99') AS [Company2]," +
        "IFNULL((CASE WHEN [Company3] = '' THEN '-99' ELSE [Company3] END), '-99') AS [Company3], IFNULL((CASE WHEN [Company4] = '' THEN '-99' ELSE [Company4] END), '-99') AS [Company4]," +
        "IFNULL((CASE WHEN [Company5] = '' THEN '-99' ELSE [Company5] END), '-99') AS [Company5], (CASE WHEN IFNULL(e.[EmployeeID], '') = '' THEN '0' ELSE e.[EmployeeID] END) AS [EmployeeID]" +
        'FROM [Employee] e LEFT JOIN [User] u ON u.[EmployeeID] = e.[EmployeeID] WHERE u.[UserID] = ?';

      // fetch Employee ID using UserId
      db.transaction(function (txn) {
        txn.executeSql(query, [Number(user_id)], function (tx, res) {
          let temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          SetUserCompanyID(temp[0].CompanyID);
          // Fetching Employee Detailss
          db.transaction(function (txn) {
            txn.executeSql(
              'select * from  Employee where EmployeeId=? and IsActive=1 ',
              [temp[0].EmployeeID],
              function (tx, res) {
                let temp2 = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp2.push(res.rows.item(i));
                }
                //
                // fetch all employee
                if (temp2[0].UserRole !== 'admin') {
                  let query;
                  switch (temp2[0].UserRole) {
                    case 'field supervisor':
                      query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                        `;
                      break;
                    case 'field':
                      query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in ( ${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'`;
                      break;
                    case 'office':
                      query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor')
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID}
                        `;
                      break;
                    case 'admin':
                      query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor','admin','office')
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID}

                      `;
                      break;
                  }

                  db.transaction(function (txn) {
                    txn.executeSql(query, [], function (tx, res) {
                      let temp3 = [];
                      for (let i = 0; i < res.rows.length; i++) {
                        temp3.push(res.rows.item(i));
                      }

                      let newArray = temp3.map(item => {
                        return {
                          key: item.FullName,
                          value: item.EmployeeID,
                          status: false,
                          check: false,
                        };
                      });
                      // get all employee
                      SetEdit_whole_Employee(newArray);
                      //
                      //

                      // filtering user who r not already selected
                      let filtered_user = newArray.filter(e => {
                        return !user_lists.includes(e.key);
                      });
                      setEmployee(filtered_user);
                      //   setEmployeeloading(false);

                      // filtering id who r selected
                      let filtered_user_id = newArray.filter(e => {
                        return user_lists.includes(e.key);
                      });

                      let Arry_user_id = [];
                      filtered_user_id.forEach(ids => {
                        if (!Arry_user_id.includes(ids.value)) {
                          Arry_user_id.push(ids.value);
                        }
                      });

                      Setselected_Employee_Id(Arry_user_id);
                    });
                  });
                }
                // fetch desired like field
                else if (temp2[0].UserRole === 'admin') {
                  setEmployee([]);
                  // setEmployeeloading(false);
                }
              },
            );
          });
          // select * from  Employee where EmployeeId=9314
        });
      });
      // setmodalEmployeeVisible(true);
    } else if (type === 'second click' && selectedEmployeeID === null) {
      var query =
        "SELECT companyId, IFNULL((CASE WHEN [Company1] = '' THEN '-99' ELSE [Company1] END), '-99') AS [Company1], IFNULL((CASE WHEN [Company2] = '' THEN '-99' ELSE [Company2] END), '-99') AS [Company2]," +
        "IFNULL((CASE WHEN [Company3] = '' THEN '-99' ELSE [Company3] END), '-99') AS [Company3], IFNULL((CASE WHEN [Company4] = '' THEN '-99' ELSE [Company4] END), '-99') AS [Company4]," +
        "IFNULL((CASE WHEN [Company5] = '' THEN '-99' ELSE [Company5] END), '-99') AS [Company5], (CASE WHEN IFNULL(e.[EmployeeID], '') = '' THEN '0' ELSE e.[EmployeeID] END) AS [EmployeeID]" +
        'FROM [Employee] e LEFT JOIN [User] u ON u.[EmployeeID] = e.[EmployeeID] WHERE u.[UserID] = ?';

      // fetch Employee ID using UserId
      db.transaction(function (txn) {
        txn.executeSql(query, [Number(user_id)], function (tx, res) {
          let temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          SetUserCompanyID(temp[0].CompanyID);

          // Fetching Employee Detailss
          db.transaction(function (txn) {
            txn.executeSql(
              'select * from  Employee where EmployeeId=? and IsActive=1',
              [temp[0].EmployeeID],
              function (tx, res) {
                let temp2 = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp2.push(res.rows.item(i));
                }
                // fetch all employee
                let query;
                switch (temp2[0].UserRole) {
                  case 'field supervisor':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${
                      temp[0].Company1
                    },${temp[0].Company2},${temp[0].Company3},${
                      temp[0].Company4
                    },${
                      temp[0].Company5
                    }) and userrole = 'field'and EmployeeId not in(${selected_Employee_Id.toString()})
                        union select * from employee where EmployeeId = ${
                          temp[0].EmployeeID
                        } and EmployeeId not in(${selected_Employee_Id.toString()})

                        `;
                    break;
                  case 'field':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${
                      temp[0].Company1
                    },${temp[0].Company2},${temp[0].Company3},${
                      temp[0].Company4
                    },${
                      temp[0].Company5
                    }) and userrole = 'field' and EmployeeId not in(${selected_Employee_Id.toString()})`;
                    break;
                  case 'office':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${
                      temp[0].Company1
                    },${temp[0].Company2},${temp[0].Company3},${
                      temp[0].Company4
                    },${
                      temp[0].Company5
                    }) and userrole in ( 'field','field supervisor') and EmployeeId not in(${selected_Employee_Id.toString()})
                        union select * from employee where EmployeeId = ${
                          temp[0].EmployeeID
                        } and EmployeeId not in(${selected_Employee_Id.toString()})
                        `;

                    break;
                  case 'admin':
                    query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${
                      temp[0].Company1
                    },${temp[0].Company2},${temp[0].Company3},${
                      temp[0].Company4
                    },${
                      temp[0].Company5
                    }) and userrole in ( 'field','field supervisor','admin','office') and EmployeeId not in(${selected_Employee_Id.toString()})
                      union select * from employee where EmployeeId = ${
                        temp[0].EmployeeID
                      } and EmployeeId not in(${selected_Employee_Id.toString()})



                      `;
                    break;
                }
                // let Query =  `select * from  Employee where IsActive=1 and EarningsCode=1 and CompanyId = ${UserCompanyID} ${temp2[0].UserRole===''}  and userrole=''`
                db.transaction(function (txn) {
                  txn.executeSql(query, [], function (tx, res) {
                    let temp3 = [];
                    for (let i = 0; i < res.rows.length; i++) {
                      temp3.push(res.rows.item(i));
                    }
                    let newArray = temp3.map(item => {
                      return {
                        key: item.FullName,
                        value: item.EmployeeID,
                        status: false,
                        check: false,
                      };
                    });
                    // get all employee
                    let filtered_user = newArray.filter(e => {
                      return !Usernamelist.includes(e.key);
                    });
                    setEmployee(filtered_user);
                    setEmployeeloading(false);
                    // setEmployee(newArray);
                    // setEmployeeloading(false);
                  });
                });

                // fetch desired like field
              },
            );
          });
          // select * from  Employee where EmployeeId=9314
        });
      });
      setmodalEmployeeVisible(true);
    } else if (type === 'View All') {
      var query =
        "SELECT IFNULL((CASE WHEN [Company1] = '' THEN '-99' ELSE [Company1] END), '-99') AS [Company1], IFNULL((CASE WHEN [Company2] = '' THEN '-99' ELSE [Company2] END), '-99') AS [Company2]," +
        "IFNULL((CASE WHEN [Company3] = '' THEN '-99' ELSE [Company3] END), '-99') AS [Company3], IFNULL((CASE WHEN [Company4] = '' THEN '-99' ELSE [Company4] END), '-99') AS [Company4]," +
        "IFNULL((CASE WHEN [Company5] = '' THEN '-99' ELSE [Company5] END), '-99') AS [Company5], (CASE WHEN IFNULL(e.[EmployeeID], '') = '' THEN '0' ELSE e.[EmployeeID] END) AS [EmployeeID]" +
        'FROM [Employee] e LEFT JOIN [User] u ON u.[EmployeeID] = e.[EmployeeID] WHERE u.[UserID] = ?';

      // fetch Employee ID using UserId
      db.transaction(function (txn) {
        txn.executeSql(query, [Number(user_id)], function (tx, res) {
          let temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          //

          // Fetching Employee Detailss
          db.transaction(function (txn) {
            txn.executeSql(
              'select * from  Employee where EmployeeId=? and IsActive=1',
              [temp[0].EmployeeID],
              function (tx, res) {
                let temp2 = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp2.push(res.rows.item(i));
                }
                //

                // fetch all employee
                if (
                  temp2[0].UserRole === 'office' ||
                  temp2[0].UserRole === 'admin'
                ) {
                  db.transaction(function (txn) {
                    txn.executeSql(
                      `select * from  Employee where companyId = ${
                        temp[0].CompanyID
                      } and   IsActive=1 and EarningsCode in (1,4) and EmployeeId not in(${selected_Employee_Id.toString()})`,
                      [],
                      function (tx, res) {
                        let temp3 = [];
                        for (let i = 0; i < res.rows.length; i++) {
                          temp3.push(res.rows.item(i));
                        }

                        let newArray = temp3.map(item => {
                          return {
                            key: item.FullName,
                            value: item.EmployeeID,
                            status: false,
                            check: false,
                          };
                        });

                        // const data = newArray.filter(
                        //   i => i.check == false && i.value != Userid,
                        // );

                        // get all employee
                        setEmployee(newArray);

                        setEmployeeloading(false);

                        //
                      },
                    );
                  });
                }
                // fetch desired like field
                else {
                  db.transaction(function (txn) {
                    txn.executeSql(
                      `select * from  Employee where companyId = ${
                        temp[0].CompanyID
                      } and UserRole='${
                        temp2[0].UserRole
                      }' and IsActive=1 and EarningsCode in (1,4) and EmployeeId not in(${selected_Employee_Id.toString()})`,
                      [],
                      function (tx, res) {
                        let temp4 = [];
                        for (let i = 0; i < res.rows.length; i++) {
                          temp4.push(res.rows.item(i));
                        }

                        let newArray = temp4.map(item => {
                          return {
                            key: item.FullName,
                            value: item.EmployeeID,
                            status: false,
                            check: false,
                          };
                        });
                        // get all employee
                        setEmployee(newArray);

                        setEmployeeloading(false);
                        //
                        //
                      },
                    );
                  });
                }
              },
            );
          });
          // select * from  Employee where EmployeeId=9314
        });
      });
      setmodalEmployeeVisible(true);
    }
  };

  const generateGuidQuicklyJob = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const generateGuidQuicklyPhase = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const generateGuidQuicklyCompany = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  //   useEffect(() => {
  //     // setprocess_loader(true)
  //     // setPageLoading(true)
  //     setPageLoading(true);
  //     let user_lists = [];
  //     let userid = [];
  //     const GetWholeData = async newArray => {
  //       db.transaction(tx => {
  //         tx.executeSql(
  //           `select ts.StatusName,tc.TimesheetCompanyID, u.EmployeeId,u.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tp.* ,lp.PhaseCodeName from Timesheet t
  //           left join TimesheetEmployee te on t.TimesheetID=te.TimesheetID
  //           left join TimesheetCompany tc on te.TimesheetEmployeeID = tc.TimesheetEmployeeID
  //           left join TimesheetJob tj on tc.TimesheetCompanyID=tj.TimesheetCompanyID
  //           left join TimesheetPhaseCode tp on tj.TimesheetJobID=tp.TimesheetJobID
  //           left join Employee u on u.EmployeeId=te.EmployeeID
  //           left join LkpCompany lc on lc.CompanyID=tc.CompanyID
  //           left join LkpJob lj on lj.JobID=tj.JobID
  //           left join LkpPhaseCode lp on lp.PhaseCodeID=tp.PhaseCodeID
  //           left join LkpTimesheetStatus ts on t.StatusId = ts.StatusId
  //           where t.TimesheetID=? and te.TimesheetEmployeeID=?`,
  //           [route.params.paramKeyTimesheetID, route.params.paramKeyEmployeeID],
  //           async (tx, res) => {
  //             var temp = [];
  //             let CompanyExist = [];

  //             for (let i = 0; i < res.rows.length; i++) {
  //               setTimesheetStatus(res.rows.item(0).StatusName);
  //               //
  //               var JobID = generateGuidQuicklyJob();
  //               var PhaseCodID = generateGuidQuicklyPhase();
  //               var CompanyID = generateGuidQuicklyCompany();
  //               if (res.rows.item(i).CompanyName != null) {
  //                 res.rows.item(i).CompanyName =
  //                   res.rows.item(i).CompanyID +
  //                   '*#^*' +
  //                   res.rows.item(i).CompanyName +
  //                   '' +
  //                   '+' +
  //                   CompanyID;

  //                 let company = (
  //                   res.rows.item(i).CompanyName +
  //                   '' +
  //                   '+' +
  //                   CompanyID
  //                 ).split('+')[0];
  //                 CompanyExist.indexOf(company.split('*#^*')[1]) === -1
  //                   ? CompanyExist.push(company.split('*#^*')[1])
  //                   : null;

  //                 // CompanyExist.indexOf(res.rows.item(i).CompanyName.split('+')[0]);
  //                 // CompanyExist.push(...CompanyExist, ...[accumulator.toString()]);
  //               }
  //               setCJP(prev => ({
  //                 company: CompanyExist,
  //                 job: [],
  //                 phase: [],
  //               }));
  //               if (res.rows.item(i).JobName != null) {
  //                 res.rows.item(i).JobName =
  //                   res.rows.item(i).JobID +
  //                   '*#^*' +
  //                   res.rows.item(i).JobNo +
  //                   '*#^*' +
  //                   res.rows.item(i).JobName +
  //                   '' +
  //                   '+' +
  //                   JobID;
  //               }
  //               if (res.rows.item(i).PhaseCodeName != null) {
  //                 res.rows.item(i).PhaseCodeName =
  //                   res.rows.item(i).PhaseCodeID +
  //                   '*#^*' +
  //                   res.rows.item(i).PhaseCodeName +
  //                   '' +
  //                   '+' +
  //                   PhaseCodID;
  //               }
  //               temp.push(res.rows.item(i));
  //             }

  //             //
  //           setWholeData(temp);
  //             for (let j = 0; j < newArray.length; j++) {
  //               // company push
  //               let result = [];
  //                 // pushing

  //               temp
  //                 .filter(item => item.FullName == newArray[j].key)
  //                 .reduce((accumulator, currentValue) => {
  //                   const check = (acc, cur) => {
  //                     let mapped = acc.flat(3).map(ee => {
  //                       return ee.split('+')[0];
  //                     });

  //                     let result = mapped.includes(cur);
  //                     return result;
  //                   };

  //                   //
  //                   // insert if no elements
  //                   if (accumulator.length === 0) {
  //                     currentValue.CompanyName
  //                       ? accumulator.push([[currentValue.CompanyName]])
  //                       : null;
  //                     //  acc=[['99-Test Company #99'],['99-Test Company #99']]
  //                   } else if (
  //                     !check(accumulator, currentValue.CompanyName.split('+')[0])
  //                   ) {
  //                     // insert if there s no already exist

  //                     accumulator.push([[currentValue.CompanyName]]);
  //                   }
  //                   // CompanyExist.push((result.toString()).split('+')[0]);

  //                   return accumulator;
  //                 }, result);

  //               setSelectedCompany(
  //                 ...SelectedCompany,
  //                 ...result.toString().split('+')[0],
  //               );
  //               // setSelectedCompany(prev => [...prev, ...[result.toString()]]);
  //               // job push
  //               let result2 =
  //                 result.length !== 0
  //                   ? result.map(e => {
  //                       let job_push = [];

  //                       let filtered_length;
  //                       let dd = [];
  //                       // if only one company
  //                       if (e) {
  //                         let final = temp.filter(job => {
  //                           if (job.CompanyName) {
  //                             return (
  //                               e[0][0].split('+')[0] ===
  //                                 job.CompanyName.split('+')[0] &&
  //                               job.FullName === newArray[j].key
  //                             );
  //                           }
  //                         });

  //                         filtered_length = final.length;
  //                         dd = final;
  //                       }

  //                       if (filtered_length !== 0) {
  //                         // let s = temp.filter(job => e[0][0].split('+')[0] === job.CompanyName.split('+')[0] && job.FullName === newArray[j].key)

  //                         dd.forEach((ee, i) => {
  //                           //

  //                           const check = (acc, cur) => {
  //                             // job_push.flat().includes(ee.JobName)
  //                             let mapped = acc.flat().map(ee => {
  //                               return ee.split('+')[0];
  //                             });

  //                             let result = mapped.includes(cur);

  //                             return result;
  //                           };

  //                           if (ee.JobName !== null) {
  //                             if (!check(job_push, ee.JobName.split('+')[0])) {
  //                               if (ee.JobName !== null) {
  //                                 //  ee.JobName =Object.values(ee.JobName)+"+"+ TimesheetID
  //                                 job_push.push([
  //                                   ee.JobName.split('+')[0] +
  //                                     `+` +
  //                                     ee.CompanyName.split('+')[1] +
  //                                     `+` +
  //                                     ee.JobName.split('+')[1] +
  //                                     `*#^*` +
  //                                     ee.EstProjectCompletionDate +
  //                                     `*#^*`,
  //                                   //                                  ee.JobName,
  //                                 ]);
  //                               } else {
  //                                 // job_push=null
  //                               }
  //                             }
  //                           }
  //                         });

  //                         return job_push.length === 0
  //                           ? [[e[0][0]]]
  //                           : [[e[0][0]], job_push];
  //                       }

  //                       return [[e[0][0]]];
  //                     })
  //                   : [];

  //               let total_RegularTime;
  //               let total_DBL;
  //               let total_Overtime;

  //               // result2.map(e=>{
  //               //
  //               // })

  //               // phase push

  //               let result3 = result2.map(e => {
  //                 if (e[1] !== undefined) {
  //                   let modified = e[1].map(ee => {
  //                     let phase_push = [];

  //                     if (ee[0]) {
  //                       // checking job is or not in temp
  //                       let phasefil = temp.filter(job => {
  //                         if (job.JobName) {
  //                           return (
  //                             ee[0].split('+')[0] === job.JobName.split('+')[0] &&
  //                             job.FullName == newArray[j].key
  //                           );
  //                         }
  //                       });

  //                       if (phasefil.length != 0) {
  //                         phasefil.forEach(item => {
  //                           if (item.PhaseCodeName !== null) {
  //                             total_RegularTime = item.Total_Reg;
  //                             total_DBL = item.Total_Dbl;
  //                             total_Overtime = item.Total_Ot;

  //                             phase_push.push([
  //                               item.PhaseCodeName.split('+')[0] +
  //                                 `+` +
  //                                 item.CompanyName.split(`+`)[1] +
  //                                 `+` +
  //                                 item.JobName.split(`+`)[1] +
  //                                 `+` +
  //                                 item.PhaseCodeName.split(`+`)[1],

  //                               `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
  //                               `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
  //                               `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
  //                               `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
  //                               `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
  //                               `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
  //                               `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
  //                               `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
  //                               `${item.Comment}`,
  //                             ]);
  //                           }
  //                         });

  //                         return phase_push.length === 0
  //                           ? [ee[0]]
  //                           : [ee[0], phase_push];
  //                       }
  //                     }

  //                     return ee;
  //                   });

  //                   return [[e[0][0]], modified];
  //                 }

  //                 return e;
  //               });
  // console.log("j",j);
  //               // push datas into tabledata
  //               if (j === 0) {
  //                 setTableData(result3);

  //                 let reg1 = 0;
  //                 let ovt1 = 0;
  //                 let dbl1 = 0;
  //                 // 2
  //                 let reg2 = 0;
  //                 let ovt2 = 0;
  //                 let dbl2 = 0;
  //                 // 3
  //                 let reg3 = 0;
  //                 let ovt3 = 0;
  //                 let dbl3 = 0;
  //                 // 4
  //                 let reg4 = 0;
  //                 let ovt4 = 0;
  //                 let dbl4 = 0;
  //                 // 5
  //                 let reg5 = 0;
  //                 let ovt5 = 0;
  //                 let dbl5 = 0;
  //                 // 6
  //                 let reg6 = 0;
  //                 let ovt6 = 0;
  //                 let dbl6 = 0;
  //                 // 7
  //                 let reg7 = 0;
  //                 let ovt7 = 0;
  //                 let dbl7 = 0;

  //                 let b = result3.forEach(eee => {
  //                   if (eee[1]) {
  //                     eee[1].forEach((d, j) => {
  //                       if (d[1]) {
  //                         d[1].forEach((a, k) => {
  //                           if (a) {
  //                             for (let i = 0; i <= a.length; i++) {
  //                               if (i === 0) {
  //                               } else {
  //                                 if (i == 1) {
  //                                   reg1 += parseFloat(a[i].split('/')[0]);
  //                                   ovt1 += parseFloat(a[i].split('/')[1]);
  //                                   dbl1 += parseFloat(a[i].split('/')[2]);
  //                                 }

  //                                 if (i === 2) {
  //                                   reg2 += parseFloat(a[i].split('/')[0]);
  //                                   ovt2 += parseFloat(a[i].split('/')[1]);
  //                                   dbl2 += parseFloat(a[i].split('/')[2]);
  //                                 }
  //                               }

  //                               if (i === 3) {
  //                                 reg3 += parseFloat(a[i].split('/')[0]);
  //                                 ovt3 += parseFloat(a[i].split('/')[1]);
  //                                 dbl3 += parseFloat(a[i].split('/')[2]);
  //                               }

  //                               if (i === 4) {
  //                                 reg4 += parseFloat(a[i].split('/')[0]);
  //                                 ovt4 += parseFloat(a[i].split('/')[1]);
  //                                 dbl4 += parseFloat(a[i].split('/')[2]);
  //                               }

  //                               if (i === 5) {
  //                                 reg5 += parseFloat(a[i].split('/')[0]);
  //                                 ovt5 += parseFloat(a[i].split('/')[1]);
  //                                 dbl5 += parseFloat(a[i].split('/')[2]);
  //                               }

  //                               if (i === 6) {
  //                                 reg6 += parseFloat(a[i].split('/')[0]);
  //                                 ovt6 += parseFloat(a[i].split('/')[1]);
  //                                 dbl6 += parseFloat(a[i].split('/')[2]);
  //                               }
  //                               if (i === 7) {
  //                                 reg7 += parseFloat(a[i].split('/')[0]);
  //                                 ovt7 += parseFloat(a[i].split('/')[1]);
  //                                 dbl7 += parseFloat(a[i].split('/')[2]);
  //                               }
  //                             }
  //                           }
  //                         });
  //                       }
  //                     });
  //                   }
  //                 });

  //                 settotalgroup1({
  //                   reg1: reg1,
  //                   ovt1: ovt1,
  //                   dbl1: dbl1,
  //                 });
  //                 settotalgroup2({
  //                   reg2: reg2,
  //                   ovt2: ovt2,
  //                   dbl2: dbl2,
  //                 });
  //                 settotalgroup3({
  //                   reg3: reg3,
  //                   ovt3: ovt3,
  //                   dbl3: dbl3,
  //                 });
  //                 settotalgroup4({
  //                   reg4: reg4,
  //                   ovt4: ovt4,
  //                   dbl4: dbl4,
  //                 });
  //                 settotalgroup5({
  //                   reg5: reg5,
  //                   ovt5: ovt5,
  //                   dbl5: dbl5,
  //                 });
  //                 settotalgroup6({
  //                   reg6: reg6,
  //                   ovt6: ovt6,
  //                   dbl6: dbl6,
  //                 });
  //                 settotalgroup7({
  //                   reg7: reg7,
  //                   ovt7: ovt7,
  //                   dbl7: dbl7,
  //                 });
  //               }

  //               // calculating whole
  //               let reg_time = 0;
  //               let ovt_time = 0;
  //               let dbl_time = 0;
  //               result3.map((ee, i) => {
  //                 if (ee[1]) {
  //                   ee[1].map((d, j) => {
  //                     if (d[1]) {
  //                       d[1].map((f, k) => {
  //                         if (f) {
  //                           f.map((g, h) => {
  //                             if (h === 0) {
  //                               // Ignore first position
  //                             } else if (h === 8 || h === 9) {
  //                             } else {
  //                               reg_time += parseFloat(g.split('/')[0]);
  //                               ovt_time += parseFloat(g.split('/')[1]);
  //                               dbl_time += parseFloat(g.split('/')[2]);
  //                             }
  //                           });
  //                         }
  //                       });
  //                     }
  //                   });
  //                 }
  //               });

  //               let obj = {};
  //               obj[newArray[j].key] = result3;

  //               obj['total_RegularTime'] = reg_time ? reg_time : 0;
  //               obj['total_DBL'] = dbl_time ? dbl_time : 0;
  //               obj['total_Overtime'] = ovt_time ? ovt_time : 0;
  //               dispatch(AddData(obj));

  //               // push All total
  //               if (j === 0) {
  //                 settotal_RegularTime(reg_time ? reg_time : 0);
  //                 settotal_Overtime(ovt_time ? ovt_time : 0);
  //                 settotal_DBL(dbl_time ? dbl_time : 0);
  //               } else {
  //               }

  //               user_lists.push(newArray[j].key);
  //               userid.push(newArray[j].value);
  //             }
  //           },
  //         );
  //       });

  //       setUsernamelist(user_lists);
  //       setUserID(userid);

  //       get_Empl('Edit first click', null, user_lists);
  //       // setTimeout(() => {
  //       //   setPageLoading(true);

  //       //   if(route.params.name!==undefined){
  //       //
  //       //
  //       //       if(user_lists.indexOf(route.params.name) !== -1)
  //       //       {
  //       //         setindexvalue(user_lists.indexOf(route.params.name))
  //       //       }

  //       //       if (getUser.count.data.length !== 1) {
  //       //         let objArr = Object.values(getUser.count.data)[indexvalue];
  //       //         let res = route.params.name;
  //       //
  //       //         objArr &&
  //       //           objArr[res].map(e => {
  //       //             setCJP(prev => ({
  //       //               company: [...prev.company, e[0][0].split('+')[0]],
  //       //               job: [],
  //       //               phase: [],
  //       //             }));
  //       //           });

  //       //         objArr && setTableData(objArr[res]);
  //       //         objArr && Add_Week_Totals(objArr[res]);
  //       //         objArr && settotal_Overtime(objArr['total_Overtime']);
  //       //         objArr && settotal_DBL(objArr['total_DBL']);
  //       //         objArr && settotal_RegularTime(objArr['total_RegularTime']);
  //       //       }
  //       //    }
  //       //    setPageLoading(false);

  //       // }, 1000);

  //       setPageLoading(false);
  //     };

  //     // GetWholeData()

  //     const GetEmployee = async () => {
  //       db.transaction(tx => {
  //         tx.executeSql(
  //           `select E.EmployeeId,E.FullName from TimesheetEmployee te inner join Employee E on E.EmployeeId=te.
  //           EmployeeID where TimesheetID=?`,
  //           [route.params.paramKeyTimesheetID],
  //           async (tx, res) => {
  //             var temp = [];

  //             for (let i = 0; i < res.rows.length; i++) {
  //               temp.push(res.rows.item(i));
  //             }

  //             let newArray = temp.map(item => {
  //               return {
  //                 key: item.FullName,
  //                 value: item.EmployeeID,
  //                 status: true,
  //                 check: true,
  //               };
  //             });

  //             GetWholeData(newArray);
  //           },
  //         );
  //       });
  //     };

  //     GetEmployee();
  //   }, []);

  useEffect(() => {
    // setprocess_loader(true)
    // setPageLoading(true)
    setPageLoading(true);
    let user_lists = [];
    let userid = [];
    const GetWholeData = async newArray => {
      db.transaction(tx => {
        tx.executeSql(
          `select ts.StatusName,tc.TimesheetCompanyID, u.EmployeeId,u.FullName,tc.CompanyID ,lc.CompanyName ,tj.JobID,lj.JobNo ,lj.JobName,tp.* ,tj.EstProjectCompletionDate,lp.PhaseCodeName,lp.PhaseCode from Timesheet t
        left join TimesheetEmployee te on t.TimesheetID=te.TimesheetID
        left join TimesheetCompany tc on te.TimesheetEmployeeID = tc.TimesheetEmployeeID
        left join TimesheetJob tj on tc.TimesheetCompanyID=tj.TimesheetCompanyID
        left join TimesheetPhaseCode tp on tj.TimesheetJobID=tp.TimesheetJobID
        left join Employee u on u.EmployeeId=te.EmployeeID
        left join LkpCompany lc on lc.CompanyID=tc.CompanyID
        left join LkpJob lj on lj.JobID=tj.JobID
        left join LkpPhaseCode lp on lp.PhaseCodeID=tp.PhaseCodeID
        left join LkpTimesheetStatus ts on t.StatusId = ts.StatusId
        where t.TimesheetID=? and te.TimesheetEmployeeID=?`,
          [route.params.paramKeyTimesheetID, route.params.paramKeyEmployeeID],
          async (tx, res) => {
            var temp = [];
            let CompanyExist = [];

            for (let i = 0; i < res.rows.length; i++) {
              setTimesheetStatus(res.rows.item(0).StatusName);
              //
              var JobID = generateGuidQuicklyJob();
              var PhaseCodID = generateGuidQuicklyPhase();
              var CompanyID = generateGuidQuicklyCompany();
              if (res.rows.item(i).CompanyName != null) {
                res.rows.item(i).CompanyName =
                  res.rows.item(i).CompanyID +
                  '*#^*' +
                  res.rows.item(i).CompanyName +
                  '' +
                  '+' +
                  CompanyID;

                let company = (
                  res.rows.item(i).CompanyName +
                  '' +
                  '+' +
                  CompanyID
                ).split('+')[0];
                CompanyExist.indexOf(company.split('*#^*')[1]) === -1
                  ? CompanyExist.push(company.split('*#^*')[1])
                  : null;

                // CompanyExist.indexOf(res.rows.item(i).CompanyName.split('+')[0]);
                // CompanyExist.push(...CompanyExist, ...[accumulator.toString()]);
              }
              setCJP(prev => ({
                company: CompanyExist,
                job: [],
                phase: [],
              }));
              if (res.rows.item(i).JobName != null) {
                res.rows.item(i).JobName =
                  res.rows.item(i).JobID +
                  '*#^*' +
                  res.rows.item(i).JobNo +
                  '*#^*' +
                  res.rows.item(i).JobName +
                  '' +
                  '+' +
                  JobID;
              }
              if (res.rows.item(i).PhaseCodeName != null) {
                res.rows.item(i).PhaseCodeName =
                  res.rows.item(i).PhaseCodeID +
                  '*#^*' +
                  res.rows.item(i).PhaseCode +
                  ' ' +
                  res.rows.item(i).PhaseCodeName +
                  '' +
                  '+' +
                  PhaseCodID;
              }
              temp.push(res.rows.item(i));
            }

            //
            setWholeData(temp);
            for (let j = 0; j < newArray.length; j++) {
              // company push
              let result = [];
              // pushing

              temp
                .filter(item => item.FullName == newArray[j].key)
                .reduce((accumulator, currentValue) => {
                  const check = (acc, cur) => {
                    let mapped = acc.flat(3).map(ee => {
                      return ee.split('+')[0];
                    });

                    let result = mapped.includes(cur);
                    return result;
                  };

                  //
                  // insert if no elements
                  if (accumulator.length === 0) {
                    currentValue.CompanyName
                      ? accumulator.push([[currentValue.CompanyName]])
                      : null;
                    //  acc=[['99-Test Company #99'],['99-Test Company #99']]
                  } else if (
                    !check(accumulator, currentValue.CompanyName.split('+')[0])
                  ) {
                    // insert if there s no already exist

                    accumulator.push([[currentValue.CompanyName]]);
                  }
                  // CompanyExist.push((result.toString()).split('+')[0]);

                  return accumulator;
                }, result);

              setSelectedCompany(
                ...SelectedCompany,
                ...result.toString().split('+')[0],
              );
              // setSelectedCompany(prev => [...prev, ...[result.toString()]]);
              // job push
              let result2 =
                result.length !== 0
                  ? result.map(e => {
                      let job_push = [];

                      let filtered_length;
                      let dd = [];
                      // if only one company
                      if (e) {
                        let final = temp.filter(job => {
                          if (job.CompanyName) {
                            return (
                              e[0][0].split('+')[0] ===
                                job.CompanyName.split('+')[0] &&
                              job.FullName === newArray[j].key
                            );
                          }
                        });

                        filtered_length = final.length;
                        dd = final;
                      }

                      if (filtered_length !== 0) {
                        // let s = temp.filter(job => e[0][0].split('+')[0] === job.CompanyName.split('+')[0] && job.FullName === newArray[j].key)

                        dd.forEach((ee, i) => {
                          //
                          console.log({ee});
                          const check = (acc, cur) => {
                            // job_push.flat().includes(ee.JobName)
                            let mapped = acc.flat().map(ee => {
                              return ee.split('+')[0];
                            });

                            let result = mapped.includes(cur);

                            return result;
                          };

                          if (ee.JobName !== null) {
                            if (!check(job_push, ee.JobName.split('+')[0])) {
                              if (ee.JobName !== null) {
                                //  ee.JobName =Object.values(ee.JobName)+"+"+ TimesheetID
                                job_push.push([
                                  ee.JobName.split('+')[0] +
                                    `+` +
                                    ee.CompanyName.split('+')[1] +
                                    `+` +
                                    ee.JobName.split('+')[1] +
                                    `*#^*` +
                                    ee.EstProjectCompletionDate +
                                    `*#^*`,
                                  //                                  ee.JobName,
                                ]);
                              } else {
                                // job_push=null
                              }
                            }
                          }
                        });

                        return job_push.length === 0
                          ? [[e[0][0]]]
                          : [[e[0][0]], job_push];
                      }

                      return [[e[0][0]]];
                    })
                  : [];

              let total_RegularTime;
              let total_DBL;
              let total_Overtime;

              // result2.map(e=>{
              //
              // })

              // phase push
              let result3 = result2.map(e => {
                if (e[1] !== undefined) {
                  let modified = e[1].map(ee => {
                    let phase_push = [];

                    if (ee[0]) {
                      // checking job is or not in temp
                      let phasefil = temp.filter(job => {
                        if (job.JobName) {
                          return (
                            ee[0].split('+')[0] === job.JobName.split('+')[0] &&
                            job.FullName == newArray[j].key
                          );
                        }
                      });

                      if (phasefil.length != 0) {
                        phasefil.forEach(item => {
                          if (item.PhaseCodeName !== null) {
                            total_RegularTime = item.Total_Reg;
                            total_DBL = item.Total_Dbl;
                            total_Overtime = item.Total_Ot;

                            phase_push.push([
                              item.PhaseCodeName.split('+')[0] +
                                `+` +
                                item.CompanyName.split(`+`)[1] +
                                `+` +
                                item.JobName.split(`+`)[1] +
                                `+` +
                                item.PhaseCodeName.split(`+`)[1],

                              `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
                              `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
                              `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
                              `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
                              `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
                              `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
                              `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
                              `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
                              `${item.Comment}`,
                            ]);
                          }
                        });

                        let phase_pushdata = phase_push;
                        let array = [];
                        let emparray = [];
                        let data = phase_pushdata.map(d => {
                          let dd = isNaN(
                            parseInt(d[0].split('*#^*')[1].split('-  ')[0]),
                          );
                          if (dd == false) {
                            let d1 = d.filter(function (x) {
                              return x !== undefined;
                            });
                            array.push(d1);
                          } else if (dd == true) {
                            let d1 = d.filter(function (x) {
                              return x !== undefined;
                            });
                            emparray.push(d1);
                          }
                        });

                        const phase_push2 = array.sort((a, b) => {
                          const numA = a[0].split('*#^*')[1];
                          const numB = b[0].split('*#^*')[1];
                          return numA.localeCompare(numB);
                        });

                        phase_push2.forEach(item => {
                          const numberAfterSymbol = item[0].split('*#^*')[1];
                        });
                        phase_push2.push(...emparray);
                        return phase_push2.length === 0
                          ? [ee[0]]
                          : [ee[0], phase_push2];
                      }
                    }

                    return ee;
                  });

                  return [[e[0][0]], modified];
                }

                return e;
              });

              // push datas into tabledata
              if (j === 0) {
                setTableData(result3);

                let reg1 = 0;
                let ovt1 = 0;
                let dbl1 = 0;
                // 2
                let reg2 = 0;
                let ovt2 = 0;
                let dbl2 = 0;
                // 3
                let reg3 = 0;
                let ovt3 = 0;
                let dbl3 = 0;
                // 4
                let reg4 = 0;
                let ovt4 = 0;
                let dbl4 = 0;
                // 5
                let reg5 = 0;
                let ovt5 = 0;
                let dbl5 = 0;
                // 6
                let reg6 = 0;
                let ovt6 = 0;
                let dbl6 = 0;
                // 7
                let reg7 = 0;
                let ovt7 = 0;
                let dbl7 = 0;

                let b = result3.forEach(eee => {
                  if (eee[1]) {
                    eee[1].forEach((d, j) => {
                      if (d[1]) {
                        d[1].forEach((a, k) => {
                          if (a) {
                            for (let i = 0; i <= a.length; i++) {
                              if (i === 0) {
                              } else {
                                if (i == 1) {
                                  reg1 += parseFloat(a[i].split('/')[0]);
                                  ovt1 += parseFloat(a[i].split('/')[1]);
                                  dbl1 += parseFloat(a[i].split('/')[2]);
                                }

                                if (i === 2) {
                                  reg2 += parseFloat(a[i].split('/')[0]);
                                  ovt2 += parseFloat(a[i].split('/')[1]);
                                  dbl2 += parseFloat(a[i].split('/')[2]);
                                }
                              }

                              if (i === 3) {
                                reg3 += parseFloat(a[i].split('/')[0]);
                                ovt3 += parseFloat(a[i].split('/')[1]);
                                dbl3 += parseFloat(a[i].split('/')[2]);
                              }

                              if (i === 4) {
                                reg4 += parseFloat(a[i].split('/')[0]);
                                ovt4 += parseFloat(a[i].split('/')[1]);
                                dbl4 += parseFloat(a[i].split('/')[2]);
                              }

                              if (i === 5) {
                                reg5 += parseFloat(a[i].split('/')[0]);
                                ovt5 += parseFloat(a[i].split('/')[1]);
                                dbl5 += parseFloat(a[i].split('/')[2]);
                              }

                              if (i === 6) {
                                reg6 += parseFloat(a[i].split('/')[0]);
                                ovt6 += parseFloat(a[i].split('/')[1]);
                                dbl6 += parseFloat(a[i].split('/')[2]);
                              }
                              if (i === 7) {
                                reg7 += parseFloat(a[i].split('/')[0]);
                                ovt7 += parseFloat(a[i].split('/')[1]);
                                dbl7 += parseFloat(a[i].split('/')[2]);
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                });

                settotalgroup1({
                  reg1: reg1,
                  ovt1: ovt1,
                  dbl1: dbl1,
                });
                settotalgroup2({
                  reg2: reg2,
                  ovt2: ovt2,
                  dbl2: dbl2,
                });
                settotalgroup3({
                  reg3: reg3,
                  ovt3: ovt3,
                  dbl3: dbl3,
                });
                settotalgroup4({
                  reg4: reg4,
                  ovt4: ovt4,
                  dbl4: dbl4,
                });
                settotalgroup5({
                  reg5: reg5,
                  ovt5: ovt5,
                  dbl5: dbl5,
                });
                settotalgroup6({
                  reg6: reg6,
                  ovt6: ovt6,
                  dbl6: dbl6,
                });
                settotalgroup7({
                  reg7: reg7,
                  ovt7: ovt7,
                  dbl7: dbl7,
                });
              }

              // calculating whole
              let reg_time = 0;
              let ovt_time = 0;
              let dbl_time = 0;
              result3.map((ee, i) => {
                if (ee[1]) {
                  ee[1].map((d, j) => {
                    if (d[1]) {
                      d[1].map((f, k) => {
                        if (f) {
                          f.map((g, h) => {
                            if (h === 0) {
                              // Ignore first position
                            } else if (h === 8 || h === 9) {
                            } else {
                              reg_time += parseFloat(g.split('/')[0]);
                              ovt_time += parseFloat(g.split('/')[1]);
                              dbl_time += parseFloat(g.split('/')[2]);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });

              let obj = {};
              obj[newArray[j].key] = result3;

              obj['total_RegularTime'] = reg_time ? reg_time : 0;
              obj['total_DBL'] = dbl_time ? dbl_time : 0;
              obj['total_Overtime'] = ovt_time ? ovt_time : 0;
              dispatch(AddData(obj));

              // push All total
              if (j === 0) {
                settotal_RegularTime(reg_time ? reg_time : 0);
                settotal_Overtime(ovt_time ? ovt_time : 0);
                settotal_DBL(dbl_time ? dbl_time : 0);
              } else {
              }

              user_lists.push(newArray[j].key);
              userid.push(newArray[j].value);
            }
          },
        );
      });

      setUsernamelist(user_lists);
      setUserID(userid);

      get_Empl('Edit first click', null, user_lists);

      setPageLoading(false);
    };

    // GetWholeData()

    const GetEmployee = async () => {
      db.transaction(tx => {
        tx.executeSql(
          `select E.EmployeeId,E.FullName from TimesheetEmployee te inner join Employee E on E.EmployeeId=te.
        EmployeeID where TimesheetID=? and te.TimesheetEmployeeID=?`,
          [route.params.paramKeyTimesheetID, route.params.paramKeyEmployeeID],
          async (tx, res) => {
            var temp = [];

            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }

            let newArray = temp.map(item => {
              return {
                key: item.FullName,
                value: item.EmployeeID,
                status: true,
                check: true,
              };
            });

            GetWholeData(newArray);
          },
        );
      });
    };

    GetEmployee();
  }, []);

  // again push removed employyee into employee drop down
  // const Insert_Employee = (selectedusername) => {
  //   let filtering;
  //   const myPromise = new Promise((resolve, reject) => {
  //     filtering = Employee.filter(e => {
  //       //
  //       return e.key === selectedusername
  //     })
  //     resolve('foo');
  //   }).then(() => {
  //     let final = filtering[0].value; // 9623
  //     let removed_id = selected_Employee_Id.filter(e => {
  //       return e !== final
  //     })
  //
  //     Setselected_Employee_Id(removed_id)
  //   })
  // }

  // let selectedusername = Usernamelist[indexvalue];
  //
  // Get Company list
  // const GetCompany = () => {
  //   SetSelectedJob('');

  //   db.transaction(tx => {
  //     setCompanyLoading(true);
  //     tx.executeSql('SELECT * FROM lkpcompany', [], (tx, res) => {
  //       var temp = [];

  //       for (let i = 0; i < res.rows.length; i++) {
  //         temp.push(res.rows.item(i));
  //       }
  //       let newArray = temp.map(item => {
  //         return {
  //           key: '' + item.CompanyID + '$$$' + item.CompanyName + '',
  //           value: '' + item.CompanyID + 'SplitId '+ item.CompanyName + '',
  //           status: false,
  //           check: false,
  //           ID: item.CompanyID,
  //         };
  //       });
  //       const data = newArray.filter(i => i.check == false);
  //       if (route.params.paramKeyEmployee != undefined) {
  //         let resultparam = route.params.paramKeyEmployee.map(item => item.key);
  //         setUsernamelist(resultparam);
  //       }
  //       if (route.params && route.params.paramKeyCompany != undefined) {
  //         // company push
  //         let result = [];
  //         // pushing
  //         route.params &&
  //           route.params.paramKeyCompany.reduce((accumulator, currentValue) => {
  //             const check = CompanyName => {
  //               accumulator.forEach(e => {
  //                 if (e[0][0] === CompanyName) {
  //                   return true;
  //                 } else {
  //                   return false;
  //                 }
  //               });
  //             };

  //             if (accumulator.length === 0) {
  //               accumulator.push([[currentValue.CompanyName]]);
  //               //  acc=[['99-Test Company #99'],['99-Test Company #99']]
  //             } else if (
  //               !accumulator.flat(3).includes(currentValue.CompanyName)
  //             ) {
  //               accumulator.push([[currentValue.CompanyName]]);
  //             }
  //             return accumulator;
  //           }, result);

  //         // job push
  //         let result2 = result.map(e => {
  //           let job_push = [];

  //           //   job_push=[[],[]]
  //           if (
  //             route.params &&
  //             route.params.paramKeyCompany.filter(
  //               job => e[0][0] === job.CompanyName,
  //             ).length != 0
  //           ) {
  //             let s =
  //               route.params &&
  //               route.params.paramKeyCompany.filter(
  //                 job => e[0][0] === job.CompanyName,
  //               );
  //             s.forEach((ee, i) => {
  //               if (!job_push.flat().includes(ee.JobName)) {
  //                 if (ee.JobName !== null) {
  //                   job_push.push([ee.JobName]);
  //                 } else {
  //                   // job_push=null
  //                 }
  //               }
  //             });

  //             return job_push.length === 0
  //               ? [[e[0][0]]]
  //               : [[e[0][0]], job_push];
  //           }

  //           return [[e[0][0]]];
  //         });

  //         // phase push
  //         let result3 = result2.map(e => {
  //           if (e[1]) {
  //             let modified = e[1].map(ee => {
  //               let phase_push = [];

  //               if (ee[0]) {
  //                 if (
  //                   route.params &&
  //                   route.params.paramKeyCompany.filter(
  //                     job => ee[0] === job.JobName,
  //                   ).length != 0
  //                 ) {
  //                   let phasefil =
  //                     route.params &&
  //                     route.params.paramKeyCompany.filter(
  //                       job => ee[0] === job.JobName,
  //                     );

  //                   phasefil.forEach(item => {
  //                     if (item.PhaseCodeName !== null) {
  //                       phase_push.push([
  //                         item.PhaseCodeName,
  //                         `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
  //                         `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
  //                         `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
  //                         `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
  //                         `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
  //                         `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
  //                         `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
  //                         `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
  //                       ]);
  //                     }
  //                   });

  //                   return phase_push.length === 0
  //                     ? [ee[0]]
  //                     : [ee[0], phase_push];
  //                 }
  //               }

  //               return ee;
  //             });

  //             return [[e[0][0]], modified];
  //           }

  //           return e;
  //         });

  //         setTableData(result3);
  //       }
  //       SetAllCompany(data);
  //       SetCompany(data);
  //       setTimeout(() => {
  //         setCompanyLoading(false);
  //       }, 2000);
  //     });
  //   });
  // };

  // Get Employee liGetEmployeest
  // const  = async () => {
  //   let Userid = await AsyncStorage.getItem('Userid');
  //   db.transaction(tx => {
  //     setEmployeeloading(true);
  //     tx.executeSql(`SELECT * FROM User`, [], async (tx, res) => {
  //       var temp = [];

  //       for (let i = 0; i < res.rows.length; i++) {
  //         temp.push(res.rows.item(i));
  //       }

  //       let newArray = temp.map(item => {
  //         return {
  //           key: item.Username,
  //           value: item.EmployeeID,
  //           status: false,
  //           check: false,
  //         };
  //       });

  //       const data = newArray.filter(
  //         i => i.check == false && i.value != Userid,
  //       );

  //       setEmployee(data);

  //       setTimeout(() => {
  //         setEmployeeloading(false);
  //       }, 1000);
  //     });
  //   });
  // };

  // Get Username from localstorage
  const getData = async () => {
    let json = await AsyncStorage.getItem('UserDetails');
    var filter = JSON.parse(json);
    var data = filter.map(e => e.value);
    setLoginUsername(filter.map(e => e.key)[0]);
    Usernamelist.push(filter.map(e => e.key)[0]);
    EmployeeID.push(filter.map(e => e.value)[0]);
  };

  useEffect(() => {
    GetUserCompany();
    GetUserEarningsCode();
  }, [Usernamelist, indexvalue]);

  //Get Earnings code
  const GetUserEarningsCode = () => {
    db.transaction(tx => {
      var query =
        "select UserRole, EarningsCode,VPEmployeeID,EmployeeID from employee where FullName ='" +
        Usernamelist[indexvalue] +
        "'";

      tx.executeSql(query, [], (tx, res) => {
        var temp = [];
        var len = res.rows.length;
        if (len > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          SetEarningsCode(temp[0].EarningsCode);
          SetSelectedUserRole(temp[0].UserRole);
          SetVPEmployeeID(temp[0].VPEmployeeID);
          setSelectedEmployeeId(temp[0].EmployeeID);
        }
      });
    });

    /// HasEstimatedProjectCompletionDate

    db.transaction(tx => {
      var query = `select HasEstimatedProjectCompletionDate from user where EmployeeId = (select EmployeeId from Employee where FullName = '${Usernamelist[indexvalue]}')`;

      tx.executeSql(query, [], (tx, res) => {
        var temp = [];
        var len = res.rows.length;
        if (len > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          SetHasEstimatedProjectCompletionDate(
            temp[0].HasEstimatedProjectCompletionDate,
          );
        }
      });
    });
  };
  // get Company
  const GetUserCompany = () => {
    db.transaction(tx => {
      var query =
        'select * from LkpCompany where CompanyID in  ( ' +
        "Select Company1 from Employee where EmployeeID =(select EmployeeID from Employee where fullname  ='" +
        Usernamelist[indexvalue] +
        "')" +
        "union Select Company2 from Employee where EmployeeID =(select EmployeeID from Employee where fullname  ='" +
        Usernamelist[indexvalue] +
        "')" +
        "union Select Company3 from Employee where EmployeeID =(select EmployeeID from Employee where fullname  ='" +
        Usernamelist[indexvalue] +
        "')" +
        "union Select Company4 from Employee where EmployeeID =(select EmployeeID from Employee where fullname  ='" +
        Usernamelist[indexvalue] +
        "')" +
        "union Select Company5 from Employee where EmployeeID =(select EmployeeID from Employee where fullname ='" +
        Usernamelist[indexvalue] +
        "')" +
        ' )';

      tx.executeSql(query, [], (tx, res) => {
        var temp = [];
        var len = res.rows.length;
        if (len > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map(item => {
            return {
              key: '' + item.CompanyID + '$$$' + item.CompanyName + '',
              value: '' + item.CompanyID + '*#^*' + item.CompanyName + '',
              status: false,
              check: false,
              ID: item.CompanyID,
            };
          });

          const data = newArray.filter(i => i.check == false);
          var result = data.filter(function (o1) {
            return !WholeData.some(function (o2) {
              if (o2.EmployeeID == UserID[indexvalue]) {
                return o2.CompanyID === o1.ID;
              }
            });
          });
          const updatedresult = result.map(item => {
            if (item.check === true) {
              // If the id matches the one we want to update, return a new object with the updated age
              return {...item, check: false};
            }
            // Otherwise, return the original object
            return item;
          });

          SetCompany(updatedresult);
        }
      });
    });
  };
  const Getdatajobs = () => {
    setJobLoading(true);
    let q = `
    select JobID , JobName , JobNo from (select * from LkpJob
    where isactive=1

    and JobID = -1 and 1 = 1=(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END),0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
    )

    union

     select JobID,JobName,JobNo from LkpJob where IsActive =1

             and
           JobID <> -1


         and  0 =(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), 0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
    `;

    db.transaction(tx => {
      tx.executeSql(
        q,
        [],

        (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let dJobs = temp.filter(e => e.JobID < 0);
          let Otherjobs = temp.filter(e => e.JobID > 0);
          Otherjobs.sort((a, b) => b.JobNo.localeCompare(a.JobNo));
          temp = [...dJobs, ...Otherjobs];
          let newArray = temp.map(item => {
            return {
              key: '' + item.JobID + '$$$' + item.JobName + '$$$' + item.JobNo,
              value:
                item.JobID + '*#^*' + item.JobNo + '*#^*' + item.JobName + '',
              check: false,
              ID: item.JobID,
              status: false,
            };
          });
          setcopyjob(newArray);
          setTimeout(() => {
            setJobLoading(false);
          }, 1000);
        },
      );
    });
  };

  // Get JOblist

  const GetJobs = (selectedCompany, company_index = null, type) => {
    setselectedcompanyname(selectedCompany);
    setcompanyIndex(company_index);
    setJobLoading(true);
    //1=(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), ' ') AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = 9277)
    if (type === 'View All') {
      let q = `



      select JobID , JobName , JobNo from (select * from LkpJob
      where isactive=1 and CompanyId = ${selectedCompany}

      and JobID = -1 and 1 = 1=(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END),0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
      )

      union

       select JobID,JobName,JobNo from LkpJob where IsActive =1

             AND [CompanyID]  = ${selectedCompany}  and
             JobID <> -1


           and  0 =(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), 0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
      `;

      db.transaction(tx => {
        tx.executeSql(
          q,
          [],

          (tx, res) => {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }
            let dJobs = temp.filter(e => e.JobID < 0);
            let Otherjobs = temp.filter(e => e.JobID > 0);
            Otherjobs.sort((a, b) => b.JobNo.localeCompare(a.JobNo));
            temp = [...dJobs, ...Otherjobs];
            let newArray = temp.map(item => {
              return {
                key:
                  '' + item.JobID + '$$$' + item.JobName + '$$$' + item.JobNo,
                value:
                  item.JobID + '*#^*' + item.JobNo + '*#^*' + item.JobName + '',
                check: false,
                ID: item.JobID,
                status: false,
              };
            });
            const data = newArray.filter(i => i.check == false);
            let check_already;
            let removed_id = [];
            if (TableData[company_index][1]) {
              TableData[company_index][1].forEach(e => {
                removed_id.push(e[0].split('+')[0].trim());
              });
            }

            check_already = data.map((e, i) => {
              if (removed_id && removed_id.includes(e.value)) {
                return {
                  ...e,
                  check: true,
                  status: true,
                };
              } else {
                return {...e};
              }
            });

            setAllJobs(data);
            setTimeout(() => {
              setJobLoading(false);
            }, 1000);
            setJobs(check_already);
          },
        );
      });
    } else {
      //
      //   ` select IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END),'') from Employee where employeeid =
      //   (select EmployeeID from Employee where fullname  ='${Usernamelist[indexvalue]}')
      // `
      // );
      // var q =`select JobID,JobName,JobNo from LkpJob where IsActive =1 and IsRestricted = 1 and CompanyID = ${selectedCompany}
      // or JobId = -1 and 1=(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), ' ') AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})

      // union
      // select JobID,JobName,JobNo from LkpJob where IsActive =1
      // AND  ( [ProjectMgr] = ${VPEmployeeID} or[udEstimator] =  ${VPEmployeeID} OR [udProjectEngineer] =  ${VPEmployeeID} OR [udProjectAssistant] =  ${VPEmployeeID} OR [udProjectAccountant] =  ${VPEmployeeID}
      //   OR [udCarpenterForeman] =  ${VPEmployeeID} OR [udSuperintendent] =  ${VPEmployeeID}  OR [udSPEstimator] =  ${VPEmployeeID}  OR [udSP3Estimator] =  ${VPEmployeeID}  OR [udSP3Foreman] =  ${VPEmployeeID}
      //   OR [udPrincipal] =  ${VPEmployeeID}  OR [udSuperintendant2] =  ${VPEmployeeID} OR [udPM2] =  ${VPEmployeeID} OR [udEstimator2] =  ${VPEmployeeID}  OR [udPE2] =  ${VPEmployeeID}  OR [udMEPCoord] =  ${VPEmployeeID}
      //   OR [udEstimator3] =  ${VPEmployeeID}  OR [udEstimator4] =  ${VPEmployeeID} OR [udEstimator5] =  ${VPEmployeeID} OR [JobID] < -1
      //  ) AND [CompanyID]  = ${selectedCompany}  and
      //  JobID <> -1 and  0 =(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), ' ') AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
      //  ORDER BY [JobName] DESC
      //  `;

      // if (SelectedUserRole === 'admin' || SelectedUserRole === 'office') {
      let q = `



      select JobID , JobName , JobNo from (select * from LkpJob
      where isactive=1 and CompanyId = ${selectedCompany}

      and JobID = -1 and 1 = 1=(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END),0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
      )

      union

       select JobID,JobName,JobNo from LkpJob where IsActive =1
            AND
             ( [ProjectMgr] = ${VPEmployeeID} or[udEstimator] =  ${VPEmployeeID} OR [udProjectEngineer] =  ${VPEmployeeID} OR [udProjectAssistant] =  ${VPEmployeeID} OR [udProjectAccountant] =  ${VPEmployeeID}
              OR [udCarpenterForeman] =  ${VPEmployeeID} OR [udSuperintendent] =  ${VPEmployeeID}  OR [udSPEstimator] =  ${VPEmployeeID}  OR [udSP3Estimator] =  ${VPEmployeeID}  OR [udSP3Foreman] =  ${VPEmployeeID}
              OR [udPrincipal] =  ${VPEmployeeID}  OR [udSuperintendant2] =  ${VPEmployeeID} OR [udPM2] =  ${VPEmployeeID} OR [udEstimator2] =  ${VPEmployeeID}  OR [udPE2] =  ${VPEmployeeID}  OR [udMEPCoord] =  ${VPEmployeeID}
              OR [udEstimator3] =  ${VPEmployeeID}  OR [udEstimator4] =  ${VPEmployeeID} OR [udEstimator5] =  ${VPEmployeeID} OR [JobID] < -1
             )

             AND [CompanyID]  = ${selectedCompany}  and
             JobID <> -1


           and  0 =(select  IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), 0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId})
      `;

      db.transaction(tx => {
        tx.executeSql(
          q,
          [],
          (tx, res) => {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }
            let newArray = temp.map(item => {
              return {
                key:
                  '' + item.JobID + '$$$' + item.JobName + '$$$' + item.JobNo,
                value:
                  item.JobID + '*#^*' + item.JobNo + '*#^*' + item.JobName + '',
                check: false,
                ID: item.JobID,
                status: false,
              };
            });

            const data = newArray.filter(i => i.check == false);
            let check_already;
            let removed_id = [];
            if (TableData[company_index][1]) {
              TableData[company_index][1].forEach(e => {
                removed_id.push(e[0].split('+')[0].trim());
              });
            }
            check_already = data.map((e, i) => {
              if (removed_id && removed_id.includes(e.value)) {
                return {
                  ...e,
                  check: true,
                  status: true,
                };
              } else {
                return {...e};
              }
            });

            setAllJobs(data);
            setTimeout(() => {
              setJobLoading(false);
            }, 1000);
            setJobs(check_already);
          },

          er => {},
        );
      });
      // } else {
      //   setJobs([]);
      //   setTimeout(() => {
      //     setJobLoading(false);
      //   }, 1000);
      // }
    }
  };
  const CopyAddEmployeeName = () => {
    let selectEmployee = [];
    let selectEmployeeID = [];
    let dd = GetEmpId.map(d => {
      selectEmployee.push(d.key);
      selectEmployeeID.push(d.value);
    });
    GetUserCompany();
    setCopyModalVisible(false);
    setUsernamelist(prev => [...prev, ...selectEmployee]);
    selectEmployee.forEach(e => {
      let selectedusername = e;

      let obj = {};
      obj[selectedusername] = [];
      obj['total_RegularTime'] = 0;
      obj['total_DBL'] = 0;
      obj['total_Overtime'] = 0;
      dispatch(AddData(obj));
      dispatch(Temp_Add(obj));
    });
    setEmployeeID(prev => [...prev, ...selectEmployeeID]);
    let modified = Employee.map(e => {
      if (e.check === true) {
        return {...e, status: true};
      }
      return {...e};
    });
    setEmployee(modified);
  };

  // get phase list
  const GetPhase = (SetSelectedJob, type) => {
    setPhaseLoading(true);

    if (type === 'View All') {
      db.transaction(tx => {
        var query = '';
        query += `select * from  (select PhaseCodeID, PhaseCode,PhaseCodeName from LkpPhaseCode lp left join timesheetJob Tj on tj.[JobId] = lp.[JOBId]
          where IsActive = 1 AND [PhaseGroup] IN (SELECT [PhaseGroup] FROM [LkpCompany] where CompanyId = (SELECT companyid FROM [LkpJob] where JobID =${SetSelectedJob}))
          AND [IsRestricted] = 0
      `;

        if (SelectedUserRole === 'field') {
          query += '  	AND [AllowFieldUse] = 1 ';
        }

        query += ` union
        select PhaseCodeID, PhaseCode,PhaseCodeName from LkpPhaseCode where IsActive = 1 AND [IsRestricted] = 0 AND PhaseCodeID = -1

        ) ph
        `;

        tx.executeSql(query, [], (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value: item.PhaseCodeID + '*#^*' + item.PhaseCodeName,
              check: false,
              status: false,
            };
          });

          let removed_id = [];

          TableData[company_index] &&
            TableData[company_index][1] &&
            TableData[company_index][1][phasejob_index] &&
            TableData[company_index][1][phasejob_index][1] &&
            TableData[company_index][1][phasejob_index][1].forEach(e => {
              removed_id.push(e[0].split('+')[0].trim());
            });

          let check_already;

          check_already = newArray.map((e, i) => {
            if (removed_id !== 0) {
              if (removed_id.includes(e.value)) {
                return {
                  ...e,
                  check: true,
                  status: true,
                };
              } else {
                return {...e};
              }
            } else {
              return {...e};
            }
          });

          const data = newArray.filter(i => i.check == false);

          setPhase(check_already);
          setPhaseLoading(false);
          setAllPhase(data);
        });
      });
    } else {
      db.transaction(tx => {
        // var query =
        //   'select  * from LkpPhaseCode where JobID = ' +
        //   SetSelectedJob +
        //   ' and IsActive = 1 ' +
        //   'AND AllowFieldUse = 1 and IsRestricted = 0 and PhaseGroup = ' +
        //   '(select PhaseGroup from LkpCompany   where CompanyId =( select CompanyId from LkpJob where JobID = ' +
        //   SetSelectedJob +
        //   '))';

        var query = '';
        query += `select * from LkpPhaseCode where IsActive = 1  AND JobID = ${SetSelectedJob}
      AND [PhaseGroup] IN (SELECT [PhaseGroup] FROM [LkpCompany] where CompanyId = ((SELECT companyid FROM [LkpJob] where JobID = ${SetSelectedJob} )) )
      AND [IsRestricted] = 1 AND	PhaseCodeID <> (SELECT [PhaseGroup] FROM [LkpCompany] where CompanyId = ((SELECT companyid FROM [LkpJob] where JobID = ${SetSelectedJob} ))  )

       `;

        if (SelectedUserRole === 'field') {
          query += '  	AND [AllowFieldUse] = 1';
        }
        query += ` ORDER BY [PhaseCodeName]  `;

        tx.executeSql(query, [], (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          var result = temp.filter(function (o1) {
            // filter out (!) items in result2
            return !WholeData.some(function (o2) {
              return o2.PhaseCodeID === o1.PhaseCodeID;
              // assumes unique id
            });
          });
          let newArray = result.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value: item.PhaseCodeID + '*#^*' + item.PhaseCodeName,
              check: false,
              status: false,
            };
          });

          let removed_id = [];

          TableData[company_index] &&
            TableData[company_index][1] &&
            TableData[company_index][1][phasejob_index] &&
            TableData[company_index][1][phasejob_index][1] &&
            TableData[company_index][1][phasejob_index][1].forEach(e => {
              removed_id.push(e[0].split('+')[0].trim());
            });

          let check_already;

          check_already = newArray.map((e, i) => {
            if (removed_id !== 0) {
              if (removed_id.includes(e.value)) {
                return {
                  ...e,
                  check: true,
                  status: true,
                };
              } else {
                return {...e};
              }
            } else {
              return {...e};
            }
          });

          const data = newArray.filter(i => i.check == false);

          setPhase(check_already);
          setPhaseLoading(false);
          setAllPhase(data);
        });
      });
    }
  };

  // company modal visible
  const alertCompany = () => {
    //setTableData(userEmail)

    GetUserCompany();
    setmodalComapanyVisible(true);
  };

  // companyjobvisible
  const alertJob = (e, job_i) => {
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete job popup open and do functionality respectively
  const deletejob = (e, job_i, company_index, company_detail, ss) => {
    company_id = company_detail[0][0];
    selectjob = e;
    if (ss[1] && ss[1].length !== 0) {
      if (ss[1][0][1] != undefined) {
        setdeletetime(ss[1]);
      }
    }
    setcompany_index(company_index);
    setdeletejob_modal(true);
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete company popup open and do functionality respectively
  const deleteCompany = (e, company_index, com) => {
    deleteCompanyid = e.split('-')[0];
    setdeleteCompany_modal(true);
    setmodalComapanyVisible(true);
    setselectedcompanyname(e);
    if (com.length > 1) {
      let arr = [];
      com[1].forEach(e => {
        if (e[1]) {
          e[1].forEach(e1 => arr.push(e1));
        }
      });

      console.log({arr});
      setdeletetime(arr);
    }
    setcompany_index(company_index);
    setdeleteCompany_modal(true);
    setmodalComapanyVisible(true);
    setselectedcompanyname(e);

    let splited = e.includes('*#^*') ? e.split('*#^*')[1] : e;
    let result = CJP['company'].filter(item => {
      return !item.toString().includes(splited);
    });

    setCJP({
      company: result,
      job: [],
      phase: [],
    });
    // console.log({e});
    // setdeltecompy_funcpass(()=>()=>{
    // })
  };

  const displaySelectedname = () => {
    setopenmodalEmployeeVisible(true);
    setUserList(Usernamelist[indexvalue]);
  };
  // delete phase popup open and do functionality respectively
  const deletePhase = (e, phase_i, job_i, company_i, qq, ss) => {
    selectphaseid = ss;
    deletephaseid = e;
    setcompany_index(company_i);
    setjob_index(job_i), setphasejob_index(phase_i);
    setmodalPhaseVisible(true);
    setdeletePhase_modal(true);
    setselectedphasename(e);
    setdeletetime(qq);
  };

  //get company index and job index to add phase
  const alertPhase = (e, company_i, job_i, ss) => {
    selectedjob_id = ss[0];
    setphasejob_index(job_i);

    setcompany_index(company_i);

    setmodalPhaseVisible(true);
  };

  const AddEmployeeName = async (selectEmployee, selectEmployeeID) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    db.transaction(txn => {
      for (let i = 0; i < selectEmployeeID.length; i++) {
        var TimesheetID = generateGuidQuickly();
        var DateTime = CurrentUTCTime();
        txn.executeSql(
          'INSERT INTO TimesheetEmployee (TimesheetEmployeeID, TimesheetID, EmployeeID, CreatedBy, CreatedOn)' +
            'VALUES (?, ?, ?, ?, ?);',
          [
            TimesheetID,
            route.params.paramKeyTimesheetID,
            selectEmployeeID[i],
            SubmitUserID,
            DateTime,
          ],
          function (tx, res) {
            // if (res.rowsAffected > 0) {
            GetExistingEmployee();
            // }
          },
        );
        txn.executeSql(
          'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
            ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
          [
            'I',
            'TimesheetEmployee',
            TimesheetID,
            '-',
            '',
            DateTime,
            Deviceid,
            0,
            0,
            '-',
          ],
        );
      }
    });
    GetUserCompany();

    if (modalEmployeeVisible === true && deleteEmployee_modal !== true) {
      setmodalEmployeeVisible(false);

      setUsernamelist(prev => [
        ...prev,
        ...selectEmployee, //.sort((a, b) => a.localeCompare(b)),
      ]);
      setUserID(prev => [...prev, ...selectEmployeeID]);
      selectEmployee.forEach(e => {
        let selectedusername = e;
        let obj = {};
        obj[selectedusername] = [];
        obj['total_RegularTime'] = 0;
        obj['total_DBL'] = 0;
        obj['total_Overtime'] = 0;
        dispatch(AddData(obj));
        dispatch(Temp_Add(obj));
      });
      setEmployeeID(prev => [...prev, ...selectEmployeeID]);
      let modified = Employee.map(e => {
        if (e.check === true) {
          return {...e, status: true};
        }

        return {...e};
      });

      setEmployee(modified);
    }
  };

  // This function related to add and delete company,job,phase row in table respectively
  const handleAddRow = async (
    SelectedPhase1,
    SelectedPhasename1,
    SelectedJobname1,
    selectetJobID,
    SelectedJobCode1,
    selectedCompany,
    selectedCompanyID,
  ) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let SelectedTimesheetEmployeeID = ExistingEmployee.filter(
      item => item.value == UserID[indexvalue],
    ).map(item => item.TimesheetEmployeeID);
    let SelectedTimesheetCompanyID = ExistingCompany.filter(
      item => item.ID == selectcom && item.NewEmployeeID == UserID[indexvalue],
    ).map(item => item.TimesheetCompanyID);
    if (modalComapanyVisible === true && deleteComapany_modal !== true) {
      // Add only company
      if (selectedCompany.length === 0) {
        Alert.alert('Please Select Company');
        return;
      }
      selectedCompany.forEach((e, i) => {
        var companyguid = generateGuidQuickly();
        setTableData(prev => [...prev, [[`${e}+${companyguid}`]]]);
      });
      CompanyID.push(selectedCompanyID[0]);
      TableData.map(e => {
        setCJP(prev => ({
          company: [...prev.company, e[0][0].split('+')[0]],
          job: [],
          phase: [],
        }));
      });

      db.transaction(txn => {
        for (let i = 0; i < selectedCompanyID.length; i++) {
          var TimesheetID = generateGuidQuickly();
          var DateTime = CurrentUTCTime();

          txn.executeSql(
            'INSERT INTO TimesheetCompany (TimesheetCompanyID,TimesheetEmployeeID, CompanyID, CreatedBy, CreatedOn)' +
              ' VALUES (?, ?, ?, ?, ?);',
            [
              TimesheetID,
              SelectedTimesheetEmployeeID[0],
              selectedCompanyID[i],
              SubmitUserID,
              DateTime,
            ],
            function (tx, res) {
              if (res.rowsAffected > 0) {
                GetExistingCompany();
              }
            },
          );
          txn.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'I',
              'TimesheetCompany',
              TimesheetID,
              '-',
              '',
              DateTime,
              Deviceid,
              0,
              0,
              '-',
            ],
            function (tx, res) {
              GetExistingCompany();
            },
          );
        }
      });
    } else if (modalJobVisible === true && deletejob_modal !== true) {
      //Add Job only
      let empty = [];
      const add = id => {
        SelectedJobname1.forEach((job_e, i) => {
          var jobguid = generateGuidQuickly();
          empty.push([
            `${job_e} +${id}+${jobguid}` +
              '*#^*' +
              `${date.toLocaleDateString('en-US')}`,
          ]);
        });
        return empty;
      };
      JobID.push(selectetJobID[0]);

      let added_job = TableData.map((e, company_i) => {
        if (company_i === job_index) {
          if (e.length > 1) {
            return [e[0], [...e[1], ...add(e[0][0].split('+')[1])]];
          }

          return [...e, [...add(e[0][0].split('+')[1])]];
        }

        return e;
      });

      setTableData(added_job);
      const newdata = Jobs.map(e => {
        if (e.check === true) {
          return {...e, status: true};
        }
        return {...e};
      });

      setJobs(newdata);

      db.transaction(txn => {
        for (let i = 0; i < selectetJobID.length; i++) {
          var TimesheetID = generateGuidQuickly();
          var DateTime = CurrentUTCTime();
          txn.executeSql(
            'INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID, CreatedBy, CreatedOn)' +
              'VALUES (?, ?, ?, ?, ?);',

            [
              TimesheetID,
              SelectedTimesheetCompanyID[0],
              selectetJobID[i],
              SubmitUserID,
              DateTime,
            ],
            function (tx, res) {
              if (res.rowsAffected > 0) {
                GetExistingJobs();
              }
            },
          );
          txn.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'I',
              'TimesheetJob',
              TimesheetID,
              '-',
              '',
              DateTime,
              Deviceid,
              0,
              0,
              '-',
            ],
          );
        }
      });
      setmodalJobVisible(false);
    } else if (modalJobVisible === true && deletejob_modal === true) {
      // delete job
      let deletejob = TableData.map((e, i) => {
        if (company_index === i) {
          e[1].splice(job_index, 1);
          return [e[0], e[1]];
        }

        return e;
      });
      setTableData(deletejob);
      if (deletetime != null) {
        let reg = 0;
        let obt = 0;
        let dbl = 0;

        for (let i = 0; i < deletetime.length; i++) {
          totalgroup1.reg1 =
            totalgroup1.reg1 - parseFloat(deletetime[i][1].split('/')[0]);
          totalgroup1.ovt1 =
            totalgroup1.ovt1 - parseFloat(deletetime[i][1].split('/')[1]);
          totalgroup1.dbl1 =
            totalgroup1.dbl1 - parseFloat(deletetime[i][1].split('/')[2]);

          totalgroup2.reg2 =
            totalgroup2.reg2 - parseFloat(deletetime[i][2].split('/')[0]);
          totalgroup2.ovt2 =
            totalgroup2.ovt2 - parseFloat(deletetime[i][2].split('/')[1]);
          totalgroup2.dbl2 =
            totalgroup2.dbl2 - parseFloat(deletetime[i][2].split('/')[2]);

          totalgroup3.reg3 =
            totalgroup3.reg3 - parseFloat(deletetime[i][3].split('/')[0]);
          totalgroup3.ovt3 =
            totalgroup3.ovt3 - parseFloat(deletetime[i][3].split('/')[1]);
          totalgroup3.dbl3 =
            totalgroup3.dbl3 - parseFloat(deletetime[i][3].split('/')[2]);

          totalgroup4.reg4 =
            totalgroup4.reg4 - parseFloat(deletetime[i][4].split('/')[0]);
          totalgroup4.ovt4 =
            totalgroup4.ovt4 - parseFloat(deletetime[i][4].split('/')[1]);
          totalgroup4.dbl4 =
            totalgroup4.dbl4 - parseFloat(deletetime[i][4].split('/')[2]);

          totalgroup5.reg5 =
            totalgroup5.reg5 - parseFloat(deletetime[i][5].split('/')[0]);
          totalgroup5.ovt5 =
            totalgroup5.ovt5 - parseFloat(deletetime[i][5].split('/')[1]);
          totalgroup5.dbl5 =
            totalgroup5.dbl5 - parseFloat(deletetime[i][5].split('/')[2]);

          totalgroup6.reg6 =
            totalgroup6.reg6 - parseFloat(deletetime[i][6].split('/')[0]);
          totalgroup6.ovt6 =
            totalgroup6.ovt6 - parseFloat(deletetime[i][6].split('/')[1]);
          totalgroup6.dbl6 =
            totalgroup6.dbl6 - parseFloat(deletetime[i][6].split('/')[2]);

          totalgroup7.reg7 =
            totalgroup7.reg7 - parseFloat(deletetime[i][7].split('/')[0]);
          totalgroup7.ovt7 =
            totalgroup7.ovt7 - parseFloat(deletetime[i][7].split('/')[1]);
          totalgroup7.dbl7 =
            totalgroup7.dbl7 - parseFloat(deletetime[i][7].split('/')[2]);

          reg += parseFloat(deletetime[i][8].split('/')[0]);
          obt += parseFloat(deletetime[i][8].split('/')[1]);
          dbl += parseFloat(deletetime[i][8].split('/')[2]);
        }

        settotal_RegularTime(total_RegularTime - reg);
        settotal_Overtime(total_Overtime - obt);
        settotal_DBL(total_DBL - dbl);
      }
      var jobid = selectjob.split('*')[0];
      var companyid = company_id.replace('*#^*', '  ').split('-')[0];
      var selectedCompanyid = Array.from(new Set(companyid.split(' ')))
        .toString()
        .replace(/\,/g, '');
      let NewTimesheetCompanyID = ExistingCompany.filter(
        item =>
          item.ID == selectedCompanyid &&
          item.NewEmployeeID == UserID[indexvalue],
      ).map(item => item.TimesheetCompanyID);
      let delete_phase = ExistingJob.filter(
        item => item.TimesheetCompanyID == NewTimesheetCompanyID[0],
      ).map(item => item.TimesheetJobID);

      // Add Devicesynctablelog job id and phase id after delete
      let timesheetJobiddata = null;

      db.transaction(txn => {
        txn.executeSql(
          `SELECT TimesheetJobID, JobID FROM TimesheetJob where TimesheetCompanyID=?  AND JobID=?`,
          [NewTimesheetCompanyID[0], jobid],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              timesheetJobiddata = res.rows.item(i).TimesheetJobID;
            }
          },
        );
      });

      db.transaction(txn => {
        var dateTime = CurrentUTCTime();
        let query = `
    INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)
    select  'D' as Action,'TimesheetJob' as TableName,TimesheetJobID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime,'${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from TimesheetJob WHERE TimesheetJobID = '${timesheetJobiddata}'
    UNION
    select  'D' as Action,'TimesheetPhaseCode' as TableName,TimesheetPhaseCodeID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime,'${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetPhaseCode tp LEFT JOIN TimesheetJob tj on tj.TimesheetJobID = tp.TimesheetJobID WHERE tj.TimesheetJobID = '${timesheetJobiddata}'
    
    `;

        txn.executeSql(query, []);
      });

      db.transaction(txn => {
        txn.executeSql(
          `delete from TimesheetJob where TimesheetCompanyID=? AND JobID=?`,
          [NewTimesheetCompanyID[0], jobid],
          async function (tx, res) {
            GetExistingJobs();
            txn.executeSql(
              `delete from TimesheetPhaseCode where TimesheetJobID=?`,
              [delete_phase[0]],
              async function (tx, res) {
                GetExistingPhase();
              },
            );
          },
        );
      });
      setTableData(deletejob);
      setdeletetime(null);
      setdeleteCompany_modal(false);
      setselectedcompanyname(null);
      setmodalComapanyVisible(false);
      setdeletejob_modal(false);
      setmodalJobVisible(false);
    } else if (modalComapanyVisible === true && deleteComapany_modal === true) {
      // delete company
      let removed = Company.map(e => {
        if (e.value.trim() === selectedcompanyname.trim()) {
          return {...e, status: false, check: false};
        }
        return {...e};
      });
      SetCompany(removed);
      //  SetCompany(removed); // var objIndex = AllCompany.filter((obj) => obj.value ==  selectedcompanyname); // Company.push(objIndex[0]);

      TableData.splice(company_index, 1);

      var companyid = selectedcompanyname.replace('*#^*', '  ').split('-')[0];
      var selectedCompanyid = Array.from(new Set(companyid.split(' ')))
        .toString()
        .replace(/\,/g, '');
      let delete_job = ExistingCompany.filter(
        item =>
          item.ID == deleteCompanyid &&
          item.TimesheetEmployeeID == SelectedTimesheetEmployeeID[0],
      ).map(item => item.TimesheetCompanyID);
      let delete_phase = ExistingJob.filter(
        item => item.TimesheetCompanyID == delete_job[0],
      ).map(item => item.TimesheetJobID);
      // Add Devicesynctablelog Company id, job id and phase id after delete
      let timesheetCompanyiddata = null;

      db.transaction(txn => {
        txn.executeSql(
          `SELECT * FROM TimesheetCompany where TimesheetEmployeeID=? AND CompanyID=?`,
          [SelectedTimesheetEmployeeID[0], selectedCompanyid],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              timesheetCompanyiddata = res.rows.item(i).TimesheetCompanyID;
            }
          },
        );
      });

      db.transaction(txn => {
        var dateTime = CurrentUTCTime();

        let query = `INSERT INTO DeviceSynchDataLog (Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)
      select  'D' as Action,'TimesheetCompany' as TableName,TimesheetCompanyID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime,'${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetCompany WHERE TimesheetCompanyID = '${timesheetCompanyiddata}'
      UNION select  'D' as Action,'TimesheetJob' as TableName,TimesheetJobID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from TimesheetJob tj LEFT JOIN TimesheetCompany tc on tc.TimesheetCompanyID = tj.TimesheetCompanyID WHERE tc.TimesheetCompanyID = '${timesheetCompanyiddata}'
      UNION select  'D' as Action,'TimesheetPhaseCode' as TableName,TimesheetPhaseCodeID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime, '${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from TimesheetPhaseCode tp  LEFT JOIN TimesheetJob tj on tj.TimesheetJobID = tp.TimesheetJobID   LEFT JOIN  TimesheetCompany tc on tc.TimesheetCompanyID = tj.TimesheetCompanyID   WHERE tc.TimesheetCompanyID = '${timesheetCompanyiddata}'`;

        txn.executeSql(query, [], function (tx, res) {
          console.log('res.rowsAffected', res.rowsAffected);
          if (res.rowsAffected > 0) {
            txn.executeSql(
              `delete from TimesheetPhaseCode where TimesheetJobID=?`,
              [delete_phase[0]],
              async function (tx, res) {
                GetExistingPhase();

                txn.executeSql(
                  `delete from TimesheetJob where TimesheetCompanyID=?`,
                  [delete_job[0]],
                  async function (tx, res) {
                    GetExistingJobs();

                    txn.executeSql(
                      `delete from TimesheetCompany where TimesheetEmployeeID=? AND CompanyID=? `,
                      [SelectedTimesheetEmployeeID[0], selectedCompanyid],
                      async function (tx, res) {
                        GetExistingCompany();
                      },
                    );
                  },
                );
              },
            );
          }
        });
      });
      setdeleteCompany_modal(false);
      setselectedcompanyname(null);
      setmodalComapanyVisible(false);
      if (deletetime != null) {
        let reg = 0;
        let obt = 0;
        let dbl = 0;

        for (let i = 0; i < deletetime.length; i++) {
          totalgroup1.reg1 =
            totalgroup1.reg1 - parseFloat(deletetime[i][1].split('/')[0]);
          totalgroup1.ovt1 =
            totalgroup1.ovt1 - parseFloat(deletetime[i][1].split('/')[1]);
          totalgroup1.dbl1 =
            totalgroup1.dbl1 - parseFloat(deletetime[i][1].split('/')[2]);

          totalgroup2.reg2 =
            totalgroup2.reg2 - parseFloat(deletetime[i][2].split('/')[0]);
          totalgroup2.ovt2 =
            totalgroup2.ovt2 - parseFloat(deletetime[i][2].split('/')[1]);
          totalgroup2.dbl2 =
            totalgroup2.dbl2 - parseFloat(deletetime[i][2].split('/')[2]);

          totalgroup3.reg3 =
            totalgroup3.reg3 - parseFloat(deletetime[i][3].split('/')[0]);
          totalgroup3.ovt3 =
            totalgroup3.ovt3 - parseFloat(deletetime[i][3].split('/')[1]);
          totalgroup3.dbl3 =
            totalgroup3.dbl3 - parseFloat(deletetime[i][3].split('/')[2]);

          totalgroup4.reg4 =
            totalgroup4.reg4 - parseFloat(deletetime[i][4].split('/')[0]);
          totalgroup4.ovt4 =
            totalgroup4.ovt4 - parseFloat(deletetime[i][4].split('/')[1]);
          totalgroup4.dbl4 =
            totalgroup4.dbl4 - parseFloat(deletetime[i][4].split('/')[2]);

          totalgroup5.reg5 =
            totalgroup5.reg5 - parseFloat(deletetime[i][5].split('/')[0]);
          totalgroup5.ovt5 =
            totalgroup5.ovt5 - parseFloat(deletetime[i][5].split('/')[1]);
          totalgroup5.dbl5 =
            totalgroup5.dbl5 - parseFloat(deletetime[i][5].split('/')[2]);

          totalgroup6.reg6 =
            totalgroup6.reg6 - parseFloat(deletetime[i][6].split('/')[0]);
          totalgroup6.ovt6 =
            totalgroup6.ovt6 - parseFloat(deletetime[i][6].split('/')[1]);
          totalgroup6.dbl6 =
            totalgroup6.dbl6 - parseFloat(deletetime[i][6].split('/')[2]);

          totalgroup7.reg7 =
            totalgroup7.reg7 - parseFloat(deletetime[i][7].split('/')[0]);
          totalgroup7.ovt7 =
            totalgroup7.ovt7 - parseFloat(deletetime[i][7].split('/')[1]);
          totalgroup7.dbl7 =
            totalgroup7.dbl7 - parseFloat(deletetime[i][7].split('/')[2]);

          reg += parseFloat(deletetime[i][8].split('/')[0]);
          obt += parseFloat(deletetime[i][8].split('/')[1]);
          dbl += parseFloat(deletetime[i][8].split('/')[2]);
        }

        settotal_RegularTime(total_RegularTime - reg);
        settotal_Overtime(total_Overtime - obt);
        settotal_DBL(total_DBL - dbl);
      }
      setdeletetime(null);
      setdeleteCompany_modal(false);
      setselectedcompanyname(null);
      setmodalComapanyVisible(false);
    } else if (deletePhase_modal === true) {
      // delete phase

      let delete_phase = TableData.map((e, i) => {
        if (company_index === i) {
          // into job array

          let jobs = e[1].map((jobs, jobs_i) => {
            if (jobs_i === job_index) {
              jobs[1].splice(phasejob_index, 1);

              return [jobs[0], jobs[1] ? jobs[1] : null];
            }

            return jobs;
          });

          return [e[0], jobs];
        }

        return e;
      });
      if (deletetime != null) {
        totalgroup1.reg1 =
          totalgroup1.reg1 - parseFloat(deletetime[1].split('/')[0]);
        totalgroup1.ovt1 =
          totalgroup1.ovt1 - parseFloat(deletetime[1].split('/')[1]);
        totalgroup1.dbl1 =
          totalgroup1.dbl1 - parseFloat(deletetime[1].split('/')[2]);

        totalgroup2.reg2 =
          totalgroup2.reg2 - parseFloat(deletetime[2].split('/')[0]);
        totalgroup2.ovt2 =
          totalgroup2.ovt2 - parseFloat(deletetime[2].split('/')[1]);
        totalgroup2.dbl2 =
          totalgroup2.dbl2 - parseFloat(deletetime[2].split('/')[2]);

        totalgroup3.reg3 =
          totalgroup3.reg3 - parseFloat(deletetime[3].split('/')[0]);
        totalgroup3.ovt3 =
          totalgroup3.ovt3 - parseFloat(deletetime[3].split('/')[1]);
        totalgroup3.dbl3 =
          totalgroup3.dbl3 - parseFloat(deletetime[3].split('/')[2]);

        totalgroup4.reg4 =
          totalgroup4.reg4 - parseFloat(deletetime[4].split('/')[0]);
        totalgroup4.ovt4 =
          totalgroup4.ovt4 - parseFloat(deletetime[4].split('/')[1]);
        totalgroup4.dbl4 =
          totalgroup4.dbl4 - parseFloat(deletetime[4].split('/')[2]);

        totalgroup5.reg5 =
          totalgroup5.reg5 - parseFloat(deletetime[5].split('/')[0]);
        totalgroup5.ovt5 =
          totalgroup5.ovt5 - parseFloat(deletetime[5].split('/')[1]);
        totalgroup5.dbl5 =
          totalgroup5.dbl5 - parseFloat(deletetime[5].split('/')[2]);

        totalgroup6.reg6 =
          totalgroup6.reg6 - parseFloat(deletetime[6].split('/')[0]);
        totalgroup6.ovt6 =
          totalgroup6.ovt6 - parseFloat(deletetime[6].split('/')[1]);
        totalgroup6.dbl6 =
          totalgroup6.dbl6 - parseFloat(deletetime[6].split('/')[2]);

        totalgroup7.reg7 =
          totalgroup7.reg7 - parseFloat(deletetime[7].split('/')[0]);
        totalgroup7.ovt7 =
          totalgroup7.ovt7 - parseFloat(deletetime[7].split('/')[1]);
        totalgroup7.dbl7 =
          totalgroup7.dbl7 - parseFloat(deletetime[7].split('/')[2]);

        settotal_RegularTime(
          total_RegularTime - parseFloat(deletetime[8].split('/')[0]),
        );
        settotal_Overtime(
          total_Overtime - parseFloat(deletetime[8].split('/')[1]),
        );
        settotal_DBL(total_DBL - parseFloat(deletetime[8].split('/')[2]));
      }
      let newjobid = selectphaseid[0].split('*')[0];
      let NewTimesheetJobID = ExistingJob.filter(
        item => item.ID == newjobid && item.NewEmployeeID == UserID[indexvalue],
      ).map(item => item.TimesheetJobID);
      setdeletetime(null);
      // var objIndex = AllPhase.filter((obj) => obj.value == selectedphasename);
      // Phase.push(objIndex[0]);
      let reg1 = 0;
      let ovt1 = 0;
      let dbl1 = 0;
      // 2
      let reg2 = 0;
      let ovt2 = 0;
      let dbl2 = 0;
      // 3
      let reg3 = 0;
      let ovt3 = 0;
      let dbl3 = 0;
      // 4
      let reg4 = 0;
      let ovt4 = 0;
      let dbl4 = 0;
      // 5
      let reg5 = 0;
      let ovt5 = 0;
      let dbl5 = 0;
      // 6
      let reg6 = 0;
      let ovt6 = 0;
      let dbl6 = 0;
      // 7
      let reg7 = 0;
      let ovt7 = 0;
      let dbl7 = 0;

      let b = TableData.forEach(eee => {
        if (eee[1]) {
          eee[1].forEach((d, j) => {
            if (d[1]) {
              d[1].forEach((a, k) => {
                if (a) {
                  for (let i = 0; i <= a.length; i++) {
                    if (i === 0) {
                    } else {
                      if (i === 1) {
                        reg1 += parseFloat(a[i].split('/')[0]);
                        ovt1 += parseFloat(a[i].split('/')[1]);
                        dbl1 += parseFloat(a[i].split('/')[2]);
                      }

                      if (i === 2) {
                        reg2 += parseFloat(a[i].split('/')[0]);
                        ovt2 += parseFloat(a[i].split('/')[1]);
                        dbl2 += parseFloat(a[i].split('/')[2]);
                      }
                    }

                    if (i === 3) {
                      reg3 += parseFloat(a[i].split('/')[0]);
                      ovt3 += parseFloat(a[i].split('/')[1]);
                      dbl3 += parseFloat(a[i].split('/')[2]);
                    }

                    if (i === 4) {
                      reg4 += parseFloat(a[i].split('/')[0]);
                      ovt4 += parseFloat(a[i].split('/')[1]);
                      dbl4 += parseFloat(a[i].split('/')[2]);
                    }

                    if (i === 5) {
                      reg5 += parseFloat(a[i].split('/')[0]);
                      ovt5 += parseFloat(a[i].split('/')[1]);
                      dbl5 += parseFloat(a[i].split('/')[2]);
                    }

                    if (i === 6) {
                      reg6 += parseFloat(a[i].split('/')[0]);
                      ovt6 += parseFloat(a[i].split('/')[1]);
                      dbl6 += parseFloat(a[i].split('/')[2]);
                    }
                    if (i === 7) {
                      reg7 += parseFloat(a[i].split('/')[0]);
                      ovt7 += parseFloat(a[i].split('/')[1]);
                      dbl7 += parseFloat(a[i].split('/')[2]);
                    }
                  }
                }
              });
            }
          });
        }
      });

      settotalgroup1({
        reg1: reg1,
        ovt1: ovt1,
        dbl1: dbl1,
      });
      settotalgroup2({
        reg2: reg2,
        ovt2: ovt2,
        dbl2: dbl2,
      });
      settotalgroup3({
        reg3: reg3,
        ovt3: ovt3,
        dbl3: dbl3,
      });
      settotalgroup4({
        reg4: reg4,
        ovt4: ovt4,
        dbl4: dbl4,
      });
      settotalgroup5({
        reg5: reg5,
        ovt5: ovt5,
        dbl5: dbl5,
      });
      settotalgroup6({
        reg6: reg6,
        ovt6: ovt6,
        dbl6: dbl6,
      });
      settotalgroup7({
        reg7: reg7,
        ovt7: ovt7,
        dbl7: dbl7,
      });

      let reg_time = 0;
      let ovt_time = 0;
      let dbl_time = 0;
      setdeletetime(null);

      let tablevalue = TableData.map((ee, i) => {
        if (ee[1]) {
          ee[1].map((d, j) => {
            if (d[1]) {
              d[1].map((f, k) => {
                if (f) {
                  f.map((g, h) => {
                    if (h === 0) {
                      // Ignore first position
                    } else if (h === 8 || h === 9) {
                    } else {
                      reg_time += parseFloat(g.split('/')[0]);
                      ovt_time += parseFloat(g.split('/')[1]);
                      dbl_time += parseFloat(g.split('/')[2]);
                    }
                  });
                }
              });
            }
          });
        }
      });

      settotal_RegularTime(reg_time),
        settotal_Overtime(ovt_time),
        settotal_DBL(dbl_time);
      let timesheetPhasecodeiddata = null;

      db.transaction(txn => {
        txn.executeSql(
          `SELECT * FROM TimesheetPhaseCode where TimesheetJobID=? AND PhaseCodeID=?`,
          [NewTimesheetJobID[0], deletephaseid.split('*')[0]],
          async function (tx, res) {
            for (let i = 0; i < res.rows.length; i++) {
              timesheetPhasecodeiddata = res.rows.item(i).TimesheetPhaseCodeID;
            }
          },
        );
      });
      console.log('timesheetPhasecodeiddata', timesheetPhasecodeiddata);
      db.transaction(txn => {
        var dateTime = CurrentUTCTime();
        let query = `
  INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)
  select  'D' as Action,'TimesheetPhaseCode' as TableName,TimesheetPhaseCodeID as RowID,'-' as ColumnName,''as ColumnValue,'${dateTime}' as DateTime,'${Deviceid}' as  SourceDeviceID,'${0}' as IsObsolete,'${0}' as  SynchedDateTime,'${'-'}' as SynchMessage from  TimesheetPhaseCode WHERE TimesheetPhaseCodeID = '${timesheetPhasecodeiddata}'
  `;

        txn.executeSql(query, []);
      });
      db.transaction(txn => {
        txn.executeSql(
          `delete from TimesheetPhaseCode where TimesheetJobID=? AND PhaseCodeID=?`,
          [NewTimesheetJobID[0], deletephaseid.split('*')[0]],
          async function (tx, res) {
            GetExistingPhase();
          },
        );
      });
      setTableData(delete_phase);

      setdeletePhase_modal(false);

      setmodalPhaseVisible(false);
      setselectedphasename(null);
    } else if (modalPhaseVisible === true) {
      //  add phase row
      var phaseguid = generateGuidQuickly();
      var objIndex = Phase.forEach((obj, i) => {});

      let SelectedTimesheetJobID = ExistingJob.filter(
        item =>
          item.ID == selectedjob_id.split('*')[0] &&
          item.NewEmployeeID == UserID[indexvalue],
      ).map(item => item.TimesheetJobID);

      db.transaction(txn => {
        for (let i = 0; i < SelectedPhase1.length; i++) {
          var TimesheetID = generateGuidQuickly();
          var DateTime = CurrentUTCTime();

          txn.executeSql(
            `INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours,
         Comment, CreatedBy, CreatedOn,Total_Reg,Total_Ot,Total_Dbl)
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?);`,
            [
              TimesheetID,
              SelectedTimesheetJobID[0],
              SelectedPhase1[i].split('*')[0],
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              '',
              SubmitUserID,
              DateTime,
              0,
              0,
              0,
            ],
            function (tx, res) {
              GetExistingPhase();
            },
          );
          txn.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'I',
              'TimesheetPhaseCode',
              TimesheetID,
              '-',
              '',
              DateTime,
              Deviceid,
              0,
              0,
              '-',
            ],
            function (tx, res) {},
          );
        }
      });
      for (let i = 0; i < SelectedPhase1.length; i++) {
        let added_phase;
        var objIndex = Phase.findIndex(obj => {
          obj.value == SelectedPhase1[i];
        }); // Phase[objIndex].status = true;

        added_phase = TableData.map((e, company_i, job_i) => {
          if (company_i === company_index) {
            let changephase = e[1].map((j_data, j_index) => {
              if (j_index === phasejob_index) {
                if (j_data.length > 1) {
                  const add = (com_id, job_id) => {
                    let empty = [];
                    SelectedPhase1.forEach((array, array_index) => {
                      empty.push([
                        `${array}+${com_id}+${job_id}+${generateGuidQuickly()}`,
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '0/0/0',
                        '',
                      ]);
                    });
                    return empty;
                  };
                  return [
                    j_data[0],
                    [
                      ...j_data[1],
                      ...add(e[0][0].split('+')[1], j_data[0].split('+')[2]),
                    ],
                  ];
                }

                const add = (com_id, job_id) => {
                  let empty = [];
                  SelectedPhase1.forEach((array, array_index) => {
                    empty.push([
                      `${array}+${com_id}+${job_id}+${generateGuidQuickly()}`,
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '0/0/0',
                      '',
                    ]);
                  });
                  return empty;
                };

                return [
                  j_data[0],
                  [...add(e[0][0].split('+')[1], j_data[0].split('+')[2])],
                ];
              }

              return j_data;
            });
            return [[...e[0]], changephase];
          }

          return e;
        });

        setTableData(added_phase);
        setmodalPhaseVisible(false);

        var filterphase = Phase.filter(i => i.status == false);
        setPhase(filterphase); // }
      }
    }
  };

  // Add company btn
  const elementCompanyButton = item => (
    <View style={styles.btncompany}>
      <TouchableOpacity onPress={() => alertCompany()}>
        <View>
          <Text>
            <Image
              source={require('../Image/addicon.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />{' '}
            ADD COMPANY
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Add Phase Btn
  const elementPhaseButton = (e, company_i, job_i, ss) => (
    <View style={styles.btnphasecontainer}>
      <TouchableOpacity
        onPress={() => {
          let splited = e[1][job_i][0].split('*#^*');
          let gg = splited[0] ? splited[0] : '*#^*' + splited[1];
          splited = gg;

          setSelectedJobId(splited);
          GetPhase(splited, 'first click');

          // SetSelectedPhase([]);

          setalreadyExist([company_i, job_i]);
          alertPhase(e, company_i, job_i, ss);
        }}>
        <View>
          <Text style={{paddingLeft: '3%'}}>
            <Image
              source={require('../Image/addicon.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />{' '}
            ADD PHASE CODE
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Add Job btn
  const elementJobButton = (e, company_i) => (
    <View style={styles.btnjobcontainer}>
      <TouchableOpacity
        onPress={() => {
          let splited = e[0][0].split('*#^*')[0];
          selectcom = splited.split('+')[0].split('-')[0];

          GetJobs(
            splited.split('+')[0].split('-')[0],
            company_i,
            'First click',
          );
          alertJob(e, company_i);
        }}>
        <View>
          <Text style={{paddingLeft: '2%'}}>
            <Image
              source={require('../Image/addicon.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />{' '}
            ADD JOB
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Remove job btn
  const removejob_btn = (e, job_i, company_i, ss, company_detail) => (
    <View style={{height: 30}}>
      <TouchableOpacity
        onPress={() => {
          deletejob(e, job_i, company_i, company_detail, ss);
        }}>
        <View>
          <Text>
            {'' + e.split('*#^*')[1] + ' ' + e.split('*#^*')[2] + ''}
            <Image
              source={require('../Image/minus.png')}
              Asen
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Text>
        </View>
      </TouchableOpacity>
      {HasEstimatedProjectCompletionDate ? (
        <>
          <View style={{alignSelf: 'flex-end', right: 200}}>
            <Text style={{fontSize: 18, bottom: 23}}>
              Est . Project Completion Date:
            </Text>
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              height: 40,
              width: 200,
              right: 0,
              backgroundColor: 'white',
              bottom: 55,
            }}>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={futureDate}
              minimumDate={currentDate}
              //   date={selectedDate}
            />

            {ss[0].split('*#^*')[3] != null ? (
              <Text style={{fontSize: 18, top: 8, left: 10}}>
                {' '}
                {ss[0].split('*#^*')[3]}{' '}
              </Text>
            ) : (
              <Text style={{fontSize: 18, top: 8, left: 10}}>
                {' '}
                {date.toLocaleDateString()}{' '}
              </Text>
            )}

            {/*{date.toLocaleDateString()} -- Date Changed  */}

            {/*  {ss[0].split('*#^*')[3]} */}

            <TouchableOpacity
              onPress={() =>
                showDatePicker(job_i, company_i, e, company_detail, ss)
              }>
              <Image
                source={require('../Image/calendar.png')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'flex-end',
                  bottom: 15,
                  right: 15,
                }}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );

  // remove company btn
  const removeCompany_btn = (e, company_i, com) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            deleteCompany(e, company_i, com);
          }}>
          <View>
            <Text style={{paddingLeft: '1%'}}>
              {`   ${e.split('*#^*').pop()}   `}{' '}
              <Image
                source={require('../Image/minus.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // remove phase btn
  // "4811-A&E - M.E.P. Engineer+CMP_9cd54fe9-aa28-47fd-8a46-8c870a841223+JOB_05bed19d-c43a-40ce-b327-2dbe22851d0d+PHS_d2d0c5dd-7289-4960-93ab-beb9bdba2a90"
  const Create_btn_delete_pahse = (e, phase_i, job_i, company_i, qq, ss) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            // setcmnt_user(Usernamelist[indexvalue])
            // set_job(TableData[company_i][1][job_i][0].split("+")[0])
            // setcmnt_phase(e.split("+")[0])
            // setphase_hours([...qq.slice(1)])
            let days = [
              'MON',
              'TUE',
              'WED',
              'THU',
              'FRI',
              'SAT',
              'SUN',
              'Total',
            ];
            let modified_phase = qq.slice(1).map((ee, i) => {
              return [days[i], ee];
            });

            setcmnts_popup_detail({
              cmnt_user: Usernamelist[indexvalue],
              cmnt_userid: UserID[indexvalue],
              cmnt_com: TableData[company_i][0][0],
              cmnt_job: TableData[company_i][1][job_i][0].split('+')[0],
              cmnt_phase: e.split('+')[0],
              phase_hours: [...modified_phase],
              cmt_companyI: company_i,
              cmt_jobI: job_i,
              cmt_phaseI: phase_i,
              actual_cmt: qq[9] == 'null' || qq[9] == null ? '' : qq[9],
            });

            var companyid = TableData[company_i][0][0].split('*#^*')[0];
            var jobid = TableData[company_i][1][job_i][0]
              .split('+')[0]
              .split('*#^*')[0];
            var phaseid = e.split('+')[0].split('*#^*')[0];
            db.transaction(txn => {
              txn.executeSql(
                `select tp.TimesheetPhaseCodeID from Timesheet t
              LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
              LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
              LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
              LEFT JOIN TimesheetPhaseCode tp ON tj.TimesheetJobID = tp.TimesheetJobID
          left join LkpCompany lc on tc.CompanyId=lc.CompanyId
          left join LkpJob lJ on tJ.JobID=lJ.JobID
          left join LkpPhaseCode lp on tp.PhaseCodeID=lp.PhaseCodeID
              WHERE t.TimesheetID = ? and te.EmployeeId=? and tp.PhaseCodeID=?
          and tj.JobID=? and tc.CompanyId=?`,
                [
                  route.params.paramKeyTimesheetID,
                  UserID[indexvalue],
                  phaseid,
                  jobid,
                  companyid,
                ],
                async function (tx, res) {
                  var temp = [];
                  for (let i = 0; i < res.rows.length; i++) {
                    temp.push(res.rows.item(i));
                  }

                  SetSelectedTimesheetPhaseCodeID(temp);
                },
              );
            });
            setadd_cmnt(true);
          }}>
          <View style={{flexDirection: 'row'}}>
            {/* edit */}
            {qq.length === 10 && qq[9] != 'null' && qq[9] != '' ? (
              <Image
                source={require('../Image/icon_edit.png')}
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            ) : null}
            {/* console.log(---------------------); */}
            <Text>
              {e.split('*#^*')[1].length > 5
                ? e.split('*#^*')[1].split('+')[0].substr(0, 30) + '...'
                : e.split('*#^*')[1]}

              {/* {`  ${e.split('+')[0]}   `}{' '}
             {e.split('+')[0].split("-")[0]===""? ''+e.split('+')[0].split("-")[2]+ '*#^*'+((!e.split('+')[0].split("-")[3])?" ":"-"+e.split('+')[0].split("-")[3]+"")+''+ ((!e.split('+')[0].split("-")[4])?" ":"-"+e.split('+')[0].split("-")[4]+"")+''

            :
"dvv"
            // ''+e.split('+')[0].split("-")[0]+'*#^*'+e.split('+')[0].split("-")[1]+'*#^*'+ e.split('+')[0].split("-")[2]+'*#^*'+ e.split('+')[0].split("-")[3]+''
            }    */}

              <TouchableOpacity
                onPress={() => {
                  deletePhase(e, phase_i, job_i, company_i, qq, ss);
                }}>
                <Image
                  source={require('../Image/minus.png')}
                  style={{
                    width: 20,
                    height: 20,
                    marginTop: 5,
                    // backgroundColor:"red"
                  }}
                />
              </TouchableOpacity>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Table Header
  const TableHead = [
    'Company | Job | Phase code',
    `Mon. ${weeekenddate[0]} \n ${totalgroup1.reg1}/${totalgroup1.ovt1}/${totalgroup1.dbl1}`,
    `Tue. ${weeekenddate[1]} \n ${totalgroup2.reg2}/${totalgroup2.ovt2}/${totalgroup2.dbl2}`,
    `Wed. ${weeekenddate[2]} \n ${totalgroup3.reg3}/${totalgroup3.ovt3}/${totalgroup3.dbl3}`,
    `Thu. ${weeekenddate[3]} \n ${totalgroup4.reg4}/${totalgroup4.ovt4}/${totalgroup4.dbl4}`,
    `Fri. ${weeekenddate[4]} \n ${totalgroup5.reg5}/${totalgroup5.ovt5}/${totalgroup5.dbl5}`,
    `Sat. ${weeekenddate[5]} \n ${totalgroup6.reg6}/${totalgroup6.ovt6}/${totalgroup6.dbl6}`,
    `Sun. ${weeekenddate[6]} \n ${totalgroup7.reg7}/${totalgroup7.ovt7}/${totalgroup7.dbl7}`,
    'TOTAL',
  ];
  const [btnData2, setbtnData2] = useState([elementCompanyButton(1)]);

  // this functiona call when user click to phase row and open scrollwheel (select hrs) popup will open.
  const get_set = (
    phases,
    company_i,
    job_i,
    phases_column_index,
    phases_row_index,
    ss,
    e,
    qq,
  ) => {
    //
    let splited = phases.split('/');
    settimes({
      RegularTime: splited[0],
      Overtime: splited[1],
      DBL: splited[2],
    });

    setselected_data([
      phases,
      company_i,
      job_i,
      phases_column_index,
      phases_row_index,
    ]);
    let pass_com = e[0][0].split('*')[0];
    let pass_job = ss[0].split('*')[0];
    let pass_phase = qq[0].split('*')[0];
    sethoursmodalVisible(true);

    Updatetotaltime(pass_com, pass_job, pass_phase, phases_row_index);
  };

  const Updatetotaltime = async (
    pass_com,
    pass_job,
    pass_phase,
    phases_row_index,
  ) => {
    db.transaction(txn => {
      txn.executeSql(
        `select lc.CompanyId,lj.JobID, lp.PhaseCodeID,tp.* from Timesheet t
      LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
      LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
      LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
      LEFT JOIN TimesheetPhaseCode tp ON tj.TimesheetJobID = tp.TimesheetJobID
  left join LkpCompany lc on tc.CompanyId=lc.CompanyId
  left join LkpJob lJ on tJ.JobID=lJ.JobID
  left join LkpPhaseCode lp on tp.PhaseCodeID=lp.PhaseCodeID
      WHERE t.TimesheetID = ? and te.EmployeeId=? and tp.PhaseCodeID=?
  and tj.JobID=? and tc.CompanyId=?`,
        [
          route.params.paramKeyTimesheetID,
          UserID[indexvalue],
          pass_phase,
          pass_job,
          pass_com,
        ],
        async function (tx, res) {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          SetSelectedTimesheetPhaseCodeID(temp);
          settimeindex(phases_row_index);
        },
      );
    });
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

  // let item = [];
  // let filteritem = TableData.map((e, i) => {
  //   e[1] &&
  //     e[1].map((d, j) => {
  //       d[1] &&
  //         d[1].forEach((m, k) => {
  //           if (m[8] != "0/0/0") {
  //             item.push(m);
  //           }
  //         });
  //     });
  // });

  const Save = async () => {
    const myPromise = new Promise((resolve, reject) => {
      let selectedusername = Usernamelist[indexvalue];
      let obj = {};
      obj[selectedusername] = TableData;
      dispatch(AddData(obj));
      dispatch(Temp_Add(obj));
      resolve('foo');

      // deleteRec(route.params.item);
    }).then(async () => {
      dispatch(delete1());
      dispatch(delete2());
      dispatch(Remove_Date());
      route.params.functions();
      navigation.navigate('Approve_Report', {
        paramKeyJobId: route.params.pass_paramKeyJobId,
        paramKeyTimesheetID: route.params.pass_paramKeyTimesheetID,
        paramKeyPhaseCodeID: route.params.pass_paramKeyPhaseCodeID,
        paramkeyWeekEndDate: route.params.pass_paramkeyWeekEndDate,
        paramkeyTimesheetJobID: route.params.pass_paramkeyTimesheetJobID,
        paramkeyTimesheetCompanyID:
          route.params.pass_paramkeyTimesheetCompanyID,
        paramKeyCreatedOn: route.params.pass_paramKeyCreatedOn,
        paramKeyCreatedBy: route.params.pass_paramKeyCreatedBy,
        item: route.params.pass_item,
      });
    });

    // })
  };

  const changeusernameSC = index => {
    setCJP(prev => ({
      company: [],
      job: [],
      phase: [],
    }));

    setPageLoading(true);
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue) {
        setindexvalue(Usernamelist.indexOf(index));

        let selectedusername = Usernamelist[indexvalue];
        let obj = {};
        obj[selectedusername] = TableData;
        obj['total_RegularTime'] = total_RegularTime;
        obj['total_DBL'] = total_DBL;
        obj['total_Overtime'] = total_Overtime;
        dispatch(AddData(obj));
        dispatch(Temp_Add(obj));
        setTableData([]);
        settotal_Overtime(0);
        settotal_DBL(0);
        settotal_RegularTime(0);

        if (getUser.count.data.length !== 1) {
          let objArr = Object.values(getUser.count.data)[
            Usernamelist.indexOf(index)
          ];

          let res = Usernamelist[Usernamelist.indexOf(index)];

          objArr &&
            objArr[res].map(e => {
              setCJP(prev => ({
                company: [...prev.company, e[0][0].split('+')[0]],
                job: [],
                phase: [],
              }));
            });

          objArr && setTableData(objArr[res]);
          objArr && settotal_Overtime(objArr['total_Overtime']);
          objArr && settotal_DBL(objArr['total_DBL']);
          objArr && settotal_RegularTime(objArr['total_RegularTime']);
        }
      }
      setPageLoading(false);
    }, 1000);
    GetUserCompany();
  };

  const changeusernameASC = () => {
    Empty_Week_Totals();

    setCJP(prev => ({
      company: [],
      job: [],
      phase: [],
    }));

    setPageLoading(true);
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue) {
        setindexvalue(indexvalue + 1);
        let selectedusername = Usernamelist[indexvalue];

        let obj = {};
        obj[selectedusername] = TableData;
        obj['total_RegularTime'] = total_RegularTime;
        obj['total_DBL'] = total_DBL;
        obj['total_Overtime'] = total_Overtime;
        dispatch(AddData(obj));
        dispatch(Temp_Add(obj));

        setTableData([]);
        settotal_Overtime(0);
        settotal_DBL(0);
        settotal_RegularTime(0);

        if (getUser.count.data.length !== 1) {
          let objArr = Object.values(getUser.count.data)[indexvalue + 1];

          let res = Usernamelist[indexvalue + 1];

          objArr &&
            objArr[res].map(e => {
              setCJP(prev => ({
                company: [...prev.company, e[0][0].split('+')[0]],
                job: [],
                phase: [],
              }));
            });

          objArr && setTableData(objArr[res]);
          objArr && Add_Week_Totals(objArr[res]);
          objArr && settotal_Overtime(objArr['total_Overtime']);
          objArr && settotal_DBL(objArr['total_DBL']);
          objArr && settotal_RegularTime(objArr['total_RegularTime']);
        }
      }
      setPageLoading(false);
    }, 1000);
    GetUserCompany();
  };

  const changeusernameDEC = () => {
    Empty_Week_Totals();

    setCJP(prev => ({
      company: [],
      job: [],
      phase: [],
    }));

    setPageLoading(true);
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue && indexvalue >= 0) {
        // post
        setindexvalue(indexvalue - 1);

        let selectedusername = Usernamelist[indexvalue];
        let obj = {};
        obj[selectedusername] = TableData;
        obj['total_RegularTime'] = total_RegularTime;
        obj['total_DBL'] = total_DBL;
        obj['total_Overtime'] = total_Overtime;

        dispatch(AddData(obj));
        dispatch(Temp_Add(obj));

        setTableData([]);
        settotal_Overtime(0);
        settotal_DBL(0);
        settotal_RegularTime(0);

        let objArr = Object.values(getUser.count.data)[indexvalue - 1];

        var res = Usernamelist[indexvalue - 1];

        objArr[res].map(e => {
          setCJP(prev => ({
            company: [...prev.company, e[0][0].split('+')[0]],
            job: [],
            phase: [],
          }));
        });
        setTableData(objArr[res]);
        objArr && Add_Week_Totals(objArr[res]);
        objArr && settotal_Overtime(objArr['total_Overtime']);
        objArr && settotal_DBL(objArr['total_DBL']);
        objArr && settotal_RegularTime(objArr['total_RegularTime']);
      }
      setPageLoading(false);
    }, 1000);

    GetUserCompany();
  };

  // empty all weekend totalss
  const Empty_Week_Totals = () => {
    settotalgroup1({
      reg1: 0,
      ovt1: 0,
      dbl1: 0,
    });
    settotalgroup2({
      reg2: 0,
      ovt2: 0,
      dbl2: 0,
    });
    settotalgroup3({
      reg3: 0,
      ovt3: 0,
      dbl3: 0,
    });
    settotalgroup4({
      reg4: 0,
      ovt4: 0,
      dbl4: 0,
    });
    settotalgroup5({
      reg5: 0,
      ovt5: 0,
      dbl5: 0,
    });
    settotalgroup6({
      reg6: 0,
      ovt6: 0,
      dbl6: 0,
    });
    settotalgroup7({
      reg7: 0,
      ovt7: 0,
      dbl7: 0,
    });
  };

  // get totals add in current timesheet.
  const Add_Week_Totals = output => {
    let reg1 = 0;
    let ovt1 = 0;
    let dbl1 = 0;
    // 2
    let reg2 = 0;
    let ovt2 = 0;
    let dbl2 = 0;
    // 3
    let reg3 = 0;
    let ovt3 = 0;
    let dbl3 = 0;
    // 4
    let reg4 = 0;
    let ovt4 = 0;
    let dbl4 = 0;
    // 5
    let reg5 = 0;
    let ovt5 = 0;
    let dbl5 = 0;
    // 6
    let reg6 = 0;
    let ovt6 = 0;
    let dbl6 = 0;
    // 7
    let reg7 = 0;
    let ovt7 = 0;
    let dbl7 = 0;

    output.forEach(eee => {
      if (eee[1]) {
        eee[1].forEach((d, j) => {
          if (d[1]) {
            d[1].forEach((a, k) => {
              if (a) {
                for (let i = 0; i <= a.length; i++) {
                  if (i === 0) {
                  } else {
                    if (i === 1) {
                      reg1 += parseFloat(a[i].split('/')[0]);
                      ovt1 += parseFloat(a[i].split('/')[1]);
                      dbl1 += parseFloat(a[i].split('/')[2]);
                    }

                    if (i === 2) {
                      reg2 += parseFloat(a[i].split('/')[0]);
                      ovt2 += parseFloat(a[i].split('/')[1]);
                      dbl2 += parseFloat(a[i].split('/')[2]);
                    }
                  }

                  if (i === 3) {
                    reg3 += parseFloat(a[i].split('/')[0]);
                    ovt3 += parseFloat(a[i].split('/')[1]);
                    dbl3 += parseFloat(a[i].split('/')[2]);
                  }

                  if (i === 4) {
                    reg4 += parseFloat(a[i].split('/')[0]);
                    ovt4 += parseFloat(a[i].split('/')[1]);
                    dbl4 += parseFloat(a[i].split('/')[2]);
                  }

                  if (i === 5) {
                    reg5 += parseFloat(a[i].split('/')[0]);
                    ovt5 += parseFloat(a[i].split('/')[1]);
                    dbl5 += parseFloat(a[i].split('/')[2]);
                  }

                  if (i === 6) {
                    reg6 += parseFloat(a[i].split('/')[0]);
                    ovt6 += parseFloat(a[i].split('/')[1]);
                    dbl6 += parseFloat(a[i].split('/')[2]);
                  }
                  if (i === 7) {
                    reg7 += parseFloat(a[i].split('/')[0]);
                    ovt7 += parseFloat(a[i].split('/')[1]);
                    dbl7 += parseFloat(a[i].split('/')[2]);
                  }
                }
              }
            });
          }
        });
      }
    });

    settotalgroup1({
      reg1: reg1,
      ovt1: ovt1,
      dbl1: dbl1,
    });
    settotalgroup2({
      reg2: reg2,
      ovt2: ovt2,
      dbl2: dbl2,
    });
    settotalgroup3({
      reg3: reg3,
      ovt3: ovt3,
      dbl3: dbl3,
    });
    settotalgroup4({
      reg4: reg4,
      ovt4: ovt4,
      dbl4: dbl4,
    });
    settotalgroup5({
      reg5: reg5,
      ovt5: ovt5,
      dbl5: dbl5,
    });
    settotalgroup6({
      reg6: reg6,
      ovt6: ovt6,
      dbl6: dbl6,
    });
    settotalgroup7({
      reg7: reg7,
      ovt7: ovt7,
      dbl7: dbl7,
    });
  };

  //  reamove employee

  // const RemoveEmployee = () => {
  //   let selectedusername = Usernamelist[indexvalue];
  //   let obj = {};
  //   obj[selectedusername] = TableData;
  //   obj['total_RegularTime'] = total_RegularTime;
  //   obj['total_DBL'] = total_DBL;
  //   obj['total_Overtime'] = total_Overtime;

  //   if (Usernamelist.length !== 1) {
  //     Alert.alert('Are You Sure Want To Remove', `${selectedusername}`, [
  //       {
  //         text: 'Cancel',
  //         // onPress: () =>
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           //

  //           dispatch(RemoveData(obj));

  //           dispatch(Temp_Remove(obj));
  //           setTableData([])
  //           let removed = Usernamelist.filter(e => e !== selectedusername);

  //           setUsernamelist([...removed]);
  //
  //
  //           let added = Employee.map(e => {
  //             if (e.key === selectedusername) {
  //               return {
  //                 ...e,
  //                 check: false,
  //                 status: false,
  //               };
  //             }
  //             return e;
  //           });
  //           setEmployee([...added]);

  //           if (Usernamelist.length - 1 === indexvalue) {
  //             setindexvalue(prev => prev - 1);
  //           }
  //         },
  //       },
  //     ]);
  //   }
  // };

  //
  // again push removed employyee into employee drop down
  const Insert_Employee = selectedusername => {
    let filtering;

    filtering = Edit_whole_Employee.filter(e => {
      //
      return e.key === selectedusername;
    });

    if (filtering.length !== 0) {
      //  setTimeout(()=>{
      //let final = filtering[0].value; // 9623
      let removed_id = selected_Employee_Id.filter(e => {
        return e !== filtering[0].value;
      });
      Setselected_Employee_Id(removed_id);
      //  },500)
    }

    // resolve('foo');
  };
  // employee modal visible
  const alertEmployee = () => {
    get_Empl('first click', null, Usernamelist);
  };
  const CopyEmpWarning = item => {
    setCheckk(!Checkk);
  };

  const CopytoggleModal = item => {
    setCopyModalVisible(!isCopyModalVisible);
    Getdatajobs();
  };

  // second time click while add new employee
  const alertEmployee2 = () => {
    get_Empl('second click', null, Usernamelist);
  };
  const RemoveEmploye = () => {
    let selectedusername = Usernamelist[indexvalue];
    let selecteduserid = UserID[indexvalue];

    Insert_Employee(selectedusername);
    if (getUser.count.data.length > 1 || getUser.count.data.length === 1) {
      const myPromise = new Promise((resolve, reject) => {
        let selectedusername = Usernamelist[indexvalue];
        let obj = {};
        obj[selectedusername] = TableData;

        dispatch(AddData(obj));
        dispatch(Temp_Add(obj));
        resolve('foo');
      }).then(async () => {
        // if we remove first employeee
        if (indexvalue === 0) {
          dispatch(RemoveData(selectedusername));
          dispatch(Temp_Remove(selectedusername));

          // remove member from userlist
          let removed = Usernamelist.filter(e => e !== selectedusername);
          let removedid = UserID.filter(e => e !== selecteduserid);
          //
          setUsernamelist([...removed]);
          setUserID([...removedid]);
          setindexvalue(0);

          let currentname = Usernamelist[indexvalue + 1];
          //
          let filterddd = getUser.count.data.find(e => {
            return Object.keys(e)[0] === currentname;
          });

          // if reset tabledata if no user selected
          getUser.count.data.length === 1
            ? setTableData([])
            : setTableData(filterddd[Object.keys(filterddd)[0]]);
          // remove all total counts
          if (getUser.count.data.length === 1) {
            // Insert_Employee(selectedusername)
            setTableData([]);
            settotal_RegularTime(0);
            settotal_Overtime(0);
            settotal_DBL(0);

            settotalgroup1({
              reg1: 0,
              ovt1: 0,
              dbl1: 0,
            });
            settotalgroup2({
              reg2: 0,
              ovt2: 0,
              dbl2: 0,
            });
            settotalgroup3({
              reg3: 0,
              ovt3: 0,
              dbl3: 0,
            });
            settotalgroup4({
              reg4: 0,
              ovt4: 0,
              dbl4: 0,
            });
            settotalgroup5({
              reg5: 0,
              ovt5: 0,
              dbl5: 0,
            });
            settotalgroup6({
              reg6: 0,
              ovt6: 0,
              dbl6: 0,
            });
            settotalgroup7({
              reg7: 0,
              ovt7: 0,
              dbl7: 0,
            });
          }
          setModalVisible(false);
        }
        // if we remove employee other than first employee
        else {
          // Setselected_Employee_Id
          //
          // Insert_Employee(selectedusername)
          dispatch(RemoveData(selectedusername));
          dispatch(Temp_Remove(selectedusername));

          let removed = Usernamelist.filter(e => e !== selectedusername);
          setUsernamelist([...removed]);
          let removedid = UserID.filter(e => e !== selecteduserid);
          setUserID([...removedid]);
          setindexvalue(prev => prev - 1);

          let currentname = Usernamelist[indexvalue - 1];

          let filterddd = getUser.count.data.find(e => {
            return Object.keys(e)[0] === currentname;
          });

          setTableData(filterddd[Object.keys(filterddd)[0]]);
          settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
          settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
          settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
        }
      });
      setModalVisible(false);
    }
    // if redux have only one user
    else {
      // if redux have only one user and index not zero
      if (getUser.count.data.length === 1 && indexvalue !== 0) {
        const myPromise = new Promise((resolve, reject) => {
          let selectedusername = Usernamelist[indexvalue];
          let obj = {};
          obj[selectedusername] = TableData;
          dispatch(AddData(obj));
          dispatch(Temp_Add(obj));
          resolve('foo');
        }).then(async () => {
          // Insert_Employee(selectedusername)
          dispatch(RemoveData(selectedusername));
          dispatch(Temp_Remove(selectedusername));

          let removed = Usernamelist.filter(e => e !== selectedusername);
          let removedid = UserID.filter(e => e !== selecteduserid);
          setUserID([...removedid]);
          setUsernamelist([...removed]);
          setindexvalue(prev => prev - 1);
          2;
          let currentname = Usernamelist[indexvalue - 1];

          let filterddd = getUser.count.data.find(e => {
            return Object.keys(e)[0] === currentname;
          });

          setTableData(filterddd[Object.keys(filterddd)[0]]);
          settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
          settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
          settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
        });
      }
      // if redux have only one user and index  zero
      else if (indexvalue === 0) {
        let removed = Usernamelist.filter(e => e !== selectedusername);
        let removedid = UserID.filter(e => e !== selecteduserid);
        setUserID([...removedid]);
        // Insert_Employee(selectedusername)
        setUsernamelist([...removed]);
        setindexvalue(0);
        setTableData([]);
      }
    }
    db.transaction(tx => {
      tx.executeSql(
        `select t.CreatedOn, t.TimesheetID,te.TimesheetEmployeeID,tc.TimesheetCompanyID, tj.TimesheetJobID,tp.TimesheetPhaseCodeID from Timesheet t
        LEFT JOIN TimesheetEmployee te ON t.TimesheetID = te.TimesheetID
        LEFT JOIN TimesheetCompany tc ON te.TimesheetEmployeeID = tc.TimesheetEmployeeID
        LEFT JOIN TimesheetJob tj ON tj.TimesheetCompanyID = tc.TimesheetCompanyID
        LEFT JOIN TimesheetPhaseCode tp ON tj.TimesheetJobID = tp.TimesheetJobID
        WHERE t.TimesheetID = ? and te.TimesheetEmployeeID=?`,
        [
          route.params.paramKeyTimesheetID,
          ExistingEmployee[indexvalue].TimesheetEmployeeID,
        ],
        async function (tx, res) {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let deletephase = temp
            .filter(item => item.TimesheetJobID != null)
            .map(item => item.TimesheetJobID);
          for (let i = 0; i < deletephase.length; i++) {
            tx.executeSql(
              `delete  from TimesheetPhaseCode where TimesheetJobID=? `,
              [deletephase[i]],
            );
          }
          let deletejob = temp
            .filter(item => item.TimesheetCompanyID != null)
            .map(item => item.TimesheetCompanyID);
          for (let i = 0; i < deletejob.length; i++) {
            tx.executeSql(
              `delete  from TimesheetJob where TimesheetCompanyID=? `,
              [deletejob[i]],
            );
          }

          let deletecompany = temp
            .filter(item => item.TimesheetEmployeeID != null)
            .map(item => item.TimesheetEmployeeID);
          for (let i = 0; i < deletecompany.length; i++) {
            tx.executeSql(
              `delete  from TimesheetCompany where TimesheetEmployeeID=? `,
              [deletecompany[i]],
            );
          }

          tx.executeSql(
            `delete  from TimesheetEmployee where TimesheetID=? and TimesheetEmployeeID=? `,
            [
              route.params.paramKeyTimesheetID,
              ExistingEmployee[indexvalue].TimesheetEmployeeID,
            ],
          );
        },
      );
    });
  };
  const deleteRecord = () => {
    setModalVisible(true);
    // setDelClicked(item);
  };
  useEffect(() => {
    GetExistingEmployee();
    GetExistingCompany();
    GetExistingJobs();
    GetExistingPhase();
  }, []);
  // Get Employee list
  const GetExistingEmployee = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `select u.EmployeeID,u.Username, em.FullName,te.TimesheetEmployeeID ,te.TimesheetID from TimesheetEmployee te inner join User u on u.EmployeeID=te.
            EmployeeID inner join Employee em on u.EmployeeId = em.EmployeeId where TimesheetID=?`,
        [route.params.paramKeyTimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map(item => {
            return {
              key: item.FullName,
              value: item.EmployeeID,
              status: true,
              check: true,
              TimesheetEmployeeID: item.TimesheetEmployeeID,
              TimesheetID: item.TimesheetID,
            };
          });

          setExistingEmployee(newArray);
        },
      );
    });
  };
  // Get Company list
  const GetExistingCompany = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT (SELECT DISTINCT group_concat(TE.EmployeeID, ',') FROM TimesheetEmployee TE INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
           WHERE LC.CompanyID = TC.CompanyID AND TE.TimesheetID = T.TimesheetID) AS EmployeeID,TC.CompanyID,LC.CompanyName, TC.TimesheetEmployeeID,TC.TimesheetCompanyID ,TE.EmployeeID as NewEmployeeID
            FROM Timesheet T
           INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
           INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
           INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
           WHERE T.TimesheetID =?
           ORDER BY LC.CompanyName
             `,
        [route.params.paramKeyTimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map(item => {
            return {
              key: '' + item.CompanyID + '$$$' + item.CompanyName + '',
              value: '' + item.CompanyID + '*#^*' + item.CompanyName,
              ID: item.CompanyID,
              EmployeeID: item.EmployeeID,
              TimesheetCompanyID: item.TimesheetCompanyID,
              TimesheetEmployeeID: item.TimesheetEmployeeID,
              NewEmployeeID: item.NewEmployeeID,
            };
          });
          setExistingCompany(newArray);
        },
      );
    });
  };

  const GetExistingJobs = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT (SELECT DISTINCT group_concat(TimesheetEmployee.EmployeeID, ',')
            FROM TimesheetEmployee
            WHERE TimesheetEmployeeID in (
            SELECT TimesheetEmployeeID FROM TimesheetCompany
            INNER JOIN TimesheetJob ON
            TimesheetCompany.TimesheetCompanyID = TimesheetJob.TimesheetCompanyID
            WHERE TimesheetCompany.CompanyID = TC.CompanyID
            AND JobID = TJ.JobID
            )
            AND TimesheetEmployee.TimesheetID = T.TimesheetID)
            AS EmployeeID,TC.CompanyID,LJ.JobID,LJ.JobName, LJ.JobNo,TJ.TimesheetCompanyID,TE.EmployeeID as NewEmployeeID,  TJ.TimesheetJobID,(CASE WHEN IFNULL(LJ.IsRestricted, '') = '' THEN 0 ELSE LJ.IsRestricted END) AS IsRestricted
            FROM Timesheet T
            INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
            INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
            INNER JOIN TimesheetJob TJ ON TC.TimesheetCompanyID = TJ.TimesheetCompanyID
            INNER JOIN LkpJob LJ ON TJ.JobID = LJ.JobID
            WHERE T.TimesheetID = ?
            ORDER BY LJ.JobName
             `,
        [route.params.paramKeyTimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let dJobs = temp.filter(e => e.JobID < 0);
          let Otherjobs = temp.filter(e => e.JobID > 0);
          Otherjobs.sort((a, b) => a.JobNo.localeCompare(b.JobNo));

          let newArray = temp.map(item => {
            return {
              key: '' + item.JobID + '$$$' + item.JobName + '$$$' + item.JobNo,
              value:
                item.JobID + '*#^*' + item.JobNo + '*#^*' + item.JobName + '',
              ID: item.JobID,
              CompanyID: item.CompanyID,
              EmployeeID: item.EmployeeID,
              TimesheetJobID: item.TimesheetJobID,
              TimesheetCompanyID: item.TimesheetCompanyID,
              NewEmployeeID: item.NewEmployeeID,
            };
          });
          setExistingJob(newArray);
        },
      );
    });
  };

  const GetExistingPhase = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT
               (SELECT GROUP_CONCAT(EmployeeID ,',')
               FROM
               (SELECT DISTINCT TimesheetEmployee.EmployeeID
               FROM TimesheetEmployee INNER JOIN TimesheetCompany  ON  TimesheetEmployee .TimesheetEmployeeID = TimesheetCompany .TimesheetEmployeeID
               INNER JOIN TimesheetJob  ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
               INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
               WHERE TimesheetEmployee.TimesheetID = T.TimesheetID
               AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
               )AS EmployeeID,
               (SELECT  group_concat(CompanyID, ',')
               FROM
               (SELECT DISTINCT TimesheetCompany .CompanyID
               FROM TimesheetCompany INNER JOIN TimesheetEmployee ON  TimesheetCompany.TimesheetEmployeeID  = TimesheetEmployee .TimesheetEmployeeID
               INNER JOIN TimesheetJob  ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
               INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
               WHERE TimesheetEmployee.TimesheetID = T.TimesheetID
               AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
               )AS CompanyID,
               (SELECT  group_concat(JobID, ',')
               FROM
               (SELECT  DISTINCT TimesheetJob .JobID
               FROM TimesheetJob  INNER JOIN TimesheetCompany ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
               INNER JOIN TimesheetEmployee ON  TimesheetCompany.TimesheetEmployeeID  = TimesheetEmployee .TimesheetEmployeeID
               INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
               WHERE  TimesheetEmployee.TimesheetID = T.TimesheetID
               AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
               )AS JobID,
               LP.PhaseCodeID,LP.PhaseCodeName, LP.PhaseCode, TP.*,(CASE WHEN IFNULL(LP.IsRestricted, '') = '' THEN 0 ELSE LP.IsRestricted END) AS IsRestricted
               FROM Timesheet T
               INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
               INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
               INNER JOIN TimesheetJob TJ ON TC.TimesheetCompanyID = TJ.TimesheetCompanyID
               INNER JOIN TimesheetPhaseCode TP ON TJ.TimesheetJobID = TP.TimesheetJobID
               INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
               INNER JOIN LkpJob LJ ON TJ.JobID = LJ.JobID
               INNER JOIN LkpPhaseCode LP ON TP.PhaseCodeID = LP.PhaseCodeID
               WHERE T.TimesheetID =?
               ORDER BY LP.PhaseCodeName`,
        [route.params.paramKeyTimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value: item.PhaseCodeID + '*#^*' + item.PhaseCodeName,
              ID: item.PhaseCodeID,
              JobID: item.JobID,
              TimesheetPhaseCodeID: item.TimesheetPhaseCodeID,
              ...item,
            };
          });
          setExistingPhase(newArray);
        },
      );
    });
  };
  //
  if (Pageloading == true) {
    return (
      <View style={styles.Pageloading}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* select times modal */}
        {/* {process_loader ? <Processing /> : null} */}
        {popup_twentyfour ? (
          <Timesheet_popup
            setpopup_twentyfour={setpopup_twentyfour}
            type={'24hourspopup'}
            cmnts_popup_detail={cmnts_popup_detail}
          />
        ) : null}
        {popup_entry ? (
          <Timesheet_popup
            setpopup_entry={setpopup_entry}
            type={'emptyentry'}
          />
        ) : null}
        {add_cmnt ? (
          <Timesheet_popup
            Save={Save}
            TableData={TableData}
            SelectedTimesheetPhaseCodeID={SelectedTimesheetPhaseCodeID}
            setadd_cmnt={setadd_cmnt}
            setpopup_entry={setpopup_entry}
            type={'comments'}
            cmnts_popup_detail={cmnts_popup_detail}
          />
        ) : null}

        <Scroll_modal
          setpopup_twentyfour={setpopup_twentyfour}
          setData={setData}
          timeindex={timeindex}
          SelectedTimesheetPhaseCodeID={SelectedTimesheetPhaseCodeID}
          hoursmodalVisible={hoursmodalVisible}
          sethoursmodalVisible={sethoursmodalVisible}
          times={times}
          selected_data={selected_data}
          TableData={TableData}
          setTableData={setTableData}
          settimes={settimes}
          settotal_RegularTime={settotal_RegularTime}
          settotal_Overtime={settotal_Overtime}
          settotal_DBL={settotal_DBL}
          settotalgroup1={settotalgroup1}
          settotalgroup2={settotalgroup2}
          settotalgroup3={settotalgroup3}
          settotalgroup4={settotalgroup4}
          settotalgroup5={settotalgroup5}
          settotalgroup6={settotalgroup6}
          settotalgroup7={settotalgroup7}
          settotalgroup8={settotalgroup8}
          EarningsCode={EarningsCode}
          Time={[
            totalgroup1,
            totalgroup2,
            totalgroup3,
            totalgroup4,
            totalgroup5,
            totalgroup6,
            totalgroup7,
          ]}
          setRod={setRod}
          Rod={Rod}
          setCheck={setCheck}
        />
        {Check ? (
          <WarningPopup
            Check={Check}
            setCheck={setCheck}
            text="Total Time Exceed 24 hours"
          />
        ) : null}
        {/* add or insert new company module */}
        {modalComapanyVisible && deleteComapany_modal === false ? (
          <AddCompany
            CJP={CJP}
            setCJP={setCJP}
            handleAddRow={handleAddRow}
            Company={Company}
            SetCompanyID={SetCompanyID}
            SetCompany={SetCompany}
            GetJobs={GetJobs}
            loading={Companyloading}
            setmodalComapanyVisible={setmodalComapanyVisible}
          />
        ) : null}

        {/* add or insert new company module */}
        {modalEmployeeVisible && deleteEmployee_modal === false ? (
          <AddEmployee
            AddEmployeeName={AddEmployeeName}
            deleteEmployee_modal={deleteEmployee_modal}
            Employee={Employee}
            setEmployee={setEmployee}
            // GetEmployee={GetEmployee}
            loading={Employeeloading}
            setprocess_loader={setprocess_loader}
            setmodalEmployeeVisible={setmodalEmployeeVisible}
            selected_Employee_Id={selected_Employee_Id}
            Setselected_Employee_Id={Setselected_Employee_Id}
            get_Empl={get_Empl}
          />
        ) : null}
        {/* Delete Company modal popup*/}
        <Delete_Company_Pop
          deleteComapany_modal={deleteComapany_modal}
          handleAddRow={handleAddRow}
          setmodalComapanyVisible={setmodalComapanyVisible}
          setdeleteCompany_modal={setdeleteCompany_modal}
          company_index={company_index}
        />

        {/* add or insert job row in addjob module */}
        {modalJobVisible && deletejob_modal === false ? (
          <AddJob
            Jobs={Jobs}
            selectedJob={selectedJob}
            GetPhase={GetPhase}
            handleAddRow={handleAddRow}
            setmodalJobVisible={setmodalJobVisible}
            setJobs={setJobs}
            loading={Jobloading}
            GetJobs={GetJobs}
            selectedcompanyname={selectedcompanyname}
            SetSelectedJob={SetSelectedJob}
            companyIndex={companyIndex}
          />
        ) : null}

        {/* Delete job modal popup */}
        <Delete_Job_Pop
          deletejob_modal={deletejob_modal}
          setmodalJobVisible={setmodalJobVisible}
          setdeletejob_modal={setdeletejob_modal}
          handleAddRow={handleAddRow}
        />

        {/* add or insert job row in addphase module*/}
        {modalPhaseVisible && deletePhase_modal === false ? (
          <AddPhase
            setmodalPhaseVisible={setmodalPhaseVisible}
            setdeletePhase_modal={setdeletePhase_modal}
            deletePhase_modal={deletePhase_modal}
            handleAddRow={handleAddRow}
            Phase={Phase}
            loading={Phaseloading}
            setPhase={setPhase}
            SetSelectedPhase={SetSelectedPhase}
            SelectedJobId={SelectedJobId}
            GetPhase={GetPhase}
          />
        ) : null}
        {isCopyModalVisible ? (
          <TimeSheet_Copypop
            setGetEmpId={setGetEmpId}
            GetEmpId={GetEmpId}
            navigation={navigation}
            data={data}
            routeparamsparamKey={route.params.paramKey}
            setCopyModalVisible={setCopyModalVisible}
            setModalVisible={setModalVisible}
            username={Usernamelist[indexvalue]}
            displaySelectedname={displaySelectedname}
            Usernamelist={Usernamelist}
            setDispGetEmp={setDispGetEmp}
            DispGetEmp={DispGetEmp}
            selected_Employee_Id={selected_Employee_Id}
            Setselected_Employee_Id={Setselected_Employee_Id}
            CopyAddEmployeeName={CopyAddEmployeeName}
            setSelectedId={setSelectedId}
            SelectedId={SelectedId}
            TableData={TableData}
            setUsernamelist={setUsernamelist}
            Company={Company}
            SetCompany={SetCompany}
            CJP={CJP}
            setCJP={setCJP}
            Jobs={copyjob}
            setJobs={setcopyjob}
            FromUserDetails={FromUserDetails}
            Phases={copyphase}
            setPhases={setcopyphase}
            SelectedEmployeeId={SelectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            Page="ApproveEditTimesheet"
            paramkeyWeekEndDate={route.params.paramkeyWeekEndDate}
            EditTimesheetID={route.params.paramKeyTimesheetID}
            close={Save}
            ApproveUsernameList={route.params.Usernamelists}
          />
        ) : null}
        {/* Delete Phase modal popup */}

        <Delete_Phase_Pop
          deletePhase_modal={deletePhase_modal}
          setmodalPhaseVisible={setmodalPhaseVisible}
          setdeletePhase_modal={setdeletePhase_modal}
          handleAddRow={handleAddRow}
        />
        {isModalVisible ? (
          <RemoveEmployee
            navigation={navigation}
            setModalVisible={setModalVisible}
            // DelClicked={DelClicked}
            RemoveEmploye={RemoveEmploye}
            username={Usernamelist[indexvalue]}
          />
        ) : null}
        {/* Progress Meter */}
        <View style={styles.containerblue}>
          <View style={styles.headerblue}>
            <Text style={styles.headerbluetext}>FINALIZED</Text>
          </View>
        </View>

        <View style={styles.header}>
          {Usernamelist.length === 0 ? (
            <View>
              <Text></Text>
            </View>
          ) : (
            <View style={styles.Usernamelist}>
              {/* descending */}
              {/* {indexvalue > 0 && indexvalue != Usernamelist.length ? (
                <TouchableOpacity onPress={changeusernameDEC}>
                  <Text style={styles.textname}> &#60;</Text>
                </TouchableOpacity>
              ) : null} */}
              <Text style={styles.textname}>
                {Usernamelist.length == 1
                  ? Usernamelist[0]
                  : Usernamelist[indexvalue]}
              </Text>
              {/* ascending */}
              {/* {indexvalue >= 0 && indexvalue < Usernamelist.length - 1 ? (
                <TouchableOpacity onPress={changeusernameASC}>
                  <Text style={styles.textname}> &#62;</Text>
                </TouchableOpacity>
              ) : null} */}
            </View>
          )}

          <View style={{width: '25%'}}>
            <TouchableOpacity onPress={Save}>
              <Text style={styles.backbtn}>&#60; Back </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[styles.container, {flexDirection: 'row', flexWrap: 'wrap'}]}>
          <View
            style={[
              styles.buttonRow,
              {
                width: '62%',
                justifyContent: 'flex-start',
              },
            ]}>
            <Text
              style={[
                styles.button,
                {
                  fontWeight: '600',
                  color: '#c1c0c1',
                  fontSize: 19,
                  paddingVertical: 10,
                },
              ]}>
              Week Ending:{' '}
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderLeftWidth: 8, // updated property
                borderLeftColor: '#E8E8E8', // updated property
                padding: 10,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#c1c0c1',
                  fontSize: 19,
                }}>
                {route.params.paramkeyWeekEndDate}
              </Text>
            </View>

            <>
              <Text style={[styles.button, {paddingVertical: 10}]}>
                {' '}
                {'   '}Total Time:{' '}
              </Text>

              <Text style={[styles.button, {paddingVertical: 10}]}>
                {' '}
                {total_RegularTime} reg / {total_Overtime} ot / {total_DBL} dbl{' '}
              </Text>
            </>
          </View>
          {Usernamelist.length === 0 ? (
            <View
              style={[
                styles.buttonRow,
                {justifyContent: 'flex-end', width: '35%'},
              ]}>
              <TouchableOpacity
                onPress={alertEmployee}
                style={[styles.button, {flexDirection: 'row'}]}>
                <Image style={styles.icons} source={Add} />
                <Text style={{paddingVertical: 10}}>
                  {'  '}New Employee{'  '}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.buttonRow,
                {justifyContent: 'flex-end', width: '35%'},
              ]}>
              <TouchableOpacity
                style={[styles.button, {flexDirection: 'row'}]}
                onPress={
                  TableData && TableData.length === 0
                    ? () => CopyEmpWarning()
                    : CopytoggleModal
                }>
                <Image style={styles.icons} source={Copy} />
                <Text style={{paddingVertical: 10}}>
                  {'  '}Copy TimeSheet{'  '}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={alertEmployee2}
                style={[styles.button, {flexDirection: 'row'}]}>
                <Image style={styles.icons} source={Add} />
                <Text style={{paddingVertical: 10}}>
                  {'  '}New Employee{'  '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, {flexDirection: 'row'}]}
                onPress={deleteRecord}>
                <Image style={styles.icons} source={Remove} />
                <Text style={{paddingVertical: 10}}>
                  {' '}
                  {'  '}Remove Employee{'  '}
                </Text>
              </TouchableOpacity> */}
            </View>
          )}
        </View>

        {/* Table Component */}
        {Usernamelist.length === 0 ? null : (
          <View style={{flex: 1, padding: 16}}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#9c9a9a'}}>
              {/* Table Head */}
              <Row
                data={TableHead}
                flexArr={[3]}
                style={styles.head}
                textStyle={styles.headtextfont}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table>
                {/* Table Body */}
                <TableWrapper>
                  {TableData &&
                    TableData.map((e, company_i) => {
                      let concat = e[0][0].split('+')[0];

                      return (
                        <>
                          {/* company name */}
                          {/* remove comapany row */}
                          <Cell
                            key={company_i}
                            data={removeCompany_btn(concat, company_i, e)}
                            flexArr={[3]}
                            style={styles.companystyle}
                            textStyle={styles.textfont2}
                          />
                          {e[1]
                            ? e[1].map((ss, job_i) => (
                                <>
                                  {/* Company job */}
                                  {/*  Remove Job Btn */}
                                  <Cell
                                    data={removejob_btn(
                                      [ss[0]][0].split('+')[0],
                                      job_i,
                                      company_i,
                                      ss,
                                      e,
                                    )}
                                    flexArr={[3]}
                                    key={job_i}
                                    style={styles.jobstyle}
                                    textStyle={styles.textfont2}
                                  />
                                  {/* phase row */}
                                  {ss[1]
                                    ? ss[1].map((qq, phase_id) => {
                                        const clickable = (
                                          individual_phases_value,
                                          phases_column_index,
                                        ) => {
                                          let spliced =
                                            individual_phases_value.slice(0, 8);

                                          var myArray = [
                                            spliced[0],
                                            spliced[1],
                                            spliced[2],
                                            spliced[3],
                                            spliced[4],
                                            spliced[5],
                                            spliced[6],
                                          ];

                                          const firstCharacters = myArray.map(
                                            item =>
                                              parseInt(item.split('/')[0][0]),
                                          );
                                          const secondCharacters = myArray.map(
                                            item =>
                                              parseInt(item.split('/')[1][0]),
                                          );
                                          const thirdCharacters = myArray.map(
                                            item =>
                                              parseInt(item.split('/')[2][0]),
                                          );
                                          const Regsum = firstCharacters.reduce(
                                            (accumulator, currentValue) =>
                                              accumulator + currentValue,
                                            0,
                                          );
                                          const Ovrsum =
                                            secondCharacters.reduce(
                                              (accumulator, currentValue) =>
                                                accumulator + currentValue,
                                              0,
                                            );
                                          const Dblsum = thirdCharacters.reduce(
                                            (accumulator, currentValue) =>
                                              accumulator + currentValue,
                                            0,
                                          );
                                          return spliced.map(
                                            (phases, phases_row_index) => {
                                              if (phases_row_index === 7) {
                                                return (
                                                  <TouchableOpacity>
                                                    <View
                                                      style={
                                                        styles.ridesFriends
                                                      }>
                                                      <View
                                                        style={
                                                          styles.verticleLine
                                                        }></View>
                                                      <Text
                                                        style={{
                                                          fontSize: 16,
                                                          backgroundColor:
                                                            'transparent',
                                                          textAlign: 'center',
                                                          width: '100%',
                                                        }}>
                                                        {phases ==
                                                          'null/null/null' ||
                                                        phases ==
                                                          null / null / null
                                                          ? `${Regsum}/${Ovrsum}/${Dblsum}`
                                                          : phases}
                                                      </Text>
                                                    </View>
                                                  </TouchableOpacity>
                                                );
                                              }
                                              if (phases_row_index === 8) {
                                                return null;
                                              }
                                              return (
                                                <Pressable
                                                  style={{width: '100%'}}
                                                  onPress={() =>
                                                    get_set(
                                                      phases,
                                                      company_i,
                                                      job_i,
                                                      phases_column_index,
                                                      phases_row_index,
                                                      ss,
                                                      e,
                                                      qq,
                                                    )
                                                  }>
                                                  <View
                                                    style={styles.ridesFriends}>
                                                    <View
                                                      style={
                                                        styles.verticleLine
                                                      }></View>
                                                    <Text
                                                      style={{
                                                        fontSize: 16,
                                                        backgroundColor:
                                                          'transparent',
                                                        textAlign: 'center',
                                                        width: '100%',
                                                      }}>
                                                      {phases === '0/0/0'
                                                        ? ''
                                                        : phases}
                                                    </Text>
                                                  </View>
                                                </Pressable>
                                              );
                                            },
                                          );
                                        };

                                        return (
                                          <Rows
                                            data={[
                                              [
                                                Create_btn_delete_pahse(
                                                  qq[0],
                                                  phase_id,
                                                  job_i,
                                                  company_i,
                                                  qq,
                                                  ss,
                                                ),
                                                ...clickable(
                                                  qq.slice(1),
                                                  phase_id,
                                                ),
                                              ],
                                            ]}
                                            flexArr={[3]}
                                            //  style={styles.phasestyle}
                                            style={[
                                              styles.phasestyle,
                                              phase_id % 2 && {
                                                backgroundColor: '#f7f5f8',
                                              },
                                            ]}
                                            textStyle={styles.textfont2}
                                          />
                                        );
                                      })
                                    : null}
                                  {/* Add phase btn */}
                                  <Cell
                                    data={elementPhaseButton(
                                      e,
                                      company_i,
                                      job_i,
                                      ss,
                                    )}
                                    flexArr={[3]}
                                    style={styles.row}
                                    textStyle={styles.textfont2}
                                  />
                                </>
                              ))
                            : null}
                          {/* Add Job Btn */}
                          <Cell
                            data={elementJobButton(e, company_i)}
                            flexArr={[3]}
                            style={styles.row}
                            textStyle={styles.textfont2}
                          />
                        </>
                      );
                    })}
                </TableWrapper>

                {TableData && TableData.length === 0 ? (
                  <View
                    style={{
                      width: '100%',
                      height: 35,
                      backgroundColor: '#D3D3D3',
                    }}>
                    <Text style={{fontSize: 20}}>No data found</Text>
                  </View>
                ) : (
                  <></>
                )}
                {/* Add company btn */}
                <Row
                  data={btnData2}
                  flexArr={[3]}
                  style={styles.row}
                  textStyle={styles.textfont2}
                />
              </Table>
            </ScrollView>

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: 'grey',
              }}></Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: 'grey',
              }}></Text>
          </View>
        )}

        {openmodalEmployeeVisible ? (
          <DisplayEmployee
            navigation={navigation}
            AddEmployeeName={AddEmployeeName}
            deleteEmployee_modal={deleteEmployee_modal}
            Employee={Employee}
            setEmployee={setEmployee}
            setindexvalue={setindexvalue}
            indexvalue={indexvalue}
            // GetEmployee={GetEmployee}
            loading={Employeeloading}
            setprocess_loader={setprocess_loader}
            setopenmodalEmployeeVisible={setopenmodalEmployeeVisible}
            changeusernameSC={changeusernameSC}
            timesheet_emp={timesheet_emp}
            Usernamelist={Usernamelist}
            UserList={UserList}
            setUserList={setUserList}
            TableData={TableData}
            setTableData={setTableData}
            setCJP={setCJP}
            settotal_Overtime={settotal_Overtime}
            settotal_DBL={settotal_DBL}
            settotal_RegularTime={settotal_RegularTime}
            Empty_Week_Totals={Empty_Week_Totals}
            Add_Week_Totals={Add_Week_Totals}
          />
        ) : null}

        {Usernamelist.length === 0 ? (
          <Text style={{position: 'absolute', bottom: 0}}>
            {' '}
            No employee exist in the current timesheet.Click the plus button
            above to add employees
          </Text>
        ) : null}
      </SafeAreaView>
    );
  }
};

export default Approve_EditTimeSheetScreen;
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 0.07,
    padding: 20,
    backgroundColor: '#f5f3f5',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    fontSize: 15,
  },

  text: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
  },
  head: {height: 60, backgroundColor: '#9c9a9a'},
  headtextfont: {margin: 6, textAlign: 'center', color: '#fff'},
  textfont2: {margin: 6, textAlign: 'left', fontWeight: 'bold'},
  btn: {
    width: 100,
    height: 18,
    backgroundColor: '#307ecc',
    borderRadius: 2,
    marginLeft: 5,
  },
  btnText: {textAlign: 'center', color: '#fff'},
  btnjobcontainer: {
    // marginLeft: '5%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#edebeb',
    padding: '0.5%',
  },

  // btnphcontainer: {
  //   // marginLeft: '5%',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   backgroundColor:'#edebeb',
  //   padding:'0.5%',
  //   marginRight:'30%'
  // },
  btnphasecontainer: {
    backgroundColor: '#e8e9eb',
    padding: '0.5%',
    display: 'flex',
    textAlign: 'left',
    flexDirection: 'row',
  },
  row: {
    height: 40,
  },
  companystyle: {
    backgroundColor: '#cccccc',
    paddingTop: '1%',
    // backgroundColor: "#acadad",
    paddingBottom: '0.5%',
  },
  jobstyle: {
    backgroundColor: '#ebe8e8',
    padding: '0.5%',
    paddingTop: '1%',
    paddingLeft: '2%',
  },
  phasestyle: {
    // borderWidth:0.5,
    // paddingLeft:'10%',
    paddingLeft: '3%',
    padding: '0.5%',
    paddingTop: '1%',
    // borderColor: "#cccccc",
    backgroundColor: '#fff',
  },

  containerblue: {
    backgroundColor: '#f5f3f5',
    borderWidth: 5,
    borderColor: '#fff',
    borderStyle: 'solid',
    width: 'auto',
  },
  headerblue: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fcb601',
    padding: 10,
    width: '100%',
  },
  headerbluetext: {
    textAlign: 'center',
    fontSize: 25,
    color: '#fff',
    letterSpacing: 2,
  },

  headerrow: {
    flexDirection: 'row',
  },
  SectionStyle: {
    height: 50,
    margin: 10,
    borderColor: 'white',
    width: '20%',
    justifyContent: 'flex-end',
  },
  SectionStyle2: {
    height: 50,
    marginTop: 0,
    margin: 10,
    borderColor: 'white',
    width: '20%',
    justifyContent: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    color: '#c1c0c1',
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
  },
  labelone: {
    fontWeight: 'bold',
    color: '#797679',
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
  },
  headerinputStyle: {
    flex: 1,
    color: color.lightgray,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 8,
    borderColor: '#E8E8E8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btncompany: {
    padding: '0.3%',
    backgroundColor: '#e6e7e8',
  },
  Savecontainer: {
    alignSelf: 'flex-end',
  },
  btn: {
    padding: 10,
    borderColor: 'blue',
    width: 100,
    backgroundColor: '#4478de',
  },
  disabledbtn: {
    padding: 10,
    borderColor: 'blue',
    width: 100,
    backgroundColor: '#d3d3d3',
  },
  logo: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginTop: 25,
  },
  Usernamelist: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textname: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1b386a',
    marginBottom: -30,
  },
  backbtn: {
    fontSize: 25,
    color: '#6ca4d6',
    fontWeight: '500',
  },

  circle: {
    borderRadius: 40,
    width: 50,
    height: 50,
    backgroundColor: '#1b386a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
  },
  logo: {
    width: 25,
    height: 25,
  },
  circlecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
  },
  circlecontainer_newEmployeeOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: "5%",
    // width:"100%",
    backgroundColor: 'red',
    position: 'relative',
    // paddingLeft:"30%"
  },
  wholecontainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  circletext: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1b386a',
    marginLeft: 10,
    marginRight: 20,
  },
  buttonscontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticleLine: {
    height: '250%',
    width: 1,
    backgroundColor: '#cac8ca',
  },
  ridesFriends: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  Pageloading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
