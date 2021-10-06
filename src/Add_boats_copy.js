import React, { Component } from 'react'
import { Text,View,SafeAreaView,StatusBar,TextInput,TouchableOpacity,Modal,StyleSheet,Image,ScrollView, } from 'react-native'
import color1 from './Colors'

const demodat=[1,2,3,4,5,6,7,8,9,];
const demodat2=[1,2,3,4,5,6,7,8,9,6,87,8,8,54,'tre',76,5465,456,3,6,7,8,45,];
export default class Add_boats_copy extends Component {
backpress=()=>{
        this.props.navigation.goBack();
}
state={
    countrydata:demodat2,
    modalVisible3:false,
}


    render() {
        return (
            
            <View style={{ flex: 1,height: '100%', backgroundColor:'#ffffff'}}>

<Modal animationType="slide" transparent visible={this.state.modalVisible3}
      onRequestClose={() => { console.log('Modal has been closed.');
          }}>
             <View style={styles.notification_header}>
               <TouchableOpacity style={styles.back_buttn_top} onPress={()=>{this.setState({modalVisible3:false})}}>
                    <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image>
               </TouchableOpacity>
                   <Text style={styles.Notifications_title}>Select Location</Text>
                   <TouchableOpacity>
                   <Image resizeMode="contain" style={styles.popup_search_icon} source={require('./icons/search.png')}></Image>
                   </TouchableOpacity>
            </View>  
             <View style={{ flex: 1, backgroundColor:'white',}}>
               <View style={styles.select_location}>
                   <TextInput placeholder="Choose Location" style={{textAlign:'right',paddingLeft:20,paddingRight:20,}}></TextInput>
                   <Image resizeMode="contain" style={{width:20,height:20,marginTop:12,marginLeft:10,}} source={require('./icons/search_home.png')}></Image>
               </View>
               <View style={styles.map_img}>
               <Image resizeMode="contain" source={require('./icons/map.png')}></Image>
               </View>
          </View>
        </Modal>

            <SafeAreaView style={{ flex: 0, backgroundColor:color1.theme_color }}/>
            <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
               networkActivityIndicatorVisible={true} />

            <View style={styles.add_boat_header}>
                <TouchableOpacity onPress={()=>{this.backpress()}}>
                <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.add_boat_copy_title}>
                    Add Boats
                </Text>
                <Text></Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>


            <View style={ styles.main_login}>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Boat name"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Boat number"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="boat register number"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Boat year"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Boat length"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Boat capacity "  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Cabins"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    <View style={ styles.login_input}>
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Toilet"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View>
                    {/* <View style={ styles.login_input}>
                    <Image resizeMode="contain" style={styles.add_boat_location} source={require('./icons/address.png')}></Image> 
                    <TextInput  
                        style={styles.enter_emaol_login}  
                        onChangeText={this.handleTextChange}  
                        placeholder="Location"  
                        placeholderTextColor="#b8b8b8"  
                        /> 
                    </View> */}

                <View style={ styles.select_trip}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.select_trip_box} onPress={()=>{this.setState({modalVisible3:true})}}>
                    <View style={{width:'20%'}}>
                    <Image style={styles.arrow_img} source={require('./icons/address.png')}></Image>
                    </View>
                    <View style={{width:'80%'}}><Text style={styles.select_trip_txt}>Location</Text></View>
                    </TouchableOpacity>
                </View>
                    </View>
                    <View style={ styles.login_btn1}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Select_boats_manage')}} activeOpacity={0.7}>
                            <Text style={styles.log_txt_btn}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
add_boat_header:{
flexDirection:'row',
justifyContent:'space-between',
paddingLeft:20,
paddingTop:10,
paddingBottom:10,
paddingRight:20,
},
select_back:{
    width:30,
    height:30,
    resizeMode:'contain',
},
add_boat_copy_title:{
fontSize:20,
fontFamily:"Ubuntu-Bold",
fontWeight:'bold',
},
main_login:{
    width:"90%",
    alignItems:'center',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    marginTop:30,
},
login_input:{
    flexDirection:'row',
    justifyContent:'flex-end',
    width:'100%',
    paddingLeft:20,
    paddingRight:20,
    borderWidth:1,
    borderRadius:15,
    borderColor:'#d15400',
    backgroundColor:'#fff',
    marginBottom:25,
 },
 enter_emaol_login:{
    textAlign:'right',
    paddingRight:10,
    paddingLeft:20,
    fontSize:16,
    fontFamily:"Ubuntu-Regular",
    width:'100%'
},
login_btn1:{
    backgroundColor:'#d15400',
    width:'90%',
    alignSelf:'center',
    height:60,
    borderRadius:15,
    marginTop:15,
    marginBottom:20,
},
log_txt_btn:{
    lineHeight:60,
    textAlign:'center',
    fontFamily:"Ubuntu-Bold",
    fontSize:19,
    color:'white'
},
add_boat_location:{
    width:20,
    height:20,
    marginTop:15,
},
arrow_img:{
    width:15,
    height:15,
    resizeMode:'contain',
    marginTop:5,
},
select_trip_box:{
    flexDirection:'row',
    borderWidth:1,
    width:'100%',
    borderColor:'#d15400',
    borderRadius:15,
    paddingRight:20,
    paddingLeft:20,
    paddingBottom:14,
    paddingTop:14,
    marginBottom:20,

},
select_trip_txt:{
    textAlign:'right',
    fontSize:16,
    color:'#888',
},
notification_header:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:25,
    paddingRight:25,
    backgroundColor:'#fff',
    paddingTop:20,
    paddingBottom:20,
},
back_buttn_top:{
    marginTop:3,
},
Notifications_title:{
    fontFamily:"Ubuntu-Regular",
    fontSize:20,
    color:'#000',
},
select_location:{
    flexDirection:'row',
    justifyContent:'flex-end',
    paddingLeft:20,
    paddingRight:20,
    borderBottomWidth:0.2,
    borderTopWidth:0.2,
    color:'#999',
},
hole_top_l1:{
    width:30,
    height:30,
},

})