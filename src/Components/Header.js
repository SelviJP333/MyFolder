// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const Header = (props) => {

  return (
    <View style={{ flexDirection: "row", marginBottom:20 }}>

      <Image
        source={require("../Image/logo.png")}
        style={{
          width: "37%",
          top: 10,
          height: 65,
          resizeMode: "contain",
          margin:50,

        }}
      />
    </View>
  );
};
export default Header;
