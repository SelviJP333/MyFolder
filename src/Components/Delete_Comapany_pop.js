import React from "react";
import {
  Button, Modal,
  StyleSheet,
  Text,
  View
} from "react-native";

const Delete_Company_Pop = ({
  deleteComapany_modal,
  setdeleteCompany_modal,
  handleAddRow,
  setmodalComapanyVisible,
}) => {
  return (
    <>
      <Modal
        style={styles.popup}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={deleteComapany_modal}
        onRequestClose={() => {
          setdeleteCompany_modal(!deleteComapany_modal);
        }}
      >
        <View>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {deleteComapany_modal === true ? (
                <>
                  <Text style={styles.deleteText_modal}>
                  Are you sure you want to delete?{" "}
                  </Text>

                  <View style={styles.maincontainer}>
                    <View style={styles.buttonContainer}>
                      <Button
                        color="#e74c3c"
                        onPress={() => handleAddRow()}
                        title="Yes"
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <Button
                        color="#4BB543"
                        title="No"
                        onPress={() => {
                          setmodalComapanyVisible(false);
                          setdeleteCompany_modal(false);
                        }}
                      />
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Delete_Company_Pop;
const styles = StyleSheet.create({
  deleteText_modal: {
    marginTop: "5%",
    color:'#000',
    fontSize:20
  },
  btn: {
    width: 100,
    height: 18,
    backgroundColor: "#307ecc",
    borderRadius: 2,
    marginLeft: 5,
  },
  btnText: {
    textAlign: "center",
     color: "#fff"
     }, 
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },
  modalView: {
    marginTop: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    height: 200,
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
    paddingTop: "2%",
  },

  btn: {
    padding: 10,
    borderColor: "blue",
    width: 100,
    backgroundColor: "#4478de",
  },
  closebtn: {
    alignSelf: "flex-end",
    marginRight: 15,
    marginTop: -5,
  },
  btncontainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4BB543",
    padding: 10,
    //marginTop:  100,
  },
  buttonContainer: {
    paddingLeft: "10%",
    paddingRight: "10%",
    flex: 1,
  },
  maincontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
