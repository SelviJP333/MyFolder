import React, {useEffect, useState} from 'react';
import db from '../constants/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import epochTime from '../constants/epochTime';
import axios from 'axios';
import moment from 'moment';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import {useDispatch, useSelector} from 'react-redux';
import {callFunctionAction} from '../redux/actions/Action';
import {BaseURL} from '../constants/BaseURL';
const SynchData = ({aTable, setData, data, setLoad}) => {
  let Dispatch = useDispatch();
  const called = useSelector(state => state.SyncReducer.called);
  useEffect(() => {
    if (aTable && aTable.length > 0) {
      update();
    }
  }, [aTable]);

  var aFiles = [];

  const update = async () => {
    let user_id = await AsyncStorage.getItem('SubmitUserID');
    let device_id = await AsyncStorage.getItem('device_id');
    let oData = aTable.map(item => {
      if (item.Columns[0] != undefined) {
        return {
          TableName: item.TableName,
          Columns: item.Columns[0],
          InsertedRows: item.InsertedRows,
          UpdatedRows: item.UpdatedRows,
          DeletedRows: item.DeletedRows,
        };
      }
    });

    oData = oData.filter(function (element) {
      return element !== undefined;
    });

    let newArray = [
      {
        name: 'data',
        value: {
          userID: user_id,
          deviceID: JSON.parse(device_id),
          pushNotificationRegistrationID: 0,
          deviceSynchHistoryID: 0,
          version: '4.032',
          platform: 'ipad',
          data: oData,
          files: aFiles,
          currentSynchDateTimeDevice: epochTime(),
          currentSynchDateTimeServer: 0,
          dataSynchIDs: [],
          fileSynchIDs: [],
        },
      },
    ];
    //console.log("newArray",newArray);
    let dateTime = CurrentUTCTime();
    let SubmitUserID = await AsyncStorage.getItem('SubmitUserID');
    let Deviceid = JSON.parse(await AsyncStorage.getItem('device_id'));

    var config = {
      method: 'post',
      url: `${BaseURL}Synch/SynchDataWithServer`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: newArray,
    };

    axios(config)
      .then(async function (response) {
        console.log('Sync response', response.data);
        if (
          response.data &&
          response.data.response &&
          response.data.response.data
        ) {
          db.transaction(txn => {
            txn.executeSql(
              `UPDATE Device SET UpdatedBy=?,UpdatedOn=?,LastSynchDateTime=? ,LastSynchBy=? WHERE DeviceID =?`,
              [
                SubmitUserID,
                dateTime,
                response.data.response.currentSynchDateTimeDevice,
                SubmitUserID,
                Deviceid,
              ],
              async function (tx, res) {
                //      console.log('Update Device', res.rowsAffected);
                data != 'data' ? setData(response.data) : null;
                data == 'data' ? setLoad(false) : null;
              },
            );
          });

          const TimesheetfilteredData = response.data.response.data.filter(
            item => {
              return item.tableName == 'Timesheet';
            },
          );
          var Timesheetcolumns = TimesheetfilteredData.map(
            item => item.columns,
          )[0];
          var TimesheetInsertedArr = TimesheetfilteredData.map(
            item => item.insertedRows,
          )[0];
          var TimesheetUpdatedArr = TimesheetfilteredData.map(
            item => item.updatedRows,
          )[0];
          var TimesheetDeletedArr = TimesheetfilteredData.map(
            item => item.deletedRows,
          )[0];

          let TimesheetRowtemp = [];
          if (TimesheetInsertedArr) {
            for (let i = 0; i < TimesheetInsertedArr.length; i++) {
              let TimesheetInsertedRows = TimesheetInsertedArr[i].map(item => {
                if (item === '') {
                  return null;
                } else {
                  return item;
                }
              });
              TimesheetRowtemp.push(TimesheetInsertedRows);
            }
          }
          const TimesheetEmployeefilteredData =
            response.data.response.data.filter(item => {
              return item.tableName == 'TimesheetEmployee';
            });

          var TimesheetEmployeecolumns = TimesheetEmployeefilteredData.map(
            item => item.columns,
          )[0];
          var TimesheetEmployeeInsertedArr = TimesheetEmployeefilteredData.map(
            item => item.insertedRows,
          )[0];
          var TimesheetEmployeeupdatedArr = TimesheetEmployeefilteredData.map(
            item => item.updatedRows,
          )[0];
          var TimesheetEmployeeDeletedArr = TimesheetEmployeefilteredData.map(
            item => item.deletedRows,
          )[0];

          let TimesheetEmployeeRowtemp = [];
          if (TimesheetEmployeeInsertedArr) {
            for (let i = 0; i < TimesheetEmployeeInsertedArr.length; i++) {
              let TimesheetEmployeeInsertedRows = TimesheetEmployeeInsertedArr[
                i
              ].map(item => {
                if (item === '') {
                  return null;
                } else {
                  return item;
                }
              });
              TimesheetEmployeeRowtemp.push(TimesheetEmployeeInsertedRows);
            }
          }
          const TimesheetCompanyfilteredData =
            response.data.response.data.filter(item => {
              return item.tableName == 'TimesheetCompany';
            });

          var TimesheetCompanycolumns = TimesheetCompanyfilteredData.map(
            item => item.columns,
          )[0];
          var TimesheetCompanyInsertedArr = TimesheetCompanyfilteredData.map(
            item => item.insertedRows,
          )[0];
          var TimesheetCompanyupdatedArr = TimesheetCompanyfilteredData.map(
            item => item.updatedRows,
          )[0];
          var TimesheetCompanyDeletedArr = TimesheetCompanyfilteredData.map(
            item => item.deletedRows,
          )[0];
          let TimesheetCompanyRowtemp = [];
          if (TimesheetCompanyInsertedArr) {
            for (let i = 0; i < TimesheetCompanyInsertedArr.length; i++) {
              let TimesheetCompanyInsertedRows = TimesheetCompanyInsertedArr[
                i
              ].map(item => {
                if (item === '') {
                  return null;
                } else {
                  return item;
                }
              });
              TimesheetCompanyRowtemp.push(TimesheetCompanyInsertedRows);
            }
          }

          const TimesheetJobfilteredData = response.data.response.data.filter(
            item => {
              return item.tableName == 'TimesheetJob';
            },
          );

          var TimesheetJobcolumns = TimesheetJobfilteredData.map(
            item => item.columns,
          )[0];
          var TimesheetJobInsertedArr = TimesheetJobfilteredData.map(
            item => item.insertedRows,
          )[0];
          var TimesheetJobupdatedArr = TimesheetJobfilteredData.map(
            item => item.updatedRows,
          )[0];
          var TimesheetJobDeletetedArr = TimesheetJobfilteredData.map(
            item => item.deletedRows,
          )[0];
          let TimesheetJobRowtemp = [];
          if (TimesheetJobInsertedArr) {
            for (let i = 0; i < TimesheetJobInsertedArr.length; i++) {
              let TimesheetJobInsertedRows = TimesheetJobInsertedArr[i].map(
                item => {
                  if (item === '') {
                    return null;
                  } else {
                    return item;
                  }
                },
              );
              TimesheetJobRowtemp.push(TimesheetJobInsertedRows);
            }
          }

          const TimesheetPhaseCodefilteredData =
            response.data.response.data.filter(item => {
              return item.tableName == 'TimesheetPhaseCode';
            });

          var TimesheetPhaseCodecolumns = TimesheetPhaseCodefilteredData.map(
            item => item.columns,
          )[0];
          var TimesheetPhaseCodeInsertedArr =
            TimesheetPhaseCodefilteredData.map(item => item.insertedRows)[0];
          var TimesheetPhaseCodeupdatedArr = TimesheetPhaseCodefilteredData.map(
            item => item.updatedRows,
          )[0];
          var TimesheetPhaseCodeDeletedArr = TimesheetPhaseCodefilteredData.map(
            item => item.deletedRows,
          )[0];

          let TimesheetPhaseCodeRowtemp = [];
          if (TimesheetPhaseCodeInsertedArr) {
            for (let i = 0; i < TimesheetPhaseCodeInsertedArr.length; i++) {
              let TimesheetPhaseCodeInsertedRows =
                TimesheetPhaseCodeInsertedArr[i].map(item => {
                  if (item === '') {
                    return null;
                  } else {
                    return item;
                  }
                });
              TimesheetPhaseCodeRowtemp.push(TimesheetPhaseCodeInsertedRows);
            }
          }

          const UserfilteredData =
            response.data.response.data.filter(item => {
              return item.tableName == 'User';
            });
           
            var Usercolumns = UserfilteredData.map(
              item => item.columns,
            )[0];
            var UserInsertedArr =
              UserfilteredData.map(item => item.insertedRows)[0];
            var UserupdatedArr = UserfilteredData.map(
              item => item.updatedRows,
            )[0];
            var UserDeletedArr = UserfilteredData.map(
              item => item.deletedRows,
            )[0];
  
            let UserRowtemp = [];
            if (UserInsertedArr) {
              for (let i = 0; i < UserInsertedArr.length; i++) {
                let UserInsertedRows =
                  UserInsertedArr[i].map(item => {
                    if (item === '') {
                      return null;
                    } else {
                      return item;
                    }
                  });
                UserRowtemp.push(UserInsertedRows);
              }
            }
            
            const EmployeefilteredData =
            response.data.response.data.filter(item => {
              return item.tableName == 'Employee';
            });
           
            var Employeecolumns = EmployeefilteredData.map(
              item => item.columns,
            )[0];
            var EmployeeInsertedArr =
              EmployeefilteredData.map(item => item.insertedRows)[0];
            var EmployeeupdatedArr = EmployeefilteredData.map(
              item => item.updatedRows,
            )[0];
            var EmployeeDeletedArr = EmployeefilteredData.map(
              item => item.deletedRows,
            )[0];
  
            let EmployeeRowtemp = [];
            if (EmployeeInsertedArr) {
              for (let i = 0; i < EmployeeInsertedArr.length; i++) {
                let EmployeeInsertedRows =
                  EmployeeInsertedArr[i].map(item => {
                    if (item === '') {
                      return null;
                    } else {
                      return item;
                    }
                  });
                EmployeeRowtemp.push(EmployeeInsertedRows);
              }
            }


            const LkpCompanyfilteredData = response.data.response.data.filter(
              item => {
                return item.tableName == 'LkpCompany';
              },
            );

            var LkpCompanycolumns = LkpCompanyfilteredData.map(
              item => item.columns,
            )[0];
            var LkpCompanyInsertedArr = LkpCompanyfilteredData.map(
              item => item.insertedRows,
            )[0];
            var LkpCompanyupdatedArr = LkpCompanyfilteredData.map(
              item => item.updatedRows,
            )[0];
            var LkpCompanyDeletedArr = LkpCompanyfilteredData.map(
              item => item.deletedRows,
            )[0];
  
            let LkpCompanyRowtemp = [];
            if (LkpCompanyInsertedArr) {
              for (let i = 0; i < LkpCompanyInsertedArr.length; i++) {
                let LkpCompanyInsertedRows = LkpCompanyInsertedArr[i].map(
                  item => {
                    if (item === '') {
                      return null;
                    } else {
                      return item;
                    }
                  },
                );
                LkpCompanyRowtemp.push(LkpCompanyInsertedRows);
              }
            }
  
            const LkpJobfilteredData = response.data.response.data.filter(
              item => {
                return item.tableName == 'LkpJob';
              },
            );

            var LkpJobcolumns = LkpJobfilteredData.map(
              item => item.columns,
            )[0];
            var LkpJobInsertedArr = LkpJobfilteredData.map(
              item => item.insertedRows,
            )[0];
            var LkpJobupdatedArr = LkpJobfilteredData.map(
              item => item.updatedRows,
            )[0];
            var LkpJobDeletedArr = LkpJobfilteredData.map(
              item => item.deletedRows,
            )[0];
  
            let LkpJobRowtemp = [];
            if (LkpJobInsertedArr) {
              for (let i = 0; i < LkpJobInsertedArr.length; i++) {
                let LkpJobInsertedRows = LkpJobInsertedArr[i].map(
                  item => {
                    if (item === '') {
                      return null;
                    } else {
                      return item;
                    }
                  },
                );
                LkpJobRowtemp.push(LkpJobInsertedRows);
              }
            }
          //Insert Cloud Record
          db.transaction(txn => {
            const existingTimesheetIds = [];
            const existingTimesheetEmployeeIds = [];
            const existingTimesheetCompanyIds = [];
            const existingTimesheetJobIds = [];
            const existingTimesheetPhaseCodeIds = [];
            const existingUserIds = [];
            const existingEmployeeIds = [];
            const existingCompanyIds = [];
            const existingJobIds = [];
            txn.executeSql(
              'SELECT TimesheetID FROM Timesheet',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingTimesheetIds.push(rows.item(i).TimesheetID);
                }

                const filteredArray = TimesheetRowtemp.filter(
                  record => !existingTimesheetIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  const dateObj = new Date(item[2]);
                  // format the date as YYYY-MM-DD
                  const outputDate = moment.utc(dateObj).format('MM/DD/YYYY');
                  txn.executeSql(
                    `INSERT INTO Timesheet (${Timesheetcolumns.slice(
                      0,
                      -2,
                    ).toString()}) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?);`,
                    [
                      item[0],
                      item[1],
                      outputDate.toString(),
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                      item[8],
                      item[9],
                      item[10],
                      item[11],
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'Timesheet Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      // console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );
            txn.executeSql(
              'SELECT TimesheetEmployeeID FROM TimesheetEmployee',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingTimesheetEmployeeIds.push(
                    rows.item(i).TimesheetEmployeeID,
                  );
                }

                const filteredArray = TimesheetEmployeeRowtemp.filter(
                  record => !existingTimesheetEmployeeIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  TimesheetEmployee (${TimesheetEmployeecolumns.slice(
                      0,
                      -2,
                    ).toString()})VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?)`,
                    [
                      item[0],
                      item[1],
                      item[2],
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                      item[8],
                      item[9],
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'TimesheetEmployee Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      //  console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );

            txn.executeSql(
              'SELECT TimesheetCompanyID FROM TimesheetCompany',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingTimesheetCompanyIds.push(
                    rows.item(i).TimesheetCompanyID,
                  );
                }

                const filteredArray = TimesheetCompanyRowtemp.filter(
                  record => !existingTimesheetCompanyIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  TimesheetCompany (${TimesheetCompanycolumns.slice(
                      0,
                      -2,
                    ).toString()}) VALUES (?, ?, ?, ?, ?, ?,?)`,
                    [
                      item[0],
                      item[1],
                      item[2],
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'TimesheetCompany Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      // console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );

            txn.executeSql(
              'SELECT TimesheetJobID FROM TimesheetJob',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingTimesheetJobIds.push(rows.item(i).TimesheetJobID);
                }

                const filteredArray = TimesheetJobRowtemp.filter(
                  record => !existingTimesheetJobIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  const formattedDate = moment(item[3]).format('MM/DD/YYYY');
                  txn.executeSql(
                    `INSERT INTO  TimesheetJob (${TimesheetJobcolumns.slice(
                      0,
                      -2,
                    ).toString()}) VALUES (?, ?, ?, ?, ?, ?,?,?)`,
                    [
                      item[0],
                      item[1],
                      item[2],
                      item[3] == null ? item[3] : formattedDate,
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'TimesheetJob Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      // console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );
            txn.executeSql(
              'SELECT TimesheetPhaseCodeID FROM TimesheetPhaseCode',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingTimesheetPhaseCodeIds.push(
                    rows.item(i).TimesheetPhaseCodeID,
                  );
                }

                const filteredArray = TimesheetPhaseCodeRowtemp.filter(
                  record => !existingTimesheetPhaseCodeIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  TimesheetPhaseCode (${TimesheetPhaseCodecolumns.slice(
                      0,
                      -2,
                    ).toString()}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?)`,
                    [
                      item[0],
                      item[1],
                      item[2],
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                      item[8],
                      item[9],
                      item[10],
                      item[11],
                      item[12],
                      item[13],
                      item[14],
                      item[15],
                      item[16],
                      item[17],
                      item[18],
                      item[19],
                      item[20],
                      item[21],
                      item[22],
                      item[23],
                      item[24] == 'null' ? null : item[24],
                      item[25],
                      item[26],
                      item[27],
                      item[28],
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'TimesheetJob Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      //  console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.log('Error executing SELECT query:', error);
              },
            );

            txn.executeSql(
              'SELECT UserID FROM User',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingUserIds.push(
                    rows.item(i).UserID,
                  );
                }

                const filteredArray = UserRowtemp.filter(
                  record => !existingUserIds.includes(record[0]),
                ); 
                
                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  User (${Usercolumns.slice(
                      0,
                      -2,
                    ).toString()})VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?)`,
                    [
                      item[0],
                      item[1],
                      item[2].toString(),
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                      item[8],
                      item[9],
                      item[10],
                      item[11],
                      item[12]
                    ],
                    (_, resultSet) => {
                      // console.log(
                      //   'User Record inserted successfully',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      //  console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );
            txn.executeSql(
              'SELECT EmployeeID FROM Employee',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingEmployeeIds.push(
                    rows.item(i).EmployeeID,
                  );
                }

                const filteredArray = EmployeeRowtemp.filter(
                  record => !existingEmployeeIds.includes(record[0]),
                ); 
              
                filteredArray.forEach(item => {   
                  txn.executeSql(
                    `INSERT INTO  Employee (${Employeecolumns.slice(0,-2).toString()})VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?, ?, ?, ?, ?, ?,?, ?, ?)`,
                    [
                      item[0],
                      item[1],
                      item[2],
                      item[3],
                      item[4],
                      item[5],
                      item[6],
                      item[7],
                      item[8],
                      item[9],
                      item[10],
                      item[11],
                      item[12],
                      item[13],
                      item[14],
                      item[15],
                      item[16],
                      item[17],
                      item[18],
                      item[19],
                      item[20],
                      item[21]  
                    ],
                    (_, resultSet) => {
                      console.log(
                        'Employee Record inserted successfully',
                        resultSet,
                      );
                    },
                    (_, error) => {
                      //  console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );
            txn.executeSql(
              'SELECT CompanyID FROM LkpCompany',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingCompanyIds.push(rows.item(i).CompanyID);
                }
                 
                const filteredArray = LkpCompanyRowtemp.filter(
                  record => !existingCompanyIds.includes(record[0]),
                );

                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  LkpCompany (${LkpCompanycolumns.slice(
                      0,
                      -2,
                    ).toString()}) VALUES (?, ?, ?, ?)`,
                    [item[0], item[1], item[2], item[3]],
                    (_, resultSet) => {
                      // console.log(
                      //   '--------------------------',
                      //   resultSet,
                      // );
                    },
                    (_, error) => {
                      // console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );

            txn.executeSql(
              'SELECT CompanyID FROM LkpJob',
              [],
              (_, resultSet) => {
                const rows = resultSet.rows;

                for (let i = 0; i < rows.length; i++) {
                  existingJobIds.push(rows.item(i).JobID);
                }
             
                const filteredArray = LkpJobRowtemp.filter(
                  record => !existingJobIds.includes(record[0]),
                );
              
                filteredArray.forEach(item => {
                  txn.executeSql(
                    `INSERT INTO  LkpJob (${LkpJobcolumns.slice(
                      0,
                      -2,
                      ).toString()}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?,?)`,
                      [
                        item[0],
                        item[1],
                        item[2],
                        item[3],
                        item[4],
                        item[5],
                        item[6],
                        item[7],
                        item[8],
                        item[9],
                        item[10],
                        item[11],
                        item[12],
                        item[13],
                        item[14],
                        item[15],
                        item[16],
                        item[17],
                        item[18],
                        item[19],
                        item[20],
                        item[21],
                        item[22],
                        item[23],
                        item[24],
                        item[25],
                        item[26],
                        item[27],
                        item[28],
                        item[29],
                        item[30] 
                      ],
                        
                    (_, resultSet) => {
                      console.log(
                        "lkpjob",
                        resultSet,
                      );
                    },
                    (_, error) => {
                      // console.log('Error executing insert query:', error);
                    },
                  );
                });
              },
              (_, error) => {
                console.error('Error executing SELECT query:', error);
              },
            );
          });

          //Update Cloud Record
          db.transaction(txn => {
            if (TimesheetUpdatedArr != null) {
              TimesheetUpdatedArr.map(item => {
                txn.executeSql(
                  `update Timesheet set ${item[1]} = '${
                    item[2]
                  }'  WHERE TimesheetID ='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' Timesheet', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetEmployeeupdatedArr != null) {
              TimesheetEmployeeupdatedArr.map(item => {
                txn.executeSql(
                  `update TimesheetEmployee set ${item[1]} = '${
                    item[2]
                  }'  WHERE TimesheetEmployeeID =
            '${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' TimesheetEmployee', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetCompanyupdatedArr != null) {
              TimesheetCompanyupdatedArr.map(item => {
                txn.executeSql(
                  `update TimesheetCompany set ${item[1]} = '${
                    item[2]
                  }'  WHERE TimesheetCompanyID =
            '${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' TimesheetCompany', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetJobupdatedArr != null) {
              TimesheetJobupdatedArr.map(item => {
                txn.executeSql(
                  `update TimesheetJob set ${item[1]} = '${
                    item[2]
                  }'  WHERE TimesheetJobID =
            '${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //    console.log(' TimesheetJob', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetPhaseCodeupdatedArr != null) {
              TimesheetPhaseCodeupdatedArr.map(item => {
                txn.executeSql(
                  `update TimesheetPhaseCode set ${item[1]} = '${
                    item[2]
                  }'  WHERE TimesheetPhaseCodeID =
            '${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' TimesheetPhaseCode', res.rowsAffected);
                  },
                );
              });
            }

            if (UserupdatedArr != null) {
              UserupdatedArr.map(item => {
                txn.executeSql(
                  `update User set ${item[1]} = '${item[2]}'  WHERE UserID ='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' User', res.rowsAffected);
                  },
                );
              });
            }
            if (EmployeeupdatedArrupdatedArr != null) {
              EmployeeupdatedArr.map(item => {
                txn.executeSql(
                  `update Employee set ${item[1]} = '${item[2]}'  WHERE EmployeeID ='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' Employee', res.rowsAffected);
                  },
                );
              });
            }

            if (LkpCompanyupdatedArr != null) {
              LkpCompanyupdatedArr.map(item => {
                txn.executeSql(
                  `update  LkpCompany set ${item[1]} = '${item[2]}'  WHERE CompanyID ='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //console.log(' Employee', res.rowsAffected);
                  },
                );
              });
            }

            if (LkpJobupdatedArr != null) {
              LkpJobupdatedArr.map(item => {
                txn.executeSql(
                  `update  LkpJob set ${item[1]} = '${item[2]}'  WHERE JobID ='${item[0]}'`,
                  [],
                  async function (tx, res) {
                 //   console.log(' LkpJob', res.rowsAffected);
                  },
                );
              });
            }
          });
          // Delete Cloud Record

          db.transaction(txn => {
            if (TimesheetPhaseCodeDeletedArr != null) {
              TimesheetPhaseCodeDeletedArr.map(item => {
                txn.executeSql(
                  `delete from  TimesheetPhaseCode where  TimesheetPhaseCodeID='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //   console.log('  TimesheetPhaseCode', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetJobDeletetedArr != null) {
              TimesheetJobDeletetedArr.map(item => {
                txn.executeSql(
                  `delete from  TimesheetJob where TimesheetJobID='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //  console.log('  TimesheetJob', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetCompanyDeletedArr != null) {
              TimesheetCompanyDeletedArr.map(item => {
                txn.executeSql(
                  `delete from TimesheetCompany where TimesheetCompanyID='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' TimesheetCompany', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetEmployeeDeletedArr != null) {
              TimesheetEmployeeDeletedArr.map(item => {
                txn.executeSql(
                  `delete from TimesheetEmployee where TimesheetEmployeeID='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    // console.log(' TimesheetEmployee', res.rowsAffected);
                  },
                );
              });
            }
            if (TimesheetDeletedArr != null) {
              TimesheetDeletedArr.map(item => {
                txn.executeSql(
                  `delete from Timesheet where TimesheetID='${item[0].toLowerCase()}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' Timesheet', res.rowsAffected);
                  },
                );
              });
            }

            if (UserDeletedArr != null) {
              UserDeletedArr.map(item => {
                txn.executeSql(
                  `delete from User where UserID='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' Timesheet', res.rowsAffected);
                  },
                );
              });
            }
            if (EmployeeDeletedArr != null) {
              EmployeeDeletedArr.map(item => {
                txn.executeSql(
                  `delete from Employee where EmployeeID='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' Timesheet', res.rowsAffected);
                  },
                );
              });
            }
            if (LkpCompanyDeletedArr != null) {
              LkpCompanyDeletedArr.map(item => {
                txn.executeSql(
                  `delete from LkpCompany where CompanyID='${item[0]}'`,
                  [],
                  async function (tx, res) {
                    //  console.log(' Timesheet', res.rowsAffected);
                  },
                );
              });
            }
          });
          Dispatch(callFunctionAction(called));
        }
      })
      .catch(error => {
        //console.error("error",error);
        setData(null);
      });
  };
};

export default SynchData;
