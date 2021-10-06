import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager, } from 'react-native-fbsdk';
import { localStorage } from './localStorageProvider';
import { config } from './configProvider';
import { apifuntion } from './apiProvider';
import { msgProvider, msgTitle, msgText } from './messageProvider';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';

class SocialLoginProvider extends Component {
    constructor(props) {
        super(props);
        GoogleSignin.configure({
            // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // scopes: ['https://www.googleapis.com/auth/user.birthday.read'],
            webClientId: '805280162872-n1t8b4l4ufbrvsg5asvhalb3tie7m3hu.apps.googleusercontent.com',
        });
    }
 
 
    btnGoogleSignin = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn();
            //this.callsocailweb(userInfo, 'google')
            console.log('userinfo', userInfo)
            console.log('userinfoemail', userInfo.user.email)
            //this.fetchsocialdata(userInfo,'google')
            //this.setState({ userInfo: userInfo });
            return userInfo.user;
        } catch (error) {
            // alert('Message'+error.message)
            console.log('Message', error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Cancelled the Login Flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
            } else {
                console.log('Some Other Error Happened', error);
            }
        }
    }
    // facebook login end start
 
    btnSocialLoginGoogle = async (navigation) => {
        var result = await this.btnGoogleSignin();
        console.log('result89', result);
        
        var data = new FormData();
        data.append("social_type", 'google');
        data.append("social_id", result.id);
        data.append("social_email", result.email);
        data.append("device_type", 'android');
        data.append("player_id", '123456');
        //console.log('navigation', navigation);
        //navigation.navigate('Home');
        var obj = await this._callSignup1(data);
        console.log('obj84',obj);
            if(obj.success=="true"){
                if(obj.user_exist=='yes'){
                    this.Call_Social_Normal_signup(obj.user_details,navigation);
                    
                }else{
                    if(result.email=='NA' || result.email=='' || result.email==undefined || result.email.length<=0){
                        alert('NO EMAIL');
                    }else{
                        alert('have email');
                    }
                }
            }else{
                alert(obj.msg[0]);
            }
    }
 
    _callSignup1 = async (data) => {
        let url = config.baseURL +'social_login.php';
        try {
            var res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: data,
            });
            if (res.status != 200) {
                throw 400;
            }
            const obj = await res.json();
            return obj;
        } catch (error) {
            return error;
        }
    }
 
    Call_Social_Normal_signup = (user_details,navigation)=>{
    
        console.log('Call_Social_Normal_signup coming_from=', navigation);
        console.log('Call_Social_Normal_signup user_details=', user_details);   
        
        var user_id             =   user_details.user_id;
        var login_type          =   user_details.login_type;
        var email               =   user_details.email;
        var otp_code            =   user_details.otp;
        var otp_verify          =   user_details.otp_verify;
        var profile_complete    =   user_details.profile_complete;
        var signup_step         =   user_details.signup_step;
        var active_flag         =   user_details.active_flag;
        var delete_flag         =   user_details.delete_flag;
        var otp_auto_fill_status         =   user_details.otp_auto_fill_status;
        // localStorage.setItem('user_id', user_id);
        // localStorage.setItem('user_email', email);   
        // localStorage.setItem('user_id', user_id);
        // localStorage.setItem('otp', otp_code);
        // localStorage.setItem('user_sign_type', login_type);
        navigation.navigate('Home');
    }
}
 
export const SocialLogin = new SocialLoginProvider();
