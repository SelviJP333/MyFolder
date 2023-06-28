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

const CopyJob = ({
  CopyJobdata,
  setCopyJobdata,
  dispjob,
  setdispjob,

  Jobs,
  setJobs,
  CompanyJob,

  handleAddRow,
  SelectedJobId,
  setSelectedJobId,
  setJobCount,
}) => {
  // console.log('CompanyJob', CompanyJob);
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  let final = Jobs.filter(e => {
    if (typed_search === '') {
      return e;
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

  let final2 = [];
  // console.log("'''''''''''''''''''''", final);

  const onValueChange = (item, item_check) => {
    const newdata = Jobs.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check, status: item_check};
      }

      return {...e};
    });

    setJobs(newdata);
  };

  const None = () => {
    const newdata = Jobs.map(e => {
      return {...e, check: false};
    });
    setJobs(newdata);
  };

  const All = () => {
    const newdata = Jobs.map(e => {
      return {...e, check: true};
    });
    setJobs(newdata);
  };

  //   useEffect(() => {
  //     emptycheckdisp();
  //   });

  //   const emptycheckdisp = () => {
  //     if (dispjob.length === 0) {
  //       setdispjob(Job);
  //     }
  //   };

  const cancel = () => {
    const newdata = dispjob.map(d => {
      return d;
    });
    setJobs(newdata);
    setCopyJobdata(false);
  };

  const Add = () => {
    let selectedJob = [];
    let selectedJobID = [];
    let UnSelectedJob = [];
    let displayselectedJob = [];
    let SelectedJobname1 = [];
    let SelectedJobID = [];

    Jobs.filter(e => e.check === true).forEach(e => {
      selectedJob.push(e.value);
      selectedJobID.push(e.ID);
      displayselectedJob.push(e);
      setSelectedJobId(selectedJobID);
      //  setJob(prev=>[...prev,e.ID])
    });
    Jobs.filter(e => e.check === false && e.status === false).forEach(e => {
      UnSelectedJob.push(e.ID);
      //  setEmployee(prev=>[...prev,e.ID])
    });

    if (selectedJob.length == 0) {
      setCheck(true);
    } else {
      // handleChangeJob(selectedJob, selectedJobID, UnSelectedJob);
      // setSelectedJobPop(false);
      // setdispjob(Jobs);
      let jobidstring = selectedJobID.map(d => {
        return d.toString();
      });

      setdispjob(Jobs);

      // setSelectedJobId(selectedJobID);

      let splited = Jobs.filter(
        e => e.check === true && e.displayStatus === true,
      ).map(e => {
        SelectedJobID.push(e.ID);

        SelectedJobname1.push(e.value);
      });

      handleAddRow(
        null,
        null,
        null,
        null,
        SelectedJobname1,
        SelectedJobID,
        true,
        null,
        null,
        null,
      );

      let Job_len = Jobs.map(d => {
        if (d.check == true) {
          return d;
        }
      }).filter(function (x) {
        return x !== undefined;
      }).length;

      setJobCount(SelectedJobID.length);

      setCopyJobdata(false);
    }
  };
  const renderer = item => {
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
                    style={{width: 30, height: 30}}
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
                {splited[2]} &nbsp;&nbsp;{splited[1]}
              </Text>
            ) : (
              <Text style={styles.labeltext2}>
                {splited[2]}&nbsp;&nbsp;{splited[1]}
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
                renderItem={renderer}
                //key={item.id}
                keyExtractor={item => item.id}
                // getItemLayout={getItemLayout}
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
              // onPress={() => {
              //   Add();
              // }}
              >
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

export default CopyJob;
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
    fontSize: 28,
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
