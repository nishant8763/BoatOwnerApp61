import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import color1 from './Colors'
import { apifuntion } from './Provider/apiProvider';
import { config } from './Provider/configProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import HTMLView from 'react-native-htmlview';
import { Lang_chg } from './Provider/Language_provider'
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { localStorage } from './Provider/localStorageProvider';

export default class Terms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            player_id: '',
            HidePassword: false,
            pagename: this.props.route.params.contantpage,
            // pagename: 1,
            loading: false,
            isConnected: true,
            Termsdata: []
        }
    }

    backpress = () => {
        this.props.navigation.goBack();
    }
    Termsconditiondata = async (type) => {
        if (this.state.isConnected === true) {

            if(type==0){
                this.setState({ loading: true })
                var url = config.baseURL + 'get_all_content.php?user_id=0&user_type=2';
                console.log('url', url)
                fetch(url, {
                    method: 'GET',
                    headers: new Headers(config.headersapi),

                }).then((obj) => {
                    return obj.json();
                }).then((obj) => {
                    // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                    console.log(obj)
                    if (obj.success == 'true') {
                        this.setState({ loading: false, Termsdata: obj.content_arr });
                        localStorage.setItemObject('contantdata',obj.content_arr);
                    }
                    else {
                        this.setState({ loading: false, });
                        msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    console.log("-------- error ------- " + error);
                    this.setState({ loading: false });
                });
            }else{
                // this.setState({ loading: true })
                var url = config.baseURL + 'get_all_content.php?user_id=0&user_type=2';
                console.log('url', url)
                fetch(url, {
                    method: 'GET',
                    headers: new Headers(config.headersapi),

                }).then((obj) => {
                    return obj.json();
                }).then((obj) => {
                    // msgProvider.alert(msgTitle.response[config.language], JSON.stringify(obj), false);
                    console.log(obj)
                    if (obj.success == 'true') {
                        localStorage.setItemObject('contantdata',obj.content_arr);
                    }
                    else {
                        this.setState({ loading: false, });
                        msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    console.log("-------- error ------- " + error);
                    this.setState({ loading: false });
                });
            }
        }
        else {
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
    }

    componentDidMount() {
        this.setState({loading:true})
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });
        this.getTermFromLocal();
    }
    getTermFromLocal=async()=>{
       var content =  await localStorage.getItemObject('contantdata');
       if(content!=null && content!='NA'){
            this.setState({
                Termsdata:content,
                loading:false
            })
            this.Termsconditiondata(1)
       }else{
            this.Termsconditiondata(0)
       }
       console.log('content---',content);
    }
    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Loader loading={this.state.loading} />

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>

                    {this.state.pagename == 1 &&
                        <Text style={styles.earnig_title}>{Lang_chg.html_Privacy_Policy[config.language]}</Text>
                    }
                    {this.state.pagename == 0 &&
                        <Text style={styles.earnig_title}>{Lang_chg.text_About_Us[config.language]}</Text>
                    }
                    {this.state.pagename == 2 &&
                        <Text style={styles.earnig_title}>{Lang_chg.text_Terms_And_Conditions[config.language]}</Text>
                    }


                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.term_txt}>
                        {
                            this.state.Termsdata.map((item, index) => (
                                (item.content_type == this.state.pagename)
                                    ?
                                    <HTMLView
                                        value={item.content[config.language]}
                                        stylesheet={styles12}
                                    />
                                    :
                                    <Text> </Text>
                            ))
                        }
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles12 = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    button:
    {
        marginBottom: 13,
        borderRadius: 6,
        paddingVertical: 12,
        width: '50%',
        margin: 15,
        backgroundColor: '#fa5252'
    },
    textbutton: {
        borderBottomColor: '#f2f2f2'
        , borderBottomWidth: 1,
        paddingVertical: 16,
        width: '95%',
        alignSelf: 'center'
    },
    textfont: {
        fontSize: 13,
        paddingLeft: 10
    },
    p: {
        fontWeight: '300',
        color: 'black', // make links coloured pink
        // textAlign:'justify',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
    },

})
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
        fontWeight: 'bold',
    },
    terms_detail: {
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'justify',
        
    },


})