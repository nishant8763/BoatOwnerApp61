import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
export default class Select_language extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            language: '',
            loading: false,
            isConnected: true,
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
                language: parseInt(result.language_id),
                user_id: result.user_id,
            })
        }else{
            this.setState({
                language: parseInt(result.language_id),
                user_id: 0,
            })
        }
    }
    _setLanguage = (language_type) => { this.setState({ language: language_type }); }
    _btnSubmitLanguage = () => {
        Keyboard.dismiss()
        if (this.state.isConnected === true) {
            let url = config.baseURL + "languageChange.php?user_type=1&user_id_post=" + this.state.user_id + "&language=" + this.state.language;
            var data = new FormData();
            data.append('user_id_post', this.state.user_id)
            data.append('language', this.state.language)
            this.setState({ loading: true })
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                if (obj.success == 'true') {
                    config.language = parseInt(obj.language);
                    localStorage.setItemString('language', obj.language.toString());
                    localStorage.setItemObject('user_arr', obj.user_details);
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
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.text_Change_Language[config.language]}</Text>
                    <Text></Text>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: '#cccccc80', paddingBottom: 15, paddingLeft: 20, paddingRight: 20 }}>
                    <TouchableOpacity onPress={() => { this._setLanguage(0) }} activeOpacity={0.9}>
                        <View style={{ flexDirection: 'row' }}>
                            
                            {
                                (this.state.language == 0) ?
                                    <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                    :
                                    <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                            }

                            <Text style={{ marginTop: 15, marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>English</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                    <TouchableOpacity onPress={() => { this._setLanguage(1) }} activeOpacity={0.9}>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                (this.state.language == 1) ?
                                    <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                    :
                                    <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                            }
                            <Text style={{ marginTop: 15, marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>Arbic</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={styles.login_btn1} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this._btnSubmitLanguage() }}>
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
        paddingLeft: 20,
        paddingRight: 20,
    },
    select_back: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    earnig_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '90%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 40,
        marginBottom: 30,
        position: 'absolute',
        bottom: 10,
    },
    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },

})