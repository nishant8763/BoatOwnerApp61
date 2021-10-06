import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Keyboard, ActivityIndicator, Modal,Dimensions } from 'react-native'
import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import validation from './Provider/Validation_provider'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = Dimensions.get('window').height;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Edit_boat extends Component {
    state = {
        boat_name: '',
        boat_number: '',
        registration_no: '',
        boat_year: '',
        boat_length: '',
        boat_capacity: '',
        cabins: '',
        toilets: '',
        isConnected: true,
        loading:false,
        boat_id: this.props.route.params.boat_id,
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
        this._getBoatData();
    }


    _getBoatData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "boat_details.php?user_id_post=" + user_id_post + "&boat_id_post=" + this.state.boat_id;
            console.log('url--', url);
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('Boat_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Boat_arr===', obj);
                    let boat_arr = obj.boat_arr;
                    if (boat_arr != 'NA') {
                        this.setState({
                            boat_name: boat_arr.name,
                            boat_number: boat_arr.boat_number,
                            registration_no: boat_arr.registration_no,
                            boat_year: boat_arr.manufacturing_year,
                            boat_length: boat_arr.boat_length,
                            boat_capacity: boat_arr.boat_capacity,
                            cabins: boat_arr.cabins,
                            toilets: boat_arr.toilets,
                        })
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
                this.setState({ loading: false });
                //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    _editBoat = async () => {
        Keyboard.dismiss()
        let { boat_name, boat_number, registration_no, boat_year, boat_length, boat_capacity, cabins, toilets } = this.state;
        let user_id_post = await localStorage.getItemString('user_id');
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
        var digit = /^\d*\.?\d*$/;
        //boat number ====================
        if (boat_number.length <= 0) {
            msgProvider.toast(Lang_chg.vailidBoatNumber[config.language], 'center')
            return false
        }
        if (digit.test(boat_number) !== true) {
            msgProvider.toast(Lang_chg.vailidBoatLength[config.language], 'center')
            return false
        }
        //boat number ====================
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
        if (boat_year.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatYear[config.language], 'center')
            return false
        }


        //boat  length==============
        if (boat_length.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatLength[config.language], 'center')
            return false
        }
        if (digit.test(boat_length) !== true) {
            msgProvider.toast(Lang_chg.vailidBoatLength[config.language], 'center')
            return false
        }
        //boat  capacity==============
        if (boat_capacity.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatCapacity[config.language], 'center')
            return false
        }
        if (digit.test(boat_capacity) !== true) {
            msgProvider.toast(Lang_chg.vailidCapacity[config.language], 'center')
            return false
        }
        //boat  cabins==============
        if (cabins.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatCabins[config.language], 'center')
            return false
        }
        if (digit.test(cabins) !== true) {
            msgProvider.toast(Lang_chg.vailidCabins[config.language], 'center')
            return false
        }
        //boat  cabins==============
        if (toilets.length <= 0) {
            msgProvider.toast(Lang_chg.emptyBoatToilets[config.language], 'center')
            return false
        }
        if (digit.test(toilets) !== true) {
            msgProvider.toast(Lang_chg.vailidToilets[config.language], 'center')
            return false
        }

        if (this.state.isConnected === true) {
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append('boat_id_post', this.state.boat_id)
            data.append('boat_name', boat_name)
            data.append('boat_number', boat_number)
            data.append('registration_no', registration_no)
            data.append('boat_year', boat_year)
            data.append('boat_length', boat_length)
            data.append('boat_capacity', boat_capacity)
            data.append('cabins', cabins)
            data.append('toilets', toilets)
            data.append("language_id", config.language)
            let url = config.baseURL + "boat_edit.php";
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[config.language], 'center');
                    this.props.navigation.goBack();
                    return false
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



    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />


                {/* <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={this.state.loading}
                    onRequestClose={() => { this.setState({ status: false }) }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            
                        </View>
                    </View>
                </Modal> */}
       {  (this.state.loading)&&       <View style={{   
                    position:'absolute',
                        height: 80,
                        width: 80,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        backgroundColor:'black',
                        zIndex:1,marginTop:BannerHeight/2-40,marginLeft:BannerWidth/2-40}}>
                            <ActivityIndicator size="large" color='#FFFFFF'
                                animating={this.state.loading} />

                </View>}

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.Edit_boat_txt[config.language]}</Text>
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
                            value={this.state.boat_number}
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
                            onChangeText={(txt) => { this.setState({ boat_length: txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.boat_length}
                            keyboardType='default'
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
                            onChangeText={(txt) => { this.setState({ boat_capacity: txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.boat_capacity}
                            keyboardType='default'
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
                            onChangeText={(txt) => { this.setState({ cabins: txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.cabins}
                            keyboardType='default'
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
                            onChangeText={(txt) => { this.setState({ toilets: txt }) }}
                            maxLength={20}
                            minLength={1}
                            value={this.state.toilets}
                            keyboardType='default'
                            autoCapitalize='none'
                        />
                    </View>

                    <View style={styles.login_btn1}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this._editBoat}>
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
        textAlign: 'center',
        height: 50,
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
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000020',
      },
      activityIndicatorWrapper: {
        height: 80,
        width: 80,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        // flexDirection:'row',
        justifyContent: 'space-around',
        backgroundColor:'black'
      }

})