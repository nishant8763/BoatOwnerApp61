import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'

import { config } from './Provider/configProvider';
import { localStorage } from './Provider/localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
// import Footer from './Footer';
import { apifuntion } from './Provider/apiProvider';
import { Lang_chg } from './Provider/Language_provider'
import { firebaseprovider } from './Provider/FirebaseProvider';
import firebase from './Config1';
import NetInfo from '@react-native-community/netinfo';
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, ImageBackground, FlatList } from 'react-native'
import Colors from './Colors'
import { consolepro } from './Provider/Consoleprovider';
import Footer from './Provider/Footer';
// import { Nodata_found } from './Nodata_found';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      isConnected: true,
      loadMoreloading: false,
      pagename: 'inbox',
      page: 'message',
      inboxmessage: [],
      loading: false,
      idex1: 0,
      modalVisible1: false,
      user_id: '',
      notification_arr: 'NA',
      refresh: false,
    }
  }
  // state = {
  //     data: [
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/salini.png'),
  //             message:'hello how are you'

  //         },
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/elish.png'),
  //             message:'David please release amount'
  //         },
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/salini.png'),
  //             message:'hello how are you'
  //         },
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/elish.png'),
  //             message:'hello how are you'

  //         },
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/salini.png'),
  //             message:'hello how are you'
  //         },
  //         {
  //             name: 'Jane',
  //             age: '33',
  //             image: require('./icons/elish.png'),
  //             message:'hello how are you'

  //         },
  //         {
  //             name: 'Waplog Team',
  //             age: '33',
  //             image: require('./icons/elish.png'),
  //             message:'Welcome'

  //         }
  //     ],
  // }


  componentDidMount() {



    this.props.navigation.addListener('focus', () => {
      this.getMyInboxAllData1()
      this.showUserInbox()
    });
    //  const { navigation } = this.props;
    //  this.focusListener = navigation.addListener('didFocus', () => {
    //   this.showUserInbox()
    //   firebaseprovider.firebaseUserGetInboxCount();
    //  });
    this.getMyInboxAllData1()
    firebaseprovider.firebaseUserGetInboxCount();
    this.showUserInbox()
    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected })
    });
    //Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected })
    });
  }
  getMyInboxAllData1 = async () => {

    consolepro.consolelog('getMyInboxAllData123');
    userdata = await localStorage.getItemObject('user_arr')
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      var id = 'u_' + userdata.user_id;
      consolepro.consolelog('inboxoffcheck', inboxoffcheck)
      if (inboxoffcheck > 0) {
        consolepro.consolelog('getMyInboxAllDatainboxoffcheck');
        var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
        // queryOffinbox.off('child_added');
        queryOffinbox.off('child_changed');
      }

      var queryUpdatemyinboxmessage = firebase.database().ref('users/' + id + '/myInbox/');
      queryUpdatemyinboxmessage.on('child_changed', (data) => {
        consolepro.consolelog('inboxkachildchangemessage', data.toJSON())
        setTimeout(() => { this.showUserInbox() }, 3000);


      })
      var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
      queryUpdatemyinboxadded.on('child_added', (data) => {
        consolepro.consolelog('inboxkaadded', data.toJSON())
        setTimeout(() => { this.showUserInbox() }, 3000);

        // firebaseprovider.firebaseUserGetInboxCount();
      })
    }
  }


  convertTimeAllFormat = (time11, format) => {
    consolepro.consolelog(' convertTimeAllFormat time11', time11)
    time11 = parseInt(time11);

    var date1 = new Date(time11);

    var curr_day = date1.getDay();
    var curr_date = date1.getDate();
    var curr_month = date1.getMonth(); //Months are zero based
    var curr_year = date1.getFullYear();

    var hours = date1.getHours();
    var minutes = date1.getMinutes();

    // consoleProvider.log('hours',hours);
    // consoleProvider.log('minutes',minutes);

    if (format == 12) {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
    } else if (format == 24) {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      //hours = hours < 10 ? '0'+hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes;
    } else if (format == 'other') {

      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTimeAll = hours + ':' + minutes + ' ' + ampm;
      var strTime = curr_date + '. ' + m_names_sort[curr_month] + ' ' + curr_year + ' ' + strTimeAll;
    } else if (format == 'ago') {
      var strTime = timeSince(new Date(time11));
      //consoleProvider.log(new Date(time11));
    } else if (format == 'date_time') {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        consolepro.consolelog('curr_year_small', curr_year_small);
        curr_year_small = curr_year_small.substring(2, 4);
        consolepro.consolelog('curr_year_small', curr_year_small);
        var strTime = curr_month + '/' + curr_date + '/' + curr_year_small;
      }
    }
    else if (format == 'date_time_full') {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        consolepro.consolelog('curr_year_small', curr_year_small);
        curr_year_small = curr_year_small.substring(2, 4);
        consolepro.consolelog('curr_year_small', curr_year_small);

        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTimeAll = hours + ':' + minutes + ' ' + ampm;

        var strTime = curr_month + '/' + curr_date + '/' + curr_year_small + ' ' + strTimeAll;
      }

    }

    return strTime;
  }

  showUserInbox = async () => {
    consolepro.consolelog('showUserInboxmesssagepabgewala');
    let userdata = await localStorage.getItemObject('user_arr')
    var user_id = userdata.user_id
    var login_type = userdata.login_type
    inboxoffcheck = 1
    var inbox = []
    consolepro.consolelog('FirebaseInboxJson get in-box121', FirebaseInboxJson);
    var len = FirebaseInboxJson.length;
    consolepro.consolelog('FirebaseInboxJson len', len);
    //$('.showConversationsCount').text(len);
    if (len > 0) {
      // $('#chat_meassage_inbox_list').html('');
      // $('#no_data_home').hide()
      FirebaseInboxJson.sort((a, b) => {
        var x = a.lastMsgTime, y = b.lastMsgTime;
        return x > y ? -1 : x < y ? 1 : 0;
      });
      consolepro.consolelog('FirebaseInboxJsonmessage', FirebaseInboxJson);
      console.log('FirebaseInboxJsonmessage', FirebaseInboxJson);
      let other_user_id55 = 0
      // $.each(FirebaseInboxJson,function(index,keyValue)
      for (let k = 0; k < FirebaseInboxJson.length; k++)
      // FirebaseInboxJson.map((keyValue)=>
      {
        let keyValue = FirebaseInboxJson[k]
        if (keyValue.user_id != other_user_id55) {
          consolepro.consolelog('message user_id', keyValue);
          var other_user_id = keyValue.user_id;
          var blockstatus = keyValue.block_status
          other_user_id55 = keyValue.user_id;
          consolepro.consolelog('other_user_id55', other_user_id55)
          consolepro.consolelog('other_user_id', other_user_id)
          consolepro.consolelog('FirebaseUserJson', FirebaseUserJson);
          var user_data_other = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
          consolepro.consolelog("user_data_other", user_data_other);
          if (user_data_other != -1) {
            var userDataMe = FirebaseUserJson[user_data_other];

            consolepro.consolelog('userdata', userDataMe)
            var count = keyValue.count;
            var lastMessageType = keyValue.lastMessageType;
            var lastMsg = keyValue.lastMsg;
            var lastMsgTime = keyValue.lastMsgTime;
            // var order_id=keyValue.order_id;
            // var order_number=keyValue.order_number;
            // var chat_type=keyValue.chat_type;

            consolepro.consolelog('lastMsg', lastMsg);
            var userId = userDataMe.user_id;
            if (userDataMe.login_type == 'app') {
              var userImage = config.img_url + userDataMe.image;
            }
            else {
              var userImage = userDataMe.image;
            }

            var userName = userDataMe.name;
            var onlineStatus = userDataMe.onlineStatus;

            var lastMsgShow = '';
            if (lastMessageType == 'text') {
              lastMsgShow = lastMsg;
            } else if (lastMessageType == 'image') {
              lastMsgShow = 'Photo';
            }

            var imgOnline = '';
            // if(onlineStatus == 'true'){
            //   var imgOnline='<img src="img/msg_green_dot.png" class="msg_green_dot">';
            // }
            var countHtml = '';
            consolepro.consolelog('lastMsgTime', lastMsgTime);
            if (lastMsgTime != '') {
              lastMsgTime = this.convertTimeAllFormat(lastMsgTime, 'date_time');
              // lastMsgTime=lastMsgTime
              countHtml = '';
            } else {
              lastMsgTime = '';
            }
            if (count > 0) {
              countHtml = count;
            }
            let data5 = {
              'name': userName,
              'images': userImage,
              'message': lastMsgShow,
              'time': lastMsgTime,
              'count': count,
              'other_user_id': other_user_id,
              'blockstatus': blockstatus,
              'vip_staus_me': userdata.vip_staus_me

            };
            consolepro.consolelog('lastMsgShowlastMsgShow', lastMsgShow);
            consolepro.consolelog('nilesh1 count', count);
            consolepro.consolelog('upervalapushdataconsole', data5)

            inbox.push(data5)
            consolepro.consolelog('pushdataconsoleafter', inbox)


            /*var htmlData = '<li class="item-content chat_list_'+other_user_id+'" id="chat_list_'+other_user_id+'">'+
              '<a href="/chat/'+other_user_id+'/'+userName+'/" class="item-link">'+
                '<span><img src="'+userImage+'" '+onerror_user_placeholder+'  /></span>'+
                '<content>'+
                  '<h3>'+userName+'</h3>'+
                  '<p class="lastMsgShow_'+other_user_id+'" id="lastMsgShow_'+other_user_id+'">'+lastMsgShow+'</p>'+
                '</content>'+
                '<time id="lastMsgTime_'+other_user_id+'">'+lastMsgTime+'</time>'+
                '<span id="unreadMsgCount_'+other_user_id+'">'+countHtml+'</span>'+
              '</a>'+
            '</li>';*/


            //  var onerror="this.src='img/error_default_image121.png'";
            // var htmlData = '<li id="chat_list_'+other_user_id+'_'+keyValue.order_number+'" data-position="'+keyValue.lastMsgTime+'">'+
            //    '<a href="/chat/'+other_user_id+'/'+keyValue.order_id+'/'+keyValue.order_number+'/'+keyValue.chat_type+'/">'+
            //     '<time>'+lastMsgTime+'</time>'+
            //     '<span> <img src="'+userImage+'" onerror="'+onerror+'"></span>'+
            //     '<content>'+
            //       '<h2>#'+keyValue.order_number+'</h2>'+
            //       '<h3>'+userName+'</h3>'+
            //       '<h4>'+lastMsgShow+'</h4>'+
            //     '</content>'+
            //     countHtml+
            //   '</a>'+
            //   '</li>';

            // consolepro.consolelog('nilesh2');
            // if (chat_type == 'o') {
            //   $('#chat_meassage_inbox_list').append(htmlData);
            //   $('#chat_meassage_inbox_list li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list');
            // }else if (chat_type == 's') {
            //   $('#chat_meassage_inbox_list_service').append(htmlData);
            //   $('#chat_meassage_inbox_list_service li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list_service');
            // }

          }
          consolepro.consolelog('inboxmessage', inbox)


        }

        // var length = $('#chat_meassage_inbox_list li').length;
        // var length2 = $('#chat_meassage_inbox_list_service li').length;

        // if(length==0){
        //   $('#no_data_home_order').show();    
        // }else{
        //   $('#no_data_home_order').hide();
        // }
        // if(length2==0){
        //   $('#no_data_home_service').show();    
        // }else{
        //   $('#no_data_home_service').hide();
        // }
      }
    }
    this.setState({ inboxmessage: inbox, inboxmessage2: inbox, refresh: false })
    // this.setState({inboxmessage:'NA'}) 
    // }else{
    //   $('#chat_meassage_inbox_list').html('<li class="no_found_img"><img src="img/no-result.gif" style="width: 100%;"></li>');
    //  $('#no_data_home_order').show();
    //   $('#no_data_home_service').show();
    // }
  }
  SearchFilterFunction = (text) => {
    //passing the inserted text in textinput
    let data1 = this.state.inboxmessage2
    const newData = data1.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    consolepro.consolelog(newData)
    if (newData.length > 0) {
      this.setState({
        inboxmessage: newData,
        search: text,

      });
    }
    else {
      this.setState({
        inboxmessage: 'NA',
        search: text,

      });
      this.setState({ msg: 'This Type of data is not available' })
    }

  }
  _onRefresh = () => {
    this.setState({ refresh: true })
    this.showUserInbox()
  }

  loadMore = () => {
    consolepro.consolelog('vikas')
    if (this.state.notification_arr != 'NA') {
      this.setState({
        loadMoreloading: true, page: this.state.page + 1
      }, () => {
        this.getallnotification1()
      });
    }
  }

  checkfreindstatus = async (item) => {
    let userdata = await localStorage.getItemObject('user_arr')
    let user_id = userdata.user_id
    if (this.state.isConnected == true) {
      let url = config.baseURL + "check_friendstateus.php?user_id=" + user_id + '&other_user_id=' + item.other_user_id
      consolepro.consolelog(url)
      apifuntion.getApi(url).then((obj) => {
        return obj.json();
      }).then((obj) => {
        consolepro.consolelog('obj', obj)
        console.log('obj', item)
        if (obj.success == "true") {

          if (item.vip_staus_me == 1 || obj.friend_status == 1 || obj.vip_staus_me == 1) {
            this.props.navigation.navigate('Chat', { 'chatdata': { 'other_user_id': item.other_user_id, 'other_user_name': item.name, 'image': item.images, blockstatus: item.blockstatus } })
          }
          else {
            this.props.navigation.navigate('Becomevip')
          }

        } else {
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        consolepro.consolelog("-------- error ------- " + error);
        this.setState({ loading: false });
      });
    }
    else {
      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
    }
  }

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.state.loadMoreloading == true) {
      return (
        <ActivityIndicator
          style={{ color: '#000' }}
        />
      );

    }
    else {
      return null
    }
  };

  renderitem = ({ item }) => {
    if (this.state.inboxmessage.length >= 0) {
      consolepro.consolelog('item.image', item.images)
      consolepro.consolelog('titleee-', item)
      return (
        <View style={{ width: '100%', alignSelf: 'center',backgroundColor:"#ffffff" }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Chat', { chatdata: { 'other_user_name': item.name, image: item.images, other_user_id: item.other_user_id, 'blockstatus': 'no' } },) }}>
            <View style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', width: '100%', borderWidth: 0.5, borderColor: '#cfcfcf' }}>
              <View style={{ width: '15%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                {item.images == undefined ?
                  <ImageBackground imageStyle={{ borderRadius: 20 }} style={{ width: 40, height: 40, resizeMode: 'cover' }} source={require('./icons/error.png')}>
                  </ImageBackground> :
                  item.images == 'NA' ?
                    <ImageBackground imageStyle={{ borderRadius: 20 }} style={{ width: 40, height: 40, resizeMode: 'cover' }} source={require('./icons/error.png')}>
                    </ImageBackground> :
                    item.images == null ?
                      <ImageBackground imageStyle={{ borderRadius: 20 }} style={{ width: 40, height: 40, resizeMode: 'cover' }} source={require('./icons/error.png')}>
                      </ImageBackground> :
                      <ImageBackground imageStyle={{ borderRadius: 20 }} style={{ width: 40, height: 40, resizeMode: 'cover' }} source={{ uri: config.img_url1 + item.images }}>
                      </ImageBackground>
                }

              </View>

              <View style={{ marginLeft: 10, width: '65%', alignSelf: 'center', }}>
                <Text style={{ fontSize: 18, fontFamily: 'Ubuntu-Bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Ubuntu-Regular' }}>{item.message}</Text>
              </View>
              <View style={{ width: '20%', alignSelf: 'center', alignItems: 'flex-end', right: 19 }}>
                {item.count != 0 && <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', width: 24, height: 24, borderRadius: 12 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Ubuntu-Regular' }}>{item.count}</Text>
                </View>}
                <Text style={{ fontSize: 13, fontFamily: 'Ubuntu-Regular' }}>{item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }


  render() {
    return (
      <View style={{ backgroundColor:'#ffffff', flex: 1 }}>
        <ScrollView>
          <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', width: '100%', paddingVertical: 15 }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
              <Image style={{ resizeMode: 'contain', width: 25, height: 25 }} source={require('./icons/left_arrow.png')}></Image>
            </TouchableOpacity>
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: 'Ubuntu-Bold', textAlign: 'center', color: '#000' }}>{Lang_chg.tittleinbox[config.language]}</Text>
            </View>
            <TouchableOpacity style={{ width: '10%', alignSelf: 'center' }}>
              {/* <Image  style={{ resizeMode:'contain', width: 20, height: 20 }} source={require('./icons/lokingw.png')}></Image> */}
            </TouchableOpacity>
          </View>
          {/* <View style={{backgroundColor:'red',width:'100%',height:70,justifyContent:'center',flex:1}}>
                <TouchableOpacity onPress={()=>{this.backpress()}} style={{justifyContent:'center'}}>
                        <Image style={styles.crossimg} source={require('./icons/backw.png')}></Image>
                        </TouchableOpacity>
                <Text style={{alignSelf:'center',fontSize:18,fontFamily:'Ubuntu-Bold',color:Colorss.whiteColor }}>Inbox</Text>
                    <TouchableOpacity onPress={()=>{alert('search')}} style={{ position:'absolute',right:15,width:20,height:20}}>
                     <Image  style={{ resizeMode:'contain', width: 20, height: 20 }} source={require('./icons/lokingw.png')}></Image>
                 </TouchableOpacity>
                    </View> */}


          <View style={{ paddingHorizontal: 10, height: '100%' }}>
            {this.state.inboxmessage.length <= 0 &&
              <View style={[styles.upcoming_main, { alignItems: 'center', justifyContent: 'center', height: 600 }]}>
                <Image source={require('./icons/inbox_not_found.png')} style={{ height: 100, width: 100, resizeMode: 'contain'}} />
              </View>
            }
            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.inboxmessage}
              renderItem={this.renderitem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

        </ScrollView>


        <Footer
          activepage='Inbox'
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
        {/* <Footer color={this.state.pagename} navigation={this.props.navigation} count_inbox={count_inbox}/> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  crossimg: {
    resizeMode: 'contain',
    width: 15,
    height: 15,
    alignSelf: 'center'
  }, imgicon: {
    width: 15, height: 15, resizeMode: 'contain',
    marginTop: 5, marginRight: 10
  },
})
