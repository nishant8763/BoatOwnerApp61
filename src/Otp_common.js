import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Modal, ImageBackground, Alert, TextInput, BackHandler, ScrollView, Keyboard, TouchableOpacity, StatusBar } from 'react-native';


const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
const styletoast = {
  backgroundColor: 'black', color: '#FFFFFF'
}
export  class Otp_common extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisible1: false,
      timer: null,
      otp: '',
      minutes_Counter: '01',
      seconds_Counter: '59',
      startDisable: false,

    }
    

  }
  componentDidMount() {
    this.setState({modalVisible1:true})  
    this.onButtonStart();
  }
  componentWillUnmount() {
    
  }
  
  onButtonStart = () => {

    let timer = setInterval(() => {

      if (this.state.minutes_Counter == '00' && this.state.seconds_Counter == '01') {
        this.onButtonStop()
      }

      var num = (Number(this.state.seconds_Counter) - 1).toString(),
        count = this.state.minutes_Counter;


      if ((this.state.seconds_Counter) == '00') {
        count = (Number(this.state.minutes_Counter) - 1).toString();
        num = 59
      }
      if (count != -1) {
        this.setState({
          minutes_Counter: count.length == 1 ? '0' + count : count,
          seconds_Counter: num.length == 1 ? '0' + num : num
        });
      }
      else {
        this.onButtonStop()
      }

    }, 1000);

    this.setState({ timer });

    this.setState({ startDisable: true })
  }

  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({ startDisable: false })
  }

  Otpveryfication = () => {
    this.setState({   modalVisible1:false});
  
    return false;    this.onButtonStop();
      // clearInterval(this.state.timer);
      this.setState({
        loading: false, timer: null,
        minutes_Counter: '00', modalVisible1: false,
        seconds_Counter: '05', startDisable: false
      })
      this.onButtonStart()
    this.setState({ modalVisible1: true });
  }
  Resendotpbtn = () => {
    alert('minutes_Counter',this.state.minutes_Counter);
    // clearInterval(this.state.timer);
    this.setState({
      loading: true, timer: null,
      minutes_Counter: '04',
      seconds_Counter: '59', startDisable: false
    })

    //  this.otp.clear();
    // this.setState({ loading: false, otpcode: '' });
    // this.onButtonStart()
    // this.setState({ modalVisible1: true });
  }


  render() {
    console.log('cikasd')
    return (
      <View style={{ flex: 1 }}>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            this.setState({
              modalVisible: false, timer: null,
              minutes_Counter: '04',
              seconds_Counter: '59', startDisable: false
            }); clearInterval(this.state.timer)
          }}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000040', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            this.setState({
              modalVisible1: false, timer: null,
              minutes_Counter: '04',
              seconds_Counter: '59', startDisable: false
            }); clearInterval(this.state.timer);
          }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: screenWidth * 100 / 100, alignContent: 'center' }}>

              <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 17, paddingTop: 15, alignContent: 'center', alignItems: 'center', elevation: 5, borderRadius: 5, width: screenWidth * 85 / 100, }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, }}>Verification</Text>
                <Text style={{ fontFamily: 'Poppins-Light', color: 'greay', fontSize: 14, paddingTop: 13 }}>Otp verification code sent on{"\n"}+966-{this.state.Email}</Text>
                <TextInput
                  placeholder='OTP'
                  placeholderTextColor='#d1d1d1'
                  keyboardType='number-pad'
                  returnKeyLabel='done'
                  returnKeyType='done'
                  ref={(input) => { this.otp = input; }}
                  onSubmitEditing={() => { Keyboard.dismiss() }}
                  onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                  onChangeText={(txt) => { this.setState({ otp: txt }) }}
                  maxLength={4}
                  style={{ borderBottomColor: 'red', borderBottomWidth: 1, width: '95%', textAlign: 'center', fontSize: 15, fontFamily: 'Poppins-SemiBold' }}
                />
                {this.state.errorno == 2 &&
                  <Text style={{ color: 'red', fontFamily: 'Poppins-SemiBold', fontSize: 13, paddingTop: 5 }}>Please enter OTP</Text>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 10, paddingTop: 32 }}>

                
                  {this.state.startDisable == true && <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                    <View style={{ backgroundColor: 'red', width: 30, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.counterText}>{this.state.minutes_Counter}</Text>
                    </View>
                    <View style={{ marginLeft: 5, backgroundColor: 'red', width: 30, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.counterText}>{this.state.seconds_Counter}</Text>
                    </View>

                  </View>}
                  {this.state.startDisable == false && <TouchableOpacity onPress={() => { this.Resendotpbtn() }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: 'red', paddingRight: 15 }}>RESEND</Text>
                  </TouchableOpacity>}
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { this.Otpveryfication() }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color:'red' }}>VERIFY</Text>
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </TouchableOpacity>
        </Modal>
     
      </View>
    )
  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  inputcontainer: {
    backgroundColor: '#f2f7f2',
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 5
  },
  textfiledinput: {
    width: '100%',
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold'
  },
  counterText: {
    color: '#FFFFFF', textAlign: 'center',
    borderRadius: 5, alignSelf: 'center',
    alignContent: 'center',
    fontFamily: 'Poppins-SemiBold',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
