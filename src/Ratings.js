import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';
import StarRating from 'react-native-star-rating';
const demodat = [1, 2, 3, 4, 5, 6, 7, 8, 9,];
export default class Ratings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            total_owner_amt: 0,
            isConnected: true,
            data1: demodat,
            rating_arr: 'NA',
            ratting_data:'NA',
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            //this._getUserDeatils();
            this._getRating();
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

    _getRating = async () => {
        if (this.state.isConnected === true) {
            this.setState({ loading: true })
            let result = await localStorage.getItemObject('user_arr')
            let user_id_post = 0;
            if (result != null) {
                user_id_post = result.user_id;
            }
            let url = config.baseURL + "ratingreviewList.php?user_id_post=" + user_id_post;
            console.log('url', url)
            apifuntion.getApi(url).then((obj) => {
                this.setState({ loading: false });
                return obj.json();
            }).then((obj) => {
                console.log(obj)
                //  alert(JSON.stringify(obj))
                if (obj.success == 'true') {
                    this.setState({
                        rating_arr: obj.rating_arr,
                        ratting_data:obj
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
                this.setState({ loading: false, datanotfond: Lang_chg.data_not_found[config.language] });
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        } else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>{Lang_chg.txt_rating[config.language]} </Text>
                    <Text></Text>
                </View>

                
                    {
                        this.state.rating_arr != 'NA' &&
                        <View style={styles.rating_banner}>
                            <View>
                                <Text style={styles.rating_total}>{this.state.ratting_data.avg_rating}</Text>
                                <View style={styles.rating_left}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={this.state.ratting_data.avg_rating}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.rating_1425}>({this.state.ratting_data.rating_count})</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.rating_right}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={5}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.total_ratin_txt}>{this.state.ratting_data.num_5}</Text>
                                </View>
                                <View style={styles.rating_right}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={4}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.total_ratin_txt}>{this.state.ratting_data.num_4}</Text>
                                </View>
                                <View style={styles.rating_right}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={3}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.total_ratin_txt}>{this.state.ratting_data.num_3}</Text>
                                </View>
                                <View style={styles.rating_right}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={2}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.total_ratin_txt}>{this.state.ratting_data.num_2}</Text>
                                </View>
                                <View style={styles.rating_right}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={require('./icons/star_unfill.png')}
                                        fullStar={require('./icons/starfill.png')}
                                        halfStar={require('./icons/half_star.png')}
                                        maxStars={5}
                                        rating={1}
                                        reversed={false}
                                        starSize={18}
                                    />
                                    <Text style={styles.total_ratin_txt}>{this.state.ratting_data.num_1}</Text>
                                </View>
                            </View>
                        </View>
                    }
              

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.rating_main_page}>
                        {
                            this.state.rating_arr != 'NA' &&
                            <FlatList
                                data={this.state.rating_arr}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                inverted={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View>
                                            <View style={styles.total_earnig_list}>
                                                <View style={styles.rating_main}>
                                                    <Text style={styles.left_time_sele}>{item.createtime}</Text>
                                                    <Text style={styles.rating_name}>{item.user_name}</Text>
                                                    <View style={styles.rating_people}>
                                                        <StarRating
                                                            disabled={false}
                                                            emptyStar={require('./icons/star_unfill.png')}
                                                            fullStar={require('./icons/starfill.png')}
                                                            halfStar={require('./icons/half_star.png')}
                                                            maxStars={5}
                                                            rating={item.rating}
                                                            reversed={false}
                                                            starSize={18}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.rating_txt_main}>{item.review}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.rating_right_sc}>
                                                {
                                                    (item.user_image == 'NA')
                                                        ?
                                                        <Image resizeMode="contain" style={styles.rewiew_people_img} source={require('./icons/error.png')}></Image>
                                                        :
                                                        <Image source={{ uri: config.img_url1+item.user_image }} resizeMode="contain" style={styles.rewiew_people_img} />
                                                }
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }}
                                keyExtractor={(index) => { index.toString() }}
                            />
                        }
                    </View>
                        {
                            this.state.rating_arr=='NA'&&
                            <View style={[styles.upcoming_main,{alignItems:'center',justifyContent:'center',height:500}]}>
                            <Image source={require('./icons/ic_notfound.png')} style={{height:'50%',width:'50%',resizeMode:'contain',tintColor:'#d15400'}}/>
                        </View>
                        }
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
        paddingLeft: 20,
        paddingRight: 20,
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
    rating_banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        borderBottomWidth: 8,
        borderColor: '#f8f8f8',
        paddingRight: 20,
        paddingLeft: 20,
    },
    rating_right: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    review_star: {
        width: 20,
        height: 20,
        marginLeft: 2,
        marginRight: 2,
    },
    review_star_left: {
        width: 16,
        height: 16,
        marginLeft: 2,
        marginRight: 2,
    },
    rating_left: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating_total: {
        textAlign: 'left',
        fontSize: 24,
        fontFamily: "Ubuntu-Regular",
        marginTop: 50,
    },

    rating_1425: {
        color: '#7f7f7f',
        letterSpacing: 1,
        marginLeft: 10,
        fontFamily: "Ubuntu-Regular",
    },
    total_ratin_txt: {
        color: '#7f7f7f',
        letterSpacing: 1,
        marginLeft: 10,
        fontFamily: "Ubuntu-Regular",
        fontSize: 18,
    },
    rating_people: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 3,
        marginTop: 3,
    },
    rating_status_star: {
        width: 18,
        height: 18,
        marginLeft: 2,
        marginRight: 2,
    },
    total_earnig_list: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
        borderColor: '#c2c2c2',
        paddingLeft: 20,
        paddingRight: 20,
    },
    rating_right_sc: {
        width: '20%',
        textAlign: 'center',
        alignItems: 'center',
    },
    rating_main: {
        width: '80%',
    },

    rating_name: {
        textAlign: 'right',
        fontFamily: "Ubuntu-Bold",
        fontSize: 14,
    },
    rewiew_people_img: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius:20,
        marginTop: 10,
    },
    rating_title_main: {
        color: '#727272',
    },
    rating_txt_main: {
        textAlign: 'right'
    },
    left_time_sele: {
        position: 'absolute',
        fontFamily: 'Ubuntu-Regular',
        color: '#727272',
        fontSize: 12,
    },
})