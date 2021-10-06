import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, TextInput, Keyboard } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { ScrollView } from 'react-native-gesture-handler';
export default class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            email: '',
            loading: false,
            isConnected: true,
            user_id: '',
            message: '',
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

        this._setUserProfile();
    }
    _setUserProfile = async () => {
        let result = await localStorage.getItemObject('user_arr');
        console.log('result', result);
        if (result != null) {
            this.setState({
                user_name: result.name,
                email: result.email,
                user_id: result.user_id,
            })
        }
    }
    _btnSubmitContact = () => {

        Keyboard.dismiss()
        let { user_name, email, user_id, message } = this.state;
        //name===================
        if (user_name.length <= 0) {
            msgProvider.toast(Lang_chg.EmptyName[config.language], 'center')
            return false
        }
        if (user_name.length <= 2) {
            msgProvider.toast(Lang_chg.NameMinLength[config.language], 'center')
            return false
        }
        if (user_name.length > 50) {
            msgProvider.toast(Lang_chg.NameMaxLength[config.language], 'center')
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

        //message==================
        if (message.length <= 0) {
            msgProvider.toast(Lang_chg.emptyMessage[config.language], 'center')
            return false
        }
        if (message.length < 3) {
            msgProvider.toast(Lang_chg.minlenMessage[config.language], 'center')
            return false
        }
        if (message.length > 250) {
            msgProvider.toast(Lang_chg.maxlenMessage[config.language], 'center')
            return false
        }
        if (this.state.isConnected === true) {
            let url = config.baseURL + "contact_us.php";
            console.log(url);
            var data = new FormData();
            data.append('contact_us_name', user_name)
            data.append('contact_email', email)
            data.append('contact_message', message)
            data.append('user_id_post', user_id)
            data.append('user_type', 2)
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[config.language], 'center');
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
            <View  style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.contact_us_txt[config.language]}</Text>
                    <Text></Text>
                </View>

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={{ marginTop: 20 }}>
                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                placeholder={Lang_chg.loginName[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ user_name: txt }) }}
                                maxLength={16}
                                minLength={6}
                                value={this.state.user_name}
                                keyboardType='default'
                            />
                            <Image style={styles.login_email} source={require('./icons/user2.png')}></Image>
                        </View>

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
                                editable={true}
                                value={this.state.email}
                                keyboardType='email-address'
                            />
                            <Image style={styles.login_email} source={require('./icons/email1.png')}></Image>
                        </View>
                        <View style={styles.login_input1}>
                            <TextInput
                                style={[styles.txtinput, { height: 120, textAlignVertical: 'top', textAlign: 'right' }]}
                                onChangeText={this.handleTextChange}
                                multiline={true}
                                placeholder={Lang_chg.txt_message[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ message: txt }) }}
                                maxLength={250}
                                minLength={3}
                                value={this.state.message}
                                keyboardType='default'
                            />
                            <Image style={styles.login_email1} source={require('./icons/pen.png')}></Image>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.login_btn1}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this._btnSubmitContact() }}>
                        <Text style={styles.log_txt_btn}>
                            {Lang_chg.Send_txt[config.language]}
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
    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    earnig_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    login_input1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        textAlign: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
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
        paddingRight: 10,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
        width: '100%',
    },
    enter_emaol_login_msg: {
        // textAlign:'right',
        // paddingRight:10,
        // paddingLeft:20,
        // fontSize:16,
        // fontFamily:"Ubuntu-Regular",
        // width:'100%',
        // height:100,
        // paddingTop:0,
        // marginTop:0,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    login_email1: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 5,
    },

    login_btn1: {
        backgroundColor: '#d15400',
        width: '90%',
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

    txtinput: {
        marginLeft: 15, fontSize: 16, paddingVertical: 10,
    },
})