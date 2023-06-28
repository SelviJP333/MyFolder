import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import ProcessingGif from '../Image/loading.gif';

function Processing() {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={true}
      style={{zIndex: 1100}}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <FastImage source={ProcessingGif} style={{height: 60, width: 60}} />
          <Text style={{fontSize: 20}}> Processing</Text>
        </View>
      </View>
    </Modal>
  );
}

export default Processing;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    width: 300,
    height: 100,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
