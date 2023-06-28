// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import SelectList from "react-native-dropdown-select-list"; 
import NetInfo from "../Components/NetInfo";
import db from "../Components/db";
const SettingsScreen = () => {
  const [selectedCompany, SetselectedCompany] = useState("");
  const [selectedJob, SetSelectedJob] = useState("");
  const [SelectedPhase, SetSelectedPhase] = useState("");
  const [MondayReg, SetMondayReg] = useState(0);
  const [MondayOvr, SetMondayOvr] = useState(0);
  const [MondayDbl, SetMondayDbl] = useState(0);
  const [TuesdayReg, SetTuesdayReg] = useState(0);
  const [TuesdayOvr, SetTuesdayOvr] = useState(0);
  const [TuesdayDbl, SetTuesdayDbl] = useState(0);
  const [WednesdayReg, SetWednesdayReg] = useState(0);
  const [WednesdayOvr, SetWednesdayOvr] = useState(0);
  const [WednesdayDbl, SetWednesdayDbl] = useState(0);
  const [ThursdayReg, SetThursdayReg] = useState(0);
  const [ThursdayOvr, SetThursdayOvr] = useState(0);
  const [ThursdayDbl, SetThursdayDbl] = useState(0);
  const [FridayReg, SetFridayReg] = useState(0);
  const [FridayOvr, SetFridayOvr] = useState(0);
  const [FridayDbl, SetFridayDbl] = useState(0);
  const [SaturdayReg, SetSaturdayReg] = useState(0);
  const [SaturdayOvr, SetSaturdayOvr] = useState(0);
  const [SaturdayDbl, SetSaturdayDbl] = useState(0);
  const [SundayReg, SetSundayReg] = useState(0);
  const [SundayOvr, SetSundayOvr] = useState(0);
  const [SundayDbl, SetSundayDbl] = useState(0);
  let [Company, SetCompany] = useState([]);
  let [Jobs, setJobs] = useState([]);
  let [Phase, setPhase] = useState([]);

  const GetCompany = () => {
    SetSelectedJob("");
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM lkpcompany", [], (tx, res) => {
        var temp = [];

        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        let newArray = temp.map((item) => {
          return {
            key: item.CompanyID,
            value: "" + item.CompanyID + " - " + item.CompanyName + "",
          };
        });
        SetCompany(newArray);
      });
    });
  };

  useEffect(() => {
    GetCompany();
  }, []);

  const GetJobs = () => {
    SetSelectedPhase("");
    db.transaction((tx) => {
      tx.executeSql(
        "select JobID,JobName,JobNo from LkpJob where CompanyID = ?",
        [selectedCompany],
        (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map((item) => {
            return {
              key: item.JobID,
              value: "" + item.JobNo + " - " + item.JobName + "",
            };
          });
          setJobs(newArray);
        }
      );
    });
  };

  const GetPhase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "select PhaseCodeID,PhaseCode,PhaseCodeName from LkpPhaseCode where JobID = ?",
        [selectedJob],
        (tx, res) => {
          var temp = [];

          for (let i = 0; i < res.rows.length; i++) {
            temp.push(res.rows.item(i));
          }
          let newArray = temp.map((item) => {
            return {
              key: item.PhaseCode,
              value: "" + item.PhaseCodeID + " - " + item.PhaseCodeName + "",
            };
          });
          setPhase(newArray);
        }
      );
    });
  };

  const Save = () => {
    //  if (!MondayReg) {
    //     alert('Please fill Monday Regular Hours');
    //     return;
    //   }
    //   if (!MondayOvr) {
    //     alert('Please fill Monday Overtime Hours');
    //     return;
    //   }
    //   if (!MondayDbl) {
    //     alert('Please fill Monday Double Hours');
    //     return;
    //   }
    //  if (!TuesdayReg) {
    //     alert('Please fill Tuesday Regular Hours');
    //     return;
    //   }
    //   if (!TuesdayOvr) {
    //     alert('Please fill Tuesday Overtime Hours');
    //     return;
    //   }
    //   if (!TuesdayDbl) {
    //     alert('Please fill Tuesday Double Hours');
    //     return;
    //   }
    //  if (!TuesdayReg) {
    //     alert('Please fill Tuesday Regular Hours');
    //     return;
    //   }
    //   if (!TuesdayOvr) {
    //     alert('Please fill Tuesday Overtime Hours');
    //     return;
    //   }
    //   if (!TuesdayDbl) {
    //     alert('Please fill Tuesday Double Hours');
    //     return;
    //   }

    //setLoading(true);

    var TimesheetPhasecodeId = generateGuidQuickly();
    var TimesheetJobId = generateGuidQuickly();
    var DateTime = GetDateTIme();

    try {
      db.transaction(function (txn) {
        txn.executeSql(
          "INSERT INTO TimesheetPhaseCode (TimesheetPhaseCodeID, TimesheetJobID, PhaseCodeID, MonRegularHours, MonOvertimeHours, MonDoubleTimeHours, TueRegularHours, TueOvertimeHours, TueDoubleTimeHours, WedRegularHours, WedOvertimeHours, WedDoubleTimeHours, ThuRegularHours, ThuOvertimeHours, ThuDoubleTimeHours, FriRegularHours, FriOvertimeHours, FriDoubleTimeHours, SatRegularHours, SatOvertimeHours, SatDoubleTimeHours, SunRegularHours, SunOvertimeHours, SunDoubleTimeHours, Comment, CreatedBy, CreatedOn)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?);",
          [
            TimesheetPhasecodeId,
            TimesheetJobId,
            1,
            MondayReg,
            MondayOvr,
            MondayDbl,
            TuesdayReg,
            TuesdayOvr,
            TuesdayDbl,
            WednesdayReg,
            WednesdayOvr,
            WednesdayDbl,
            ThursdayReg,
            ThursdayOvr,
            ThursdayDbl,
            FridayReg,
            FridayOvr,
            FridayDbl,
            SaturdayReg,
            SaturdayOvr,
            SaturdayDbl,
            SundayReg,
            SundayOvr,
            SundayDbl,
            "Commands",
            1,
            DateTime,
          ],

          function (tx, res) {}
        );
      });
    } catch (error) {}
  };

  const generateGuidQuickly = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const GetDateTIme = () => {
    let dateTime = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
    return dateTime;
  };

  return (
    <>
      <SafeAreaView style={{ flex: 8 }}>
        <ScrollView
        //keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, padding: 16 }}>
            <View
              style={{
                flex: 1,
                alignItems: "baseline",
                justifyContent: "space-evenly",
                flexDirection: "row",
                marginTop: "2%",
              }}
            >
              <SelectList
                placeholder="Select Company"
                search={false}
                style={StyleSheet.inputStyle}
                setSelected={SetselectedCompany}
                onSelect={GetJobs}
                data={Company}
              />
              <SelectList
                placeholder="Select Job"
                search={false}
                setSelected={SetSelectedJob}
                onSelect={GetPhase}
                value={selectedJob}
                data={Jobs}
              />
              <SelectList
                placeholder="Select Phase"
                search={false}
                setSelected={SetSelectedPhase}
                data={Phase}
              />
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetMondayReg(value)}
                placeholder="Monday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetMondayOvr(value)}
                placeholder="Monday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetMondayDbl(value)}
                placeholder="Monday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetTuesdayReg(value)}
                placeholder="Tuesday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetTuesdayOvr(value)}
                placeholder="Tuesday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetTuesdayDbl(value)}
                placeholder="Tuesday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetWednesdayReg(value)}
                placeholder="Wednesday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetWednesdayOvr(value)}
                placeholder="Wednesday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetWednesdayDbl(value)}
                placeholder="Wednesday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetThursdayReg(value)}
                placeholder="Thursday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetThursdayOvr(value)}
                placeholder="Thursday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetThursdayDbl(value)}
                placeholder="Thursday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetFridayReg(value)}
                placeholder="Friday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetFridayOvr(value)}
                placeholder="Friday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetFridayDbl(value)}
                placeholder="Friday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetSaturdayReg(value)}
                placeholder="Saturday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetSaturdayOvr(value)}
                placeholder="Saturday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetSaturdayDbl(value)}
                placeholder="Saturday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <View style={styles.RowStyle}>
              <TextInput
                onChangeText={(value) => SetSundayReg(value)}
                placeholder="Sunday regular Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetSundayOvr(value)}
                placeholder="Sunday Overtime Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
              <TextInput
                onChangeText={(value) => SetSundayDbl(value)}
                placeholder="Sunday Double Hours"
                style={styles.inputStyle}
                keyboardType="numeric"
                maxLength={2}
              ></TextInput>
            </View>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={Save}
            >
              <Text style={styles.buttonTextStyle}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <NetInfo />
    </>
  );
};

export default SettingsScreen;
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#307ecc",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#cc0000",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    width: 300,
    alignSelf: "center",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "#5b5b5b",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#bcbcbc",
  },
  RowStyle: {
    flex: 1,
    alignItems: "baseline",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: "2%",
  },
  inputStyle: {
    color: "#5b5b5b",
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderRadius: 30,
    borderColor: "#bcbcbc",
    width: 400,
  },
});
