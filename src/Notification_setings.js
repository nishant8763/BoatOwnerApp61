import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, Switch,Keyboard} from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

export default class Notification_setings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notification  : false,
            notification1 : false,
            notification2 : false,
            loading       : false,
            isConnected   : true,
            user_id       : 0,
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
                user_id: result.user_id,
            })

            if (result.promotion_notification == 1) {
                this.setState({ notification: true })
            } else {
                this.setState({ notification: false })
            }

            if (result.chat_notification == 1) {
                this.setState({ notification1: true })
            } else {
                this.setState({ notification1: false })
            }

            if (result.on_going_notification == 1) {
                this.setState({ notification2: true })
            } else {
                this.setState({ notification2: false })
            }
        }
    }
    _btnUpdateNotification = (type) => {
        Keyboard.dismiss()
        let notification = 'NA';
        if (type == 'promotion') {
            if (this.state.notification == true) {
                notification = 0
            } else {
                notification = 1
            }
        }

        if (type == 'chat') {
            if (this.state.notification1 == true) {
                notification = 0
            } else {
                notification = 1
            }
        }

        if (type == 'ongo') {
            if (this.state.notification2 == true) {
                notification = 0
            } else {
                notification = 1
            }
        }

        if (this.state.isConnected === true) {
            let url = config.baseURL + "notification_on_off.php";
            var data = new FormData();
            data.append('notification_status', notification)
            data.append('notification_type', type)
            data.append('user_id_post', this.state.user_id)
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('notification change', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {

                    if (type == 'promotion') {
                        if (notification == 1) {
                            this.setState({ notification: true })
                        } else {
                            this.setState({ notification: false })
                        }
                    }

                    if (type == 'chat') {
                        if (notification == 1) {
                            this.setState({ notification1: true })
                        } else {
                            this.setState({ notification1: false })
                        }
                    }

                    if (type == 'ongo') {
                        if (notification == 1) {
                            this.setState({ notification2: true })
                        } else {
                            this.setState({ notification2: false })
                        }
                    }
                    localStorage.setItemObject('user_arr', obj.user_details);

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
                    <Text style={styles.earnig_title}>{Lang_chg.txt_Notification_Settings[config.language]}</Text>
                    <Text></Text>
                </View>
                <View style={styles.notification_settings}>
                    <View>
                        <Text style={styles.notification_txt}>{Lang_chg.txt_Promotion_notification[config.language]}
                        </Text>
                    </View>
                    <View>
                        <Switch
                            style={styles.push_onof}
                            trackColor={{ false: '#a4a2a1', true: '#d15400' }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#d15400"
                            onValueChange={(txt) => { this._btnUpdateNotification('promotion') }}
                            value={this.state.notification}
                        />
                    </View>
                </View>
                <View style={styles.notification_settings}>
                    <View>
                        <Text style={styles.notification_txt}>{Lang_chg.txt_Chat_Notifications[config.language]}
                        </Text>
                    </View>
                    <View>
                        <Switch
                            style={styles.push_onof}
                            trackColor={{ false: '#a4a2a1', true: '#d15400' }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#d15400"
                            onValueChange={(txt) => { this._btnUpdateNotification('chat') }}
                            value={this.state.notification1}
                        />
                    </View>
                </View>
                <View style={styles.notification_settings}>
                    <View>
                        <Text style={styles.notification_txt}>{Lang_chg.txt_ongo_Notifications[config.language]}
                        </Text>
                    </View>
                    <View>
                        <Switch
                            style={styles.push_onof}
                            trackColor={{ false: '#a4a2a1', true: '#d15400' }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#d15400"
                            onValueChange={(txt) => { this._btnUpdateNotification('ongo') }}
                            value={this.state.notification2}
                        />
                    </View>
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

    notification_settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    notification_txt: {
        fontSize: 16,
    },
})