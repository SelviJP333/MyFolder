import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';

import ScrollPicker from 'react-native-scroll-picker-wheel';

const Weekendpopup = ({

  setDateModalVisible,
  setSelectedDate,
  SlideDates,
  DefaultDate,
  InitialSelectDate,
  selected_Date
}) => {
  // const [SlideDates, setSlideDates] = useState([]);
  const [isVisible, setVisible] = useState();
  const [DateSelect, setDateSelect] = useState(InitialSelectDate);
  const [showData, setShowData] = useState('');
  const [canceldate, setCanceldate] = useState('');
  const toggleModal = () => {
    setVisible(!isVisible);
  };

  const Datapass = () => {
    setDateModalVisible(false);
    setSelectedDate(DateSelect);
  };

  function Combined2() {
    setDateModalVisible(false);
    setCanceldate(true);
  }

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
          zIndex: 2,
        }}>
        <View
          style={{
            // backgroundColor: "red",
            width: '30%',
            height: '40%',
            borderRadius: 1,
            fontSize: 20,
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.pickercontainer}>
                <ScrollPicker
                  dataSource={SlideDates}
                  onValueChange={(data, selectedIndex) => {
                    setDateSelect(data);
                  }}
                  selectedIndex={SlideDates.indexOf(selected_Date)}
                  wrapperHeight={300}
                  wrapperWidth={20}
                  wrapperBackground={'#fff'}
                  itemHeight={45}
                  highlightColor={'skyblue'}
                  highlightBorderWidth={3}
                  activeItemColor={'black'}
                  itemColor={'black'}
                />
              </View>
              <View style={styles.btncontainer}>
                <Pressable style={styles.Okbutton} onPress={() => Combined2()}>
                  <Text style={styles.btnText}>CANCEL</Text>
                </Pressable>

                <Pressable onPress={() => Datapass()} style={styles.Okbutton}>
                  <Text style={styles.btnText2}>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Weekendpopup;

const styles = StyleSheet.create({
  touch: {
    padding: 10,
    width: '100%',
    zIndex: -1,
    position: 'absolute',
    bottom: 0,
  },

  SlideinputStyle: {
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    // backgroundColor: "red",
    borderLeftWidth: 5,
    // borderColor: "#E8E8E8",
    fontSize: 40,
  },

  btnstyle: {
    width: '20%',
  },

  pickercontainer: {
    flexDirection: 'row',
    marginBottom: '9%',
    marginTop: '1%',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },

  modalView: {
    backgroundColor: 'white',
    height: 420,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },

  btncontainer: {
    flexDirection: 'row',
    display: 'flex',
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingLeft: 40,
    // backgroundColor:"red",
    width: 225,
  },

  Okbutton: {
    flex: 1,
    alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    width: 10,
    color: 'black',
    // backgroundColor: "#2196f3",
  },

  btnText: {
    fontSize: 24,
    color: 'skyblue',
  },
  btnText2: {
    fontSize: 24,
    marginRight: 20,
    color: 'skyblue',
  },
});
