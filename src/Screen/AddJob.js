import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Pressable,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  AppRegistry,
  SectionList,
  Alert,
} from 'react-native';

import WarningPopup from '../Components/WarningPopup';
import color from '../constants/color';
const AddJob = ({
  setmodalJobVisible,
  setJobs,
  GetPhase,
  Jobs,
  handleAddRow,
  loading,
  GetJobs,
  SetSelectedJob,
  selectedcompanyname,
  companyIndex,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  let final = Jobs.filter(e => {
    if (typed_search === '') {
      if (e.status !== true) {
        return e;
      }
    } else if (
      e.value
        .split('*#^*')[1]
        .toLowerCase()
        .includes(typed_search.toLowerCase()) ||
      e.value
        .split('*#^*')[2]
        .toLowerCase()
        .includes(typed_search.toLowerCase())
    ) {
      if (e.status !== true) {
        return e;
      }
    }
  });

  const Add = () => {
    let SelectedJobname1 = [];
    let SelectedJobID = [];
    let splited = Jobs.filter(e => e.check === true && e.status === false).map(
      e => {
        SelectedJobID.push(e.ID);

        SelectedJobname1.push(e.value);
      },
    );
    if (SelectedJobID.length == 0) {
      setCheck(true);
    } else {
      SetSelectedJob(prev => [...prev, ...SelectedJobID]);
      handleAddRow(null, null, SelectedJobname1, SelectedJobID);
    }
  };
  const viewall_Job = () => {
    GetJobs(selectedcompanyname, companyIndex, 'View All');
  };

  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 45 * index,
    // offset: 49.3 * index,
    index,
  });
  const renderItem = item => {
    let splited = item.item.key.split('$$$');
    return (
      <TouchableHighlight
        activeOpacity={1}
        onPress={() => onValueChange(item, !item.item.check)}>
        <View style={styles.lists}>
          <View style={styles.checkbox2}></View>
          <View style={styles.checkbox}>
            {item.item.check ? (
              <Image
                source={require('../Image/checkboxtick.png')}
                style={{
                  width: 30,
                  height: 30,
                  //  right: 0, top: 0, left: 200
                }}
              />
            ) : null}
          </View>
          <View style={styles.labelbox}>
            <Text style={styles.labeltext}>
              {splited[2]}{' '}
              {splited[1].length > 45
                ? splited[1].substr(0, 45) + '...'
                : splited[1]}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const onValueChange = (item, item_check) => {
    const newdata = Jobs.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check};
      }

      return {...e};
    });

    setJobs(newdata);
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
        {Check ? (
          <WarningPopup
            Check={Check}
            setCheck={setCheck}
            text="Please select at least one Job"
          />
        ) : null}
        <View style={styles.EmployeeContainer}>
          {/* Job Search */}
          <View style={styles.EmployeeSearch}>
            <TextInput
              style={styles.EmployeeText}
              placeholder="Search Job..."
              placeholderTextColor={color.gray}
              onChangeText={text => settyped_search(text)}
            />
          </View>

          {loading == true ? (
            <View style={styles.loadingview}>
              <ActivityIndicator
                //visibility of Overlay Loading Spinner
                visible={loading}
                size="large"
                //Text style of the Spinner Text
                textStyle={styles.spinnerTextStyle}
              />
            </View>
          ) : (
            <View style={styles.EmployeeTotalContainer}>
              <FlatList
                data={final}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                getItemLayout={getItemLayout}
                ListEmptyComponent={() => (
                  <View style={styles.EmptyDiv}>
                    <Text style={{fontSize: 30}}>No Jobs</Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Bottom Container */}
          <View style={styles.EmployeeSubmitcontainer}>
            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity
                onPress={() => {
                  Add();
                }}>
                <Text style={styles.EmployeeSubmitText}>OK</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity onPress={() => viewall_Job()}>
                <Text style={styles.EmployeeSubmitText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    setmodalJobVisible(false);
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddJob;
const styles = StyleSheet.create({
  EmployeeContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: 350,
    position: 'absolute',
    top: 0,
  },
  EmployeeTotalContainer: {
    paddingBottom: 90,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  EmployeeLeftContainer: {
    // backgroundColor:'pink'
  },
  EmployeeRightContainer: {
    width: 500,
  },

  EmployeeSubmitcontainer: {
    width: '100%',
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  EmployeeSubmitTextContain: {
    marginRight: 40,
  },
  EmployeeSubmitText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#84d7d1',
  },
  EmployeeSearch: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  EmployeeText: {
    borderBottomWidth: 1,
    borderBottomColor: '#84d7d1',
    fontSize: 20,
    height: 50,
    color: color.black,
  },
  container: {
    flex: 1,
    marginTop: 0,
    paddingBottom: 40,
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    // backgroundColor:'red',
    width: 40,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
  },
  checkbox2: {
    width: '30%',
  },
  checkbox: {
    width: '5%',
    marginTop: 18,
    justifyContent: 'flex-end',
    flex: 1,
  },
  labelbox: {
    width: '60%',
    display: 'flex',
  },
  labeltext: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: '#504e50',
    fontSize: 26,
  },
  lists: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  Alphatext: {
    marginTop: 12,
    color: '#808080',
    fontSize: 23,
    textAlign: 'left',
    marginLeft: 50,
  },
  loadingview: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  EmptyDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});
