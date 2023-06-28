import CheckBox from "@react-native-community/checkbox";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Pressable,
  View,ActivityIndicator
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SingleAddJob = ({
  setmodalJobVisible,
  setJobs,
  GetPhase,
  Jobs,
  handleAddRow,loading
}) => {
  const [typed_search, settyped_search] = useState("");
  const onValueChange = (item, item_check) => {
    const newdata = Jobs.map((e) => {
      if (e.value === item.item.value) {
        return { ...e, check: item_check };
      }
      return { ...e };
    });

    setJobs(newdata);
  };

  const Add = () => {
    let SelectedJobname1 = [];
    let SelectedJobID= [];
    let splited = Jobs.filter((e) => e.check === true&&e.status===false).map((e) => {

      SelectedJobID.push(e.ID)

      SelectedJobname1.push(e.value);
      
    });
 
    handleAddRow(null, null, SelectedJobname1,SelectedJobID);
  };

  let final = Jobs.filter((e) => {
    if (typed_search === "") {
      if(e.status!==true){
        return e;
      }
    } else if (
      e.key.split("$$$")[1].toLowerCase().includes(typed_search.toLowerCase())
    ) {
      if(e.status!==true){
        return e;
      }
    }
  });

  const renderItem = (item) => {
    let splited = item.item.key.split("$$$");

    return (
      <TouchableHighlight
        activeOpacity={1}
        onPress={() => onValueChange(item, !item.item.check)}
      >
        <View style={styles.lists}>
          {/* <Image source={f} style={styles.profileImage} /> */}
          <Text style={styles.labeltext}>
            &nbsp;&nbsp;{splited[0]}&nbsp;{splited[1]}
          </Text>
          <View style={styles.checkbox}>
          <CheckBox
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              disabled={false}
              onAnimationType="fill"
              offAnimationType="fill"
              onCheckColor="#006dcb"
              value={item.item.check}
              onChange={() => onValueChange(item, !item.item.check)}
              tintColors={{ true: "#006dcb", false: "grey" }}
            />
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
          backgroundColor: "white",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#F5F5F5",
            shadowColor: "#cbe91e",
            width: "100%",
            height: "100%",
            borderRadius: 0,
          }}
        >
          <TextInput
            onChangeText={(text) => settyped_search(text)}
            placeholder="search..."
            style={{ paddingLeft: "5%", height: "10%", fontSize: 20 }}
          ></TextInput>
 {loading == true?
    
    <View style={styles.loadingview}>
    <ActivityIndicator
        //visibility of Overlay Loading Spinner
        visible={loading}
        size='large' 
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
    </View> :
          <FlatList
            data={final}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
                        return index.toString();
                      }}
            ListEmptyComponent={() => (
              <View style={styles.EmptyDiv}>
                <Text style={{ fontSize: 30 }}>No Jobs</Text>
              </View>
            )}
          />
            }
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              backgroundColor: "#1b386a",
              height: "10%",
            }}
          >
            <Pressable
               onPress={() => {
                let clickable=false
                Jobs.find((e)=>{
                  if(e.check===true){
                    clickable=true
                  }
                })
                clickable?Add():null
              }}
              style={{
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "#fff" }}>Add</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setmodalJobVisible(false);
              }}
              style={{
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "#fff" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SingleAddJob;
const styles = StyleSheet.create({
  EmptyDiv: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  lists: {
    backgroundColor: "#fff",
    height: 100,

    flexDirection: "row",
    alignItems: "center",
    // justifyContent:"center",
    width: windowWidth / 1,
    //  backgroundColor:"grey"
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: "red",
    borderWidth: 2,
  },

  checkbox: {
    position: "absolute",
    right: "3%",

    // top: "20%",
  },
  labeltext: {
    color: "#808080",
    paddingLeft: "5%",
    fontSize: 20,
  },
  loadingview: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" },
  spinnerTextStyle: {
    color: '#FFF',
    fontSize:25, 
  },
});
