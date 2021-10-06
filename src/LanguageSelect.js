import React, { Component } from 'react'
import { TouchableOpacity, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { config } from './Provider/configProvider';
import { localStorage } from './Provider/localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';

import { Text, SafeAreaView, View, StyleSheet, StatusBar } from 'react-native'

export default class LanguageSelect extends Component {
    state = {
        rbtnenglish: 'checked',
        rbtnspanish: 'unchecked',
        rbtnpurtgal: 'unchecked'
    }
    componentDidMount() {

    }
    rbtpress = (num) => {
        if (num == '1') {
            this.setState({ rbtnenglish: 'checked' })
            this.setState({ rbtnspanish: 'unchecked' })
            this.setState({ rbtnpurtgal: 'unchecked' })
         } else if (num == '2') {
            this.setState({ rbtnenglish: 'unchecked' })
            this.setState({ rbtnspanish: 'checked' })
            this.setState({ rbtnpurtgal: 'unchecked' })
         } else if (num == '3') { 
            this.setState({ rbtnenglish: 'unchecked' })
            this.setState({ rbtnspanish: 'unchecked' })
            this.setState({ rbtnpurtgal:'checked' })
         }
       
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{}}>
                    <StatusBar
                        backgroundColor="#b3e6ff"
                        barStyle="dark-content"
                        hidden={false}
                        translucent={true}
                    />
                    <View style={{ paddingHorizontal: 40, paddingVertical: 150 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}> Select Language </Text>

                        <View style={styles.inputview}>
                            <RadioButton style={styles.inputviewtxt}
                                status={this.state.rbtnenglish}
                                color={"black"}
                                selectedColor={"red"}
                                onPress={() => { this.rbtpress('1') }} />
                            <Text style={styles.inputviewtxt}>English</Text>
                        </View>
                        <View style={styles.inputview}>
                        <RadioButton style={styles.inputviewtxt}
                                status={this.state.rbtnspanish}
                                color={"black"}
                                selectedColor={"red"}
                                onPress={() => { this.rbtpress('2') }} /> 
                            <Text style={styles.inputviewtxt}>Spanish</Text>
                        </View>
                        <View style={styles.inputview}>
                        <RadioButton style={styles.inputviewtxt}
                                status={this.state.rbtnpurtgal}
                                color={"black"}
                                selectedColor={"red"}
                                onPress={() => { this.rbtpress('3') }} /> 
                            <Text style={styles.inputviewtxt}>Purtgal</Text>
                        </View>
                    </View>


                </View>

                <View style={styles.nxtview
                }>

                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 50, backgroundColor: 'red' }}
                    onPress={()=>{this.props.navigation.navigate('Home')}}
                    >
                        <Text style={{ color: '#ffffff', fontSize: 15 }}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({

    container: {
        alignItems: 'center', justifyContent: 'center'
    },
    inputview: {
        flexDirection: 'row', alignItems: 'center', marginTop: 20, height: 50, borderRadius: 10, borderWidth: 2, borderColor: '#D3D3D3'
    },
    inputviewtxt: {
        paddingHorizontal: 10

    },

    nxtview: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: 'flex-end',
        marginBottom: 36
    }




});