import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Datepickpopup from '../Components/Datepickpopup';
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
import db from '../constants/db';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  set,
} from 'react-native-reanimated';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
import colors from '../constants/color';
import SelectedCompany from './SelectedTimeSheetComponent/SelectedCompany';
import SelectedEmployee from './SelectedTimeSheetComponent/SelectedEmployee';
import SelectedJob from './SelectedTimeSheetComponent/SelectedJob';
import SelectedPhase from './SelectedTimeSheetComponent/SelectedPhase';
import WarningPopup from '../Components/WarningPopup';
import {useFocusEffect} from '@react-navigation/native';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import SynchData from '../Sync/SynchData';
const Copy_Pop = ({
  navigation,
  setCopyModalVisible,
  data,
  setCompanyNew,
  setJobNew,
  setPhaseNew,
  setEmployeeNew,
  setData,
  GetData,
  Copied_Frm_Apprv,
  setCopied_Frm_Apprv,
}) => {
  const [InitialSelectDate, setInitialSelectDate] = useState('');
  const [DefaultDate, setDefaultDate] = useState('');
  const [SlideDates, setSlideDates] = useState([]);
  const [EmployeeCheckBox, setEmployeeCheckBox] = useState(true);
  const [CompanyCheckBox, setCompanyCheckBox] = useState(true);
  const [JobCheckBox, setJobCheckBox] = useState(true);
  const [PhaseCheckBox, setPhaseCheckBox] = useState(true);
  const [EntiresCheckBox, setEntiresCheckBox] = useState(true);
  const [CommentCheckBox, setCommentCheckBox] = useState(true);
  const [SelectedEmployeePop, setSelectedEmployeePop] = useState(false);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [Employee, setEmployee] = useState([]);
  const [EmployeeCount, setEmployeeCount] = useState(0);
  const [SelectedCompanyPop, setSelectedCompanyPop] = useState(false);
  const [Company, setCompany] = useState([]);
  const [WholeData, setWholeData] = useState([]);
  const [WholeCompany, setWholeCompany] = useState([]);
  const [CompanyCount, setCompanyCount] = useState(0);
  const [SelectedDate, setSelectedDate] = useState('');
  const [SelectedJobPop, setSelectedJobPop] = useState(false);
  const [Job, setJob] = useState([]);
  const [WholeJob, setWholeJob] = useState([]);
  const [JobCount, setJobCount] = useState(0);
  const [TableData, setTableData] = useState([]);
  const [SelectedPhasePop, setSelectedPhasePop] = useState(false);
  const [Phase, setPhase] = useState([]);
  const [WholePhase, setWholePhase] = useState([]);
  const [PhaseCount, setPhaseCount] = useState(0);
  const [created_data, setCreated_Data] = useState([]);
  const [Check, setCheck] = useState(false);
  const [EmpCheck, setEmpCheck] = useState(false);
  const [CmpCheck, setCmpCheck] = useState(false);
  const [JobCheck, setJobCheck] = useState(false);
  const [PhaseCheck, setPhaseCheck] = useState(false);
  const [selected_Employee_Id, Setselected_Employee_Id] = useState([]);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [SelectedEmpId, setSelectedEmpId] = useState([]);
  const [SelectedCmpId, setSelectedCmpId] = useState([]);
  const [SelectedJobId, setSelectedJobId] = useState([]);
  const [dispemp, setdispemp] = useState([]);
  const [dispcompany, setdispcompany] = useState([]);
  const [dispjob, setdispjob] = useState([]);
  const [dispphase, setdispphase] = useState([]);
  const [selectedcompanyname, setselectedcompanyname] = useState(null);
  const [companyIndex, setcompanyIndex] = useState(null);
  const [Jobloading, setJobLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CompanyID, SetCompanyID] = useState([]);
  const [DefaultCompanyID, setDefaultCompanyID] = useState([]);
  const [process_loader, setprocess_loader] = useState(false);
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

  const dispatch = useDispatch();
  const getUser = useSelector(store => store);

  const networkStatus = checkNetworkStatus();
  // Get WeekEndDates from Timesheet table
  const offset = useSharedValue(-500);
  useEffect(() => {
    offset.value = withSpring(1);

    dispatch(delete1());

    dispatch(delete2());

    dispatch(Remove_Date());
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: offset.value}],
    };
  });

  // Get Employee list
  const GetEmployee = async () => {
    db.transaction(tx => {
      tx.executeSql(
        // `select u.EmployeeID,u.Username, em.FullName from TimesheetEmployee te inner join User u on u.EmployeeID=te.
        // EmployeeID inner join Employee em on u.EmployeeId = em.EmployeeId where TimesheetID=?`,
        `select te.EmployeeID, em.FullName from TimesheetEmployee te
        inner join Employee em on te.EmployeeId = em.EmployeeId
        where TimesheetID=?`,
        [data.TimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map(item => {
            var TimesheetID = generateGuidQuickly();
            return {
              key: item.FullName,
              value: item.EmployeeID,
              status: true,
              check: true,
              TimesheetEmployeeID: TimesheetID,
            };
          });

          setEmployee(newArray);
          setEmployeeCount(newArray.length);
          GetWholeData(newArray);
        },
      );
    });
  };

  // Get Company list
  const GetCompany = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT (SELECT DISTINCT group_concat(TE.EmployeeID, ',') FROM TimesheetEmployee TE INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
       WHERE LC.CompanyID = TC.CompanyID AND TE.TimesheetID = T.TimesheetID) AS EmployeeID,TC.CompanyID,LC.CompanyName
        FROM Timesheet T
       INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
       INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
       INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
       WHERE T.TimesheetID =?
       ORDER BY LC.CompanyName
         `,
        [data.TimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map(item => {
            return {
              key: '' + item.CompanyID + '$$$' + item.CompanyName + '',
              value: '' + item.CompanyID + '*#^*' + item.CompanyName,
              status: true,
              check: true,

              // Display for selected Employee
              displayStatus: true,
              ID: item.CompanyID,
              EmployeeID: item.EmployeeID,
            };
          });

          // Employee Not Selected displaying All Selected Company
          if (SelectedEmpId.length == 0) {
            setWholeCompany(newArray);
            setCompany(newArray);
            setCompanyCount(newArray.length);
          }
          // Employee Selected display that particular employee selected company
          else if (SelectedEmpId.length != 0) {
            let newData = newArray.map(e => {
              const newname = ee => {
                let duplicate = ee['EmployeeID'].split(',').filter(f => {
                  if (SelectedEmpId.includes(f)) {
                    return true;
                  } else {
                    return false;
                  }
                });
                return duplicate;
              };
              if (newname(e).length !== 0) {
                return {
                  ...e,
                  ['check']: true,
                };
              }
              return {
                ...e,
                ['check']: false,
              };
            });

            // Set displaystatus for check and uncheck in SelectedCompany

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            // Set Company Count after selected Employee
            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;

            let Setselected = newdatafordisp
              .map(d => {
                if (d.check == true) {
                  return d.ID;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              });

            let setforJobId = newdatafordisp
              .map(d => {
                if (d.check == true) {
                  return d.ID;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              });

            setSelectedCmpId(setforJobId);

            setDefaultCompanyID(Setselected);
            setWholeCompany(newdatafordisp);
            setCompany(newdatafordisp);
            setCompanyCount(Checkin);
            setdispcompany(newdatafordisp);
          } else if (SelectedEmpId.length != 0 && SelectedCmpId.length != 0) {
            let newData = newArray.map(e => {
              const newname = ee => {
                let duplicate = ee['EmployeeID'].split(',').filter(f => {
                  if (
                    SelectedEmpId.includes(f) &&
                    SelectedCmpId.includes(e['CompanyID'])
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                });
                return duplicate;
              };
              if (newname(e).length !== 0) {
                return {
                  ...e,
                  ['check']: true,
                };
              }
              return {
                ...e,
                ['check']: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;

            setWholeCompany(newdatafordisp);
            setCompany(newdatafordisp);
            setCompanyCount(Checkin);
          }
        },
      );
    });
  };

  const GetJobs = () => {
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
        AS EmployeeID,
        (SELECT DISTINCT group_concat(TimesheetJob.EstProjectCompletionDate, ',')
        FROM TimesheetJob
        WHERE TimesheetJobID in (
        SELECT TimesheetJobID  FROM Timesheet
		INNER join TimesheetEmployee on T.TimesheetID=TimesheetEmployee.TimesheetID
		inner join TimesheetCompany on TE.TimesheetEmployeeID = TimesheetEmployee.TimesheetEmployeeID
		inner join TimesheetJob on TC.TimesheetCompanyID = TimesheetCompany.TimesheetCompanyID
		 WHERE  JobID = TJ.JobID
       ))
        AS EstProjectCompletionDate,
        TC.CompanyID,LJ.JobID,LJ.JobName, LJ.JobNo, (CASE WHEN IFNULL(LJ.IsRestricted, '') = '' THEN 0 ELSE LJ.IsRestricted END) AS IsRestricted
        FROM Timesheet T
        INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
        INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
        INNER JOIN TimesheetJob TJ ON TC.TimesheetCompanyID = TJ.TimesheetCompanyID
        INNER JOIN LkpJob LJ ON TJ.JobID = LJ.JobID
        WHERE T.TimesheetID = ?
        ORDER BY LJ.JobName
         `,
        [data.TimesheetID],
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
              status: true,
              check: true,
              EstProjectCompletionDate: item.EstProjectCompletionDate,
              // Display for selected Employee
              displayStatus: true,
              ID: item.JobID,
              CompanyID: item.CompanyID,
              EmployeeID: item.EmployeeID,
            };
          });

          // Employee Not Selected displaying All Selected Company
          if (SelectedEmpId.length == 0 && SelectedCmpId.length == 0) {
            let setforJobId = newArray
              .map(d => {
                if (d.check == true) {
                  return d.ID;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              });

            setSelectedJobId(setforJobId);
            setWholeCompany(newArray);
            setJob(newArray);
            setdispjob(newArray);
            setJobCount(newArray.length);
          }
          // Employee Selected display that particular employee selected company
          else if (SelectedEmpId.length != 0 && SelectedCmpId.length == 0) {
            let newData = newArray.map(e => {
              const newname = ee => {
                let duplicate = ee['EmployeeID'].split(',').filter(f => {
                  if (SelectedEmpId.includes(f)) {
                    return true;
                  } else {
                    return false;
                  }
                });
                return duplicate;
              };
              if (newname(e).length !== 0) {
                return {
                  ...e,
                  ['check']: true,
                };
              }
              return {
                ...e,
                ['check']: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;

            let setforJobId = newdatafordisp
              .map(d => {
                if (d.check == true) {
                  return d.ID;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              });

            setSelectedJobId(setforJobId);
            setdispjob(newdatafordisp);
            setWholeCompany(newdatafordisp);
            setJob(newdatafordisp);
            setJobCount(Checkin);
          } else if (SelectedEmpId.length != 0 && SelectedCmpId.length != 0) {
            // let newData = newArray.map(e => {
            //   if (SelectedCmpId.includes(e['CompanyID'])) {
            //     return {
            //       ...e,
            //       ['check']: true,
            //     };
            //   }
            //   return {
            //     ...e,
            //     ['check']: false,
            //   };
            // });
            let newData = newArray.map(e => {
              const newname = ee => {
                let duplicate = ee['EmployeeID'].split(',').filter(f => {
                  if (
                    SelectedEmpId.includes(f) &&
                    SelectedCmpId.includes(e['CompanyID'])
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                });
                return duplicate;
              };
              if (newname(e).length !== 0) {
                return {
                  ...e,
                  ['check']: true,
                };
              }
              return {
                ...e,
                ['check']: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;

            let setforJobId = newdatafordisp
              .map(d => {
                if (d.check == true) {
                  return d.ID;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              });

            setSelectedJobId(setforJobId);
            setdispjob(newdatafordisp);
            setWholeCompany(newdatafordisp);
            setJob(newdatafordisp);
            setJobCount(Checkin);
          }
        },
      );
    });
  };

  const GetPhase = async () => {
    setLoading(true);
    db.transaction(tx => {
      tx.executeSql(
        // `SELECT DISTINCT
        //    (SELECT GROUP_CONCAT(EmployeeID ,',')
        //    FROM
        //    (SELECT DISTINCT TimesheetEmployee.EmployeeID
        //    FROM TimesheetEmployee INNER JOIN TimesheetCompany  ON  TimesheetEmployee .TimesheetEmployeeID = TimesheetCompany .TimesheetEmployeeID
        //    INNER JOIN TimesheetJob  ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
        //    INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
        //    WHERE TimesheetEmployee.TimesheetID = T.TimesheetID
        //    AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
        //    )AS EmployeeID,
        //    (SELECT  group_concat(CompanyID, ',')
        //    FROM
        //    (SELECT DISTINCT TimesheetCompany .CompanyID
        //    FROM TimesheetCompany INNER JOIN TimesheetEmployee ON  TimesheetCompany.TimesheetEmployeeID  = TimesheetEmployee .TimesheetEmployeeID
        //    INNER JOIN TimesheetJob  ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
        //    INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
        //    WHERE TimesheetEmployee.TimesheetID = T.TimesheetID
        //    AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
        //    )AS CompanyID,
        //    (SELECT  group_concat(JobID, ',')
        //    FROM
        //    (SELECT  DISTINCT TimesheetJob .JobID
        //    FROM TimesheetJob  INNER JOIN TimesheetCompany ON  TimesheetJob.TimesheetCompanyID = TimesheetCompany .TimesheetCompanyID
        //    INNER JOIN TimesheetEmployee ON  TimesheetCompany.TimesheetEmployeeID  = TimesheetEmployee .TimesheetEmployeeID
        //    INNER JOIN TimesheetPhaseCode ON TimesheetJob  .TimesheetJobID = TimesheetPhaseCode .TimesheetJobID
        //    WHERE  TimesheetEmployee.TimesheetID = T.TimesheetID
        //    AND TimesheetPhaseCode .PhaseCodeID = TP.PhaseCodeID)
        //    )AS JobID,
        //    LP.PhaseCodeID,LP.PhaseCodeName, LP.PhaseCode, (CASE WHEN IFNULL(LP.IsRestricted, '') = '' THEN 0 ELSE LP.IsRestricted END) AS IsRestricted
        //    FROM Timesheet T
        //    INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
        //    INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
        //    INNER JOIN TimesheetJob TJ ON TC.TimesheetCompanyID = TJ.TimesheetCompanyID
        //    INNER JOIN TimesheetPhaseCode TP ON TJ.TimesheetJobID = TP.TimesheetJobID
        //    INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
        //    INNER JOIN LkpJob LJ ON TJ.JobID = LJ.JobID
        //    INNER JOIN LkpPhaseCode LP ON TP.PhaseCodeID = LP.PhaseCodeID
        //    WHERE T.TimesheetID =?
        //    ORDER BY LP.PhaseCodeName`,
        `SELECT te.EmployeeId, tc.CompanyId, tj.JobID, tp.PhaseCodeID, Lp.PhaseCodeName, Lp.PhaseCode, Lp.IsRestricted from Timesheet t
        left join TimesheetEmployee te on t.TimesheetID=te.TimesheetID
         left join TimesheetCompany tc on te.TimesheetEmployeeID = tc.TimesheetEmployeeID
                  left join TimesheetJob tj on tc.TimesheetCompanyID=tj.TimesheetCompanyID
                  left join TimesheetPhaseCode tp on tj.TimesheetJobID=tp.TimesheetJobID
                         INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
                   INNER JOIN LkpJob LJ ON TJ.JobID = LJ.JobID
                   INNER JOIN LkpPhaseCode LP ON TP.PhaseCodeID = LP.PhaseCodeID
        WHERE t.TimesheetID = ?`,
        [data.TimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }

          let newArray = temp.map(item => {
            return {
              key: '' + item.PhaseCode + '$$$' + item.PhaseCodeName + '',
              value: item.PhaseCodeID + '*#^*' + item.PhaseCodeName,
              status: true,
              check: true,
              // Display for selected Employee
              displayStatus: true,
              ID: item.PhaseCodeID,
              JobID: item.JobID,
              PhaseName:
                item.JobID +
                '+' +
                `+` +
                `${Math.floor(Math.random() * 100 + 1)}`,

              ...item,
            };
          });

          setTimeout(() => {
            setLoading(false);
          }, 1000);
          if (
            SelectedEmpId.length == 0 &&
            SelectedCmpId.length == 0 &&
            SelectedJobId.length == 0
          ) {
            setPhase(newArray);
            setWholePhase(newArray);
            setPhaseCount(newArray.length);
            setdispphase(newArray);
          } else if (SelectedEmpId.length != 0) {
            let convertSelectedEmpId = [];
            SelectedEmpId.map(d => {
              let changeFormat = convertSelectedEmpId.push(parseInt(d));
            });
            let newData = newArray.map(e => {
              // const newname = ee => {
              //   let duplicate = ee['EmployeeID'].split(',').filter(f => {
              //     if (SelectedEmpId.includes(f)) {
              //       return true;
              //     } else {
              //       return false;
              //     }
              //   });
              //   return duplicate;
              // };

              if (
                SelectedJobId.includes(parseInt(e['JobID'])) &&
                SelectedCmpId.includes(parseInt(e['CompanyID'])) &&
                convertSelectedEmpId.includes(parseInt(e['EmployeeID']))
              ) {
                return {
                  ...e,
                  check: true,
                };
              }

              return {
                ...e,
                check: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;
            setdispphase(newdatafordisp);
            setPhase(newdatafordisp);
            setWholePhase(newdatafordisp);
            setPhaseCount(Checkin);
          } else if (SelectedEmpId.length == 0 && SelectedCmpId.length != 0) {
            let newData = newArray.map(e => {
              if (
                SelectedJobId.includes(parseInt(e['JobID'])) &&
                SelectedCmpId.includes(parseInt(e['CompanyID']))
              ) {
                return {
                  ...e,
                  check: true,
                };
              }

              return {
                ...e,
                check: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;
            setdispphase(newdatafordisp);
            setPhase(newdatafordisp);
            setWholePhase(newdatafordisp);
            setPhaseCount(Checkin);
          } else if (SelectedJobId.length != 0) {
            let newData = newArray.map(e => {
              if (SelectedJobId.includes(parseInt(e['JobID']))) {
                return {
                  ...e,
                  check: true,
                };
              }

              return {
                ...e,
                check: false,
              };
            });

            let newdatafordisp = newData.map(d => {
              if (d.check == false && d.status == true) {
                return {...d, ['displayStatus']: false};
              } else {
                return {...d, ['displayStatus']: true};
              }
            });

            let Checkin = newdatafordisp
              .map(d => {
                if (d.displayStatus === true) {
                  return d;
                }
              })
              .filter(function (x) {
                return x !== undefined;
              }).length;
            setdispphase(newdatafordisp);
            setPhase(newdatafordisp);
            setWholePhase(newdatafordisp);
            setPhaseCount(Checkin);
          }
        },
      );
    });
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
    selectedCompany.forEach((e, i) => {
      var companyguid = generateGuidQuickly();
      setTableData(prev => [...prev, [[`${e}+${companyguid}`]]]);
    });
    CompanyID.push(selectedCompanyID[0]);
  };

  // Get WeekEndDates from Timesheet table
  const getWeekEndDates = async () => {
    let Userid = await AsyncStorage.getItem('SubmitUserID');
    if (Userid != null) {
      db.transaction(txn => {
        txn.executeSql(
          `select * from Timesheet where CreatedBy=?`,
          [Userid],
          async function (tx, res) {
            var temp = [];
            for (let i = 0; i < res.rows.length; i++) {
              temp.push(res.rows.item(i));
            }

            let Weekenddates = temp.map(e => e.WeekEndDate);
            setCreated_Data(Weekenddates);
          },
        );
      });
    }
  };

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 7);
    // Get an array of the past 2 weeks' Sundays
    const pastSundays = [];
    for (let i = 1; i < 1; i++) {
      const sunday = new Date(startOfWeek);
      sunday.setDate(sunday.getDate() - i * 7);
      pastSundays.push(sunday);
    }
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    const formattedPastSundays = pastSundays.map(pastSundays => {
      const date = new Date(pastSundays);
      return date.toLocaleDateString('en-US', options);
    });
    // Get an array of the present week's Sunday
    const presentSunday = new Date(startOfWeek);
    // Get an array of the next 3 weeks' Sundays
    const futureSundays = [];
    for (let i = 1; i <= 3; i++) {
      const sunday = new Date(startOfWeek);
      sunday.setDate(sunday.getDate() + i * 7);
      futureSundays.push(sunday);
    }
    const formattedfutureSundays = futureSundays.map(futureSundays => {
      const date = new Date(futureSundays);
      return date.toLocaleDateString('en-US', options);
    });
    const allSundays = formattedPastSundays.concat(
      presentSunday.toLocaleDateString('en-US', options),
      formattedfutureSundays,
    );
    allSundays.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });
    // Log the results
    setSlideDates(allSundays);

    setSelectedDate(presentSunday.toLocaleDateString('en-US', options));
    //setDefaultDate(presentSunday.toLocaleDateString('en-US', options));
    setInitialSelectDate(allSundays.slice(0, 1).toString());

    offset.value = withSpring(15);

    getWeekEndDates();
  }, []);

  function Combined() {
    setDateModalVisible(true);
  }

  const EmployeeToggle = value => {
    setEmployeeCheckBox(value);
    if (value == false) {
      setCompanyCheckBox(value);
      setJobCheckBox(value);
      setPhaseCheckBox(value);
      setEntiresCheckBox(value);
      setCommentCheckBox(value);
    }
  };
  const CompanyToggle = value => {
    if (EmployeeCheckBox == true) {
      setCompanyCheckBox(value);
    }

    if (value == false) {
      setJobCheckBox(value);
      setPhaseCheckBox(value);
      setEntiresCheckBox(value);
      setCommentCheckBox(value);
    }
  };
  const JobToggle = value => {
    if (CompanyCheckBox == true) {
      setJobCheckBox(value);
    }
    if (value == false) {
      setPhaseCheckBox(value);
      setEntiresCheckBox(value);
      setCommentCheckBox(value);
    }
  };
  const PhaseToggle = value => {
    if (JobCheckBox == true) {
      setPhaseCheckBox(value);
    }
    if (value == false) {
      setEntiresCheckBox(value);
      setCommentCheckBox(value);
    }
  };
  const EntiresToggle = value => {
    if (JobCheckBox == true) {
      setEntiresCheckBox(value);
    }
    if (value == false) {
      setCommentCheckBox(value);
    }
  };
  const CommentToggle = value => {
    if (EntiresCheckBox == true) {
      setCommentCheckBox(value);
    }
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

  // Generate random user id
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
  // Generate random user id
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

  // // mount
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      GetCompany();
      GetJobs();
      GetPhase();
      return () => {
        isActive = false;
      };
    }, [SelectedEmpId]),
  );

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      GetJobs();
      GetPhase();
      return () => {
        isActive = false;
      };
    }, [SelectedCmpId]),
  );

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      GetPhase();
      return () => {
        isActive = false;
      };
    }, [SelectedJobId]),
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let isActive = true;
  //     GetPhase();
  //     return () => {
  //       isActive = false;
  //     };
  //   }, []),
  // );

  // Get Whole list
  // Get Whole list
  const GetWholeData = async newArray => {
    db.transaction(tx => {
      tx.executeSql(
        `select u.EmployeeID,u.Username,tc.CompanyID ,lc.CompanyName ,tj.JobID ,lj.JobName,tc.TimesheetCompanyID,tp.* ,lp.PhaseCodeName from Timesheet t
          left join TimesheetEmployee te on t.TimesheetID=te.TimesheetID
          left join TimesheetCompany tc on te.TimesheetEmployeeID = tc.TimesheetEmployeeID
          left join TimesheetJob tj on tc.TimesheetCompanyID=tj.TimesheetCompanyID
          left join TimesheetPhaseCode tp on tj.TimesheetJobID=tp.TimesheetJobID
          left join User u on u.EmployeeID=te.EmployeeID
          left join LkpCompany lc on lc.CompanyID=tc.CompanyID
          left join LkpJob lj on lj.JobID=tj.JobID
          left join LkpPhaseCode lp on lp.PhaseCodeID=tp.PhaseCodeID
        where t.TimesheetID=?`,
        [data.TimesheetID],
        async (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            var JobID = generateGuidQuicklyJob();
            var PhaseCodID = generateGuidQuicklyPhase();
            if (res.rows.item(i).CompanyName != null) {
              res.rows.item(i).CompanyName =
                res.rows.item(i).CompanyName + '' + '+' + JobID;
            }
            if (res.rows.item(i).JobName != null) {
              res.rows.item(i).JobName =
                res.rows.item(i).JobID +
                ' - ' +
                res.rows.item(i).JobName +
                '' +
                '+' +
                JobID;
            }
            if (res.rows.item(i).PhaseCodeName != null) {
              res.rows.item(i).PhaseCodeName =
                res.rows.item(i).PhaseCodeID +
                ' - ' +
                res.rows.item(i).PhaseCodeName +
                '' +
                '+' +
                PhaseCodID;
            }
            temp.push(res.rows.item(i));
          }

          setWholeData(temp);

          for (let j = 0; j < newArray.length; j++) {
            // company push
            let result = [];
            // pushing
            temp
              .filter(item => item.Username == newArray[j].key)
              .reduce((accumulator, currentValue) => {
                const check = CompanyName => {
                  accumulator.forEach(e => {
                    if (e[0][0] === CompanyName) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                };

                if (accumulator.length === 0) {
                  accumulator.push([[currentValue.CompanyName]]);
                  //  acc=[['99-Test Company #99'],['99-Test Company #99']]
                } else if (
                  !accumulator.flat(3).includes(currentValue.CompanyName)
                ) {
                  accumulator.push([[currentValue.CompanyName]]);
                }
                return accumulator;
              }, result);

            // job push
            let result2 = result.map(e => {
              let job_push = [];

              //   job_push=[[],[]]
              if (
                temp.filter(
                  job =>
                    e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&
                    job.Username == newArray[j].key,
                ).length != 0
              ) {
                let s = temp.filter(
                  job =>
                    e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&
                    job.Username == newArray[j].key,
                );
                s.forEach((ee, i) => {
                  if (!job_push.flat().includes(ee.JobName)) {
                    if (ee.JobName !== null) {
                      //  ee.JobName =Object.values(ee.JobName)+"+"+ TimesheetID
                      job_push.push([ee.JobName]);
                    } else {
                      // job_push=null
                    }
                  }
                });

                return job_push.length === 0
                  ? [[e[0][0]]]
                  : [[e[0][0]], job_push];
              }

              return [[e[0][0]]];
            });

            // phase push
            let result3 = result2.map(e => {
              if (e[1]) {
                let modified = e[1].map(ee => {
                  let phase_push = [];

                  if (ee[0]) {
                    if (
                      temp.filter(
                        job =>
                          ee[0] === job.JobName &&
                          job.Username == newArray[j].key,
                      ).length != 0
                    ) {
                      let phasefil = temp.filter(
                        job =>
                          ee[0] === job.JobName &&
                          job.Username == newArray[j].key,
                      );

                      phasefil.forEach(item => {
                        if (item.PhaseCodeName !== null) {
                          phase_push.push([
                            item.PhaseCodeName,
                            `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
                            `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
                            `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
                            `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
                            `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
                            `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
                            `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
                            `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
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

            setTableData(result3);
            let selectedusername = newArray[j].key;
            let obj = {};
            obj[selectedusername] = result3;
            dispatch(AddData(obj));
          }
        },
      );
    });
  };

  // useFocusEffect(() => {
  //   GetCompany();
  // });

  useEffect(() => {
    getWeekEndDates();
    GetEmployee();
  }, []);

  function handleChangeEmployee(selectedEmployee, UnSelectedEmployee) {
    if (selectedEmployee.length == 0) {
      setCompany(null);
      setCompanyCount(0);
      setJob(null);
      setJobCount(0);
      setPhase(null);
      setPhaseCount(0);
      setEmployeeCount(selectedEmployee.length);
    } else {
      db.transaction(tx => {
        let separateCompanyArray = [];
        let separateJobArray = [];
        let separatePhaseArray = [];
        for (let j = 0; j < UnSelectedEmployee.length; j++) {
          tx.executeSql(
            `SELECT DISTINCT (SELECT DISTINCT group_concat(TE.EmployeeID, ',') FROM TimesheetEmployee TE INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
            WHERE LC.CompanyID = TC.CompanyID AND TE.TimesheetID = T.TimesheetID) AS EmployeeID,TC.CompanyID,LC.CompanyName
            FROM Timesheet T
            INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
            INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
            INNER JOIN LkpCompany LC ON LC.CompanyID = TC.CompanyID
            WHERE T.TimesheetID =?
            ORDER BY LC.CompanyName`,
            [UnSelectedEmployee[j].toString(), data.TimesheetID],
            async (tx, res) => {
              var temp = [];

              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }

              var CompanyObj = temp.map(item => item.CompanyID);
              var delCompany =
                Company && Company.filter(item => CompanyObj.includes(item.ID));
              separateCompanyArray.push(delCompany[0]);

              separateCompanyArray = separateCompanyArray.filter(function (
                element,
              ) {
                return element !== undefined;
              });
              let filterCompany =
                Company &&
                Company.filter(e => {
                  return !separateCompanyArray.find(f => {
                    return f.ID === e.ID;
                  });
                });
              setCompany(filterCompany);
              setCompanyCount(filterCompany.length);

              var jobObj = temp.map(item => item.JobID);
              var delJob = Job && Job.filter(item => jobObj.includes(item.ID));
              separateJobArray.push(delJob[0]);
              separateJobArray = separateJobArray.filter(function (element) {
                return element !== undefined;
              });
              let filterJob =
                Job &&
                Job.filter(e => {
                  return !separateJobArray.find(f => {
                    return f.ID === e.ID;
                  });
                });
              setJob(filterJob);
              setJobCount(filterJob.length);

              var PhaseObj = temp.map(item => item.PhaseCodeID);
              var delPhase =
                Phase && Phase.filter(item => PhaseObj.includes(item.ID));
              separatePhaseArray.push(delPhase[0]);
              separatePhaseArray = separatePhaseArray.filter(function (
                element,
              ) {
                return element !== undefined;
              });
              let filterPhase =
                Phase &&
                Phase.filter(e => {
                  return !separatePhaseArray.find(f => {
                    return f.ID === e.ID;
                  });
                });
              setPhase(filterPhase);
              setPhaseCount(filterPhase.length);
            },
          );
        }
      });
      let filteremployee = WholeData.map((item, index) => {
        if (selectedEmployee.includes(item.EmployeeID) == true) {
          return {
            ...item,
            CompanyID: null,
            CompanyName: null,
            JobID: null,
            JobName: null,
            PhaseCodeID: null,
            PhaseCodeName: null,
            FriDoubleTimeHours: null,
            FriOvertimeHours: null,
            FriRegularHours: null,
            JobID: null,
            JobName: null,
            MonDoubleTimeHours: null,
            MonOvertimeHours: null,
            MonRegularHours: null,
            PhaseCodeID: null,
            PhaseCodeName: null,
            SatDoubleTimeHours: null,
            SatOvertimeHours: null,
            SatRegularHours: null,
            SunDoubleTimeHours: null,
            SunOvertimeHours: null,
            SunRegularHours: null,
            ThuDoubleTimeHours: null,
            ThuOvertimeHours: null,
            ThuRegularHours: null,
            TimesheetJobID: null,
            TimesheetPhaseCodeID: null,
            Total_Dbl: null,
            Total_Ot: null,
            Total_Reg: null,
            TueDoubleTimeHours: null,
            TueOvertimeHours: null,
            TueRegularHours: null,
            WedDoubleTimeHours: null,
            WedOvertimeHours: null,
            WedRegularHours: null,
            EmployeeID: null,
          };
        }
        return item;
      });
      let resdata = filteremployee.filter(item => item.CompanyID != null);

      for (let j = 0; j < resdata.length; j++) {
        dispatch(RemoveData(resdata[j].Username));
      }
      setEmployeeCount(selectedEmployee.length);
    }
  }

  const AddEmployeeName = (selectEmployee, selectEmployeeID) => {
    setEmployeeID(prev => [...prev, ...selectEmployeeID]);
    let modified = Employee.map(e => {
      if (e.check === true) {
        return {...e, status: true};
      }

      return {...e};
    });

    setEmployee(modified);
  };

  const handleChangeJob = (selectedJob, selectedJobID, UnSelectedJob) => {
    if (selectedJobID.length == 0) {
      setPhase(null);
      setPhaseCount(0);
      setJobCount(selectedJobID.length);
    } else {
      let separatePhaseArray = [];
      db.transaction(tx => {
        for (let j = 0; j < UnSelectedJob.length; j++) {
          tx.executeSql(
            `select tc.CompanyID,tj.JobID,tp.PhaseCodeID,te.EmployeeID from Timesheet t
        inner join TimesheetEmployee te on te.TimesheetID= t.TimesheetID
        inner join TimesheetCompany tc on tc.TimesheetEmployeeID= te.TimesheetEmployeeID
        inner join TimesheetJob tj on tj.TimesheetCompanyID= tc.TimesheetCompanyID
        inner join TimesheetPhaseCode tp on tp.TimesheetJobID= tj.TimesheetJobID
        where tj.JobID=? and t.TimesheetID=?`,
            [UnSelectedJob[j].toString(), data.TimesheetID],
            async (tx, res) => {
              var temp = [];

              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }
              var PhaseObj = temp.map(item => item.PhaseCodeID);
              var delPhase =
                Phase && Phase.filter(item => PhaseObj.includes(item.ID));
              separatePhaseArray.push(delPhase[0]);
              separatePhaseArray = separatePhaseArray.filter(function (
                element,
              ) {
                return element !== undefined;
              });
              let filterPhase =
                Phase &&
                Phase.filter(e => {
                  return !separatePhaseArray.find(f => {
                    return f.ID === e.ID;
                  });
                });
              setPhase(filterPhase);
              setPhaseCount(filterPhase.length);
            },
          );
        }
      });
      let filterJob = WholeData.map((item, index) => {
        if (selectedJobID.includes(item.JobID) == false) {
          return {
            ...item,
            JobID: null,
          };
        }
        return item;
      });

      const dataRemoved = filterJob.filter(el => {
        return el.JobID !== null;
      });

      for (let k = 0; k < Employee.length; k++) {
        let selectedusername = Employee[k].key;
        let result = [];
        // pushing
        filterJob
          .filter(item => item.Username == selectedusername)
          .reduce((accumulator, currentValue) => {
            const check = CompanyName => {
              accumulator.forEach(e => {
                if (e[0][0] && e[0][0] === CompanyName) {
                  return true;
                } else {
                  return false;
                }
              });
            };

            if (accumulator.length === 0) {
              accumulator.push([[currentValue.CompanyName]]);
            } else if (
              !accumulator.flat(3).includes(currentValue.CompanyName)
            ) {
              accumulator.push([[currentValue.CompanyName]]);
            }
            return accumulator;
          }, result);
        for (let j = 0; j < dataRemoved.length; j++) {
          // job push
          let result2 = result.map(e => {
            let job_push = [];

            //   job_push=[[],[]]
            if (
              dataRemoved.filter(
                job =>
                  e[0][0] &&
                  e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&
                  job.Username == selectedusername,
              ).length != 0
            ) {
              let s = dataRemoved.filter(
                job =>
                  e[0][0] &&
                  e[0][0].split('+')[0] === job.CompanyName.split('+')[0] &&
                  job.Username == selectedusername,
              );
              s.forEach((ee, i) => {
                if (!job_push.flat().includes(ee.JobName)) {
                  if (ee.JobName !== null) {
                    //  ee.JobName =Object.values(ee.JobName)+"+"+ TimesheetID
                    job_push.push([ee.JobName]);
                  } else {
                    // job_push=null
                  }
                }
              });

              return job_push.length === 0
                ? [[e[0][0] && e[0][0]]]
                : [[e[0][0] && e[0][0]], job_push];
            }

            return [[e[0][0] && e[0][0]]];
          });

          // phase push
          let result3 = result2.map(e => {
            if (e[1]) {
              let modified = e[1].map(ee => {
                let phase_push = [];

                if (ee[0]) {
                  if (
                    dataRemoved.filter(
                      job =>
                        ee[0] === job.JobName &&
                        job.Username == selectedusername,
                    ).length != 0
                  ) {
                    let phasefil = dataRemoved.filter(
                      job =>
                        ee[0] === job.JobName &&
                        job.Username == selectedusername,
                    );

                    phasefil.forEach(item => {
                      if (item.PhaseCodeName !== null) {
                        phase_push.push([
                          item.PhaseCodeName,
                          `${item.MonRegularHours}/${item.MonOvertimeHours}/${item.MonDoubleTimeHours}`,
                          `${item.TueRegularHours}/${item.TueOvertimeHours}/${item.TueDoubleTimeHours}`,
                          `${item.WedRegularHours}/${item.WedOvertimeHours}/${item.WedDoubleTimeHours}`,
                          `${item.ThuRegularHours}/${item.ThuOvertimeHours}/${item.ThuDoubleTimeHours}`,
                          `${item.FriRegularHours}/${item.FriOvertimeHours}/${item.FriDoubleTimeHours}`,
                          `${item.SatRegularHours}/${item.SatOvertimeHours}/${item.SatDoubleTimeHours}`,
                          `${item.SunRegularHours}/${item.SunOvertimeHours}/${item.SunDoubleTimeHours}`,
                          `${item.Total_Reg}/${item.Total_Ot}/${item.Total_Dbl}`,
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

              return [[e[0][0] && e[0][0]], modified];
            }

            return e;
          });

          //   setTableData(result3);
          //   let selectedusername = newArray[j].key;
          let obj = {};
          obj[selectedusername] = result3;
          dispatch(AddData(obj));
        }
      }

      setJobCount(selectedJob.length);
    }
  };
  const handleChangePhase = (selectedPhase, selectedPhaseID) => {
    setPhaseCount(selectedPhase.length);
  };
  const CreateCopy = () => {
    setCopyModalVisible(false);

    setCompanyNew(WholeData);
    setJobNew(Job);
    setPhaseNew(Phase);
    setEmployeeNew(Employee);
  };

  // date to update in database
  const GetDateTime = () => {
    let dateTime = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    return dateTime;
  };

  const Save = async () => {
    if (EmployeeCount == 0) {
      setCheck(true);
      setEmpCheck(true);
    } else if (CompanyCount == 0) {
      setCheck(true);
      setCmpCheck(true);
    } else if (JobCount == 0) {
      setCheck(true);
      setJobCheck(true);
    } else if (PhaseCount == 0) {
      setCheck(true);
      setPhaseCheck(true);
    } else {
      let Timesheet_Dates = created_data;
      let Select_Date = SelectedDate;
      function findCommon(Timesheet_Dates, Select_Date) {
        return Timesheet_Dates.some(item => Select_Date.includes(item));
      }

      let TimesheetCreate = findCommon(Timesheet_Dates, Select_Date);

      if (SelectedDate == '') {
        alert('Enter Date');
        return false;
      }
      if (TimesheetCreate === true) {
        setCheck(true);
      } else if (TimesheetCreate != true) {
        setCopyModalVisible(false);
        let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
        let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
        var TimesheetID = generateGuidQuickly();
        var DateTime = CurrentUTCTime();
        db.transaction(function (txn) {
          txn.executeSql(
            `INSERT INTO Timesheet (TimesheetID, WeekEndDate,StatusID,CopiedFromTimesheetID, CreatedBy, CreatedOn)
        VALUES (?, ?, ?, ?, ?, ?)`,
            [
              TimesheetID,
              SelectedDate,
              1,
              data.TimesheetID,
              SubmitUserID,
              DateTime,
            ],
            function (tx, res) {
              if (EmployeeCheckBox == false) {
                GetData();
              }
            },
          );
          txn.executeSql(
            'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
              ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
            [
              'I',
              'Timesheet',
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
          if (EmployeeCheckBox == true) {
            let FilterEmployee = Employee.filter(item => item.check == true);

            FilterEmployee.forEach(item => {
              txn.executeSql(
                'INSERT INTO TimesheetEmployee (TimesheetEmployeeID, TimesheetID, EmployeeID, CreatedBy, CreatedOn)' +
                  ' VALUES (?, ?, ?, ?, ?);',
                [
                  item.TimesheetEmployeeID,
                  TimesheetID,
                  item.value,
                  SubmitUserID,
                  DateTime,
                ],
                function (tx, res) {
                  txn.executeSql(
                    'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                      ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                    [
                      'I',
                      'TimesheetEmployee',
                      item.TimesheetEmployeeID,
                      '-',
                      '',
                      DateTime,
                      Deviceid,
                      0,
                      0,
                      '-',
                    ],
                  );
                  if (CompanyCheckBox == false) {
                    GetData();
                  } else {
                    let FilterCompany = Company.filter(
                      item => item.check == true,
                    );
                    let multiCompanyValueSelected = ['EmployeeID'];
                    let Companydata = [];
                    for (selected_com_value of multiCompanyValueSelected) {
                      for (com_doc of FilterCompany) {
                        if (com_doc.hasOwnProperty(selected_com_value)) {
                          let com_values =
                            com_doc[selected_com_value].split(',');
                          for (value of com_values) {
                            var CompanyTimesheetID = generateGuidQuickly();
                            let obj = {
                              ID: com_doc.ID,
                              TimesheetCompanyID: CompanyTimesheetID,
                              ...com_doc,
                            };
                            obj[selected_com_value] = value;
                            Companydata.push(obj);
                          }
                        }
                      }
                    }

                    Companydata.forEach(comp => {
                      if (item.value === parseInt(comp.EmployeeID)) {
                        txn.executeSql(
                          'INSERT INTO TimesheetCompany (TimesheetCompanyID,TimesheetEmployeeID, CompanyID, CreatedBy, CreatedOn)' +
                            ' VALUES (?, ?, ?, ?, ?);',
                          [
                            comp.TimesheetCompanyID,
                            item.TimesheetEmployeeID,
                            comp.ID,
                            SubmitUserID,
                            DateTime,
                          ],
                          function (tx, res) {
                            txn.executeSql(
                              'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                              [
                                'I',
                                'TimesheetCompany',
                                comp.TimesheetCompanyID,
                                '-',
                                '',
                                DateTime,
                                Deviceid,
                                0,
                                0,
                                '-',
                              ],
                            );
                            if (JobCheckBox == false) {
                              GetData();
                            } else {
                              let FilterJobData = Job.filter(
                                item => item.check == true,
                              );
                              const FilterJob = FilterJobData.map(obj => {
                                if (obj.EstProjectCompletionDate === null) {
                                  return {
                                    ...obj,
                                    EstProjectCompletionDate: 'null',
                                  }; // update the age to 30
                                } else {
                                  return obj; // return the original object if age is not null
                                }
                              });
                              // let multiJobValueSelected = ['EmployeeID'];
                              // let Jobdata = [];
                              // for (selected_job_value of multiJobValueSelected) {
                              //   for (job_doc of FilterJob) {
                              //     if (
                              //       job_doc.hasOwnProperty(selected_job_value)
                              //     ) {
                              //       let job_values =
                              //         job_doc[selected_job_value].split(',');
                              //       for (value of job_values) {
                              //         var JobTimesheetID =
                              //           generateGuidQuickly();
                              //         let obj = {
                              //           ID: job_doc.ID,
                              //           TimesheetJobID: JobTimesheetID,
                              //           ...job_doc,
                              //         };
                              //         obj[selected_job_value] = value;
                              //         Jobdata.push(obj);
                              //       }
                              //     }
                              //   }
                              // }

                              const duplicatedArray = FilterJob.reduce(
                                (acc, obj) => {
                                  const NewEmployeeID =
                                    obj.EmployeeID.split(',');
                                  const EstProjectCompletionDate =
                                    obj.EstProjectCompletionDate.split(',');

                                  const count = Math.max(
                                    NewEmployeeID.length,
                                    // EstProjectCompletionDate.length,
                                  );
                                  for (let i = 0; i < count; i++) {
                                    var JobTimesheetID = generateGuidQuickly();
                                    const newObj = {
                                      ID: obj.ID,
                                      TimesheetJobID: JobTimesheetID,
                                      ...obj,
                                    };
                                    if (NewEmployeeID[i])
                                      newObj.EmployeeID =
                                        NewEmployeeID[i].trim();
                                    if (EstProjectCompletionDate[i] == '') {
                                      EstProjectCompletionDate[i] = 'null';
                                    }
                                    if (EstProjectCompletionDate[i])
                                      newObj.EstProjectCompletionDate =
                                        EstProjectCompletionDate[i].trim();

                                    acc.push(newObj);
                                  }

                                  return acc;
                                },
                                [],
                              );

                              duplicatedArray.forEach(job => {
                                //   const matchingItem = FilterJob.find(item2 => item2.CompanyID === comp.ID);
                                if (
                                  comp.ID === job.CompanyID &&
                                  comp.EmployeeID === job.EmployeeID
                                ) {
                                  txn.executeSql(
                                    'INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID,EstProjectCompletionDate, CreatedBy, CreatedOn)' +
                                      'VALUES (?, ?, ?, ?, ?,?);',
                                    [
                                      job.TimesheetJobID,
                                      comp.TimesheetCompanyID,
                                      job.ID,
                                      job.EstProjectCompletionDate == 'null'
                                        ? null
                                        : job.EstProjectCompletionDate,
                                      SubmitUserID,
                                      DateTime,
                                    ],

                                    async function (tx, res) {
                                      txn.executeSql(
                                        'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                          ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                                        [
                                          'I',
                                          'TimesheetJob',
                                          job.TimesheetJobID,
                                          '-',
                                          '',
                                          DateTime,
                                          Deviceid,
                                          0,
                                          0,
                                          '-',
                                        ],
                                      );
                                      if (PhaseCheckBox == false) {
                                        GetData();
                                      } else {
                                        let FilterPhase = Phase.filter(
                                          item => item.check == true,
                                        );
                                        let multiPhaseValueSelected = [
                                          'EmployeeID',
                                        ];
                                        // let Phasedata = [];
                                        // for (var selected_phase_value of multiPhaseValueSelected) {
                                        //   for (phase_doc of FilterPhase) {
                                        //     if (
                                        //       phase_doc.hasOwnProperty(
                                        //         selected_phase_value,
                                        //       )
                                        //     ) {
                                        //       let phase_values =
                                        //         phase_doc[
                                        //           selected_phase_value
                                        //         ].split(',');
                                        //       for (value of phase_values) {
                                        //         var PhaseTimesheetID =
                                        //           generateGuidQuickly();
                                        //         let obj = {
                                        //           ID: phase_doc.ID,
                                        //           TimesheetPhaseCodeID:
                                        //             PhaseTimesheetID,
                                        //           ...phase_doc,
                                        //         };
                                        //         obj[selected_phase_value] =
                                        //           value;
                                        //         Phasedata.push(obj);
                                        //       }
                                        //     }
                                        //   }
                                        // }

                                        let Phasedata = FilterPhase.map(d => {
                                          var PhaseTimesheetID =
                                            generateGuidQuickly();
                                          return {
                                            ...d,
                                            ['TimesheetPhaseCodeID']:
                                              PhaseTimesheetID,
                                          };
                                        });

                                        let mappedArray = Phasedata.map(
                                          phase => {
                                            let duplicatedItem =
                                              duplicatedArray.find(
                                                duplicated =>
                                                  duplicated.ID ===
                                                    phase.JobID &&
                                                  duplicated.EmployeeID.toString() ===
                                                    phase.EmployeeID.toString(),
                                              );
                                            if (duplicatedItem) {
                                              return {
                                                ...phase,
                                                TimesheetJobID:
                                                  duplicatedItem.TimesheetJobID,
                                              };
                                            } else {
                                              return phase;
                                            }
                                          },
                                        );
                                        // console.log("PhasedataPhasedataPhasedata", Phasedata)
                                        // console.log("duplicatedArrayduplicatedArray", duplicatedArray)
                                        mappedArray.forEach(phase => {
                                          //   const matchingItem = FilterJob.find(item2 => item2.CompanyID === comp.ID);
                                          if (
                                            job.ID === parseInt(phase.JobID) &&
                                            job.TimesheetJobID ===
                                              phase.TimesheetJobID
                                          ) {
                                            txn.executeSql(
                                              `SELECT TP.* FROM Timesheet T INNER JOIN TimesheetEmployee TE ON T.TimesheetID = TE.TimesheetID
                                       INNER JOIN TimesheetCompany TC ON TE.TimesheetEmployeeID = TC.TimesheetEmployeeID
                                       INNER JOIN TimesheetJob TJ ON TC.TimesheetCompanyID = TJ.TimesheetCompanyID
                                       INNER JOIN TimesheetPhaseCode TP ON TJ.TimesheetJobID = TP.TimesheetJobID
                                       WHERE T.TimesheetID = ? AND TE.EmployeeID = ? AND TC.CompanyID = ?
                                       AND TJ.JobID = ? AND TP.PhaseCodeID =?`,
                                              [
                                                data.TimesheetID,
                                                phase.EmployeeID,
                                                phase.CompanyID,
                                                phase.JobID,
                                                phase.PhaseCodeID,
                                              ],
                                              async function (tx, res) {
                                                var temp = [];

                                                for (
                                                  let i = 0;
                                                  i < res.rows.length;
                                                  i++
                                                ) {
                                                  temp.push(res.rows.item(i));
                                                }

                                                txn.executeSql(
                                                  'INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours, Comment, CreatedBy, CreatedOn,Total_Reg,Total_Ot,Total_Dbl)' +
                                                    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?);',
                                                  [
                                                    phase.TimesheetPhaseCodeID,
                                                    job.TimesheetJobID,
                                                    phase.PhaseCodeID,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .MonRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .MonOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .MonDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .TueRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .TueOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .TueDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .WedRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .WedOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .WedDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .ThuRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .ThuOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .ThuDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .FriRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .FriOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .FriDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SatRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SatOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SatDoubleTimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SunRegularHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SunOvertimeHours
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .SunDoubleTimeHours
                                                      : 0,
                                                    CommentCheckBox == true
                                                      ? res.rows.item(0).Comment
                                                      : '',
                                                    SubmitUserID,
                                                    DateTime,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .Total_Reg
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .Total_Ot
                                                      : 0,
                                                    EntiresCheckBox == true
                                                      ? res.rows.item(0)
                                                          .Total_Dbl
                                                      : 0,
                                                  ],
                                                  function (tx, res) {
                                                    txn.executeSql(
                                                      'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                                        ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                                                      [
                                                        'I',
                                                        'TimesheetPhaseCode',
                                                        phase.TimesheetPhaseCodeID,
                                                        '-',
                                                        '',
                                                        DateTime,
                                                        Deviceid,
                                                        0,
                                                        0,
                                                        '-',
                                                      ],
                                                      function (tx, res) {
                                                        Copied_Frm_Apprv
                                                          ? GetData('Approve')
                                                          : GetData();
                                                        setCopied_Frm_Apprv(
                                                          false,
                                                        );
                                                      },
                                                    );
                                                  },
                                                );
                                              },
                                            );
                                          }
                                        });
                                      }
                                    },
                                  );
                                }
                              });
                            }
                          },
                        );
                      }
                    });
                  }
                },
              );
            });
          }
        });
      }
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
        <Animated.View style={[styles.box, animatedStyles]}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              shadowColor: '#cbe91e',
              width: 700,
              height: 650,
              borderRadius: 0,
              bottom: 10,
            }}>
            {loading == true ? (
              <View style={styles.Pageloading}>
                <ActivityIndicator size="large" />
                <Text>Processing</Text>
              </View>
            ) : (
              <>
                <View style={styles.touches}>
                  <Text
                    style={{
                      color: '#1b386a',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontSize: 30,
                      fontWeight: '700',
                      top: 10,
                    }}>
                    Copy Timesheet
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text
                    onPress={() => {
                      dispatch(delete1());

                      dispatch(delete2());

                      dispatch(Remove_Date());

                      setCopyModalVisible(false);
                    }}
                    style={{
                      color: colors.lightgray,
                      left: '95%',
                      bottom: 40,
                      fontWeight: '900',
                      fontSize: 20,
                    }}>
                    X
                  </Text>
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      bottom: 10,
                      left: 20,
                      color: colors.gray,
                    }}>
                    {' '}
                    You are copying from week ending :
                    <Text style={{fontSize: 20}}>{data.WeekEndDate}</Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: 20,
                      top: '3%',
                      left: 20,
                      color: colors.gray,
                    }}>
                    {' '}
                    Please select from the following options:
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      top: '10%',
                      color: 'grey',
                      left: 20,
                    }}>
                    {' '}
                    Copy to Week Ending:{' '}
                  </Text>

                  <Pressable
                    onPress={() => Combined()}
                    style={{
                      top: '2%',
                      backgroundColor: 'white',
                      padding: 10,
                      width: 200,
                      left: 280,
                      borderStartWidth: 3,
                      borderStartColor: 'grey',
                    }}>
                    <Text
                      style={{fontSize: 17, fontWeight: '500', color: 'grey'}}>
                      {SelectedDate ? SelectedDate : data.WeekEndDate}
                    </Text>
                  </Pressable>

                  <View style={styles.EmployeeContainer}>
                    <Pressable
                      style={{flexDirection: 'row', bottom: 20}}
                      onPress={() => EmployeeToggle(!EmployeeCheckBox)}>
                      <CheckBox
                        disabled={false}
                        value={EmployeeCheckBox}
                        onValueChange={newValue => EmployeeToggle(newValue)}
                      />

                      <Text
                        style={
                          EmployeeCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        Copy {EmployeeCount} Employee(s)
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.Employee}
                      onPress={() =>
                        setSelectedEmployeePop(!SelectedEmployeePop)
                      }>
                      <Text
                        style={
                          EmployeeCheckBox
                            ? {
                                fontSize: 20,
                                color: '#1b386a',
                                right: 120,
                                bottom: 18,
                              }
                            : {fontSize: 20, right: 120, bottom: 18}
                        }>
                        Select Employee(s) &#62;{' '}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.CompanyContainer}>
                    <Pressable
                      style={{flexDirection: 'row', bottom: 15}}
                      onPress={() => CompanyToggle(!CompanyCheckBox)}>
                      <CheckBox
                        disabled={EmployeeCheckBox == false}
                        value={CompanyCheckBox}
                        onValueChange={newValue => CompanyToggle(newValue)}
                      />

                      <Text
                        style={
                          EmployeeCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        Copy {CompanyCount} Company(ies)
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.Company}
                      onPress={() =>
                        setSelectedCompanyPop(!SelectedCompanyPop)
                      }>
                      <Text
                        style={
                          CompanyCheckBox
                            ? {
                                fontSize: 20,
                                color: '#1b386a',
                                right: 112,
                                bottom: 12,
                              }
                            : {fontSize: 20, right: 112, bottom: 12}
                        }>
                        Select Company(ies) &#62;
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.JobContainer}>
                    <Pressable
                      style={{flexDirection: 'row', bottom: 10}}
                      onPress={() => JobToggle(!JobCheckBox)}>
                      <CheckBox
                        disabled={CompanyCheckBox == false}
                        value={JobCheckBox}
                        onValueChange={newValue => JobToggle(newValue)}
                      />

                      <Text
                        style={
                          JobCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        Copy {JobCount} Job(s)
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.Job}
                      onPress={() => setSelectedJobPop(!SelectedJobPop)}>
                      <Text
                        style={
                          JobCheckBox
                            ? {
                                fontSize: 20,
                                color: '#1b386a',
                                right: 178,
                                bottom: 10,
                              }
                            : {fontSize: 20, right: 178, bottom: 10}
                        }>
                        Select Job(s) &#62;
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.JobContainer}>
                    <Pressable
                      style={{flexDirection: 'row'}}
                      onPress={() => PhaseToggle(!PhaseCheckBox)}>
                      <CheckBox
                        disabled={JobCheckBox == false}
                        value={PhaseCheckBox}
                        onValueChange={newValue => PhaseToggle(newValue)}
                      />

                      <Text
                        style={
                          PhaseCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        Copy {PhaseCount} Phase(s)
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.Phase}
                      onPress={() => setSelectedPhasePop(!SelectedPhasePop)}>
                      <Text
                        style={
                          PhaseCheckBox
                            ? {
                                fontSize: 20,
                                color: '#1b386a',
                                right: 106,
                                bottom: 2,
                              }
                            : {fontSize: 20, right: 106, bottom: 2}
                        }>
                        Select Phase Code(s) &#62;
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.JobContainer}>
                    <Pressable
                      style={{flexDirection: 'row', top: 5}}
                      onPress={() => EntiresToggle(!EntiresCheckBox)}>
                      <CheckBox
                        disabled={PhaseCheckBox == false}
                        value={EntiresCheckBox}
                        onValueChange={newValue => EntiresToggle(newValue)}
                      />

                      <Text
                        style={
                          PhaseCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        All Time Entries
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.JobContainer}>
                    <Pressable
                      style={{flexDirection: 'row', top: 10}}
                      onPress={() => CommentToggle(!CommentCheckBox)}>
                      <CheckBox
                        disabled={EntiresCheckBox == false}
                        value={CommentCheckBox}
                        onValueChange={newValue => CommentToggle(newValue)}
                      />

                      <Text
                        style={
                          EntiresCheckBox
                            ? {fontSize: 20, color: 'black', left: 10}
                            : {fontSize: 20, left: 10}
                        }>
                        Copy All Comments
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <TouchableOpacity onPress={Save} style={styles.touch}>
                  <Text
                    style={{color: '#fff', textAlign: 'center', fontSize: 25}}>
                    Create
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        {EmployeeCheckBox && SelectedEmployeePop === true ? (
          <SelectedEmployee
            setdispemp={setdispemp}
            dispemp={dispemp}
            data={data}
            Employee={Employee}
            setSelectedEmployeePop={setSelectedEmployeePop}
            setEmployee={setEmployee}
            setEmployeeCount={setEmployeeCount}
            Setselected_Employee_Id={Setselected_Employee_Id}
            selected_Employee_Id={selected_Employee_Id}
            AddEmployeeName={AddEmployeeName}
            setSelectedEmpId={setSelectedEmpId}
            setCompanyCount={setCompanyCount}
            SetCompanyID={SetCompanyID}
            setSelectedCmpId={setSelectedCmpId}
            setJob={setJob}
            setWholeCompany={setWholeCompany}
            setJobCount={setJobCount}
            SelectedEmpId={SelectedEmpId}
            Job={Job}
            SelectedCmpId={SelectedCmpId}
            setPhase={setPhase}
            setWholePhase={setWholePhase}
            setPhaseCount={setPhaseCount}
            Phase={Phase}
            Company={Company}
            setCompany={setCompany}
            DefaultCompanyID={DefaultCompanyID}
          />
        ) : null}
        {CompanyCheckBox && SelectedCompanyPop === true ? (
          <SelectedCompany
            CJP={CJP}
            setCJP={setCJP}
            handleAddRow={handleAddRow}
            setdispcompany={setdispcompany}
            dispcompany={dispcompany}
            data={data}
            Company={Company}
            setSelectedCompanyPop={setSelectedCompanyPop}
            setCompany={setCompany}
            setCompanyCount={setCompanyCount}
            SetCompanyID={SetCompanyID}
            setSelectedCmpId={setSelectedCmpId}
            setJob={setJob}
            setWholeCompany={setWholeCompany}
            setJobCount={setJobCount}
            SelectedEmpId={SelectedEmpId}
            Job={Job}
            SelectedCmpId={SelectedCmpId}
            setPhase={setPhase}
            setWholePhase={setWholePhase}
            setPhaseCount={setPhaseCount}
            Phase={Phase}
          />
        ) : null}

        {JobCheckBox && SelectedJobPop === true ? (
          <SelectedJob
            setdispjob={setdispjob}
            dispjob={dispjob}
            setSelectedJobId={setSelectedJobId}
            data={data}
            Job={Job}
            setSelectedJobPop={setSelectedJobPop}
            setJob={setJob}
            GetJobs={GetJobs}
            handleChangeJob={handleChangeJob}
            selectedcompanyname={selectedcompanyname}
            companyIndex={companyIndex}
            loading={Jobloading}
          />
        ) : null}

        {PhaseCheckBox && SelectedPhasePop === true ? (
          <SelectedPhase
            setdispphase={setdispphase}
            dispphase={dispphase}
            data={data}
            Phase={Phase}
            setSelectedPhasePop={setSelectedPhasePop}
            setPhase={setPhase}
            handleChangePhase={handleChangePhase}
          />
        ) : null}

        {Check ? (
          <WarningPopup
            Check={Check}
            setCheck={setCheck}
            // headtext={'Timesheet Exist'}
            headtext={
              EmpCheck || CmpCheck || JobCheck || PhaseCheck
                ? 'Copy Timesheet Warning'
                : 'Timesheet Exist'
            }
            buttontext={'Close'}
            text={
              EmpCheck
                ? 'Please select at least one Employee'
                : CmpCheck
                ? 'Please select at least one Company'
                : JobCheck
                ? 'Please select at least one Job'
                : PhaseCheck
                ? 'Please select at least one Phase'
                : `Timesheet already exist for ${SelectedDate}.`
            }
          />
        ) : null}

        {isDateModalVisible ? (
          <Datepickpopup
            InitialSelectDate={InitialSelectDate}
            DefaultDate={DefaultDate}
            selected_Date={SelectedDate}
            navigation={navigation}
            setSelectedDate={setSelectedDate}
            setDateModalVisible={setDateModalVisible}
            // setShowDate={setShowDate}
            SlideDates={SlideDates}
          />
        ) : null}
      </SafeAreaView>
    </>
  );
};

export default Copy_Pop;
const styles = StyleSheet.create({
  touch: {
    backgroundColor: '#1b386a',
    padding: 15,
    width: '94%',
    // marginTop: 30,
    // zIndex: 1,
    // position: 'absolute',
    // bottom: 120,
    left: 20,
    top: 30,
  },
  touches: {
    backgroundColor: 'white',

    padding: 9,
    width: '100%',
    // bottom: '100%',
    // zIndex: -1,
    // alignItems:'centre',
    // position: 'absolute',

    // bottom: 0,
    height: 68,
  },

  EmployeeContainer: {
    // marginLeft: '-45%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    left: 20,
  },
  CompanyContainer: {
    // marginLeft: '-45%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 20,
  },
  JobContainer: {
    // marginLeft: '-45%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 20,
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
