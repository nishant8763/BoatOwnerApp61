import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

export default class Notificatiions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading             : false,
            isConnected         : true,
            notification_arr    : 'NA',
            notification_count  : 0,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getNotification();
        });
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
    }

    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    _getNotification = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "notificationList.php?user_id_post=" + user_id_post;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Adverobj===', obj);
                    this.setState({ notification_arr: obj.notification_arr})
                } else {
                    this.setState({ datanotfond: Lang_chg.data_not_found[config.language] })
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




    backpress = () => {
        this.props.navigation.goBack();
    }

    _goToPage=(action,action_id)=>{
        if (action == "new_booking") {
            this.props.navigation.navigate('Boat_detail', { booking_id: action_id});
        }else if(action == "rate_now"){
            this.props.navigation.navigate('Boat_detail', { booking_id: action_id});
        }else if(action == "complete_mark"){
            this.props.navigation.navigate('Boat_detail', { booking_id: action_id});
        }
    }

    _deleteNoti=async(type,id)=>{
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "notificationDelete.php?user_id_post=" + user_id_post+"&notification_message_id="+id+"&delete_type="+type;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this._getNotification();
                } else {
                    this.setState({ datanotfond: Lang_chg.data_not_found[config.language] })
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
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>Notifications</Text>
                    <TouchableOpacity onPress={()=>{this._deleteNoti('all',0)}}><Text style={styles.cleat_btn}>{Lang_chg.txt_clear[config.language]}</Text></TouchableOpacity>
                </View>


                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.upcoming_main}>
                        {
                            (this.state.notification_arr!='NA')?
                            <FlatList
                            data={this.state.notification_arr}
                            horizontal={false}

                            showsHorizontalScrollIndicator={false}
                            inverted={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <TouchableOpacity activeOpacity={0.7} style={styles.notification} onPress={()=>{this._goToPage(item.action,item.action_id)}}>
                                            <TouchableOpacity style={styles.left_noti} activeOpacity={0.7} onPress={()=>{this._deleteNoti('single',item.notification_message_id)}}>
                                                <Image resizeMode="contain" style={styles.cross_noti} source={require('./icons/cross1.png')}></Image>
                                                <Text style={styles.time}>{item.createtime_ago}</Text>
                                            </TouchableOpacity>
                                            <View style={styles.middle_noti}>
                                                <Text style={styles.user_name}>{item.user_name}</Text>
                                                <Text style={styles.user_txt}>{item.message[config.language]}</Text>
                                            </View>
                                            <View style={styles.right_noti}>
                                                {
                                                    (item.user_image=='NA')? 
                                                    <Image resizeMode="contain" style={styles.user_img} source={require('./icons/error.png')}></Image>
                                                    :
                                                    <Image resizeMode="contain" style={styles.user_img} source={{ uri: config.img_url + item.user_image }}></Image>
                                                }
                                               
                                            </View>
                                        </TouchableOpacity>
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

    header_earnig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15, paddingTop: 15,
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
    cleat_btn: {
        color: "#d15400",
        fontSize: 16,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        marginTop: 5,
    },
    notification: {
        flexDirection: 'row',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        paddingBottom: 10,
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
    },
    user_img: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        alignItems: 'center',
        borderRadius: 100,
    },
    left_noti: {
        width: '20%',
    },
    middle_noti: {
        width: '60%',
    },
    right_noti: {
        width: '17%',
        alignItems: 'flex-end',
    },
    user_name: {
        textAlign: 'right',
        fontFamily: "Ubuntu-Bold",
        fontSize: 14,
        marginBottom: 3,
    },
    user_txt: {
        textAlign: 'right',
        fontSize: 12,
        color: '#9a9a9a',
        fontFamily: "Ubuntu-Regular",
    },
    cross_noti: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    time: {
        fontFamily: "Ubuntu-Regular",
        color: '#9a9a9a',
        fontSize: 12,
        marginTop: 15,
    }
})