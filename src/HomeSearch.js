import React, { Component,createRef } from 'react'
import { Text, View, SafeAreaView, FlatList, StatusBar, StyleSheet, TouchableOpacity, Image, BackHandler, Alert,Keyboard } from 'react-native';
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import DelayInput from "react-native-debounce-input";
const inputRef = createRef();
export default class HomeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datanotfond: "",
            booking_arr: "NA",
            searchtext:'',
            loading:false,
            isConnected:true,
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            // this._getBookingData();
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
    
    backpress = () => {
        this.props.navigation.goBack();
    }
    
    _getSearchedData=async()=>{
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }

            let url = config.baseURL + "booking_search.php?user_id_post=" + user_id_post + "&searchtext="+this.state.searchtext;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Adverobj===', obj);
                    this.setState({ booking_arr: obj.booking_arr,datanotfond: "" });
                } else {
                    this.setState({ datanotfond: Lang_chg.data_not_found[config.language],booking_arr:'NA'})
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
        }else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    _searchBooking = (Text) =>{
        if (Text.length > 0) {
            this.setState({
                searchtext: Text,
            })
            this._getSearchedData();
        } else {
            this.setState({booking_arr:"NA"})
        }
    }
    _clearSearchData=()=>{
        this.setState({booking_arr: 'NA',searchtext: ''})
        this.textInput.clear();
    }
    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#fff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.txt_Home_searech1[config.language]}</Text>
                    <Text></Text>
                </View>


                <View style={{width:'90%',flexDirection:'row',backgroundColor:"#fff",paddingHorizontal:20,borderRadius:10,borderWidth:1,borderColor:'#d15400',alignItems:'center',alignSelf:"center",marginTop:20}}>
                <DelayInput
                    minLength={1}
                    style={[styles.search_location_input, { width: '95%',backgroundColor:'#fff',paddingHorizontal:10,height:50}]}
                    inputRef={input => { this.textInput = input }}
                    onChangeText={(txt) => { this._searchBooking(txt); }}
                    delayTimeout={800}
                    placeholder={Lang_chg.txt_Home_searech[config.language]}
                    placeholderTextColor="black"
                    onSubmitEditing={Keyboard.dismiss()}
                    value={this.state.searchtext}
                />
                <TouchableOpacity onPress={() => { this._clearSearchData() }} style={{width:'5%'}}>
                    <Image resizeMode="contain" style={{ width: 20, height: 20,tintColor:'#d15400' }} source={require('./icons/cross1.png')}></Image>
                </TouchableOpacity>
                </View>

            
                <View style={styles.upcoming_main}>
                    {
                        (this.state.booking_arr!='NA')
                        ?
                        <FlatList
                        data={this.state.booking_arr}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        inverted={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Boat_detail',{booking_id:item.booking_id}) }}>
                                    <View style={styles.upcoming_list}>
                                        <View style={styles.upcoming_detail}>
                                            <Text style={styles.box_id}>#{item.booking_no}</Text>
                                            <Text style={styles.name_upcoming}>{item.user_name}</Text>
                                            <Text style={styles.box_name}>{item.advertisement_name[config.language]}</Text>
                                            <Text style={styles.cabin_upcoming}>{item.boat_name}</Text>
                                            <Text style={styles.upcomy_date}>{item.time}, {item.date}</Text>
                                            <Text style={styles.upcomming_price}>{Lang_chg.txt_KWD[config.language]}  {item.total_amt}</Text>
                                            {
                                                  <Text style={styles.ongoing_progress}>{Lang_chg.txt_Confirmed[config.language]}</Text>
                                            }
                                            <Text style={styles.upcoming_time}>{item.createtime}</Text>
                                        </View>
                                        <View style={styles.upcoming_right_list}>
                                            {
                                                (item.image=='NA') && <Image style={styles.main_img_upcoming} source={require('./icons/error.png')}></Image>
                                            }
                                            {
                                                (item.image!='NA') && <Image style={styles.main_img_upcoming} source={{ uri: config.img_url2 + item.image }}></Image>
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(index) => { index.toString() }}
                    />
                    :
                    <View style={[styles.upcoming_main,{height:'70%',alignItems:'center',justifyContent:'center'}]}>
                        <Image source={require('./icons/ic_notfound.png')} style={{height:'50%',width:'50%',resizeMode:'contain',tintColor:'#d15400'}}/>
                    </View>
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
        alignItems:'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal:20
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
    home_header: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    home_notificatio_btn: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    home_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    search_location_input:{
        // marginLeft   :20,
        // paddingRight :20,
    },
    main_img_upcoming: {
        width: '100%',
        height: 120,
    },
    box_id: {
        fontFamily: "Ubuntu-Bold",
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    name_upcoming: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontFamily: 'Ubuntu-Regular',
    },
    box_name: {
        fontFamily: 'Ubuntu-Regular',
        textAlign: 'right',
    },
    cabin_upcoming: {
        textAlign: 'right',
        color: '#7c7c7c',
        fontFamily: "Ubuntu-LightItalic",
        fontStyle: 'italic',
    },
    upcomy_date: {
        textAlign: 'right',
        color: '#000',
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    upcomming_price: {
        color: '#d15400',
        fontFamily: "Ubuntu-Bold",
        fontSize: 18,
        textAlign: 'right',
    },
    upcoming_time: {
        color: '#888888',
        position: 'absolute',
        bottom: 0,
    },
    upcoming_main: {
        marginTop: 10,
        marginBottom: 150,
    },
    upcoming_detail: {
        width: '55%',
        paddingRight: 20,
    },
    upcoming_right_list: {
        width: '45%'
    },
    ongoing_progress: {
        textAlign: 'right',
        color: '#ea7f0c',
    },
    ongoing_confirmd: {
        textAlign: 'right',
        color: '#e3eb07',
    },
    upcoming_list: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        justifyContent: 'flex-start',
    },
    home_tab_btn: {
        flexDirection: 'row',
        marginTop: 5,
    },
    btn_left: {
        width: '50%',
        paddingBottom: 22,
        paddingTop: 20,
    },
    btn_right: {
        width: '50%',
        paddingBottom: 22,
        paddingTop: 20,
    },
    ongoing_btn: {

        fontFamily: "Ubuntu-Regular",
        backgroundColor: '#f3f3f3',
        paddingVertical: 14,
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        paddingTop: 15,
        paddingBottom: 15,
    },
    ongoing_btn_select: {
        backgroundColor: '#da5a04',
        paddingVertical: 14,
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF',
    },

})

