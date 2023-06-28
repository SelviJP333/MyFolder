import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import WarningPopup from '../Components/WarningPopup';
const AddCompany = ({
  CJP,
  setCJP,
  GetJobs,
  handleAddRow,
  setmodalComapanyVisible,
  Company,
  SetCompany,
  loading,
  SetCompanyID,
}) => {
  const [typed_search, settyped_search] = useState('');
  const [Alphatyped_search, setAlphatyped_search] = useState('');
  const [Check, setCheck] = useState(false);
  let selectedCompany = [];
  let selectedCompanyID = [];
  let Selected = [];
  let FilteredCompany = Company.filter(
    e => !CJP['company'].includes(e.value.split('*#^*')[1]),
  );
  FilteredCompany.map(e => {});

  const Add = () => {
    FilteredCompany = Company.filter(
      e => !CJP['company'].includes(e.value.split('*#^*')[1]),
    );
    let result = Company.find(e => {
      return e.check === true;
    });
    var prevState = CJP['company'];
    FilteredCompany.filter(e => e.check === true && e.status === false).forEach(
      e => {
        Selected.push(e.value.split('+')[0].split('*#^*')[1]);
        selectedCompany.push(e.value);
        selectedCompanyID.push(e.ID);
        SetCompanyID(prev => [...prev, e.ID]);
      },
    );
    // for (const key in Selected) {
    //   if (Selected.hasOwnProperty.call(Selected, key)) {
    //     if (!prevState.includes(Selected[key])) {
    //       
    //       prevState.push(Selected[key]);
    //     }
    //   }
    // }
    final = final.filter(i => i.check == false);
    // setCJP(prev => ({
    //   company: prevState,
    //   job: [],
    //   phase: [],
    // }));
    if (selectedCompany.length === 0) {
      setCheck(true);
    } else {
      handleAddRow(
        null,
        null,
        null,
        null,
        null,
        selectedCompany,
        selectedCompanyID,
      );
      setmodalComapanyVisible(false);
    }
  };
  const onValueChange = (item, item_check) => {
    const newdata = Company.map(e => {
      if (e.value === item.item.value) {
        return {...e, check: item_check};
      }

      return {...e};
    });
    SetCompany(newdata);
  };

  let final = Company.filter(
    e => !CJP['company'].includes(e.value.split('*#^*')[1]),
  );

  const renderItem = item => {
    let splited = item.item.key.split('$$$');
    return (
      <TouchableHighlight
        activeOpacity={1}
        onPress={() => onValueChange(item, !item.item.check)}>
        <>
          <View style={styles.lists}>
            <View style={styles.checkbox2}></View>
            <View style={styles.checkbox}>
              {item.item.check ? (
                <View>
                  <Image
                    source={require('../Image/checkboxtick.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.labelbox}>
              <Text style={styles.labeltext}>&nbsp;&nbsp;{splited[1]}</Text>
            </View>
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
        {Check ? (
          <WarningPopup
            Check={Check}
            setCheck={setCheck}
            text="Please select at least one Company"
          />
        ) : null}
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
                data={final}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
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
                  final.length != selectedCompany.length ? () => Add() : null
                }>
                <Text style={styles.EmployeeSubmitText}>OK</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.EmployeeSubmitTextContain}>
              <TouchableOpacity>
                <Text
                  style={styles.EmployeeSubmitText}
                  onPress={() => {
                    setmodalComapanyVisible(false);
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

export default AddCompany;
const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',

    width: '60%',
    height: '50%',
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
    fontSize: 28,
  },
});
