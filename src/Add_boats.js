import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput,Keyboard } from 'react-native'

import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import validation from './Provider/Validation_provider'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { cond } from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Add_boats extends Component {
    state = {
        boat_name           :    '',
        boat_number         :    '',
        registration_no     :    '',
        boat_year           :    '',
        boat_length         :    '',
        boat_capacity       :    '',
        cabins              :    '',
        toilets             :    '',
        isConnected         :   true,
        loading             :   false,
        back_page_name      :   this.props.route.params.back_page_name,
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    
    componentDidMount(){
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.setBoatCount();
        });
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
    }

    setBoatCount=async()=>{
        if(this.state.back_page_name!='Select_boats_manage'){
            this.setState({
                boat_number :'1',
            })
        }else{
            let result = await localStorage.getItemObject('user_arr');
            console.log('result', result);
            if (result != null) {
                this._getBoatCount(result.user_id);
            }
        }
    }

    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }


    _getBoatCount = async(user_id) =>{
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            
            let url = config.baseURL + "getBoatCount.php?user_id_post=" + user_id;
            console.log('url--', url);
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('Boat_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    if(obj.count==0){
                        this.setState({boat_number:1})
                    }else{
                        let count = parseInt(obj.count)+1;
                        this.setState({boat_number:count})
                    }
                } else {
                    if (obj.account_active_status == "deactivate") {
                   
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    this.setState({editModalvisibal: false,boat_number:0});
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false,boat_number:0 });
                //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }   

    goHomePage = () => {
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

    _addBoat=async()=>{
        Keyboard.dismiss()
        let { boat_name, boat_number, registration_no, boat_year, boat_length, boat_capacity, cabins,toilets } = this.state;
        let user_id_post =  await localStorage.getItemString('user_id');
        //boat name===========
        if (boat_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatName[config.language], 'center')
            return false
        }
        if (boat_name.length <= 2) {
            msgProvider.toast(Lang_chg.BoatNameMinLength[config.language], 'center')
            return false
        }
        if (boat_name.length > 50) {
            msgProvider.toast(Lang_chg.BoatNameMaxLength[config.language], 'center')
            return false
        }

         //boat number ====================
        var digit = /^\d*\.?\d*$/;
       
        if (boat_number.length <= 0) {
            msgProvider.toast(Lang_chg.vailidBoatNumber[config.language], 'center')
            return false
        }
        
        if (boat_number.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatNumber[config.language], 'center')
            return false
        }
        //boat registration_no ====================
        if (registration_no.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatRegistration_no[config.language], 'center')
            return false
        }
        if (registration_no.length <= 2) {
            msgProvider.toast(Lang_chg.BoatRegistration_noMinLength[config.language], 'center')
            return false
        }
        if (registration_no.length > 50) {
            msgProvider.toast(Lang_chg.Boatregistration_noMaxLength[config.language], 'center')
            return false
        }

        //boat date==============
        if(boat_year.length<=0){
            msgProvider.toast(Lang_chg.emptyBoatYear[config.language],'center')
            return false
        }


        var digit = /^\d*\.?\d*$/; 
        //boat  length==============
        if(boat_length.length<=0){
            msgProvider.toast(Lang_chg.emptyBoatLength[config.language],'center')
            return false
        }
        if (digit.test(boat_length) !== true) {
            msgProvider.toast(Lang_chg.vailidBoatLength[config.language], 'center')
            return false
        }
        //boat  capacity==============
        if(boat_capacity.length<=0){
            msgProvider.toast(Lang_chg.emptyBoatCapacity[config.language],'center')
            return false
        }
        if (digit.test(boat_capacity) !== true) {
            msgProvider.toast(Lang_chg.vailidCapacity[config.language], 'center')
            return false
        }
        //boat  cabins==============
        if(cabins.length<=0){
            msgProvider.toast(Lang_chg.emptyBoatCabins[config.language],'center')
            return false
        }
        if (digit.test(cabins) !== true) {
            msgProvider.toast(Lang_chg.vailidCabins[config.language], 'center')
            return false
        }
        //boat  cabins==============
        if(toilets.length<=0){
            msgProvider.toast(Lang_chg.emptyBoatToilets[config.language],'center')
            return false
        }
        if (digit.test(toilets) !== true) {
            msgProvider.toast(Lang_chg.vailidToilets[config.language], 'center')
            return false
        }
      
        
        

        if (this.state.isConnected === true) {
            let url = config.baseURL + "boat_create.php";
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('boat_name', boat_name)
            data.append('boat_number', boat_number)
            data.append('registration_no', registration_no)
            data.append('boat_year', boat_year)
            data.append('boat_length', boat_length)
            // data.append('business_location', business_location)
            data.append('boat_capacity', boat_capacity)
            data.append('cabins', cabins)
            data.append('toilets', toilets)
            
            data.append("language_id", config.language)


            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {

                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    if(this.state.back_page_name=='Select_boats_manage'){
                        this.props.navigation.navigate('Select_boats_manage')
                    }else{
                        console.log('user data===', obj);
                        var user_arr = obj.user_details;
                        var email_arr = obj.email_arr;
                        let user_type = user_arr.user_type;
                        let signup_step = user_arr.signup_step;
                        let user_id = user_arr.user_id;
                        let email = user_arr.email;
                        let otp = user_arr.otp;
                        if (user_type == 2) {
                            if (signup_step == 1) {
                                localStorage.setItemString('user_id', JSON.stringify(user_id));
                                console.log('user_id', user_id);
                                this.props.navigation.navigate('Add_boats')
                            }
                            if(signup_step == 2){
                                localStorage.setItemString('user_id', JSON.stringify(user_id));
                                localStorage.setItemObject('user_arr', user_arr);
                                // this.props.navigation.navigate('Home')
                                this.goHomePage();
                            }
                            // for mail send
                            if (typeof email_arr !== 'undefined') {
                                if (email_arr != 'NA') {
                                    this.mailsendfunction(email_arr);
                                }
                            }
                            msgProvider.toast(onj.msg[config.language],'center')
                        }
                    }
                } else {
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
    mailsendfunction = (email_arr) => {
        console.log('email_arr',email_arr);
        for(let i=0;i<email_arr.length;i++){
            var email = email_arr[i].email;
            var mailcontent = email_arr[i].mailcontent
            var mailsubject = email_arr[i].mailsubject
            var fromName = email_arr[i].fromName
            var url = config.baseURL + 'mailFunctionsSend.php';
            var data = new FormData();
            data.append("email", email);
            data.append("mailcontent", mailcontent);
            data.append("mailsubject", mailsubject);
            data.append("fromName", fromName);
            data.append("mail_file", 'NA');
            console.log('forget==',data);

            // api calling start==============================
            apifuntion.postApi(url, data).then((obj) => {
                return obj.json();
            }).then((obj) => {
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Mail send');
                }else{
                    console.log('not send mail');
                }
                // api calling end==============================    
            })
        }
    }
    render() {
        console.log('this.state.boat_number',this.state.boat_number);
        return (
            <KeyboardAwareScrollView style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>

                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.add_boat_txt[config.language]}</Text>
                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            placeholder={Lang_chg.boat_name_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ boat_name: txt }) }}
                            maxLength={50}
                            minLength={6}
                            value={this.state.boat_name}
                            keyboardType='default'
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            placeholder={Lang_chg.boat_no_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ boat_number: txt }) }}
                            maxLength={4}
                            minLength={1}
                            value={this.state.boat_number.toString()}
                            keyboardType='default'
                            autoCapitalize='none'
                            editable={false}
                        />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            placeholder={Lang_chg.boat_reg_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ registration_no: txt }) }}
                            maxLength={50}
                            minLength={6}
                            value={this.state.registration_no}
                            keyboardType='default'
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={styles.login_input}>
                        
                            <DatePicker style={styles.pass_login}
                                style={{ width: '95%', textAlign: 'right', height: 45, marginTop: 5, }}
                                date={this.state.boat_year}
                                confirmBtnText="Confirm"
                                placeholder={Lang_chg.boat_year_txt[config.language]}
                                maxDate={new Date()}
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        alignItems: 'flex-end',
                                    },
                                    dateInput: {
                                        borderColor: '#234456',
                                        borderWidth: 0,
                                        alignItems: 'flex-end',
                                    },
                                }}
                                onDateChange={(date) => { this.setState({ boat_year: date }) }}
                            />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            onChangeText={this.handleTextChange}
                            placeholder={Lang_chg.boat_len_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ boat_length : txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.boat_length }
                            keyboardType='number-pad'
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            onChangeText={this.handleTextChange}
                            placeholder={Lang_chg.boat_cap_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ boat_capacity : txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.boat_capacity }
                            keyboardType='number-pad'
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            onChangeText={this.handleTextChange}
                            placeholder={Lang_chg.cabins_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ cabins : txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.cabins }
                            keyboardType='number-pad'
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={styles.login_input}>
                        <TextInput
                            style={styles.enter_emaol_login}
                            onChangeText={this.handleTextChange}
                            placeholder={Lang_chg.toilets_txt[config.language]}
                            placeholderTextColor="#b8b8b8"
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={(txt) => { this.setState({ toilets : txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.toilets }
                            keyboardType='number-pad'
                            autoCapitalize='none'
                        />
                    </View>

                    <View style={styles.login_btn1}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this._addBoat}>
                            <Text style={styles.log_txt_btn}>
                            {Lang_chg.txt_Submit[config.language]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
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
    login_input: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        textAlign:'center',
        height:50,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
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
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Ubuntu-Regular",
    },


})