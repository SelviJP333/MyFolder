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

const AddPhase = ({
  SetSelectedPhase,
  setmodalPhaseVisible,
  setdeletePhase_modal,
  handleAddRow,
  Phase,
  setPhase,
  SelectedJobId,
  loading,
  GetPhase,
  company_index,
  phasejob_index,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  const onValueChange = (item, item_check) => {
    const newdata = Phase.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check};
      }
      return {...e};
    });

    setPhase(newdata);
  };

  const Add = () => {
    let SelectedPhase1 = [];
    let SelectedPhasename = [];
    let SelectedPhaseId = [];
    
    Phase.filter(e => e.check === true && e.status === false).forEach(e => {
      SelectedPhasename.push(
        parseInt(parseInt(e.value.split('*#^*')[0].trim())),
      );

      SelectedPhase1.push(e.value);
    });
    if (SelectedPhase1.length == 0) {
      setCheck(true);
    } else {
      SetSelectedPhase(prev => [...prev, ...SelectedPhasename]);

      handleAddRow(SelectedPhase1, null, null, null, null);
    }
  };

  let final = Phase.filter(e => {
    if (typed_search === '') {
      if (e.status !== true) {
        return e;
      }
    } else if (
      e.value
        .split('*#^*')[1]
        .toLowerCase()
        .includes(typed_search.toLowerCase())
    ) {
      if (e.status !== true) {
        return e;
      }
    }
  }).sort(function (a, b) {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });

  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 45 * index,
    // offset: 49.3 * index,
    index,
  });

  const viewall_Phase = () => {
    GetPhase(SelectedJobId, company_index, phasejob_index, 'View All');
  };
  const renderItem = item => {
    let splited = item.item.key.split('$$$');
    // 
    return (
      <TouchableHighlight
        activeOpacity={1}
        onPress={() => onValueChange(item, !item.item.check)}>
        <View style={styles.lists}>
          <Text style={styles.labeltext}>
            {splited[0]}{' '}
            {splited[1].length > 45
              ? splited[1].substr(0, 45) + '...'
              : splited[1]}
          </Text>
          <View style={styles.checkbox}>
            {item.item.check ? (
              <View>
                <Image
                  source={require('../Image/checkboxtick.png')}
                  style={{width: 30, height: 30, right: 0, top: 0, left: 300}}
                />
              </View>
            ) : null}
            {/* <CheckBox
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              disabled={false}
              onAnimationType="fill"
              offAnimationType="fill"
              onCheckColor="#006dcb"
              value={item.item.check}
              onChange={() => onValueChange(item, !item.item.check)}
              tintColors={{ true: "#006dcb", false: "grey" }}
            /> */}
          </View>
        </View>
      </TouchableHighlight>
    );
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
            text="Please select at least one Phase"
          />
        ) : null}
        <View style={styles.EmployeeContainer}>
          {/* Job Search */}
          <View style={styles.EmployeeSearch}>
            <TextInput
              style={styles.EmployeeText}
              placeholder="Search Phase Code..."
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
                getItemLayout={getItemLayout}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                ListEmptyComponent={() => (
                  <View style={styles.EmptyDiv}>
                    <Text style={{fontSize: 30}}>No Phases</Text>
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
              <TouchableOpacity
                onPress={() => {
                  viewall_Phase();
                }}>
                <Text style={styles.EmployeeSubmitText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    setmodalPhaseVisible(false), setdeletePhase_modal(false);
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

export default AddPhase;
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

  checkbox: {
    position: 'absolute',
    left: '3%',
    // backgroundColor:'yellow',
    marginTop: 18,
  },
  labeltext: {
    marginTop: 12,
    marginLeft: 500,
    color: '#808080',
    fontSize: 26,
    textAlign: 'left',
  },
  lists: {
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
