import * as React from 'react';
import {Button, Image, Text, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import Create_Weekend from '../Components/Create_Weekend'; 
import FirstPage from '../Screen/HomeScreen';
import HomeScreen from '../Screen/HomeScreen';
import TimeSheetScreen from "./TimeSheetScreen";
import SendReport from '../Screen/SendReport';
import MyEwa from '../Screen/HomeScreen';
import EditTimeSheetScreen from "./EditTimeSheetScreen";
import LoginScreen from './LoginScreen';

//import our Custom Icon menu component
import CustomMaterialMenu from '../Components/NavigationDrawerHeader';

const Stack = createNativeStackNavigator();

function DrawerNavigationRoutes() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="FirstPage"
        screenOptions={({route, navigation}) => ({
          headerLeft: () => (
            <Image
              source={require('../Image/logo-inner.png')}
              style={{
                width: 150,
                height: 30,
                resizeMode: 'contain',
              }}
            />
          ),
          headerRight: () => (
            <CustomMaterialMenu
              menuText="Menu"
              textStyle={{color: 'white'}}
              navigation={navigation}
              route={route}
              isIcon={true}
            />
          ),
        })}>
        <Stack.Screen
          name="FirstPage"
          component={FirstPage}
          options={{
            title: 'My Timesheets', //Set Header Title
            headerStyle: {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff', //Set Header color
            },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              left: 10,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
         <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "DASHBOARD", //Set Header Title
          // headerLeft: () => (
          //   // <NavigationDrawerHeader navigationProps={navigation} />
          // ),
          headerStyle: {
            backgroundColor: "#FFF", //Set Header color
          },
          headerTintColor: "#0047AB", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            paddingBottom: 15, //Set Header text style
          },
        }}
      />
        <Stack.Screen
          name="TimeSheetScreen"
          component={TimeSheetScreen}
          options={{
            title: 'Timesheet', //Set Header Title
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
          <Stack.Screen
           name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown:false,
          //  title: 'LoginScreen', //Set Header Title
            // headerStyle: {
            //   backgroundColor: '#fff', //Set Header color
            // },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="MyEwa"
          component={MyEwa}
          options={{
            title: 'MyEwa', //Set Header Title
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="SendReport"
          component={SendReport}
          options={{
            title: 'Report', //Set Header Title
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
         <Stack.Screen
        name="EditTimeSheetScreen"
        component={EditTimeSheetScreen}
        options={{
          title: "EditTimesheet", //Set Header Title
          headerLeft: () => (
            <Header navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#FFF", //Set Header color
          },
          headerTintColor: "#0047AB", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 40, 
            textAlign:'center'
          },
        }}
      />
        <Stack.Screen
          name="Create_Weekend"
          component={Create_Weekend}
          options={{
            title: 'My Timesheets', //Set Header Title
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            headerTintColor: '#063970', //Set Header text color
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default DrawerNavigationRoutes;
