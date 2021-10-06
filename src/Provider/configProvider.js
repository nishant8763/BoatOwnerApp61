import { Platform } from "react-native";
import base64 from 'react-native-base64'
import { msgProvider, msgTitle, msgText } from './messageProvider';
import { Lang_chg } from './Language_provider'
import firebase from '../Config1';
import Firebase from 'firebase';

import { localStorage } from './localStorageProvider';
global.player_id_me1 = '123456';
global.currentLatlong = 'NA';
global.mapaddress = '';
global.maplat = '';
global.maplong = '';

const baseURL 	= 'https://myboatonline.com/app/webservice/';
//--------------------------- Config Provider Start -----------------------
class configProvider {
	notiCount = 0;
	//  baseURL 	= 'http://youngdecade.org/2021/MyBoat/webservice/';
	//  img_url 	= 'http://youngdecade.org/2021/MyBoat/webservice/images/200X200/';
	//  img_url1	= 'http://youngdecade.org/2021/MyBoat/webservice/images/400X400/';
	//  img_url2	= 'http://youngdecade.org/2021/MyBoat/webservice/images/700X700/';
	//  img_url3 	= 'http://youngdecade.org/2021/MyBoat/webservice/images/';

	baseURL 	=  baseURL;
	img_url 	=  baseURL+'images/200X200/';
	img_url1 	=  baseURL+'images/400X400/';
	img_url2 	=  baseURL+'images/700X700/';
	img_url3 	=  baseURL+'images/';
	// mapkey		= 'AIzaSyCiJFnU3Ci8q5zXSvX-c5C3NnTOd2hYrGE'
	mapkey		= 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg'
	onesignalappid = 'c4baf33f-e0bf-410c-8fd4-894b0ca2aa1a'

	language 	 = 0;
	player_id 	 = '123456';
	player_id_me = '123456';
	device_type  = Platform.OS;
	image_arr    = [];
	latitude     = '29.3117';
	longitude    = '47.4818';
	mapaddress = '';
    maplat = '';
    maplong = '';
	//  userauth = base64.encode('mario');
	//  passauth = base64.encode('carbonell')
	// mapkey='AIzaSyDByVmT5xkOoO28rsAbgTKG55mNTCgs3bs'


	headersapi = {
		'Authorization': 'Basic ' + base64.encode(base64.encode('mario') + ":" + base64.encode('carbonell')),
		Accept: 'application/json',
		'Content-Type': 'multipart/form-data',
		'Cache-Control': 'no-cache,no-store,must-revalidate',
		'Pragma': 'no-cache',
		'Expires': 0,
	}


	login_type = 'app';

	GetPlayeridfunctin = (player_id) => {
		player_id_me1 = player_id
	}



	checkUserDeactivate = async (navigation) => {
		msgProvider.toast('Your account deactivated', 'long')
		setTimeout(() => {
			this.AppLogout(navigation);
		}, 200);
		return false;
	}

	AppLogout = async (navigation) => {
		console.log('AppLogout');
		//----------------------- if get user login type -------------
		var userdata = await localStorage.getItemObject('user_arr');
		var password = await localStorage.getItemString('password');
		var email = await localStorage.getItemString('email');
		var remember_me = await localStorage.getItemString('remember_me');
		var language = await localStorage.getItemString('language');
		console.log(password);
		console.log(email);
		console.log(remember_me);
		console.log(language);

		if (userdata != null) {
			if (userdata.login_type == 0) {
				localStorage.clear();
				if (remember_me == 'yes') {
					localStorage.setItemString('password', password);
					localStorage.setItemString('email', email);
					localStorage.setItemString('remember_me', remember_me);
					localStorage.setItemString('language', language.toString());
				} else {
					localStorage.setItemString('password', password);
					localStorage.setItemString('email', email);
					localStorage.setItemString('language', language.toString());
				}
				var id='u_'+userdata.user_id;
				var queryOffinbox = firebase.database().ref('users/'+id+'/myInbox/');
				queryOffinbox.off();
				FirebaseInboxJson=[];
				count_inbox=0;
				navigation.navigate('Login');
			} else if (userdata.login_type == 1) {
				console.log('face boook login');
				var id='u_'+userdata.user_id;
				var queryOffinbox = firebase.database().ref('users/'+id+'/myInbox/');
				queryOffinbox.off();
				FirebaseInboxJson=[];
				count_inbox=0;
				LoginManager.logOut();
				localStorage.clear();

				navigation.navigate('Login')
			} else if (userdata.login_type == 2) {
				console.log('google login')
				try {
					await GoogleSignin.revokeAccess();
					await GoogleSignin.signOut();
				} catch (error) {
					alert(error);
				}
				var id='u_'+userdata.user_id;
				var queryOffinbox = firebase.database().ref('users/'+id+'/myInbox/');
				queryOffinbox.off();
				FirebaseInboxJson=[];
				count_inbox=0;
				localStorage.clear();
				navigation.navigate('Login')
			} else if (userdata.login_type == 5) {
				console.log('face boook login')
			}
		}
	}
};
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();





