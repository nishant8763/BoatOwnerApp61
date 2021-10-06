import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, BackHandler, TouchableOpacity, Image, FlatList, Alert, TextInput } from 'react-native';
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { CommonActions } from '@react-navigation/native';
import Footer from './Provider/Footer';
import { firebaseprovider } from './Provider/FirebaseProvider';
import firebase from './Config1';
export default class Manage_o extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isConnected: true,
            adver_arr: 'NA',
            adver_arr1: 'NA',
            adver_count: 0,
            data_not_found: "",
            show_hide_input_flag: false,
            bank_arr :'NA',
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getAdvertivenData();
            this.getMyInboxAllData1();
        });
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
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

    handleBackPress = () => {
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
        return true;
    };
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }


    _goConfirmPage = () => {
        if(this.state.bank_arr=='NA'){
            Alert.alert(Lang_chg.Confirm[config.language],Lang_chg.confirmBankMsg[config.language], [
                {
                    text: Lang_chg.cancel[config.language],
                    onPress: () => { console.log('nothing') },
                    style: "cancel"
                },
                { text: Lang_chg.ok[config.language], onPress: () => {this.props.navigation.navigate('Add_bank');} }
            ], { cancelable: false });
        }else{
            if(this.state.bank_arr.status==0){
                Alert.alert(Lang_chg.Confirm[config.language],Lang_chg.confirmBankMsg1[config.language], [
                    {
                        text: Lang_chg.cancel[config.language],
                        onPress: () => { console.log('nothing') },
                        style: "cancel"
                    },
                    { text: Lang_chg.ok[config.language], onPress: () => {return null} }
                ], { cancelable: false });
            }else{
                this.props.navigation.navigate('Add_advertisement')
            }
        }
    }

    _getAdvertivenData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "advertisement_list_vender.php?user_id_post=" + user_id_post;

            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Adverobj===', obj);
                    if (obj.adver_arr != 'NA') {
                        this.setState({
                            adver_arr   : obj.adver_arr,
                            adver_arr1  : obj.adver_arr,
                            bank_arr    : obj.bank_arr,
                            adver_count : obj.adver_arr.length
                        });
                    } else {
                        this.setState({ adver_arr: obj.adver_arr, adver_count: 0, data_not_found: Lang_chg.data_not_found[config.language],bank_arr:obj.bank_arr});
                    }
                } else {
                    this.setState({ data_not_found: Lang_chg.data_not_found[config.language] });
                    if (obj.account_active_status == "deactivate") {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                this.setState({ data_not_found: Lang_chg.data_not_found[config.language] });
                console.log("-------- error ------- " + error);
                this.setState({ loading: false });
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            this.setState({ data_not_found: Lang_chg.data_not_found[config.language] });
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }

    }

    _searchData = (txt) => {
        // this.setState({ txtsrch: txt })
        console.log('test1', txt)
        let data1 = this.state.adver_arr1
        console.log('data', data1)
        if (data1 != 'NA') {
            var text_data = txt.toString().toLowerCase();
            let newData = data1.filter(function (item) {
                return (
                    item.title_eng.toString().toLowerCase().indexOf(text_data) >= 0 || item.title_ar.toString().toLowerCase().indexOf(text_data) >= 0
                )
            });

            if (newData.length > 0) {
                this.setState({ adver_arr: newData })
            } else if (newData.length <= 0) {
                this.setState({ adver_arr: 'NA' })
            }
        }
    }

    _showHideInputBox = () => {
        this.setState({
            show_hide_input_flag: !this.state.show_hide_input_flag,
        })
    }

    hideSearchBox = () => {
        this.setState({ adver_arr: this.state.adver_arr1, show_hide_input_flag: !this.state.show_hide_input_flag })
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.manage_list_flat}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { this.props.navigation.navigate('Detail_boat_dt', { advertisement_id: item.advertisement_id }) }}>
                    {
                        (item.image == 'NA')
                            ?
                            <Image resizeMode='contain' style={styles.banner_img} source={require('./icons/error.png')} />
                            :
                            <Image resizeMode='contain' style={styles.banner_img} source={{ uri: config.img_url2 + item.image }} />
                    }

                    <View style={styles.manage_location}>
                        <Text numberOfLines={1} style={styles.location_manage}>
                            {item.location_address}
                        </Text>
                        <Image resizeMode="contain" style={styles.manage_location_icon} source={require('./icons/location_white.png')}></Image>
                    </View>
                    <View style={styles.manage_box_title}>
                        <Text style={styles.manage_power}>
                            {item.adver_name[config.language]}
                        </Text>
                        <Text style={styles.manage_kabin_title}>
                            {item.boat_name}
                        </Text>
                        <Text style={styles.manage_number}>
                            {item.mobile} +965
                        </Text>
                        {
                            (item.discount != 0) && <Text style={styles.manage_number}>
                                {Lang_chg.Discount_txt[config.language]} ({item.discount}%)
                            </Text>
                        }

                        <Text style={styles.manage_number}>
                            {Lang_chg.Rental_Price_txt[config.language]} ({Lang_chg.txt_KWD[config.language]}  {item.rental_price})
                        </Text>
                        <Text style={styles.manage_number}>
                            {Lang_chg.Extrea_per_txt[config.language]} ({Lang_chg.txt_KWD[config.language]}  {item.extra_price})
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }




    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {
                    (this.state.show_hide_input_flag == false) ?
                        <View style={styles.home_header}>
                            <Text></Text>
                            <Text style={styles.home_title}>{Lang_chg.manage_adver_txt[config.language]}</Text>
                            <TouchableOpacity style={styles.home_serch} activeOpacity={0.7} onPress={() => { this._showHideInputBox() }}>
                                <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/search_home.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.home_header}>
                            <TouchableOpacity activeOpacity={0.7} style={{ width: '10%' }} onPress={() => { this.hideSearchBox() }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30, resizeMode: 'contain', }} source={require('./icons/left_arrow.png')}></Image>
                            </TouchableOpacity>
                            <View style={{ width: '85%', backgroundColor: '#ccc', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={{ width: '85%', borderRadius: 20, paddingLeft: 10, height: 40 }}
                                    placeholder={Lang_chg.txt_searech_adver[config.language]}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={text => this._searchData(text)}
                                />
                                <TouchableOpacity onPress={() => { this.hideSearchBox() }}>
                                    <Image resizeMode="contain" style={{ width: 30, height: 30, marginRight: 10 }} source={require('./icons/cross1.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                }

                <View style={styles.manage_btn}>
                    <TouchableOpacity style={styles.add_manege_btn} activeOpacity={0.8} onPress={() => {this._goConfirmPage()}}>
                        <Image resizeMode="contain" style={styles.manage_btn_row} source={require('./icons/plus.png')}></Image>
                        <Text style={styles.manage_bn_txt}>{Lang_chg.add_adver_txt[config.language]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.manege_two_title}>
                    {
                        (this.state.adver_arr != 'NA')
                            ?
                            <Text style={styles.manage_moment_btn}>({this.state.adver_count}) {Lang_chg.advertisements_txt[config.language]}</Text>
                            :
                            <Text style={styles.manage_moment_btn}></Text>
                    }
                </View>


                <View style={styles.upcoming_main}>
                    {
                        (this.state.adver_arr != 'NA')
                            ?
                            <FlatList
                                data={this.state.adver_arr}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                inverted={false}
                                renderItem={this.renderItem}
                                keyExtractor={(index) => { index.toString() }}
                            />
                            :
                            <View style={[styles.upcoming_main,{height:'70%',alignItems:'center',justifyContent:'center'}]}>
                                <Image source={require('./icons/ic_notfound.png')} style={{height:'50%',width:'50%',resizeMode:'contain',tintColor:'#d15400'}}/>
                            </View>
                    }

                </View>
                <Footer
                    activepage='Manage_o'
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
    home_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        paddingBottom: 20,
    },
    home_notificatio_btn: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    home_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    manage_btn: {
        flexDirection: 'row',
        backgroundColor: '#d15400',
        width: '90%',
        height: 60,
        alignSelf: 'center',
        borderRadius: 15,
        textAlign: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    manage_btn_row: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 20,
        marginTop: 3,
    },
    manage_bn_txt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    add_manege_btn: {
        flexDirection: 'row',
        lineHeight: 60,
        marginTop: 16,
    },
    manage_moment_btn: {
        textAlign: 'right',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Medium",
        marginTop: 20,
    },
    manege_two_title: {
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        marginBottom: 20,
    },
    manage_list_flat: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 35,
    },
    banner_img: {
        width: '100%',
        height: 200,
        resizeMode: 'cover'
    },
    manage_location: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // backgroundColor:'#00000090',
        height: 50,
        marginTop: -50,
        backgroundColor: '#d15400',
        opacity: 0.9,

    },
    manage_location_icon: {
        width: 20,
        resizeMode: 'contain',
        height: 20,
        marginLeft: 5,
        marginTop: 14,
        marginRight: 15,
    },
    location_manage: {
        color: 'white',
        fontSize: 17,
        lineHeight: 50,
        paddingLeft: 70,
    },
    manage_power: {
        fontFamily: "Ubuntu-Bold",
        fontWeight: "bold",
        fontSize: 17,
        textAlign: 'right',
        marginTop: 10,
    },
    manage_kabin_title: {
        textAlign: 'right',
        fontSize: 17,
        color: '#7c7c7c',
        fontStyle: 'italic',
        fontFamily: "Ubuntu-Regular",
    },
    manage_number: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontFamily: "Ubuntu-Regular",
    },
    manage_family_left: {
        flexDirection: 'row',
    },
    manage_user_icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    manage_cabinleft: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 17,
    },
    manage_family: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
    },
    manege_unfill: {
        width: 10,
        height: 10,
        backgroundColor: '#e6a173',
        borderRadius: 50,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 7,
    },
    manage_box_title: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20,
    },
    upcoming_main: {
        marginBottom: 200,
    },
})

