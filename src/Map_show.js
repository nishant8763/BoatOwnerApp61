import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
// import {localimag,Currentltlg,Lang_chg} from './utilslib/Utils';
import color from './Colors';
import { config } from './Provider/configProvider';
import {Currentltlg} from './Provider/Curentlatlong';
import { Lang_chg } from './Provider/Language_provider'
import Icon2 from 'react-native-vector-icons/Entypo';
import { localStorage } from './Provider/localStorageProvider';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Loader from './Loader';
global.pagecommingcount = 0;
global.searchbyinput    = 0;
global.searchbyinputtxt    = '';
export default class Mapprovider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pagecomingcount : 0,
            mapmodal:true,
            modalVisible1: false,
            latitude: config.latitude,
            longitude: config.longitude,
            latitude1: config.latitude,
            longitude2: config.longitude,
            latdelta: '0.0922',
            longdelta: '0.0421',
            isConnected: true,
            addressbar: false,
            addressbar2: false,
            addressselected : 'Search',
            addressselected1 : 'Search',
            input_search : config.mapaddress,
            username: '',
            address: '',
        };
        pagecommingcount = 0;
    }

    componentDidMount(){
        if(config.maplat!='NA' && config.maplat!=null && config.maplat !=''){
            this.setState({
                latitude          : parseFloat(config.maplat),
                longitude         : parseFloat(config.maplong),
                latitude1         : parseFloat(config.maplat),
                longitude1        : parseFloat(config.maplong),
                addressselected   : config.mapaddress,
                addressselected1  : config.mapaddress,
            })
        }else{
            this.getcurrentlatlogn();
        }
    }

    getcurrentlatlogn = async () => {
        let data      =  await Currentltlg.requestLocation()
        let latitude  =  data.coords.latitude;
        let longitude =  data.coords.longitude;
        // alert();
        if (this.props.address_arr != 'NA') {
            this.setState({ latitude: latitude, longitude: longitude })
        }
        else {
            this.setState({ latitude: latitude, longitude: longitude })
        }

    }

    setMapRef = (map) => {
        this.map = map;
    }
    getCoordinates = (region) => {
        return ({
            latitude    : parseFloat(this.state.latitude),
            longitude   : parseFloat(this.state.longitude),
            latitudeDelta : parseFloat(this.state.latdelta),
            longitudeDelta : parseFloat(this.state.longdelta),
        }
        );
    }

    getadddressfromlatlong = (event) => {
        if(pagecommingcount>0){
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

            .then((response) => response.json())
            .then((resp) => {
                let responseJson = resp.results[0]
                console.log('responseJson11',responseJson);
                let city = '';
                let administrative_area_level_1 = '';
                for (let i = 0; i < responseJson.address_components.length; i++) {
                    if (responseJson.address_components[i].types[0] == "locality") {
                        city = responseJson.address_components[i].long_name
                        break;
                    }
                    else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
                        city = responseJson.address_components[i].long_name
                    }

                }
                for (let j = 0; j < responseJson.address_components.length; j++) {
                    if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
                        administrative_area_level_1 = responseJson.address_components[j].long_name
                    }

                }
                let details = responseJson
               
                let data2
                if(searchbyinput==1){
                    data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': searchbyinputtxt, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
                    
                    this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(searchbyinputtxt)
                    this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: searchbyinputtxt})
                }else{
                    this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                    
                    data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }

                    this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address})

                    this._setMapLocation(data2);
                }
                searchbyinput = 0;
                // return this.props.locationget(data2);
            })
        }
        pagecommingcount = 1;
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    _btnSubmitData = () => {
        if(this.state.addressselected=='' ||this.state.addressselected==null){
            config.mapaddress = '';
            config.maplat     = '';
            config.maplong    = '';
        }else{
            config.mapaddress = this.state.addressselected1;
            config.maplat     = this.state.latitude1;
            config.maplong    = this.state.longitude1;
        }
        this.backpress();
    }
    
    _setMapLocation=(data)=>{
        this.setState({
            latitude1         : parseFloat(data.latitude),
            longitude1        : parseFloat(data.longitude),
            latitude          : parseFloat(data.latitude),
            longitude         : parseFloat(data.longitude),
            addressselected1  : data.address,
            addressselected   : data.address,
        })
    }

    render() {
        return (
                <View style={styles.container}>
                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', paddingTop: 10, }}>
                        <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={() => { this.backpress() }}>
                            <View style={{ width: '100%', alignSelf: 'center' }}>
                                <Image source={require('./icons/left_arrow.png')} style={{ alignSelf: 'center', width: 20, height: 20, resizeMode: 'contain' }} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ paddingVertical: 15, width: '60%' }}>
                            <Text style={{ color: 'black', fontFamily: 'Ubuntu-Light', fontSize: 17, textAlign: 'center' }}>{Lang_chg.txt_select_address[config.language]}</Text>
                        </View>
                        <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={this._btnSubmitData}>
                            <View style={{ width: '100%', alignSelf: 'center' }} >
                                <Text style={{ color: 'black', fontFamily: 'Ubuntu-Light', fontSize: 13, textAlign: 'center' }}>{Lang_chg.Done[config.language]}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 1 }}>
                        <MapView
                            followsUserLocation={true}
                            style={{ flex: 1 }}
                            region={
                                this.getCoordinates(this)
                            }
                            zoomEnabled={true}
                            provider={PROVIDER_GOOGLE}
                            minZoomLevel={2}
                             
                            rotateEnabled={true}
                            
                            pitchEnabled={true}
                            showsUserLocation={false}
                            userLocationPriority='high'
                            moveOnMarkerPress={true}
                            showsMyLocationButton={false}
                            showsScale={true} // also this is not working
                            showsCompass={true} // and this is not working
                            showsPointsOfInterest={true} // this is not working either
                            showsBuildings={true} // and finally, this isn't working either
                            onMapReady={this.onMapReady}
                            onRegionChangeComplete={(event) => { this.getadddressfromlatlong(event) }}
                            draggable
                            ref={this.setMapRef}
                        >
                            <Marker.Animated
                                coordinate={{
                                    latitude: parseFloat(this.state.latitude),
                                    longitude: parseFloat(this.state.longitude),
                                    latitudeDelta: parseFloat(this.state.latdelta),
                                    longitudeDelta: parseFloat(this.state.longdelta),
                                }}
                                isPreselected={true}
                                onDragEnd={(e) => { console.log("dragEnd", (e.nativeEvent.coordinate)) }}
                                draggable
                                title={this.state.username != null ? this.state.username : 'Guest user'}
                                description={'Your are here location'}

                            >
                                <Image  source={require('./icons/location1.png')} style={{ height: 30, width: 30, resizeMode: 'contain', }} />
                            </Marker.Animated>
                        </MapView>
                        <View style={{ position: 'absolute', width: '100%', top: 20 }}>
                            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                                <GooglePlacesAutocomplete
                                    placeholder= {(this.state.input_search)?this.state.input_search:Lang_chg.txt_search_location[config.language]}
                                    minLength={1} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='auto' // true/false/undefined
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    // disableScroll={true}
                                    isRowScrollable={true}
                                    ref={(instance) => { this.GooglePlacesRef = instance }}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={(data, details = null) => {
                                        let responseJson = details
                                        let city = '';
                                        let administrative_area_level_1 = '';
                                        for (let i = 0; i < responseJson.address_components.length; i++) {
                                            if (responseJson.address_components[i].types[0] == "locality") {
                                                city = responseJson.address_components[i].long_name
                                                break;
                                            }
                                            else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
                                                city = responseJson.address_components[i].long_name
                                            }

                                        }
                                        for (let j = 0; j < responseJson.address_components.length; j++) {
                                            if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
                                                administrative_area_level_1 = responseJson.address_components[j].long_name
                                            }

                                        }

                                        let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
                                        searchbyinputtxt = details.formatted_address;
                                        searchbyinput = 1;
                                      this._setMapLocation(data2);
                                        // this.setState({  latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, addressselected: details.formatted_address })
                                        // return this.props.locationget(data2);
                                       
                                    }}
                                    // getDefaultValue={() => {
                                    //   return  mapaddress!='NA'?mapaddress.address:'' // text input default value
                                    // }}
                                    
                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg',
                                        language: 'en', // language of the results
                                        //   types: '(cities)',  default: 'geocode'
                                    }}
                                    styles={{
                                        textInputContainer: {
                                            backgroundColor: 'white',
                                            marginTop: 10,
                                            alignSelf: 'center',
                                            height: 42,
                                            alignItems: 'flex-end',
                                            borderRadius: 50
                                        },
                                        textInput: {
                                            marginLeft: 7,
                                            marginRight: 10,
                                            textAlign: 'left',
                                            fontFamily: 'Ubuntu-Bold',
                                            height: 37,
                                            borderRadius: 10,
                                            color: '#5d5d5d',
                                            fontSize: 16,
                                        },
                                        predefinedPlacesDescription: {
                                           // color: color.staus_color,
                                        },
                                        description: {
                                            fontFamily: 'Ubuntu-Bold',
                                        },
                                        container: {
                                            borderRadius: 10
                                        },
                                        poweredContainer: {
                                           display:"none"
                                        },
                                        listView: {
                                            backgroundColor: '#FFFFFF',
                                            marginTop: 30, 
                                            borderRadius: 15, 
                                            borderWidth: 1, 
                                            boderColor: 'black'
                                        }
                                    }}
                                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                    currentLocationLabel="Current location"
                                    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food',
                                    }}
                                    filterReverseGeocodingByTypes={[
                                        'locality',
                                        'administrative_area_level_3',
                                        'postal_code',
                                        'sublocality',
                                        'country']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    //   predefinedPlaces={[homePlace, workPlace]}
                                    debounce={100}
                                    renderRightButton={() => (<TouchableOpacity style={{ alignSelf: 'center', paddingRight: 10 }} onPress={() => { 
                                        this.GooglePlacesRef.setAddressText("");
                                        this.setState({ addressselected:'',input_search:Lang_chg.txt_search_location[config.language]}) }}>
                                        <Icon2 name='circle-with-cross' size={25} color='#d15400' style={{ alignSelf: 'center' }} />
                                    </TouchableOpacity>)}
                                //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                                />
                            </View>
                        </View>
                    </View>
                </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    button: {
        backgroundColor: '#00a1e4',
        width: 180,
        borderRadius: 45,
        paddingVertical: 10
    },
    searchbutton: {
        backgroundColor: '#00a1e4',

        borderRadius: 45,
        paddingVertical: 11,
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
        color: '#FFFFFF',
        position: "absolute", bottom: 10, width: '80%',
        alignSelf: 'center'
    },
    searchbar: {
        flexDirection: "row",
        width: '80%',
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        marginRight: 10,
        elevation: 10,
        borderRadius: 15,
        alignSelf: 'center',
        shadowOffset: {
            height: 7,
            width: 0
        },
        shadowColor: "rgba(0,0,0,1)",
        shadowOpacity: 0.49,
        shadowRadius: 5,
    }
})
