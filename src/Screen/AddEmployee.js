import React, {useEffect, useState, useRef} from 'react';
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
  ScrollView,
} from 'react-native';
import WarningPopup from '../Components/WarningPopup';
import Create_Timesheet from '../Components/CreateTimesheet';
import {red100} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import color from '../constants/color';
const window = Dimensions.get('window');

const AddEmployee = ({
  AddEmployeeName,
  setmodalEmployeeVisible,
  Employee,
  setEmployee,
  loading,
  get_Empl,
  Setselected_Employee_Id,
  setCheckeddata,
  Checkeddata,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Alphatyped_search, setAlphatyped_search] = useState('');
  const [viewall, setviewall] = useState(false);
  const [Check, setCheck] = useState(false);
  const flatListRef = useRef(null);
  const alphaRef = useRef(null);

  // Sorting Employee like alphabet order wise
  let final = Employee.filter(e => {
    setCheckeddata(false);
    if (typed_search === '') {
      if (e.status !== true) {
        return e;
      }
    } else if (
      e.status == false &&
      e.key.toLowerCase().includes(typed_search.toLowerCase())
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

  let AlphabetLet = final2.map(d => {
    return d.Alphabet;
  });

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

  const onValueChange = (item, item_check) => {
    const newdata = Employee.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check};
      }

      return {...e};
    });
    setEmployee(newdata);
  };

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

  // View al
  const viewall_Emp = () => {
    get_Empl('View All', null);
  };

  // Display user name
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
        <TouchableHighlight
          activeOpacity={1}
          onPress={() => onValueChange(item, !item.item.check)}>
          <View style={styles.lists}>
            {/* <Image source={f} style={styles.profileImage} /> */}
            {!splited.Alphabet ? (
              <Text
                style={styles.labeltext}
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
                    source={require('../Image/checkboxtick.png')}
                    style={{width: 30, height: 30, right: 0, top: 0}}
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
      </View>
    );
  };

  const Add = () => {
    let selectedEmployee = [];
    let selectedEmployeeID = [];

    Employee.filter(e => e.check === true && e.status == false).forEach(e => {
      selectedEmployee.push(e.key);
      selectedEmployeeID.push(e.value);
    });
    if (selectedEmployee.length == 0) {
      setCheck(true);
      // alert('No');
    } else {
      Setselected_Employee_Id(prev => [...prev, ...selectedEmployeeID]);
      AddEmployeeName(selectedEmployee, selectedEmployeeID);
      setCheckeddata(true);
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          zIndex: 3,
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
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
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
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
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
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
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
              <TouchableOpacity onPress={() => viewall_Emp()}>
                <Text style={styles.EmployeeSubmitText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity
                onPress={() => {
                  Add();
                }}>
                <Text style={styles.EmployeeSubmitText}>OK</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    setmodalEmployeeVisible(false);
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

export default AddEmployee;
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
});
