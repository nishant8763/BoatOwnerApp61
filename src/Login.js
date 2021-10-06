import React, { Component } from 'react'
import { Text, View, SafeAreaView, ImageBackground, Modal, Alert, StyleSheet, StatusBar, Image, TextInput, TouchableOpacity, Keyboard, Dimensions, BackHandler, Linking } from 'react-native'
import { Checkbox } from 'react-native-paper';
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { firebaseprovider } from './Provider/FirebaseProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { cond } from 'react-native-reanimated';
import { notification } from './Provider/NotificationProvider';
import OneSignal from 'react-native-onesignal';
import { CommonActions } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
export default class Login extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            language_id: config.language,
            password: '',
            HidePassword: true,
            email: '',
            loading: false,
            isConnected: true,
            checked: false,
            timer: null,
            otp: '',
            minutes_Counter: '01',
            seconds_Counter: '59',
            startDisable: false,
            modalVisible2: false,
            user_id: 0,
            player_id: 123456,
            admin_email: '',
        }

        OneSignal.init(config.onesignalappid, {
            kOSSettingsKeyAutoPrompt: true,
        });
        OneSignal.setLogLevel(6, 0);

        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }


    componentDidMount() {
        // OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.setNotificationOpenedHandler(notification => {
        //   console.log('onsignal notification==', notification);
        //     this.OSLog("OneSignal: notification opened:", notification);
        // });
        OneSignal.setLocationShared(true);
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('ids', this.onIds.bind(this));


        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });

        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        this.setLanuguage();
        this.checkRememberMe();
        this.getAdminDetails();
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    onIds(device) {
        console.log('Device info: ', device);
        this.setState({
            player_id: device.userId
        });
        config.player_id_me = device.userId;
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds.bind(this));
        OneSignal.removeEventListener('opened', this.onOpened);
    }

    // onOpened=async(openResult)=>{
    //     console.log('onsignal notification==');
    // }

    _contactToAdmin = () => {
        // alert(this.state.admin_email);
        Linking.openURL('mailto:' + this.state.admin_email);
    }

    getAdminDetails = () => {
        if (this.state.isConnected === true) {
            let url = config.baseURL + "adminDetails.php";
            this.setState({ loading: true })
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    var admin_arr = obj.admin_arr
                    if (admin_arr != 'NA') {
                        this.setState({ admin_email: admin_arr.email })
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
                this.setState({ loading: false });
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
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

    checkRememberMe = async () => {
        var remember_me = await localStorage.getItemString('remember_me');
        if (remember_me == 'yes') {
            let email = await localStorage.getItemString('email');
            let password = await localStorage.getItemString('password');
            this.setState({
                email: email,
                password: password,
                checked: true,
            });
        }
    }
    setLanuguage = async () => {
        let language = await localStorage.getItemObject('language');
        if (language == null) {
            config.language = 0;
            localStorage.setItemString('language',JSON.stringify(0));
            this.setState({ language_id: 0});
        }else {
            if(language=='1'|| language==1){
                config.language = 1;
                this.setState({ language_id: 1 });
            }else{
                config.language = 0;
                this.setState({ language_id: 0});
            }
        }
    }
    
    changeLanguage = async () => {
        if (config.language == 0) {
            config.language = 1;
            this.setState({ language_id: 1 });
            localStorage.setItemString('language', '1');
        } else {
            config.language = 0;
            this.setState({ language_id: 0 });
            localStorage.setItemString('language', '0');
        }
    }

    _btnSubmiLogin = () => {

        Keyboard.dismiss()
        let { email, password } = this.state;
        //remember me=============

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

        if (this.state.isConnected === true) {
            let url = config.baseURL + "login.php";
            var data = new FormData();
            data.append('email', email)
            data.append('password', password)
            data.append("device_type", config.device_type)
            data.append("player_id", this.state.player_id)
            data.append("user_login_type", 0)
            data.append("action_type", 'normal_login')
            data.append("language_id", config.language)
            data.append("country_code", 965)
            data.append("user_type", 2)
            console.log('jhhjkfhskjdfh', data);
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    localStorage.setItemString('password', this.state.password);
                    localStorage.setItemString('email', this.state.email);
                    if (this.state.checked) {
                        localStorage.setItemString('remember_me', 'yes');
                    } else {
                        localStorage.setItemString('remember_me', 'no');
                    }
                    console.log('password', password);
                    console.log('email', email);

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
                            })
                            this.onButtonStart();
                        }
                        if (signup_step == 1) {
                            localStorage.setItemString('user_id', JSON.stringify(user_id));
                            console.log('user_id', user_id);
                            this.setState({ modalVisible2: false })
                            this.props.navigation.navigate('Add_boats', {
                                back_page_name: 'Login'
                            })
                        }
                        if (signup_step == 2) {
                            localStorage.setItemString('user_id', JSON.stringify(user_id));
                            this.setState({ modalVisible2: false })
                            localStorage.setItemObject('user_arr', user_arr);
                            firebaseprovider.firebaseUserCreate();
                            firebaseprovider.getMyInboxAllData();
                            this.goHomePage()
                        }
                        if (obj.notification_arr != 'NA') {
                            notification.oneSignalNotificationSendCall(obj.notification_arr)
                        }
                        // for mail send
                        if (typeof email_arr !== 'undefined') {
                            if (email_arr != 'NA') {
                                this.mailsendfunction(email_arr);
                            }
                        }
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
            data.append("player_id", config.player_id_me);
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
                             this.props.navigation.navigate('Add_boats', {
                                back_page_name: 'Login'
                            })
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
                console.log('objobjobj',obj);
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
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar barStyle='default' hidden={false} backgroundColor={color1.white_color} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
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


                <ImageBackground style={{ height: screenHeight }} source={require('./icons/loginbgmain.png')}>
                    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{flexGrow:1}}>
                        <View style={styles.login_header}>

                            <TouchableOpacity style={styles.login_country} activeOpacity={0.7}
                            // onPress={() => { this.setState({ modalVisible: true }) }}
                            >
                                <Image style={styles.flag_img_login} source={require('./icons/flag.png')}></Image>
                                <Text style={styles.country_txt_login}>Kuwait</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.login_language} activeOpacity={0.7}
                                onPress={() => {
                                    this.changeLanguage()
                                }}
                            >
                                <Image style={styles.countyyimg} source={require('./icons/language.png')}></Image>
                                <Text style={styles.country_txt}>{(this.state.language_id == 0) ? 'En' : 'Ar'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.login_logo}>
                            <Image style={styles.login_logo_img} source={require('./icons/logo.png')}></Image>
                            <Text style={styles.logo_heading}>{Lang_chg.Boat_Owner[config.language]}</Text>
                        </View>

                        <View style={styles.main_login}>

                            <View style={styles.login_input}>
                                <TextInput
                                    style={styles.enter_emaol_login}
                                    placeholder={Lang_chg.loginEmail[config.language]}
                                    placeholderTextColor="#b8b8b8"
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    maxLength={50}
                                    minLength={6}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                                <Image style={styles.login_email} source={require('./icons/email.png')}></Image>
                            </View>

                            <View style={styles.login_input_pass}>
                                <TouchableOpacity activeOpacity={.7}
                                    onPress={() => {
                                        this.setState({
                                            HidePassword: !this.state.HidePassword
                                        })
                                    }}
                                >
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
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onChangeText={(txt) => { this.setState({ password: txt }) }}
                                    maxLength={16}
                                    minLength={6}
                                    keyboardType='default'
                                    secureTextEntry={this.state.HidePassword}
                                    autoCapitalize='none'
                                />
                                <Image style={styles.login_email} source={require('./icons/lock.png')}></Image>
                            </View>

                        </View>

                        <View style={styles.forgot_section}>
                            <View>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Forgot') }}>
                                    <Text styles={styles.forgot_txt}>{Lang_chg.loginForgotPass[config.language]}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.book_now_check], { alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ marginTop: 5 }}> {Lang_chg.text_remember_me[config.language]}</Text>
                                <View >
                                    <CheckBox
                                        center
                                        title=''
                                        checkedColor='#d15400'
                                        checked={this.state.checked}
                                        onPress={() => {
                                            this.setState({
                                                checked: !this.state.checked
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.login_btn1}>
                            <TouchableOpacity onPress={() => { this._btnSubmiLogin() }} activeOpacity={0.7}>
                                <Text style={styles.log_txt_btn}>
                                    {Lang_chg.Login_txt[config.language]}
                                </Text>
                            </TouchableOpacity>
                        </View>
                                
                                {
                                    (config.language==0)?
                                    <View style={styles.login_account}>
                                        <Text style={styles.login_dont_left}>{Lang_chg.dont_have_acc[config.language]} </Text>
                                        <View style={{borderBottomColor:'#d15400',borderBottomWidth:1}}>
                                        <Text style={styles.login_dont_right} onPress={() => { this.props.navigation.navigate('Signup') }}> {Lang_chg.txt_signup[config.language]}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.login_account}>
                                        <View style={{borderBottomColor:'#d15400',borderBottomWidth:1}}>
                                        <Text style={styles.login_dont_right} onPress={() => { this.props.navigation.navigate('Signup') }}> {Lang_chg.txt_signup[config.language]}</Text>
                                        </View>
                                        <Text style={styles.login_dont_left}>{Lang_chg.dont_have_acc[config.language]} </Text>
                                    </View>
                                }
                        

                        <View style={{ backgroundColor: '#fff', }}>
                            <View style={{alignSelf:'center',borderBottomColor:'#d15400',borderBottomWidth:1}}>
                            <TouchableOpacity onPress={() => {this._contactToAdmin()}} activeOpacity={0.7}>
                                <Text style={{
                                    marginTop:20,
                                    textAlign: 'center',
                                    fontFamily: 'Ubuntu-Bold',
                                    fontSize: 15,
                                    color: '#d15400',
                                }}>
                                    {Lang_chg.contact_To_ad_txt[config.language]}
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>

            </View>

        )
    }

}


