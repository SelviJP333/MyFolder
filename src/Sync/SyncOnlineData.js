import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import db from '../constants/db';
import SynchData from './SynchData';
import SynchInsertData from './SynchInsertData';
import SynchUpdateData from './SynchUpdateData';
import SynchDeleteData from './SynchDeleteData';
const SyncOnlineData = ({load}) => {
  const [aInsertTable, setaInsertTable] = useState([]);
  const [aUpdateTable, setaUpdateTable] = useState([]);
  const [aDeleteTable, setaDeleteTable] = useState([]);
  const [aTable, setaTable] = useState([]);
  let TableList = [
    'Timesheet',
    'TimesheetEmployee',
    'TimesheetCompany',
    'TimesheetJob',
    'TimesheetPhaseCode',
  ];
  const [aInsertData, setaInsertData] = useState([]);
  const [aUpdateData, setaUpdateData] = useState([]);
  const [aDeleteData, setaDeleteData] = useState([]);
  const [data, setData] = useState('');
  const intervalRef = useRef(null);
  useEffect(() => {
    const callback = () => {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          let user_id = await AsyncStorage.getItem('SubmitUserID');
          if (user_id != null) {
            handleInsertUpdateDeleteData();
            if (data) {
              RepeatFuntion();
            }
          }
        }
      });
      // Call the next iteration after 30 second
      intervalRef.current = setTimeout(callback, 30000);
    };

    // Start the first iteration after 15 second
    intervalRef.current = setTimeout(callback, 20000);

    return () => {
      // Clean up by clearing the timeout when the component unmounts
      clearTimeout(intervalRef.current);
    };
  }, [data]); // Empty dependency array to run the effect only once

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     NetInfo.fetch().then(async state => {
  //       if (state.isConnected) {
  //         let user_id = await AsyncStorage.getItem('SubmitUserID');
  //         if (user_id != null) {
  //           handleInsertUpdateDeleteData();
  //           if (data) {
  //             RepeatFuntion();
  //           }
  //         }
  //       }
  //     });
  //   }, 6000); // 1 minutes interval in milliseconds

  //   return () => {
  //     clearInterval(interval); // Clean up the interval on component unmount
  //   };
  // }, []);

  useEffect(() => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        let user_id = await AsyncStorage.getItem('SubmitUserID');
        if (user_id != null) {
          RepeatFuntion();
        }
      }
    });
  }, []);
  useEffect(() => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        let user_id = await AsyncStorage.getItem('SubmitUserID');
        if (user_id != null) {
          if (load) {
            handleInsertUpdateDeleteData();
          }
        }
      }
    });
  }, [load]);
  const RepeatFuntion = () => {
    let aInsertedRows = [];
    let newArray = {
      TableName: 'Timesheet',
      Columns: [
        [
          'RowID',
          'DateTime',
          'DataSynchID',
          'FinalizedByUserID',
          'StatusID',
          'UpdatedBy',
          'CreatedOn',
          'DataLogDateTime',
          'UpdatedOn',
          'WeekEndDate',
          'SubmittedBy',
          'CopiedFromTimesheetID',
          'ReviewDateTime',
          'SubmittedOn',
          'CreatedBy',
          'TimesheetID',
          'TableName',
        ],
      ],
      InsertedRows: [],
      UpdatedRows: [],
      DeletedRows: [],
    };

    aInsertedRows.push(newArray);
    setaTable(aInsertedRows);
  };

  const handleInsertUpdateDeleteData = () => {
    let aColumns1 = [];
    let aColumns2 = [];
    let aColumns3 = [];
    let aInsertedRows = [];
    let aUpdatedRows = [];
    let aDeletedRows = [];
    db.transaction(txn => {
      let key1 = [];
      let key2 = [];
      let key3 = [];
      let newArray1 = [];
      let newArray2 = [];
      let newArray3 = [];
      let aDatalist1 = [];
      let aDatalist2 = [];
      let aDatalist3 = [];
      for (let i = 0; i < TableList.length; i++) {
        txn.executeSql(
          `SELECT * FROM (SELECT *, t2.DateTime AS DataLogDateTime FROM ${TableList[i]} t INNER JOIN (SELECT DataLogID as DataSynchID, RowID, DateTime
                FROM DeviceSynchDataLog WHERE Action = 'I'  AND IsObsolete = 0  ) t2  ON t.${TableList[i]}ID = t2.RowID) c ORDER BY DataSynchID`,
          [],
          async function (tx, res) {
            if (res.rows.item(0) != undefined) {
              for (let j = 0; j < res.rows.length; j++) {
                res.rows.item(j).TableName = TableList[i];
                if (res.rows.item(j).TableName == 'TimesheetPhaseCode') {
                  delete res.rows.item(j).Total_Reg;
                  delete res.rows.item(j).Total_Ot;
                  delete res.rows.item(j).Total_Dbl;
                }

                aDatalist1.push(res.rows.item(j));
                key1.push(Object.values(res.rows.item(j)));
                aColumns1.push(Object.keys(res.rows.item(j)));
              }
              newArray1 = {
                TableName: TableList[i],
                Columns: aColumns1,
                InsertedRows: key1,
                UpdatedRows: [],
                DeletedRows: [],
              };

              aInsertedRows.push(newArray1);
              key1 = [];
              aColumns1 = [];
              setaInsertTable(aInsertedRows);
              setaInsertData(aDatalist1);
            }
            txn.executeSql(
              `SELECT  RowID AS ${TableList[i]}ID, ColumnName,ColumnValue, DateTime AS DataLogDateTime ,DataLogID as DataSynchID,RowID FROM DeviceSynchDataLog WHERE Action = 'U' AND TableName ='${TableList[i]}' AND IsObsolete = 0 AND SynchedDateTime = 0   
                          AND RowID NOT IN (SELECT RowID FROM DeviceSynchDataLog WHERE Action IN('I', 'D') AND TableName = '${TableList[i]}' AND SynchedDateTime = 0)`,
              [],
              async function (tx, res) {
                if (res.rows.item(0) != undefined) {
                  for (let j = 0; j < res.rows.length; j++) {
                    var FilterData = {
                      [TableList[i] + 'ID']: res.rows.item(j).RowID,
                      ColumnName: res.rows.item(j).ColumnName,
                      ColumnValue: res.rows.item(j).ColumnValue,
                      DataLogDateTime: res.rows.item(j).DataLogDateTime,
                      DataSynchID: res.rows.item(j).DataSynchID,
                    };
                    key2.push(Object.values(FilterData));
                    aColumns2.push(Object.keys(FilterData));
                    aDatalist2.push(res.rows.item(j));
                  }
                  newArray2 = {
                    TableName: TableList[i],
                    Columns: aColumns2,
                    InsertedRows: [],
                    UpdatedRows: key2,
                    DeletedRows: [],
                  };
                  aUpdatedRows.push(newArray2);

                  key2 = [];
                  aColumns2 = [];
                  setaUpdateTable(aUpdatedRows);
                  setaUpdateData(aDatalist2);
                }
                txn.executeSql(
                  `SELECT  RowID as ${TableList[i]}ID,DataLogID as DataSynchID,   DateTime AS DataLogDateTime ,RowID  FROM DeviceSynchDataLog WHERE Action = 'D' AND TableName = "${TableList[i]}" AND IsObsolete = 0 AND SynchedDateTime = 0 
                      AND RowID NOT IN (SELECT RowID FROM DeviceSynchDataLog WHERE Action = 'I' AND TableName = "${TableList[i]}" AND SynchedDateTime = 0)ORDER BY DataSynchID DESC`,
                  [],
                  async function (tx, res) {
                    if (res.rows.item(0) != undefined) {
                      for (let j = 0; j < res.rows.length; j++) {
                        var FilterData = {
                          [TableList[i] + 'ID']: res.rows.item(j).RowID,
                          DataLogDateTime: res.rows.item(j).DataLogDateTime,
                          DataSynchID: res.rows.item(j).DataSynchID,
                        };
                        key3.push(Object.values(FilterData));
                        aColumns3.push(Object.keys(FilterData));
                        aDatalist3.push(res.rows.item(j));
                      }
                      newArray3 = {
                        TableName: TableList[i],
                        Columns: aColumns3,
                        InsertedRows: [],
                        UpdatedRows: [],
                        DeletedRows: key3,
                      };

                      aDeletedRows.push(newArray3);
                      key3 = [];
                      aColumns3 = [];
                      setaDeleteTable(aDeletedRows);
                      setaDeleteData(aDatalist3);
                    }

                    const combinedArray = [
                      ...aInsertedRows,
                      ...aUpdatedRows,
                      ...aDeletedRows,
                    ];
                    const combinedData = [
                      ...aDatalist1,
                      ...aDatalist2,
                      ...aDatalist3,
                    ];

                    // else if(Status==2){
                    //   setaTable(aUpdatedRows);
                    //   setaData(aDatalist2);
                    // }
                    // else if(Status==3){
                    //   setaTable(aDeletedRows);
                    //   setaData(aDatalist3);
                    // }
                  },
                );
              },
            );
          },
        );
      }
    });
  };

  return (
    <View>
      {aInsertData.length > 0 ? (
        <SynchInsertData
          aTable={aInsertTable}
          setaTable={setaInsertTable}
          setaData={setaInsertData}
          aData={aInsertData}
        />
      ) : null}
      {aTable.length > 0 ? (
        <SynchData
          aTable={aTable}
          setaTable={setaTable}
          data={data}
          setData={setData}
        />
      ) : null}
      {aUpdateData.length > 0 ? (
        <SynchUpdateData
          aTable={aUpdateTable}
          setaTable={setaUpdateTable}
          setaData={setaUpdateData}
          aData={aUpdateData}
        />
      ) : null}
      {aDeleteData.length > 0 ? (
        <SynchDeleteData
          aTable={aDeleteTable}
          setaTable={setaDeleteTable}
          setaData={setaDeleteData}
          aData={aDeleteData}
        />
      ) : null}
    </View>
  );
};

export default SyncOnlineData;
