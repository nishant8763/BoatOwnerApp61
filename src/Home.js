import React, { Component } from 'react'
import { Text, View, SafeAreaView, FlatList, StatusBar, StyleSheet, TouchableOpacity, Image, BackHandler, Alert } from 'react-native';
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Footer from './Provider/Footer';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { firebaseprovider}  from './Provider/FirebaseProvider';
import firebase from './Config1';
import OneSignal from 'react-native-onesignal';
const demodat = [1, 2, 3, 4, 5, 6, 7, 8, 9,];
const demodat2 = [1, 2, 3, 4, 5, 6, 7, 8, 9,];
export default class Home extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            data1: demodat,
            upcoming: demodat2,
            on: true,
            up: false,
            datanotfond: "",
            upcoming_booking_arr: "NA",
            ongoning_booking_arr: "NA",
            loading: false,
            isConnected: true,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
        OneSignal.init(config.onesignalappid, {
            kOSSettingsKeyAutoPrompt: true,
        });
        OneSignal.setLogLevel(6, 0);
    }

    componentDidMount() {
        OneSignal.setLocationShared(true);
        OneSignal.inFocusDisplaying(2);
        // OneSignal.addEventListener('ids', this.onIds.bind(this));
        OneSignal.addEventListener('opened', this.onOpened);

        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getBookingData();
            this.getMyInboxAllData1();
        });
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
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
                 setTimeout(()=>{ this.setState({countinbox:count_inbox}) }, 2000);

                //  this.getalldata(currentLatlong)
            })
            var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinboxadded.on('child_added', (data) => {
                console.log('inboxkaadded', data.toJSON())
                firebaseprovider.firebaseUserGetInboxCount()
                setTimeout(()=>{ this.setState({countinbox:count_inbox}) }, 2000);

                // firebaseprovider.firebaseUserGetInboxCount();
            })

        }
    }
    componentWillUnmount() {
        OneSignal.removeEventListener('opened', this.onOpened);
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    onOpened = async (openResult) => {
        console.log('openResult: ', openResult);
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        var datajson = openResult.notification.payload.additionalData.p2p_notification.action_json;
        var user_id = datajson.user_id;
        var other_user_id = datajson.other_user_id;
        var action_id = datajson.action_id;
        var action = datajson.action;
        var userdata = await localStorage.getItemObject('user_arr')
        console.log('datajson_user_id', datajson.user_id)
        console.log('datajson_other_user_id', datajson.other_user_id)
        console.log('datajson_action_id', datajson.action_id)
        console.log('datajson_action', datajson.action)
        if (userdata.user_id == other_user_id) {
            other_user_id = datajson.user_id
        }
        this.setState({ loading: false })
        if (userdata != null) {
            console.log('navigation run')
            if (action == "new_booking") {
                this.props.navigation.navigate('Boat_detail', { booking_id: action_id });
            } else if (action == "rate_now") {
                this.props.navigation.navigate('Boat_detail', { booking_id: action_id });
            } else if (action == "complete_mark") {
                this.props.navigation.navigate('Boat_detail', { booking_id: action_id });
            } else if (action == "broadcast") {
                this.props.navigation.navigate('notification')
            }
        } else {
            this.setState({ loading: false })
            this.props.navigation.navigate('Login')
        }
    }
    _getBookingData = async () => {
        let guest_user = await localStorage.getItemString('guest_user');
        if (guest_user == 'yes') {
            this.setState({ guest_user_check: 'yes' })
        } else {

            this.setState({ guest_user_check: 'no' })
            if (this.state.isConnected === true) {
                this.setState({ loading: true })
                let result = await localStorage.getItemObject('user_arr')
                let user_id_post = 0;
                if (result != null) {
                    user_id_post = result.user_id;
                }

                let url = config.baseURL + "booking_list_owner.php?user_id_post=" + user_id_post;
                console.log('url', url)
                apifuntion.getApi(url).then((obj) => {
                    this.setState({ loading: false });
                    return obj.json();
                }).then((obj) => {
                    console.log(obj)
                    //  alert(JSON.stringify(obj))
                    if (obj.success == 'true') {
                        console.log('Adverobj===', obj);
                        config.notiCount = obj.noti_count;
                        this.setState({ upcoming_booking_arr: obj.upcoming_booking_arr, ongoning_booking_arr: obj.ongoning_booking_arr, datanotfond: "" });
                    } else {
                        this.setState({ datanotfond: Lang_chg.data_not_found[config.language] })
                        if (obj.account_active_status == "deactivate") {
                            config.checkUserDeactivate(this.props.navigation);
                            return false;
                        }
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    console.log("-------- error ------- " + error);
                    this.setState({ loading: false, datanotfond: Lang_chg.data_not_found[config.language] });
                    msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
                })
            } else {
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            }

        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    handleBackPress = () => {
        Alert.alert(
            Lang_chg.titleexitapp[config.language],
            Lang_chg.exitappmessage[config.language], [{
                text: Lang_chg.No[config.language],
                onPress: () => console.log('Cancel Pressed'),
                style: Lang_chg.cancel[config.language],
            }, {
                text: Lang_chg.Yes[config.language],
                onPress: () => BackHandler.exitApp()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };


    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#fff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.home_header}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Notificatiions') }}>
                        {
                            (config.notiCount<=0) ? <Image resizeMode="contain" style={[styles.notification_home,{width:40}]} source={require('./icons/noti_deactive.png')}></Image>:<Image resizeMode="contain" style={[styles.notification_home,{width:25}]} source={require('./icons/notification.png')}></Image>
                        }
                        {/* <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/noti.png')}></Image> */}
                    </TouchableOpacity>
                    <Text style={styles.home_title}>{Lang_chg.txt_Home[config.language]}</Text>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('HomeSearch') }}>
                        <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/search_home.png')}></Image>
                    </TouchableOpacity>
                </View>

                <View style={styles.home_tab_btn}>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => { this.setState({ on: true, up: false }) }} style={styles.btn_left} activeOpacity={0.9}>
                        {this.state.on == false && <Text style={styles.ongoing_btn}>{Lang_chg.txt_ongoing[config.language]}</Text>}
                        {this.state.on == true && <Text style={styles.ongoing_btn_select}>{Lang_chg.txt_ongoing[config.language]}</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => { this.setState({ on: false, up: true }) }} style={styles.btn_right} activeOpacity={0.9}>
                        {this.state.up == false && <Text style={styles.ongoing_btn}>{Lang_chg.txt_upcomming[config.language]}</Text>}
                        {this.state.up == true && <Text style={styles.ongoing_btn_select}>{Lang_chg.txt_upcomming[config.language]}</Text>}

                    </TouchableOpacity>

                </View>


                {this.state.on == true &&
                    <View style={styles.upcoming_main}>
                        {
                            (this.state.ongoning_booking_arr != 'NA')
                                ?
                                <FlatList
                                    data={this.state.ongoning_booking_arr}
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (

                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Boat_detail', { booking_id: item.booking_id }) }}>
                                                <View style={styles.upcoming_list}>
                                                    <View style={styles.upcoming_detail}>
                                                        <Text style={styles.box_id}>#{item.booking_no}</Text>
                                                        <Text style={styles.name_upcoming}>{item.user_name}</Text>
                                                        <Text style={styles.box_name}>{item.advertisement_name[config.language]}</Text>
                                                        <Text style={styles.cabin_upcoming}>{item.boat_name}</Text>
                                                        <Text style={styles.upcomy_date}>{item.time}, {item.date}</Text>
                                                        <Text style={styles.upcomming_price}>{Lang_chg.txt_KWD[config.language]}  {item.total_amt}</Text>
                                                        {
                                                            (item.booking_status == 5) && <Text style={styles.ongoing_progress}>{Lang_chg.txt_Confirmed[config.language]}</Text>
                                                        }
                                                        <Text style={styles.upcoming_time}>{item.createtime}</Text>
                                                    </View>
                                                    <View style={styles.upcoming_right_list}>
                                                        {
                                                            (item.image == 'NA') && <Image style={styles.main_img_upcoming} source={require('./icons/error.png')}></Image>
                                                        }
                                                        {
                                                            (item.image != 'NA') && <Image style={styles.main_img_upcoming} source={{ uri: config.img_url2 + item.image }}></Image>
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                                :
                                <View style={[styles.upcoming_main, { height: '70%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Image source={require('./icons/ongoning.png')} style={{ height: '50%', width: '50%', resizeMode: 'contain' }} />
                                </View>
                        }

                    </View>}



                {this.state.up == true &&
                    <View style={styles.upcoming_main}>
                        {
                            (this.state.upcoming_booking_arr != 'NA')
                                ?
                                <FlatList
                                    data={this.state.upcoming_booking_arr}
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (

                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Boat_detail', { booking_id: item.booking_id }) }}>
                                                <View style={styles.upcoming_list}>
                                                    <View style={styles.upcoming_detail}>
                                                        <Text style={styles.box_id}>#{item.booking_no}</Text>
                                                        <Text style={styles.name_upcoming}>{item.user_name}</Text>
                                                        <Text style={styles.box_name}>{item.advertisement_name[config.language]}</Text>
                                                        <Text style={styles.cabin_upcoming}>{item.boat_name}</Text>
                                                        <Text style={styles.upcomy_date}>{item.time}, {item.date}</Text>
                                                        <Text style={styles.upcomming_price}>{Lang_chg.txt_KWD[config.language]}  {item.total_amt}</Text>
                                                        {
                                                            (item.booking_status == 1) && <Text style={styles.ongoing_confirmd}>{Lang_chg.txt_Confirmed[config.language]}</Text>
                                                        }
                                                        <Text style={styles.upcoming_time}>{item.createtime}</Text>
                                                    </View>
                                                    <View style={styles.upcoming_right_list}>
                                                        {
                                                            (item.image == 'NA') && <Image style={styles.main_img_upcoming} source={require('./icons/error.png')}></Image>
                                                        }
                                                        {
                                                            (item.image != 'NA') && <Image style={styles.main_img_upcoming} source={{ uri: config.img_url2 + item.image }}></Image>
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                                :
                                <View style={[styles.upcoming_main, { height: '70%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Image source={require('./icons/ucoming.png')} style={{ height: '50%', width: '50%', resizeMode: 'contain' }} />
                                </View>
                        }
                    </View>}

        {/* { name: 'Inbox', countshow: count_inbox,pageName:'Inbox', image: (count_inbox<=0)?require('./icons/inbox123.png'):require('./icons/inbox.png'), activeimage: (count_inbox<=0)? require('./icons/inbox_active.png'):require('./icons/inbox_deactive.png') },deactive_caht.png */}

                <Footer
                    activepage='Home'
                    usertype={1}
                    footerpage={[
                        { name: 'Home', countshow: false, image: require('./icons/home.png'), activeimage: require('./icons/home_active.png') },
                        { name: 'Manage_o', countshow: false, image: require('./icons/manage.png'), activeimage: require('./icons/manage_active.png') },
                        { name: 'Inbox', countshow: true, image: (count_inbox<=0)?require('./icons/chat1.png'):require('./icons/chat.png'), activeimage:(count_inbox<=0)? require('./icons/deactive_caht.png'):require('./icons/chat_active.png') },
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

    home_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:"center",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        height:40,
    },
    home_notificatio_btn: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    home_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    main_img_upcoming: {
        width: '100%',
        height: 120,
    },
    box_id: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    name_upcoming: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontFamily: 'Ubuntu-Regular',
    },
    box_name: {
        fontFamily: 'Ubuntu-Regular',
        textAlign: 'right',
    },
    cabin_upcoming: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontFamily: "Ubuntu-LightItalic",
        fontStyle: 'italic',
    },
    upcomy_date: {
        textAlign: 'right',
        color: '#000',
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    upcomming_price: {
        color: '#d15400',
        fontFamily: "Ubuntu-Bold",
        fontSize: 18,
        textAlign: 'right',
    },
    upcoming_time: {
        color: '#888888',
        position: 'absolute',
        bottom: 0,
    },
    upcoming_main: {
        marginTop: 10,
        marginBottom: 150,
    },
    upcoming_detail: {
        width: '55%',
        paddingRight: 20,
    },
    upcoming_right_list: {
        width: '45%'
    },
    ongoing_progress: {
        textAlign: 'right',
        color: '#ea7f0c',
    },
    ongoing_confirmd: {
        textAlign: 'right',
        color: '#e3eb07',
    },
    upcoming_list: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        justifyContent: 'flex-start',
    },
    home_tab_btn: {
        flexDirection: 'row',
        marginTop: 5,
    },
    btn_left: {
        width: '50%',
        paddingBottom: 22,
        paddingTop: 20,
    },
    btn_right: {
        width: '50%',
        paddingBottom: 22,
        paddingTop: 20,
    },
    ongoing_btn: {

        fontFamily: "Ubuntu-Regular",
        backgroundColor: '#f3f3f3',
        paddingVertical: 14,
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        paddingTop: 15,
        paddingBottom: 15,
    },
    ongoing_btn_select: {
        backgroundColor: '#da5a04',
        paddingVertical: 14,
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF',
    },

})

