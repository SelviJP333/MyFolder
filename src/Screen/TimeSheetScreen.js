// VK Timesheet

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
import DisplayEmployee from './DisplayEmployee';
import RemoveEmployee from '../Components/RemoveEmployee';
import CopyEmployeeWarning from '../Components/CopyEmployeeWarning';
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
import WarningPopup from '../Components/WarningPopup';
// import {a} from './dummy.js'
import {useFocusEffect} from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import TimeSheet_Copypop from '../Components/TimeSheet_Copypop';
import SynchData from '../Sync/SynchData';
import color from '../constants/color';
import {menu_save_time} from '../redux/actions/Action';
import {useContext} from 'react';
import {Savefunc_Context} from '../App';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
const TimeSheetScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const value = useContext(Savefunc_Context);
  const networkStatus = checkNetworkStatus();
  const getUser = useSelector(store => store);

  const [copyphase, setcopyphase] = useState([]);
  const [SelectedId, setSelectedId] = useState([]);
  const [GetEmpId, setGetEmpId] = useState([]);
  const [WholeEmployee, SetWholeEmployee] = useState([]);
  const [FromUserDetails, SetFromUserDetails] = useState([]);
  const [copyjob, setcopyjob] = useState([]);
  const [Edit_whole_Employee, SetEdit_whole_Employee] = useState([]);
  const [UserList, setUserList] = useState('');
  const [selectedJob, SetSelectedJob] = useState('');
  const [SelectedPhase, SetSelectedPhase] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [UserRole, setUserRole] = useState('');
  const [DispGetEmp, setDispGetEmp] = useState('');
  const [SelectedUserRole, SetSelectedUserRole] = useState('');
  const [deletetime, setdeletetime] = useState(null);

  const [openmodalEmployeeVisible, setopenmodalEmployeeVisible] =
    useState(false);
  const [Check, setCheck] = useState(false);
  ///
  const [SelectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [
    HasEstimatedProjectCompletionDate,
    SetHasEstimatedProjectCompletionDate,
  ] = useState('');
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedcompanyId, setselectedcompanyId] = useState(null);
  const [record, setRecord] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);
  const [Rod, setRod] = useState(0);

  const [Checkk, setCheckk] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [Checkeddata, setCheckeddata] = useState(false);

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
    if (Usernamelist.length > 1) {
      AddedEmployee();
    }
  }, [Checkeddata]);

  const AddedEmployee = () => {
    Empty_Week_Totals();
    setCJP(prev => ({
      company: [],
      job: [],
      phase: [],
    }));

    setPageLoading(true);
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue) {
        setindexvalue(Usernamelist.length - 1);
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
                company: [
                  ...prev.company,
                  e[0][0].split('+')[0].split('*#^*')[1],
                ],
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
    setCheckeddata(false);
  };

  function showDatePicker(job_i, company_i, job) {
    setDatePickerVisibility(true);

    setselected_data([company_i, job_i]);
    // var date = new Date(ss[0].split('*#^*').slice(-2, -1)[0]);
    var date = job[0].split('*#^*');
    const lastElement = date[date.length - 1];
    if (lastElement != '') {
      setSelectedDate(new Date(lastElement));
    }

    //   setSelectedDate(date);
  }
  //  execute if user clicks top right menu icon
  useEffect(() => {
    if (value['values'][0] === true) {
      if (Usernamelist.length !== 0) {
        Save();
      }
    }
  }, [value['values'][0]]);

  useEffect(() => {
    //value["values"][1](()=>()=>Save)
    dispatch(menu_save_time(Save));
    SetFromUserDetails(
      WholeEmployee.filter(e => {
        if (e.FullName === Usernamelist[indexvalue]) {
          return e;
        }
      }),
    );
  }, [Usernamelist, indexvalue]);

  useEffect(() => {
    const getcheckemp = Employee.map(d => {
      if (d.check == true) {
        return d;
      }
    }).filter(function (x) {
      return x !== undefined;
    });
    const getcheckempValue = getcheckemp
      .map(e => {
        if (Usernamelist[indexvalue] === e.key) {
          return e.value;
        }
      })
      .filter(function (x) {
        return x !== undefined;
      });
    setSelectedId(getcheckempValue);
  }, [Employee, indexvalue]);

  const handleConfirm = date => {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};

    let date_modified = moment(date).format('MM/DD/YYYY');
    // console.warn('A date has been picked: ', date_modified);

    let splited_value =
      TableData[selected_data[0]][1][selected_data[1]][0].split('*#^*');
    splited_value[3] = `${date_modified}`;

    TableData[selected_data[0]][1][selected_data[1]].splice(
      0,
      1,
      splited_value.join('*#^*'),
    );

    setDatePicker(false);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // useEffect(() => {
  //   for (let i = 0; i < Usernamelist.length; i++) {
  //     let selectedusername = Usernamelist[i];

  //     let obj = {};
  //     obj[selectedusername] = TableData;
  //     obj['total_RegularTime'] = total_RegularTime;
  //     obj['total_DBL'] = total_DBL;
  //     obj['total_Overtime'] = total_Overtime;
  //     dispatch(AddData(obj));
  //     dispatch(Temp_Add(obj));
  //     // setTableData([]);
  //     settotal_Overtime(0);
  //     settotal_DBL(0);
  //     settotal_RegularTime(0);
  //     if (getUser.count.data.length !== 1) {
  //       let objArr = Object.values(getUser.count.data)[i];

  //       let res = Usernamelist[i];

  //       objArr &&
  //         objArr[res].map(e => {
  //           setCJP(prev => ({
  //             company: [...prev.company, e[0][0].split('+')[0]],
  //             job: [],
  //             phase: [],
  //           }));
  //         });

  //       objArr && setTableData(objArr[res]);
  //       objArr && settotal_Overtime(objArr['total_Overtime']);
  //       objArr && settotal_DBL(objArr['total_DBL']);
  //       objArr && settotal_RegularTime(objArr['total_RegularTime']);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    dispatch(Add_Date(route.params && route.params.paramKey));
    // dispatch(delete1());    // dispatch(delete2());
    weeekenddates();
  }, []);

  const weeekenddates = () => {
    const sundayDateString = route.params.paramKey;
    const sundayMoment = moment(sundayDateString, 'MM/DD/YYYY');
    //
    const weekDates = [];
    for (let i = 6; i >= 0; i--) {
      const weekMoment = moment(sundayMoment).subtract(i, 'days');
      weekDates.push(weekMoment.format('MM/DD'));
    }
    Setweekenddate(weekDates);
  };
  // const weekdate = [
  //   '10/17',
  //   '10/18',
  //   '10/19',
  //   '10/20',
  //   '10/21',
  //   '10/22',
  //   '10/23',
  // ];

  let currentDate = new Date();

  let futureDate = new Date();
  futureDate.setFullYear(currentDate.getFullYear() + 15);

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
  const [UserCompanyID, SetUserCompanyID] = useState('');

  // cmt states
  const [add_cmnt, setadd_cmnt] = useState(false);
  const timesheet_emp = Usernamelist[indexvalue];
  const [cmnts_popup_detail, setcmnts_popup_detail] = useState({
    cmnt_user: null,
    cmnt_job: null,
    cmnt_phase: null,
    phase_hours: null,
    cmt_companyI: null,
    cmt_jobI: null,
    cmt_phaseI: null,
  });
  const get_Empl = async (type, selectedEmployeeID) => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');
    setEmployeeloading(true);
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
                setUserRole(temp2[0].UserRole);
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
                    SetEdit_whole_Employee(newArray);
                    setEmployee(newArray);
                    setEmployeeloading(false);
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
      setmodalEmployeeVisible(true);
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

                    newArray = newArray.filter(e => {
                      if (Usernamelist.indexOf(e.key) === -1) {
                        return e;
                      }
                    });

                    // get all employee
                    //  SetEdit_whole_Employee(newArray);
                    setEmployee(newArray);
                    setEmployeeloading(false);
                  });
                });
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
                query = `select * from  Employee where IsActive=1 and AutoEarnings = 0 and companyId in (${
                  temp[0].Company1
                },${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${
                  temp[0].Company5
                })  and EmployeeId not in(${selected_Employee_Id.toString()})
                union select * from employee where EmployeeId = ${
                  temp[0].EmployeeID
                } and EmployeeId not in(${selected_Employee_Id.toString()})
                `;
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
                    //SetEdit_whole_Employee(newArray);
                    setEmployee(newArray);
                    setEmployeeloading(false);
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
      setmodalEmployeeVisible(true);
    }
  };

  // Get Username from localstorage
  const getData = async () => {
    let json = await AsyncStorage.getItem('UserDetails');
    var filter = JSON.parse(json);
    var data = filter.map(e => e.value);
    setLoginUsername(filter.map(e => e.key)[0]);
    Usernamelist.push(filter.map(e => e.key)[0]);
    EmployeeID.push(filter.map(e => e.value)[0]);
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
          // for (var i in projects) {
          //   if (projects[i].value == value) {
          //      projects[i].desc = desc;
          //      break; //Stop this loop, we found it!
          //   }
          // }

          SetCompany(data);
        }
      });
    });
  };

  const getSelectedUserRole = UserName => {
    let q = `select * from employee where FullName = '${Usernamelist[indexvalue]}'`;
    var temp = [];
    let role;
    db.transaction(tx => {
      tx.executeSql(
        q,
        [],
        (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          SetSelectedUserRole(temp[0].UserRole);
        },
        er => {
          console.error('Eroorrrr', er);
        },
      );
    });
    return role;
  };

  const Getdatajobs = () => {
    let q = ` select JobID , JobName , JobNo, CompanyID from (select * from LkpJob where isactive=1 and JobID = -1 and 1 = 1=(select IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END),0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId}) ) union select JobID,JobName,JobNo, CompanyID from LkpJob where IsActive =1 and JobID <> -1 and 0 =(select IFNULL((CASE WHEN [LogAtCompanyLevel] = '' THEN '' ELSE [LogAtCompanyLevel] END), 0) AS [LogAtCompanyLevel] from Employee WHERE EmployeeID = ${SelectedEmployeeId}) `;
    db.transaction(tx => {
      tx.executeSql(q, [], (tx, res) => {
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
            CompanyID: item.CompanyID,
          };
        });
        //
        setcopyjob(newArray);
      });
    });
  };
  // Get JOblist
  const GetJobs = (selectedCompany, company_index = null, type) => {
    Getdatajobs();
    setselectedcompanyname(selectedCompany);

    setselectedcompanyId(selectedCompany);

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

      // if (SelectedUserRole === 'admin' || SelectedUserRole === 'office') {
      //   // q += ` or JobID = -1  and  JobID < 0 `;
      // } else {
      //   q += `
      //     and JobID > 0
      //     `;
      // }
      // q += `
      //   ORDER BY CASE WHEN JobId  <= -1 THEN JobName ELSE JobID END `;

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

      // if (SelectedUserRole === 'admin' || SelectedUserRole === 'office') {
      // var q = `select JobID,JobName,JobNo from LkpJob where IsActive =1  and JobID < -1 and CompanyID = ${selectedCompany} order by JobName`;
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

          er => {
            console.error('Eroorrrr', er);
          },
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

  // get phase list
  const GetPhase = (SetSelectedJob, company_index, phasejob_index, type) => {
    setPhaseLoading(true);
    if (type === 'View All') {
      db.transaction(tx => {
        var query = '';
        query += `select * from (select PhaseCodeID,PhaseCode,PhaseCodeName from LkpPhaseCode lp left join timesheetJob Tj on tj.[JobId] = lp.[JOBId] where IsActive = 1 AND [PhaseGroup] IN (SELECT [PhaseGroup] FROM [LkpCompany] where CompanyId = (SELECT companyid FROM [LkpJob] where JobID =${SetSelectedJob} ) ) AND [IsRestricted] = 0 `;
        if (SelectedUserRole === 'field') {
          query += ' AND [AllowFieldUse] = 1 ';
        }
        query += ` union select PhaseCodeID,PhaseCode,PhaseCodeName from LkpPhaseCode where IsActive = 1 AND [IsRestricted] = 0 AND PhaseCodeID = -1 ) ph `;
        tx.executeSql(query, [], (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value:
                item.PhaseCodeID +
                '*#^*' +
                item.PhaseCode +
                ' ' +
                item.PhaseCodeName,
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
                return {...e, check: true, status: true};
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
         AND [IsRestricted] = 1 AND PhaseCodeID <> (SELECT [PhaseGroup] FROM [LkpCompany] where CompanyId = ((SELECT companyid FROM [LkpJob] where JobID = ${SetSelectedJob} ))  )
          `;
        if (SelectedUserRole === 'field') {
          query += '    AND [AllowFieldUse] = 1';
        }
        query += ` ORDER BY [PhaseCodeName]  `;
        tx.executeSql(query, [], (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value:
                item.PhaseCodeID +
                '*#^*' +
                item.PhaseCode +
                ' ' +
                item.PhaseCodeName,
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
  //CopyEmployee PopUp//////

  const CopytoggleModal = item => {
    setCopyModalVisible(!isCopyModalVisible);
  };
  const CopyEmpWarning = item => {
    setCheckk(!Checkk);
  };
  // company modal visible
  const alertCompany = () => {
    //setTableData(userEmail)

    setmodalComapanyVisible(true);
  };
  // employee modal visible
  const alertEmployee = () => {
    get_Empl('first click', null);
  };

  // second time click while add new employee
  const alertEmployee2 = () => {
    get_Empl('second click', null);
  };

  // companyjobvisible
  const alertJob = (e, job_i) => {
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete job popup open and do functionality respectively
  const deletejob = (e, job_i, company_index, ss) => {
    if (ss.length > 1) {
      if (ss[0]) {
        if (ss[1][0] != undefined) {
          setdeletetime(ss[1]);
        }
      }
    }
    setcompany_index(company_index);
    setdeletejob_modal(true);
    setjob_index(job_i);
    setmodalJobVisible(true);
  };

  // delete company popup open and do functionality respectively

  const deleteCompany = (e, company_index, com) => {
    let phases = [];
    if (com.length > 1) {
      let arr = [];
      com[1].forEach(e => {
        if (e[1]) {
          e[1].forEach(e1 => arr.push(e1));
        }
      });
      setdeletetime(arr);
    }
    setcompany_index(company_index);
    setdeleteCompany_modal(true);
    setmodalComapanyVisible(true);
    setselectedcompanyname(e);

    //
    // setdeltecompy_funcpass(()=>()=>{
    // })
  };
  // delete phase popup open and do functionality respectively
  const deletePhase = (e, phase_i, job_i, company_i, qq) => {
    setdeletetime(qq);

    setcompany_index(company_i);
    setjob_index(job_i), setphasejob_index(phase_i);
    setmodalPhaseVisible(true);
    setdeletePhase_modal(true);
    setselectedphasename(e);
  };

  //get company index and job index to add phase
  const alertPhase = (e, company_i, job_i) => {
    setphasejob_index(job_i);

    setcompany_index(company_i);

    setmodalPhaseVisible(true);
  };
  const AddEmployeeName = (selectEmployee, selectEmployeeID) => {
    GetUserCompany();

    if (modalEmployeeVisible === true && deleteEmployee_modal !== true) {
      setmodalEmployeeVisible(false);

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
    }
  };

  // This function related to add and delete company,job,phase row in table respectively
  const handleAddRow = (
    SelectedPhase1,
    SelectedPhasename1,
    SelectedJobname1,
    selectetJobID,
    SelectedJobCode1,
    selectedCompany,
    selectedCompanyID,
  ) => {
    if (modalComapanyVisible === true && deleteComapany_modal !== true) {
      // Add only company
      selectedCompany.forEach((e, i) => {
        var companyguid = generateGuidQuickly();
        let dataCompany = `${e}+${companyguid}`;

        // Extract the number before '*#^*' using regular expression
        const number = parseInt(e.split('*#^*')[0]);

        // Find the appropriate index to insert the new data
        let insertIndex = 0;
        while (
          insertIndex < TableData.length &&
          number >
            parseInt(TableData[insertIndex][0][0].match(/(\d+)\*\#\^\*/)[1])
        ) {
          console.log(
            'insertIndex < TableData.length && number > parseInt(TableData[insertIndex][0][0].match(/(d+)*#^*/)[1])',
            insertIndex < TableData.length &&
              number >
                parseInt(
                  TableData[insertIndex][0][0].match(/(\d+)\*\#\^\*/)[1],
                ),
          );
          insertIndex++;
        }

        // Insert the new data at the determined index

        TableData.length === 0
          ? setTableData(prev => [...prev, [[dataCompany]]])
          : setTableData(prev => [
              ...prev.slice(0, insertIndex),
              [[dataCompany]],
              ...prev.slice(insertIndex),
            ]);
      });

      CompanyID.push(selectedCompanyID[0]);
      selectedCompany.forEach(e => {
        //
        if (e) {
          setCJP(prev => ({
            company: [...prev.company, e.split('*#^*')[1]],
            job: [],
            phase: [],
          }));
        }
      });
    } else if (modalJobVisible === true && deletejob_modal !== true) {
      //Add Job only

      const add = id => {
        // Sort the SelectedJobname1 array based on the job identifier part
        SelectedJobname1.sort((a, b) => {
          // Split the job identifiers into parts using the "*#^*" separator
          const partsA = a.split('*#^*');
          const partsB = b.split('*#^*');

          // Extract the specific part of the job identifier for comparison
          const partA = partsA[1].split('-')[1]; // Modify this based on your desired part of the identifier
          const partB = partsB[1].split('-')[1]; // Modify this based on your desired part of the identifier

          // Check the partA and PartB is numerical or not
          let partData = isNaN(parseInt(partA));

          if (partData === false) {
            // Compare the parts and return the result of the comparison
            return partA.localeCompare(partB);
          }
        });

        const empty = [];

        SelectedJobname1.forEach((job_e, i) => {
          var jobguid = generateGuidQuickly();

          if (HasEstimatedProjectCompletionDate === 1) {
            const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
            empty.push([
              `${job_e} +${id}+${jobguid}` +
                '*#^*' +
                date.toLocaleDateString('en-US', options),
            ]);
          } else {
            empty.push([`${job_e} +${id}+${jobguid}` + '*#^*']);
          }
        });

        return empty;
      };

      JobID.push(selectetJobID[0]);

      let added_job = TableData.map((e, company_i) => {
        if (company_i === job_index) {
          if (e.length > 1) {
            e[1].sort((a, b) => {
              const valueA = a[0].split('*#^*')[1];
              const valueB = b[0].split('*#^*')[1];

              return valueA.localeCompare(valueB);
            });

            const mergedArray = [...e[1], ...add(e[0][0].split('+')[1])];

            let Jobsdata = mergedArray.sort((a, b) => {
              const valueA = a[0].split('*#^*')[1];
              const valueB = b[0].split('*#^*')[1];

              return valueA.localeCompare(valueB);
            });

            return [e[0], Jobsdata];
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
      setdeletetime(null);
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

      let splited = selectedcompanyname.includes('*#^*')
        ? selectedcompanyname.split('*#^*')[1]
        : selectedcompanyname;
      let result = CJP['company'].filter(item => {
        return !item.toString().includes(splited);
      });
      setCJP({
        company: result,
        job: [],
        phase: [],
      });

      //  SetCompany(removed); // var objIndex = AllCompany.filter((obj) => obj.value ==  selectedcompanyname); // Company.push(objIndex[0]);

      TableData.splice(company_index, 1);
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

      setTableData(delete_phase);

      setdeletePhase_modal(false);

      setmodalPhaseVisible(false);
      setselectedphasename(null);
    } else if (modalPhaseVisible === true) {
      //  add phase row
      var phaseguid = generateGuidQuickly();
      var objIndex = Phase.forEach((obj, i) => {});

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

                  let modification = [
                    ...j_data[1],
                    ...add(e[0][0].split('+')[1], j_data[0].split('+')[2]),
                  ];
                  modification.sort((a, b) => {
                    const numA = a[0].split('*#^*')[1];
                    const numB = b[0].split('*#^*')[1];
                    return numA.localeCompare(numB);
                  });

                  modification.forEach(item => {
                    const numberAfterSymbol = item[0].split('*#^*')[1];
                  });

                  return [j_data[0], modification];
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

                  empty.sort((a, b) => {
                    const numA = a[0].split('*#^*')[1];
                    const numB = b[0].split('*#^*')[1];
                    return numA.localeCompare(numB);
                  });
                  empty.forEach(item => {
                    const numberAfterSymbol = item[0].split('*#^*')[1];
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
      <TouchableOpacity
        onPress={() => alertCompany()}
        style={{flexDirection: 'row'}}>
        <Image
          source={require('../Image/addicon.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <Text
          style={{
            marginLeft: 10,
            marginTop: 7,
            fontSize: 15,
            fontWeight: '500',
            letterSpacing: 1,
            color: color.gray,
          }}>
          ADD COMPANY
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Add Phase Btn
  const elementPhaseButton = (e, company_i, job_i) => (
    <View style={styles.btnphasecontainer}>
      <TouchableOpacity
        style={{flexDirection: 'row', marginLeft: 65}}
        onPress={() => {
          let splited = e[1][job_i][0].split('*#^*');
          let gg = splited[0] ? splited[0] : '*#^*' + splited[1];
          splited = gg;
          setSelectedJobId(splited);
          GetPhase(splited, company_i, job_i, 'first click');

          // SetSelectedPhase([]);

          setalreadyExist([company_i, job_i]);
          alertPhase(e, company_i, job_i);
        }}>
        <Image
          source={require('../Image/addicon.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <Text
          style={{
            marginLeft: 10,
            marginTop: 7,
            fontSize: 15,
            fontWeight: '500',
            letterSpacing: 1,
            color: color.gray,
          }}>
          ADD PHASE CODE
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => {
          let splited = e[1][job_i][0].split('*#^*');
          let gg = splited[0] ? splited[0] : '*#^*' + splited[1];
          splited = gg;
          setSelectedJobId(splited);
          GetPhase(splited, 'first click');

          // SetSelectedPhase([]);

          setalreadyExist([company_i, job_i]);
          alertPhase(e, company_i, job_i);
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
      </TouchableOpacity> */}
    </View>
  );

  // Add Job btn
  const elementJobButton = (e, company_i) => (
    <View style={styles.btnjobcontainer}>
      <TouchableOpacity
        onPress={() => {
          let splited = e[0][0].split('*#^*')[0];
          GetJobs(splited, company_i, 'First click');
          alertJob(e, company_i);
        }}
        style={{flexDirection: 'row', marginLeft: 30}}>
        <Image
          source={require('../Image/addicon.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <Text
          style={{
            marginLeft: 10,
            marginTop: 7,
            fontSize: 15,
            fontWeight: '500',
            letterSpacing: 1,
            color: color.gray,
          }}>
          ADD JOB
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Remove job btn
  const removejob_btn = (e, job_i, company_i, ss) => {
    const date = selectedDate;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return (
      <View style={{height: 30}}>
        <TouchableOpacity
          style={{flexDirection: 'row', marginLeft: 30}}
          onPress={() => {
            deletejob(e, job_i, company_i, ss);
          }}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 7,
              fontSize: 15,
              fontWeight: '500',
              letterSpacing: 1,
              color: color.gray,
            }}>
            {'' + e.split('*#^*')[1] + ' ' + e.split('*#^*')[2] + ''}
          </Text>
          <Image
            source={require('../Image/minus.png')}
            Asen
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        {HasEstimatedProjectCompletionDate ? (
          <>
            <View style={{alignSelf: 'flex-end', right: 200}}>
              <Text
                style={{
                  marginLeft: 10,

                  fontSize: 15,
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: color.gray,
                  bottom: 23,
                }}>
                Est . Project Completion Date:
              </Text>
            </View>

            {/*  */}

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
                date={selectedDate}
              />
              <Text style={{fontSize: 18, top: 8, left: 10}}>
                {HasEstimatedProjectCompletionDate &&
                ss[0].split('*#^*')[3] == ''
                  ? formattedDate
                  : ss[0].split('*#^*')[3]}
              </Text>

              <TouchableOpacity
                onPress={() => showDatePicker(job_i, company_i, ss)}>
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
  };

  // remove company btn
  const removeCompany_btn = (e, company_i, com) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            deleteCompany(e, company_i, com);
          }}
          style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 7,
              fontSize: 15,
              fontWeight: '500',
              letterSpacing: 1,
              color: color.gray,
            }}>
            {`   ${e.split('*#^*')[1]}   `}
          </Text>
          <Image
            source={require('../Image/minus.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // remove phase btn
  // "4811-A&E - M.E.P. Engineer+CMP_9cd54fe9-aa28-47fd-8a46-8c870a841223+JOB_05bed19d-c43a-40ce-b327-2dbe22851d0d+PHS_d2d0c5dd-7289-4960-93ab-beb9bdba2a90"
  const Create_btn_delete_pahse = (e, phase_i, job_i, company_i, qq) => {
    return (
      <View style={{marginLeft: 65}}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
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
              cmnt_job: TableData[company_i][1][job_i][0].split('+')[0],
              cmnt_phase: e.split('+')[0],
              phase_hours: [...modified_phase],
              cmt_companyI: company_i,
              cmt_jobI: job_i,
              cmt_phaseI: phase_i,
              actual_cmt: qq[9],
            });

            setadd_cmnt(true);
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            {/* edit */}
            {qq.length === 10 && qq[9] !== '' ? (
              <Image
                source={require('../Image/icon_edit.png')}
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            ) : null}

            <Text
              style={{
                bottom: 10,
                fontSize: 15,
                fontWeight: '500',
                letterSpacing: 1,
                color: color.gray,
              }}>
              {e.split('*#^*')[1].length > 5
                ? e.split('*#^*')[1].split('+')[0].substr(0, 30) + '...'
                : e.split('*#^*')[1]}
              <TouchableOpacity
                onPress={() => {
                  deletePhase(e, phase_i, job_i, company_i, qq);
                }}>
                <Image
                  source={require('../Image/minus.png')}
                  style={{
                    width: 30,
                    height: 30,
                    top: 10,
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
  const widthArr = [500, 100, 100, 100, 100, 100, 100, 100, 133];

  const [btnData2, setbtnData2] = useState([elementCompanyButton(1)]);

  // this functiona call when user click to phase row and open scrollwheel (select hrs) popup will open.
  const get_set = (
    phases,
    company_i,
    job_i,
    phases_column_index,
    phases_row_index,
  ) => {
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
    sethoursmodalVisible(true);
  };

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

  const Save = async () => {
    setprocess_loader(true);
    const myPromise = new Promise((resolve, reject) => {
      let selectedusername = Usernamelist[indexvalue];
      let obj = {};
      obj[selectedusername] = TableData;
      dispatch(AddData(obj));
      dispatch(Temp_Add(obj));
      resolve('foo');
    }).then(async () => {
      let Userid = await AsyncStorage.getItem('Userid');
      let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
      let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));

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
              return obj.FullName === Object.keys(e)[0];
            });
            //
            if (res.rows.length != 0) {
              if (resstatus == false) {
                tx.executeSql(
                  'INSERT INTO Timesheet (TimesheetID, WeekEndDate,StatusID, CreatedBy, CreatedOn)' +
                    ' VALUES (?, ?, ?, ?, ?);',
                  [
                    TimesheetID2,
                    route.params && route.params.paramKey,
                    1,
                    SubmitUserID,
                    DateTime,
                  ],
                  function (tx, res) {
                    resstatus = true;
                  },
                );
                tx.executeSql(
                  'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                  [
                    'I',
                    'Timesheet',
                    TimesheetID2,
                    '-',
                    '',
                    DateTime,
                    Deviceid,
                    0,
                    0,
                    '-',
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
                  tx.executeSql(
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
                    function (tx, res) {
                      resstatus = true;
                    },
                  );
                  if (res.rowsAffected > 0) {
                    if (CompanyID.length == 0) {
                      navigation.navigate('My TimeSheet');
                    }
                  } else {
                    navigation.navigate('My TimeSheet');
                  }
                },
              );

              if (CompanyID.length != 0) {
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
                      tx.executeSql(
                        'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                          ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                        [
                          'I',
                          'TimesheetCompany',
                          Object.values(e)[0][i][0][0].split('+')[1],
                          '-',
                          '',
                          DateTime,
                          Deviceid,
                          0,
                          0,
                          '-',
                        ],
                        function (tx, res) {
                          resstatus = true;
                        },
                      );
                      if (JobID.length == 0) {
                        navigation.navigate('My TimeSheet');
                      } else {
                        if (
                          Object.values(e)[0][i][1] &&
                          Object.values(e)[0][i][1]
                        ) {
                          Object.values(e)[0][i][1].forEach((ee, job_i) => {
                            txn.executeSql(
                              'INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID, EstProjectCompletionDate, CreatedBy, CreatedOn)' +
                                'VALUES (?, ?, ?, ?, ?, ?);',

                              [
                                ee[0].split('+')[2].split('*#^*')[0],

                                Object.values(e)[0][i][0][0].split('+')[1],

                                ee[0].split('*#^*')[0],

                                ee[0].split('*#^*')[3] == ''
                                  ? null
                                  : ee[0].split('*#^*')[3],

                                SubmitUserID,

                                DateTime,
                              ],

                              async function (tx, results) {
                                tx.executeSql(
                                  'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                                  [
                                    'I',
                                    'TimesheetJob',
                                    ee[0].split('+')[2].split('*#^*')[0],
                                    '-',
                                    '',
                                    DateTime,
                                    Deviceid,
                                    0,
                                    0,
                                    '-',
                                  ],
                                  function (tx, res) {
                                    resstatus = true;
                                  },
                                );
                                if (SelectedPhase.length == 0) {
                                  navigation.navigate('My TimeSheet');
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
                                        Object.values(e)[0]
                                          [i][1][job_i][0].split('+')[2]
                                          .split('*#^*')[0],
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
                                      async function (tx, results) {
                                        tx.executeSql(
                                          'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                            ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                                          [
                                            'I',
                                            'TimesheetPhaseCode',
                                            Object.values(e)[0][i][1][job_i][1][
                                              j
                                            ][0].split('+')[3],
                                            '-',
                                            '',
                                            DateTime,
                                            Deviceid,
                                            0,
                                            0,
                                            '-',
                                          ],
                                          function (tx, res) {
                                            resstatus = true;
                                          },
                                        );
                                      },
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

        setRecord(1);
        navigation.navigate('My TimeSheet');
        value['values'][1](false);
      });
    });

    // })
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

  //For selectedEmployeelist
  const changeusernameSC = index => {
    setCJP(prev => ({
      company: [],
      job: [],
      phase: [],
    }));

    setPageLoading(true);
    setTimeout(() => {
      if (Usernamelist.length >= indexvalue) {
        console;
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
                company: [
                  ...prev.company,
                  e[0][0].split('+')[0].split('*#^*')[1],
                ],
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

  const displaySelectedname = () => {
    setopenmodalEmployeeVisible(true);
    setUserList(Usernamelist[indexvalue]);
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
            company: [...prev.company, e[0][0].split('+')[0].split('*#^*')[1]],
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

  // const RemoveEmployee = () => {
  //   let selectedusername = Usernamelist[indexvalue];

  //   Alert.alert('Are You Sure Want To Remove', `${selectedusername}`, [
  //     {
  //       text: 'Cancel',
  //       onPress: () =>
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK',
  //       onPress: () => {
  //         // if redux have more than user

  //         Insert_Employee(selectedusername);
  //         if (
  //           getUser.count.data.length > 1 ||
  //           getUser.count.data.length === 1
  //         ) {
  //           const myPromise = new Promise((resolve, reject) => {
  //             let selectedusername = Usernamelist[indexvalue];
  //             let obj = {};
  //             obj[selectedusername] = TableData;

  //             dispatch(AddData(obj));
  //             dispatch(Temp_Add(obj));
  //             resolve('foo');
  //           }).then(async () => {
  //             // if we remove first employeee
  //             if (indexvalue === 0) {
  //               dispatch(RemoveData(selectedusername));
  //               dispatch(Temp_Remove(selectedusername));

  //               // remove member from userlist
  //               let removed = Usernamelist.filter(e => e !== selectedusername);
  //               //
  //               setUsernamelist([...removed]);
  //               setindexvalue(0);

  //               let currentname = Usernamelist[indexvalue + 1];
  //               //
  //               let filterddd = getUser.count.data.find(e => {
  //                 return Object.keys(e)[0] === currentname;
  //               });

  //               // if reset tabledata if no user selected
  //               getUser.count.data.length === 1
  //                 ? setTableData([])
  //                 : setTableData(filterddd[Object.keys(filterddd)[0]]);
  //               // remove all total counts
  //               if (getUser.count.data.length === 1) {
  //                 // Insert_Employee(selectedusername)
  //                 setTableData([]);
  //                 settotal_RegularTime(0);
  //                 settotal_Overtime(0);
  //                 settotal_DBL(0);

  //                 settotalgroup1({
  //                   reg1: 0,
  //                   ovt1: 0,
  //                   dbl1: 0,
  //                 });
  //                 settotalgroup2({
  //                   reg2: 0,
  //                   ovt2: 0,
  //                   dbl2: 0,
  //                 });
  //                 settotalgroup3({
  //                   reg3: 0,
  //                   ovt3: 0,
  //                   dbl3: 0,
  //                 });
  //                 settotalgroup4({
  //                   reg4: 0,
  //                   ovt4: 0,
  //                   dbl4: 0,
  //                 });
  //                 settotalgroup5({
  //                   reg5: 0,
  //                   ovt5: 0,
  //                   dbl5: 0,
  //                 });
  //                 settotalgroup6({
  //                   reg6: 0,
  //                   ovt6: 0,
  //                   dbl6: 0,
  //                 });
  //                 settotalgroup7({
  //                   reg7: 0,
  //                   ovt7: 0,
  //                   dbl7: 0,
  //                 });
  //               }
  //             }
  //             // if we remove employee other than first employee
  //             else {
  //               // Setselected_Employee_Id
  //               //
  //               // Insert_Employee(selectedusername)
  //               dispatch(RemoveData(selectedusername));
  //               dispatch(Temp_Remove(selectedusername));

  //               let removed = Usernamelist.filter(e => e !== selectedusername);
  //
  //               setUsernamelist([...removed]);
  //               setindexvalue(prev => prev - 1);

  //               let currentname = Usernamelist[indexvalue - 1];

  //               let filterddd = getUser.count.data.find(e => {
  //                 return Object.keys(e)[0] === currentname;
  //               });

  //               setTableData(filterddd[Object.keys(filterddd)[0]]);
  //               settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
  //               settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
  //               settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
  //             }
  //           });
  //         }
  //         // if redux have only one user
  //         else {
  //           // if redux have only one user and index not zero
  //           if (getUser.count.data.length === 1 && indexvalue !== 0) {
  //             const myPromise = new Promise((resolve, reject) => {
  //               let selectedusername = Usernamelist[indexvalue];
  //               let obj = {};
  //               obj[selectedusername] = TableData;
  //               dispatch(AddData(obj));
  //               dispatch(Temp_Add(obj));
  //               resolve('foo');
  //             }).then(async () => {
  //               // Insert_Employee(selectedusername)
  //               dispatch(RemoveData(selectedusername));
  //               dispatch(Temp_Remove(selectedusername));

  //               let removed = Usernamelist.filter(e => e !== selectedusername);
  //
  //               setUsernamelist([...removed]);
  //               setindexvalue(prev => prev - 1);
  //               2;
  //               let currentname = Usernamelist[indexvalue - 1];

  //               let filterddd = getUser.count.data.find(e => {
  //                 return Object.keys(e)[0] === currentname;
  //               });

  //               setTableData(filterddd[Object.keys(filterddd)[0]]);
  //               settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
  //               settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
  //               settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
  //             });
  //           }
  //           // if redux have only one user and index  zero
  //           else if (indexvalue === 0) {
  //             let removed = Usernamelist.filter(e => e !== selectedusername);

  //             // Insert_Employee(selectedusername)
  //             setUsernamelist([...removed]);
  //             setindexvalue(0);
  //             setTableData([]);
  //           }
  //         }
  //       },
  //     },
  //   ]);
  // };
  const RemoveEmploye = () => {
    let selectedusername = Usernamelist[indexvalue];

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
          //
          setUsernamelist([...removed]);
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
          setindexvalue(prev => prev - 1);

          let currentname = Usernamelist[indexvalue - 1];

          let filterddd = getUser.count.data.find(e => {
            return Object.keys(e)[0] === currentname;
          });

          setTableData(filterddd[Object.keys(filterddd)[0]]);
          settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
          settotal_DBL(filterddd[Object.keys(filterddd)[3]]);
          settotal_RegularTime(filterddd[Object.keys(filterddd)[1]]);
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

          setUsernamelist([...removed]);
          setindexvalue(prev => prev - 1);
          2;
          let currentname = Usernamelist[indexvalue - 1];

          let filterddd = getUser.count.data.find(e => {
            return Object.keys(e)[0] === currentname;
          });

          setTableData(filterddd[Object.keys(filterddd)[0]]);
          settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
          settotal_DBL(filterddd[Object.keys(filterddd)[3]]);
          settotal_RegularTime(filterddd[Object.keys(filterddd)[1]]);
        });
      }
      // if redux have only one user and index  zero
      else if (indexvalue === 0) {
        let removed = Usernamelist.filter(e => e !== selectedusername);

        // Insert_Employee(selectedusername)
        setUsernamelist([...removed]);
        setindexvalue(0);
        setTableData([]);
      }
    }

    // ]);
  };
  const deleteRecord = () => {
    //
    setModalVisible(true);
    // setDelClicked(item);
  };

  if (Pageloading == true) {
    return (
      <View style={styles.Pageloading}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.maincontainer}>
        {/* select times modal */}
        {process_loader ? <Processing /> : null}

        {Check ? (
          <WarningPopup
            Check={Check}
            setCheck={setCheck}
            text="Total Time Exceed 24 hours"
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
            setadd_cmnt={setadd_cmnt}
            setpopup_entry={setpopup_entry}
            type={'comments'}
            cmnts_popup_detail={cmnts_popup_detail}
          />
        ) : null}

        <Scroll_modal
          setpopup_twentyfour={setpopup_twentyfour}
          setData={setData}
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
          EarningsCode={EarningsCode}
          setCheck={setCheck}
        />

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
            Checkeddata={Checkeddata}
            setCheckeddata={setCheckeddata}
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
            company_index={company_index}
            phasejob_index={phasejob_index}
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
            Page="Timesheet"
            paramkeyWeekEndDate={route.params && route.params.paramKey}
            EditTimesheetID=""
            close=""
            ApproveUsernameList=""
          />
        ) : null}

        {Checkk ? (
          <CopyEmployeeWarning Checkk={Checkk} setCheckk={setCheckk} />
        ) : null}

        {/* Progress Meter */}
        <View style={styles.containerblue}>
          <View style={styles.headerblue}>
            <Text style={styles.headerbluetext}>IN PROGRESS</Text>
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
              {indexvalue > 0 && indexvalue != Usernamelist.length ? (
                <TouchableOpacity onPress={changeusernameDEC}>
                  <Text style={styles.textname}> &#60;</Text>
                </TouchableOpacity>
              ) : null}
              <Text style={styles.textname} onPress={displaySelectedname}>
                {Usernamelist.length == 1
                  ? Usernamelist[0]
                  : Usernamelist[indexvalue]}
              </Text>
              {/* ascending */}
              {indexvalue >= 0 && indexvalue < Usernamelist.length - 1 ? (
                <TouchableOpacity onPress={changeusernameASC}>
                  <Text style={styles.textname}> &#62;</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          <View style={{width: '25%'}}>
            <TouchableOpacity onPress={Save}>
              <Text style={styles.backbtn}>&#60; Back to all Timesheets</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 
        <View style={{padding: 10}}>
          <View style={styles.headerrow}>
            <View style={styles.SectionStyle}>
              <View style={styles.headerrow}>
                <Text style={styles.label}>Week Ending:</Text>
                <TextInput
                  editable={false}
                  style={styles.headerinputStyle}
                  placeholder=""
                  defaultValue={route.params.paramKey}
                  maxLength={17}
                />
              </View>
            </View>
            <View style={styles.SectionStyle2}>
              {Usernamelist.length === 0 ? null : (
                <View style={styles.headerrow}>
                  <Text style={styles.label}> Total Time:</Text>

                  <Text style={styles.labelone} maxLength={17}>
                    {' '}
                    {total_RegularTime} reg / {total_Overtime} ot / {total_DBL}{' '}
                    dbl{' '}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.wholecontainer}>
              {Usernamelist.length === 0 ? (
                <View style={styles.circlecontainer}>
                  <TouchableOpacity
                    disabled
                    style={{opacity: 0}}
                    activeOpacity={0.1}
                    underlayColor="#ccc"
                    onPress={() => null}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Copy} />
                      </View>
                      <Text style={styles.circletext}>Copy Timesheet</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled
                    style={{opacity: 0}}
                    underlayColor="#ccc"
                    onPress={RemoveEmployee}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Remove} />
                      </View>
                      <Text style={styles.circletext}>Remove Employee</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    underlayColor="#ccc"
                    onPress={alertEmployee}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Add} />
                      </View>
                      <Text style={styles.circletext}>New Employee</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.circlecontainer}>
                  <TouchableOpacity
                    underlayColor="#ccc"
                    onPress={() => {
                      Alert.alert('Working on Progress');
                    }}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Copy} />
                      </View>
                      <Text style={styles.circletext}>Copy Timesheet</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    underlayColor="#ccc"
                    onPress={alertEmployee2}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Add} />
                      </View>
                      <Text style={styles.circletext}>New Employee</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    underlayColor="#ccc"
                    onPress={RemoveEmployee}>
                    <View style={styles.buttonscontainer}>
                      <View style={styles.circle}>
                        <Image style={styles.logo} source={Remove} />
                      </View>
                      <Text style={styles.circletext}>Remove Employee</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View> */}

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
                {route.params.paramKey}
              </Text>
            </View>

            <>
              <Text style={[styles.button, {paddingVertical: 10}]}>
                {' '}
                {'   '}Total Time:{' '}
              </Text>

              <Text style={[styles.button, {paddingVertical: 10}]}>
                {/* {total_RegularTime && total_Overtime && total_DBL <= 0 ? 0 : total_RegularTime} */}
                {total_RegularTime <= 0 ? 0 : total_RegularTime} reg /{' '}
                {total_Overtime <= 0 ? 0 : total_Overtime} ot /{' '}
                {total_DBL <= 0 ? 0 : total_DBL} dbl
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
            <View style={[styles.buttonRow, {justifyContent: 'flex-end'}]}>
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
              <TouchableOpacity
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
              </TouchableOpacity>
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
                widthArr={widthArr}
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
                                                        {phases}
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
                                                ),
                                                ...clickable(
                                                  qq.slice(1),
                                                  phase_id,
                                                ),
                                              ],
                                            ]}
                                            widthArr={widthArr}
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

export default TimeSheetScreen;
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
  maincontainer: {
    flex: 1,
    zIndex: 1,
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
    backgroundColor: '#4478de',
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
    color: '#c1c0c1',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 8,
    borderColor: '#E8E8E8',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btncompany: {
    flexDirection: 'row',
    padding: '0.1%',
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
