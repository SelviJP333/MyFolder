import React, {useState} from 'react';
import {Alert, Button, Modal, StyleSheet, Text, View} from 'react-native';

import ScrollPicker from 'react-native-scroll-picker-wheel';

const Scroll_Pagination = React.memo(
  ({
    setopen_popup,
    open_popup,
    setselect_row,
    select_row,
    setInitialelect_row,
    setrowLimit,
  }) => {
    //BUG add this - Mani
    const [index, set_index] = useState(0);
    let regular_hours = ['10', '50', '100', '150', '200'];
    // let regular_hours = [
    //   "50",
    //   "100",
    //   "150",
    //   "200",
    //   "250",
    //   "300",
    //   "350",
    //   "500",

    // ];

    return (
      <View>
        <Modal
          statusBarTranslucent={true}
          animationType="slide"
          transparent={true}
          visible={open_popup}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.header_scroll}>
                {/* <Text style={{ fontSize: 20, fontWeight: "500" }}>Reg</Text> */}
                <Text style={{fontSize: 20, fontWeight: '500'}}>Rows</Text>
                {/* <Text style={{ fontSize: 20, fontWeight: "500" }}>Dbl</Text> */}
              </View>

              <View style={styles.pickercontainer}>
                {/* <ScrollPicker
                Title={"Reg"}
                dataSource={regular_hours}
                selectedIndex={
                  times.RegularTime !== null
                    ? regular_hours.indexOf(times.RegularTime)
                    : 0
                }
                renderItem={(data, index, isSelected) => {}}
                onValueChange={(data, selectedIndex) => {
                  settimes({
                    ...times,
                    RegularTime: data,
                  });
                }}
                wrapperHeight={180}
                wrapperWidth={50}
                wrapperBackground={"#FFFFFF"}
                itemHeight={35}
                highlightColor={"#d8d8d8"}
                highlightBorderWidth={2}
                activeItemColor={"black"}
                itemColor={"#B4B4B4"}
              /> */}

                <ScrollPicker
                  Title={'Ovt'}
                  dataSource={regular_hours}
                  selectedIndex={index}
                  renderItem={(data, index, isSelected) => {
                    //
                  }}
                  onValueChange={(data, selectedIndex) => {
                    set_index(selectedIndex);
                    setrowLimit(data);
                  }}
                  wrapperHeight={180}
                  wrapperWidth={50}
                  wrapperBackground={'#FFFFFF'}
                  itemHeight={35}
                  highlightColor={'#d8d8d8'}
                  highlightBorderWidth={2}
                  activeItemColor={'black'}
                  itemColor={'#B4B4B4'}
                />

                {/* <ScrollPicker
                Title={"Dbl"}
                dataSource={regular_hours}
                selectedIndex={
                  times.DBL !== null ? regular_hours.indexOf(times.DBL) : 0
                }
                renderItem={(data, index, isSelected) => {}}
                onValueChange={(data, selectedIndex) => {
                  settimes({
                    ...times,
                    DBL: data,
                  });
                }}
                wrapperHeight={180}
                wrapperWidth={50}
                wrapperBackground={"#FFFFFF"}
                itemHeight={35}
                highlightColor={"#d8d8d8"}
                highlightBorderWidth={2}
                activeItemColor={"#202020"}
                itemColor={"#202020"}
              /> */}
              </View>

              <Button
                title="      Ok     "
                style={styles.Okbutton}
                onPress={() => setopen_popup(false)}></Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#BEBEBE', fontSize: 25},
  header_scroll: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '10%',
    marginBottom: '5%',
  },
  Okbutton: {
    fontSize: 30,
  },
  pickercontainer: {
    flexDirection: 'row',
    // backgroundColor: "red",
    // alignItems: "center",
    // justifyContent: "center",
    marginBottom: '9%',
    marginTop: '1%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 350,
    width: '10%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
});

export default Scroll_Pagination;
