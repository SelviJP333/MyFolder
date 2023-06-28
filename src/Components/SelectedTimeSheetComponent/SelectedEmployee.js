import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState, useRef} from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import color from '../../constants/color';
import WarningPopup from '../../Components/WarningPopup';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SelectedEmployee = ({
  setdispemp,
  data,
  setEmployee,
  Employee,
  handleChangeEmployee,
  setSelectedEmployeePop,
  setEmployeeCount,
  Setselected_Employee_Id,
  AddEmployeeName,
  dispemp,
  setSelectedEmpId,
  SetCompanyID,
  setCompanyCount,
  setSelectedCmpId,
  setJob,
  setWholeCompany,
  setJobCount,
  SelectedEmpId,
  Job,
  SelectedCmpId,
  setPhaseCount,
  setWholePhase,
  setPhase,
  Phase,
  Company,
  DefaultCompanyID,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  const [Alphatyped_search, setAlphatyped_search] = useState('');
  const [DuplicateEmp, setDuplicateEmp] = useState(Employee);
  const flatListRef = null;
  const alphaRef = useRef(null);

  let final = Employee.filter(e => {
    if (typed_search === '') {
      if (e.status !== false) {
        return e;
      }
    } else if (
      e.status == true &&
      e.key.toLowerCase().includes(typed_search.toLowerCase())
    ) {
      if (e.status !== false) {
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

  // get the employee name
  let keyvalue = final.map(d => {
    return d.key;
  });

  // Grouping by alphabet letter and employee name
  let result = [];
  let firstLetters = new Set();
  for (let i = 0; i < keyvalue.length; i++) {
    firstLetters.add(keyvalue[i][0]);
  }
  firstLetters = Array.from(firstLetters).sort();
  let datas = firstLetters.map(e => {
    return {Alphabet: e};
  });
  for (let i = 0; i < firstLetters.length; i++) {
    result.push(datas[i]);
    for (let j = 0; j < keyvalue.length; j++) {
      if (keyvalue[j][0] === firstLetters[i]) {
        result.push(final[j]);
      }
    }
  }

  // Clickable filter
  let final2 = result.filter(e => {
    if (Alphatyped_search == '') {
      return e;
    } else if (
      // e.status == false && e.key[0].toLowerCase().includes(Alphatyped_search.toLowerCase()) || e.Alphabet) {
      (e.status == false &&
        e.key[0].toLowerCase().includes(Alphatyped_search.toLowerCase())) ||
      e.Alphabet
    ) {
      if (Alphatyped_search == e.Alphabet) {
        return e;
      }
      return e.key;
    }
  });

  let dataletter = final2.map(d => {
    return d.Alphabet;
  });

  let removeundefined = dataletter.filter(function (element) {
    return element !== undefined;
  });

  let finaldata = removeundefined.map((d, i) => {
    return {id: i, title: d};
  });

  // Displaying Alphabet list
  const Item = ({title}) => (
    <View
      style={styles.item}
      onPress={() => scrollToSection(title)}
      onTouchMove={() => scrollToSection(title)}>
      <Text
        style={styles.title}
        onPress={() => scrollToSection(title)}
        onTouchMove={() => scrollToSection(title)}>
        {title}
      </Text>
    </View>
  );

  // getItemLayout for smooth display flatlist scroll
  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 45 * index,
    // offset: 49.3 * index,
    index,
  });

  // Scroll to particular section
  const scrollToSection = section => {
    const index = Array.isArray(final2)
      ? final2.findIndex(item => item.Alphabet === section)
      : -1;
    if (index >= 0) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };

  //Alphabet letters Scroll section
  const alphabetscrollSection = section => {
    const index = Array.isArray(finaldata)
      ? finaldata.findIndex(item => item.title === section)
      : -1;
    if (index >= 0) {
      alphaRef.current.scrollToIndex({index, animated: true});
    }
  };

  // Flatlist rendersectionheader
  const renderSectionHeader = ({finaldata: {section}}) => (
    <View style={{backgroundColor: '#ddd'}}>
      <Text>{section}</Text>
    </View>
  );

  useEffect(() => {
    emptycheckdisp();
  });

  const emptycheckdisp = () => {
    if (dispemp.length === 0) {
      setdispemp(Employee);
    }
  };

  const None = () => {
    const newdata = Employee.map(e => {
      return {...e, check: false};
    });
    setEmployee(newdata);
  };

  const All = () => {
    const newdata = Employee.map(e => {
      return {...e, check: true};
    });

    setEmployee(newdata);
  };

  const cancel = () => {
    const newdata = dispemp.map(d => {
      return d;
    });

    setEmployee(newdata);
    setSelectedEmployeePop(false);
  };

  const onValueChange = (item, item_check) => {
    const newdata = Employee.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check};
      }

      return {...e};
    });

    setEmployee(newdata);
  };

  const Add = () => {
    let selectedEmployee = [];
    let selectedEmployeeID = [];
    let displayselectedEmployee = [];

    Employee.map(d => {
      displayselectedEmployee.push(d);
    });

    Employee.filter(e => e.check === true && e.status == true).forEach(e => {
      selectedEmployee.push(e);
      selectedEmployeeID.push(e.value.toString());
    });
    if (selectedEmployee.length == 0) {
      setCheck(true);
    } else {
      Setselected_Employee_Id(prev => [...prev, ...selectedEmployeeID]);
      AddEmployeeName(selectedEmployee, selectedEmployeeID);
      setSelectedEmployeePop(false);
      setdispemp(displayselectedEmployee);
      setSelectedEmpId(selectedEmployeeID);
      //  GetData()
      // Employee count display in
      let Employee_length = Employee.length;
      let Cancel_length = Employee.filter(d => {
        if (d.check === false) {
          return d;
        }
      }).length;

      setEmployeeCount(Employee_length - Cancel_length);
    }
  };

  const renderItem = item => {
    let splited = item.item;
    return (
      <View>
        {splited.Alphabet ? (
          <Text
            style={styles.Alphatext}
            onPress={() => alphabetscrollSection(splited.Alphabet)}>
            &nbsp;&nbsp;{splited.Alphabet}
          </Text>
        ) : null}
        <TouchableHighlight activeOpacity={1}>
          <View style={styles.lists}>
            {/* <Image source={f} style={styles.profileImage} /> */}
            {!splited.Alphabet ? (
              <Text
                style={styles.labeltext}
                onPress={() => onValueChange(item, !item.item.check)}
                onTouchMove={() =>
                  alphabetscrollSection(splited.key.slice(0, 1))
                }>
                &nbsp;&nbsp;{splited.key}
              </Text>
            ) : null}

            <View style={styles.checkbox}>
              {item.item.check ? (
                <View>
                  <Image
                    source={require('../../Image/checkboxtick.png')}
                    style={{width: 30, height: 30, right: 0, top: 0}}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const GetData = () => {
    const newState = Job.map(obj => {
      if (!DefaultCompanyID.includes(obj.CompanyID)) {
        return {
          ...obj,
          displayStatus: false,
        };
      } else {
        return {
          ...obj,
          displayStatus: true,
        };
      }
      // return {
      //   ...obj
      // }
    });

    let newArray = newState;
    // Employee Not Selected displaying All Selected Company
    if (SelectedEmpId.length == 0) {
      setWholeCompany(newArray);
      setJob(newArray);
      // setJobCount(newArray.filter(item => item.displayStatus == true).length);
      let result = newArray
        .filter(item => item.displayStatus == true)
        .map(item => item.ID);
      const newPhase = Phase.map(obj => {
        if (!result.includes(parseInt(obj.JobID))) {
          return {
            ...obj,
            displayStatus: false,
          };
        } else {
          return {
            ...obj,
            displayStatus: true,
          };
        }
      });

      setPhase(newPhase);
      setWholePhase(newPhase);
      setPhaseCount(newPhase.filter(item => item.displayStatus == true).length);
    }
    // Employee Selected display that particular employee selected company
    else if (SelectedEmpId.length != 0 && SelectedCmpId.length == 0) {
      let newData = newArray.map(e => {
        const newname = ee => {
          let duplicate = ee['EmployeeID'].split(',').filter(f => {
            if (SelectedEmpId.includes(f)) {
              return true;
            } else {
              return false;
            }
          });
          return duplicate;
        };
        if (newname(e).length !== 0) {
          return {
            ...e,
            ['check']: true,
          };
        }
        return {
          ...e,
          ['check']: false,
        };
      });

      let newdatafordisp = newData.map(d => {
        if (d.check == false && d.status == true) {
          return {...d, ['displayStatus']: false};
        } else {
          return {...d, ['displayStatus']: true};
        }
      });

      let Checkin = newdatafordisp
        .map(d => {
          if (d.displayStatus === true) {
            return d;
          }
        })
        .filter(function (x) {
          return x !== undefined;
        }).length;

      setWholeCompany(newdatafordisp);
      setJob(newdatafordisp);
      // setJobCount(
      //   newdatafordisp.filter(item => item.displayStatus == true).length,
      // );
      let result = newdatafordisp
        .filter(item => item.displayStatus == true)
        .map(item => item.ID);
      const newPhase = Phase.map(obj => {
        if (!result.includes(parseInt(obj.JobID))) {
          return {
            ...obj,
            displayStatus: false,
          };
        } else {
          return {
            ...obj,
            displayStatus: true,
          };
        }
      });

      setPhase(newPhase);
      setWholePhase(newPhase);
      setPhaseCount(newPhase.filter(item => item.displayStatus == true).length);
    } else if (SelectedEmpId.length != 0 && SelectedCmpId.length != 0) {
      let newData = newArray.map(e => {
        if (e['CompanyID'] == SelectedCmpId) {
          return {
            ...e,
            ['check']: true,
          };
        }
        return {
          ...e,
          ['check']: false,
        };
      });
      let newdatafordisp = newData.map(d => {
        if (d.check == false && d.status == true) {
          return {...d, ['displayStatus']: false};
        } else {
          return {...d, ['displayStatus']: true};
        }
      });

      let Checkin = newdatafordisp
        .map(d => {
          if (d.displayStatus === true) {
            return d;
          }
        })
        .filter(function (x) {
          return x !== undefined;
        }).length;

      setWholeCompany(newdatafordisp);
      setJob(newdatafordisp);
      // setJobCount(
      //   newdatafordisp.filter(item => item.displayStatus == true).length,
      // );
      let result = newdatafordisp
        .filter(item => item.displayStatus == true)
        .map(item => item.ID);
      const newPhase = Phase.map(obj => {
        if (!result.includes(parseInt(obj.JobID))) {
          return {
            ...obj,
            displayStatus: false,
          };
        } else {
          return {
            ...obj,
            displayStatus: true,
          };
        }
      });

      setPhase(newPhase);
      setWholePhase(newPhase);
      setPhaseCount(newPhase.filter(item => item.displayStatus == true).length);
    }
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
            text={'Please select at least one employee'}
          />
        ) : null}
        {/* Search Container */}
        <View style={styles.EmployeeContainer}>
          <View style={styles.EmployeeSearch}>
            <TextInput
              style={styles.EmployeeText}
              placeholder="Search Employee..."
              placeholderTextColor={color.gray}
              onChangeText={text => settyped_search(text)}
            />
          </View>

          <View style={{padding: 10, alignSelf: 'center'}}>
            {/* Flatlist for Display Alphabet list */}
            <View style={styles.EmployeeTotalContainer}>
              <View style={styles.EmployeeLeftContainer}>
                <FlatList
                  ref={alphaRef}
                  data={finaldata}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <Item title={item.title} />}
                />
              </View>
              {/* Flatlist for Display Employee list */}
              <View style={styles.EmployeeRightContainer}>
                {/* For Search and Clickable filter */}
                {typed_search.length == 0 ? (
                  <FlatList
                    data={final2}
                    ref={flatListRef}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    renderSectionHeader={renderSectionHeader}
                    getItemLayout={getItemLayout}
                    ListHeaderComponent={() =>
                      !final2.length ? (
                        <Text style={styles.labeltext}>No Employee</Text>
                      ) : null
                    }
                  />
                ) : (
                  <FlatList
                    data={result}
                    ref={flatListRef}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={() =>
                      !result.length ? (
                        <Text style={styles.labeltext}>No Employee</Text>
                      ) : null
                    }
                  />
                )}
              </View>
            </View>
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

export default SelectedEmployee;
const styles = StyleSheet.create({
  EmployeeContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: 350,
    position: 'absolute',
    top: 0,
  },
  EmployeeTotalContainer: {
    paddingBottom: 70,
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
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#84d7d1',
    fontSize: 17,
    color: color.black,
  },
  container: {
    flex: 1,
    marginTop: 0,
    paddingBottom: 40,
  },
  item: {
    paddingTop: 10,
    marginVertical: 0,
    marginHorizontal: 2,
    //backgroundColor: 'red',
    width: 40,
  },
  title: {
    fontSize: 28,
    textAlign: 'left',
  },

  checkbox: {
    position: 'absolute',
    left: '3%',
    // backgroundColor:'yellow',
    marginTop: 18,
  },
  labeltext: {
    marginTop: 12,
    marginLeft: 75,
    //width: 300,
    //backgroundColor: 'red',
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
  EmptyDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  listItem: {
    flex: 1,
    height: 50,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  labeltext2: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: 'grey',
    fontSize: 27,
  },
});
