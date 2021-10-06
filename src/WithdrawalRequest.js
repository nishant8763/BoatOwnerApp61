import React, { Component } from 'react'
import { TextInput } from 'react-native';
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image,Keyboard } from 'react-native'
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

export default class WithdrawalRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected     : true,
            datanotfond     : '',
            loading         : false,
            bank_arr        : "NA",
            amount          : '',
            comment         : '',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.setState({bank_arr : this.props.route.params.bank_arr});
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

    _submitWithdrawalRequest=async()=>{
        Keyboard.dismiss()
        let result = await localStorage.getItemObject('user_arr')
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        let {amount,comment,bank_arr} =  this.state;
        //amount============
        if (amount.length <= 0) {
            msgProvider.toast(Lang_chg.emptyAmount[config.language], 'center')
            return false
        }
        
        var digit = /^\d*\.?\d*$/;
        if (digit.test(amount) !== true) {
            msgProvider.toast(Lang_chg.vailidAmount[config.language], 'center')
            return false
        }
        //comment===============
        if (comment.length <= 0) {
            msgProvider.toast(Lang_chg.emptyDes[config.language], 'center')
            return false
        }
        if (comment.length <= 2) {
            msgProvider.toast(Lang_chg.minlenDes[config.language], 'center')
            return false
        }
        if (comment.length > 250) {
            msgProvider.toast(Lang_chg.maxlenDes[config.language], 'center')
            return false
        }

    
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('ifsc_no', bank_arr.ifsc_no)
            data.append('account_no', bank_arr.account_no)
            data.append('acc_holder_name', bank_arr.holder_name)
            data.append('amount', amount)
            data.append('comment', comment)
            let url = config.baseURL + "withdraw_request.php";
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('bank _arr==', obj)
                    msgProvider.toast(obj.msg[config.language], 'center')
                    this.props.navigation.navigate('Widro')
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
    _btnDeleteBank=async()=>{
        Keyboard.dismiss()
        let result = await localStorage.getItemObject('user_arr')
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        let {bank_arr} =  this.state;
        //amount============
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('bank_id_post', bank_arr.bank_id)
            let url = config.baseURL + "bank_delete.php";
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('bank _arr==', obj)
                    msgProvider.toast(obj.msg[config.language], 'center')
                    this.props.navigation.navigate('Widro')
                    return false
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
        let bank_arr = this.state.bank_arr;
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                    <Loader loading={this.state.loading} />
                <View style={styles.manage_boat_header}>
                    <TouchableOpacity onPress={() => { this.backpress() }} activeOpacity={0.9}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.select_boat_title}>{Lang_chg.txt_widro_req[config.language]}</Text>
                    <Text></Text>
                </View>
                <View style={styles.add_bank_main_widrowmlist}>
                    <View style={styles.Add_bank_banner}>
                        <View style={styles.Add_bank_banner_left}>
                            <Text style={styles.Add_bank_name_usr}>{bank_arr.holder_name}</Text>
                            <Text style={styles.add_bank_accountno}>{Lang_chg.txt_widro_Ac_no[config.language]} {bank_arr.account_no}</Text>
                            <Text style={styles.add_bank_accountno}>{Lang_chg.txt_widro_ifsc_code[config.language]} : {bank_arr.ifsc_no}</Text>
                        </View>
                        <View style={styles.Add_bank_banner_right}>
                            <View style={styles.main_box_add}>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Edit_bank',{
                                    bank_arr:this.state.bank_arr,
                                })}}>
                                    <Image resizeMode="contain" style={styles.add_edit_bank} source={require('./icons/add_bank.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.9} onPress={()=>{this._btnDeleteBank()}}>
                                    <Image resizeMode="contain" style={styles.add_edit_bank} source={require('./icons/coin_close.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.Add_bank_withdraw_input}>
                    <TextInput style={styles.add_ammount} 
                        placeholder="Amount"
                        placeholderTextColor="#000"
                        autoCapitalize = 'none'
                        returnKeyLabel = 'done'
                        returnKeyType  = 'done'
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                        onChangeText={(txt) => { this.setState({ amount: txt }) }}
                        maxLength={8}
                        minLength={3}
                        value={this.state.amount}
                        keyboardType='decimal-pad'
                    />
                    <TextInput style={styles.add_ammount_textarea} 
                        placeholder="Comment"
                        placeholderTextColor="#000"
                        autoCapitalize = 'none'
                        returnKeyLabel = 'done'
                        returnKeyType  = 'done'
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                        onChangeText={(txt) => { this.setState({ comment: txt }) }}
                        maxLength={250}
                        minLength={3}
                        value={this.state.comment}
                        keyboardType='default'
                    />
                </View>

                <View style={styles.login_btn1}>
                    <TouchableOpacity onPress={() => { this._submitWithdrawalRequest() }} activeOpacity={0.7}>
                        <Text style={styles.log_txt_btn}>
                        {Lang_chg.txt_Forgot_Pass3[config.language]}
                    </Text>
                    </TouchableOpacity>
                </View>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    manage_boat_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    select_boat_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    Add_bank_banner: {
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: '#d6681e',
        width: '90%',
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
    },
    main_box_add: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    Add_bank_name_usr: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Ubuntu-Bold',
        color: 'white',
    },
    add_edit_bank: {
        width: 27,
        height: 27,
        resizeMode: 'contain',
    },
    Add_bank_banner_left: {
        width: '75%',
    },
    Add_bank_banner_right: {
        width: '25%',
    },
    add_bank_accountno: {
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: "Ubuntu-Regular",
        color: 'white',
    },
    add_bank_main_widrowmlist: {
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    add_ammount: {
        borderBottomWidth: 2,
        borderColor: '#d6681e',
        color: 'red',
        fontSize: 16,
    },
    add_ammount_textarea: {
        borderBottomWidth: 2,
        borderColor: '#d6681e',
        color: 'red',
        fontSize: 16,
        height: 100,
    },
    Add_bank_withdraw_input: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 30,
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '90%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 60,
    },
    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },

})