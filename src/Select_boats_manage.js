import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, Image, Alert, Modal, TouchableOpacity } from 'react-native'
import color1 from './Colors'
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import { mediaprovider } from './Provider/mediaProvider';
import { inOut } from 'react-native/Libraries/Animated/src/Easing';

export default class Select_boats_manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // advertisement_id: this.props.route.params.advertisement_id,
            isConnected: true,
            loading: false,
            boat_arr: 'NA',
            editModalvisibal: false,
            action_id: 0,
            data_not_found: ''
        }

    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this._getBoatData();
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

    _getBoatData = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "boat_list.php?user_id_post=" + user_id_post;
            console.log('url--', url);
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('Boat_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    console.log('Boat_arr123', obj)
                    if (obj.boat_arr != 'NA') {
                        this.setState({ boat_arr: obj.boat_arr, data_not_found: '', editModalvisibal: false });
                    } else {
                        this.setState({ boat_arr: obj.boat_arr, data_not_found: Lang_chg.data_not_found[config.language], editModalvisibal: false });
                    }
                } else {
                    this.setState({ boat_arr: 'NA', data_not_found: Lang_chg.data_not_found[config.language], editModalvisibal: false });
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

    _editDelete = (boat_id) => {
        this.setState({
            action_id: boat_id,
            editModalvisibal: true,
        })

    }
    // var i = location_arr.findIndex(x => x.user_id == user_id_post);
    _deleteBoat = (boat_id) => {

        Alert.alert(Lang_chg.Confirm[config.language], Lang_chg.boat_delete_confir[config.language], [
            {
                text: Lang_chg.cancel[config.language],
                onPress: () => { console.log('nothing') },
                style: "cancel"
            },
            { text: Lang_chg.Yes[config.language], onPress: () => { this._btnDeleteBoat(boat_id) } }
        ], { cancelable: false });
    }

    _btnEditBoat = () => {

        this.setState({
            editModalvisibal: false,
        });
        this.props.navigation.navigate('Edit_boat', {
            boat_id: this.state.action_id,
        });
    }

    _btnDeleteBoat = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "boat_delete.php?user_id_post=" + user_id_post + "&boat_id=" + this.state.action_id;
            console.log('url--', url);
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log('Boat_arr', obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this._getBoatData()
                } else {
                    if (obj.account_active_status == "deactivate") {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    this.setState({ editModalvisibal: false });
                }
            }).catch((error) => {
                console.log("-------- error ------- " + error);
                this.setState({ loading: false, editModalvisibal: false });
                //msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }
    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff' }}>
                <Loader loading={this.state.loading} />
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.editModalvisibal}
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
                                    onPress={() => { this._btnDeleteBoat() }}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>{Lang_chg.delete_txt[config.language]}</Text>
                                </TouchableOpacity>
                                <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: 2, marginTop: 10 }}></View>
                                <TouchableOpacity
                                    onPress={() => { this._btnEditBoat() }}
                                >
                                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>{Lang_chg.Edit_txt[config.language]}</Text>
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
                <View style={styles.manage_boat_header}>
                    <TouchableOpacity onPress={() => { this.backpress() }} activeOpacity={0.9}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.select_boat_title}>{Lang_chg.Manage_Your_Boat_txt[config.language]}</Text>
                    <TouchableOpacity style={styles.select_Add_top} activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Add_boats', { back_page_name: 'Select_boats_manage' }) }}>
                        <Text style={styles.add_title}>{Lang_chg.Add_txt[config.language]}</Text>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.boat_arr != 'NA') ?
                        this.state.boat_arr.map((item, index) => (
                            <View style={styles.boat_number}>

                                <View style={styles.boat_detail}>
                                    <Text numberOfLines={1} style={styles.boat_right_number}>{item.name}</Text>
                                    <Text numberOfLines={1} style={styles.boat_capicity}>{Lang_chg.Boat_number[config.language]}({item.boat_number})</Text>
                                </View>

                                <View style={styles.boat_right}>
                                    <Text style={[styles.boat_year, { textAlign: 'right' }]} numberOfLines={1}>{Lang_chg.Year_txt[config.language]} - {item.manufacturing_year}</Text>
                                    <Text numberOfLines={1} style={{ color: '#999', textAlign: 'right' }}>{item.registration_no}</Text>
                                </View>

                                <View style={styles.boat_left}>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this._editDelete(item.boat_id) }}>
                                        <Image resizeMode="contain" style={{ tintColor: '#000', height: 30, width: 30 }} source={require('./icons/dot.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                        :
                        <View style={[styles.upcoming_main, { alignItems: 'center', justifyContent: 'center', height: 500 }]}>
                            <Image source={require('./icons/ic_notfound.png')} style={{ height: '50%', width: '50%', resizeMode: 'contain', tintColor: '#d15400' }} />
                        </View>
                }
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
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    select_boat_title: {
        fontSize: 18,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    select_Add_top: {
        backgroundColor: '#d15400',
        width: 50,
        borderRadius: 10,
    },
    add_title: {
        color: '#fff',
        textAlign: 'center',
        paddingBottom: 5,
        paddingTop: 5,
    },
    boat_right_number: {
        fontSize: 16,
        fontFamily: 'Ubuntu-Bold',
        fontWeight: 'bold',
    },
    boat_cross: {
        width: 20,
        height: 20,
        marginTop: 5,
        resizeMode: 'contain',
    },
    boat_number: {
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'

    },
    boat_left: {
        width: '10%',
    },
    boat_detail: {
        width: '50%',
        marginLeft: 10
    },
    boat_right: {
        width: '50%',
    },

})