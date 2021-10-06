import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar, } from 'react-native'

import { AppProvider, AppConsumer } from './src/context/AppProvider';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { firebaseprovider } from './src/Provider/FirebaseProvider';
import Splash from './src/Splash';
import Login from './src/Login';
import Forgot from './src/Forgot';
import Signup from './src/Signup';
import Home from './src/Home';
import Manage_o from './src/Manage_o';
import Inbox from './src/Inbox';
import Calender from './src/Calender';
import Profile from './src/Profile';
import Ongoing from './src/Ongoing';
import Upcoming from './src/Upcoming';
import Boat_detail from './src/Boat_detail';
import Detail_boat_dt from './src/Detail_boat_dt';
import Select_boats_manage from './src/Select_boats_manage';
import Add_boats_copy from './src/Add_boats_copy';
import Widro from './src/Widro';
import WithdrawalRequest from './src/WithdrawalRequest';
import Total_earnings from './src/Total_earnings';
import Setting from './src/Setting';
import Edit_profile from './src/Edit_profile';
import Change_pass from './src/Change_pass';
import Terms from './src/Terms';
import Privacy_policy from './src/Privacy_policy'
import About from './src/About'
import Contact from './src/Contact'
import Select_language from './src/Select_language'
import Add_bank from './src/Add_bank'
import History from './src/History'
import Ratings from './src/Ratings'
import Notification_setings from './src/Notification_setings'
import Upcoming_blank from './src/Upcoming_blank'
import Add_advertisement from './src/Add_advertisement'
import Add_boats from './src/Add_boats'
import Notificatiions from './src/Notificatiions'
import Termcondition from './src/Termcondition';
import Map_show from './src/Map_show';
import Edit_advertisement from './src/Edit_advertisement';
import Edit_boat from './src/Edit_boat';
import BookingDateUpdate from './src/BookingDateUpdate';
import HomeSearch from './src/HomeSearch';
import Edit_bank from './src/Edit_bank';
import Chat from './src/Chat';


const Toptab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
// const BottomTabar = createBottomTabNavigator();
const Stacknav = (navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
    >
      <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
      <Stack.Screen name='Chat' component={Chat} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Forgot' component={Forgot} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
      <Stack.Screen name='Manage_o' component={Manage_o} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Inbox' component={Inbox} options={{ headerShown: false, }}></Stack.Screen>
      <Stack.Screen name='Calender' component={Calender} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Boat_detail' component={Boat_detail} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Detail_boat_dt' component={Detail_boat_dt} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Select_boats_manage' component={Select_boats_manage} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Add_boats_copy' component={Add_boats_copy} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Widro' component={Widro} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='WithdrawalRequest' component={WithdrawalRequest} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Total_earnings' component={Total_earnings} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Setting' component={Setting} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Edit_profile' component={Edit_profile} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Change_pass' component={Change_pass} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Terms' component={Terms} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Privacy_policy' component={Privacy_policy} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='About' component={About} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Contact' component={Contact} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Select_language' component={Select_language} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Add_bank' component={Add_bank} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='History' component={History} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Ratings' component={Ratings} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Notification_setings' component={Notification_setings} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Upcoming_blank' component={Upcoming_blank} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Add_advertisement' component={Add_advertisement} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Add_boats' component={Add_boats} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Notificatiions' component={Notificatiions} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Termcondition' component={Termcondition} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Map_show' component={Map_show} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Edit_advertisement' component={Edit_advertisement} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Edit_boat' component={Edit_boat} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='BookingDateUpdate' component={BookingDateUpdate} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='HomeSearch' component={HomeSearch} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Edit_bank' component={Edit_bank} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>

  );
}


// const BottomTab = () => {
//   return (
//     <BottomTabar.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;
//           if (route.name === 'Home') {
//             iconName = focused
//               ? require('./src/icons/home_active.png')
//               : require('./src/icons/home.png');
//           } else if (route.name === 'Manage_o') {
//             iconName = focused ? require('./src/icons/manage_active.png')
//               : require('./src/icons/manage.png');
//           } else if (route.name === 'Inbox') {
//             iconName = focused ? require('./src/icons/chat_active.png')
//               : require('./src/icons/chat.png');
//           } else if (route.name === 'Calender') {
//             iconName = focused ? require('./src/icons/calender.png')
//               : require('./src/icons/calender1.png');
//           }
//           else if (route.name === 'Profile') {
//             iconName = focused ? require('./src/icons/profile_active.png')
//               : require('./src/icons/profile.png');
//           }
//           // You can return any component that you like here!
//           return <Image source={iconName} style={{ width: 25, height: 25, resizeMode: 'contain' }}></Image>;
//         },
//       })}
//       tabBarOptions={{ showLabel: false, style: { height: 60 } }}
//     >
//       <BottomTabar.Screen name='Home' component={Home}></BottomTabar.Screen>
//       <BottomTabar.Screen name='Manage_o' component={Manage_o}></BottomTabar.Screen>
//       <BottomTabar.Screen name='Inbox' component={Inbox}></BottomTabar.Screen>
//       <BottomTabar.Screen name='Calender' component={Calender}></BottomTabar.Screen>
//       <BottomTabar.Screen name='Profile' component={Profile}></BottomTabar.Screen>

//     </BottomTabar.Navigator>
//   );
// };



const Toptabbar = () => {
  return (

    <Toptab.Navigator
      style={{ marginTop: 0, height: 90, }}
      tabBarOptions={{
        labelStyle: { fontSize: 15, fontWeight: "700", },
        style: { alignSelf: 'center', width: '100%', elevation: 0, shadowOpacity: 0, height: 55, marginTop: 100, borderBottomWidth: 0, },
        indicatorStyle: { width: '50%', backgroundColor: '#da5a04', color: 'red', height: 55, },
      }}
    >
      <Toptab.Screen name="Ongoing" component={Ongoing} style={{ activeTintColor: 'red', }} />
      <Toptab.Screen name="Upcoming" component={Upcoming} />
    </Toptab.Navigator>);
};


class App extends Component {
  componentDidMount() {
    firebaseprovider.getAllUsers()
  }
  render() {
    return (
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <AppProvider {...this.props}>
            <AppConsumer>{funcs => {
              global.props = { ...funcs }
              return <Stacknav />
            }}
            </AppConsumer>
          </AppProvider>
        </SafeAreaView>
      </NavigationContainer>
    );
  }
}
export default App;
