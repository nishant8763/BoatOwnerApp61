import React, { Component } from 'react'
import { Text, View, StatusBar, SafeAreaView, TouchableOpacity, Image, StyleSheet, TextInput,Keyboard } from 'react-native'
import color1 from './Colors'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
export default class Edit_bank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected     : true,
            datanotfond     : '',
            loading         : false,
            bank_arr        : this.props.route.params.bank_arr,
            account_no      : '',
            ifsc_no         : '',
            holder_name     : '',
            bank_id         : 0,
        }
    }
    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        this.setState({
            account_no      : this.state.bank_arr.account_no,
            ifsc_no         : this.state.bank_arr.ifsc_no,
            holder_name     : this.state.bank_arr.holder_name,
            bank_id         : this.state.bank_arr.bank_id,
        })
    }
   
    _btnSubmitBank = async() =>{
        Keyboard.dismiss()
        let result = await localStorage.getItemObject('user_arr')
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        let {holder_name,ifsc_no,account_no,bank_id} =  this.state;
        //firs name===================
        if (holder_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyholder_name[config.language], 'center')
            return false
        }
        if (holder_name.length <= 2) {
            msgProvider.toast(Lang_chg.holder_nameMinLength[config.language], 'center')
            return false
        }
        if (holder_name.length > 50) {
            msgProvider.toast(Lang_chg.holder_nameMaxLength[config.language], 'center')
            return false
        }
        var letters = /^[a-zA-Z- ]+$/;
        if (letters.test(holder_name) !== true) {
            msgProvider.toast(Lang_chg.validholder_name[config.language], 'center')
            return false
        }

        //account no=============================
        
        if (account_no.length <= 0) {
            msgProvider.toast(Lang_chg.emptyAccNo[config.language], 'center')
            return false
        }
        if (account_no.length <= 2) {
            msgProvider.toast(Lang_chg.AccNoMinLength[config.language], 'center')
            return false
        }
        if (account_no.length > 20) {
            msgProvider.toast(Lang_chg.AccNoMaxLength[config.language], 'center')
            return false
        }
        var digit = /^\d*\.?\d*$/;
        if (digit.test(account_no) !== true) {
            msgProvider.toast(Lang_chg.AccNoVailidLength[config.language], 'center')
            return false
        }

        //ifsc=============================
        if (ifsc_no.length <= 0) {
            msgProvider.toast(Lang_chg.emptyifscNo[config.language], 'center')
            return false
        }
        if (ifsc_no.length <= 2) {
            msgProvider.toast(Lang_chg.ifscNoMinLength[config.language], 'center')
            return false
        }
        if (ifsc_no.length > 20) {
            msgProvider.toast(Lang_chg.ifscNoMaxLength[config.language], 'center')
            return false
        }

        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('holder_name', holder_name)
            data.append('ifsc_no', ifsc_no)
            data.append('account_no', account_no)
            data.append('bank_id_post', bank_id)
            let url = config.baseURL + "bank_edit.php";
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('bank _arr==', obj)
                    msgProvider.toast(obj.msg[config.language], 'center')
                    this.props.navigation.navigate('WithdrawalRequest',{
                        bank_arr    :   obj.bank_arr,
                    })
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


    backpress = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20 }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.edit_bank[config.language]}</Text>
                    <Text></Text>
                </View>

                <View style={styles.add_bank_input}>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                            placeholder={Lang_chg.txt_bank_holder[config.language]}
                            placeholderTextColor="#000"
                            autoCapitalize = 'none'
                            returnKeyLabel = 'done'
                            returnKeyType  = 'done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ holder_name: txt }) }}
                            maxLength={20}
                            minLength={3}
                            value={this.state.holder_name}
                            keyboardType='default'
                        ></TextInput>
                    </View>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                             placeholder={Lang_chg.txt_acc_no[config.language]}
                            placeholderTextColor="#000"
                            autoCapitalize = 'none'
                            returnKeyLabel = 'done'
                            returnKeyType  = 'done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ account_no: txt }) }}
                            maxLength={20}
                            minLength={3}
                            value={this.state.account_no}
                            keyboardType='decimal-pad'
                        />
                    </View>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                           placeholder={Lang_chg.txt_ifsc_code[config.language]}
                            placeholderTextColor="#000"
                            autoCapitalize='none'
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ ifsc_no: txt }) }}
                            maxLength={20}
                            minLength={3}
                            value={this.state.ifsc_no}
                            keyboardType='default'
                            />
                    </View>
                </View>

                <View style={styles.login_btn1}>
                    <TouchableOpacity 
                    // onPress={() => {  }} activeOpacity={0.7}>
                    onPress={() => { this._btnSubmitBank()}}
                     activeOpacity={0.7}>
                        <Text style={styles.log_txt_btn}>
                        {Lang_chg.Save[config.language]}
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
    add_main_input_: {
        borderBottomWidth: 1.5,
        borderColor: '#d6681e',
        color: 'red',
        height: 50,
        paddingBottom:10,
        justifyContent:'flex-end'
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '100%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 50,
    },
    log_txt_btn: {
        lineHeight: 60,
        textAlign: 'center',
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        color: 'white'
    },
    add_bank_input: {
        marginTop: 0,
    }
})