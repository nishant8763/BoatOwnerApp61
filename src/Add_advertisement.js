import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, TextInput, Modal, Image, ScrollView, Keyboard } from 'react-native'

import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { mediaprovider } from './Provider/mediaProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Add_advertisement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hoursData: [
                { hours: 1, status: false },
                { hours: 2, status: false },
                { hours: 3, status: false },
                { hours: 4, status: false },
                { hours: 5, status: false },
                { hours: 6, status: false },
                { hours: 7, status: false },
                { hours: 8, status: false },
                { hours: 9, status: false },
                { hours: 10, status: false },
                { hours: 11, status: false },
                { hours: 12, status: false },
                { hours: 13, status: false },
                { hours: 14, status: false },
                { hours: 15, status: false },
                { hours: 16, status: false },
                { hours: 17, status: false },
                { hours: 18, status: false },
                { hours: 19, status: false },
                { hours: 20, status: false },
                { hours: 21, status: false },
                { hours: 22, status: false },
                { hours: 23, status: false },
                { hours: 24, status: false },
            ],
            hoursData1: [
                { hours: 1, status: false },
                { hours: 2, status: false },
                { hours: 3, status: false },
                { hours: 4, status: false },
                { hours: 5, status: false },
                { hours: 6, status: false },
                { hours: 7, status: false },
                { hours: 8, status: false },
                { hours: 9, status: false },
                { hours: 10, status: false },
                { hours: 11, status: false },
                { hours: 12, status: false },
                { hours: 13, status: false },
                { hours: 14, status: false },
                { hours: 15, status: false },
                { hours: 16, status: false },
                { hours: 17, status: false },
                { hours: 18, status: false },
                { hours: 19, status: false },
                { hours: 20, status: false },
                { hours: 21, status: false },
                { hours: 22, status: false },
                { hours: 23, status: false },
                { hours: 24, status: false },
            ],
            date: new Date(),
            modalVisible: false,
            modalVisible2: false,
            modalVisible3: false,
            modalVisible4: false,
            modalVisible5: false,
            modalVisible6: false,
            boat_arr: 'NA',
            city_arr: 'NA',
            city_arr1: 'NA',
            trip_type_arr: 'NA',
            title_ar: '',
            title_eng: '',
            mobile: '',
            trip_type_id: '',
            trip_type_name: '',
            boat_id: '',
            boat_name: '',
            no_of_people: '',
            location_address: '',
            location_lat: '',
            location_lng: '',
            discription_ar: '',
            discription_en: '',
            rental_price: '',
            extra_price: '',
            minimum_hours: '',
            idle_hours: '',
            discount: 0,
            selected_city: '',
            selected_city_id: 0,
            img_1: '',
            img_2: '',
            img_3: '',
            img_type: 0,
            editModalvisibal: false,
            show_img: [
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
                {
                    id: 0
                },
            ],
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            // alert(maplong)
            this.setState({ location_address: config.mapaddress });
        });
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        config.maplat = '';
        config.maplong = '';
        config.mapaddress = '';
        this._getData();
    }

    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    _getData = async () => {
        Keyboard.dismiss();
        let result = await localStorage.getItemObject('user_arr')
        let user_id_post = 0;
        if (result != null) {
            user_id_post = result.user_id;
        }
        // alert(user_id_post);
        // return false;
        if (this.state.isConnected === true) {
            this.setState({ loading: true });
            let url = config.baseURL + "boat_trip_type_for_add_advr.php?user_id_post=" + user_id_post + "&country_code=965";
            console.log('url=', url);
            this.setState({ loading: true })
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                console.log('trip_type_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this.setState({
                        trip_type_arr: obj.trip_type_arr,
                        boat_arr: obj.boat_arr,
                        city_arr: obj.city_arr,
                        city_arr1: obj.city_arr,
                    });
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

    _checked_uncheckHoursMinimum = (index) => {
        let data = this.state.hoursData;
        let len = this.state.hoursData.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;

        this.setState({
            hoursData: data,
            modalVisible4: false,
            minimum_hours: data[index].hours,
        })
    }
    _checked_uncheckHoursIdeal = (index) => {
        let data = this.state.hoursData1;
        let len = this.state.hoursData1.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            hoursData: data,
            modalVisible5: false,
            idle_hours: data[index].hours
        })
    }
    selctBoatType = (index) => {
        let data = this.state.boat_arr;
        let len = this.state.boat_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            boat_arr: data,
            modalVisible2: false,
            boat_id: data[index].boat_id,
            boat_name: data[index].name
        })
    }
    selctTripType = (index) => {
        let data = this.state.trip_type_arr;
        let len = this.state.trip_type_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            trip_type_arr: data,
            modalVisible: false,
            trip_type_id: data[index].trip_type_id,
            trip_type_name: data[index].name[config.language],
        })
    }


    _openCamera = () => {
        mediaprovider.launchCamera().then((obj) => {
            console.log(obj.path);
            if (this.state.img_type == 1) {
                this.setState({
                    img_1: obj.path,
                    editModalvisibal: false,
                })
            }
            if (this.state.img_type == 2) {
                this.setState({
                    img_2: obj.path,
                    editModalvisibal: false,
                })
            }
            if (this.state.img_type == 3) {
                this.setState({
                    img_3: obj.path,
                    editModalvisibal: false,
                })
            }
        })
    }

    _openGellery = () => {
        mediaprovider.launchGellery().then((obj) => {
            console.log(obj.path);
            if (this.state.img_type == 1) {
                this.setState({
                    img_1: obj.path,
                    editModalvisibal: false,
                })
            }
            if (this.state.img_type == 2) {
                this.setState({
                    img_2: obj.path,
                    editModalvisibal: false,
                })
            }
            if (this.state.img_type == 3) {
                this.setState({
                    img_3: obj.path,
                    editModalvisibal: false,
                })
            }
        })
    }



    renderItemMinimum = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => { this._checked_uncheckHoursMinimum(index); }}
                style={(item.status == false) ? styles.time_row : styles.time_row1}>
                <Text style={styles.edial_time}>{item.hours} {Lang_chg.Hours_txt[config.language]}</Text>
            </TouchableOpacity>
        );
    }
    renderItemIdel = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => { this._checked_uncheckHoursIdeal(index); }}
                style={(item.status == false) ? styles.time_row : styles.time_row1}>
                <Text style={styles.edial_time}>{item.hours} {Lang_chg.Hours_txt[config.language]}</Text>
            </TouchableOpacity>
        );
    }


    _removeImg = (id,index) => {
        if(id=='local'){
            this.state.show_img.splice(index, 1);
            let json = {
                id: 0,
            }
            this.state.show_img.push(json);
            this.setState({
                show_img: [...this.state.show_img],
            })
        }
    }

    _openCamera = () => {
        mediaprovider.launchCamera().then((obj) => {
            console.log(obj.path);
            let index  = this.state.img_type;
            this.state.show_img.splice(index, 1);
            let json = {
                image: obj.path,
                id: 'local',
            }
            this.state.show_img.splice(index, 0, json);
            console.log('this.state.show_img',this.state.show_img);
            this.setState({
                img_1: obj.path,
                show_img: [...this.state.show_img],
                editModalvisibal: false,
            })
        })
    }

    _openGellery = () => {
        mediaprovider.launchGellery().then((obj) => {
            console.log(obj.path);
            let index  = this.state.img_type;
            this.state.show_img.splice(index, 1);
            let json = {
                image: obj.path,
                id: 'local',
            }
            this.state.show_img.splice(index, 0, json);
            console.log('this.state.show_img',this.state.show_img);
            this.setState({
                img_1: obj.path,
                show_img: [...this.state.show_img],
                editModalvisibal: false,
            })
        })
    }

    _selectCity = (index) => {

        let data = this.state.city_arr;
        let len = this.state.city_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            selected_city: data[index].city[config.language],
            selected_city_id: data[index].city_id,
            modalVisible6: false,
        })

    }

    _submitAdvertisement = async () => {
        let { title_ar, title_eng, mobile, trip_type_id, trip_type_name, boat_id, boat_name, no_of_people, location_address, location_lat, location_lng, discription_ar, discription_en, rental_price, extra_price, minimum_hours, idle_hours, discount, selected_city_id } = this.state;

        if (title_ar.length == 0) {
            msgProvider.toast(Lang_chg.emptyArTitle[config.language], 'center')
            return false
        }
        if (title_ar.length <= 2) {
            msgProvider.toast(Lang_chg.minArTitle[config.language], 'center')
            return false
        }
        if (title_eng.length > 50) {
            msgProvider.toast(Lang_chg.maxArTitle[config.language], 'center')
            return false
        }
        // title eng
        if (title_eng.length == 0) {
            msgProvider.toast(Lang_chg.emptyEngTitle[config.language], 'center')
            return false
        }
        if (title_eng.length <= 2) {
            msgProvider.toast(Lang_chg.minEngTitle[config.language], 'center')
            return false
        }
        if (title_eng.length > 50) {
            msgProvider.toast(Lang_chg.maxEngTitle[config.language], 'center')
            return false
        }

        //mobile============================
        if (mobile.length <= 0) {
            msgProvider.toast(Lang_chg.emptyMobile1[config.language], 'center')
            return false
        }
        if (mobile.length < 8) {
            msgProvider.toast(Lang_chg.MobileMinLength1[config.language], 'center')
            return false
        }
        if (mobile.length > 8) {
            msgProvider.toast(Lang_chg.MobileMaxLength1[config.language], 'center')
            return false
        }
        var letters = /^[0-9]+$/;
        if (letters.test(mobile) !== true) {
            msgProvider.toast(Lang_chg.validMobile1[config.language], 'center')
            return false
        }

        if (trip_type_id == '') {
            msgProvider.toast(Lang_chg.emptyTripType[config.language], 'center')
            return false
        }
        if (boat_id == '') {
            msgProvider.toast(Lang_chg.emptyBoatType[config.language], 'center')
            return false
        }

        if (no_of_people.length <= 0) {
            msgProvider.toast(Lang_chg.emptyno_of_people[config.language], 'center')
            return false
        }

        if (letters.test(no_of_people) !== true) {
            msgProvider.toast(Lang_chg.vailidno_of_people[config.language], 'center')
            return false
        }

        var latter1 = /^\d*\.?\d*$/;

        if (location_address.length <= 0) {
            msgProvider.toast(Lang_chg.emptyplaceofboat[config.language], 'center')
            return false
        }
        if (config.maplat.length <= 0) {
            msgProvider.toast(Lang_chg.emptyplaceofboat[config.language], 'center')
            return false
        }
        if (config.maplong.length <= 0) {
            msgProvider.toast(Lang_chg.emptyplaceofboat[config.language], 'center')
            return false
        }
        if (selected_city_id.length == 0) {
            msgProvider.toast(Lang_chg.emptyCity[config.language], 'center')
            return false
        }
        // ar description
        if (discription_ar.length <= 0) {
            msgProvider.toast(Lang_chg.emptyArDes[config.language], 'center')
            return false
        }
        if (discription_ar.length <= 2) {
            msgProvider.toast(Lang_chg.minlenArDes[config.language], 'center')
            return false
        }
        if (discription_ar.length > 250) {
            msgProvider.toast(Lang_chg.maxlenArDes[config.language], 'center')
            return false
        }
        // english description
        if (discription_en.length <= 0) {
            msgProvider.toast(Lang_chg.emptyEngDes[config.language], 'center')
            return false
        }
        if (discription_en.length <= 2) {
            msgProvider.toast(Lang_chg.minlenEngDes[config.language], 'center')
            return false
        }
        if (discription_en.length > 250) {
            msgProvider.toast(Lang_chg.maxlenEngDes[config.language], 'center')
            return false
        }

        if (rental_price.length <= 0) {
            msgProvider.toast(Lang_chg.EmptyrentalPrice[config.language], 'center')
            return false
        }

        if (latter1.test(rental_price) !== true) {
            msgProvider.toast(Lang_chg.vailidrentalPrice[config.language], 'center')
            return false
        }

        if (extra_price.length <= 0) {
            msgProvider.toast(Lang_chg.EmptyextraPrice[config.language], 'center')
            return false
        }

        if (latter1.test(extra_price) !== true) {
            msgProvider.toast(Lang_chg.vailidextraPrice[config.language], 'center')
            return false
        }

        if (minimum_hours.length <= 0) {
            msgProvider.toast(Lang_chg.emptyminimumhours[config.language], 'center')
            return false
        }
        if (idle_hours.length <= 0) {
            msgProvider.toast(Lang_chg.emptyidelhours[config.language], 'center')
            return false
        }
        if (discount.length > 0) {
            if (latter1.test(discount) !== true) {
                msgProvider.toast(Lang_chg.vailiddescount[config.language], 'center')
                return false
            }
        }
      
        

        if (this.state.isConnected === true) {
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "advertisement_create.php";
            var data = new FormData();
            data.append('user_id_post', user_id_post)
            data.append("title_ar", title_ar)
            data.append("title_eng", title_eng)
            data.append("mobile", mobile)
            data.append("trip_type_id", trip_type_id)
            data.append("boat_id", boat_id)
            data.append("no_of_people", no_of_people)
            data.append("location_address", location_address)
            data.append("location_lat", config.maplat)
            data.append("location_lng", config.maplong)
            data.append("discription_ar", discription_ar)
            data.append("discription_en", discription_en)
            data.append("rental_price", rental_price)
            data.append("extra_price", extra_price)
            data.append("minimum_hours", minimum_hours)
            data.append("idle_hours", idle_hours)
            data.append("discount", discount)
            data.append("city", selected_city_id)



            if (this.state.show_img.length != 0) {
                for (let i = 0; i < this.state.show_img.length; i++) {
                    // data.append('image[]', image_arr[i], 'image.jpg');
                    if(this.state.show_img[i].id=='local'){
                        data.append('image[]', {
                            uri: this.state.show_img[i].image,
                            type: 'image/jpg', // or photo.type
                            name: 'image.jpg'
                        });
                    }
                }
            }

            this.setState({ loading: true })
            apifuntion.postApi(url, data).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('user_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('obj===', obj);
                    this.props.navigation.goBack();
                    msgProvider.toast(obj.msg[config.language], 'center')
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
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
                this.setState({ loading: false });
            });

        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }
    _searchCity = (textToSearch) => {
        this.setState({
            city_arr: this.state.city_arr1.filter(i =>
                i.city[config.language].toLowerCase().includes(textToSearch.toLowerCase()),
            ),
        })
    }
    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20 }}>
                <Loader loading={this.state.loading} />
                <Modal animationType="slide" transparent visible={this.state.modalVisible6}
                    onRequestClose={() => {
                        this.setState({ modalVisible6: false })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity activeOpacity={9} style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible6: false }) }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, }} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Choose_City[config.language]} </Text>
                        <Text></Text>
                    </View>
                    <View style={styles.search_bar}>
                        <TextInput placeholder={Lang_chg.txt_search_city[config.language]} style={{ height: 50 }} onChangeText={text => this._searchCity(text)} />
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View style={styles.other_gift_photo}>
                            <FlatList style={{ marginBottom: 50, }}
                                showsVerticalScrollIndicator={false}
                                data={this.state.city_arr}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity activeOpacity={.7} onPress={() => { this._selectCity(index) }} style={(item.status == true) ? styles.cityBackgroundColor1 : styles.cityBackgroundColor}>
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
                <Modal animationType="slide" transparent visible={this.state.modalVisible}

                    onRequestClose={() => {
                        this.setState({ modalVisible: !this.state.modalVisible })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible: false }) }}>
                            <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.select_trip_type[config.language]}</Text>
                        <TouchableOpacity>
                            <Image resizeMode="contain" style={styles.popup_search_icon} source={require('./icons/search.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>

                        {
                            (this.state.trip_type_arr != 'NA') ?
                                this.state.trip_type_arr.map((item, index) => (
                                    <TouchableOpacity activeOpacity={9} style={(item.status == true) ? styles.selct_trip_type_arr1 : styles.selct_trip_type_arr}
                                        onPress={() => { this.selctTripType(index) }}
                                    >
                                        <View>
                                            <Text style={{ fontWeight: '700' }}>{item.name[config.language]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                                :
                                <TouchableOpacity activeOpacity={9} style={styles.select_boat_main}>
                                    <View>
                                        <Text style={styles.boat_year}>{Lang_chg.data_not_found[config.language]}</Text>
                                    </View>
                                </TouchableOpacity>
                        }

                    </View>
                </Modal>


                <Modal animationType="slide" transparent visible={this.state.modalVisible2}
                    onRequestClose={() => {
                        this.setState({ modalVisible2: !this.state.modalVisible2 })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible2: false }) }}>
                            <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Select_Boat_txt[config.language]}</Text>
                        <TouchableOpacity>
                            <Image resizeMode="contain" style={styles.popup_search_icon} source={require('./icons/search.png')}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10 }}>

                        {
                            (this.state.boat_arr != 'NA') ?
                                this.state.boat_arr.map((item, index) => (
                                    <TouchableOpacity activeOpacity={9} style={(item.status == true) ? styles.selct_trip_type_arr1 : styles.selct_trip_type_arr}
                                        onPress={() => { this.selctBoatType(index) }}
                                    >
                                        <View>
                                            <Text style={styles.boat_year}>{Lang_chg.Year_txt[config.language]} - {item.manufacturing_year}</Text>
                                            <Text style={styles.boat_year}>{Lang_chg.Capacity_txt[config.language]} - {item.boat_capacity}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.boat_number}>{item.name}</Text>
                                            <Text style={styles.boat_id}>{item.registration_no}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                                :
                                <TouchableOpacity activeOpacity={9} style={styles.select_boat_main}>
                                    <View>
                                        <Text style={styles.boat_year}>{Lang_chg.data_not_found[config.language]}</Text>
                                    </View>
                                </TouchableOpacity>
                        }

                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.editModalvisibal}
                    // visible={true}

                    onRequestClose={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}
                >
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
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
                                    onPress={() => { this.setState({ editModalvisibal: !this.state.editModalvisibal }) }}
                                >
                                    <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.cancel[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent visible={this.state.modalVisible4}
                    onRequestClose={() => {
                        this.setState({ modalVisible4: !this.state.modalVisible4 })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible4: false }) }}>
                            <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Minimum_Hours_txt[config.language]}</Text>
                        <TouchableOpacity>
                            <Image resizeMode="contain" style={styles.popup_search_icon} source={require('./icons/search.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View>

                            <FlatList
                                data={this.state.hoursData}
                                renderItem={this.renderItemMinimum}
                                keyExtractor={(item, index) => index.toString()}
                                scrollEnabled={true}
                            />

                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent visible={this.state.modalVisible5}
                    onRequestClose={() => {
                        this.setState({ modalVisible5: !this.state.modalVisible5 })
                    }}>
                    <StatusBar barStyle='default' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
                    <View style={styles.notification_header}>
                        <TouchableOpacity style={styles.back_buttn_top} onPress={() => { this.setState({ modalVisible5: false }) }}>
                            <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.Notifications_title}>{Lang_chg.Ideal_Hours_txt[config.language]}</Text>
                        <TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, }}>
                        <View>
                            <FlatList
                                data={this.state.hoursData1}
                                renderItem={this.renderItemIdel}
                                keyExtractor={(item, index) => index.toString()}
                                scrollEnabled={true}
                            />

                        </View>
                    </View>
                </Modal>


                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.add_adver_txt[config.language]}</Text>
                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    <View style={{ marginTop: 20, }}>
                        <Text style={styles.upload_title}>{Lang_chg.Upload_pictures_txt[config.language]}</Text>
                        <Text style={styles.minimum_img}>{Lang_chg.Please_pictures_txt[config.language]}</Text>
                    </View>

                    <FlatList
                        data={this.state.show_img}
                        horizontal={true}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity style={{ height: 100, width: 100, margin: 10, borderRadius: 15, borderColor: '#d15400', borderWidth: 1 }} onPress={() => { (item.id == 0) ? this.setState({ img_type: index, editModalvisibal: true, }) : null }} activeOpacity={0.9}>
                                    {
                                        (item.id == 0) && <Image resizeMode="contain" style={styles.slide_plus} source={require('./icons/plus_new.png')} />
                                    }
                                    {
                                        (item.id >= 1 || item.id == 'local') && <Image resizeMode="contain" style={styles.Add_advertisment_show} source={{ uri: item.image }}></Image>
                                    }
                                    {
                                        (item.id == 'local') &&
                                        <TouchableOpacity activeOpacity={0.9} style={{ position: 'absolute', right: 0, right: -3, top: -3, }} onPress={() => { this._removeImg(item.id,index) }}>
                                            <Image resizeMode="contain" style={styles.cross_slider} source={require('./icons/cross_red.png')} />
                                        </TouchableOpacity>
                                    }
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(index) => { index.toString() }}
                    />



                    <View style={styles.main_login}>
                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.Enter_Title_Arabic_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ title_ar: txt }) }}
                                maxLength={50}
                                minLength={3}
                                value={this.state.title_ar}
                                keyboardType='default'
                            />
                        </View>
                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.Enter_Title_englis_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ title_eng: txt }) }}
                                maxLength={50}
                                minLength={3}
                                value={this.state.title_eng}
                                keyboardType='default'
                            />
                        </View>
                        <View style={styles.login_input}>
                            <Text style={{ width: '15%', textAlign: 'right' }}>+965</Text>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.contact_number_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                                maxLength={8}
                                minLength={8}
                                value={this.state.mobile}
                                keyboardType='numeric'
                            />
                        </View>


                        <View style={styles.select_trip}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '80%' }}><Text style={styles.select_trip_txt}>{(this.state.trip_type_name != '') ? this.state.trip_type_name : Lang_chg.select_trip_txt[config.language]}</Text></View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.select_trip}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible2: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '80%' }}><Text style={styles.select_trip_txt}>{(this.state.boat_name != '') ? this.state.boat_name : Lang_chg.Select_Boat_txt[config.language]}</Text></View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.max_people_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ no_of_people: txt }) }}
                                maxLength={3}
                                value={this.state.no_of_people}
                                keyboardType='default'
                            />
                        </View>

                        <View>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.props.navigation.navigate('Map_show') }}
                            >
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/address.png')}></Image>
                                </View>
                                <View style={{ width: '80%' }}><Text style={styles.select_trip_txt} numberOfLines={1}> {(this.state.location_address != '') ? this.state.location_address : Lang_chg.place_of_boat_txt[config.language]}</Text></View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity activeOpacity={0.9} style={[{ width: '100%', flexDirection: "row", alignItems: 'center', height: 50, marginBottom: 20, borderRadius: 10, borderColor: '#d15400', borderWidth: 1, paddingLeft: 10 }]} onPress={() => { this.setState({ modalVisible6: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.select_trip_txt}>{(this.state.selected_city != '') ? this.state.selected_city : Lang_chg.choose_city_txt[config.language]}</Text>
                                </View>
                                <View style={{ width: '10%', alignItems: 'center' }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#d15400' }} source={require('./icons/home_1.png')}></Image>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* <View style={styles.login_input_pass} >
                            <TextInput
                                style={[styles.txtinput, { height: 120, textAlignVertical: 'top', textAlign: 'right', width: '100%', fontSize: 16, }]}
                                onChangeText={this.handleTextChange}
                                multiline={true}
                                placeholder={Lang_chg.description_ar_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                         
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ discription_ar: txt }) }}
                                maxLength={250}
                                minLength={3}
                                value={this.state.discription_ar}
                                keyboardType='default'
                            />
                        </View> */}
                        <View style={styles.login_input1}>
                            <TextInput
                                style={[styles.txtinput, { height: 120, textAlignVertical: 'top', textAlign: 'right', width: '100%' }]}
                                multiline={true}
                                placeholder={Lang_chg.description_ar_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ discription_ar: txt }) }}
                                maxLength={250}
                                minLength={3}
                                value={this.state.discription_ar}
                                keyboardType='default'
                            />
                        </View>


                        <View style={styles.login_input1}>
                            <TextInput
                                style={[styles.txtinput, { height: 120, textAlignVertical: 'top', textAlign: 'right', width: '100%' }]}
                                multiline={true}
                                placeholder={Lang_chg.description_en_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ discription_en: txt }) }}
                                maxLength={250}
                                minLength={3}
                                value={this.state.discription_en}
                                keyboardType='default'
                            />
                        </View>


                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.Rental_Price_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ rental_price: txt }) }}
                                maxLength={8}
                                minLength={3}
                                value={this.state.rental_price}
                                keyboardType='decimal-pad'
                            />
                        </View>
                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.Extrea_per_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ extra_price: txt }) }}
                                maxLength={8}
                                minLength={3}
                                value={this.state.extra_price}
                                keyboardType='decimal-pad'
                            />
                        </View>


                        <View style={styles.select_trip}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible4: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '80%' }}><Text style={styles.select_trip_txt}>{(this.state.minimum_hours != '') ? this.state.minimum_hours : Lang_chg.Minimum_Hours_txt[config.language]}</Text></View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.select_trip}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={() => { this.setState({ modalVisible5: true }) }}>
                                <View style={{ width: '20%' }}>
                                    <Image style={styles.arrow_img} source={require('./icons/city_arrow.png')}></Image>
                                </View>
                                <View style={{ width: '80%' }}><Text style={styles.select_trip_txt}>{(this.state.idle_hours != '') ? this.state.idle_hours : Lang_chg.Ideal_Hours_txt[config.language]}</Text></View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.login_input}>
                            <TextInput
                                style={styles.enter_emaol_login}
                                onChangeText={this.handleTextChange}
                                placeholder={Lang_chg.discount_per_txt[config.language]}
                                placeholderTextColor="#b8b8b8"
                                returnKeyLabel='done'
                                returnKeyType='done'
                                autoCapitalize='none'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                onChangeText={(txt) => { this.setState({ discount: txt }) }}
                                maxLength={8}
                                minLength={3}
                                value={(this.state.discount!=0) && this.state.discount}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>

                    <View style={styles.login_btn1} >
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this._submitAdvertisement() }}>
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
    login_input1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    header_earnig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,

    },
    cityBackgroundColor: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#d15400',
    },
    cityBackgroundColor1: {
        backgroundColor: '#d15400',
        borderBottomWidth: 1,
        borderBottomColor: '#d15400',
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
    terms_detail: {
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'justify',
        fontFamily: 'Ubuntu-Regular',
    },
    upload_title: {
        textAlign: 'right',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 18,
        fontWeight: '800',
    },
    minimum_img: {
        textAlign: 'right',
        fontSize: 12,
        color: '#848484',
    },
    img_row: {
        flexDirection: 'row',
        marginTop: 20,
    },
    slide_plus: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 40,
    },
    box_slide: {
        borderWidth: 1,
        borderColor: '#d15400',
        height: 100,
        width: '30%',
        margin: '2%',
        borderRadius: 15,
    },
    Add_advertisment_show: {
        width: '100%',
        height: 98,
        borderRadius: 15,
        resizeMode: 'cover'
    },
    cross_slider: {
        width: 25,
        height: 25,
    },
    sign_logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    sign_top_logo: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    sign_up: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 25,
        color: '#d15400',
        marginTop: 5,
        fontWeight: 'bold',
    },
    main_login: {
        width: "100%",
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
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
        width: '85%',
        height: 50,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    login_input_pass: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    pass_login: {
        textAlign: 'right',
        paddingRight: 10,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular",
        width: '80%'
    },
    login_input_top: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '50%',
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#d15400',
        backgroundColor: '#fff',
        marginLeft: 17,
    },
    main_login_top: {
        width: '85%',
        flexDirection: 'row',
        marginTop: 30,
    },
    login_btn1: {
        backgroundColor: '#d15400',
        width: '90%',
        alignSelf: 'center',
        height: 60,
        borderRadius: 15,
        marginTop: 40,
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
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
    },
    back_buttn_top: {
        marginTop: 3,
    },
    hole_top_l1: {
        width: 30,
        height: 30,
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
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        paddingVertical: 10,
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
    arow_section: {
        width: '60%',
    },
    inputtoch: {
        flexDirection: 'row',
    },
    select_trip_box: {
        flexDirection: 'row',
        borderWidth: 1,
        width: '100%',
        borderColor: '#d15400',
        borderRadius: 15,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 14,
        paddingTop: 14,
        marginBottom: 20,

    },
    select_trip_txt: {
        textAlign: 'right',
        fontSize: 16,
        color: '#888',
    },
    arrow_img: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginTop: 5,
    },
    select_boat_main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '90%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 10,
    },
    boat_id: {
        color: '#b0afaf',
        fontSize: 14,
        fontFamily: "Ubuntu-Regular",
        fontWeight: 'bold',
    },
    boat_number: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 15,
        textAlign: 'right',
    },
    boat_year: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 16,
    },
    select_location: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        color: '#999',
    },
    time_row: {
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.2,
        borderColor: '#d15400',
        paddingTop: 15,
        paddingBottom: 15,
    },
    time_row1: {
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.2,
        borderColor: '#d15400',
        backgroundColor: '#d15400',
        paddingTop: 15,
        paddingBottom: 15,
    },

    edial_time: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 14,
    },

    selct_trip_type_arr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: '#fff',
        borderColor: '#d15400',
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 6
    },
    selct_trip_type_arr1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: '#d15400',
        borderColor: '#d15400',
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 6
    },
    select_boat1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: '#ccc',
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 6,
        width: '100%'
    },
    select_boat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 6,
        width: '100%'
    },
})