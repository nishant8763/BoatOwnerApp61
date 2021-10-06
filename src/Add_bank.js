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
export default class Add_bank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected     : true,
            datanotfond     : '',
            loading         : false,
            bank_arr        : 'NA',
            account_no      : '',
            ifsc_no         : '',
            holder_name     : '',
            bank_name       : '',
            status          : 0,
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
        this._getBankData();
    }
   
    _getBankData=async()=>{
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "bank_details.php?user_id_post=" + user_id_post;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    let bank_arr      =   obj.bank_arr;
                    if(bank_arr!='NA'){
                        let bank_name    = bank_arr.bank_name;
                        let holder_name  = bank_arr.holder_name;
                        let account_no   = bank_arr.account_no;
                        let ifsc_no      = bank_arr.ifsc_no;
                        let status       = bank_arr.status;
                        let bank_id      = bank_arr.bank_id;
                        this.setState({ 
                            bank_name   :   bank_name,
                            holder_name :   holder_name,
                            account_no  :   account_no,
                            ifsc_no     :   ifsc_no,
                            status      :   status,
                            bank_id     :   bank_id,
                            bank_arr    :   bank_arr,
                        });
                    }
                    
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

    _btnSubmitBank = async() =>{

        if(this.state.status==1 && this.state.bank_arr!='NA'){
            alert('You can not add or edit because bank approved by admin');
        }
        
        Keyboard.dismiss()
        let result = await localStorage.getItemObject('user_arr')
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        let {holder_name,ifsc_no,account_no,bank_name,bank_id} =  this.state;
        


        if (bank_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBank_name[config.language], 'center')
            return false
        }
        if (bank_name.length <= 2) {
            msgProvider.toast(Lang_chg.BanknameMinLength[config.language], 'center')
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
       

        

        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('holder_name', holder_name)
            data.append('ifsc_no', ifsc_no)
            data.append('account_no', account_no)
            data.append('bank_name', bank_name)
            data.append('bank_id_post', bank_id)
            let url = config.baseURL + "bank_add.php";
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('bank _arr==', obj)
                    // msgProvider.toast(obj.msg[config.language], 'center')
                    this.props.navigation.goBack();
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
                    <Text style={styles.earnig_title}>{Lang_chg.txt_add_bank[config.language]}</Text>
                    <Text></Text>
                </View>

                <View style={styles.add_bank_input}>
                <View style={styles.add_main_input_}>
                        <TextInput 
                            placeholder={Lang_chg.txt_bank_name[config.language]}
                            placeholderTextColor="#000"
                            autoCapitalize = 'none'
                            returnKeyLabel = 'done'
                            returnKeyType  = 'done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ bank_name: txt }) }}
                            maxLength={50}
                            minLength={3}
                            value={this.state.bank_name}
                            keyboardType='default'
                            style={{paddingBottom:0,textAlign:"right"}}
                        ></TextInput>
                    </View>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                            placeholder={Lang_chg.txt_acc_title_name[config.language]}
                            placeholderTextColor="#000"
                            autoCapitalize = 'none'
                            returnKeyLabel = 'done'
                            returnKeyType  = 'done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ holder_name: txt }) }}
                            maxLength={50}
                            minLength={3}
                            value={this.state.holder_name}
                            keyboardType='default'
                            style={{paddingBottom:0,textAlign:"right"}}
                        ></TextInput>
                    </View>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                            placeholder='IBAN'
                            placeholderTextColor="#000"
                            autoCapitalize = 'none'
                            returnKeyLabel = 'done'
                            returnKeyType  = 'done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ account_no: txt }) }}
                            maxLength={20}
                            minLength={3}
                            value={this.state.account_no}
                            keyboardType='default'
                            style={{paddingBottom:0,textAlign:"right"}}
                        />
                    </View>
                    <View style={styles.add_main_input_}>
                        <TextInput 
                            placeholder={Lang_chg.txt_acc_swift_code[config.language]}
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
                            style={{textAlign:"right"}}
                            />
                    </View>
                </View>

                    <View>
                     {
                        (this.state.status==1 && this.state.bank_arr!='NA') ?
                        <Text style={{
                    marginTop:20,
                            textAlign:'left',
                            fontFamily: "Ubuntu-Bold",
                            fontSize: 17,
                            color: 'black'
                        }}>{Lang_chg.txt_term[config.language]}</Text>
                        :
                        <TouchableOpacity 
                        // onPress={() => {  }} activeOpacity={0.7}>
                        onPress={() => { this._btnSubmitBank()}}
                         activeOpacity={0.7} style={styles.login_btn1}>
                                {
                                    (this.state.status==0 && this.state.bank_arr!='NA')
                                    && <Text  style={styles.log_txt_btn}>{Lang_chg.edit_bank[config.language]}</Text>
                                }
                               
                                {
                                    (this.state.status==0 && this.state.bank_arr=='NA')
                                    && <Text  style={styles.log_txt_btn}>{Lang_chg.txt_add_bank[config.language]}</Text>
                                }
                        </TouchableOpacity>
                    }
                                   
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