import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, Keyboard } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

export default class Forgot extends Component {
    state = {
        email:'',
        loading         : false,
        isConnected     : true,
    }

    backpress = () => {
        this.props.navigation.goBack();
    }

    _btnSubmitForgot=()=>{
        let user_email = this.state.email;
        //email============================
        if (user_email.length <= 0) {
            msgProvider.toast(Lang_chg.emptyEmail[config.language], 'center')
            return false
        }
        if (user_email.length > 50) {
            msgProvider.toast(Lang_chg.emailMaxLength[config.language], 'center')
            return false
        }
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(user_email) !== true) {
            msgProvider.toast(Lang_chg.validEmail[config.language], 'center')
            return false
        }

        if (this.state.isConnected === true) {
            let url = config.baseURL + "forget_password.php";
            var data = new FormData();
            data.append('user_email', user_email)
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    let email_arr = obj.email_arr;
                    if (typeof email_arr !== 'undefined') {
                        if (email_arr != 'NA') {
                            this.mailsendfunction(email_arr);
                        }
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    this.backpress();
                    return false;
                }else {
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
        console.log('email_arr',email_arr);
        for(let i=0;i<email_arr.length;i++){
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
            console.log('forget==',data);

            // api calling start==============================
            apifuntion.postApi(url, data).then((obj) => {
                return obj.json();
            }).then((obj) => {
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Mail send');
                }else{
                    console.log('not send mail');
                }
                // api calling end==============================    
            })
        }
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                    <Loader loading={this.state.loading} />
                <ImageBackground style={{ width: '100%', height: '100%' }} source={require('./icons/loginbgmain.png')}>

                    <View style={styles.firgot_header}>
                        <TouchableOpacity activeOpacity={.7} style={styles.back_buttn_top} onPress={() => { this.backpress() }}>
                            <Image resizeMode="contain" style={styles.forgot_back} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.logo_forgot}>
                        <Image resizeMode="contain" style={styles.forgot_logo_img} source={require('./icons/logo.png')}></Image>
                        <Text style={styles.forgot_title}>{Lang_chg.Boat_Owner[config.language]}</Text>
                    </View>

                    <View style={styles.main_login}>
                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.loginEmail[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ email: txt }) }}
                                maxLength={50}
                                minLength={6}
                                value={this.state.email}
                                keyboardType='email-address'
                            />
                            <Image style={styles.login_email} source={require('./icons/email.png')}></Image>
                        </View>

                        <View style={styles.login_btn1} >
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {this._btnSubmitForgot()}}>
                                <Text style={styles.log_txt_btn}>
                                {Lang_chg.txt_Submit[config.language]}
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        )
    }
}


const styles = StyleSheet.create({
    forgot_back: {
        width: 35,
        height: 20,
    },
    firgot_header: {
        marginTop: 25,
        marginLeft: 20,
    },
    forgot_logo_img: {
        width: 90,
        height: 90,
    },
    logo_forgot: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 90,
    },
    forgot_title: {
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
        marginTop: 50,
    },
    login_input: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        height:50
    },
    enter_emaol_login: {
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
        height:50,
        width:'100%'
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '100%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 40,
    },

})