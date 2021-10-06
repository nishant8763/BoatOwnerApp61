import React, { Component } from 'react'
import { Text, View, StatusBar, SafeAreaView, StyleSheet, Image, ScrollView, } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import StarRating from 'react-native-star-rating';
import Footer from './Provider/Footer';
import { firebaseprovider}  from './Provider/FirebaseProvider';
import firebase from './Config1';
export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email           :   '',
            profile_image   :   '',
            user_name       :   '',
            bussiness_name  :   '',
            city_name       :   '',
            mobile_no       :   '',
            bussiness_location :   '',
            loading         :   false,
            total_owner_amt :   0,
            isConnected     :true,
            avg_rating:0,
            rating_count:0,

        }
    }

    componentDidMount(){
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getUserDeatils();
            this.getMyInboxAllData1();
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

    getMyInboxAllData1 = async () => {
        console.log('getMyInboxAllData');
        userdata = await localStorage.getItemObject('user_arr')
        //------------------------------ firbase code get user inbox ---------------
        if (userdata != null) {
            // alert("himanshu");
            var id = 'u_' + userdata.user_id;
            if (inboxoffcheck > 0) {
                console.log('getMyInboxAllDatainboxoffcheck');
                var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
                queryOffinbox.off('child_added');
                queryOffinbox.off('child_changed');
            }

            var queryUpdatemyinbox = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinbox.on('child_changed', (data) => {
                console.log('inboxkachildchange', data.toJSON())

                firebaseprovider.firebaseUserGetInboxCount()
                 setTimeout(()=>{ this.setState({countinbox:count_inbox}) }, 2000);

                //  this.getalldata(currentLatlong)
            })
            var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinboxadded.on('child_added', (data) => {
                console.log('inboxkaadded', data.toJSON())
                firebaseprovider.firebaseUserGetInboxCount()
                setTimeout(()=>{ this.setState({countinbox:count_inbox}) }, 2000);

                // firebaseprovider.firebaseUserGetInboxCount();
            })

        }
    }

    _getUserDeatils = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "getUserDetails.php?user_id_post=" + user_id_post;
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
                        avg_rating      :obj.avg_rating,
                        rating_count    :obj.rating_count,
                    })
                    localStorage.setItemObject('user_arr', obj.user_details);
                    this._setUserProfile();
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

    _setUserProfile = async () => {
        let result = await localStorage.getItemObject('user_arr');
        console.log('result', result);
        if (result != null) {
            let profile_img = '';
            if (result.image != 'NA') {
                profile_img = config.img_url1 + result.image;
            }
            let address = '';
            if(result.address!='NA' && result.address!=null){
                address = result.address;
            }
            this.setState({
                user_name       :    result.name,
                email           :    result.email,
                bussiness_name  :    result.bussness_name,
                city_name       :    result.city_name,
                mobile_no       :    result.mobile,
                profile_image         :    profile_img,
                bussiness_location    :    address,
                total_owner_amt    :    result.total_owner_amt,
            })
        }
    }
    
    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                    <Loader loading={this.state.loading} />
                <View style={styles.profile_header}>
                    {/* <TouchableOpacity style={styles.profile_header_left} activeOpacity={0.7}>
                   <Image resizeMode="contain" style={styles.header_left} source={require('./icons/edit.png')}></Image>
                   </TouchableOpacity> */}
                    <TouchableOpacity style={styles.profile_header_edit} activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Setting') }}>
                        <Image resizeMode="contain" style={styles.header_left} source={require('./icons/settings.png')}></Image>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={styles.profile_main_img}>
                        {
                            (this.state.profile_image == '' || this.state.profile_image == 'NA' || this.state.profile_image == null)
                                ?
                                <Image resizeMode="cover" style={styles.profile_img} source={require('./icons/error.png')}></Image>
                                :
                                <Image source={{ uri: this.state.profile_image }} resizeMode="cover" style={styles.profile_img} />
                        }
                      
                        <Text style={styles.profile_user_name}>
                            {(this.state.user_name)?this.state.user_name:""}
                        </Text>
                        <Text style={styles.profile_lastname}>
                           {(this.state.bussiness_name!='' && this.state.bussiness_name!='NA')?this.state.bussiness_name:""}
                       </Text>
                        <Text style={styles.profle_location}>
                        {(this.state.city_name)?this.state.city_name:""}
                </Text>
                    </View>

                    <View style={styles.profile_box}>
                        <View style={styles.profile_left}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Total_earnings') }}>
                                <Text style={styles.profile_price}>{Lang_chg.txt_KWD[config.language]}  {this.state.total_owner_amt}</Text>
                                <Text style={styles.profile_earnig}>{Lang_chg.pro_earning_txt[config.language]}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile_main}></View>
                        <TouchableOpacity style={styles.profile_right} activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Ratings') }}>
                            <View>
                                <View style={styles.rewie_detail}>
                                <Text style={styles.boat_Detail}>({this.state.rating_count})</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStar={require('./icons/star_unfill.png')}
                                    fullStar={require('./icons/starfill.png')}
                                    halfStar={require('./icons/half_star.png')}
                                    maxStars={5}
                                    rating={this.state.avg_rating}
                                    reversed={false}
                                    starSize={18}
                                />
                                   
                                </View>
                                <Text style={styles.profile_right_side}>{Lang_chg.pro_Review_txt[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profile_btn}>
                        <TouchableOpacity style={styles.profile_manage_box} onPress={() => { this.props.navigation.navigate('Select_boats_manage') }} activeOpacity={0.9}>
                            <Text style={styles.profile_manege}>{Lang_chg.pro_manage_boat_txt[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profile_manage_box} activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Widro') }}>
                            <Text style={styles.profile_manege}>{Lang_chg.pro_statement[config.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profile_manage_box} activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('History') }}>
                            <Text style={styles.profile_manege}>{Lang_chg.pro_History_txt[config.language]}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.profile_email}>
                        <Text style={styles.profile_eamil1}>
                        {(this.state.email!='' && this.state.email!='NA')?this.state.email:""}
                    </Text>
                        <Text style={styles.profile_eamil1}>
                        {(this.state.mobile_no!='' && this.state.mobile_no!='NA')?this.state.mobile_no:""}
                    </Text>
                        <View style={styles.profile_address}>
                            <Image style={styles.profile_Addre_img} source={require('./icons/address.png')}></Image>
                            <Text style={styles.profile_address_main}>{(this.state.bussiness_location!='' && this.state.bussiness_location!='NA')?this.state.bussiness_location:""}</Text>
                        </View>
                    </View> */}

                </ScrollView>
                <Footer
                    activepage='Profile'
                    usertype={1}
                    footerpage={[
                        { name: 'Home', countshow: false, image: require('./icons/home.png'), activeimage: require('./icons/home_active.png') },
                        { name: 'Manage_o', countshow: false, image: require('./icons/manage.png'), activeimage: require('./icons/manage_active.png') },
                        { name: 'Inbox', countshow: true, image: (count_inbox<=0)?require('./icons/chat1.png'):require('./icons/chat.png'), activeimage:(count_inbox<=0)? require('./icons/deactive_caht.png'):require('./icons/chat_active.png') },
                        { name: 'Calender', countshow: true, image: require('./icons/calender1.png'), activeimage: require('./icons/calender.png') },
                        { name: 'Profile', countshow: false, image: require('./icons/profile.png'), activeimage: require('./icons/profile_active.png') },
                    ]}
                    navigation={this.props.navigation}
                    imagestyle1={{ width: 25, height: 25, backgroundColor: '#fff', countcolor: 'white', countbackground: 'black' }}
                    count_inbox={count_inbox}
                />

            </View>
        )
    }
}


