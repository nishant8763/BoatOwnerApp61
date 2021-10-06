import React, { Component,createRef } from 'react'
import { Text, View, StatusBar, SafeAreaView, StyleSheet, TouchableOpacity, Image, Keyboard, ScrollView, FlatList } from 'react-native'
import color1 from './Colors'
import DatePicker from 'react-native-datepicker'
import { Lang_chg } from './Provider/Language_provider'
import { config } from './Provider/configProvider';
import { apifuntion } from './Provider/apiProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import DelayInput from "react-native-debounce-input";
const inputRef = createRef();
export default class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected             : true,
            loading                 : false,
            history_arr             : 'NA',
            show_hide_input_flag    : false,
            searchtext              : '',
            search_flag             : 'NA',
        }
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
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getHistoryData();
        });
    }
    componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

    _getHistoryData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "booking_history.php?user_id_post=" + user_id_post+"&searchtext="+this.state.searchtext+"&search_flag="+this.state.search_flag;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('history_arr', obj)
                    this.setState({ history_arr: obj.booking_arr })
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

   
    _searchAdver = (searchText) => {
        if (searchText.length > 0) {
            this.setState({
                searchtext : searchText,
                search_flag :"search"
            })
            this._getHistoryData();
        } else {
            this.setState({
                searchtext : '',
                search_flag : 'NA'
            })
            this._getHistoryData();
        }
    }
   
    _clearSearchData=()=>{
        this.setState({searchtext : '',search_flag : 'NA',show_hide_input_flag:!this.state.show_hide_input_flag})
        this._getHistoryData();
        this.textInput.clear();
    }


    _showHideInputBox=()=>{
        this.setState({
            show_hide_input_flag:!this.state.show_hide_input_flag,
        })
    }
    searchByDate=(date)=>{
        this.setState({
            date:date,
            searchtext:date,
            search_flag : 'by_date'
        })
        this._getHistoryData();
    }
    


    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />

                {
                    (this.state.show_hide_input_flag==false)?

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.txt_history[config.language]}</Text>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.7} onPress={()=>{this._showHideInputBox()}}>
                        <Image resizeMode="contain" style={{ width: 25,height: 25,resizeMode: 'contain',}} source={require('./icons/search_home.png')}></Image>
                    </TouchableOpacity>
                </View>
                :
                <View  style={styles.header_earnig}>
                    <TouchableOpacity activeOpacity={0.7} style={{width:'10%'}} onPress={()=>{this._clearSearchData()}}>
                        <Image resizeMode="contain" style={{width: 30,height: 30,resizeMode: 'contain',}} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <View style={{width:'85%',backgroundColor:'#ccc',borderRadius:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        {/* <TextInput 
                            style={{width:'85%',borderRadius:20,paddingLeft:10,height:40}}
                            placeholder="Search hare..."
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onChangeText={text=>this._searchData(text)}
                        /> */}
                        <DelayInput
                            // minLength={1}
                            inputRef={input => { this.textInput = input }}
                            onChangeText={text=>this._searchAdver(text)}
                            delayTimeout={1000}
                            style={{width:'85%',borderRadius:20,paddingLeft:10,height:40}}
                            placeholder={Lang_chg.txt_search_booking_no[config.language]}
                            placeholderTextColor="black"
                            onSubmitEditing={Keyboard.dismiss()}
                            value={this.state.searchtext}
                        />
                        <TouchableOpacity onPress={()=>{this._clearSearchData()}}>
                        <Image resizeMode="contain" style={{width:30,height:30,marginRight:10}} source={require('./icons/cross1.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                }

                <View style={styles.login_input_pass}>
                    <TouchableOpacity activeOpacity={.7}>
                        <Image style={{ marginTop: 20, width: 10, height: 15, esizeMode: 'contain', marginLeft: 50, }} source={require('./icons/city_arrow.png')}></Image>
                    </TouchableOpacity>
                    <DatePicker style={styles.pass_login}
                        style={{ width: '95%', textAlign: 'right', height: 45, marginTop: 5, }}
                        date={this.state.date}
                        confirmBtnText="Confirm"
                        placeholder={Lang_chg.txt_date[config.language]}
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateInput: {
                                borderColor: '#234456',
                                borderWidth: 0,
                                borderRadius: 4,
                                marginLeft: 36,
                                paddingLeft: 15,
                                alignItems: 'flex-end',
                            },
                        }}
                        onDateChange={(date) => {this.searchByDate(date)}}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.upcoming_main}>
                        {
                            (this.state.history_arr != 'NA')
                                ?
                                <FlatList
                                    data={this.state.history_arr}
                                    horizontal={false}

                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Boat_detail',{booking_id:item.booking_id}) }}>
                                                <View style={styles.upcoming_list}>
                                                    <View style={styles.upcoming_detail}>
                                                        <Text style={styles.box_id}>#{item.booking_no}</Text>
                                                        <Text style={styles.name_upcoming}>{item.user_name}</Text>
                                                        <Text style={styles.box_name}>{item.bussness_name}</Text>
                                                        <Text style={styles.cabin_upcoming}>{item.boat_name}</Text>
                                                        <Text style={styles.name_upcoming}>{item.time}, {item.date}</Text>
                                                        <Text style={styles.upcomming_price}>{Lang_chg.txt_KWD[config.language]}  {item.total_amt}</Text>

                                                        {
                                                            (item.booking_status == 2) && <Text style={styles.trip_completed}>{Lang_chg.txt_complete[config.language]}</Text>
                                                        }
                                                        {
                                                            (item.booking_status == 3) && <Text style={styles.trip_cancelled}>{Lang_chg.txt_cancel_by_u[config.language]}</Text>
                                                        }
                                                        {
                                                            (item.booking_status == 4) && <Text style={styles.trip_cancelled}>{Lang_chg.txt_cancel_by_o[config.language]}</Text>
                                                        }
                                                        <Text style={styles.upcoming_time}>{item.createtime}</Text>
                                                    </View>
                                                    <View style={styles.upcoming_right_list}>
                                                        {
                                                            (item.image == 'NA') && <Image style={styles.main_img_upcoming} source={require('./icons/error.png')}></Image>
                                                        }
                                                        {
                                                            (item.image != 'NA') && <Image style={styles.main_img_upcoming} source={{ uri: config.img_url2 + item.image }}></Image>
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                                :
                                <View style={[styles.upcoming_main,{alignItems:'center',justifyContent:'center',height:400}]}>
                                  <Image source={require('./icons/ic_notfound.png')} style={{height:'50%',width:'50%',resizeMode:'contain',tintColor:'#d15400',marginTop:-90}}/>
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
        paddingTop: 10,
        paddingBottom: 10,
        alignItems:'center'
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
    trip_cancelled: {
        color: 'red',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        textAlign: 'right',
    },
    trip_inprogress: {
        color: '#ff9100',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        textAlign: 'right',
    },
    trip_completed: {
        color: '#04bf2b',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        textAlign: 'right',
    },
    trip_confirmned: {
        color: '#e3eb07',
        fontSize: 14,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
        textAlign: 'right',
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
        textAlign:'left'
    },
    upcoming_main: {
        marginTop: 30,
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
        color: 'green',
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
        marginTop: 10,
        marginBottom: 10,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    login_email: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 15,
    },
    pass_login: {
        width: '90%',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        fontFamily: "Ubuntu-Regular"
    },
})