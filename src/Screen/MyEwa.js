// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';

// function MyEwa({navigation}) {
//   const DATA = [
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'Authorization requested',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments:
//         'Test EWA by Paul. Please disregard Test EWA by Paul. Please disregard',
//     },
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'Authorized',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments: 'Test EWA by Paul. Please disregard',
//     },
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'In Draft',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments: 'Test EWA by Paul. Please disregard',
//     },

//     //2
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'Authorization requested',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments:
//         'Test EWA by Paul. Please disregard Test EWA by Paul. Please disregard',
//     },
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'Authorized',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments: 'Test EWA by Paul. Please disregard',
//     },
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'In Draft',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments: 'Test EWA by Paul. Please disregard',
//     },
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       status: 'In Draft',
//       ticket: '19-0178-308',
//       city: '19-6109 City of Peru',
//       company: '60 - Leopardo Self-Perfomance',
//       comments: 'Test EWA by Paul. Please disregard',
//     },
//   ];

//   const renderItem = ({item}) => {
//     return (
//       <>
//         <View style={styles.container}>
//           <View style={styles.square}>
//             <View
//               style={
//                 item.status == 'Authorized'
//                   ? styles.statusgreenbox
//                   : item.status == 'In Draft'
//                   ? styles.statusbluebox
//                   : styles.statusyellowbox
//               }>
//               <Text style={styles.statustext}>{item.status}</Text>
//             </View>
//             <View style={styles.ticketbox}>
//               <Text style={styles.tickettext}>Ticket : {item.ticket}</Text>
//             </View>
//             <View style={styles.citybox}>
//               <Text style={styles.citytext}>{item.city}</Text>
//             </View>
//             <View style={styles.companybox}>
//               <Text style={styles.companytext}>{item.company}</Text>
//             </View>
//             <View style={styles.commentbox}>
//               <Text style={styles.commenttext}>{item.comments}</Text>
//               <TouchableOpacity style={styles.deletestyle}>
//                 {/* <Image style={styles.logo} source={Delete} /> */}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </>
//     );
//   };

//   return (
//     <>
//       <ScrollView style={styles.scrollcontainer}>
//         {/* <View style={styles.container}>
//           <View style={styles.square} />
//           <View style={styles.square} />
//           <View style={styles.square} />
//           <View style={styles.square} />
//         </View> */}

//         <FlatList
//           // columnWrapperStyle={{
//           //   flexWrap: 'wrap',
//           // }}
//           data={DATA}
//           numColumns={3}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => {
//             return index.toString();
//           }}
//           //contentContainerStyle={{minHeight: `100%`}}
//           scrollEnabled={true}
//         />
//       </ScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   scrollcontainer: {
//     // marginTop: 100,
//     // marginLeft: 30,
//     margin: 10,
//     backgroundColor: 'yellow',
//   },
//   container: {
//     backgroundColor: 'pink',
//     flex: 1,
//     flexDirection: 'column',
//     gap: '2rem',
//     flexWrap: 'wrap',
//     width: 900,
//     margin: 10,
//     flexShrink: 3,
//     // marginRight: 30,
//   },
//   square: {
//     backgroundColor: 'white',
//     width: 350,
//     height: 300,
//     margin: 10,
//   },
//   DashboardContainer: {
//     flex: 1,
//     marginRight: 40,
//     marginLeft: 40,
//   },
//   FilterheadContainer: {
//     width: 650,
//     display: 'flex',
//     flexDirection: 'row',
//     textAlign: 'left',
//     justifyContent: 'space-between',
//     textAlign: 'left',
//   },
//   headerinputStyle: {
//     flex: 1,
//     color: '#c1c0c1',
//     marginTop: 10,
//     padding: 20,
//     paddingLeft: 15,
//     paddingRight: 15,
//     backgroundColor: '#fff',
//     borderLeftWidth: 8,
//     borderColor: '#E8E8E8',
//     fontWeight: 'bold',
//     fontSize: 18,
//     width: 300,
//     height: 50,
//   },
//   Ewatext: {
//     color: '#adacad',
//     fontWeight: '600',
//     fontSize: 18,
//   },
//   flcontainer: {
//     marginTop: 10,
//     display: 'flex',
//     paddingBottom: 60,
//   },
//   flatlistcontainer: {
//     marginTop: StatusBar.currentHeight || 0,
//     width: 350,
//     height: 250,
//     backgroundColor: '#fff',
//     marginRight: 35,
//     marginTop: 30,
//   },
//   boxcontainer: {
//     flex: 1,
//     width: '100%',
//   },
//   statusyellowbox: {
//     backgroundColor: '#fcb601',
//     height: 30,
//   },

