import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';

const ApproveSubmit_popup = ({
  navigation,
  setModalVisible,
  selected_Date,
  NavigateTimescreen,
  setApprove_Confirm,
  setApprove_Success,
  Approved,
  Empcount,
  setEmpcount,
}) => {
  const [Trigger_Approve, setTrigger_Approve] = useState(false);

  function combined() {
    setApprove_Success(false);
    setApprove_Confirm(false);
    Approved();
    setEmpcount(0);
  }

  return (
    <>
      <SafeAreaView
        style={{
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
                <Image source={require('../Image/completed.png')} />
              </View>
              <View>
                <Text
                  style={{color: '#1b386a', fontWeight: 'bold', fontSize: 20}}>
                  Approve Timesheet
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
                        onPress={() => setApprove_Success(false)}
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
            {`Approval was successful for ${Empcount} employee(s).`}
          </Text>

          <View
            style={{
              top: '20%',
            }}>
            {/* setTrigger_Approve(!Trigger_Approve); */}
            <TouchableOpacity
              onPress={() => combined()}
              // onPress={()=> navigation.navigate('EditTimeSheetScreen')}
              style={{
                backgroundColor: 'grey',
                height: 50,
                padding: 10,
                width: '22%',
                // left: '28%',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '500',
                  color: 'white',
                }}>
                Close{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ApproveSubmit_popup;

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
