import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import color1 from './Colors'

export default class About extends Component {
    backpress = () => {
        this.props.navigation.goBack();
    }


    render() {
        return (
            <View style={{ flex: 1, height: '100%', backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: color1.theme_color }} />
                <StatusBar backgroundColor={color1.white_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={styles.header_earnig}>
                    <TouchableOpacity style={styles.home_serch} activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={styles.select_back} source={require('./icons/left_arrow.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.earnig_title}>About</Text>
                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.term_txt}>
                        <Text style={styles.terms_detail}>
                            Lorem Ipsum is simply dummy text of the printing
                            and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the
                            1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen
                            book. It has survived not only five centuries,
                            but also the leap into electronic typesetting,
                            remaining.Lorem Ipsum is simply dummy text of
                            the printing and typesetting industry. Lorem
                            Ipsum has been the industry's standard dummy
                            text ever since the 1500s, when an unknown
                            printer took a galley of type and scrambled
                            it to make a type specimen book. It has survived
                            not only five centuries, but also the leap into
                            electronic typesetting, remaining.Lorem Ipsum
                            is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been
                            the industry's standard dummy text ever
                            since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to
                            make a type specimen book. It has survived not
                            only five centuries, but also the leap into
                            electronic typesetting, remaining.Lorem Ipsum

                       </Text>
                    </View>
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

    },
    select_back: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    earnig_title: {
        fontSize: 20,
        fontFamily: "Ubuntu-Bold",
        fontWeight: 'bold',
    },
    terms_detail: {
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'justify',
        fontFamily: 'Ubuntu-Regular',
    },


})