const styles = StyleSheet.create({
    profile_header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    header_left: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    profile_header_left: {
        marginRight: 20,
    },
    profile_img: {
        width: 140,
        height: 140,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius:80
    },
    profile_user_name: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profile_lastname: {
        textAlign: 'center',
        fontSize: 16,
    },
    profle_location: {
        textAlign: 'center',
        fontFamily: "Ubuntu-Regular",
        fontStyle: 'italic',
        color: '#7c7c7c',
    },
    rewie_detail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 5,
    },
    star_boat: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginLeft: 2,
        marginTop: 1,
    },
    profile_box: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    profile_left: {
        width: '45%',
        backgroundColor: '#d6681e',
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,

    },
    profile_right: {
        width: '100%',
        backgroundColor: '#d6681e',
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
    },
    profile_main: {
        width: '10%',
    },
    profile_price: {
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    profile_earnig: {
        textAlign: 'center',
        color: '#fff',
    },
    profile_right_side: {
        textAlign: 'center',
    },
    boat_Detail: {
        color: '#FFF',
    },
    profile_right_side: {
        color: '#fff',
        textAlign: 'center',
    },
    profile_btn: {
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
    },
    profile_manage_box: {
        borderWidth: 2,
        borderColor: '#d6681e',
        width: '92%',
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 15,
        marginTop: 20,
        alignSelf: 'center',
    },
    profile_manege: {
        textAlign: 'center',
        color: '#d6681e',
        fontSize: 20,
    },
    profile_eamil1: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontSize: 18,
        letterSpacing: 1,
        fontFamily: "Ubuntu-Regular",
        marginTop: 8,
    },
    profile_email: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
    },
    profile_address: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    profile_Addre_img: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    profile_address_main: {
        fontSize: 18,
        fontFamily: 'Ubuntu-Regular',
        color: '#7c7c7c',
    },
})