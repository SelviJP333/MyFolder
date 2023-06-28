import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Datepickpopup from '../Components/Datepickpopup';
import {TextInput} from 'react-native-gesture-handler';
import Create_Timesheet from '../Components/CreateTimesheet';
import db from '../constants/db';
import color from '../constants/color';

const RemoveEmployee = ({setModalVisible, RemoveEmploye, username}) => {
  const [SlideDates, setSlideDates] = useState([]);
  const [DefaultDate, setDefaultDate] = useState('');
  const [SelectedDate, setSelectedDate] = useState('');
  const [created_data, setCreated_Data] = useState([]);
  const [GetDate, setGetDate] = useState('');
  const [InitialSelectDate, setInitialSelectDate] = useState('');
  const [Usernamelist, setUsernamelist] = useState([]);

  const offset = useSharedValue(-100);
  ///Yes Or No Popup//////////////
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const [isDateModalVisible, setDateModalVisible] = useState(false);

  //   function Combined() {
  //     setDateModalVisible(true);
  //     //  setShowDate(false);
  //   }

  function Cancel() {
    setModalVisible(false);
    offset.value = withSpring(-250);
  }
  //   const RemoveEmployee = () => {
  //     let selectedusername = Usernamelist[indexvalue];

  //     // Alert.alert('Are You Sure Want To Remove', `${selectedusername}`, [
  //     //   {
  //     //     text: 'Cancel',
  //     //     onPress: () => 
  //     //     style: 'cancel',
  //     //   },

  //           // if redux have more than user

  //           Insert_Employee(selectedusername);
  //           if (
  //             getUser.count.data.length > 1 ||
  //             getUser.count.data.length === 1
  //           ) {
  //             const myPromise = new Promise((resolve, reject) => {
  //               let selectedusername = Usernamelist[indexvalue];
  //               let obj = {};
  //               obj[selectedusername] = TableData;

  //               dispatch(AddData(obj));
  //               dispatch(Temp_Add(obj));
  //               resolve('foo');
  //             }).then(async () => {
  //               // if we remove first employeee
  //               if (indexvalue === 0) {
  //                 dispatch(RemoveData(selectedusername));
  //                 dispatch(Temp_Remove(selectedusername));

  //                 // remove member from userlist
  //                 let removed = Usernamelist.filter(e => e !== selectedusername);
  //                 // 
  //                 setUsernamelist([...removed]);
  //                 setindexvalue(0);

  //                 let currentname = Usernamelist[indexvalue + 1];
  //                 // 
  //                 let filterddd = getUser.count.data.find(e => {
  //                   return Object.keys(e)[0] === currentname;
  //                 });

  //                 // if reset tabledata if no user selected
  //                 getUser.count.data.length === 1
  //                   ? setTableData([])
  //                   : setTableData(filterddd[Object.keys(filterddd)[0]]);
  //                 // remove all total counts
  //                 if (getUser.count.data.length === 1) {
  //                   // Insert_Employee(selectedusername)
  //                   setTableData([]);
  //                   settotal_RegularTime(0);
  //                   settotal_Overtime(0);
  //                   settotal_DBL(0);

  //                   settotalgroup1({
  //                     reg1: 0,
  //                     ovt1: 0,
  //                     dbl1: 0,
  //                   });
  //                   settotalgroup2({
  //                     reg2: 0,
  //                     ovt2: 0,
  //                     dbl2: 0,
  //                   });
  //                   settotalgroup3({
  //                     reg3: 0,
  //                     ovt3: 0,
  //                     dbl3: 0,
  //                   });
  //                   settotalgroup4({
  //                     reg4: 0,
  //                     ovt4: 0,
  //                     dbl4: 0,
  //                   });
  //                   settotalgroup5({
  //                     reg5: 0,
  //                     ovt5: 0,
  //                     dbl5: 0,
  //                   });
  //                   settotalgroup6({
  //                     reg6: 0,
  //                     ovt6: 0,
  //                     dbl6: 0,
  //                   });
  //                   settotalgroup7({
  //                     reg7: 0,
  //                     ovt7: 0,
  //                     dbl7: 0,
  //                   });
  //                 }
  //               }
  //               // if we remove employee other than first employee
  //               else {
  //                 // Setselected_Employee_Id
  //                 // 
  //                 // Insert_Employee(selectedusername)
  //                 dispatch(RemoveData(selectedusername));
  //                 dispatch(Temp_Remove(selectedusername));

  //                 let removed = Usernamelist.filter(e => e !== selectedusername);
  //                 
  //                 setUsernamelist([...removed]);
  //                 setindexvalue(prev => prev - 1);

  //                 let currentname = Usernamelist[indexvalue - 1];

  //                 let filterddd = getUser.count.data.find(e => {
  //                   return Object.keys(e)[0] === currentname;
  //                 });

  //                 setTableData(filterddd[Object.keys(filterddd)[0]]);
  //                 settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
  //                 settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
  //                 settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
  //               }
  //             });
  //           }
  //           // if redux have only one user
  //           else {
  //             // if redux have only one user and index not zero
  //             if (getUser.count.data.length === 1 && indexvalue !== 0) {
  //               const myPromise = new Promise((resolve, reject) => {
  //                 let selectedusername = Usernamelist[indexvalue];
  //                 let obj = {};
  //                 obj[selectedusername] = TableData;
  //                 dispatch(AddData(obj));
  //                 dispatch(Temp_Add(obj));
  //                 resolve('foo');
  //               }).then(async () => {
  //                 // Insert_Employee(selectedusername)
  //                 dispatch(RemoveData(selectedusername));
  //                 dispatch(Temp_Remove(selectedusername));

  //                 let removed = Usernamelist.filter(e => e !== selectedusername);
  //                 
  //                 setUsernamelist([...removed]);
  //                 setindexvalue(prev => prev - 1);
  //                 2;
  //                 let currentname = Usernamelist[indexvalue - 1];

  //                 let filterddd = getUser.count.data.find(e => {
  //                   return Object.keys(e)[0] === currentname;
  //                 });

  //                 setTableData(filterddd[Object.keys(filterddd)[0]]);
  //                 settotal_Overtime(filterddd[Object.keys(filterddd)[2]]);
  //                 settotal_DBL(filterddd[Object.keys(filterddd)[1]]);
  //                 settotal_RegularTime(filterddd[Object.keys(filterddd)[3]]);
  //               });
  //             }
  //             // if redux have only one user and index  zero
  //             else if (indexvalue === 0) {
  //               let removed = Usernamelist.filter(e => e !== selectedusername);

  //               // Insert_Employee(selectedusername)
  //               setUsernamelist([...removed]);
  //               setindexvalue(0);
  //               setTableData([]);
  //             }
  //           }

  //     // ]);
  //   };

  useEffect(() => {
    // Get the current date
    offset.value = withSpring(15);
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: offset.value}],
    };
  });

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
              width: '75%',
              height: '38%',
              borderRadius: 0,
              marginBottom: '40%',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                height: '30%',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  color: '#1b386a',
                  fontSize: 25,
                  fontWeight: '800',
                  textAlign: 'center',
                  // left: 15,
                }}>
                Remove Employee
              </Text>
              <View
                style={{
                  display: 'flex',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  width: '35%',
                  paddingEnd: '3%',
                }}>
                <View>
                  <TouchableOpacity>
                    <Text onPress={() => Cancel()} style={{color: '#000'}}>
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: 23,
                top: 10,
                padding: 20,
              }}>
              Are you sure you want to delete the Employee{' '}
              <Text style={{fontWeight: '900', color: '#000100'}}>
                {username}
              </Text>
              . This action cannot be undone
            </Text>
            <View
              style={{
                top: '10%',
              }}>
              <TouchableOpacity
                onPress={() => RemoveEmploye()}
                style={{
                  backgroundColor: '#113467',
                  height: 50,
                  padding: 10,
                  width: '22%',
                  left: '28%',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  Yes{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Cancel()}
                style={{
                  backgroundColor: 'grey',
                  height: 50,
                  padding: 10,
                  width: '23%',
                  left: '53%',
                  bottom: 50,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default RemoveEmployee;

const styles = StyleSheet.create({
  touch: {
    backgroundColor: '#1b386a',
    paddingTop: 10,
    width: '90%',
    // marginTop: 30,
    // zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    top: 120,
    height: 60,
    // left: 110,
  },

  SlideinputStyle: {
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderColor: '#E8E8E8',
    width: '50%',
  },
});
