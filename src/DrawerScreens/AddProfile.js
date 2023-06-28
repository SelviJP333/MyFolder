import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "../Components/Loader";

const AddProfile = () => {
  const [userEmail, setUserEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const AddProfile = () => {
    if (!UserName) {
      alert("Please fill Username");
      return;
    }
    if (!userEmail) {
      alert("Please fill Email");
      return;
    }

    if (!phoneNumber) {
      alert("Please fill Phone number");
      return;
    }
    setLoading(true);

    try {
      db.transaction(function (txn) {
        txn.executeSql(
          "INSERT INTO Table_UserProfile(Username,PhoneNumber,Email,CreatedDate) VALUES( ?,?,?,?)",
          [UserName, phoneNumber, userEmail],
          function (tx, res) {
            if (res.rows.length > 0) {
              AsyncStorage.setItem("Username", userEmail);

              navigation.replace("DrawerNavigationRoutes");
            } else {
              alert("Please check your email id or password");
              setLoading(false);
            }
          }
        );
      });
    } catch (error) {}
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Loader loading={loading} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KeyboardAvoidingView enabled>
            <Text></Text>

            <TextInput
              placeholder="Name"
              style={styles.inputStyle}
              onChangeText={(username) => setUserName(username)}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
            ></TextInput>
            <Text></Text>

            <TextInput
              style={styles.inputStyle}
              placeholder="Email"
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            ></TextInput>
            <Text></Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Phone number"
              onChangeText={(phoneNumber) => setphoneNumber(phoneNumber)}
              autoCapitalize="none"
              keyboardType="phone-pad"
              returnKeyType="done"
            ></TextInput>
            <Text></Text>

            <TouchableOpacity
              style={styles.SavebuttonStyle}
              activeOpacity={0.5}
              onPress={AddProfile}
            >
              <Text style={styles.buttonTextStyle}>Save</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddProfile;

const styles = StyleSheet.create({
  SavebuttonStyle: {
    backgroundColor: "#1e90ff",
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
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
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
