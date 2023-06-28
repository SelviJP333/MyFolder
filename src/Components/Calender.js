import {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView, Button} from 'react-native';
import ScrollPicker from 'react-native-scroll-picker-wheel';
const Calender = props => {
  var sun = [];

  const [isModalVisible, setModalVisible] = useState(false);
  const [OpenSlider, setOpenSlider] = useState(false);
  const [SlideDates, setSlideDates] = useState([]);
  const [SelectedDate, setSelectedDate] = useState('');
  const [PrevValue, setPrevValue] = useState('');
  const toggleSliderModal = () => {
    setOpenSlider(!OpenSlider);
    props.isSubModalVisible(false);
    props.isModalVisible(false);
    // props.navigation.navigate("TimeSheetScreen", {
    //   paramKey: SlideDates
    // });
  };

  useEffect(() => {
    var d = new Date();
    var getlastmonth = daysInMonth(d.getMonth() - 1, d.getFullYear());
    for (var i = 1; i <= getlastmonth; i++) {
      var newDate = new Date(d.getFullYear(), d.getMonth() - 1, i);
      if (newDate.getDay() == 0) {
        parseInt(d.getMonth());
        let month = d.getMonth();

        sun.push('' + i + '/' + month + '/' + d.getFullYear() + '');
      }
    }
    var getTot = daysInMonth(d.getMonth(), d.getFullYear());
    for (var i = 1; i <= getTot; i++) {
      var newDate = new Date(d.getFullYear(), d.getMonth(), i);
      if (newDate.getDay() == 0) {
        parseInt(d.getMonth());
        let month = d.getMonth() + 1;
        sun.push('' + i + '/' + month + '/' + d.getFullYear() + '');
      }
    }
    setSlideDates(sun);
  }, []);

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.pickercontainer}>
              <ScrollPicker
                Title="dd"
                dataSource={SlideDates}
                onValueChange={(data, selectedIndex) => {
                  setSelectedDate(data);
                  setPrevValue(selectedIndex);
                }}
                wrapperHeight={250}
                selectedIndex={PrevValue}
                // wrapperWidth={50}

                wrapperBackground={'#FFFFFF'}
                highlightColor={'#d8d8d8'}
                highlightBorderWidth={2}
                activeItemColor={'#202020'}
                itemColor={'#202020'}
              />
              <Button
                title="      Ok     "
                style={styles.Okbutton}
                onPress={() => toggleSliderModal}></Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Calender;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    backgroundColor: '#f5f3f5',
    borderWidth: 5,
    borderColor: '#fff',
    borderStyle: 'solid',
    width: '70%',
    height: '40%',
  },
  touch: {
    backgroundColor: '#1b386a',
    padding: 10,
    width: '100%',
    marginTop: 30,
    zIndex: -1,
  },
  SectionStyle: {
    height: 50,
    marginLeft: 200,
    borderColor: 'white',
    width: '70%',
    marginTop: 50,
    marginBottom: -15,
  },
  inputStyle: {
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderColor: '#E8E8E8',
    marginLeft: 50,
    marginRight: -15,
  },
  SlideinputStyle: {
    color: '#5b5b5b',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderColor: '#E8E8E8',
    width: '50%',
  },
  close: {
    color: '#c2bdc2',
    backgroundColor: '#fffff',
    textAlign: 'right',
    marginRight: 20,
    fontSize: 20,
  },
  PlusbuttonStyle: {
    backgroundColor: '#1b386a',
    color: '#FFFFFF',
    height: 45,
    alignItems: 'flex-end',
    borderRadius: 30,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    width: 45,
    alignSelf: 'flex-end',
  },
  PlusbuttonTextStyle: {
    color: '#FFFFFF',
    marginRight: 10,
    marginTop: -10,
    fontSize: 36,
    fontWeight: 'bold',
  },
  ClosebuttonTextStyle: {
    color: '#FFFFFF',
    marginRight: 10,
    marginTop: -10,
    fontSize: 36,
    fontWeight: 'bold',
  },
  text: {
    marginLeft: 200,
    textAlign: 'center',
    fontSize: 25,
    color: '#1b386a',
    backgroundColor: '#fff',
    letterSpacing: 0,
    fontWeight: 'bold',

    // width:574
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#cbe91e',
    //padding: 100,
  },

  modalslide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#cbe91e',
    height: '30%',
    width: '100%',
    zIndex: 3, // works on ios
    elevation: 3, // works on andro
    backgroundColor: '#fff',
  },
  body: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 120,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    padding: 20,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    width: '100%',
  },
  label: {
    marginTop: 10,
  },
  pickercontainer: {
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: '10%',
    marginBottom: 20,
  },
  centeredView: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: "'rgba(0, 0, 0, 0.5)'",
  },
  modalView: {
    marginBottom: '0%',
    //margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: '50%',
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
});
