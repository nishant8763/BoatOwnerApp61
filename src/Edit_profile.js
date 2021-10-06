import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, FlatList, Modal, TouchableOpacity, Image, ScrollView, TextInput,Keyboard, TouchableOpacityBase} from 'react-native'
import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { mediaprovider } from './Provider/mediaProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Edit_profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: "2021-01-01",
            selecthoursh: false,
            modalVisible: false,
            modalVisible1: false,
            modalVisiblege:false,
            editgender: false,
            englishstaus: false,
            arebicstaus: false,
            profile_image: '',
            city_arr: 'NA',
            city_arr1: 'NA',
            isConnected: true,
            user_name: '',
            f_name: '',
            l_name: '',
            email: '',
            city_id           : '',
            city_name         : '',
            phone_no          : '',
            business_name     : '',
            business_location : '',
            dob               : '',
            gender            : '',
            about             : '',
            loading           : false,
            user_id:'',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            //this.setState({business_location:mapaddress});
        });
        // mapaddress  =   '';
        // maplat      =   '';
        // maplong     =   '';
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });

        this._setUserProfile();
        this._getAllCity();
    }
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }
    _searchCity = (textToSearch) =>{
        this.setState({
            city_arr : this.state.city_arr1.filter(i =>
                    i.city[config.language].toLowerCase().includes(textToSearch.toLowerCase()),
            ),
        })
    }

    _setUserProfile = async () => {
        let result = await localStorage.getItemObject('user_arr');
        console.log('result', result);
        if (result != null) {
            var dob1 = '';
            if (result.dob == '0000-00-00') {
                dob1 = '';
            }else{
                dob1 = result.dob;
            }
            let profile_img = '';
            if (result.image != 'NA') {
                profile_img = config.img_url1 + result.image;
            }
            let about1 = '';
            if(result.about=='NA'){
                about1 = ''
            }else{
                about1 = result.about
            }
            // let address = '';
            // if(result.address=='NA' && result.address==null){
            //     address = ''
            // }else{
            //     address = result.address
            // }
            // mapaddress  =   address;
            this.setState({
                user_name       :    result.name,
                f_name          :    result.f_name,
                l_name          :    result.l_name,
                email           :    result.email,
                city_id         :    result.city,
                city_name       :    result.city_name[config.language],
                dob             :    dob1,
                gender          :    result.gender,
                about           :    about1,
                profile_image   :    profile_img,
                user_id         :    result.user_id,
                phone_no        :    result.mobile,
                business_name   :    result.bussness_name,
                // business_location : address,
            })
            // if(result.latitude!='NA' && result.latitude!=null){
            //     maplat      =   result.latitude;
            // }
            // if(result.longitude!='NA' && result.longitude!=null){
            //     maplong      =   result.longitude;
            // }
        }
    }
    _getAllCity = async() => {
        Keyboard.dismiss()
        let result = await localStorage.getItemObject('user_arr');
        let city_id_get = 0; 
        if(result!=null){
            city_id_get = result.city; 
        }
        if (this.state.isConnected === true) {
            let url = config.baseURL + "city_list.php?country_code=965";
            this.setState({ loading: true })
            apifuntion.getApi(url).then((obj) => {

                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                console.log('city array', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    var city_arr = obj.city_arr
                    if(city_arr!='NA'){
                        var ind = city_arr.findIndex(x => x.city_id == city_id_get);
                        city_arr[ind].status=true;
                        this.setState({ city_arr: obj.city_arr,city_arr1:obj.city_arr});
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
            });
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    _setGender = (gender_type) => { this.setState({ gender: gender_type }); }
    _openCamera = () => {
        mediaprovider.launchCamera().then((obj) => {
            console.log(obj.path);
            this.setState({
                profile_image: obj.path,
                modalVisible1: false,
            })
        })
    }

    _openGellery = () => {
        mediaprovider.launchGellery().then((obj) => {
            console.log(obj.path);
            this.setState({
                profile_image: obj.path,
                modalVisible1: false,
            })
        })
    }
    // _selectCity = (index) => {
    //     var city_arr1 = this.state.city_arr[index];
    //     var city_selected = city_arr1.city;
    //     var city_city_id = city_arr1.city_id;
    //     this.setState({
    //         city_name: city_selected,
    //         city_id: city_city_id,
    //         modalVisible: false,
    //     });
    // }

    
    _selectCity = (index) => {
        let data = this.state.city_arr;
        let len = this.state.city_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }
        data[index].status = !data[index].status;
        this.setState({
            city_name       : data[index].city[config.language],
            city_id         : data[index].city_id,
            modalVisible    : false,
        })
    }


    _btnSubmit=()=>{
        
        Keyboard.dismiss()
        let { f_name, l_name, email, phone_no, business_name, business_location, city_id, dob, gender,user_id,profile_image} = this.state;
        
        //last name===================
        if (l_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyLastName[config.language], 'center')
            return false
        }
        if (l_name.length <= 2) {
            msgProvider.toast(Lang_chg.LastNameMinLength[config.language], 'center')
            return false
        }
        if (l_name.length > 50) {
            msgProvider.toast(Lang_chg.LastNameMaxLength[config.language], 'center')
            return false
        }
        
        var letters1 = /^[a-zA-Z- ]+$/;
        if (letters1.test(l_name) !== true) {
            msgProvider.toast(Lang_chg.validLastName[config.language], 'center')
            return false
        }

        //firs name===================
        if (f_name.length <= 0) {
            msgProvider.toast(Lang_chg.emptyFirstName[config.language], 'center')
            return false
        }
        if (f_name.length <= 2) {
            msgProvider.toast(Lang_chg.FirstNameMinLength[config.language], 'center')
            return false
        }
        if (f_name.length > 50) {
            msgProvider.toast(Lang_chg.FirstNameMaxLength[config.language], 'center')
            return false
        }
        var letters = /^[a-zA-Z- ]+$/;
        if (letters.test(f_name) !== true) {
            msgProvider.toast(Lang_chg.validFirstName[config.language], 'center')
            return false
        }
    
         //phone============================
         if (phone_no.length <= 0) {
            msgProvider.toast(Lang_chg.emptyMobile[config.language], 'center')
            return false
        }

        if (phone_no.length < 8) {
            msgProvider.toast(Lang_chg.MobileMinLength[config.language], 'center')
            return false
        }
        if (phone_no.length > 8) {
            msgProvider.toast(Lang_chg.MobileMaxLength[config.language], 'center')
            return false
        }

        var digit = /^[0-9]+$/; 
        if (digit.test(phone_no) !== true) {
            msgProvider.toast(Lang_chg.validMobile[config.language], 'center')
            return false
        }
        //Bussiness name===================
        if (business_name.length <= 0) {

            msgProvider.toast(Lang_chg.BussinessEmptyName[config.language], 'center')
            return false
        }
        if (business_name.length <= 2) {
            
            msgProvider.toast(Lang_chg.BussinessNameMinLength[config.language], 'center')
            return false
        }
        if (business_name.length > 50) {
            msgProvider.toast(Lang_chg.BussinessNameMaxLength[config.language], 'center')
            return false
        }
       
        //Business location===================
    //   if(business_location!=null){
    //     if (business_location.length <= 0) {
    //         msgProvider.toast(Lang_chg.businessLocationempty[config.language], 'center')
    //         return false
    //     }
      
    //     if (maplat.length <= 0) {
    //         msgProvider.toast(Lang_chg.businessLocationempty[config.language], 'center')
    //         return false
    //     }
    //     if (maplong.length <= 0) {
    //         msgProvider.toast(Lang_chg.businessLocationempty[config.language], 'center')
    //         return false
    //     }
    //   }else{
    //     msgProvider.toast(Lang_chg.businessLocationempty[config.language], 'center')
    //     return false
    //   }
        
        if(parseInt(city_id)<=0){
            msgProvider.toast(Lang_chg.emptyCity[config.language], 'center')
            return false
        }

        if(dob.length<=0){
            msgProvider.toast(Lang_chg.emptydob[config.language], 'center')
            return false
        }

        if(gender<=0){
            msgProvider.toast(Lang_chg.emptygender[config.language], 'center')
            return false
        }

       
        if (this.state.isConnected === true) {
            let url = config.baseURL + "edit_profile.php";
            var data = new FormData();

            data.append('user_id_post', user_id)
            data.append("user_type_post", 2)
            data.append('f_name', f_name)
            data.append('l_name', l_name)
            data.append('dob', dob)
            data.append('gender', gender)
            data.append('city', city_id)
            data.append('email', email)
            data.append("business_name", business_name)
            // data.append("business_address", business_location)
            // data.append("latitude", maplat)
            // data.append("longitude", maplong)
            data.append("phone_number", phone_no)
            
            if (this.state.profile_image != '') {
                data.append('profile_pic', {
                    uri: this.state.profile_image,
                    type: 'image/jpg', // or photo.type
                    name: 'image.jpg'
                })
            }
        
            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
        
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    let user_arr = obj.user_details;
                    let user_id  = user_arr.user_id;
                    this.setState({modalVisible2:false})
                    localStorage.setItemString('user_id', JSON.stringify(user_id));
                    localStorage.setItemObject('user_arr', user_arr);
                    msgProvider.toast(obj.msg[config.language], 'center')
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
    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <Loader loading={this.state.loading} />
                <Modal animationType="slide" transparent visible={this.state.modalVisible}
                    onRequestClose={() => {
                       this.setState({ modalVisible: false })
                    }}>
                    <StatusBar  barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible: false }) }}>
                            <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Choose_City[config.language]}</Text>
                        <Text></Text>
                    </View>
                    <View style={styles.search_bar}>
            <TextInput placeholder={Lang_chg.txt_search_city[config.language]} style={{height:50}} onChangeText={(text)=>{this._searchCity(text)}}></TextInput>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View style={styles.other_gift_photo}>
                            <FlatList style={{ marginBottom: 50, }}
                                showsVerticalScrollIndicator={false}
                                data={this.state.city_arr}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity activeOpacity={.7} onPress={() => { this._selectCity(index) }} style={(item.status==true)?styles.cityBackgroundColor1:styles.cityBackgroundColor}>
                                            <View style={styles.main_view_flag}>
                                                <Text style={styles.flag_text_detail}>
                                                    {item.city[config.language]}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent visible={this.state.modalVisiblege}
                    onRequestClose={() => {
                        this.setState({ modalVisiblege: false })
                    }}>
                     <StatusBar  barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisiblege: false }) }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Choose_Gender[config.language]}</Text>
                        <Text></Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View style={styles.select_gender}>
                            <View style={{  paddingBottom: 30, paddingLeft: 20, paddingRight: 20 }}>
                                <TouchableOpacity onPress={() => { this._setGender(1) }} activeOpacity={0.9}>
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>
                                        {
                                            (this.state.gender == 1) ?
                                            <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                            :
                                            <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                                        }
                                        <Text style={{ marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>Male </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                                <TouchableOpacity onPress={() => { this._setGender(2) }} activeOpacity={0.9}>
                                    <View style={{ flexDirection: 'row' }}>
                                    {
                                        (this.state.gender == 2) ?
                                            <Image style={styles.login_email} source={require('./icons/radio_active.png')}></Image>
                                            :
                                            <Image style={styles.login_email} source={require('./icons/radio.png')}></Image>
                                    }
                                        <Text style={{ marginLeft: 10, color: '#686868', fontSize: 16, fontFamily: "Ubuntu-Regular" }}>Female</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>


                <View style={styles.header_earnig}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.edit_profile[config.language]}</Text>
                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    <View style={styles.sign_top_logo}>
                        <TouchableOpacity activeOpacity={.9}
                            onPress={() => { this.setState({ modalVisible1: !this.state.modalVisible1 }) }}
                        >
                            {
                                (this.state.profile_image == '' || this.state.profile_image == 'NA' || this.state.profile_image == null)
                                    ?
                                    <Image style={styles.signedit_profile_logo} source={require('./icons/error.png')}></Image>
                                    :
                                    <Image source={{ uri: this.state.profile_image }} style={styles.signedit_profile_logo} />
                            }
                            
                        </TouchableOpacity>

                    </View>

                    <View style={styles.main_login_top}>
                        <View style={styles.login_input_top}>
                            <TextInput
                                style={[styles.enter_emaol_login]}
                                placeholder={Lang_chg.last_name_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ l_name: txt }) }}
                                maxLength={50}
                                minLength={3}
                                value={this.state.l_name}
                                keyboardType='default'
                            />
                            <Image style={[styles.login_email,{marginRight:10}]} source={require('./icons/user.png')}></Image>
                        </View>
                        <View style={styles.login_input_top}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                placeholder={Lang_chg.first_name_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                autoCapitalize='none'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ f_name: txt }) }}
                                maxLength={50}
                                minLength={3}
                                value={this.state.f_name}
                                keyboardType='default'
                                
                            />
                            <Image style={[styles.login_email,{marginRight:10}]} source={require('./icons/user.png')}></Image>
                        </View>
                    </View>

                    <View style={styles.main_login}>
                        <View style={styles.login_input_pass}>
                            
                            <TextInput
                                style={styles.enter_emaol_login}
                                placeholder={Lang_chg.loginEmail[config.language]}
                                placeholderTextColor="#b8b8b8"
                                autoCapitalize='none'
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ email: txt }) }}
                                maxLength={50}
                                minLength={3}
                                editable={false}
                                value={this.state.email}
                                keyboardType='email-address'
                            />
                            <Image style={styles.login_email} source={require('./icons/email.png')}></Image>
                        </View>
                        <View style={styles.login_input_pass}>
                            <Text style={{width:'15%',textAlign:'right'}}>+965</Text>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.phone_no_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                autoCapitalize='none'
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ phone_no: txt }) }}
                                maxLength={8}
                                minLength={8}
                                value={this.state.phone_no}
                                keyboardType='phone-pad'
                            />
                            <Image style={styles.login_email} source={require('./icons/call.png')}></Image>
                        </View>
                        <View style={styles.login_input_pass}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.Business_Name_no_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                autoCapitalize='none'
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ business_name: txt }) }}
                                maxLength={50}
                                minLength={3}
                                value={this.state.business_name}
                                keyboardType='default'
                            />
                            <Image style={styles.login_email} source={require('./icons/business.png')}></Image>
                        </View>
                        {/* <TouchableOpacity style={styles.login_input} onPress={()=>{this.props.navigation.navigate('Map_show')}}>
                            <Text numberOfLines={1}>{(this.state.business_location!='' && this.state.business_location!=null)?this.state.business_location:'Business location'}</Text>
                            <Image style={styles.login_email} source={require('./icons/business_location.png')}></Image>
                        </TouchableOpacity> */}

                        <View>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.select_trip_txt}>{(this.state.city_name == '') ? Lang_chg.choose_city_txt[config.language] : this.state.city_name}</Text>
                                </View>
                                <View style={{ width: '15%', alignItems: 'center' }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain',tintColor:'#d15400' }} source={require('./icons/home_1.png')}></Image>
                                </View>
                            </TouchableOpacity>
                        </View>

                       

                        <View style={styles.login_input_pass}>
                          
                            <DatePicker style={styles.pass_login}
                                style={{ width: '95%', textAlign: 'right', height: 45, marginTop: 5, }}
                                date={this.state.dob}
                                confirmBtnText="Confirm"
                                placeholder={Lang_chg.dob_txt[config.language]}
                                maxDate={new Date()}
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        alignItems: 'flex-end',
                                    },
                                    dateInput: {
                                        borderColor: '#234456',
                                        borderWidth: 0,
                                        borderRadius: 4,
                                        alignItems: 'flex-end',
                                    },
                                }}
                                onDateChange={(date) => { this.setState({ dob: date }) }}
                            />
                        </View>

                       
                        <View>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisiblege: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={{textAlign:'right'}}>
                                    {this.state.gender == 0 && Lang_chg.Gender_txt[config.language]}
                                    {this.state.gender == 1 && Lang_chg.male_txt[config.language]}
                                    {this.state.gender == 2 && Lang_chg.female_txt[config.language]}
                                    </Text>
                                   
                                </View>
                                <View style={{ width: '15%', alignItems: 'center' }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/gender.png')}></Image>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                    <View style={styles.login_btn1} >
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this._btnSubmit() }}>
                            <Text style={styles.log_txt_btn}>
                            {
                                Lang_chg.txt_update[config.language]
                            }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    // visible={true}
                
                    onRequestClose={() => { this.setState({ modalVisible1: !this.state.modalVisible1 }) }}
                >
                    <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                        <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                            networkActivityIndicatorVisible={true} />
                        <View style={{ borderRadius: 20, width: "100%", position: 'absolute', bottom: 0, }}>

                            <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20 }}>
                                <TouchableOpacity
                                    onPress={this._openCamera}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.Take_a_photo_txt[config.language]}</Text>
                                </TouchableOpacity>
                                <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: 2, marginTop: 10 }}></View>
                                <TouchableOpacity
                                    onPress={this._openGellery}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>{Lang_chg.Choose_from_library_txt[config.language]}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20, marginVertical: 15 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ modalVisible1: !this.state.modalVisible1 }) }}
                                >
                                    <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.cancel[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    earnig_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },


    sign_logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    sign_top_logo: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 20,
    },

    main_login: {
        width: "90%",
        alignItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    
     login_input: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        height:50,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    
    enter_emaol_login: {
        textAlign: 'right',
        width:'85%',
        height:50,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 14,
        fontFamily: "Ubuntu-Regular",
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    login_input_pass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular"
    },
    login_input_top: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '49%',
        height: 50,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        justifyContent:'space-between',
    },
    main_login_top: {
        width: '90%',
        flexDirection: 'row',
        alignItems:"center",
        marginHorizontal:20,
        marginTop: 30,
        justifyContent:'space-between',
        flexWrap:'wrap'
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
    privact_section: {
        paddingRight: 20,
        paddingLeft: 20,
    },
    service_privact: {
        textAlign: 'center',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 16,
    },
    terms_popup: {
        color: 'red',

    },
    privacy_policy: {
        borderBottomWidth: 1,
        borderColor: 'red',
        color: 'red',
    },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#d15400',
        paddingTop: 20,
        paddingBottom: 20,
    },
    back_buttn_top: {
        marginTop: 3,
    },
    hole_top_l1: {
        width: 20,
        height: 20,
    },
    cityBackgroundColor:{
        backgroundColor:'#fff',
        justifyContent:'center',
        borderBottomColor:'#d15400',
        borderBottomWidth:1,
    },
    cityBackgroundColor1:{
        backgroundColor:'#d15400',
        justifyContent:'center',
        borderBottomColor:'#d15400',
        borderBottomWidth:1,
    },
    Notifications_title: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 20,
        color: '#000',
    },
    search_bar: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#000',
        borderTopWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    main_view_flag: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
    paddingVertical:10,
        // marginTop: 20,
    },
    flag_text_detail: {
        color: '#333232',
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
    },
    flag_image_home: {
        width: 20,
        height: 20,
        marginLeft: 20,
        marginTop: 5,
    },
    signedit_profile_logo: {
        width: 120,
        height: 120,
        resizeMode: 'cover',
        borderRadius: 60,
    },

    select_trip_box: {
        flexDirection: 'row',
        borderWidth: 1,
        width: '96%',
        borderColor: '#d15400',
        borderRadius: 15,
        paddingLeft: 20,
        paddingBottom: 14,
        paddingTop: 14,
        marginBottom: 20,
    },
    arrow_img: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginTop: 5,
    },
    select_trip_txt: {
        textAlign: 'right',
        fontSize: 16,
        color: '#888',
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    select_gender: {
        width: '80%',
        height: 200,
    },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
    },
    login_input_pass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
        marginTop: 10,
        alignSelf: 'center',
    },
})