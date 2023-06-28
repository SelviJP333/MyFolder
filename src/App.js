import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, AppState} from 'react-native';
import MyMenu from './Components/MyMenu';
import Synctime from './Sync/Synctime';
import color from './constants/color';
import db from './constants/db';
import EditTimeSheetScreen from './Screen/EditTimeSheetScreen';
import HomeScreen from './Screen/HomeScreen';
import LoginScreen from './Screen/LoginScreen';
import MyEwa from './Screen/MyEwa';
import Reports from './Screen/Reports';
import SplashScreen from './Screen/SplashScreen';
import TimeSheetScreen from './Screen/TimeSheetScreen';
import FinalizeReport from './Screen/FinalizeReport';
import ApproveTimesheet from './Screen/ApproveTimesheet';
import Approve_EditTimesheet from './Screen/Approve_EditTimesheet';
import Approve_Report from './Screen/Approve_Report';
import ViewApproved_Report from './Screen/ViewApproved_Report';
import Approve_ViewTimesheet from './Screen/Approve_ViewTimesheet';
import epochTime from './constants/epochTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncOnlineData from './Sync/SyncOnlineData';
import {useDispatch, useSelector} from 'react-redux';
import {createContext} from 'react';

export const Savefunc_Context = createContext();
const Stack = createNativeStackNavigator();

// Offline or Online Text at Footer

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function App() {
  const [save_function_pass, setsave_function_pass] = useState(false);
  React.useEffect(() => {
    db.transaction(txn => {
      // company
      txn.executeSql(`select * from Device`, [], async function (tx, res) {
        var temp = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        //console.log('temp', temp);
      });
    });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from User`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete   from User  where Userid=-5`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from Device`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from LkpTimesheetStatus`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from LkpCompany`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from LkpJob`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from LkpPhaseCode`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from DeviceSynchDataLog`, []);
    // });
    //  db.transaction(txn => {
    //   txn.executeSql(`delete from TempNetworkStatus`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from Timesheet`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from TimesheetEmployee`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from TimesheetCompany`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from TimesheetJob`, []);
    // });
    // db.transaction(txn => {
    //   txn.executeSql(`delete from Timesheetphasecode`, []);
    // });

    db.transaction(txn => {
      // company
      txn.executeSql(
        `select * from TimeSheetPhaseCode`,
        [],
        async function (tx, res) {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
            console.log('temp', temp);
          }
        },
      );
      job;
      txn.executeSql(`select * from User`, [], async function (tx, res) {
        var temp = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
      });
      phase;
      txn.executeSql(
        `select * from TimesheetPhaseCode`,
        [],
        async function (tx, res) {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
        },
      );
    });
    // DatabaseConfig();
  }, []);

  return (
    <>
      <Savefunc_Context.Provider
        value={{values: [save_function_pass, setsave_function_pass]}}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: color.white,
              },
              headerTintColor: color.bluefontcolor,
              headerTitleStyle: {
                fontWeight: '700',
              },
            }}>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              // Hiding header for Splash Screen
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="My TimeSheet"
              component={HomeScreen}
              options={({navigation, route}) => ({
                title: 'Timesheets',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => (
                  <MyMenu name={'mani'} navigation={navigation} />
                ),
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="EditTimeSheetScreen"
              component={EditTimeSheetScreen}
              options={({navigation, route}) => ({
                title: 'Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="TimeSheetScreen"
              component={TimeSheetScreen}
              options={({navigation, route}) => ({
                title: 'Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="MyEwa"
              component={MyEwa}
              options={({navigation, route}) => ({
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="FinalizeReport"
              component={FinalizeReport}
              options={({navigation, route}) => ({
                title: 'Finalize Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ApproveTimesheet"
              component={ApproveTimesheet}
              options={({navigation, route}) => ({
                title: 'Approve Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="Approve_EditTimesheet"
              component={Approve_EditTimesheet}
              options={({navigation, route}) => ({
                title: 'Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Approve_Report"
              component={Approve_Report}
              options={({navigation, route}) => ({
                title: 'Approve Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ViewApproved_Report"
              component={ViewApproved_Report}
              options={({navigation, route}) => ({
                title: 'View Approved Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Approve_ViewTimesheet"
              component={Approve_ViewTimesheet}
              options={({navigation, route}) => ({
                title: 'View Approved Timesheet',
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <MyMenu navigation={navigation} />,
                headerLeft: () => (
                  <TouchableOpacity>
                    <Image
                      source={require('./Image/logo.png')}
                      style={{
                        width: 200,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <SyncOnlineData />
        {/*Here is NetInfo to get device type*/}
        <Synctime />
      </Savefunc_Context.Provider>
    </>
  );
}

export default App;
