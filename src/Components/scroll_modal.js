import React, {useState, useRef} from 'react';
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScrollPicker from 'react-native-scroll-picker-wheel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../constants/db';
import SynchData from '../Sync/SynchData';
import {useEffect} from 'react';
import Processing from './Processing';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import checkNetworkStatus from '../Sync/checkNetworkStatus';
const Scroll_modal = ({
  setpopup_twentyfour,
  setData,
  hoursmodalVisible,
  sethoursmodalVisible,
  GetDateTime,
  times,
  settimes,
  selected_data,
  TableData,
  setTableData,
  settotal_RegularTime,
  settotal_DBL,
  settotal_Overtime,
  settotalgroup1,
  settotalgroup2,
  settotalgroup3,
  settotalgroup4,
  settotalgroup5,
  settotalgroup6,
  settotalgroup7,
  settotalgroup8,
  EarningsCode,
  setCheck,
  timeindex,
  SelectedTimesheetPhaseCodeID,
  Time,
  setRod,
  Rod,
}) => {
  const [Is_Scroll, setIs_Scroll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [PrevRod, setPrevRod] = useState(0);
  const networkStatus = checkNetworkStatus();
  const [totals, settotals] = useState({
    RegularTime: 0,
    Overtime: 0,
    DBL: 0,
  });

  let R = 0;
  let O = 0;
  let D = 0;
  let RODtotal = 0;
  useEffect(() => {
    if (hoursmodalVisible) {
      R = parseFloat(times.RegularTime);
      O = parseFloat(times.Overtime);
      D = parseFloat(times.DBL);
      RODtotal = R + O + D;
      setPrevRod(RODtotal);
    }
  }, [hoursmodalVisible]);

  useEffect(() => {
    R = parseFloat(times.RegularTime);
    O = parseFloat(times.Overtime);
    D = parseFloat(times.DBL);
    RODtotal = R + O + D;

    setRod(RODtotal);
  }, [times]);

  let crnttotal = 0;

  let Total = Time[selected_data[4]];

  let regular_hours = [
    '0',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
  ];

  let reg_hours = [
    '0',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '12.5',
    '13',
    '13.5',
    '14',
    '14.5',
    '15',
    '15.5',
    '16',
  ];
  let dbl = [
    '0',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '12.5',
    '13',
    '13.5',
    '14',
    '14.5',
    '15',
    '15.5',
    '16',
  ];
  let ovr = [
    '0',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '12.5',
    '13',
    '13.5',
    '14',
    '14.5',
    '15',
    '15.5',
    '16',
  ];

  const get_set = (data, column_index, row_index) => {
    let splited = data.split('/');
    settimes({
      RegularTime: splited[0],
      Overtime: splited[1],
      DBL: splited[2],
    });
    setselected_data([column_index, row_index]);
    setModalVisible(true);
  };
  const close_model = () => {
    sethoursmodalVisible(false);
  };

  useEffect(() => {
    let arr = Object.values(times);

    for (let i = 0; i < arr.length; i++) {
      crnttotal += parseFloat(arr[i]);
    }
  }, [times]);

  const close_pass = async () => {
    let initial =
      TableData[selected_data[1]][1][selected_data[2]][1][selected_data[3]][
        selected_data[4] + 1
      ];
    TableData[selected_data[1]][1][selected_data[2]][1].forEach(e => {});

    // Converting Number
    let conditioned_RegularTime =
      +times.RegularTime !== 0
        ? times.RegularTime
        : Is_Scroll
        ? '0'
        : +initial.split('/')[0] === 0
        ? '8'
        : '0';

    let RegularTime = Number(conditioned_RegularTime);
    // let RegularTime = Number(times.RegularTime);
    let Overtime = Number(times.Overtime);
    let DBL = Number(times.DBL);
    let splited = TableData[selected_data[1]][1][selected_data[2]][1][
      selected_data[3]
    ].map(e => {
      return e.split('/');
    });

    let filter = Object.values(times);

    Time[selected_data[4]];
    let values = Object.values(Time[selected_data[4]]);

    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += parseFloat(values[i]);
    }

    let total = 0;

    for (let i = 0; i < values.length; i++) {
      total += parseFloat(values[i]);
    }
    let total1 = RegularTime + Overtime + DBL;
    let v = sum + (total1 - PrevRod) < 0 ? sum : sum + (total1 - PrevRod);

    if (v > 24) {
      sethoursmodalVisible(false);
      // setpopup_twentyfour(true);
      setCheck(true);
    } else {
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(
        selected_data[4] + 1,
        1,
        `${
          +times.RegularTime !== 0
            ? times.RegularTime
            : Is_Scroll
            ? '0'
            : +initial.split('/')[0] === 0
            ? '8'
            : '0'
        }/${times.Overtime ?? '0'}/${times.DBL ?? '0'}`,
      );

      setData(
        TableData[selected_data[1]][1][selected_data[2]][1][selected_data[3]],
      );
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

      let splited = TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].map(e => {
        return e.split('/');
      });

      let first = 0;
      let second = 0;
      let third = 0;

      splited.forEach((e, i) => {
        if (i === 0) {
          return null;
        } else if (i === 8 || i === 9) {
          return null;
        }

        (first += parseFloat(e[0])),
          (second += parseFloat(e[1])),
          (third += parseFloat(e[2]));
      });

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
      if (SelectedTimesheetPhaseCodeID != undefined) {
        let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
        let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
        var DateTime = CurrentUTCTime();
        let MonRegularHours = SelectedTimesheetPhaseCodeID[0].MonRegularHours;
        let MonOvertimeHours = SelectedTimesheetPhaseCodeID[0].MonOvertimeHours;
        let MonDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].MonDoubleTimeHours;
        let TueRegularHours = SelectedTimesheetPhaseCodeID[0].TueRegularHours;
        let TueOvertimeHours = SelectedTimesheetPhaseCodeID[0].TueOvertimeHours;
        let TueDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].TueDoubleTimeHours;
        let WedRegularHours = SelectedTimesheetPhaseCodeID[0].WedRegularHours;
        let WedOvertimeHours = SelectedTimesheetPhaseCodeID[0].WedOvertimeHours;
        let WedDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].WedDoubleTimeHours;
        let ThuRegularHours = SelectedTimesheetPhaseCodeID[0].ThuRegularHours;
        let ThuOvertimeHours = SelectedTimesheetPhaseCodeID[0].ThuOvertimeHours;
        let ThuDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].ThuDoubleTimeHours;
        let FriRegularHours = SelectedTimesheetPhaseCodeID[0].FriRegularHours;
        let FriOvertimeHours = SelectedTimesheetPhaseCodeID[0].FriOvertimeHours;
        let FriDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].FriDoubleTimeHours;
        let SatRegularHours = SelectedTimesheetPhaseCodeID[0].SatRegularHours;
        let SatOvertimeHours = SelectedTimesheetPhaseCodeID[0].SatOvertimeHours;
        let SatDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].SatDoubleTimeHours;
        let SunRegularHours = SelectedTimesheetPhaseCodeID[0].SunRegularHours;
        let SunOvertimeHours = SelectedTimesheetPhaseCodeID[0].SunOvertimeHours;
        let SunDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].SunDoubleTimeHours;

        let columnname = ['UpdatedBy', 'UpdatedOn'];
        let columnvalue = [SubmitUserID, DateTime];
        let Total_Reg = first;
        let Total_Ot = second;
        let Total_Dbl = third;
        if (timeindex == 0) {
          MonRegularHours = RegularTime;
          MonOvertimeHours = Overtime;
          MonDoubleTimeHours = DBL;

          columnname.push('MonRegularHours');
          columnvalue.push(MonRegularHours);

          columnname.push('MonOvertimeHours');
          columnvalue.push(MonOvertimeHours);

          columnname.push('MonDoubleTimeHours');
          columnvalue.push(MonDoubleTimeHours);
        } else if (timeindex == 1) {
          TueRegularHours = RegularTime;
          TueOvertimeHours = Overtime;
          TueDoubleTimeHours = DBL;

          columnname.push('TueRegularHours');
          columnvalue.push(TueRegularHours);

          columnname.push('TueOvertimeHours');
          columnvalue.push(TueOvertimeHours);

          columnname.push('TueDoubleTimeHours');
          columnvalue.push(TueDoubleTimeHours);
        } else if (timeindex == 2) {
          WedRegularHours = RegularTime;
          WedOvertimeHours = Overtime;
          WedDoubleTimeHours = DBL;

          columnname.push('WedRegularHours');
          columnvalue.push(WedRegularHours);

          columnname.push('WedOvertimeHours');
          columnvalue.push(WedOvertimeHours);

          columnname.push('WedDoubleTimeHours');
          columnvalue.push(WedDoubleTimeHours);
        } else if (timeindex == 3) {
          ThuRegularHours = RegularTime;
          ThuOvertimeHours = Overtime;
          ThuDoubleTimeHours = DBL;

          columnname.push('ThuRegularHours');
          columnvalue.push(ThuRegularHours);

          columnname.push('ThuOvertimeHours');
          columnvalue.push(ThuOvertimeHours);

          columnname.push('ThuDoubleTimeHours');
          columnvalue.push(ThuDoubleTimeHours);
        } else if (timeindex == 4) {
          FriRegularHours = RegularTime;
          FriOvertimeHours = Overtime;
          FriDoubleTimeHours = DBL;

          columnname.push('FriRegularHours');
          columnvalue.push(FriRegularHours);

          columnname.push('FriOvertimeHours');
          columnvalue.push(FriOvertimeHours);

          columnname.push('FriDoubleTimeHours');
          columnvalue.push(FriDoubleTimeHours);
        } else if (timeindex == 5) {
          SatRegularHours = RegularTime;
          SatOvertimeHours = Overtime;
          SatDoubleTimeHours = DBL;

          columnname.push('SatRegularHours');
          columnvalue.push(SatRegularHours);

          columnname.push('SatOvertimeHours');
          columnvalue.push(SatOvertimeHours);

          columnname.push('SatDoubleTimeHours');
          columnvalue.push(SatDoubleTimeHours);
        } else if (timeindex == 6) {
          SunRegularHours = RegularTime;
          SunOvertimeHours = Overtime;
          SunDoubleTimeHours = DBL;

          columnname.push('SunRegularHours');
          columnvalue.push(SunRegularHours);

          columnname.push('SunOvertimeHours');
          columnvalue.push(SunOvertimeHours);

          columnname.push('SunDoubleTimeHours');
          columnvalue.push(SunDoubleTimeHours);
        }

        db.transaction(txn => {
          txn.executeSql(
            `UPDATE TimesheetPhaseCode set MonRegularHours=?, MonOvertimeHours=?, MonDoubleTimeHours=?,TueRegularHours=?, 
          TueOvertimeHours=?, TueDoubleTimeHours=?, WedRegularHours=?, WedOvertimeHours=?, WedDoubleTimeHours=?, ThuRegularHours=?, ThuOvertimeHours=?, 
          ThuDoubleTimeHours=?, FriRegularHours=?, FriOvertimeHours=?, FriDoubleTimeHours=?, SatRegularHours=?, SatOvertimeHours=?, SatDoubleTimeHours=?,
           SunRegularHours=?, SunOvertimeHours=?,SunDoubleTimeHours=?,Total_Reg=?,Total_Ot=?,Total_Dbl=?,UpdatedBy=?,UpdatedOn=? where TimesheetPhaseCodeID=?`,
            [
              MonRegularHours,
              MonOvertimeHours,
              MonDoubleTimeHours,
              TueRegularHours,
              TueOvertimeHours,
              TueDoubleTimeHours,
              WedRegularHours,
              WedOvertimeHours,
              WedDoubleTimeHours,
              ThuRegularHours,
              ThuOvertimeHours,
              ThuDoubleTimeHours,
              FriRegularHours,
              FriOvertimeHours,
              FriDoubleTimeHours,
              SatRegularHours,
              SatOvertimeHours,
              SatDoubleTimeHours,
              SunRegularHours,
              SunOvertimeHours,
              SunDoubleTimeHours,
              Total_Reg,
              Total_Ot,
              Total_Dbl,
              SubmitUserID,
              DateTime,
              SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
            ],
            async function (tx, res) {
              //
              for (let i = 0; i < columnname.length; i++) {
                txn.executeSql(
                  'INSERT INTO DeviceSynchDataLog (Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                  [
                    'U',
                    'TimesheetPhaseCode',
                    SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
                    columnname[i],
                    columnvalue[i],
                    DateTime,
                    Deviceid,
                    0,
                    0,
                    '-',
                  ],
                  function (tx, result) {},
                );
              }
            },
          );
        });
      }
      settotal_RegularTime(reg_time),
        settotal_Overtime(ovt_time),
        settotal_DBL(dbl_time);
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(8, 1, `${first}/${second}/${third}`);
      sethoursmodalVisible(false);
    }

    setIs_Scroll(false);
  };

  const del_pass = async () => {
    TableData[selected_data[1]][1][selected_data[2]][1].forEach(e => {});

    // Converting Number

    let RegularTime = Number(times.RegularTime);
    let Overtime = Number(times.Overtime);
    let DBL = Number(times.DBL);

    if (RegularTime + Overtime + DBL > 24) {
      sethoursmodalVisible(false);
      setpopup_twentyfour(true);
    } else {
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(selected_data[4] + 1, 1, `${'0'}/${'0'}/${'0'}`);

      setData(
        TableData[selected_data[1]][1][selected_data[2]][1][selected_data[3]],
      );
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

      let splited = TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].map(e => {
        return e.split('/');
      });

      let first = 0;
      let second = 0;
      let third = 0;

      splited.forEach((e, i) => {
        if (i === 0) {
          return null;
        } else if (i === 8 || i === 9) {
          return null;
        }

        (first += parseFloat(e[0])),
          (second += parseFloat(e[1])),
          (third += parseFloat(e[2]));
      });

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
      if (SelectedTimesheetPhaseCodeID != undefined) {
        let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
        let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));
        var DateTime = CurrentUTCTime();
        let MonRegularHours = SelectedTimesheetPhaseCodeID[0].MonRegularHours;
        let MonOvertimeHours = SelectedTimesheetPhaseCodeID[0].MonOvertimeHours;
        let MonDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].MonDoubleTimeHours;
        let TueRegularHours = SelectedTimesheetPhaseCodeID[0].TueRegularHours;
        let TueOvertimeHours = SelectedTimesheetPhaseCodeID[0].TueOvertimeHours;
        let TueDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].TueDoubleTimeHours;
        let WedRegularHours = SelectedTimesheetPhaseCodeID[0].WedRegularHours;
        let WedOvertimeHours = SelectedTimesheetPhaseCodeID[0].WedOvertimeHours;
        let WedDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].WedDoubleTimeHours;
        let ThuRegularHours = SelectedTimesheetPhaseCodeID[0].ThuRegularHours;
        let ThuOvertimeHours = SelectedTimesheetPhaseCodeID[0].ThuOvertimeHours;
        let ThuDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].ThuDoubleTimeHours;
        let FriRegularHours = SelectedTimesheetPhaseCodeID[0].FriRegularHours;
        let FriOvertimeHours = SelectedTimesheetPhaseCodeID[0].FriOvertimeHours;
        let FriDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].FriDoubleTimeHours;
        let SatRegularHours = SelectedTimesheetPhaseCodeID[0].SatRegularHours;
        let SatOvertimeHours = SelectedTimesheetPhaseCodeID[0].SatOvertimeHours;
        let SatDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].SatDoubleTimeHours;
        let SunRegularHours = SelectedTimesheetPhaseCodeID[0].SunRegularHours;
        let SunOvertimeHours = SelectedTimesheetPhaseCodeID[0].SunOvertimeHours;
        let SunDoubleTimeHours =
          SelectedTimesheetPhaseCodeID[0].SunDoubleTimeHours;
        let columnname = ['UpdatedBy', 'UpdatedOn'];
        let columnvalue = [SubmitUserID, DateTime];
        let Total_Reg = reg_time;
        let Total_Ot = ovt_time;
        let Total_Dbl = dbl_time;
        if (timeindex == 0) {
          MonRegularHours = 0;
          MonOvertimeHours = 0;
          MonDoubleTimeHours = 0;
          if (MonRegularHours == 0) {
            columnname.push('MonRegularHours');
            columnvalue.push(MonRegularHours);
          }
          if (MonOvertimeHours == 0) {
            columnname.push('MonOvertimeHours');
            columnvalue.push(MonOvertimeHours);
          }
          if (MonDoubleTimeHours == 0) {
            columnname.push('MonDoubleTimeHours');
            columnvalue.push(MonDoubleTimeHours);
          }
        } else if (timeindex == 1) {
          TueRegularHours = 0;
          TueOvertimeHours = 0;
          TueDoubleTimeHours = 0;
          if (TueRegularHours == 0) {
            columnname.push('TueRegularHours');
            columnvalue.push(TueRegularHours);
          }
          if (TueOvertimeHours == 0) {
            columnname.push('TueOvertimeHours');
            columnvalue.push(TueOvertimeHours);
          }
          if (TueDoubleTimeHours == 0) {
            columnname.push('TueDoubleTimeHours');
            columnvalue.push(TueDoubleTimeHours);
          }
        } else if (timeindex == 2) {
          WedRegularHours = 0;
          WedOvertimeHours = 0;
          WedDoubleTimeHours = 0;
          if (WedRegularHours == 0) {
            columnname.push('WedRegularHours');
            columnvalue.push(WedRegularHours);
          }
          if (WedOvertimeHours == 0) {
            columnname.push('WedOvertimeHours');
            columnvalue.push(WedOvertimeHours);
          }
          if (WedDoubleTimeHours == 0) {
            columnname.push('WedDoubleTimeHours');
            columnvalue.push(WedDoubleTimeHours);
          }
        } else if (timeindex == 3) {
          ThuRegularHours = 0;
          ThuOvertimeHours = 0;
          ThuDoubleTimeHours = 0;
          if (ThuRegularHours == 0) {
            columnname.push('ThuRegularHours');
            columnvalue.push(ThuRegularHours);
          }
          if (ThuOvertimeHours == 0) {
            columnname.push('ThuOvertimeHours');
            columnvalue.push(ThuOvertimeHours);
          }
          if (ThuDoubleTimeHours == 0) {
            columnname.push('ThuDoubleTimeHours');
            columnvalue.push(ThuDoubleTimeHours);
          }
        } else if (timeindex == 4) {
          FriRegularHours = 0;
          FriOvertimeHours = 0;
          FriDoubleTimeHours = 0;
          if (FriRegularHours == 0) {
            columnname.push('FriRegularHours');
            columnvalue.push(FriRegularHours);
          }
          if (FriOvertimeHours == 0) {
            columnname.push('FriOvertimeHours');
            columnvalue.push(FriOvertimeHours);
          }
          if (FriDoubleTimeHours == 0) {
            columnname.push('FriDoubleTimeHours');
            columnvalue.push(FriDoubleTimeHours);
          }
        } else if (timeindex == 5) {
          SatRegularHours = 0;
          SatOvertimeHours = 0;
          SatDoubleTimeHours = 0;
          if (SatRegularHours == 0) {
            columnname.push('SatRegularHours');
            columnvalue.push(SatRegularHours);
          }
          if (SatOvertimeHours == 0) {
            columnname.push('SatOvertimeHours');
            columnvalue.push(SatOvertimeHours);
          }
          if (SatDoubleTimeHours == 0) {
            columnname.push('SatDoubleTimeHours');
            columnvalue.push(SatDoubleTimeHours);
          }
        } else if (timeindex == 6) {
          SunRegularHours = 0;
          SunOvertimeHours = 0;
          SunDoubleTimeHours = 0;
          if (SunRegularHours == 0) {
            columnname.push('SunRegularHours');
            columnvalue.push(SunRegularHours);
          }
          if (SunOvertimeHours == 0) {
            columnname.push('SunOvertimeHours');
            columnvalue.push(SunOvertimeHours);
          }
          if (SunDoubleTimeHours == 0) {
            columnname.push('SunDoubleTimeHours');
            columnvalue.push(SunDoubleTimeHours);
          }
        }

        db.transaction(txn => {
          txn.executeSql(
            `UPDATE TimesheetPhaseCode set MonRegularHours=?, MonOvertimeHours=?, MonDoubleTimeHours=?,TueRegularHours=?, 
          TueOvertimeHours=?, TueDoubleTimeHours=?, WedRegularHours=?, WedOvertimeHours=?, WedDoubleTimeHours=?, ThuRegularHours=?, ThuOvertimeHours=?, 
          ThuDoubleTimeHours=?, FriRegularHours=?, FriOvertimeHours=?, FriDoubleTimeHours=?, SatRegularHours=?, SatOvertimeHours=?, SatDoubleTimeHours=?,
           SunRegularHours=?, SunOvertimeHours=?,SunDoubleTimeHours=?,Total_Reg=?,Total_Ot=?,Total_Dbl=?,UpdatedBy=?,UpdatedOn=? where TimesheetPhaseCodeID=?`,
            [
              MonRegularHours,
              MonOvertimeHours,
              MonDoubleTimeHours,
              TueRegularHours,
              TueOvertimeHours,
              TueDoubleTimeHours,
              WedRegularHours,
              WedOvertimeHours,
              WedDoubleTimeHours,
              ThuRegularHours,
              ThuOvertimeHours,
              ThuDoubleTimeHours,
              FriRegularHours,
              FriOvertimeHours,
              FriDoubleTimeHours,
              SatRegularHours,
              SatOvertimeHours,
              SatDoubleTimeHours,
              SunRegularHours,
              SunOvertimeHours,
              SunDoubleTimeHours,
              Total_Reg,
              Total_Ot,
              Total_Dbl,
              SubmitUserID,
              DateTime,
              SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
            ],
            async function (tx, res) {
              for (let i = 0; i < columnname.length; i++) {
                txn.executeSql(
                  'INSERT INTO DeviceSynchDataLog (Action, TableName,RowID, ColumnName, ColumnValue,DateTime,SourceDeviceID,IsObsolete,SynchedDateTime,SynchMessage)' +
                    ' VALUES ( ?, ?, ?, ?, ?,?,?,?,?,?);',
                  [
                    'U',
                    'TimesheetPhaseCode',
                    SelectedTimesheetPhaseCodeID[0].TimesheetPhaseCodeID,
                    columnname[i],
                    columnvalue[i],
                    DateTime,
                    Deviceid,
                    0,
                    0,
                    '-',
                  ],
                  function (tx, result) {},
                );
              }
            },
          );
        });
      }
      settotal_RegularTime(reg_time),
        settotal_Overtime(ovt_time),
        settotal_DBL(dbl_time);
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(8, 1, `${first}/${second}/${third}`);
      sethoursmodalVisible(false);
    }
  };

  return (
    <View>
      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={hoursmodalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header_scroll}>
              <Text style={{fontSize: 20, fontWeight: '500', color: '#84d7d1'}}>
                REG
              </Text>

              {EarningsCode === 4 ? null : (
                <>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: '#84d7d1'}}>
                    OVER
                  </Text>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: '#84d7d1'}}>
                    DBL
                  </Text>
                </>
              )}
            </View>

            <View style={styles.pickercontainer}>
              {EarningsCode === 4 ? (
                <ScrollPicker
                  Title={'Reg'}
                  dataSource={regular_hours}
                  selectedIndex={
                    +times.RegularTime !== 0
                      ? regular_hours.indexOf(times.RegularTime)
                      : 16
                  }
                  onValueChange={(data, selectedIndex) => {
                    setIs_Scroll(true);
                    settimes({
                      ...times,
                      RegularTime: data === 0 ? regular_hours[17] : data,
                    });
                    // rgtime = data
                  }}
                  wrapperHeight={450}
                  itemHeight={50}
                  highlightColor={'#84d7d1'}
                  highlightBorderWidth={3}
                  activeItemColor={'#84d7d1'}
                  itemColor={'#000'}
                />
              ) : (
                <>
                  <ScrollPicker
                    Title={'Reg'}
                    dataSource={reg_hours}
                    selectedIndex={
                      +times.RegularTime !== 0
                        ? reg_hours.indexOf(times.RegularTime)
                        : 16
                    }
                    onValueChange={(data, selectedIndex) => {
                      setIs_Scroll(true);
                      settimes({
                        ...times,
                        RegularTime: data === 0 ? reg_hours[17] : data,
                      });
                      // rgtime = data
                    }}
                    wrapperHeight={450}
                    itemHeight={50}
                    highlightColor={'#84d7d1'}
                    highlightBorderWidth={3}
                    activeItemColor={'#84d7d1'}
                    itemColor={'#000'}
                  />

                  <ScrollPicker
                    Title={'Ovt'}
                    style={{color: '#000'}}
                    dataSource={ovr}
                    selectedIndex={
                      times.Overtime !== null ? ovr.indexOf(times.Overtime) : 0
                    }
                    renderItem={(data, index, isSelected) => {
                      //
                    }}
                    onValueChange={(data, selectedIndex) => {
                      settimes({
                        ...times,
                        Overtime: data,
                      });
                      Overtime = data;
                    }}
                    wrapperHeight={450}
                    itemHeight={50}
                    highlightColor={'#84d7d1'}
                    highlightBorderWidth={3}
                    activeItemColor={'#84d7d1'}
                    itemColor={'#000'}
                  />

                  <ScrollPicker
                    Title={'Dbl'}
                    dataSource={dbl}
                    selectedIndex={
                      times.DBL !== null ? dbl.indexOf(times.DBL) : 0
                    }
                    renderItem={(data, index, isSelected) => {}}
                    onValueChange={(data, selectedIndex) => {
                      settimes({
                        ...times,
                        DBL: data,
                      });
                      dbltime = data;
                    }}
                    wrapperHeight={450}
                    itemHeight={50}
                    highlightColor={'#84d7d1'}
                    highlightBorderWidth={3}
                    activeItemColor={'#84d7d1'}
                    itemColor={'#000'}
                  />
                </>
              )}
            </View>
            <View style={styles.btncontainer}>
              <Pressable style={styles.Okbutton} onPress={() => close_pass()}>
                <Text style={styles.btnText}>OK</Text>
              </Pressable>

              <Pressable style={styles.Okbutton} onPress={() => del_pass()}>
                <Text style={styles.btnText}>DEL</Text>
              </Pressable>

              <Pressable style={styles.Okbutton} onPress={() => close_model()}>
                <Text style={styles.btnText}>CANCEL</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#BEBEBE', fontSize: 25},
  header_scroll: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '10%',
    marginBottom: '5%',
  },

  pickercontainer: {
    flexDirection: 'row',
    // backgroundColor: "red",
    // alignItems: "center",
    // justifyContent: "center",
    marginBottom: '9%',
    // marginTop: "20%",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 600,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  btncontainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Okbutton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
    height: 40,
    marginTop: 20,
  },
  btnText: {
    width: 100,
    textAlign: 'center',
    fontSize: 25,
    color: '#84d7d1',
    fontWeight: '600',
  },
});

export default Scroll_modal;
