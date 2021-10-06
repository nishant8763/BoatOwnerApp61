import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, StyleSheet, TextInput, Keyboard } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { ScrollView } from 'react-native-gesture-handler';

export default class Change_pass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            c_pass: '',
            new_pass: '',
            old_pass: '',
            HidePassword: true,
            HidePassword1: true,
            HidePassword2: true,
            isConnected: true,
            loading: false,
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
    _btnChangePassword = async () => {
        let result = await localStorage.getItemObject('user_arr');
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        Keyboard.dismiss()
        let { c_pass, new_pass, old_pass } = this.state;
        //old password==============
        if (old_pass.length <= 0) {

            msgProvider.toast(Lang_chg.emptyoldPassword[config.language], 'center');
            return false;
        }
        if (old_pass.length <= 5) {
            msgProvider.toast(Lang_chg.PasswordoldMinLength[config.language], 'center');
            return false;
        }
        if (old_pass.length >= 17) {
            msgProvider.toast(Lang_chg.PasswordoldMaxLength[config.language], 'center');
            return false;
        }

        //new password==============
        if (new_pass.length <= 0) {
            msgProvider.toast(Lang_chg.emptyNewPassword[config.language], 'center');
            return false;
        }
        if (new_pass.length <= 5) {
            msgProvider.toast(Lang_chg.PasswordNewMinLength[config.language], 'center');
            return false;
        }
        if (new_pass.length >= 17) {
            msgProvider.toast(Lang_chg.PasswordNewMaxLength[config.language], 'center');
            return false;
        }
        //confirm password==============
        if (c_pass.length <= 0) {
            msgProvider.toast(Lang_chg.emptyConfirmPWD[config.language], 'center');
            return false;
        }
        if (c_pass.length <= 5) {
            msgProvider.toast(Lang_chg.ConfirmPWDMinLength[config.language], 'center');
            return false;
        }
        if (c_pass.length >= 17) {
            msgProvider.toast(Lang_chg.ConfirmPWDMaxLength[config.language], 'center');
            return false;
        }

        if (c_pass != new_pass) {
            msgProvider.toast(Lang_chg.ConfirmPWDMatch[config.language], 'center');
            return false;
        }


        if (this.state.isConnected === true) {
            let url = config.baseURL + "change_password.php";
            var data = new FormData();
            data.append('password_old', old_pass)
            data.append('password_new', new_pass)
            data.append('user_id_post', user_id_post)
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    localStorage.setItemString('password', this.state.new_pass);
                    this.props.navigation.navigate('Setting');
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

    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.change_language_txt[config.language]}</Text>
                    <Text></Text>
                </View>
                <ScrollView keyboardShouldPersistTaps='handled'>
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
                            onChangeText={this.handleTextChange}
                            placeholder={Lang_chg.old_pass_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ old_pass: txt }) }}
                            maxLength={16}
                            minLength={6}
                            value={this.state.old_pass}
                            keyboardType='default'
                            secureTextEntry={this.state.HidePassword}
                        />
                        <Image style={styles.login_email} source={require('./icons/lock1.png')}></Image>
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
                            placeholder={Lang_chg.new_pass_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ new_pass: txt }) }}
                            maxLength={16}
                            minLength={6}
                            value={this.state.new_pass}
                            keyboardType='default'
                            secureTextEntry={this.state.HidePassword1}
                        />
                        <Image style={styles.login_email} source={require('./icons/lock1.png')}></Image>
                    </View>


                    <View style={styles.login_input_pass}>
                        <TouchableOpacity activeOpacity={.7}
                            onPress={() => {
                                this.setState({
                                    HidePassword2: !this.state.HidePassword2
                                })
                            }}
                        >
                            {
                                this.state.HidePassword2
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
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ c_pass: txt }) }}
                            maxLength={16}
                            minLength={6}
                            value={this.state.c_pass}
                            keyboardType='default'
                            secureTextEntry={this.state.HidePassword2}
                        />
                        <Image style={styles.login_email} source={require('./icons/lock1.png')}></Image>
                    </View>
                </ScrollView>

                <View style={styles.login_btn1} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this._btnChangePassword() }}>
                        <Text style={styles.log_txt_btn}>
                            {Lang_chg.txt_Submit[config.language]}
                        </Text>
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
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 30,
    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    earnig_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    login_input_pass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 50,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#b8b8b8',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular"
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '100%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 30,
    },
    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },
})