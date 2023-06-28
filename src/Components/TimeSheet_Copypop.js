import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
//import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  LogBox,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Datepickpopup from './Datepickpopup';
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
import db from '../constants/db';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
} from 'react-native-reanimated';
import colors from '../constants/color';
import SelectedCompany from './SelectedTimeSheetComponent/SelectedCompany';
import CopyEmployee from './SelectedTimeSheetComponent/CopyEmployee';
import SelectedEmployee from './SelectedTimeSheetComponent/SelectedEmployee';
import SelectedJob from './SelectedTimeSheetComponent/SelectedJob';
import SelectedPhase from './SelectedTimeSheetComponent/SelectedPhase';
import AlertPopup from './AlertPopup';
import AddEmployee from '../Screen/AddEmployee';
import CopyCompany from '../Components/SelectedTimeSheetComponent/CopyCompany';
import CopyJob from '../Components/SelectedTimeSheetComponent/CopyJob';
import CopyPhase from '../Components/SelectedTimeSheetComponent/CopyPhase';
import WarningPopup from '../Components/WarningPopup';
import {logProfileData} from 'react-native-calendars/src/Profiler';
import Processing from '../Components/Processing';

const TimeSheet_Copypop = ({
  setGetEmpId,
  GetEmpId,
  navigation,
  setCopyModalVisible,
  data,
  setCompanyNew,
  setJobNew,
  setPhaseNew,
  setEmployeeNew,
  username,
  routeparamsparamKey,
  displaySelectedname,
  Usernamelist,
  get_Employee,
  selectedEmployee,
  selectedusername,
  Setselected_Employee_Id,
  selected_Employee_Id,
  SelectedId,
  TableData,
  setUsernamelist,
  Company,
  SetCompany,
  FromUserDetails,
  CJP,
  setCJP,
  Jobs,
  Companydata,
  setJobs,
  Phases,
  setPhases,
  SelectedEmployeeId,
  Page,
  paramkeyWeekEndDate,
  EditTimesheetID,
  close,
  ApproveUsernameList,
}) => {
  const [InitialSelectDate, setInitialSelectDate] = useState('');
  const [DefaultDate, setDefaultDate] = useState('');
  const [modalCopyEmployee, setmodalCopyEmployee] = useState(false);
  const [SlideDates, setSlideDates] = useState([]);
  const [EmployeeCheckBox, setEmployeeCheckBox] = useState(false);
  const [CompanyCheckBox, setCompanyCheckBox] = useState(false);
  const [JobCheckBox, setJobCheckBox] = useState(false);
  const [PhaseCheckBox, setPhaseCheckBox] = useState(false);
  const [EntiresCheckBox, setEntiresCheckBox] = useState(false);
  const [CommentCheckBox, setCommentCheckBox] = useState(false);
  const [SelectedEmployeePop, setSelectedEmployeePop] = useState(false);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [Employee, setEmployee] = useState([]);
  const [EmployeeCount, setEmployeeCount] = useState(0);
  const [SelectedCompanyPop, setSelectedCompanyPop] = useState(false);
  const [WholeCompany, setWholeCompany] = useState([]);
  const [CompanyCount, setCompanyCount] = useState(0);
  const [SelectedDate, setSelectedDate] = useState('');
  const [SelectedJobPop, setSelectedJobPop] = useState(false);
  const [JobCount, setJobCount] = useState(0);
  const [PhaseCount, setPhaseCount] = useState(0);
  const [SelectedPhasePop, setSelectedPhasePop] = useState(false);
  const [created_data, setCreated_Data] = useState([]);
  const [Check, setCheck] = useState(false);
  const [EmpCheck, setEmpCheck] = useState(false);
  const [CmpCheck, setCmpCheck] = useState(false);
  const [JobCheck, setJobCheck] = useState(false);
  const [PhaseCheck, setPhaseCheck] = useState(false);
  const [valueforselectempid, setvalueforselectempid] = useState([]);
  const [dispemp, setdispemp] = useState([]);
  const [Employeeloading, setEmployeeloading] = useState(false);
  const [UserCompanyID, SetUserCompanyID] = useState('');
  const [Edit_whole_Employee, SetEdit_whole_Employee] = useState([]);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [ToSelectedEmployee, setSelectedEmployee] = useState([]);
  const [CopyCompanydata, setCopyCompanydata] = useState(false);
  const [CopyJobdata, setCopyJobdata] = useState(false);
  const [dispcompany, setdispcompany] = useState([]);
  const [dispjob, setdispjob] = useState([]);
  const [dispphase, setdispphase] = useState([]);
  const [CompanyID, SetCompanyID] = useState([]);
  let [JobID, SetJobID] = useState([]);
  const [process_loader, setprocess_loader] = useState(false);
  const [SelectedCmpId, setSelectedCmpId] = useState([]);
  const [SelectedJobId, setSelectedJobId] = useState([]);
  const [SelectedPhaseId, setSelectedPhaseId] = useState([]);
  const [Job, setJob] = useState([]);
  const myArrayCopy = [...TableData];
  const [tableData, settableData] = useState(myArrayCopy);
  const [tableData2, settableData2] = useState(myArrayCopy);
  const [CompanyJob, setCompanyJob] = useState({});
  const [JobPhase, setJobPhase] = useState({});
  const [JobPhaseData, setJobPhaseData] = useState({});
  const [CopyPhasedata, setCopyPhasedata] = useState(false);
  const [PhaseData, setPhaseData] = useState([]);
  const [JobDate, setJobDate] = useState({});
  const [GetEmployeeData, setGetEmployeeData] = useState([]);
  const [tbdata, settbdata] = useState(tableData);
  const [PhaseJobArr, setPhaseJobArr] = useState([]);
  //JobCount
  const dispatch = useDispatch();
  const getUser = useSelector(store => store);
  // Get WeekEndDates from Timesheet table
  const offset = useSharedValue(-500);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (GetEmployeeData.length === 0) {
      setEmployeeCheckBox(false);
      setCompanyCheckBox(false);
      setJobCheckBox(false);
      setPhaseCheckBox(false);
      setEntiresCheckBox(false);
      setCommentCheckBox(false);
      setvalueforselectempid(
        selected_Employee_Id[selected_Employee_Id.length - 1],
      );
    } else if (GetEmployeeData.length === 1) {
      setEmployeeCheckBox(true);
      setCompanyCheckBox(true);
      setJobCheckBox(true);
      setPhaseCheckBox(true);
      setEntiresCheckBox(true);
      setCommentCheckBox(true);
      setvalueforselectempid(
        selected_Employee_Id[selected_Employee_Id.length - 1],
      );
    }
  }, [selected_Employee_Id, GetEmployeeData]);

  // copy timesheet pop employees
  useEffect(() => {
    let ff = Employee.filter(e => {
      if (e.check) {
        return e;
      }
    });
    setSelectedEmployee(ff.map(e => e.key).sort());

    let objArr;
    if (getUser.count.data.length !== 1) {
      objArr = Object.values(getUser.count.data)[
        Usernamelist.indexOf(username)
      ];
    }

    if (tableData.length !== 0) {
      let Jobcount1 = 0;
      let Phasecount1 = 0;
      tableData.forEach(e => {
        //undefined condition  e[1] job count
        if (e[1] !== undefined) {
          e[1].forEach(e1 => {
            if (e1[1] !== undefined) {
              Phasecount1 += e1[1].length;
            }
          });
          Jobcount1 += e[1].length;
        }
      });
      setPhaseCount(Phasecount1);
      setJobCount(Jobcount1);
    }

    let Company_jobFiltered = {};
    let Company_job = {};
    let Job_phase = {};
    let pushPhase = [];
    let PhaseJob = [];

    if (TableData.length !== 0) {
      TableData.forEach(e => {
        //undefined condition  e[1] job count
        if (e[1] !== undefined) {
          e[1].forEach(e1 => {
            Company_jobFiltered[e1[0].split('+')[0].trim()] =
              e[0][0].split('+')[0];
            Company_job[e1[0].split('+')[0].trim()] = e1[0].split('*#^*')[3];

            if (e1[1] !== undefined) {
              e1[1].forEach(e1w => {
                if (e1w) {
                  Job_phase[e1w[0].split('+')[0]] = e1[0].split('+')[0].trim();

                  PhaseJob.push([
                    e[0][0].split('+')[0],
                    e1[0].split('+')[0].trim(),
                    e1w[0].split('+')[0],
                    e1w[0].split('+')[0] +
                      '*#*#' +
                      e1[0].split('+')[0].split('*#^*')[0],
                  ]);
                }
              });
            }
          });
        }
      });
      //

      TableData.forEach(e => {
        if (e[1]) {
          e[1].forEach(e1 => {
            if (e1[1]) {
              e1[1].forEach(e2 => {
                if (e2) {
                  return pushPhase.push(
                    `${e2[0].split('*#^*')[0]}+${Math.floor(
                      Math.random() * 100 + 1,
                    )}%%%%${e1[0].split('*#^*')[0]}`,
                  );
                }
              });
            }
          });
        }
      });

      const obj = pushPhase.reduce((acc, item) => {
        const [key, value] = item.split('%%%%');
        acc[key] = value.trim();
        return acc;
      }, {});
      setJobPhaseData(obj);
    }
    setJobPhase(Job_phase);
    setPhaseJobArr(PhaseJob);
    setJobDate(Company_job);
    setCompanyJob(Company_jobFiltered);
  }, [modalCopyEmployee]);

  useEffect(() => {
    setEmployee(
      Employee.filter(e => {
        if (!e.check) {
          return e;
        }
      }),
    );
  }, [SelectedEmployee]);

  ///modifing the copied data
  const handleAddRow = (
    SelectedPhase1,
    SelectedPhasename1,
    PhaseAdd,

    SelectedJobname1,

    selectetJobID,

    SelectedJobCode1,

    Jobadd,

    selectedCompany,

    selectedCompanyID,

    companyadd,
  ) => {
    // Add only company

    let Existcompany = tableData.map(ee => ee[0][0].split('+')[0]); //let Allcompany = Company.map(ee => ee.value);
    let CopiedCompany = TableData.map(ee => ee[0][0].split('+')[0]); //let Allcompany = Company.map(ee => ee.value);

    let Selectedcompany = Company.filter(e => e.check === true).map(
      ee => ee.value,
    );

    let UnSelectedcompany = Company.filter(e => e.check === false).map(
      ee => ee.value,
    ); // let Allcompany = Company.map(ee => ee.value);

    let SelectedJob = Jobs.filter(
      e => e.check === true && e.displayStatus === true,
    ).map(ee => ee.value);

    let SelectedPhase = Phases.filter(
      e => e.check === true && e.displayStatus === true,
    ).map(ee => ee.PhaseName);

    let UnSelectedPhase = Phases.filter(
      e => e.check === false && e.displayStatus === true,
    ).map(ee => ee.value.split('*#^*')[0] + '*#^*' + ee.value.split('*#^*')[2]);

    if (companyadd) {
      if (Selectedcompany.length !== 0) {
        Selectedcompany.forEach((e, i) => {
          if (Existcompany.indexOf(e) === -1) {
            var companyguid = generateGuidQuickly();
            settableData(prev => [
              ...prev,
              TableData[CopiedCompany.indexOf(e)],
            ]);
            settableData2(prev => [
              ...prev,
              TableData[CopiedCompany.indexOf(e)],
            ]);
          }
        }); // if(selectedCompanyID[0]!== undefined){ //       CompanyID.push(selectedCompanyID[0]); //     }
      }

      if (UnSelectedcompany.length !== 0) {
        UnSelectedcompany.forEach((e, i) => {
          tableData.splice(Existcompany.indexOf(e), 1);
        });
      }
    } // setmodalComapanyVisible(false);

    let modified = Company.map(e => {
      if (e.check === true) {
        return {...e, status: true};
      }

      return {...e};
    });

    SetCompany(modified); //Add Job only

    if (Jobadd) {
      JobID.push(selectetJobID[0]);
      let empty = [];
      let Phasess;

      const add = (id, CompanyName) => {
        empty = [];
        SelectedJob.forEach((job_e, i) => {
          if (CompanyJob[job_e] === CompanyName) {
            var jobguid = generateGuidQuickly();

            ///Job list
            let JobList = TableData[Existcompany.indexOf(CompanyName)][1]
              .map(e => e)
              .map(e => e[0].split('+')[0].trim());
            let ci = Existcompany.indexOf(CompanyName);
            let ji = JobList.indexOf(job_e);

            Phasess =
              TableData[ci][1] &&
              TableData[ci][1][ji] &&
              TableData[ci][1][ji][1];
            if (Phasess === undefined) {
              empty.push([
                `${job_e} +${id}+${jobguid}` +
                  '*#^*' +
                  `${JobDate[job_e]}

          `,
              ]);
            } else {
              empty.push([
                `${job_e} +${id}+${jobguid}` +
                  '*#^*' +
                  `${JobDate[job_e]}

          `,
                Phasess,
              ]);
            }
          }
        });

        return empty; // }
      };

      let added_job = tableData.map((e, company_i) => {
        if (company_i === Existcompany.indexOf(e[0][0].split('+')[0])) {
          if (e.length > 1) {
            return [
              e[0],

              [...add(e[0][0].split('+')[1], e[0][0].split('+')[0])],
            ];
          }

          return [...e];
        }

        return e;
      });
      settableData(added_job);
      settableData2(added_job);
    }

    if (PhaseAdd) {
      //  add phase row

      //   var objIndex = Phase.forEach((obj, i) => {});

      let reset_phase;

      const promise = new Promise((resolve, reject) => {
        reset_phase = tableData.map((e, company_i, job_i) => {
          if (e[1] !== undefined) {
            let ii = e[1].map((j_data, j_index) => {
              if (j_data.length !== 0) {
                return [j_data[0], []];
              }
            });

            return [e[0], ii];
          }

          return [e[0], []];
        });

        setTimeout(() => {
          resolve('Resolved');
        }, 1000);
      });

      promise.then(data => {
        if (SelectedPhase.length === 0) {
          settableData(reset_phase);
          settableData2(reset_phase);
        } else {
          let added_phase; // Phase[objIndex].status = true;
          for (let i = 0; i < SelectedPhase.length; i++) {
            added_phase = reset_phase.map((e, company_i, job_i) => {
              let JobList = e[1]
                .map(e => e)
                .map(e => e[0].split('+')[0].trim());

              let jobname = PhaseJobArr.map(e => {
                if (e[3] === SelectedPhase[i]) {
                  return e;
                }
              })
                .flat()
                .filter(function (x) {
                  return x !== undefined;
                })[1];
              if (company_i === Existcompany.indexOf(e[0][0].split('+')[0])) {
                let changephase = e[1].map((j_data, j_index) => {
                  if (j_index === JobList.indexOf(jobname.split('*#*#')[0])) {
                    if (j_data.length > 0) {
                      let hh = {};

                      let companyindex = Existcompany.indexOf(
                        e[0][0].split('+')[0],
                      );

                      tableData[companyindex][1].map(e => {
                        if (e[1]) {
                          e[1].forEach(e1 => {
                            hh[
                              e1[0].split('+')[0] +
                                '*#*#' +
                                e[0].split('+')[0].split('*#^*')[0]
                            ] = e1;
                          });
                        }
                      });

                      const add = (com_id, job_id) => {
                        let empty = [];

                        SelectedPhase.forEach((array, array_index) => {
                          if (array in hh) {
                            let jobname1 = PhaseJobArr.map(e => {
                              if (e[3] === array) {
                                return e;
                              }
                            })
                              .flat()
                              .filter(function (x) {
                                return x !== undefined;
                              })[1];
                            if (jobname === jobname1) {
                              empty.push([
                                `${
                                  array.split('*#*#')[0]
                                }+${com_id}+${job_id}+${generateGuidQuickly()}`,
                                hh[array][1],
                                hh[array][2],
                                hh[array][3],
                                hh[array][4],
                                hh[array][5],
                                hh[array][6],
                                hh[array][7],
                                hh[array][8],
                                hh[array][9],
                              ]);
                            }
                          }
                        });
                        return empty;
                      };
                      return [
                        j_data[0],
                        add(e[0][0].split('+')[1], j_data[0].split('+')[2]),
                      ];
                    }
                  }

                  return j_data;
                });

                return [[...e[0]], changephase];
              }

              return e;
            });
            reset_phase = added_phase;
          }
          settableData(added_phase);
          settableData2(added_phase);
        }
      });
    }
  };

  const HandleFilter = checkbox => {
    if (checkbox === 'Company' && !CompanyCheckBox) {
      let dd = tableData2.map(d => {
        return [d[0]];
      });

      settableData(dd);
    } else if (checkbox === 'Company' && CompanyCheckBox) {
      settableData([]);
    } else if (checkbox === 'Job' && !JobCheckBox) {
      let md = tableData2.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              arr.push([d1[0]]);
            }
          });
        }
        return [d[0], arr];
      });
      settableData(md);
    } else if (checkbox === 'Job' && JobCheckBox) {
      let md = tableData.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              arr.push([d1[0]]);
            }
          });
        }

        return [d[0], []];
      });
      settableData(md);
    } else if (checkbox === 'Phase' && !PhaseCheckBox) {
      let md = tableData2.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '',
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }

        return [d[0], arr];
      });

      settableData(md);
    } else if (checkbox === 'Phase' && PhaseCheckBox) {
      let md = tableData.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              arr.push([d1[0]]);
            }
          });
        }
        return [d[0], arr];
      });
      settableData(md);
    } else if (checkbox === 'Entries' && !EntiresCheckBox) {
      let md = tableData2.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              //arr.push(d1);

              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5],
                    e[6],
                    e[7],
                    e[8],
                    '',
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }
        return [d[0], arr];
      });

      settableData(md);
    } else if (checkbox === 'Entries' && EntiresCheckBox) {
      let md = tableData.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '0/0/0',
                    '',
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }

        return [d[0], arr];
      });
      settableData(md);
    } else if (checkbox === 'Comment' && !CommentCheckBox) {
      let md = tableData2.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              //arr.push(d1);

              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5],
                    e[6],
                    e[7],
                    e[8],
                    e[9],
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }
        return [d[0], arr];
      });

      settableData(md);
    } else if (checkbox === 'Comment' && CommentCheckBox) {
      let md = tableData.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              //arr.push(d1);

              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5],
                    e[6],
                    e[7],
                    e[8],
                    '',
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }
        return [d[0], arr];
      });

      settableData(md);
    } else if (
      CompanyCheckBox &&
      JobCheckBox &&
      PhaseCheckBox &&
      EntiresCheckBox &&
      CommentCheckBox
    ) {
      let md = tableData.map(d => {
        let arr = [];
        if (d[1]) {
          d[1].map(d1 => {
            if (d1) {
              //arr.push(d1);

              if (d1[1]) {
                arr.push([
                  d1[0],
                  d1[1].map(e => [
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5],
                    e[6],
                    e[7],
                    e[8],
                    e[9],
                  ]),
                ]);
              } else {
                arr.push([d1[0]]);
              }
            }
          });
        }
        return [d[0], arr];
      });

      settableData(md);
    }
  };
  const IdSwap = arr => {
    let arr1 = arr.map(e => {
      var CompanyId = generateGuidQuickly();
      if (e[1] !== undefined) {
        let jobs = e[1].map(job => {
          let jobsss = [];

          let JobId = generateGuidQuickly();
          if (job[1] !== undefined) {
            let Modified = [];
            let phases = job[1].map((p, i) => {
              let PhaseId = generateGuidQuickly();
              Modified.push([
                `${p[0].split('+')[0]}+${CompanyId}+${JobId}*#^*${
                  job[0].split('*#^*')[3]
                }+${PhaseId}`,
                p[1],
                p[2],
                p[3],
                p[4],
                p[5],
                p[6],
                p[7],
                p[8],
                p[9],
              ]);
            });
            jobsss.push(
              Modified.length > 0
                ? [
                    job[0].split('+')[0] +
                      '+' +
                      CompanyId +
                      '+' +
                      JobId +
                      '*#^*' +
                      job[0].split('*#^*')[3],
                    Modified,
                  ]
                : [
                    job[0].split('+')[0] +
                      '+' +
                      CompanyId +
                      '+' +
                      JobId +
                      '*#^*' +
                      job[0].split('*#^*')[3],
                  ],
            );
            jobsss = jobsss.flat();
            return jobsss;
          }
          return [
            job[0].split('+')[0] +
              '+' +
              CompanyId +
              '+' +
              JobId +
              '*#^*' +
              job[0].split('*#^*')[3],
          ];
        });
        // jobs=jobs.flat()
        return [[e[0][0].split('+')[0] + '+' + CompanyId], jobs];
      }
      return [[e[0][0].split('+')[0] + '+' + CompanyId]];
    });

    return arr1;
  };

  const AddEmployeeName = async (selectEmployee, selectEmployeeID) => {
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
    setUsernamelist(prev => [...prev, ...selectEmployee]);

    let finalStore;
    if (selectEmployee.length !== 0) {
      if (Page === 'EditTimesheet' || Page === 'ApproveEditTimesheet') {
        setprocess_loader(true);
      } else {
      }

      let arr1;
      let myPromise = new Promise(function (myResolve, myReject) {
        // "Producing Code" (May take some time)
        finalStore = IdSwap(tableData);

        myResolve('Done'); // when successful
      });
      // "Consuming Code" (Must wait for a fulfilled Promise)
      myPromise.then(
        selectEmployee.forEach(e => {
          var TimesheetID2 = generateGuidQuickly();
          //  var TimesheetID = generateGuidQuickly();
          var DateTime = CurrentUTCTime();
          var Empresult;
          if (Page === 'EditTimesheet' || Page === 'ApproveEditTimesheet') {
            let resstatus = false;
            db.transaction(function (txn) {
              txn.executeSql('SELECT * FROM Employee', [], function (tx, res) {
                var temp = [];
                for (let i = 0; i < res.rows.length; i++) {
                  temp.push(res.rows.item(i));
                }

                Empresult = temp.find(obj => {
                  //
                  return obj.FullName === GetEmployeeData[0].key;
                });

                //
                if (res.rows.length != 0) {
                  db.transaction(function (txn) {
                    txn.executeSql(
                      'INSERT INTO TimesheetEmployee (TimesheetEmployeeID, TimesheetID, EmployeeID, CreatedBy, CreatedOn)' +
                        'VALUES (?, ?, ?, ?, ?)',

                      [
                        TimesheetID2,
                        EditTimesheetID,
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
                            TimesheetID2,
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

                        if (res.rowsAffected > 0) {
                          if (finalStore.length === 0) {
                          }
                        } else {
                        }
                      },
                    );
                  });
                  if (finalStore.length != 0) {
                    for (let i = 0; i < finalStore.length; i++) {
                      db.transaction(function (txn) {
                        txn.executeSql(
                          'INSERT INTO TimesheetCompany (TimesheetCompanyID,TimesheetEmployeeID, CompanyID, CreatedBy, CreatedOn)' +
                            ' VALUES (?, ?, ?, ?, ?);',
                          [
                            finalStore[i][0][0].split('+')[1],
                            TimesheetID2,
                            finalStore[i][0][0].split('*#^*')[0],
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
                                finalStore[i][0][0].split('+')[1],
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

                            if (
                              finalStore[i][1] &&
                              finalStore[i][1].length === 0
                            ) {
                            } else {
                              if (finalStore[i][1] && finalStore[i][1]) {
                                finalStore[i][1].forEach((ee, job_i) => {
                                  txn.executeSql(
                                    'INSERT INTO TimesheetJob (TimesheetJobID,TimesheetCompanyID, JobID, EstProjectCompletionDate, CreatedBy, CreatedOn)' +
                                      'VALUES (?, ?, ?, ?, ?, ?);',
                                    [
                                      ee[0].split('+')[2].split('*#^*')[0],
                                      finalStore[i][0][0].split('+')[1],
                                      ee[0].split('*#^*')[0],
                                      ee[0].split('*#^*')[3] == 'null'
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

                                      let phaselnth =
                                        finalStore[i][1] &&
                                        finalStore[i][1][job_i] &&
                                        finalStore[i][1][job_i][1] &&
                                        finalStore[i][1][job_i][1].length;

                                      if (phaselnth !== undefined) {
                                      }
                                      if (
                                        finalStore[i][1] &&
                                        finalStore[i][1][job_i] &&
                                        finalStore[i][1][job_i][1]
                                      ) {
                                        // let phasefilter = [].concat.apply(
                                        //   [],
                                        //   SelectedPhase
                                        // );

                                        //////

                                        for (
                                          let j = 0;
                                          j < finalStore[i][1][job_i][1].length;
                                          j++
                                        ) {
                                          var Mon =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][1].split('/');

                                          let Tues =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][2].split('/');
                                          let Wed =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][3].split('/');
                                          let Thurs =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][4].split('/');
                                          let Fri =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][5].split('/');
                                          let Sat =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][6].split('/');
                                          let Sun =
                                            finalStore[i][1][job_i][1][
                                              j
                                            ][7].split('/');
                                          ///////////////////
                                          txn.executeSql(
                                            'INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours, Comment, CreatedBy, CreatedOn,Total_Reg,Total_Ot,Total_Dbl)' +
                                              ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?);',
                                            [
                                              finalStore[i][1][job_i][1][
                                                j
                                              ][0].split('+')[3],
                                              finalStore[i][1][job_i][0]
                                                .split('+')[2]
                                                .split('*#^*')[0],
                                              finalStore[i][1][job_i][1][
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
                                              finalStore[i][1][job_i][1][j][9],
                                              SubmitUserID,
                                              DateTime,
                                              finalStore[i][1][job_i][1][
                                                j
                                              ][8].split('/')[0],
                                              finalStore[i][1][job_i][1][
                                                j
                                              ][8].split('/')[1],
                                              finalStore[i][1][job_i][1][
                                                j
                                              ][8].split('/')[2],
                                            ],
                                            async function (tx, results) {
                                              tx.executeSql(
                                                'INSERT INTO DeviceSynchDataLog ( Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                                                  ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                                                [
                                                  'I',
                                                  'TimesheetPhase',
                                                  finalStore[i][1][job_i][1][
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

                                          /////////////////////
                                        }

                                        //////
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
                      });
                    }

                    // navigation.navigate("HomeScreen");
                  }
                }
              });
            });

            let selectedusername = e;
            let obj = {};
            obj[selectedusername] = finalStore;
            let reg_time = 0;
            let ovt_time = 0;
            let dbl_time = 0;
            let Countcalc = tableData.map((c, i) => {
              if (c[1]) {
                c[1].map((j, ji) => {
                  if (j[1]) {
                    j[1].map((p, ki) => {
                      if (p) {
                        p.map((ph, phi) => {
                          if (phi === 0) {
                            // Ignore first position
                          } else if (phi === 8 || phi === 9) {
                          } else {
                            reg_time += parseFloat(ph.split('/')[0]);
                            ovt_time += parseFloat(ph.split('/')[1]);
                            dbl_time += parseFloat(ph.split('/')[2]);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });

            obj['total_RegularTime'] = reg_time;
            obj['total_DBL'] = dbl_time;
            obj['total_Overtime'] = ovt_time;

            dispatch(AddData(obj));
            dispatch(Temp_Add(obj));
          } else if (
            Page === 'EditTimesheet' ||
            Page === 'ApproveEditTimesheet' ||
            Page === 'Timesheet'
          ) {
            let selectedusername = e;
            let obj = {};
            obj[selectedusername] = finalStore;
            let reg_time = 0;
            let ovt_time = 0;
            let dbl_time = 0;
            let Countcalc = tableData.map((c, i) => {
              if (c[1]) {
                c[1].map((j, ji) => {
                  if (j[1]) {
                    j[1].map((p, ki) => {
                      if (p) {
                        p.map((ph, phi) => {
                          if (phi === 0) {
                            // Ignore first position
                          } else if (phi === 8 || phi === 9) {
                          } else {
                            reg_time += parseFloat(ph.split('/')[0]);
                            ovt_time += parseFloat(ph.split('/')[1]);
                            dbl_time += parseFloat(ph.split('/')[2]);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });

            obj['total_RegularTime'] = reg_time;
            obj['total_DBL'] = dbl_time;
            obj['total_Overtime'] = ovt_time;

            dispatch(AddData(obj));
            dispatch(Temp_Add(obj));
          }
        }),

        // Test

        // Test
      );

      ////////////////////

      ///////////
    }
  };

  // let dd = tableData.map(d => {

  // });

  const closefunc = () => {
    let sele_Emp_Id = selected_Employee_Id.slice(0, 1);
    Setselected_Employee_Id(sele_Emp_Id);
    if (Page === 'EditTimesheet') {
      setTimeout(() => {
        setprocess_loader(false);

        setCopyModalVisible(false);
      }, 4000);
    } else if (Page === 'ApproveEditTimesheet') {
      setTimeout(() => {
        setprocess_loader(false);
        setCopyModalVisible(false);
        close();
      }, 4000);
    } else {
      setCopyModalVisible(false);
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

  useEffect(() => {
    Insert_Employee(username);
    // setUsernamelist(username);
    offset.value = withSpring(1);
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: offset.value}],
    };
  });

  const alertCompany = async () => {
    setCopyCompanydata(true);
  };
  const alertJob = async () => {
    setCopyJobdata(true);
  };
  const alertPhase = async () => {
    setCopyPhasedata(true);
  };

  const alertEmployee = async () => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');

    setEmployeeloading(true);
    SetUserCompanyID('');
    setTimeout(() => {
      setEmployeeloading(false);
    }, 3000);

    let GetEmpValue = GetEmpId.map(d => {
      return d.value;
    });

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
              if (GetEmpId.length !== 0) {
                switch (temp2[0].UserRole) {
                  case 'field supervisor':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID} and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
  
                        `;
                    break;
                  case 'field':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field' and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})`;
                    break;
                  case 'office':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor') and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID} and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
                        `;

                    break;
                  case 'admin':
                    query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor','admin','office') and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID} and EmployeeId not in(${SelectedEmployeeId}, ${GetEmpValue})
                     `;
                    break;
                }
              } else {
                switch (temp2[0].UserRole) {
                  case 'field supervisor':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field'and EmployeeId not in(${SelectedEmployeeId})
                        union select * from employee where EmployeeId = ${temp[0].EmployeeID} and EmployeeId not in(${SelectedId})
  
                        `;
                    break;
                  case 'field':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole = 'field' and EmployeeId not in(${SelectedEmployeeId})`;
                    break;
                  case 'office':
                    query = `select * from  Employee where IsActive=1 and IsRestricted = 1 and companyId in (${
                      temp[0].Company1
                    },${temp[0].Company2},${temp[0].Company3},${
                      temp[0].Company4
                    },${
                      temp[0].Company5
                    }) and userrole in ( 'field','field supervisor') and EmployeeId not in(${SelectedEmployeeId})
                        union select * from employee where EmployeeId = ${
                          temp[0].EmployeeID
                        } and EmployeeId not in(${selected_Employee_Id
                      .slice(0, 1)
                      .toString()})
                        `;

                    break;
                  case 'admin':
                    query = `select * from  Employee where IsActive=1 and Autoearnings = 0 and companyId in (${temp[0].Company1},${temp[0].Company2},${temp[0].Company3},${temp[0].Company4},${temp[0].Company5}) and userrole in ( 'field','field supervisor','admin','office') and EmployeeId not in(${SelectedEmployeeId})
                      union select * from employee where EmployeeId = ${temp[0].EmployeeID} and EmployeeId not in(${SelectedEmployeeId})
                     `;
                    break;
                }
              }

              // let Query =  `select * from  Employee where IsActive=1 and EarningsCode=1 and CompanyId = ${UserCompanyID} ${temp2[0].UserRole===''}  and userrole=''`
              db.transaction(function (txn) {
                txn.executeSql(query, [], function (tx, res) {
                  let temp3 = [];
                  for (let i = 0; i < res.rows.length; i++) {
                    temp3.push(res.rows.item(i));
                  }

                  temp3 = temp3.filter(e => {
                    if (
                      e.Company1 === FromUserDetails[0].Company1 &&
                      e.Company2 === FromUserDetails[0].Company2 &&
                      e.Company3 === FromUserDetails[0].Company3
                    ) {
                      return e;
                    }
                  });

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
                  if (Page === 'ApproveEditTimesheet') {
                    newArray = newArray.filter(
                      obj => !ApproveUsernameList.includes(obj.key),
                    );
                  }
                  Employee.length === 0 ? setEmployee(newArray) : null;
                  setEmployeeloading(false);
                });
              });
            },
          );
        });
        // select * from  Employee where EmployeeId=9314
      });
    });
    setmodalCopyEmployee(true);
  };

  const Insert_Employee = username => {
    let filtering;

    filtering = Edit_whole_Employee.filter(e => {
      return e.key === username;
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
    for (let i = 1; i <= 1; i++) {
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
  // Get Employee list

  // Get Company list
  const GetCompany = () => {
    let Company_value = TableData.map(d => {
      return parseInt(d[0][0].split('*#^*')[0]);
    });

    let newData = Company.map(d => {
      if (Company_value.includes(d['ID'])) {
        return {
          ...d,
          ['check']: true,
          ['displayStatus']: true,
        };
      } else {
        return {
          ...d,
          ['check']: false,
          ['displayStatus']: false,
        };
      }
    });

    let Checkin = newData
      .map(d => {
        if (d.check === true) {
          return d;
        }
      })
      .filter(function (x) {
        return x !== undefined;
      }).length;

    let setforJobId = newData
      .map(d => {
        if (d.check == true) {
          return d.ID;
        }
      })
      .filter(function (x) {
        return x !== undefined;
      });

    setCompanyCount(Checkin);
    SetCompany(newData);
  };

  const GetEmployeevalue = () => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from Employee where EmployeeID =?`,
        [valueforselectempid],
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

          setGetEmpId(newArray);
        },
      );
    });
  };

  const GetJobs = () => {
    if (SelectedCmpId.length === 0) {
      let jobdata = TableData.map(d => {
        return d[1];
      });
      let emparray = [];
      let fulldatavalue = jobdata.forEach(e => {
        if (e) {
          e.forEach(d => {
            return emparray.push(d[0]);
          });
        }
      });
      let getjobdatavalue = emparray
        .flat()
        .flat()
        .map(d => {
          return d;
        })
        .filter(function (x) {
          return x !== undefined;
        });
      let gett = getjobdatavalue.map(d => {
        return parseInt(d.split('*#^*')[0]);
      });
      let newData = Jobs.map(d => {
        if (gett.includes(d['ID'])) {
          return {...d, ['check']: true, ['displayStatus']: true};
        }
      }).filter(function (x) {
        return x !== undefined;
      });
      let Checkin = newData
        .map(d => {
          if (d.displayStatus === true) {
            return d;
          }
        })
        .filter(function (x) {
          return x !== undefined;
        }).length;
      setJobCount(Checkin);
      setJobs(newData);
      setdispjob(newData);
    } else if (SelectedCmpId.length !== 0) {
      let newdatafordisp = Jobs.map(d => {
        if (SelectedCmpId.includes(d['CompanyID'])) {
          return {...d, displayStatus: true};
        } else {
          return {...d, displayStatus: false};
        }
      }).filter(function (x) {
        return x !== undefined;
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

      setJobCount(Checkin);
      setJobs(newdatafordisp);
      setdispjob(newdatafordisp);
    }
  };

  const GetPhase = () => {
    if (
      SelectedJobId.length === 0 &&
      SelectedCmpId.length === 0 &&
      SelectedPhaseId.length === 0
    ) {
      let phasedata = [];
      let phaseName = [];
      let phase = TableData.forEach((d, i) => {
        if (d[1]) {
          d[1].forEach((e, j) => {
            if (e[1]) {
              e[1].forEach((m, k) => {
                return phasedata.push(m);
              });
            }
          });
        }
      });
      let phase1 = TableData.forEach((d, i) => {
        if (d[1]) {
          d[1].forEach((e, j) => {
            if (e[1]) {
              e[1].forEach((m, k) => {
                phaseName.push({
                  // "com" :  (d[0][0]).split('+')[0],
                  // "job":  e[0].split('+')[0].trim(),
                  PhaseName:
                    m[0].split('+')[0] +
                    '*#*#' +
                    e[0].split('+')[0].split('*#^*')[0],
                });
              });
            }
          });
        }
      });

      let emparray = [];
      let full = phasedata.forEach(d => {
        if (d[0]) {
          emparray.push(parseInt(`${d[0].split('*#^*')[0]}`));
        }
      });
      db.transaction(tx => {
        for (i = 0; i < emparray.length; i++) {
          var temp = [];
          tx.executeSql(
            'select * from lkpphasecode where PhaseCodeID = ?',
            [emparray[i].toString()],
            (tx, res) => {
              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }

              let newArray = temp.map(item => {
                return {
                  key:
                    '' +
                    item.PhaseCodeID +
                    '$$$' +
                    item.PhaseCodeName +
                    '$$$' +
                    item.PhaseCode,
                  value:
                    item.PhaseCodeID +
                    '*#^*' +
                    item.PhaseCode +
                    ' ' +
                    item.PhaseCodeName,
                  check: false,
                  status: false,
                  ID: item.PhaseCodeID,
                  JobID: item.JobID,
                  CompanyID: item.PhaseGroup,
                };
              });
              let ee = newArray;
              let final = [];
              for (let i = 0; i < phaseName.length; i++) {
                //
                let dd = [ee[i]];
                let combinedArray = dd.map(obj => ({...obj, ...phaseName[i]}));
                final.push(combinedArray);
              }

              setPhaseData(final.map(e => e[0]));
            },
          );
        }
      });

      let pushPhase = [];

      TableData.forEach(e => {
        if (e[1]) {
          e[1].forEach(e1 => {
            if (e1[1]) {
              e1[1].forEach(e2 => {
                if (e2) {
                  return pushPhase.push(
                    `${e2[0].split('*#^*')[0]}+${Math.floor(
                      Math.random() * 100 + 1,
                    )}%%%%${e1[0].split('*#^*')[0]}`,
                  );
                }
              });
            }
          });
        }
      });

      const obj = pushPhase.reduce((acc, item) => {
        const [key, value] = item.split('%%%%');
        acc[key] = value.trim();
        return acc;
      }, {});

      let ph = [];
      let dd = Object.keys(obj).map(d => {
        return ph.push(
          parseInt(`${d.split('*#^*')[0]}`) +
            `+` +
            `${Math.floor(Math.random() * 100 + 1)}`,
        );
      });

      for (let i = 0; i < PhaseData.length; i++) {
        PhaseData[i].IntialdJobID = ph[i];
      }

      let newData = PhaseData.map(d => {
        if (d) {
          if (emparray.includes(d['ID'])) {
            return {
              ...d,
              ['check']: true,
              ['displayStatus']: true,
            };
          }
        }
      }).filter(function (x) {
        return x !== undefined;
      });

      let Checkin = newData
        .map(d => {
          if (d.check === true) {
            return d;
          }
        })
        .filter(function (x) {
          return x !== undefined;
        }).length;

      setPhaseCount(Checkin);
      setPhases(newData);
      setdispphase(newData);
    } else if (
      SelectedJobId.length !== 0 &&
      SelectedCmpId.length === 0 &&
      SelectedPhaseId.length === 0
    ) {
      let ph = [];
      let dd = Object.values(JobPhaseData).map(d => {
        return ph.push(parseInt(d.split('*#^*')[0]));
      });

      for (let i = 0; i < Phases.length; i++) {
        Phases[i].dJobID = ph[i];
      }

      let newdatafordisp = Phases.map(d => {
        if (SelectedJobId.includes(d['dJobID'])) {
          return {
            ...d,
            displayStatus: true,
          };
        } else {
          return {
            ...d,
            displayStatus: false,
          };
        }
      }).filter(function (x) {
        return x !== undefined;
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
      setPhaseCount(Checkin);
      setPhases(newdatafordisp);
      setdispphase(newdatafordisp);
    } else if (
      SelectedCmpId.length !== 0 &&
      SelectedJobId.length === 0 &&
      SelectedPhaseId.length === 0
    ) {
      let newdatafordisp = Phases.map(d => {
        if (SelectedCmpId.includes(d['CompanyID'])) {
          return {
            ...d,
            displayStatus: true,
          };
        } else {
          return {
            ...d,
            displayStatus: false,
          };
        }
      }).filter(function (x) {
        return x !== undefined;
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

      setPhaseCount(Checkin);
      setPhases(newdatafordisp);
      setdispphase(newdatafordisp);
    } else if (SelectedCmpId.length !== 0 && SelectedJobId.length !== 0) {
      let ph = [];
      let dd = Object.values(JobPhaseData).map(d => {
        return ph.push(parseInt(d.split('*#^*')[0]));
      });

      for (let i = 0; i < Phases.length; i++) {
        Phases[i].dJobID = ph[i];
      }
      let newdatafordisp = Phases.map(d => {
        if (
          SelectedCmpId.includes(d['CompanyID']) &&
          SelectedJobId.includes(d['dJobID'])
        ) {
          return {
            ...d,
            displayStatus: true,
          };
        } else {
          return {
            ...d,
            displayStatus: false,
          };
        }
      }).filter(function (x) {
        return x !== undefined;
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

      setPhaseCount(Checkin);
      setPhases(newdatafordisp);
      setdispphase(newdatafordisp);
    } else if (SelectedPhaseId.length !== 0 && SelectedJobId.length !== 0) {
      let ph = [];
      let dd = Object.values(JobPhaseData).map(d => {
        return ph.push(parseInt(d.split('*#^*')[0]));
      });

      for (let i = 0; i < Phases.length; i++) {
        Phases[i].dJobID = ph[i];
      }
      let newdatafordisp = Phases.map(d => {
        if (SelectedJobId.includes(d['dJobID'])) {
          return {
            ...d,
            displayStatus: true,
          };
        } else {
          return {
            ...d,
            displayStatus: false,
          };
        }
      }).filter(function (x) {
        return x !== undefined;
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

      setPhaseCount(Checkin);
      setPhases(newdatafordisp);
      setdispphase(newdatafordisp);
    }
  };

  useEffect(() => {
    GetEmployeevalue();
  }, [valueforselectempid]);

  useEffect(() => {
    GetCompany();
    GetJobs();
    GetPhase();
  }, [valueforselectempid]);

  useEffect(() => {
    GetJobs();
    GetPhase();
  }, [valueforselectempid, SelectedCmpId]);

  useEffect(() => {
    GetPhase();
  }, [SelectedCmpId, SelectedJobId]);

  // useEffect(() => {
  //   GetJobs();
  // }, [SelectedCmpId]);

  // useEffect(() => {
  //   GetPhase();
  // }, [valueforselectempid, SelectedCmpId]);

  const CopyAddEmployeeName = () => {
    let selectEmployee = [];
    let selectEmployeeID = [];
    let dd = GetEmpId.map(d => {
      selectEmployee.push(d.key);
      selectEmployeeID.push(d.value);
    });

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

    let uu = modified.filter(e => {
      if (e.key === username) {
        return e;
      }
    });
  };

  const save = () => {
    let sele_Emp_Id = selected_Employee_Id.slice(0, 1);
    if (GetEmployeeData.length === 0) {
      setCheck(true);
      setEmpCheck(true);
    } else {
      if (ToSelectedEmployee.length !== 0) {
        AddEmployeeName(ToSelectedEmployee, selected_Employee_Id);
      }
      // setCopyModalVisible(false);
      Setselected_Employee_Id(sele_Emp_Id);
    }
    closefunc();
    // if (Company.length === 0) {
    //   setCheck(true);
    //   setCmpCheck(true);
    // } else if (Jobs.length === 0) {
    //   setCheck(true);
    //   setJobCheck(true);
    // } else if (Phases.length === 0) {
    //   setCheck(true);
    //   setPhaseCheck(true);
    // } else {
    // if (ToSelectedEmployee.length !== 0) {
    //   AddEmployeeName(ToSelectedEmployee, selected_Employee_Id);
    // }
    // setCopyModalVisible(false);
    // }
  };

  return (
    <>
      <SafeAreaView
        style={{
          zIndex: 2,
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

            {process_loader ? (
              <View
                pointerEvents="none"
                style={{zIndex: 99, height: '100%', bottom: 150}}>
                <Processing />
              </View>
            ) : null}

            <View>
              <Text
                style={{
                  fontSize: 20,
                  bottom: 10,
                  left: 25,
                  color: colors.gray,
                }}>
                {' '}
                You are copying from week ending:{' '}
                <Text style={{fontSize: 20, color: 'black'}}>
                  {routeparamsparamKey}
                </Text>
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  top: '3%',
                  left: 25,
                  color: colors.gray,
                }}>
                {' '}
                Please select from the following options:
              </Text>
              <Text style={{fontSize: 20, top: 40, color: 'grey', left: 25}}>
                {' '}
                From Employee:{' '}
                <Text style={{fontWeight: '500', color: '#000100'}}>
                  {username}
                </Text>
              </Text>

              <View style={styles.EmployeeContainer}>
                <Text
                  style={{fontSize: 20, bottom: 20, color: 'grey', left: 8}}>
                  {/* Copy {EmployeeCount} Employee(s) */}
                  To Employees:{' '}
                  <Text style={{fontWeight: '500', color: '#000100'}}> </Text>
                  {GetEmployeeData.length !== 0 ? (
                    GetEmployeeData.map(d => {
                      return (
                        <Text style={{fontWeight: '500', color: '#000100'}}>
                          {d.key}
                        </Text>
                      );
                    })
                  ) : (
                    <Text style={{fontWeight: '500', color: '#000100'}}>
                      &#60;none&#62;
                    </Text>
                  )}
                  {/* {ToSelectedEmployee.length !== 0 ? (
                    <>
                      {ToSelectedEmployee.length > 1 ? (
                        <Text style={{ fontWeight: "500", color: "#000100" }}>
                          {" "}
                          {ToSelectedEmployee.length}
                        </Text>
                      ) : (
                        <>
                          {ToSelectedEmployee.map((d) => {
                            return (
                              <Text
                                style={{ fontWeight: "500", color: "#000100" }}
                              >
                                {" "}
                                {d}
                              </Text>
                            );
                          })}
                        </>
                      )}
                    </>
                  ) : (
                    <Text style={{ fontWeight: "500", color: "#000100" }}>
                      &#60;none&#62;
                    </Text>
                  )} */}
                </Text>

                <Pressable style={styles.Employee} onPress={alertEmployee}>
                  <Text
                    style={
                      EmployeeCheckBox
                        ? {
                            fontSize: 20,
                            color: '#1b386a',
                            right: 143,
                            bottom: 18,
                          }
                        : {fontSize: 20, right: 140, bottom: 18}
                    }>
                    Select Employee &#62;{' '}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.CompanyContainer}>
                <Pressable
                  style={{flexDirection: 'row', bottom: 15}}
                  onPress={() => {
                    CompanyToggle(!CompanyCheckBox), HandleFilter('Company');
                  }}>
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
                    Copy {EmployeeCheckBox ? CompanyCount : 0} Company(ies)
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.Company}
                  onPress={EmployeeCheckBox ? alertCompany : null}>
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
                  onPress={() => {
                    JobToggle(!JobCheckBox), HandleFilter('Job');
                  }}>
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
                    Copy {EmployeeCheckBox ? JobCount : 0} Job(s)
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.Job}
                  onPress={EmployeeCheckBox ? alertJob : null}>
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
                  onPress={() => {
                    PhaseToggle(!PhaseCheckBox), HandleFilter('Phase');
                  }}>
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
                    Copy {EmployeeCheckBox ? PhaseCount : 0} Phase(s)
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.Phase}
                  onPress={EmployeeCheckBox ? alertPhase : null}>
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
                  onPress={() => {
                    EntiresToggle(!EntiresCheckBox), HandleFilter('Entries');
                  }}>
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
                  onPress={() => {
                    CommentToggle(!CommentCheckBox), HandleFilter('Comment');
                  }}>
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

            <TouchableOpacity onPress={save} style={styles.touch}>
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 25}}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {modalCopyEmployee ? (
          <CopyEmployee
            // AddEmployeeName={AddEmployeeName}
            Employee={Employee.filter(e => {
              if (Usernamelist.indexOf(e.key) === -1) {
                return e;
              }
            })}
            setEmployee={setEmployee}
            loading={Employeeloading}
            setCopyModalVisible={setCopyModalVisible}
            setmodalCopyEmployee={setmodalCopyEmployee}
            selected_Employee_Id={selected_Employee_Id}
            Setselected_Employee_Id={Setselected_Employee_Id}
            setGetEmployeeData={setGetEmployeeData}
          />
        ) : null}

        {/* {Check ? (
          <AlertPopup
            Check={Check}
            setCheck={setCheck}
            headtext={'Timesheet Exist'}
            buttontext={'Close'}
            text={`Timesheet already exist for ${SelectedDate}.`}
          />
        ) : null} */}

        {CopyCompanydata ? (
          <CopyCompany
            CJP={CJP}
            setCJP={setCJP}
            handleAddRow={handleAddRow}
            setdispcompany={setdispcompany}
            dispcompany={dispcompany}
            data={data}
            Company={Company}
            setSelectedCompanyPop={setSelectedCompanyPop}
            SetCompany={SetCompany}
            setCompanyCount={setCompanyCount}
            SetCompanyID={SetCompanyID}
            setSelectedCmpId={setSelectedCmpId}
            setJob={setJob}
            setWholeCompany={setWholeCompany}
            setJobCount={setJobCount}
            Job={Job}
            SelectedCmpId={SelectedCmpId}
            setPhaseCount={setPhaseCount}
            setCopyCompanydata={setCopyCompanydata}
            CopyCompanydata={CopyCompanydata}
            Companydata={Companydata}
            GetJobs={GetJobs}
            tableData={tableData}
            // settableData={settableData}
          />
        ) : null}

        {CopyJobdata ? (
          <CopyJob
            setCopyJobdata={setCopyJobdata}
            CopyJobdata={CopyJobdata}
            Jobs={Jobs}
            setJobs={setJobs}
            CompanyJob={CompanyJob}
            handleAddRow={handleAddRow}
            setSelectedJobId={setSelectedJobId}
            SelectedJobId={SelectedJobId}
            setJobCount={setJobCount}
            setdispjob={setdispjob}
            dispjob={dispjob}
          />
        ) : null}

        {CopyPhasedata ? (
          <CopyPhase
            setCopyPhasedata={setCopyPhasedata}
            CopyPhasedata={CopyPhasedata}
            Phases={Phases}
            setPhases={setPhases}
            setdispphase={setdispphase}
            dispphase={dispphase}
            setPhaseCount={setPhaseCount}
            PhaseCount={PhaseCount}
            handleAddRow={handleAddRow}
            setSelectedPhaseId={setSelectedPhaseId}
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

export default TimeSheet_Copypop;
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
    top: 40,
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
    paddingTop: 70,
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
});
