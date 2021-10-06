import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Modal, SafeAreaView, Image, StatusBar, TouchableOpacity, FlatList, ScrollView, } from 'react-native'
import Carousel from 'react-native-banner-carousel';
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import StarRating from 'react-native-star-rating';
import { notification } from './Provider/NotificationProvider';
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = Dimensions.get('window').height;
const images = [
    { 'image': require('./icons/boat_Detail_banner.png') },
    { 'image': require('./icons/boat_Detail_banner.png') },
    { 'image': require('./icons/boat_Detail_banner.png') },
];
export default class Boat_detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            rating_count: 0,
            review: '',
            isConnected: true,
            booking_arr: 'NA',
            datanotfond: '',
            onloaded: false,
            guest_user_check: 'no',
            loading: false,
            modalVisible: false,
            booking_id: this.props.route.params.booking_id,
            // boat_id     : this.props.route.params.boat_id,
            img_arr: 'NA',
            advertisement_id: 0,
            share_app_url: "NA",
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
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.Termsconditiondata();
            this._getBookingData();
        });

    }
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    Termsconditiondata = async () => {
        if (this.state.isConnected === true) {
            var url = config.baseURL + 'get_all_content.php?user_id=0&user_type=1';
            console.log('url', url)
            fetch(url, {
                method: 'GET',
                headers: new Headers(config.headersapi),
            }).then((obj) => {
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                if (obj.success == 'true') {
                    let share_app_url = obj.content_arr[5].content[config.language];
                    this.setState({ loading: false, share_app_url: share_app_url });
                }
                else {
                    msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    shereappbtn = () => {
        console.log(this.state.share_app_url)
        let shareOptions = {
            title: 'MyBoat',
            subject: Lang_chg.headdingshare[config.language],
            message: Lang_chg.sharelinktitle[config.language],
            url: this.state.share_app_url,
            failOnCancel: false,
        };
        Share.open(shareOptions)
    }

    _getBookingData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "booking_details_owner.php?user_id_post=" + user_id_post + "&booking_id_post=" + this.state.booking_id;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Adverobj===', obj);
                    if (obj.booking_arr != 'NA') {
                        this.setState({ img_arr: obj.booking_arr.img_arr, booking_arr: obj.booking_arr, datanotfond: '', advertisement_id: obj.booking_arr.advertisement_id, boat_id: obj.booking_arr.boat_id })
                    } else {
                        this.setState({ datanotfond: Lang_chg.data_not_found[config.language], booking_arr: 'NA' })
                    }
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

    btnMarkComplete=async(booking_id)=>{
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "booking_mark_complete.php?user_id_post=" + user_id_post + "&booking_id_post=" + booking_id;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this.state.booking_arr.booking_status = 2;
                    this.state.booking_arr.cancel_btn_show = 'no';
                    this.state.booking_arr.date_change_btn_show = 'no';
                    this.state.booking_arr.complete_btn_show = 'no';
                    this.setState({ booking_arr: { ...this.state.booking_arr } })
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
    _btnCancelBooking = async (booking_id) => {
        // alert(booking_id);
        // return false;
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "booking_cancel.php?user_id_post=" + user_id_post + "&booking_id=" + booking_id;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this.state.booking_arr.booking_status = 4;
                    this.state.booking_arr.cancel_btn_show = 'no';
                    this.state.booking_arr.date_change_btn_show = 'no';
                    this.setState({ booking_arr: { ...this.state.booking_arr } })

                    if (obj.notification_arr != 'NA') {
                        notification.oneSignalNotificationSendCall(obj.notification_arr)
                    }

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
                    <TouchableOpacity activeOpacity={.7} style={styles.back_buttn_top} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.boat_detail_top} source={require('./icons/left_arrow_ahite.png')}></Image>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.booking_arr != 'NA') &&
                    <View style={{ flex: 1 }}>
                        <View style={styles.home_slider}>
                            {(this.state.img_arr != 'NA') ?
                                <Carousel
                                    autoplay
                                    style={{ borderRadius: 90, }}
                                    autoplayTimeout={5000}
                                    loop
                                    index={0}
                                    pageIndicatorStyle={{ backgroundColor: '#c3c3c3', }}
                                    activePageIndicatorStyle={{ color: '#01a8e7', backgroundColor: '#01a8e7', width: 8, height: 8, alignself: 'center', borderRadius: 5 }}
                                    pageSize={BannerWidth * 100 / 100}>
                                    {
                                        this.state.img_arr.map((item1, index) => {
                                            console.log('itme___', config.img_url + item1.image);
                                            return (
                                                <Image source={{ uri: config.img_url + item1.image }} style={{ width: BannerWidth, height: BannerHeight * 32 / 90 }} />
                                            )
                                        })
                                    }
                                </Carousel>
                                :
                                <Image style={styles.slider_home} source={require('./icons/error.png')} style={{ width: BannerWidth, height: BannerHeight * 32 / 90 }} />
                            }
                        </View>


                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: 'center', }}>
                                {
                                    (booking_arr.user_image == 'NA') ?
                                        <Image style={styles.boat_user} source={require('./icons/error.png')}></Image>
                                        :
                                        <Image style={styles.boat_user} source={{ uri: config.img_url + booking_arr.user_image }} />
                                }
                                <Text style={styles.user_name}>{booking_arr.user_name}</Text>
                                {/* <Text style={styles.user_email}>peter@gmail.com</Text> */}
                            </View>
                            <View style={styles.detail_box}>
                                <View style={styles.chat_row}>
                                    <Text style={styles.sail_name}>{booking_arr.trip_name[config.language]}</Text>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/sail.png')}></Image>
                                </View>
                                <View style={[styles.chat_row,{justifyContent: 'flex-end'}]}>
                                    <Text style={styles.sail_name}>{booking_arr.city_name}</Text>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/location.png')}></Image>
                                </View>
                            </View>

                            <View style={styles.boat_title}>
                                {
                                    (booking_arr.booking_status == 1) && <Text style={styles.trip_confirmned}> {Lang_chg.txt_Confirmed[config.language]}</Text>
                                }
                                {
                                    (booking_arr.booking_status == 2) && <Text style={styles.trip_completed}>{Lang_chg.txt_complete[config.language]}</Text>
                                }
                                {
                                    (booking_arr.booking_status == 3) && <Text style={styles.trip_cancelled}>{Lang_chg.txt_cancel_by_u[config.language]}</Text>
                                }
                                {
                                    (booking_arr.booking_status == 4) && <Text style={styles.trip_cancelled}> {Lang_chg.txt_cancel_by_o[config.language]}</Text>
                                }
                                 
                                {
                                    (booking_arr.booking_status == 6) && <Text style={styles.trip_inprogress}>{Lang_chg.Rate_now[config.language]}</Text>
                                }
                                {/* <Text style={styles.boat_pending}>Pending</Text> */}
                                <Text style={styles.boat_heading}>{booking_arr.bussness_name}</Text>
                            </View>
                            <View style={styles.rewie_detail}>
                                <Text style={styles.boat_Detail}>({booking_arr.rating_count})</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStar={require('./icons/star_unfill.png')}
                                    fullStar={require('./icons/starfill.png')}
                                    halfStar={require('./icons/half_star.png')}
                                    maxStars={5}
                                    rating={booking_arr.rating}
                                    reversed={false}
                                    starSize={18}
                                    fullStarColor={'red'}
                                />
                            </View>


                            <View style={{ width: '100%', alignSelf: 'center', marginTop: 20 }}>

                                <View style={{ width: '98%', alignSelf: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/price.png')}></Image>
                                        <Text style={styles.price_txt}> {Lang_chg.Extra_hours_price_txt[config.language]}({booking_arr.extra_rental_amt})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/timer1.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.Minimum_Hours_txt[config.language]}({booking_arr.minimum_hours})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/length.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.lenghth_txt[config.language]}({booking_arr.boat_length})</Text>
                                    </View>
                                </View>
                                <View style={{ width: '98%', alignSelf: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/toilets.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.toilets_txt[config.language]}({booking_arr.toilets})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/cap.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.Capacity_txt[config.language]}({booking_arr.boat_capacity})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/cabins.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.cabins_txt[config.language]}({booking_arr.cabins})</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.boat_Description}>
                                <Text style={styles.boat_desc}>
                                    {Lang_chg.Description_txt[config.language]}
                                </Text>
                                <Text style={styles.main_detail}>
                                    {booking_arr.discription[config.language]}
                                </Text>

                                {
                                    (booking_arr.discount != 0) &&      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.discount_per_txt_per_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{booking_arr.discount} %</Text> </Text>
                                </View>
                                    
                                    // <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    //     <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{booking_arr.discount} % : </Text><Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.discount_per_txt_per_txt[config.language]}</Text>
                                    // </View>
                                }
                           
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.txt_KWD[config.language]}  {booking_arr.rent_amount}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Rental_Price_txt[config.language]}</Text>
                                </View> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Rental_Price_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{booking_arr.rent_amount} {Lang_chg.txt_KWD[config.language]}</Text> </Text>
                                </View>

                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.txt_KWD[config.language]}  {booking_arr.extra_price}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Extrea_per_txt[config.language]}</Text>
                                </View> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Extrea_per_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{booking_arr.extra_price} {Lang_chg.txt_KWD[config.language]}</Text> </Text>
                                </View>

                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{booking_arr.minimum_hours} {Lang_chg.Hours_txt[config.language]}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Minimum_Hours_txt[config.language]}</Text>
                                </View> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Minimum_Hours_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{booking_arr.minimum_hours} {Lang_chg.Hours_txt[config.language]}</Text> </Text>
                                </View>

                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{booking_arr.idle_time} {Lang_chg.Hours_txt[config.language]}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Ideal_Hours_txt[config.language]}</Text>
                                </View> */}

                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Ideal_Hours_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{booking_arr.idle_time} {Lang_chg.Hours_txt[config.language]}</Text> </Text>
                                </View>

                            </View>
                            <View style={styles.addre_view}>
                                <Text style={styles.boat_addred_heading}>
                                    {Lang_chg.txt_address[config.language]}
                                </Text>
                                <View style={styles.boat_location_img}>
                                    <Text style={styles.adddres_boat}>
                                        {booking_arr.location_address}
                                    </Text>
                                    <Image style={styles.location_img_right} source={require('./icons/location.png')}></Image>
                                </View>
                                <Text style={styles.kd_price}>KD {booking_arr.total_amt}</Text>
                            </View>
                            <View style={styles.booking_date}>
                                <Text style={styles.boat_addred_heading}>
                                    {Lang_chg.txt_booking_details[config.language]}
                                </Text>
                                <View style={styles.boat_location_img}>
                                    <Text style={styles.adddres_boat}>
                                        {booking_arr.time}, {booking_arr.date}
                                    </Text>
                                </View>
                            </View>


                            {
                                (booking_arr.date_change_btn_show == 'yes') &&
                                <View style={styles.boat_btn_detail}>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate('BookingDateUpdate', {
                                            booking_id: booking_arr.booking_id,
                                            boat_id: booking_arr.boat_id,
                                        })
                                    }}>
                                        <Text style={styles.change_date}>{Lang_chg.txt_change_booking_date[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            }


                            {
                                (booking_arr.cancel_btn_show == 'yes') &&
                                <View style={styles.boat_btn_detail_fill}>
                                    <TouchableOpacity onPress={() => { this._btnCancelBooking(booking_arr.booking_id) }}>
                                        <Text style={styles.change_date_fill}>{Lang_chg.txt_cancel_booking[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                (booking_arr.complete_btn_show == 'yes') &&
                                <View style={styles.boat_btn_detail_fill}>
                                    <TouchableOpacity onPress={() => { this.btnMarkComplete(booking_arr.booking_id) }}>
                                        <Text style={styles.change_date_fill}>{Lang_chg.mark_complete[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={styles.boat_btn_detail_fill}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat', { chatdata: { 'other_user_name': booking_arr.user_name, image: booking_arr.user_image, other_user_id: booking_arr.user_id, 'blockstatus': 'no' } },) }}>
                                    <Text style={styles.change_date_fill}>{Lang_chg.txt_chat[config.language]}</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        width: 100,
        height: 100,
        resizeMode: 'cover',
        alignItems: 'center',
        borderRadius: 50,
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
        alignItems:'flex-start',
        marginTop: 10,
        width: '80%',
        alignItems: 'flex-start',
        alignSelf: 'center',
    },
    chat_row: {
        flexDirection: 'row',
        alignItems:'flex-start',
        width:'38%'
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
