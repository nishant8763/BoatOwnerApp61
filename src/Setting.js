import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, Alert, ScrollView,Linking } from 'react-native'
import color1 from './Colors'
import Share from 'react-native-share'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';


export default class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            change_pass_show_status: 1,
            share_app_url: '',
            rate_app_url: '',
            notification: true,
            modalVisible: false,
            isConnected: true,
            loading: false,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    
    _appLogout = (navigation) => {
        Alert.alert(Lang_chg.Confirm[config.language], Lang_chg.msgConfirmTextLogoutMsg[config.language], [
            {
                text: Lang_chg.cancel[config.language],
                onPress: () => { console.log('nothing') },
                style: "cancel"
            },
            { text: Lang_chg.Yes[config.language], onPress: () => { config.AppLogout(navigation) } }
        ], { cancelable: false });
        // config.checkUserDeactivate(navigation);
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
        });
        
    }
    shereappbtn = () => {
        console.log(this.state.share_app_url)
        let shareOptions = {
            title: 'CUPIDO',
            subject: Lang_chg.headdingshare[config.language],
            // message: Lang_chg.sharelinktitle[config.language] + "\n" + this.state.share_app_url,
            message: Lang_chg.sharelinktitle[config.language],
            url: this.state.share_app_url,
            failOnCancel: false,
        };
        Share.open(shareOptions)
        // })
        // .catch(err => {console.log(err)});
    }
    Termsconditiondata = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            var url = config.baseURL + 'get_all_content.php?user_id=0&user_type=2';
            console.log('url', url)
            fetch(url, {
                method: 'GET',
                headers: new Headers(config.headersapi),

            }).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                console.log(obj)
                if (obj.success == 'true') {
                    let share_app_url = obj.content_arr[5].content[config.language];
                    // console.log('content_arr==',obj.content_arr);
                    let rate_url = '';
                    if (config.device_type == 'ios') {
                        rate_url = obj.content_arr[3].content[config.language];
                    }
                    if (config.device_type == 'android') {
                        rate_url = obj.content_arr[4].content[config.language];
                    }

                    this.setState({ loading: false, share_app_url: share_app_url, rate_app_url: rate_url });

                }
                else {
                    this.setState({ loading: false, });
                    msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header_earnig}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                            <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.earnig_title}>{Lang_chg.settings_txt[config.language]}</Text>
                        <Text></Text>
                    </View>

                    <View style={styles.sett_list}>
                        <Text style={{ color: '#929191', fontSize: 16, fontFamily: "Ubuntu-Medium", }}>{Lang_chg.text_account[config.language]}</Text>
                    </View>
                    <View style={styles.setting_push}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Notification_setings') }}>
                            <Text style={styles.setting_push_txt}>{Lang_chg.text_Notification_Setting[config.language]}</Text>
                        </TouchableOpacity>
                        <View>
                            {/* <Switch style={styles.push_onof} trackColor={{ false: '#a4a2a1', true: '#d15400' }}
    thumbColor={ "#fff"} ios_backgroundColor="#d15400" onValueChange={(txt)=>{this.setState({notification:txt})}} value={this.state.notification} /> */}
                            <Image resizeMode="contain" style={{ width: 15, height: 15, marginTop: 2, }} source={require('./icons/arrow.png')}></Image>
                        </View>
                    </View>
                    <View style={styles.edit_list}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Edit_profile') }}>
                            <Text style={styles.edit_text}>{Lang_chg.Edit_Profile_txt[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Change_pass') }}>
                            <Text style={styles.edit_text}>{Lang_chg.change_language_txt[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Select_language') }}>
                            <Text style={styles.edit_text}>{Lang_chg.text_Change_Language[config.language]}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sett_list}>
                        <Text style={styles.setting_acount} style={{ marginTop: 15, color: '#929191', fontSize: 16, fontFamily: "Ubuntu-Medium", }}>{Lang_chg.text_support[config.language]}</Text>
                    </View>
                    <View>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Terms', { 'contantpage': 2 }) }}>
                            <Text style={styles.edit_text}>{Lang_chg.text_Terms_And_Conditions[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Terms', { 'contantpage': 1 }) }}>
                            <Text style={styles.edit_text}>{Lang_chg.html_Privacy_Policy[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Terms', { 'contantpage': 0 }) }}>
                            <Text style={styles.edit_text}>{Lang_chg.text_About_Us[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Contact') }}>
                            <Text style={styles.edit_text}>{Lang_chg.contact_us_txt[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={()=>{this.shereappbtn()}}                        
                        >
                            <Text style={styles.edit_text}>{Lang_chg.text_share_app[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                Linking.openURL(this.state.rate_app_url).catch(err =>
                                    alert('Please check for the Google Play Store')
                                );
                            }}
                        >
                            <Text style={styles.edit_text}>{Lang_chg.text_rate_app[config.language]}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity activeOpacity={0.9}>
                   <Text style={styles.edit_text}>History</Text>
                   </TouchableOpacity> */}
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this._appLogout(this.props.navigation) }}>
                            <Text style={styles.setting_logout}>{Lang_chg.logout_txt[config.language]}</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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

    setting_push: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setting_push_txt: {
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
    },
    sett_list: {
        marginBottom: 0,
        borderBottomWidth: 0.5,
        paddingBottom: 20,
        borderColor: '#ccc',
        marginTop: 10,
    },
    edit_text: {
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
        marginTop: 20,
    },
    setting_logout: {
        color: 'red',
        marginTop: 15,
        fontSize: 16,
    },


})