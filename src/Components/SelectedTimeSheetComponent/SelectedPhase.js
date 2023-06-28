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
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import color from '../../constants/color';
import WarningPopup from '../WarningPopup';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SelectedPhase = ({
  dispphase,
  setdispphase,
  data,
  setPhase,
  Phase,
  handleChangePhase,
  setSelectedPhasePop,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  const onValueChange = (item, item_check) => {
    const newdata = Phase.map(e => {
      if (e.PhaseName === item.item.PhaseName) {
        return {...e, check: item_check, status: item_check};
      }

      return {...e};
    });

    setPhase(newdata);
  };

  const None = () => {
    const newdata = Phase.map(e => {
      return {...e, check: false};
    });
    setPhase(newdata);
  };

  const All = () => {
    const newdata = Phase.map(e => {
      return {...e, check: true};
    });
    setPhase(newdata);
  };
  const cancel = () => {
    const newdata = dispphase.map(d => {
      return d;
    });

    setPhase(newdata);
    setSelectedPhasePop(false);
  };

  const Add = () => {
    let selectedPhase = [];
    let selectedPhaseID = [];
    let UnSelectedPhase = [];
    let displayselectedPhase = [];
    Phase.filter(e => e.check === true && e.status === true).forEach(e => {
      selectedPhase.push(e.value);
      selectedPhaseID.push(e.ID);
      displayselectedPhase.push(e);
      //  setPhase(prev=>[...prev,e.ID])
    });
    Phase.filter(e => e.check === false && e.status === false).forEach(e => {
      UnSelectedPhase.push(e.ID);
      //  setEmployee(prev=>[...prev,e.ID])
    });
    if (selectedPhase.length == 0) {
      setCheck(true);
    } else {
      handleChangePhase(selectedPhase, selectedPhaseID, UnSelectedPhase);
      setSelectedPhasePop(false);
      setdispphase(Phase);
    }
  };
  const renderItem = item => {
    let splited = item.item.key.split('$$$');
    return (
      <TouchableHighlight activeOpacity={1}>
        <View style={styles.lists}>
          <View style={styles.checkbox2}></View>
          <View style={styles.checkbox}>
            {item.item.displayStatus ? (
              item.item.check ? (
                <View>
                  <Image
                    source={require('../../Image/checkboxtick.png')}
                    style={{width: 30, height: 30, left: 350}}
                  />
                </View>
              ) : null
            ) : null}
          </View>
          <View style={styles.labelbox}>
            {item.item.displayStatus ? (
              <Text
                style={styles.labeltext}
                onPress={() => onValueChange(item, !item.item.check)}>
                &nbsp;&nbsp;{splited[0]}&nbsp;{splited[1]}
              </Text>
            ) : (
              <Text style={styles.labeltext2}>
                {' '}
                &nbsp;&nbsp;{splited[0]}&nbsp;{splited[1]}
              </Text>
            )}
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
            headtext={'COPY TIMESHEET WARNING'}
            buttontext={'Ok'}
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

          <View style={styles.EmployeeTotalContainer}>
            <FlatList
              data={Phase}
              renderItem={renderItem}
              //getItemLayout={getItemLayout}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => (
                <View style={styles.EmptyDiv}>
                  <Text style={{fontSize: 30}}>No Phases</Text>
                </View>
              )}
            />
          </View>

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
                  None();
                }}>
                <Text style={styles.EmployeeSubmitText}>NONE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity
                onPress={() => {
                  All();
                }}>
                <Text style={styles.EmployeeSubmitText}>ALL</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity
                onPress={() => {
                  Add();
                }}>
                <Text style={styles.EmployeeSubmitText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View> */}

            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    cancel();
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

export default SelectedPhase;
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
    width: '40%',
  },
  checkbox: {
    position: 'absolute',
    left: '3%',
    // backgroundColor:'yellow',
    marginTop: 18,
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
  labeltext2: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: 'grey',
    fontSize: 27,
  },
});