//   statusgreenbox: {
//     backgroundColor: '#34c272',
//     height: 30,
//   },
//   statusbluebox: {
//     backgroundColor: '#4478de',
//     height: 30,
//   },
//   statustext: {
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     padding: 5,
//     color: '#fff',
//   },
//   commentbox: {
//     backgroundColor: '#fcfafc',
//     position: 'absolute',
//     bottom: 0,
//     width: 350,
//     height: 60,
//     padding: 8,
//   },
//   deletestyle: {
//     position: 'absolute',
//     right: 0,
//     padding: 10,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 300,
//     fontSize: 20,
//   },
//   commenttext: {
//     marginTop: 2,
//     width: 250,
//     color: '#9C9494',
//   },

//   logo: {
//     width: 20,
//     height: 20,
//   },
//   companybox: {
//     marginTop: 40,
//     paddingLeft: 10,
//   },
//   companytext: {
//     fontSize: 19,
//     color: '#73a0c5',
//   },
//   citybox: {
//     marginTop: 10,
//     paddingLeft: 10,
//   },
//   citytext: {
//     fontSize: 19,
//     fontWeight: '800',
//   },
//   ticketbox: {
//     marginTop: 20,
//     paddingLeft: 10,
//   },
//   tickettext: {
//     color: '#b5b2b5',
//   },
// });
// export default MyEwa;
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import db from '../constants/db';

function MyEwa({navigation}) {
  const [inputText, setInputText] = useState('');
  const [resultData, setResultData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const handleRunButton = () => {
    if (inputText) {
      db.transaction(tx => {
        tx.executeSql(
          inputText,
          [],
          (tx, result) => {
            const rows = result.rows;
            const headers = [];
            const data = [];

            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              data.push(item);

              // Extract column headers from the first row
              if (i === 0) {
                for (const columnName in item) {
                  headers.push(columnName);
                }
              }
            }

            setTableHeaders(headers);
            setResultData(data);
            setRowCount(rows.length); // Update the row count
            console.log('Query executed successfully');
          },
          error => {
            console.error('Failed to execute query:', error);
          },
        );
      });
    }
  };

  const handleCancelButton = () => {
    setResultData([]);
    setTableHeaders([]);
    setRowCount(0); // Reset the row count
  };

  const renderTableHeader = () => {
    return (
      <>
        <View style={styles.rowCountContainer}>
          <Text style={styles.rowCountText}>
            {rowCount} {rowCount === 1 ? 'row affected' : 'rows affected'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          {tableHeaders.map((header, index) => (
            <Text key={index} style={styles.headerText}>
              {header}
            </Text>
          ))}
        </View>
      </>
    );
  };

  const renderTableRow = (item, index) => {
    return (
      <View style={styles.tableRow} key={index}>
        {tableHeaders.map((header, columnIndex) => (
          <Text key={columnIndex} style={styles.tableCell}>
            {item[header]}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter SQL query"
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity style={styles.button} onPress={handleRunButton}>
          <Text style={styles.buttonText}>Run</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        {renderTableHeader()}
        <FlatList
          data={resultData}
          renderItem={({item, index}) => renderTableRow(item, index)}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: '80%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowCountContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rowCountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default MyEwa;
