import React, { Component } from 'react'
import { Text, View, StatusBar, SafeAreaView, Modal, FlatList, StyleSheet, Dimensions, ScrollView, Image, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native'
import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { cond } from 'react-native-reanimated';
import OneSignal from 'react-native-onesignal';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = Dimensions.get('window').height;
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            other: false,
            modalVisible: false,
            modalVisible2: false,
            modalVisible: false,
            modalVisiblege: false,
            modalVisibleotp: false,
            showOtpModel: true,
            // countrydata: demodat2,
            loading: false,
            isConnected: true,
            HidePassword: true,
            HidePassword1: true,
            city_arr: 'NA',
            city_arr1: 'NA',
            l_name: '',
            f_name: '',
            email: '',
            phone_no: '',
            business_name: '',
            business_location: '',
            selected_city: '',
            selected_city_id: '',
            dob: '',
            gender: 'Male',
            password: '',
            cpassword: '',
            timer: null,
            user_id: '',
            email: '',
            otp: '',
            minutes_Counter: '01',
            seconds_Counter: '59',
            startDisable: false,
            player_id: '123456',
        }
        OneSignal.init(config.onesignalappid, {
            kOSSettingsKeyAutoPrompt: true,
        });
        OneSignal.setLogLevel(6, 0);
    }


    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        // this.getOnsignalId();
        this._getAllCity();
        OneSignal.setLocationShared(true);
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('ids', this.onIds.bind(this));
    }
    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds.bind(this));
        OneSignal.removeEventListener('opened', this.onOpened);
    }
    onIds(device) {
        console.log('Device info: ', device);
        this.setState({
            player_id: device.userId
        });
        config.player_id_me = device.userId;
    }

    goHomePage = () => {
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }


    _searchCity = (textToSearch) => {
        this.setState({
            city_arr: this.state.city_arr1.filter(i =>
                i.city[config.language].toLowerCase().includes(textToSearch.toLowerCase()),
            ),
        })
    }

    _getAllCity = () => {
        Keyboard.dismiss()
        if (this.state.isConnected === true) {
            let url = config.baseURL + "city_list.php?country_code=965";
            this.setState({ loading: true })
            apifuntion.getApi(url).then((obj) => {

                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this.setState({ city_arr: obj.city_arr, city_arr1: obj.city_arr });
                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false });
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }

    }

    _selectCity = (index) => {

        let data = this.state.city_arr;
        let len = this.state.city_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            selected_city: data[index].city[config.language],
            selected_city_id: data[index].city_id,
            modalVisible: false,
        })

    }

    _setGender = (gender_type) => { this.setState({ gender: gender_type }); }

    _signUpBtn = () => {
        Keyboard.dismiss()
        let { f_name, l_name, email, phone_no, business_name, business_location, selected_city_id, dob, gender, password, cpassword } = this.state;


        //last name===================
        if (l_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyLastName[config.language], 'center')
            return false
        }
        if (l_name.length <= 2) {
            msgProvider.toast(Lang_chg.LastNameMinLength[config.language], 'center')
            return false
        }
        if (l_name.length > 50) {
            msgProvider.toast(Lang_chg.LastNameMaxLength[config.language], 'center')
            return false
        }

        var letters1 = /^[a-zA-Z- ]+$/;
        if (letters1.test(l_name) !== true) {
            msgProvider.toast(Lang_chg.validLastName[config.language], 'center')
            return false
        }

        //firs name===================
        if (f_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyFirstName[config.language], 'center')
            return false
        }
        if (f_name.length <= 2) {
            msgProvider.toast(Lang_chg.FirstNameMinLength[config.language], 'center')
            return false
        }
        if (f_name.length > 50) {
            msgProvider.toast(Lang_chg.FirstNameMaxLength[config.language], 'center')
            return false
        }
        var letters = /^[a-zA-Z- ]+$/;
        if (letters.test(f_name) !== true) {
            msgProvider.toast(Lang_chg.validFirstName[config.language], 'center')
            return false
        }


        //email============================
        if (email.length <= 0) {
            msgProvider.toast(Lang_chg.emptyEmail[config.language], 'center')
            return false
        }
        if (email.length > 50) {
            msgProvider.toast(Lang_chg.emailMaxLength[config.language], 'center')
            return false
        }
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(email) !== true) {
            msgProvider.toast(Lang_chg.validEmail[config.language], 'center')
            return false
        }
        //phone============================
        if (phone_no.length <= 0) {
            msgProvider.toast(Lang_chg.emptyMobile[config.language], 'center')
            return false
        }
        if (phone_no.length < 8) {
            msgProvider.toast(Lang_chg.MobileMinLength[config.language], 'center')
            return false
        }
        if (phone_no.length > 8) {
            msgProvider.toast(Lang_chg.MobileMaxLength[config.language], 'center')
            return false
        }
        var digit = /^[0-9]+$/;
        if (digit.test(phone_no) !== true) {
            msgProvider.toast(Lang_chg.validMobile[config.language], 'center')
            return false
        }
        //Bussiness name===================
        if (business_name.length <= 0) {
            msgProvider.toast(Lang_chg.BussinessEmptyName[config.language], 'center')
            return false
        }
        if (business_name.length <= 2) {
            msgProvider.toast(Lang_chg.BussinessNameMinLength[config.language], 'center')
            return false
        }
        if (business_name.length > 50) {
            msgProvider.toast(Lang_chg.BussinessNameMaxLength[config.language], 'center')
            return false
        }

        //Business location===================
        // if (business_location.length <= 0) {
        //     msgProvider.toast(Lang_chg.businessLocationempty[config.language], 'center')
        //     return false
        // }

        if (business_name.length <= 2) {
            msgProvider.toast(Lang_chg.businessLocationMinLength[config.language], 'center')
            return false
        }

        if (selected_city_id.length == 0) {
            msgProvider.toast(Lang_chg.emptyCity[config.language], 'center')
            return false
        }
        if (dob.length <= 0) {
            msgProvider.toast(Lang_chg.emptydob[config.language], 'center')
            return false
        }
        if (gender.length <= 0) {
            msgProvider.toast(Lang_chg.emptygender[config.language], 'center')
            return false
        }

        //password===================
        if (password.length <= 0) {
            msgProvider.toast(Lang_chg.emptyPassword[config.language], 'center')
            return false
        }
        if (password.length <= 5) {
            msgProvider.toast(Lang_chg.PasswordMinLength[config.language], 'center')
            return false
        }
        if (password.length > 16) {
            msgProvider.toast(Lang_chg.PasswordMaxLength[config.language], 'center')
            return false
        }
        //cpassword===================
        if (cpassword.length <= 0) {
            msgProvider.toast(Lang_chg.emptyConfirmPWD[config.language], 'center')
            return false
        }
        if (cpassword.length <= 5) {
            msgProvider.toast(Lang_chg.ConfirmPWDMinLength[config.language], 'center')
            return false
        }
        if (cpassword.length > 16) {
            msgProvider.toast(Lang_chg.ConfirmPWDMaxLength[config.language], 'center')
            return false
        }
        if (cpassword !== password) {
            msgProvider.toast(Lang_chg.ConfirmPWDMatch[config.language], 'center')
            return false
        }


        // f_name, l_name, email,phone_no, business_name, business_location,selected_city_id,dob,gender,password,cpassword


        if (this.state.isConnected === true) {
            let url = config.baseURL + "signup.php";
            var data = new FormData();
            data.append('f_name', f_name)
            data.append('l_name', l_name)
            data.append('email', email)
            data.append('phone_number', phone_no)
            data.append('business_name', business_name)
            data.append('country_code', 965)
            // data.append('business_location', business_location)
            data.append('city', selected_city_id)
            data.append('dob', dob)
            if (gender == 'Male') {
                data.append('gender', 1)
            } else {
                data.append('gender', 2)
            }
            data.append('password', password)
            data.append("device_type", config.device_type)
            data.append("player_id", this.state.player_id)

            data.append("login_type", 0)
            data.append("user_type_post", 2)
            data.append("language_id", config.language)


            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {

                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {

                    console.log('password', password);
                    console.log('email', email);
                    localStorage.setItemString('password', password);
                    localStorage.setItemString('email', this.state.email);

                    console.log('user data===', obj);
                    var user_arr = obj.user_details;
                    var email_arr = obj.email_arr;
                    let user_type = user_arr.user_type;
                    let signup_step = user_arr.signup_step;
                    let user_id = user_arr.user_id;
                    let email = user_arr.email;
                    let otp = user_arr.otp;
                    if (user_type == 2) {
                        if (signup_step == 0) {
                            this.setState({
                                modalVisible2: true,
                                user_id: user_id,
                                email: email,
                                // otp: otp,
                            })
                            this.onButtonStart();
                        }
                        if (signup_step == 1) {
                            localStorage.setItemString('user_id', JSON.stringify(user_id));
                            console.log('user_id', user_id);
                            this.setState({ modalVisible2: false })
                            this.props.navigation.navigate('Add_boats', { back_page_name: 'Signup' })
                        }
                        if (signup_step == 2) {
                            localStorage.setItemString('user_id', JSON.stringify(user_id));
                            this.setState({ modalVisible2: false })
                            this.goHomePage()
                            localStorage.setItemObject('user_arr', user_arr);
                        }
                        // for mail send
                        if (typeof email_arr !== 'undefined') {
                            if (email_arr != 'NA') {
                                this.mailsendfunction(email_arr);
                            }
                        }
                    }
                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false });
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    Otpveryfication = () => {
        Keyboard.dismiss()
        var user_id = this.state.user_id;
        var otp = this.state.otp;
        if (otp.length <= 0) {
            msgProvider.alert(msgTitle.error[config.language], 'We have sent you a One Time Password to the email details provided.Please check and enter the code to complete registration', false);
            return false
        }

        if (this.state.isConnected === true) {
            var data = new FormData();
            data.append("user_id_post", user_id);
            data.append("user_otp", otp);
            data.append("player_id", 123456);
            data.append("device_type", config.device_type)
            data.append("user_type", 2);
            this.setState({ loading: true })
            console.log('otp', data)
            var url = config.baseURL + 'otp_verify.php';

            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    var user_arr = obj.user_details;
                    var email_arr = obj.email_arr;
                    let user_type = user_arr.user_type;
                    let signup_step = user_arr.signup_step;
                    let user_id = user_arr.user_id;
                    let email = user_arr.email;
                    let otp = user_arr.otp;
                    if (user_type == 2) {
                        if (signup_step == 0) {
                            this.setState({
                                modalVisible2: true,
                                user_id: user_id,
                                email: email,
                                otp: otp,
                            })
                            this.onButtonStart();
                        }
                        if (signup_step == 1) {
                            localStorage.setItemString('user_id', JSON.stringify(user_id));
                            this.setState({ modalVisible2: false })
                            this.props.navigation.navigate('Add_boats', { back_page_name: 'Signup' })
                        }
                    }

                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false });
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }

    }
    mailsendfunction = (email_arr) => {
        console.log('email_arr', email_arr);
        for (let i = 0; i < email_arr.length; i++) {
            var email = email_arr[i].email;
            var mailcontent = email_arr[i].mailcontent
            var mailsubject = email_arr[i].mailsubject
            var fromName = email_arr[i].fromName
            var url = config.baseURL + 'mailFunctionsSend.php';
            var data = new FormData();
            data.append("email", email);
            data.append("mailcontent", mailcontent);
            data.append("mailsubject", mailsubject);
            data.append("fromName", fromName);
            data.append("mail_file", 'NA');
            console.log('forget==', data);

            // api calling start==============================
            apifuntion.postApi(url, data).then((obj) => {
                return obj.json();
            }).then((obj) => {
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Mail send');
                } else {
                    console.log('not send mail');
                }
                // api calling end==============================    
            })
        }
    }
    Resendotpbtn = () => {
        Keyboard.dismiss()
        var user_id = this.state.user_id;
        clearInterval(this.state.timer);
        this.setState({
            loading: true, timer: null,
            minutes_Counter: '01',
            seconds_Counter: '59',
            startDisable: false
        })
        if (this.state.isConnected === true) {
            var data = new FormData();
            data.append("user_id_post", user_id);
            var url = config.baseURL + 'resend_otp.php';

            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    var user_arr = obj.user_details;
                    var email_arr = obj.email_arr;
                    let user_type = user_arr.user_type;
                    let signup_step = user_arr.signup_step;
                    let user_id = user_arr.user_id;
                    let email = user_arr.email;
                    let otp = user_arr.otp;
                    console.log('resend', obj);
                    this.onButtonStart();
                    // for mail send
                    if (typeof email_arr !== 'undefined') {
                        if (email_arr != 'NA') {
                            this.mailsendfunction(email_arr);
                        }
                    }


                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false });
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }

    }
    onButtonStart = () => {
        let timer = setInterval(() => {
            if (this.state.minutes_Counter == '00' && this.state.seconds_Counter == '01') {
                this.onButtonStop()
            }
            var num = (Number(this.state.seconds_Counter) - 1).toString(),
                count = this.state.minutes_Counter;
            if ((this.state.seconds_Counter) == '00') {
                count = (Number(this.state.minutes_Counter) - 1).toString();
                num = 59
            }
            if (count != -1) {
                this.setState({
                    minutes_Counter: count.length == 1 ? '0' + count : count,
                    seconds_Counter: num.length == 1 ? '0' + num : num
                });
            }
            else {
                this.onButtonStop()
            }
        }, 1000);
        this.setState({ timer });
        this.setState({ startDisable: true })
    }
    onButtonStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false })
    }


    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal animationType="slide" transparent visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity activeOpacity={9} style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible: false }) }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, }} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Choose_City[config.language]} </Text>
                        <Text></Text>
                    </View>
                    <View style={styles.search_bar}>
                        <TextInput placeholder={Lang_chg.txt_search_city[config.language]} style={{ height: 50 }} onChangeText={text => this._searchCity(text)} />
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View style={styles.other_gift_photo}>
                            <FlatList style={{ marginBottom: 50, }}
                                showsVerticalScrollIndicator={false}
                                data={this.state.city_arr}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity activeOpacity={.7} style={(item.status == true) ? styles.cityBackgroundColor1 : styles.cityBackgroundColor} onPress={() => { this._selectCity(index) }}>
                                            <View style={styles.main_view_flag}>
                                                <Text style={styles.flag_text_detail}>
                                                    {item.city[config.language]}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent visible={this.state.modalVisiblege}
                    onRequestClose={() => {
                        this.setState({ modalVisiblege: false })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={{ height: '100%', backgroundColor: '#ffffff' }}>

                        <View style={styles.notification_header}>

                            <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisiblege: false }) }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={require('./icons/left_arrow.png')}></Image>
                            </TouchableOpacity>
                            <Text style={styles.Notifications_title}>{Lang_chg.Choose_Gender[config.language]} </Text>
                            <Text></Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                            <View style={styles.select_gender}>
                                <View style={{ paddingBottom: 30, paddingLeft: 20, paddingRight: 20 }}>
                                    <TouchableOpacity onPress={() => { this._setGender('Male') }} activeOpacity={0.9}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                            {
                                                (this.state.gender == 'Male') ?
                                                    <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                                    :
                                                    <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                                            }
                                            <Text style={{ marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>Male </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                                    <TouchableOpacity onPress={() => { this._setGender('Female') }} activeOpacity={0.9}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                            {
                                                (this.state.gender == 'Female') ?
                                                    <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                                    :
                                                    <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                                            }
                                            <Text style={{ marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>Female</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible2}
                >
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000040', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: screenWidth * 100 / 100, alignContent: 'center' }}>

                            <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 17, paddingTop: 15, alignContent: 'center', alignItems: 'center', elevation: 5, borderRadius: 5, width: screenWidth * 80 / 100, }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, fontFamily: "Ubuntu-Regular", fontWeight: 'bold' }}>{Lang_chg.otp_verification[config.language]}</Text>
                                <Text style={{ fontFamily: "Ubuntu-Regular", color: 'greay', fontSize: 14, paddingTop: 13 }}>{Lang_chg.otp_verification1[config.language]}</Text>
                                <Text style={{ fontFamily: "Ubuntu-Regular", color: 'greay', fontSize: 14, paddingTop: 13 }}>{Lang_chg.loginEmail[config.language]} : {this.state.email} <Text style={{ color: '#0c3ecc' }} onPress={() => {
                                    this.setState({
                                        modalVisible2: false,
                                        timer: null,
                                        minutes_Counter: '01',
                                        seconds_Counter: '59',
                                        startDisable: false
                                    }); clearInterval(this.state.timer);
                                }}>{Lang_chg.txt_edit[config.language]}</Text></Text>
                                <TextInput
                                    placeholder={Lang_chg.txt_otp[config.language]}
                                    placeholderTextColor='#d1d1d1'
                                    keyboardType='number-pad'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    // ref={(input) => { this.otp = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ otp: txt }) }}
                                    maxLength={6}
                                    value={this.state.otp.toString()}
                                    style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, width: '95%', textAlign: 'center', fontSize: 15, fontFamily: "Ubuntu-Regular" }}
                                />


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 32, paddingHorizontal: 20 }}>
                                    {this.state.startDisable == true && <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                                        <View style={{ backgroundColor: '#fc6603', width: 30, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.counterText}>{this.state.minutes_Counter}</Text>
                                        </View>
                                        <View style={{ marginLeft: 5, backgroundColor: '#fc6603', width: 30, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.counterText}>{this.state.seconds_Counter}</Text>
                                        </View>

                                    </View>}
                                    {this.state.startDisable == false && <TouchableOpacity onPress={() => { this.Resendotpbtn() }}>
                                        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 14, color: 'red', paddingRight: 15 }}>{Lang_chg.txt_RESEND[config.language]}</Text>
                                    </TouchableOpacity>}
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.Otpveryfication() }}>
                                        <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 14, color: '#0c3ecc' }}>{Lang_chg.txt_VERIFY[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    </TouchableOpacity>
                </Modal>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>

                    <KeyboardAwareScrollView>
                        <View style={styles.sign_top_logo}>
                            <Image style={styles.sign_logo} source={require('./icons/logo.png')}></Image>
                            <Text style={styles.sign_up}>{Lang_chg.Boat_Owner[config.language]}</Text>
                        </View>

                        <View style={styles.main_login_top}>
                            <View style={[styles.login_input_top]}>
                                <TextInput
                                    style={{
                                        textAlign: 'right',
                                        width: '85%',
                                        height: 50,
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                        fontSize: 14,
                                        fontFamily: "Ubuntu-Regular",
                                    }}
                                    placeholder={Lang_chg.last_name_txt[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    autoCapitalize='none'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ l_name: txt }) }}
                                    maxLength={50}
                                    minLength={6}
                                    value={this.state.l_name}
                                    keyboardType='default'
                                />
                                <Image style={[styles.login_email, { marginRight: 10 }]} source={require('./icons/user.png')}></Image>
                            </View>
                            <View style={styles.login_input_top}>
                                <TextInput
                                    style={styles.enter_emaol_login}
                                    placeholder={Lang_chg.first_name_txt[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ f_name: txt }) }}
                                    maxLength={50}
                                    minLength={6}
                                    value={this.state.f_name}
                                    keyboardType='default'
                                />
                                <Image style={[styles.login_email, { marginRight: 10 }]} source={require('./icons/user.png')}></Image>
                            </View>
                        </View>

                        <View style={styles.main_login}>
                            <View style={styles.login_input}>
                                <TextInput
                                    style={styles.enter_emaol_login}
                                    placeholder={Lang_chg.loginEmail[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    maxLength={50}
                                    minLength={6}
                                    value={this.state.email}
                                    keyboardType='email-address'
                                />
                                <Image style={styles.login_email} source={require('./icons/email.png')}></Image>
                            </View>
                            <View style={styles.login_input}>
                                <Text style={{ width: '15%', textAlign: 'right' }}>+965</Text>
                                <TextInput
                                    style={styles.enter_emaol_login}
                                    placeholder={Lang_chg.phone_no_txt[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ phone_no: txt }) }}
                                    maxLength={8}
                                    minLength={8}
                                    value={this.state.phone_no}
                                    keyboardType='phone-pad'
                                />
                                <Image style={styles.login_email} source={require('./icons/call.png')}></Image>
                            </View>
                            <View style={styles.login_input_pass}>

                                <TextInput
                                    style={styles.enter_emaol_login}
                                    placeholder={Lang_chg.Business_Name_no_txt[config.language]}

                                    placeholderTextColor="#b8b8b8"
                                    autoCapitalize='none'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ business_name: txt }) }}
                                    maxLength={50}
                                    minLength={6}
                                    value={this.state.business_name}
                                    keyboardType='default'
                                />
                                <Image style={styles.login_email} source={require('./icons/business.png')}></Image>
                            </View>
                            {/* <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                placeholder="Business Location"
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                // ref={(input) => {this.password=input;}}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ business_location: txt }) }}
                                maxLength={50}
                                minLength={6}
                                value={this.state.business_location}
                                keyboardType='default'
                            />
                            <Image style={styles.login_email} source={require('./icons/business_location.png')}></Image>
                        </View> */}

                            <View>
                                <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible: true }) }}>
                                    <View style={{ width: '20%' }}>
                                        <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                    </View>
                                    <View style={{ width: '70%' }}>
                                        <Text style={styles.select_trip_txt}>{(this.state.selected_city != '') ? this.state.selected_city : Lang_chg.choose_city_txt[config.language]}</Text>
                                    </View>
                                    <View style={{ width: '15%', alignItems: 'center' }}>
                                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#d15400' }} source={require('./icons/home_1.png')}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View>



                            <View style={styles.edit_calender}>
                                <DatePicker
                                    style={styles.datePickerStyle}
                                    date={this.state.dob} // Initial date from state
                                    mode="date" // The enum of date, datetime and time
                                    placeholder={Lang_chg.dob_txt[config.language]}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    maxDate={new Date()}
                                    customStyles={{
                                        dateIcon: {
                                            alignItems: 'flex-end',
                                        },
                                        dateInput: {
                                            borderColor: '#234456',
                                            borderWidth: 0,
                                            borderRadius: 4,
                                            alignItems: 'flex-end',
                                            paddingRight: 10
                                        },
                                    }}
                                    onDateChange={(date) => { this.setState({ dob: date }) }}
                                />
                            </View>

                            <View>
                                <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisiblege: true }) }}>
                                    <View style={{ width: '20%' }}>
                                        <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                    </View>
                                    <View style={{ width: '70%' }}>
                                        <Text style={styles.select_trip_txt}>{(this.state.gender == '') ? Lang_chg.Choose_Gender[config.language] : this.state.gender}</Text>
                                    </View>
                                    <View style={{ width: '15%', alignItems: 'center' }}>
                                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#d15400' }} source={require('./icons/gender.png')}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.login_input_pass}>
                                <TouchableOpacity activeOpacity={.7}
                                    onPress={() => {
                                        this.setState({
                                            HidePassword: !this.state.HidePassword
                                        })
                                    }}>

                                    {
                                        this.state.HidePassword
                                            ?
                                            <Image style={styles.login_email} source={require('./icons/eye.png')} />
                                            :
                                            <Image style={styles.login_email} source={require('./icons/eye-close.png')} />
                                    }
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.pass_login}
                                    placeholder={Lang_chg.loginpassword[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ password: txt }) }}
                                    maxLength={16}
                                    minLength={6}
                                    value={this.state.password}
                                    keyboardType='default'
                                    secureTextEntry={this.state.HidePassword}
                                />

                                <Image style={styles.login_email} source={require('./icons/lock.png')}></Image>
                            </View>
                            <View style={styles.login_input_pass}>
                                <TouchableOpacity activeOpacity={.7}
                                    onPress={() => {
                                        this.setState({
                                            HidePassword1: !this.state.HidePassword1
                                        })
                                    }}
                                >
                                    {
                                        this.state.HidePassword1
                                            ?
                                            <Image style={styles.login_email} source={require('./icons/eye.png')} />
                                            :
                                            <Image style={styles.login_email} source={require('./icons/eye-close.png')} />
                                    }
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.pass_login}
                                    onChangeText={this.handleTextChange}
                                    placeholder={Lang_chg.c_pass_txt[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    autoCapitalize='none'
                                    returnKeyType='done'
                                    // ref={(input) => {this.password=input;}}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ cpassword: txt }) }}
                                    maxLength={16}
                                    minLength={6}
                                    value={this.state.cpassword}
                                    keyboardType='default'
                                    secureTextEntry={this.state.HidePassword1}
                                />
                                <Image style={styles.login_email} source={require('./icons/lock.png')}></Image>
                            </View>
                        </View>

                        <View style={styles.privact_section}>

                            <Text style={styles.service_privact}>{Lang_chg.loginterm1[config.language]} <Text style={styles.terms_popup} style={{ textDecorationLine: 'underline', }} onPress={() => { this.props.navigation.navigate('Terms', { 'contantpage': 2 }) }}>
                                {Lang_chg.loginterm2[config.language]}</Text> {Lang_chg.loginterm3[config.language]} <Text style={styles.privacy_policy} style={{ textDecorationLine: 'underline', }} onPress={() => { this.props.navigation.navigate('Terms', { 'contantpage': 1 }) }}>{Lang_chg.loginterm4[config.language]}</Text></Text>

                        </View>

                        <View style={styles.login_btn1}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                // onPress={() => { this.setState({ modalVisible2: true }) }}
                                onPress={this._signUpBtn}
                            >
                                <Text style={styles.log_txt_btn}>
                                    {Lang_chg.Signup_txt[config.language]}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        {
                            (config.language == 0) ? <View style={styles.login_account}>
                                <Text style={styles.login_dont_left}>{Lang_chg.do_you1[config.language]} </Text>
                                <View style={{ borderBottomColor: '#d15400', borderBottomWidth: 1 }}>
                                    <Text style={styles.login_dont_right} onPress={() => { this.props.navigation.navigate('Login') }}> {Lang_chg.Login_txt[config.language]}</Text>
                                </View>
                            </View>
                                :
                                <View style={styles.login_account}>
                                    <View style={{ borderBottomColor: '#d15400', borderBottomWidth: 1 }}>
                                        <Text style={styles.login_dont_right} onPress={() => { this.props.navigation.navigate('Login') }}> {Lang_chg.Login_txt[config.language]}</Text>
                                    </View>
                                    <Text style={styles.login_dont_left}>{Lang_chg.do_you1[config.language]} </Text>
                                </View>
                        }

                    </KeyboardAwareScrollView>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sign_logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    sign_top_logo: {
        alignItems: 'center',
        marginTop: 50,
    },
    sign_up: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 25,
        color: '#d15400',
        marginTop: 5,
        fontWeight: 'bold',
    },
    main_login: {
        width: "90%",
        alignItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    login_account: {
        flexDirection: 'row',
        alignSelf: 'center',

        marginBottom: 10,
    },
    login_dont_right: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: '#d15400',
    },

    login_dont_left: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
    },
    cityBackgroundColor: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderBottomColor: '#d15400',
        borderBottomWidth: 1,
    },
    cityBackgroundColor1: {
        backgroundColor: '#d15400',
        justifyContent: 'center',
        borderBottomColor: '#d15400',
        borderBottomWidth: 1,
    },
    login_input: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        height: 50,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    enter_emaol_login: {
        textAlign: 'right',
        width: '85%',
        height: 50,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 14,
        fontFamily: "Ubuntu-Regular"
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    login_input_pass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 50,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Ubuntu-Regular",
    },
    login_input_top: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '49%',
        height: 50,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    main_login_top: {
        width: '90%',
        flexDirection: 'row',
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 30,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
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
    privact_section: {
        paddingRight: 20,
        paddingLeft: 20,
    },
    service_privact: {
        textAlign: 'center',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
    },
    terms_popup: {
        color: 'red',

    },
    privacy_policy: {
        borderBottomWidth: 1,
        borderColor: 'red',
        color: 'red',
    },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
    },
    back_buttn_top: {
        marginTop: 3,
    },
    hole_top_l1: {
        width: 20,
        height: 20,
    },
    Notifications_title: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 20,
        color: '#000',
    },
    search_bar: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#000',
        borderTopWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
    },
    main_view_flag: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        paddingVertical: 10,
    },
    flag_text_detail: {
        color: '#333232',
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
    },
    flag_image_home: {
        width: 20,
        height: 20,
        marginLeft: 20,
        marginTop: 5,
    },
    select_trip_box: {
        flexDirection: 'row',
        borderWidth: 1,
        width: '96%',
        borderColor: '#d15400',
        borderRadius: 15,
        paddingLeft: 20,
        paddingBottom: 14,
        paddingTop: 14,
        marginBottom: 20,
    },
    arrow_img: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginTop: 5,
    },
    select_trip_txt: {
        textAlign: 'right',
        fontSize: 16,
        color: '#888',
    },
    select_gender: {
        width: '80%',
        height: 200,
    },
    doanload_popup: {
        textAlign: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        width: BannerWidth * 80 / 100,
        // backgroundColor:'#19191f',
        borderRadius: 0,
        paddingTop: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
    },
    download_popup_header: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 0,

    },
    download_txt_detail: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
    },
    popup_download_ok: {
        width: '100%',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 30,
    },

    container: {
        flex: 1,
    },
    inputcontainer: {
        backgroundColor: '#f2f7f2',
        width: '100%',
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 5
    },
    textfiledinput: {
        width: '100%',
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold'
    },
    counterText: {
        color: '#FFFFFF', textAlign: 'center',
        borderRadius: 5, alignSelf: 'center',
        fontFamily: "Ubuntu-Regular",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    edit_calender: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#d15400',
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
        paddingLeft: 20,
        marginBottom: 20,
    },
    datePickerStyle: {
        width: '100%',
    },
})