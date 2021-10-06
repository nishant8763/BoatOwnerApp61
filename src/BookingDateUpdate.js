import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Modal, SafeAreaView, Image, StatusBar, TouchableOpacity, FlatList, ScrollView, } from 'react-native'
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import {notification} from './Provider/NotificationProvider';
import DatePicker from 'react-native-datepicker'
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = Dimensions.get('window').height;

export default class BookingDateUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected : true,
            loading     : false,
            booking_id  : this.props.route.params.booking_id,
            boat_id     : this.props.route.params.boat_id,
            date:'',
            time:'',
        }
    }

    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
    }
    _btnUpdateBooking=async()=>{
        if(this.state.time.length<=0){
            msgProvider.toast(Lang_chg.emptytime[config.language], 'center')
            return false
        }
        if(this.state.date.length<=0){
            msgProvider.toast(Lang_chg.emptydate[config.language], 'center')
            return false
        }

        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "booking_date_time_update.php?user_id_post=" + user_id_post + "&booking_id=" + this.state.booking_id+"&date="+this.state.date+"&time="+this.state.time+"&boat_id="+this.state.boat_id;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    if(obj.notification_arr!='NA'){
                        notification.oneSignalNotificationSendCall(obj.notification_arr)
                    }
                    msgProvider.toast(obj.msg[config.language], 'center');
                    this.props.navigation.goBack();
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
                this.setState({ loading: false, datanotfond: Lang_chg.data_not_found[config.language] });
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }



    render() {
        let booking_arr = this.state.booking_arr;
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={styles.result_header}>
                    <View style={styles.header_earnig}>
                        <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                            <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.earnig_title}>{Lang_chg.txt_change_booking_date[config.language]}</Text>
                        <Text></Text>
                    </View>
                  
                    <View style={{width:BannerWidth*0.9,marginTop:20}}>
                    <View style={styles.edit_calender}>
                            <DatePicker
                                style={styles.datePickerStyle}
                                date={this.state.date} // Initial date from state
                                mode="date" // The enum of date, datetime and time
                                placeholder={Lang_chg.txt_date[config.language]}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                minDate={new Date()}
                                customStyles={{
                                    dateIcon: {
                                        alignItems: 'flex-end',
                                    },
                                    dateInput: {
                                        borderColor: '#234456',
                                        borderWidth: 0,
                                        borderRadius: 4,
                                        alignItems: 'flex-end',
                                        paddingRight:10
                                    },
                                }}
                                onDateChange={(date) => { this.setState({ date: date }) }}
                            />
                        </View>
                        <View style={styles.edit_calender}>
                            <DatePicker
                                style={styles.datePickerStyle}
                                date={this.state.time} // Initial date from state
                                mode="time" // The enum of date, datetime and time
                                placeholder={Lang_chg.txt_time[config.language]}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        alignItems: 'flex-end',
                                    },
                                    dateInput: {
                                        borderColor: '#234456',
                                        borderWidth: 0,
                                        borderRadius: 4,
                                        alignItems: 'flex-end',
                                        paddingRight:10
                                    },
                                }}
                                onDateChange={(time) => { this.setState({ time: time }) }}
                            />
                        </View>
                    </View>
                </View>
                            
                <View style={[styles.boat_btn_detail_fill,{position:'absolute',bottom:10}]}>
                    <TouchableOpacity onPress={()=>{this._btnUpdateBooking()}}>
                        <Text style={styles.change_date_fill}>{Lang_chg.txt_change_booking_date1[config.language]}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

   
}

