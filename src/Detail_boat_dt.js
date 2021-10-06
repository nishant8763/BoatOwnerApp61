import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Modal, SafeAreaView, Image, StatusBar, TouchableOpacity, FlatList, ScrollView, } from 'react-native'
import Carousel from 'react-native-banner-carousel';
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import StarRating from 'react-native-star-rating';
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = Dimensions.get('window').height;


const images = [
    { 'image': require('./icons/boat_Detail_banner.png') },
    { 'image': require('./icons/boat_Detail_banner.png') },
    { 'image': require('./icons/boat_Detail_banner.png') },
];


export default class Detail_boat_dt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            editModalvisibal: false,
            loading: false,
            isConnected: true,
            adver_arr: 'NA',
            img_arr: 'NA',
            adver_count: 0,
            images: [
                { 'image': require('./icons/boat_Detail_banner.png') },
                { 'image': require('./icons/boat_Detail_banner.png') },
                { 'image': require('./icons/boat_Detail_banner.png') },
            ],
            advertisement_id: this.props.route.params.advertisement_id,
        }
    }


    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getAdvertivenData();
        });
        const { other_user_id } = this.props.route.params;
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });

    }
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    _getAdvertivenData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "advertisement_details.php?user_id_post=" + user_id_post + "&advertisement_id=" + this.state.advertisement_id;

            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Adverobj===', obj);
                    this.setState({ img_arr: obj.adver_arr.img_arr, adver_arr: obj.adver_arr })
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
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }

    }

    deleteAdvertisement = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "advertisement_delete.php?user_id_post=" + user_id_post + "&advertisement_id_post=" + this.state.advertisement_id;
            console.log('url', url);
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                if (obj.success == 'true') {
                    console.log('user_arr', obj)
                    this.setState({ loading: false, editModalvisibal: false });
                    msgProvider.toast(obj.msg[config.language], 'center');
                    this.props.navigation.navigate('Manage_o');
                    return false
                } else {
                    if (obj.account_active_status == "deactivate") {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    this.setState({ loading: false, editModalvisibal: false });
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false, editModalvisibal: false });
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    goPage = () => {
        this.props.navigation.navigate('Edit_advertisement', {
            advertisement_id: this.state.advertisement_id
        })
        this.setState({
            editModalvisibal: false
        })
    }


    render() {
        let adver_arr = this.state.adver_arr;
        return (
            <ScrollView style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
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
                    <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                        <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                            networkActivityIndicatorVisible={true} />
                        <View style={{ borderRadius: 20, width: "100%", position: 'absolute', bottom: 0, }}>

                            <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20 }}>
                                <TouchableOpacity
                                    onPress={() => { this.deleteAdvertisement() }}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.delete_txt[config.language]}</Text>
                                </TouchableOpacity>
                                <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: 2, marginTop: 10 }}></View>
                                <TouchableOpacity
                                    onPress={() => { this.goPage() }}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>{Lang_chg.Edit_txt[config.language]}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20, marginVertical: 15 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}
                                >
                                    <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.cancel[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {
                    this.state.adver_arr != 'NA' &&
                    <View>
                        <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                        <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                            networkActivityIndicatorVisible={true} />

                        <View style={styles.result_header}>
                            <TouchableOpacity activeOpacity={.7} style={styles.back_buttn_top} onPress={() => { this.backpress() }}>
                                <Image resizeMode="contain" style={styles.boat_detail_top} source={require('./icons/left_arrow_ahite.png')}></Image>
                            </TouchableOpacity>
                            <Text></Text>
                            <TouchableOpacity activeOpacity={0.7}
                                onPress={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}
                            >
                                <Image resizeMode="contain" style={styles.boat_detail_dot} source={require('./icons/dot.png')}></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.home_slider}>
                            {(this.state.img_arr != 'NA') ?
                                <Carousel
                                    autoplay
                                    style={{ borderRadius: 90, }}
                                    autoplayTimeout={5000}
                                    loop
                                    index={0}
                                    pageIndicatorStyle={{ backgroundColor: '#c3c3c3', }}
                                    activePageIndicatorStyle={{
                                        color: '#01a8e7', backgroundColor: '#01a8e7', width: 8,
                                        height: 8,
                                        alignself: 'center',
                                        borderRadius: 5
                                    }}
                                    pageSize={BannerWidth * 100 / 100}>
                                    {
                                        this.state.img_arr.map((item1, index) => {
                                            console.log('itme___', config.img_url + item1.image);
                                            return (
                                                <Image style={styles.slider_home} source={{ uri: config.img_url + item1.image }} style={{ width: BannerWidth, height: BannerHeight * 25 / 90 }} />
                                            )
                                        })
                                    }
                                </Carousel>
                                :
                                <Image style={styles.slider_home} source={require('./icons/error.png')} style={{ width: BannerWidth, height: BannerHeight * 25 / 90 }} />
                            }

                        </View>


                        <View showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: 'center', }}>
                                {
                                    (adver_arr.user_image != 'NA') ?
                                        <Image style={styles.boat_user} source={{ uri: config.img_url + adver_arr.user_image }}></Image>
                                        :
                                        <Image style={styles.boat_user} source={require('./icons/error.png')}></Image>
                                }
                                <Text style={styles.user_name}>{adver_arr.user_name}</Text>
                                {/* <Text style={styles.user_email}>{adver_arr.email}</Text> */}
                            </View>
                            <View style={styles.detail_box}>
                                <View style={styles.chat_row}>
                                    <Text style={styles.sail_name} >{adver_arr.trip_type_name[config.language]}</Text>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/sail.png')}></Image>
                                </View>
                                <View style={[styles.chat_row,{justifyContent: 'flex-end'}]}>
                                    <Text style={styles.sail_name}>{adver_arr.city_name}</Text>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/location.png')}></Image>
                                </View>
                            </View>

                            <View style={styles.boat_title}>
                                <Text style={styles.boat_heading}>{adver_arr.adver_name[config.language]}</Text>
                            </View>
                            <View style={styles.rewie_detail}>
                                <Text style={styles.boat_Detail}>({adver_arr.rating_count})</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStar={require('./icons/star_unfill.png')}
                                    fullStar={require('./icons/starfill.png')}
                                    halfStar={require('./icons/half_star.png')}
                                    maxStars={5}
                                    rating={adver_arr.rating}
                                    reversed={false}
                                    starSize={18}
                                    fullStarColor={'red'}
                                />
                            </View>


                            <View style={{ width: '100%', alignSelf: 'center', marginTop: 20 }}>

                                <View style={{ width: '98%', alignSelf: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/price.png')}></Image>
                                        <Text style={styles.price_txt}>  {Lang_chg.Extra_hours_price_txt[config.language]} ({adver_arr.extra_price})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/timer1.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.Minimum_Hours_txt[config.language]} ({adver_arr.minimum_hours})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/length.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.lenghth_txt[config.language]}({adver_arr.boat_length})</Text>
                                    </View>
                                </View>
                                <View style={{ width: '98%', alignSelf: 'center', paddingVertical: 10, flexDirection: 'row' }}>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/toilets.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.toilets_txt[config.language]}({adver_arr.boat_toilets})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/cap.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.Capacity_txt[config.language]}({adver_arr.boat_capacity})</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '33%' }}>
                                        <Image style={styles.price_boat} source={require('./icons/cabins.png')}></Image>
                                        <Text style={styles.price_txt}>{Lang_chg.cabins_txt[config.language]}({adver_arr.boat_cabins})</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.boat_Description}>
                                <Text style={styles.boat_desc}>
                                    {Lang_chg.Description_txt[config.language]}
                                </Text>
                                <Text style={styles.main_detail}>
                                    {adver_arr.discription_arr[config.language]}
                                </Text>
                                <Text style={styles.boat_rental}>{Lang_chg.txt_KWD[config.language]}  {adver_arr.rental_price} :  {Lang_chg.Rental_Price_txt[config.language]}</Text>
                                {
                                    (adver_arr.discount != 0) && 
                                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                        <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.discount_per_txt_per_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{adver_arr.discount} %</Text> </Text>
                                    </View>
                                    // <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    //     <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{adver_arr.discount} % : </Text><Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.discount_per_txt_per_txt[config.language]}</Text>
                                    // </View>
                                }

                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Extrea_per_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{adver_arr.extra_price} {Lang_chg.txt_KWD[config.language]}</Text> </Text>
                                </View>


                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.txt_KWD[config.language]}  {adver_arr.extra_price}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Extrea_per_txt[config.language]}</Text>
                                </View> */}
                               <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Minimum_Hours_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{adver_arr.minimum_hours} {Lang_chg.Hours_txt[config.language]}</Text> </Text>
                                </View>


                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{adver_arr.minimum_hours} {Lang_chg.Hours_txt[config.language]}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Minimum_Hours_txt[config.language]}</Text>
                                </View> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{Lang_chg.Ideal_Hours_txt[config.language]} :    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3}}>{adver_arr.idle_time} {Lang_chg.Hours_txt[config.language]}</Text> </Text>
                                </View>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{adver_arr.idle_time} {Lang_chg.Hours_txt[config.language]}</Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}> : </Text>
                                    <Text style={{ fontSize: 15, fontFamily: "Ubuntu-Medium", textAlign: 'right', marginTop: 3 }}>{Lang_chg.Ideal_Hours_txt[config.language]}</Text>
                                </View> */}
                            </View>
                        </View>
                    </View>
                }
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20,

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
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        textAlign: 'center',
        alignItems: 'center',
    },
    boat_heading: {
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'right',
        justifyContent: 'flex-end',
    },
    rewie_detail: {
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 5,
        justifyContent: 'center',
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
        marginBottom: 50,
    },
    boat_detail_dot: {
        width: 20,
        height: 30,
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
    boat_Description: {
        marginBottom: 40,
    },
})
