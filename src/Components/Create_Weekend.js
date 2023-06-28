import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  log,
} from 'react-native-reanimated';
import AlertPopup from '../Components/AlertPopup';
import moment from 'moment';
import CurrentUTCTime from '../constants/CurrentUTCTime';
import Datepickpopup from '../Components/Datepickpopup';
import Create_Timesheet from '../Components/CreateTimesheet';
import db from '../constants/db';

const Create_Weekend = ({navigation, setModalVisible, setshowDatas}) => {
  const [SlideDates, setSlideDates] = useState([]);
  const [DefaultDate, setDefaultDate] = useState('');
  const [SelectedDate, setSelectedDate] = useState('');
  const [created_data, setCreated_Data] = useState([]);
  const [GetDate, setGetDate] = useState('');
  const [InitialSelectDate, setInitialSelectDate] = useState('');
  const [Check, setCheck] = useState(false);

  const offset = useSharedValue(-100);
  var sun = [];
  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  ///Yes Or No Popup//////////////
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const toggleModal = () => {
    let selected = new Date(SelectedDate);
    let futureDate = new Date(selected.getTime() + 3 * 24 * 60 * 60 * 1000);
    let date = new Date();

    if (futureDate < date) {
      return alert('Date not available');
    }
    // output the new date object

    setCreateModalVisible(!isCreateModalVisible);
    // setSelectedDate(SelectedDate)
    setGetDate(GetDate);
  };

  const [isDateModalVisible, setDateModalVisible] = useState(false);

  const DateModal = () => {
    setDateModalVisible(!isDateModalVisible);
    setSelectedDate(false);
  };

  function Combined() {
    setDateModalVisible(true);
    //  setShowDate(false);
  }

  function Cancel() {
    setModalVisible(false);
    offset.value = withSpring(-250);
  }

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

  const NavigateTimescreen = async () => {
    // Compare Weekenddate with selected date
    let Timesheet_Dates = created_data;
    let Select_Date = SelectedDate;
    //
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
      setCreateModalVisible(false);
    } else if (TimesheetCreate != true) {
      navigation.navigate('TimeSheetScreen', {
        paramKey: SelectedDate,
      });

      setSelectedDate('');
      setModalVisible(false);
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
    for (let i = 0; i < 1; i++) {
      const sunday = new Date(startOfWeek);

      sunday.setDate(sunday.getDate() - 1 * 7);
      pastSundays.push(sunday);
    }

    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};

    const formattedPastSundays = pastSundays.map(pastSundays => {
      const date = new Date(pastSundays);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      return formattedDate;
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
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      return formattedDate;
    });

    const date1 = new Date(presentSunday);
    const day1 = String(date1.getDate()).padStart(2, '0');
    const month1 = String(date1.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based
    const year1 = date1.getFullYear();
    const sundaynow = `${month1}/${day1}/${year1}`;

    const allSundays = formattedPastSundays.concat(
      sundaynow,
      formattedfutureSundays,
    );

    allSundays.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    today.setDate(today.getDate() - 1);
    let Today = new Date(today).toLocaleDateString('en-US', options);

    let Finalized = allSundays.filter(e => {
      if (e >= Today) return e;
    });
    //Finalized = allSundays.map(eee => moment(eee).format('MM/DD/YYYY'));
    // Finalized = allSundays.map(eee =>
    //   moment(new Date(eee)).format('MM/DD/YYYY'),
    // );

    console.log('Finalized', Finalized);
    setSelectedDate(moment(presentSunday).format('MM/DD/YYYY'));
    setSlideDates(Finalized.slice(0, 4));

    // setSelectedDate(presentSunday.toLocaleDateString('en-US', options));

    setInitialSelectDate(Finalized.slice(0, 1).toString());

    offset.value = withSpring(15);

    getWeekEndDates();
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
        {isCreateModalVisible ? (
          <Create_Timesheet
            selected_Date={SelectedDate}
            navigation={navigation}
            NavigateTimescreen={NavigateTimescreen}
            setCreateModalVisible={setCreateModalVisible}
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
                  left: 15,
                }}>
                Create New Timesheet
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
            <View>
              <Text
                style={{
                  fontSize: 20,
                  top: 40,
                  textAlign: 'center',
                  right: 150,
                  color: 'gray',
                }}>
                Date (Week Ending) :
              </Text>

              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() => Combined()}
                  style={{
                    backgroundColor: '#fff',
                    width: '47%',
                    borderStartWidth: 7,
                    borderColor: 'lightgray',
                    left: '48%',
                    height: 60,
                    // left: 135,
                  }}>
                  <View
                    style={{
                      left: 15,

                      top: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,

                        fontWeight: '400',
                      }}>
                      {SelectedDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={toggleModal} style={styles.touch}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 20,
                    alignItems: 'center',
                  }}>
                  Create Timesheet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        {Check ? (
          <AlertPopup
            Check={Check}
            setCreateModalVisible={setCreateModalVisible}
            setCheck={setCheck}
            buttontext={'close'}
            headtext={'Create Timesheet'}
            text={`Week Ending date ${SelectedDate} already created. Select another week ending date`}
          />
        ) : null}
      </SafeAreaView>
    </>
  );
};

export default Create_Weekend;
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
