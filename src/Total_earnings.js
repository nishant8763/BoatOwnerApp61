import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Image, FlatList, ScrollView } from 'react-native'
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';


const demodat = [1];
export default class Total_earnings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data1: demodat,
            isConnected: true,
            loading: false,
            history_arr: 'NA',
            pending_amount: '0',
            total_earning: '0',
        }
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
            this._getWalletHistory();
        });
    }
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    backpress = () => {
        this.props.navigation.goBack();
    }

    _getWalletHistory = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "wallet_history_owner.php?user_id_post=" + user_id_post;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('history_arr', obj);
                    this.setState({
                        history_arr: obj.history_arr,
                        pending_amount: obj.pending_amount,
                        total_earning: obj.total_earning,
                    });
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
                this.setState({ loading: false, datanotfond: Lang_chg.data_not_found[config.language] });
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.pro_earning_txt[config.language]}</Text>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.7}>
                        <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/search_home.png')}></Image>
                    </TouchableOpacity>
                </View>

                <View style={styles.my_wallet_page}>
                    <View>
                        <View style={styles.my_wallet_left}>
                            <Text style={styles.wallet_total}>{Lang_chg.txt_KWD[config.language]}  {this.state.total_earning}</Text>
                        </View>
                        <Text style={styles.wallet_pending}>{Lang_chg.txt_totol_amt[config.language]}</Text>
                    </View>
                    <View>
                        <View style={styles.my_wallet_left}>
                            <Text style={styles.wallet_total}>{Lang_chg.txt_KWD[config.language]}  {this.state.pending_amount}</Text>
                        </View>
                        <Text style={styles.wallet_pending}>{Lang_chg.txt_pending_amt[config.language]}</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.other_gift_photo}>
                        {
                            (this.state.history_arr != 'NA')
                                ?
                                <FlatList
                                    data={this.state.history_arr}
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (

                                            <View style={styles.total_earnig_list}>
                                                <View style={styles.earniug_main_box}>
                                                    <View style={styles.earnig_left}>
                                                        <Text style={styles.earnug_price}>{Lang_chg.txt_KWD[config.language]}  {item.amount}</Text>
                                                    </View>
                                                    <View style={styles.earnig_right}>
                                                        <Text style={styles.earnig_id}>#{item.booking_no}</Text>
                                                        <Text style={styles.earn_day}>{item.updatetime}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                                :
                                <View style={[styles.upcoming_main, { alignItems: 'center', justifyContent: 'center', height: 300 }]}>
                                    <Image source={require('./icons/ic_notfound.png')} style={{ height: '50%', width: '50%', resizeMode: 'contain', tintColor: '#d15400' }} />
                                </View>
                        }

                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    earnig_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    home_notificatio_btn: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 2,
    },
    header_earnig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    earniug_main_box: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.5,
        borderColor: '#a8a5a5',
        paddingTop: 15,
        paddingBottom: 15,
    },
    earnig_left: {
        width: '40%',
    },
    earnig_right: {
        width: '60%',
    },
    earnig_id: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: "Ubuntu-Bold",
        textAlign: 'right',
    },
    earn_day: {
        fontSize: 12,
        textAlign: 'right',
    },
    earnug_time: {
        fontSize: 12,

    },
    earnug_price: {
        fontSize: 14,
        fontFamily: "Ubuntu-Regular",
    },
    my_wallet_page: {
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 40,
        textAlign: 'center',
        alignItems: 'center',
    },
    wallet_total: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#d15400',
        textAlign: 'center',
        alignSelf: 'center',
        lineHeight: 80,
    },
    my_wallet_left: {
        width: 90,
        height: 90,
        borderWidth: 1,
        borderColor: '#d6681e',
        borderRadius: 50,
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    wallet_pending: {
        color: '#686868',
        fontSize: 16,
        fontFamily: 'Ubuntu-Regular',
        marginTop: 15,
        textAlign: 'center',
    },
})