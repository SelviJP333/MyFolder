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
  Image,
  ActivityIndicator,
} from 'react-native';
import WarningPopup from '../WarningPopup';
import db from '../../constants/db';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CopyCompany = ({
  CJP,
  setCJP,
  handleAddRow,
  SetCompany,
  Company,
  setCopyCompanydata,
  setSelectedCompanyPop,
  setdispcompany,
  dispcompany,
  SetCompanyID,
  setCompanyCount,
  setSelectedCmpId,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (Company.length > 1) {
      setTimeout(() => {
        setloading(false);
      }, 1000);
    }
  });

  const onValueChange = (item, item_check) => {
    const newdata = Company.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check, status: item_check};
      }

      return {...e};
    });

    SetCompany(newdata);
  };

  useEffect(() => {
    emptycheckdisp();
  });

  const emptycheckdisp = () => {
    if (dispcompany.length === 0) {
      setdispcompany(Company);
    }
  };
  const cancel = () => {
    const newdata = dispcompany.map(d => {
      return d;
    });
    SetCompany(newdata);
    setCopyCompanydata(false);
  };

  const Add = () => {
    // FilteredCompany = Company.filter(
    //   e => !CJP['company'].includes(e.value.split('*#^*')[1]),
    // );
    let selectedCompany = [];
    let selectedCompanyID = [];
    let Selected = [];
    var prevState = CJP['company'];

    console.log('Company ---- Copy Company', Company);
    Company.filter(e => e.check === true).forEach(e => {
      Selected.push(e.value.split('+')[0].split('*#^*')[1]);
      selectedCompany.push(e.value);
      selectedCompanyID.push(e.ID);
      setSelectedCmpId(selectedCompanyID);
      SetCompanyID(prev => [...prev, e.ID]);
    });
    for (const key in Selected) {
      if (Selected.hasOwnProperty.call(Selected, key)) {
        if (!prevState.includes(Selected[key])) {
          prevState.push(Selected[key]);
        }
      }
    }
    handleAddRow(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      selectedCompany,
      selectedCompanyID,
      true,
    );

    console.log('Company_Checkkkkkkkk');
    setCJP(prev => ({
      company: prevState,
      job: [],
      phase: [],
    }));
    if (selectedCompany.length === 0) {
      // setCopyCompanydata(false);
      setCheck(true);
    } else {
      setSelectedCompanyPop(false);
      setdispcompany(Company);
      let company_len = Company.map(d => {
        if (d.check == true) {
          return d;
        }
      }).filter(function (x) {
        return x !== undefined;
      }).length;

      setCompanyCount(company_len);

      // let final = selectedCompanyID.map(d => {
      //   return d.toString();
      // });
      // setSelectedCmpId(final);

      // setmodalComapanyVisible(false);
      //  GetJobs(selectedCompanyID);
      // setSelectedJobId(selectedCompanyID);
      //  for (let i = 0; i < selectedCompanyID.length; i++) {

      //  }
      setCopyCompanydata(false);

      //console.log("jjj",Job.findIndex(item => selectedCompanyID.includes(item.CompanyID)));
    }
  };

  const None = () => {
    const newdata = Company.map(e => {
      return {...e, check: false};
    });
    SetCompany(newdata);
  };

  const All = () => {
    const newdata = Company.map(e => {
      return {...e, check: true};
    });
    SetCompany(newdata);
  };

  const renderItem = item => {
    let splited = item.item.key.split('$$$');

    return (
      <TouchableHighlight activeOpacity={1}>
        <>
          <View style={styles.lists}>
            <View style={styles.checkbox2}></View>

            <View style={styles.checkbox}>
              {item.item.displayStatus === true ? (
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
            {item.item.displayStatus === true ? (
              <Text
                style={styles.labeltext}
                onPress={() => onValueChange(item, !item.item.check)}>
                &nbsp;&nbsp;{splited[1]}
              </Text>
            ) : null}

            <View style={styles.labelbox}></View>
          </View>
        </>
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
        <View style={styles.Container}>
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
                data={Company}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View style={styles.EmptyDiv}>
                    <Text style={{fontSize: 30, textAlign: 'center'}}>
                      No Company
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Bottom Container */}
          <View style={styles.EmployeeSubmitcontainer}>
            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity
                onPress={
                  () => Add()

                  //   () => {
                  //   let clickable = false;
                  //   Company.find(e => {
                  //     if (e.check === true) {
                  //       clickable = true;
                  //     }
                  //   });

                  //  clickable ? Add() : null;
                  // }
                }>
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
        {Check ? (
          <WarningPopup
            headtext={'COPY TIMESHEET WARNING'}
            buttontext={'Ok'}
            Check={Check}
            setCheck={setCheck}
            text="Please select at least one Company"
          />
        ) : null}
      </SafeAreaView>
    </>
  );
};

export default CopyCompany;
const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',

    width: '60%',
    height: '60%',
    borderRadius: 5,
  },

  EmployeeTotalContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  EmployeeSubmitcontainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  EmployeeSubmitTextContain: {
    paddingRight: 50,
    bottom: 15,
  },

  EmployeeSubmitText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#84d7d1',
  },

  checkbox2: {
    width: '20%',
  },
  checkbox: {
    width: '5%',
    marginTop: 18,
    justifyContent: 'flex-end',
    flex: 1,
    right: 30,
  },

  lists: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },

  labelbox: {
    width: '75%',
    display: 'flex',
  },
  labeltext: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: '#504e50',
    fontSize: 27,
  },
  labeltext2: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: 'grey',
    fontSize: 27,
  },
  labeltext2: {
    marginTop: 12,
    alignContent: 'center',
    flexWrap: 'wrap',
    color: 'grey',
    fontSize: 27,
  },
});
