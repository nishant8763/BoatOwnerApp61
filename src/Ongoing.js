import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity,StatusBar, Image, FlatList, ScrollView,SafeAreaView} from 'react-native'
import color1 from './Colors'


const demodat=[1,2,3,4,5,6,7,8,9,];

export default class Ongoing extends Component {
state={
    data1:demodat
}
backpress=()=>{
    this.props.navigation.goBack();
}

    render() {
        return (
            <View style={{ flex: 1,height: '100%', backgroundColor:'#ffffff',}}>
            <SafeAreaView style={{ flex: 0, backgroundColor:color1.theme_color }}/>
           <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
               networkActivityIndicatorVisible={true} />

               

<ScrollView showsVerticalScrollIndicator={false}>

               <View style={styles.upcoming_main}>
                    <FlatList
                          data={this.state.data1}
                          horizontal={false}
                          
                          showsHorizontalScrollIndicator={false}
                          inverted={false}
                          renderItem={({item,index})=>{
                              return(
                                  
                                 <View>
                                      <View style={styles.upcoming_list}>
                                      <View style={styles.upcoming_detail}>
                                         <Text  style={styles.box_id}>#78790767896890</Text>
                                         <Text style={styles.name_upcoming}>Peter John</Text>
                                         <Text  style={styles.box_name}>Miami Power Boat</Text>
                                         <Text  style={styles.cabin_upcoming}>Cabin Cruise Boat</Text>
                                         <Text  style={styles.upcomy_date}>10AM, 10/10/2021</Text>
                                         <Text style={styles.upcomming_price}>KWD 100</Text>
                                         <Text style={styles.ongoing_progress}>Inprogress</Text>
                                         <Text  style={styles.upcoming_time}>2m ago</Text>
                                     </View>
                                    <View style={styles.upcoming_right_list}>
                                    <Image style={styles.main_img_upcoming}  source={require('./icons/tour.png')}></Image> 
                                    </View>
                                  </View>
                                  <View style={styles.upcoming_list}>
                                      <View style={styles.upcoming_detail}>
                                         <Text  style={styles.box_id}>#78790767896890</Text>
                                         <Text style={styles.name_upcoming}>Peter John</Text>
                                         <Text  style={styles.box_name}>Miami Power Boat</Text>
                                         <Text  style={styles.cabin_upcoming}>Cabin Cruise Boat</Text>
                                         <Text  style={styles.upcomy_date}>10AM, 10/10/2021</Text>
                                         <Text style={styles.upcomming_price}>KWD 100</Text>
                                         <Text style={styles.ongoing_progress}>Inprogress</Text>
                                         <Text  style={styles.upcoming_time}>2m ago</Text>
                                     </View>
                                    <View style={styles.upcoming_right_list}>
                                    <Image style={styles.main_img_upcoming}  source={require('./icons/home_country.png')}></Image> 
                                    </View>
                                  </View>
                                 </View>
                              )
                          }}
                          keyExtractor={(index)=>{index.toString()}}
                        />
                </View>




                
                </ScrollView>
               
            </View>
        )
    }
}



const styles = StyleSheet.create({

    upcoming_list:{
    flexDirection:'row',
    width:'100%',
    paddingLeft:20,
    paddingRight:20,
    marginBottom:20,
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    paddingBottom:10,
    justifyContent:'flex-start',
    },
    main_img_upcoming:{
        width:'100%',
        height:120,
    },
    box_id:{
fontFamily:"Ubuntu-Bold",
fontSize:17,
fontWeight:'bold',
textAlign:'right',
},
name_upcoming:{
    textAlign:'right',
    color:'#7c7c7c',
    fontFamily:'Ubuntu-Regular',
},
box_name:{
    fontFamily:'Ubuntu-Regular',
    textAlign:'right',
},
cabin_upcoming:{
    textAlign:'right',
    color:'#7c7c7c',
    fontFamily:"Ubuntu-LightItalic", 
    fontStyle:'italic',
},
upcomy_date:{
    textAlign:'right',
    color:'#000',
    fontFamily:"Ubuntu-Bold", 
    fontWeight:'bold',
},
upcomming_price:{
    color:'#d15400',
    fontFamily:"Ubuntu-Bold",
    fontSize:18,
    textAlign:'right',
},
upcoming_time:{
color:'#888888',
position:'absolute',
bottom:0,
},
upcoming_main:{
marginTop:30,
},
upcoming_detail:{
width:'55%',
paddingRight:20,
},
upcoming_right_list:{
    width:'45%'
},
ongoing_progress:{
    textAlign:'right',
    color:'#ea7f0c',
},
login_email:{
    width:20,
    height:20,
    resizeMode:'contain',
    marginTop:15,
},

})