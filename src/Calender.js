import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, FlatList, Modal } from 'react-native'
import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { Calendar } from 'react-native-calendars';
import { RadioButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Footer from './Provider/Footer';
import { firebaseprovider } from './Provider/FirebaseProvider';
import firebase from './Config1';
export default class Calender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      isConnected: true,
      loading: false,
      unavailabe_arr: 'NA',
      unavailabe_arr1: 'NA',
      booking_arr: 'NA',
      editModalvisibal: false,
      disabled_type: 'All Boat',
      boat_arr: 'NA',
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this._getUnavailableData();
      this.getMyInboxAllData1();
    });

  }
  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.removeListener('focus', () => {
      console.log('remove lister')
    });
  }

  getMyInboxAllData1 = async () => {
    console.log('getMyInboxAllData');
    userdata = await localStorage.getItemObject('user_arr')
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      var id = 'u_' + userdata.user_id;
      if (inboxoffcheck > 0) {
        console.log('getMyInboxAllDatainboxoffcheck');
        var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
        queryOffinbox.off('child_added');
        queryOffinbox.off('child_changed');
      }

      var queryUpdatemyinbox = firebase.database().ref('users/' + id + '/myInbox/');
      queryUpdatemyinbox.on('child_changed', (data) => {
        console.log('inboxkachildchange', data.toJSON())

        firebaseprovider.firebaseUserGetInboxCount()
        setTimeout(() => { this.setState({ countinbox: count_inbox }) }, 2000);

        //  this.getalldata(currentLatlong)
      })
      var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
      queryUpdatemyinboxadded.on('child_added', (data) => {
        console.log('inboxkaadded', data.toJSON())
        firebaseprovider.firebaseUserGetInboxCount()
        setTimeout(() => { this.setState({ countinbox: count_inbox }) }, 2000);

        // firebaseprovider.firebaseUserGetInboxCount();
      })

    }
  }
  _getUnavailableData = async () => {
    if (this.state.isConnected === true) {
      this.setState({ loading: true })
      let result = await localStorage.getItemObject('user_arr')
      let user_id_post = 0;
      if (result != null) {
        user_id_post = result.user_id;
      }
      let url = config.baseURL + "unavailable_list.php?user_id_post=" + user_id_post;
      console.log('url--', url);
      apifuntion.getApi(url).then((obj) => {
        this.setState({ loading: false });
        return obj.json();
      }).then((obj) => {
        console.log('Boat_arr', obj)
        //  alert(JSON.stringify(obj))
        if (obj.success == 'true') {
          console.log('unavailabe_arr===', obj);
          let unavai_arr = obj.unavailabe_arr;
          let unavailabe_arr1 = obj.calender_arr;
          let booking_arr = obj.booking_arr;
          let boat_arr = obj.boat_arr;
          console.log('calender===', unavailabe_arr1);
          this.setState({
            unavailabe_arr: unavai_arr,
            unavailabe_arr1: unavailabe_arr1,
            booking_arr: booking_arr,
            boat_arr: boat_arr,
          })
        } else {
          if (obj.account_active_status == "deactivate") {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        console.log("-------- error ------- " + error);
        this.setState({ loading: false });
        //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
      })
    } else {
      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
    }
  }


  _deleteDate = async (unavailable_id) => {
    if (this.state.isConnected === true) {
      this.setState({ loading: true })
      let result = await localStorage.getItemObject('user_arr')
      let user_id_post = 0;
      if (result != null) {
        user_id_post = result.user_id;
      }
      let url = config.baseURL + "unavailable_delete.php?user_id_post=" + user_id_post + "&unavailable_id=" + unavailable_id;
      console.log('url--', url);
      apifuntion.getApi(url).then((obj) => {
        this.setState({ loading: false });
        return obj.json();
      }).then((obj) => {
        console.log('Boat_arr', obj)
        //  alert(JSON.stringify(obj))
        if (obj.success == 'true') {
          console.log('unavailabe_arr===', obj);
          let unavai_arr = obj.unavailabe_arr;
          let unavailabe_arr1 = obj.calender_arr;
          let booking_arr = obj.booking_arr;
          console.log('calender===', unavailabe_arr1);
          this.setState({
            unavailabe_arr: unavai_arr,
            unavailabe_arr1: unavailabe_arr1,
            booking_arr: booking_arr,
          })

        } else {
          if (obj.account_active_status == "deactivate") {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        console.log("-------- error ------- " + error);
        this.setState({ loading: false });
        //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
      })
    } else {
      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
    }
  }

  _btnSubmitDate = async () => {
    let date = this.state.date;

    let boat_arr = this.state.boat_arr;
    let selected_ids = [];

    if (this.state.disabled_type == 'Selected Boat') {
      if (boat_arr != 'NA') {
        for (let i = 0; i < boat_arr.length; i++) {
          let boat_id = boat_arr[i].boat_id;
          let boat_status = boat_arr[i].status;
          if (boat_status == true) {
            selected_ids.push(boat_id)
          }
        }
      }
    }

    if (this.state.disabled_type == 'All Boat') {
      if (boat_arr != 'NA') {
        for (let i = 0; i < boat_arr.length; i++) {
          let boat_id = boat_arr[i].boat_id;
          selected_ids.push(boat_id)
        }
      }
    }
    console.log('innside boat_arr', selected_ids);
    if (selected_ids.length == 0) {
      msgProvider.toast(Lang_chg.empty_boat_ids[config.language], 'center')
      return false
    }
    // alert(selected_ids.toString());



    if (this.state.isConnected === true) {
      this.setState({ loading: true })
      let result = await localStorage.getItemObject('user_arr')
      let user_id_post = 0;
      if (result != null) {
        user_id_post = result.user_id;
      }

      let url = config.baseURL + "unavailable_add.php?user_id_post=" + user_id_post + "&dates=" + date + "&selected_ids=" + selected_ids.toString() + "&selected_type=" + this.state.disabled_type;

      console.log('url--', url);
      apifuntion.getApi(url).then((obj) => {
        this.setState({ loading: false });
        return obj.json();
      }).then((obj) => {
        console.log('Boat_arr', obj)
        //  alert(JSON.stringify(obj))
        if (obj.success == 'true') {
          console.log('unavailabe_arr123===', obj);
          let unavailabe_arr = obj.unavailabe_arr;
          let unavailabe_arr1 = obj.calender_arr;
          let booking_arr = obj.booking_arr;
          console.log('calender===', unavailabe_arr1);
          this.setState({
            unavailabe_arr: unavailabe_arr,
            unavailabe_arr1: unavailabe_arr1,
            booking_arr: booking_arr,
            date: '',
            editModalvisibal: false,
            disabled_type: 'All Boat',
          })

        } else {
          if (obj.account_active_status == "deactivate") {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        console.log("-------- error ------- " + error);
        this.setState({ loading: false });
        //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
      })
    } else {
      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
    }
  }


  renderItem = ({ item, key }) => {
    return (
      <View style={{ width: '100%', borderBottomColor: '#d15400', borderBottomWidth: 1, marginBottom: 10, paddingBottom: 10 }}>
        <View style={styles.view_date_box}>
          <View style={styles.unbiility_delete}>
            <TouchableOpacity onPress={() => { this._deleteDate(item.unavailable_id) }}>
              <Image style={styles.delete_date} source={require('./icons/delete.png')}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.unbiility_date}>
            <Text style={styles.unbiility_title_date}>{item.date}</Text>
            <Image style={styles.calender_img} source={require('./icons/calender.png')}></Image>
          </View>
        </View>
        <Text style={{ alignSelf: 'flex-end' }}>{item.boat_name}</Text>
      </View>

    )
  }

  selectBoat = (index) => {
    let data = this.state.boat_arr;
    this.state.boat_arr[index].status = !this.state.boat_arr[index].status;
    this.setState({ boat_arr: [...this.state.boat_arr] })
  }



  OpenBoatModal = (date) => {

    if (date.length <= 0) {
      msgProvider.toast(Lang_chg.emptydate[config.language], 'center')
      return false
    }

    if (this.state.booking_arr != 'NA') {
      var ind1 = this.state.booking_arr.findIndex(x => x.date == date);
      if (ind1 >= 0) {
        msgProvider.toast(Lang_chg.already_booked_txt[config.language], 'center')
        return false;
      }
    }

    if (this.state.unavailabe_arr != 'NA') {
      var ind = this.state.unavailabe_arr.findIndex(x => x.date == date);
      if (ind >= 0) {
        msgProvider.toast(Lang_chg.already_dis_txt[config.language], 'center')
        return false;
      }
    }
    this.setState({ editModalvisibal: true, date: date })
  }


  render() {
    return (
      <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
        <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
          networkActivityIndicatorVisible={true} />
        <Loader loading={this.state.loading} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.editModalvisibal}
          // visible={true}

          onRequestClose={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}
        >
          <StatusBar barStyle='default' hidden={false} translucent={false}
            networkActivityIndicatorVisible={true} />
          <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
          <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
              networkActivityIndicatorVisible={true} />
            <View style={{ flex: 1, backgroundColor: "#ffffff", width: "100%", paddingTop: 20, paddingBottom: 90 }}>
              <View style={styles.header_earnig}>
                <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}>
                  <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.earnig_title}></Text>
                <Text></Text>
              </View>

              <View style={{ marginHorizontal: 20 }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ disabled_type: 'All Boat' }) }} style={{ flexDirection: 'row', alignItems: "center" }}>
                  <RadioButton
                    value="All Boat"
                    color="#d15400"
                    status={this.state.disabled_type === 'All Boat' ? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ disabled_type: 'All Boat' }) }}
                  />
                  <Text style={{ fontSize: 18, fontFamily: "Ubuntu-Bold" }}>{Lang_chg.txt_all[config.language]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} activeOpacity={0.7} onPress={() => { this.setState({ disabled_type: 'Selected Boat' }) }}>
                  <RadioButton
                    value="Selected Boat"
                    color="#d15400"
                    status={this.state.disabled_type === 'Selected Boat' ? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ disabled_type: 'Selected Boat' }) }}
                  />
                  <Text style={{ fontSize: 18, fontFamily: "Ubuntu-Bold", }}>{Lang_chg.txt_select_boat[config.language]}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView>
                {
                  (this.state.boat_arr != 'NA' && this.state.disabled_type == "Selected Boat") ?
                    this.state.boat_arr.map((item, index) => (
                      <TouchableOpacity style={(item.status == true) ? styles.boat_number1 : styles.boat_number} onPress={() => { this.selectBoat(index) }}>
                        <View style={styles.boat_detail}>
                          <Text style={styles.boat_year} numberOfLines={1}>{Lang_chg.Year_txt[config.language]} - {item.manufacturing_year}</Text>
                          <Text style={styles.boat_capicity} numberOfLines={1}>{Lang_chg.Capacity_Maximum_Persons_txt[config.language]}({item.boat_capacity})</Text>
                        </View>

                        <View style={styles.boat_right}>
                          <Text style={styles.boat_right_number} numberOfLines={1}>{item.name}</Text>
                          <Text style={{ color: '#999', }} numberOfLines={1}>{item.registration_no}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                    :
                    null
                }

              </ScrollView>
              <TouchableOpacity style={[styles.login_btn1, { position: 'absolute', bottom: 0 }]} onPress={() => { this._btnSubmitDate() }} activeOpacity={0.7}>
                <Text style={styles.log_txt_btn}>
                {Lang_chg.txt_Forgot_Pass3[config.language]}
                </Text>
              </TouchableOpacity>


            </View>
          </View>
        </Modal>
        <View style={styles.widro_header}>
          <Text style={styles.calrnder_title}>{Lang_chg.managae_avail_txt[config.language]}</Text>
        </View>
        <View>
          <Calendar
            theme={{
              todayTextColor: '#d15400',
              arrowColor: '#d15400',
            }}


            markedDates={this.state.unavailabe_arr1}
            onDayPress={(day) => { this.OpenBoatModal(day.dateString) }}
          />
          {/* this.setState({editModalvisibal:true,date:day.dateString}) */}
        </View>


        <View style={styles.calendar_unbaility}>
          <Text style={styles.unbiility_title}>{Lang_chg.unavailibit_txt[config.language]}</Text>
          {
            (this.state.unavailabe_arr != 'NA') ?
              <FlatList
                data={this.state.unavailabe_arr}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                inverted={false}
                renderItem={this.renderItem}
                keyExtractor={(index) => { index.toString() }}
              />
              :

              <View style={[styles.upcoming_main, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                <Image source={require('./icons/ic_notfound.png')} style={{ height: '50%', width: '50%', resizeMode: 'contain', tintColor: '#d15400', marginTop: -90 }} />
              </View>

          }
        </View>




        <Footer
          activepage='Calender'
          usertype={1}
          footerpage={[
            { name: 'Home', countshow: false, image: require('./icons/home.png'), activeimage: require('./icons/home_active.png') },
            { name: 'Manage_o', countshow: false, image: require('./icons/manage.png'), activeimage: require('./icons/manage_active.png') },
            { name: 'Inbox', countshow: true, image: (count_inbox <= 0) ? require('./icons/chat1.png') : require('./icons/chat.png'), activeimage: (count_inbox <= 0) ? require('./icons/deactive_caht.png') : require('./icons/chat_active.png') },
            { name: 'Calender', countshow: true, image: require('./icons/calender1.png'), activeimage: require('./icons/calender.png') },
            { name: 'Profile', countshow: false, image: require('./icons/profile.png'), activeimage: require('./icons/profile_active.png') },
          ]}
          navigation={this.props.navigation}
          imagestyle1={{ width: 25, height: 25, backgroundColor: '#fff', countcolor: 'white', countbackground: 'black' }}
          count_inbox={count_inbox}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  header_earnig: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20
  },
  select_back: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  calrnder_title: {
    fontSize: 18,
    fontFamily: "Ubuntu-Bold",
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  earnig_title: {
    fontSize: 18,
    fontFamily: "Ubuntu-Bold",
    fontWeight: 'bold',
  },
  widro_header: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  login_btn1: {
    backgroundColor: '#d15400',
    width: '90%',
    alignSelf: 'center',
    height: 60,
    borderRadius: 15,
    marginTop: 40,
    marginBottom: 30,
  },
  log_txt_btn: {
    lineHeight: 60,
    textAlign: 'center',
    fontFamily: "Ubuntu-Bold",
    fontSize: 17,
    color: 'white'
  },
  unbiility_title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 30,
  },
  calendar_unbaility: {
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    paddingRight: 20,
    paddingTop: 20,
    paddingLeft: 20,
    flex: 1,
  },
  view_date_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unbiility_date: {
    flexDirection: 'row',
  },
  calender_img: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  unbiility_title_date: {
    fontSize: 16,
    color: '#767070',
  },
  delete_date: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  manage_calender_title: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },

  login_input_pass: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#d15400',
    backgroundColor: '#fff',
    marginBottom: 0,
    marginTop: 10,
    alignSelf: 'center',
  },
  boat_right_number: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
    fontWeight: 'bold',
  },
  boat_detail: {
    width: '70%',
    alignItems: 'flex-start'
  },
  boat_right: {
    width: '30%',
    alignItems: 'flex-end'
  },
  boat_number: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#d15400',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    marginHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  boat_number1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#d15400',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d15400",
    borderRadius: 10,
    marginHorizontal: 30,
    marginBottom: 10,
  },
})