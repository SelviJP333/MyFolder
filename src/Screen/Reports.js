import {View, Text, SafeAreaView} from 'react-native';

import color from '../constants/color';

function Reports({navigation}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: color.bluefontcolor}}>
          Welcome to Reports Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Reports;
