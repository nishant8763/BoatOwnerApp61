import React, { Component } from 'react'
import { Text, View, Image, SafeAreaView, StatusBar, StyleSheet, FlatList, ScrollView, Keyboard } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

const demodat = [1, 2, 3, 4, 5, 6, 7, 8, 9,];
export default class Widro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data1: demodat,
            isConnected: true,
            datanotfond: '',
            loading: false,
            bank_arr: 'NA',
            withhdraw_arr: 'NA',
            pending_amount: '0',
            total_earning: '0',
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

    _getWalletHistory = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "withdraw_history.php?user_id_post=" + user_id_post;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('withdrawal', obj);
                    this.setState({ 
                        withhdraw_arr   :   obj.withhdraw_arr, 
                        bank_arr        :   obj.bank_arr,
                        total_earning   :   obj.total_earning, 
                        pending_amount  :   obj.pending_amount, 
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

    _goOtherPage = () => {
        if (this.state.bank_arr == "NA") {
            this.props.navigation.navigate('Add_bank');
        } else {
            this.props.navigation.navigate('WithdrawalRequest', {
                bank_arr: this.state.bank_arr,
            });
        }
    }




    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.widro_header}>
                    <TouchableOpacity onPress={() => { this.backpress() }} activeOpacity={0.9}>
                        <Image resizeMode="contain" style={styles.widro_plus_back} source={require('./icons/left_arrow_ahite.png')}></Image>
                    </TouchableOpacity>
                    <Text></Text>
                    {/* <TouchableOpacity activeOpacity={0.9}>
                   <Image resizeMode="contain" style={styles.widro_plus_img} source={require('./icons/widro_plus.png')} />
                    </TouchableOpacity>  */}
                    <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.props.navigation.navigate('Add_bank')}}>
                        <Image resizeMode="contain" style={styles.widro_plus_img} source={require('./icons/widro_plus.png')} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.widro_banner}>
                        <Text style={styles.widro_title_banner}>
                        {Lang_chg.pro_statement[config.language]}
                        </Text>
                        <View style={styles.widro_pending}>
                            <View>
                                <Text style={styles.widro_kwd}>{Lang_chg.txt_KWD[config.language]}  {this.state.total_earning}</Text>
                                <Text style={styles.widro_kwd_price}> {Lang_chg.txt_totol_amt[config.language]}</Text>
                            </View>
                            <View>
                                <Text style={styles.widro_kwd_total}>{Lang_chg.txt_KWD[config.language]}  {this.state.pending_amount}</Text>
                                <Text style={styles.widro_kwd_price_total}> {Lang_chg.txt_pending_amt[config.language]}</Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.wiedro_list}>
                        {
                            (this.state.withhdraw_arr != 'NA')
                                ?
                                <FlatList
                                    data={this.state.withhdraw_arr}
                                    horizontal={false}

                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (

                                            <View style={styles.widro_main_box}>
                                                <View style={styles.widro_detail}>
                                                    <View style={styles.widro_left}>
                                                        <Text style={styles.widro_id}>#{item.booking_no}</Text>
                                                        <Text style={styles.widro_acnomber}>txn id : {item.txn_id}</Text>
                                                        <Text style={styles.widro_acnomber}>{item.updatetime}</Text>
                                                    </View>
                                                    <View style={styles.widro_right}>
                                                        <Text style={styles.widro_pending_price}>{Lang_chg.txt_KWD[config.language]} {item.amount}</Text>
                                                        <Text style={styles.widro_pending_price_complete}>{Lang_chg.txt_complete[config.language]}</Text>
                                                    </View>
                                                </View>
                                                
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                                :
                                <View style={[styles.upcoming_main,{alignItems:'center',justifyContent:'center',height:300}]}>
                                <Image source={require('./icons/ic_notfound.png')} style={{height:'50%',width:'50%',resizeMode:'contain',tintColor:'#d15400'}}/>
                            </View>
                        }

                    </View>
                </ScrollView>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    widro_header: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#d15400',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
    },
    widro_plus_back: {
        width: 35,
        height: 20,
        resizeMode: 'contain',
        marginTop: 3,
    },
    widro_plus_img: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    widro_banner: {
        backgroundColor: '#d15400',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingTop: 50,
    },
    widro_title_banner: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: "Ubuntu-Bold",
        color: '#fff',
    },

    widro_detail: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 20,
        paddingRight: 20,
    },
    widro_left: {
        width: '78%',
    },
    widro_right: {
        width: '22%',
    },
    widro_id: {
        fontWeight: 'bold',
        fontFamily: 'Ubuntu-Bold',
        fontSize: 17,
    },
    widro_date: {
        color: '#908d8d',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
    },
    widro_name: {
        fontWeight: 'bold',
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
    },
    widro_acnomber: {
        color: '#908d8d',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
    },
    widro_pending_price: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    widro_pending_price_progress: {
        fontFamily: "Ubuntu-bold",
        fontWeight: 'bold',
        fontSize: 15,
        alignItems: 'center',
        alignSelf: 'center',
        color: '#f0e30f',
    },
    widro_pending_price_cancel: {
        fontFamily: "Ubuntu-bold",
        fontWeight: 'bold',
        fontSize: 15,
        alignItems: 'center',
        alignSelf: 'center',
        color: 'red',
    },
    widro_pending_price_complete: {
        fontFamily: "Ubuntu-bold",
        fontWeight: 'bold',
        fontSize: 15,
        alignItems: 'center',
        alignSelf: 'center',
        color: '#59f00f',
    },
    widro_pending: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 60,
    },
    widro_kwd: {
        fontFamily: "Ubuntu-bold",
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    widro_kwd_price: {
        fontFamily: "Ubuntu-Regular",
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    widro_kwd_total: {
        fontFamily: "Ubuntu-bold",
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    widro_kwd_price_total: {
        fontFamily: "Ubuntu-Regular",
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
})