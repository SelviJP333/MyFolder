import {openDatabase} from 'react-native-sqlite-storage';

if (Platform.OS === 'ios') {
  var db = openDatabase({name: 'LMA_DB.db', createFromLocation: 1});
  
} else {
  var db = openDatabase({name: 'Offline.db'});
}

export default db;
