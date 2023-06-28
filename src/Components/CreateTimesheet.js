import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import db from '../constants/db';

const Create_Timesheet = ({
  navigation,
  setCreateModalVisible,
  props1,
  selected_Date,
  NavigateTimescreen,
}) => {
  // Get WeekEndDates from Timesheet table
  const [SlideDates, setSlideDates] = useState([]);
  // const [SelectedDate, setSelectedDate] = useState("");
  const [created_data, setCreated_Data] = useState([]);
  var sun = [];
  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  const getWeekEndDates = async () => {
    let Userid = await AsyncStorage.getItem('Userid');
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
    getWeekEndDates();
    var d = new Date();

    var getnextmonth = daysInMonth(d.getMonth() + 1, d.getFullYear());

    var getTot = daysInMonth(d.getMonth(), d.getFullYear());

    for (var i = 1; i <= getTot; i++) {
      var newDate = new Date(d.getFullYear(), d.getMonth(), i);
      if (newDate.getDay() == 0) {
        parseInt(d.getMonth());

        let month = d.getMonth();
        sun.push('' + i + '/' + (month + 1) + '/' + d.getFullYear() + '');
      }
    }

    for (var i = 1; i <= getnextmonth; i++) {
      var newDate = new Date(d.getFullYear(), d.getMonth() + 1, i);
      if (newDate.getDay() == 0) {
        parseInt(d.getMonth());
        let month = d.getMonth() + 1;
        sun.push('' + i + '/' + (month + 1) + '/' + d.getFullYear() + '');
      }
    }

    let newArray = sun.map(item => {
      return {key: item, value: item};
    });

    setSlideDates(sun);
  }, []);

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
        <View style={styles.EmployeeContainer}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              height: '30%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View style={{marginLeft: 10}}>
                <Image source={require('../Image/question.png')} />
              </View>
              <View>
                <Text
                  style={{color: '#1b386a', fontWeight: 'bold', fontSize: 20}}>
                  Create Timesheet
                </Text>
              </View>
              <View>
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
                      <Text
                        onPress={() => setCreateModalVisible(false)}
                        style={{color: '#000'}}>
                        X
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text style={{fontSize: 20, textAlign: 'left', left: 15, top: 15}}>
            Are you sure you would like to create a new empty timesheet?{' '}
          </Text>

          <View
            style={{
              top: '20%',
            }}>
            <TouchableOpacity
              onPress={NavigateTimescreen}
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
              onPress={() => setCreateModalVisible(false)}
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
      </SafeAreaView>
    </>
  );
};

export default Create_Timesheet;
const styles = StyleSheet.create({
  touch: {
    backgroundColor: '#1b386a',
    padding: 10,
    width: '100%',
    marginTop: 30,
    zIndex: -1,
    position: 'absolute',
    bottom: 0,
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
  EmployeeContainer: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#cbe91e',
    width: '60%',
    height: '30%',
    position: 'absolute',
    top: 1,
  },
});