const styles = StyleSheet.create({

    logo: {
        width: '100%',

    },
    login_logo_img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    login_logo: {
        alignItems: 'center',
        marginTop: 50,
    },
    login_email: {
        width: 20,
        height: 25,
        resizeMode: 'contain',
        // marginTop: 10,
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
    },
    book_now_check: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    login_input_pass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        height: 50,
        backgroundColor: '#fff',
        marginTop: 20,
    },


    enter_emaol_login: {
        textAlign: 'right',
        width: '100%',
        height: 50,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular"
    },
    checkbox12: {
        borderColor: '#d15400', borderWidth: 1, height: 20, width: 20, flexDirection: 'row'
    },
    checkbox13: {
        borderWidth: 0,
        flexDirection: 'row'
    },
    main_login: {
        width: "90%",
        alignItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,

    },
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular"
    },
    forgot_txt: {
        fontFamily: "Ubuntu-Medium",
        fontSize: 14,
        color: '#848484',
        borderColor: '#6f6f6f',
        borderBottomColor: '#848484',
        borderBottomWidth: 1
    },

    forgot_section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        marginBottom: 50,

    },
    remember_txt: {
        color: '#6f6f6f',
        fontFamily: "Ubuntu-Medium",
        fontSize: 14,
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '90%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
    },

    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },
    login_account: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 25,
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
    foter_mani_bg: {
        width: '100%',
        height: 120,


    },
    logo_heading: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20,
        color: '#d15400',
        marginTop: 5,
        fontWeight: 'bold',
    },
    foter_img: {
        position: 'relative',
        width: '100%',
        bottom: 0,
        // repeat:none,
    },
    login_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 11,
    },
    login_language: {
        flexDirection: 'row',
    },
    login_country: {
        flexDirection: 'row',
    },
    countyyimg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 5,
    },
    flag_img_login: {
        width: 25,
        height: 20,
        resizeMode: 'contain',
        marginRight: 7,
    },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#d15400',
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
        color: '#ffffff',
    },

    popup_search_icon: {
        width: 20,
        height: 20,
        marginTop: 5,
    },
    flag_image_home: {
        width: 20,
        height: 20,
        marginLeft: 20,
        marginTop: 5,
    },
    flag_text_detail: {
        color: '#333232',
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
    },
    main_view_flag: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 20,
    },
    search_bar: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#000',
        borderTopWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
    }

})