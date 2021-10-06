import React, { Component } from 'react'
import { Text, View,SafeAreaView,StatusBar,StyleSheet,TouchableOpacity,Image, } from 'react-native';
import color1 from './Colors'

export default class Upcoming_blank extends Component {
    render() {
        return (
            <View style={{ flex: 1,height: '100%', backgroundColor:'#ffffff'}}>
            <SafeAreaView style={{ flex: 0, backgroundColor:color1.theme_color }}/>
            <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                networkActivityIndicatorVisible={true} />

            <View style={styles.home_header}>
                        <TouchableOpacity activeOpacity={0.7}>
                        <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/notification.png')}></Image>
                        </TouchableOpacity>
                        <Text style={styles.home_title}>Home</Text>
                        <TouchableOpacity style={styles.home_serch} activeOpacity={0.7}>
                        <Image resizeMode="contain" style={styles.home_notificatio_btn} source={require('./icons/search_home.png')}></Image>
                        </TouchableOpacity>
            </View>

            <View style={styles.upcomint_blank}>
            <TouchableOpacity style={styles.home_serch} activeOpacity={0.7}>
            <Image resizeMode="contain" style={{height:130,width:130,}} source={require('./icons/ucoming.png')}></Image>
            </TouchableOpacity>
            </View>

            </View>
        )
    }
}



const styles = StyleSheet.create({

    home_header:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:20,
    paddingRight:20,
    marginTop:20,
    },
    home_notificatio_btn:{
        width:25,
        height:25,
        resizeMode:'contain',
    },
    home_title:{
        fontSize:20,
        fontFamily:"Ubuntu-Bold",
        fontWeight:'bold',
    },
    upcomint_blank:{
        alignItems: 'center',
        alignSelf:'center',
        justifyContent:'center',
       height:'100%',
    },
    
    })
    
    