const styles = StyleSheet.create({
    header_earnig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    earnig_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    }, 
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    edit_calender:{
        width:'100%',
        borderWidth:1,
        borderColor:'#d15400',
        paddingTop:5,
        paddingBottom:5,
        borderRadius:15,
        paddingLeft:20,
        marginBottom:20,
    },
    datePickerStyle:{
        width:'100%',
    },

    loadtouch_btn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',

    },
    update_result: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    home_slider: {
        width: BannerWidth,
        alignItems: 'center',
        height: BannerHeight * 27 / 80,
        borderRadius: 25,
        justifyContent: 'center',
    },
    result_header: {
        position: 'absolute',
        zIndex: 1111,
        top: 25,
        left: 20,
    },
    loadload_search: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        width: BannerWidth * 80 / 100,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    boat_detail_top: {
        width: 40,
        height: 30,
    },
    boat_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
    },
    boat_heading: {
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        fontSize: 22,
    },
    boat_pending: {
        color: '#ffb607',
        fontFamily: "Ubuntu-Medium",
        fontSize: 18,
        fontWeight: 'bold',
    },
    trip_cancelled: {
        color: 'red',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    trip_inprogress: {
        color: '#ff9100',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    trip_completed: {
        color: '#04bf2b',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    trip_confirmned: {
        color: '#e3eb07',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    rewie_detail: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 5,
    },
    star_boat: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 4,
    },
    boat_sail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        marginTop: 10,
    },
    sail_boat: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    boat_sail_txt: {
        color: '#7c7c7c',
        fontSize: 17,
        fontFamily: "Ubuntu-Medium",
    },
    boat_desc: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        textAlign: 'right',
        paddingRight: 20,
        fontWeight: 'bold',
    },
    main_detail: {
        fontSize: 15,
        fontFamily: "Ubuntu-Medium",
        paddingRight: 20,
        paddingLeft: 20,
        textAlign: 'right',
        marginBottom: 10,
        marginTop: 10,
    },
    boat_rental: {
        fontSize: 17,
        fontFamily: "Ubuntu-Medium",
        paddingRight: 20,
        paddingLeft: 20,
        textAlign: 'right',
        marginTop: 5,
    },
    other_boat: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
    },
    other_detail_boat: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        textAlign: 'right',
        fontWeight: 'bold',
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: '#636363',
        paddingBottom: 10,
    },
    boat_addred_heading: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        textAlign: 'right',
        fontWeight: 'bold',
        marginTop: 10,
        paddingBottom: 10,
    },

    facilityleft: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    boat_family_img: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    facility_show: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    boat_Description: {
        marginTop: 10,
    },
    boat_detail_time: {
        color: '#535353',
        fontFamily: "Ubuntu-Regular",
        fontSize: 16,
        textAlign: 'right',
    },
    main_boat_week: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 20,
    },
    boat_total_price: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 24,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#d15400',
    },
    customer_chat: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
    },
    chat_icon_boat: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    boat_detail_name: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 22,
    },
    boat_box_chat_top: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 15,
    },
    boat_user_name: {
        fontFamily: "Ubuntu-Medium",
        color: '#7f7e7e',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'right',
    },
    boat_user_name: {
        fontFamily: "Ubuntu-Regular",
        color: '#7f7e7e',
        fontSize: 16,
        textAlign: 'right',
    },
    boat_user_img_main: {
        marginLeft: 20,
    },
    chat_icon_boat_img: {
        marginTop: 5,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    boat_customer: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '90%',
        textAlign: 'center',
        alignSelf: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    boat_btn_detail: {
        borderWidth: 2,
        borderColor: '#d15400',
        height: 60,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        marginTop: 20,
    },
    boat_btn_detail_fill: {
        backgroundColor: '#d15400',
        height: 60,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        marginTop: 20,
        marginBottom: 20,
    },

    change_date: {
        lineHeight: 60,
        fontSize: 20,
        color: '#d15400',
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Bold",
        fontSize: 20,
    },
    change_date_fill: {
        lineHeight: 60,
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Bold",
    },
    boat_user: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    user_name: {
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Bold",
        fontSize: 16,
    },
    user_email: {
        color: '#7f7e7e',
    },
    detail_box: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    chat_row: {
        flexDirection: 'row',
    },
    sail_name: {
        color: '#7c7c7c',
        fontSize: 14,
        marginRight: 10,
    },
    price_boat: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        alignItems: 'center',
        marginBottom: 10,
    },
    facility_boat: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    price_txt: {
        fontSize: 14,
        fontFamily: "Ubuntu-Regular",
        textAlign: 'center',
        alignItems: 'center',
    },
    addre_view: {
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
    },
    booking_date: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
    },
    adddres_boat: {
        textAlign: 'right',
    },
    kd_price: {
        color: '#d15400',
        fontSize: 22,
        textAlign: 'right',
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Bold",
    },
    location_img_right: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    boat_location_img: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
})
