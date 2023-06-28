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

const AddEmployee = ({
  AddEmployeeName,
  setopenmodalEmployeeVisible,
  Employee,
  setEmployee,
  loading,
  changeusernameSC,
  timesheet_emp,
  Usernamelist,
  UserList,
  setUserList,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [index, setindex] = useState(timesheet_emp);
  const flatListRef = useRef(null);
  const alphaRef = useRef(null);

  const Add = () => {
    setopenmodalEmployeeVisible(false);
    changeusernameSC(index);
  };

  const onValueChange = item => {
    setindex(item.item);
    setUserList(item.item);
  };

  let Userdata = Usernamelist.filter(d => {
    if (typed_search === '') {
      return d;
    } else if (d.toLowerCase().includes(typed_search.toLowerCase()) == true) {
      return d;
    }
  });

  let final = Userdata.map(d => {
    return d;
  });

  let result = [];
  let firstLetters = new Set();
  for (let i = 0; i < Userdata.length; i++) {
    firstLetters.add(Userdata[i][0]);
  }

  firstLetters = Array.from(firstLetters).sort();
  let datas = firstLetters.map(e => {
    return {Alphabet: e};
  });
  for (let i = 0; i < firstLetters.length; i++) {
    result.push(datas[i]);
    for (let j = 0; j < Userdata.length; j++) {
      if (Userdata[j][0] === firstLetters[i]) {
        result.push(final[j]);
      }
    }
  }

  let dataletter = result.map(d => {
    return d.Alphabet;
  });

  let removeundefined = dataletter.filter(function (element) {
    return element !== undefined;
  });

  let finaldata = removeundefined.map((d, i) => {
    return {id: i, title: d};
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
    const index = Array.isArray(result)
      ? result.findIndex(item => item.Alphabet === section)
      : -1;
    if (index >= 0) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };
  useEffect(() => {
    //Initial Scroll To Display
    const InitialScrolltoDisplay = () => {
      const index = Array.isArray(result)
        ? result.findIndex(item => item === UserList)
        : -1;
      if (index >= 0) {
        flatListRef.current.scrollToIndex({index, animated: true});
      }
    };
    InitialScrolltoDisplay();
  }, []);

  //Alphabet letters Scroll section
  const alphabetscrollSection = section => {
    const index = Array.isArray(finaldata)
      ? finaldata.findIndex(item => item.title === section)
      : -1;
    if (index >= 0) {
      alphaRef.current.scrollToIndex({index, animated: true});
    }
  };

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
          onPress={() => onValueChange(item)}>
          <View style={styles.lists}>
            {!splited.Alphabet ? (
              <Text
                style={styles.labeltext}
                onTouchMove={() => alphabetscrollSection(splited.slice(0, 1))}>
                &nbsp;&nbsp;{splited}
              </Text>
            ) : null}

            <View style={styles.checkbox}>
              {UserList == item.item ? (
                <View>
                  <Image
                    source={require('../Image/checkboxtick.png')}
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
        {/* Search Container */}
        <View style={styles.EmployeeContainer}>
          <View style={styles.EmployeeSearch}>
            <TextInput
              style={styles.EmployeeText}
              placeholder="Search Employee..."
              onChangeText={text => settyped_search(text)}
            />
          </View>
          <View style={{padding: 10, alignSelf: 'center'}}>
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
              <View style={styles.EmployeeRightContainer}>
                <FlatList
                  data={result}
                  ref={flatListRef}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => {
                        return index.toString();
                      }}
                  getItemLayout={getItemLayout}
                  ListHeaderComponent={() =>
                    !result.length ? (
                      <Text style={styles.labeltext}>No Employee</Text>
                    ) : null
                  }
                />
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
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    setopenmodalEmployeeVisible(false);
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
    borderBottomWidth: 1,
    borderBottomColor: '#84d7d1',
    fontSize: 17,
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
    marginLeft: 100,
    color: '#808080',
    fontSize: 28,
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
