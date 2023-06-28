import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const PopupModal = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('My TimeSheet');
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={true}
        style={{zIndex: 1100}}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          {/* <View style={styles.box}>
        <Text>No User for Approve </Text>
      <TouchableOpacity  style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
      </View> */}
          <View style={styles.container2}>
            <Text style={styles.text}>No User for Approve</Text>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: '#4BB543',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  box: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 100,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container2: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginVertical: 20,
    fontSize: 20,
    color: '#5A5A5A',
  },
  button: {
    backgroundColor: '#4BB543',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PopupModal;
