import React, { useState } from "react";
import { Alert, Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ScrollPicker from "react-native-scroll-picker-wheel";

const Scroll_modal = ({
  setpopup_twentyfour,
  setData,
  hoursmodalVisible,
  sethoursmodalVisible,
  times,
  settimes,
  selected_data,
  TableData,
  setTableData,
  settotal_RegularTime,
  settotal_DBL,
  settotal_Overtime,
  settotalgroup1,
  settotalgroup2,
  settotalgroup3,
  settotalgroup4,
  settotalgroup5,
  settotalgroup6,
  settotalgroup7,
  settotalgroup8,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [totals, settotals] = useState({
    RegularTime: 0,
    Overtime: 0,
    DBL: 0,
  });

  let regular_hours = [
    "0",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "10"
  ];

  const get_set = (data, column_index, row_index) => {
    let splited = data.split("/");
    settimes({
      RegularTime: splited[0],
      Overtime: splited[1],
      DBL: splited[2],
    });
    setselected_data([column_index, row_index]);
    setModalVisible(true);
  };
  const close_model =()=>{
    sethoursmodalVisible(false);
  }
  const close_pass = () => {
    TableData[selected_data[1]][1][selected_data[2]][1].forEach((e) => {

    });

    // Converting Number

    let RegularTime=Number(times.RegularTime);
    let Overtime=Number(times.Overtime);
    let DBL=Number(times.DBL);



    if(RegularTime+Overtime+DBL>24){
      sethoursmodalVisible(false);
      setpopup_twentyfour(true)

    }else{
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(
        selected_data[4] + 1,
        1,
        `${times.RegularTime === " " ? "0" : times.RegularTime}/${
          times.Overtime ?? "0"
        }/${times.DBL ?? "0"}`
      );



      setData(
        TableData[selected_data[1]][1][selected_data[2]][1][selected_data[3]]
      );
      let reg1 = 0;
      let ovt1 = 0;
      let dbl1 = 0;
      // 2
      let reg2 = 0;
      let ovt2 = 0;
      let dbl2 = 0;
      // 3
      let reg3 = 0;
      let ovt3 = 0;
      let dbl3 = 0;
      // 4
      let reg4 = 0;
      let ovt4 = 0;
      let dbl4 = 0;
      // 5
      let reg5 = 0;
      let ovt5 = 0;
      let dbl5 = 0;
      // 6
      let reg6 = 0;
      let ovt6 = 0;
      let dbl6 = 0;
      // 7
      let reg7 = 0;
      let ovt7 = 0;
      let dbl7 = 0;

      let splited = TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].map((e) => {
        return e.split("/");
      });

      let first = 0;
      let second = 0;
      let third = 0;

      splited.forEach((e, i) => {
        if (i === 0) {
          return null;
        } else if (i === 8||i === 9) {
          return null;
        }

        (first += parseFloat(e[0])),
          (second += parseFloat(e[1])),
          (third += parseFloat(e[2]));
      });

      let b = TableData.forEach((eee) => {
        if (eee[1]) {
          eee[1].forEach((d, j) => {

            if (d[1]) {
              d[1].forEach((a, k) => {
                if (a) {
                  for (let i = 0; i <= a.length; i++) {
                    if (i === 0) {
                    } else {
                      if (i === 1) {
                        reg1 += parseFloat(a[i].split("/")[0]);
                        ovt1 += parseFloat(a[i].split("/")[1]);
                        dbl1 += parseFloat(a[i].split("/")[2]);
                      }

                      if (i === 2) {
                        reg2 += parseFloat(a[i].split("/")[0]);
                        ovt2 += parseFloat(a[i].split("/")[1]);
                        dbl2 += parseFloat(a[i].split("/")[2]);
                      }
                    }

                    if (i === 3) {
                      reg3 += parseFloat(a[i].split("/")[0]);
                      ovt3 += parseFloat(a[i].split("/")[1]);
                      dbl3 += parseFloat(a[i].split("/")[2]);
                    }

                    if (i === 4) {
                      reg4 += parseFloat(a[i].split("/")[0]);
                      ovt4 += parseFloat(a[i].split("/")[1]);
                      dbl4 += parseFloat(a[i].split("/")[2]);
                    }

                    if (i === 5) {
                      reg5 += parseFloat(a[i].split("/")[0]);
                      ovt5 += parseFloat(a[i].split("/")[1]);
                      dbl5 += parseFloat(a[i].split("/")[2]);
                    }

                    if (i === 6) {
                      reg6 += parseFloat(a[i].split("/")[0]);
                      ovt6 += parseFloat(a[i].split("/")[1]);
                      dbl6 += parseFloat(a[i].split("/")[2]);
                    }
                    if (i === 7) {
                      reg7 += parseFloat(a[i].split("/")[0]);
                      ovt7 += parseFloat(a[i].split("/")[1]);
                      dbl7 += parseFloat(a[i].split("/")[2]);
                    }
                  }
                }
              });
            }
          });
        }
      });

      settotalgroup1({
        reg1: reg1,
        ovt1: ovt1,
        dbl1: dbl1,
      });
      settotalgroup2({
        reg2: reg2,
        ovt2: ovt2,
        dbl2: dbl2,
      });
      settotalgroup3({
        reg3: reg3,
        ovt3: ovt3,
        dbl3: dbl3,
      });
      settotalgroup4({
        reg4: reg4,
        ovt4: ovt4,
        dbl4: dbl4,
      });
      settotalgroup5({
        reg5: reg5,
        ovt5: ovt5,
        dbl5: dbl5,
      });
      settotalgroup6({
        reg6: reg6,
        ovt6: ovt6,
        dbl6: dbl6,
      });
      settotalgroup7({
        reg7: reg7,
        ovt7: ovt7,
        dbl7: dbl7,
      });

      let reg_time = 0;
      let ovt_time = 0;
      let dbl_time = 0;

      let tablevalue = TableData.map((ee, i) => {
        if (ee[1]) {
          ee[1].map((d, j) => {
            if (d[1]) {
              d[1].map((f, k) => {
                if (f) {
                  f.map((g, h) => {

                    if (h === 0) {
                      // Ignore first position
                    } else if (h === 8||h === 9) {
                    } else {
                      reg_time += parseFloat(g.split("/")[0]);
                      ovt_time += parseFloat(g.split("/")[1]);
                      dbl_time += parseFloat(g.split("/")[2]);
                    }
                  });
                }
                });
            }
          });
        }
      });

      settotal_RegularTime(reg_time),
        settotal_Overtime(ovt_time),
        settotal_DBL(dbl_time);
      TableData[selected_data[1]][1][selected_data[2]][1][
        selected_data[3]
      ].splice(8, 1, `${first}/${second}/${third}`);
      sethoursmodalVisible(false);
    }


  };

  return (
    <View  >
      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={hoursmodalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header_scroll}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Reg</Text>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Ovr</Text>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Dbl</Text>
            </View>

            <View style={styles.pickercontainer}>
              <ScrollPicker
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
              />

              <ScrollPicker
                Title={"Ovt"}
                dataSource={regular_hours}
                selectedIndex={
                  times.Overtime !== null
                    ? regular_hours.indexOf(times.Overtime)
                    : 0
                }
                renderItem={(data, index, isSelected) => {
                  //
                }}
                onValueChange={(data, selectedIndex) => {
                  settimes({
                    ...times,
                    Overtime: data,
                  });
                }}
                wrapperHeight={200}
                wrapperWidth={50}
                wrapperBackground={"#FFFFFF"}
                itemHeight={35}
                highlightColor={"#d8d8d8"}
                highlightBorderWidth={2}
                activeItemColor={"black"}
                itemColor={"#B4B4B4"}
              />

              <ScrollPicker
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
              />
            </View>
<View style={styles.btncontainer}>
            <Pressable

              style={styles.Okbutton}
              onPress={() => close_pass()}
            ><Text style={styles.btnText}>OK</Text></Pressable>
             <Pressable

               style={styles.Okbutton}
               onPress={() => close_model()}
             ><Text style={styles.btnText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: "#BEBEBE", fontSize: 25 },
  header_scroll: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: "10%",
    marginBottom: "5%",
  },

  pickercontainer: {
    flexDirection: "row",
    // backgroundColor: "red",
    // alignItems: "center",
    // justifyContent: "center",
    marginBottom: "9%",
    marginTop: "1%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    height: 500,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  btncontainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  Okbutton: {

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
    height:40,
    marginTop: 20,
    borderRadius: 2,
    marginHorizontal:30,
    elevation: 8,
    backgroundColor: "#2196f3",

  },
  btnText:
  {
    fontSize: 20,
    color:'#fff'
  }
});

export default Scroll_modal;
