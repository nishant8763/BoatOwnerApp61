 import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import color1 from './Colors'
import { firebaseprovider}  from './Provider/FirebaseProvider';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import OneSignal from 'react-native-onesignal';
export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            player_id: '123456',
            isConnected: true,
        }
        OneSignal.init(config.onesignalappid, {
            kOSSettingsKeyAutoPrompt: true,
        });
        OneSignal.setLogLevel(6, 0);
        // OneSignal.setAppId("5b44fd62-0f0b-477a-a79e-4377322c1185");
        // OneSignal.setLogLevel(6, 0);
        // OneSignal.setRequiresUserPrivacyConsent(false);
    }
    // 5b44fd62-0f0b-477a-a79e-4377322c1185
    componentDidMount() {
        OneSignal.setLocationShared(true);
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('ids', this.onIds.bind(this));
        this.setLanuguage();
        const timer = setTimeout(() => {
            this.authenticateSession();
        }, 2000);
        return () => clearTimeout(timer);
    }
    componentWillUnmount(){
        OneSignal.removeEventListener('ids', this.onIds.bind(this));
    }
    onIds(device) {
        console.log('Device info: ', device);
        this.setState({
            player_id: device.userId
        });
        config.player_id_me=device.userId;
    }
    
    setLanuguage = async () => {
        let language = await localStorage.getItemObject('language');
        if (language == null) {
            config.language = 0;
            localStorage.setItemString('language',JSON.stringify(0));
        } else {
            config.language = parseInt(language);
        }
    }
   
    
    authenticateSession = async () => {
        const { navigation } = this.props;
        let result = await localStorage.getItemObject('user_arr');

        console.log('splasedata', result)
        if (result != null) {
            let email = result.email;
            let pass = await localStorage.getItemString('password');
            if (result.login_type == 0) {
                this._loginBTN(email, pass);
                //this.props.navigation.push('Home');
            }
        } else {
            // this.props.navigation.navigate('Terms')
            this.props.navigation.navigate('Login')
        }
    }

    _loginBTN = (email, password) => {
        let url = config.baseURL + 'login.php';
        var data = new FormData();
        data.append("email", email);
        data.append("user_login_type", 0);
        data.append("password", password);
        data.append("language_id", config.language);
        data.append("device_type", config.device_type);
        data.append("player_id", this.state.player_id);
        data.append("action_type", 'auto_login');
        data.append("user_type", 2)

        //api calling-----------------    
        if (this.state.isConnected === true) {

            apifuntion.postApi(url, data).then((obj) => {
                return obj.json();
            }).then((obj) => {
                console.log('user arr---', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    var user_arr = obj.user_details;
                    let user_type = user_arr.user_type;
                    let signup_step = user_arr.signup_step;
                    if (user_type == 2) {
                        if (signup_step == 0) {
                            this.props.navigation.navigate('Login')
                        }
                        if (signup_step == 1) {
                            this.props.navigation.navigate('Add_boats',{back_page_name:'Splash'})
                        }
                        if (signup_step == 2) {
                            localStorage.setItemObject('user_arr', user_arr);
                            firebaseprovider.firebaseUserCreate();
                            firebaseprovider.getMyInboxAllData();
                            this.props.navigation.navigate('Home')
                        }
                    }
                } else {
                    if (obj.account_active_status == "deactivate") {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    this.props.navigation.navigate('Login');
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                this.props.navigation.navigate('Login')
                console.log("-------- error ------- " + error);
            });
        }
        else {
            this.props.navigation.navigate('Login')
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: color1.white_color }}>
                <View style={styles.container}>
                    <StatusBar hidden={true} backgroundColor='green' translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <Image
                        style={styles.logo}
                        source={require('../src/icons/splash.png')}></Image>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});