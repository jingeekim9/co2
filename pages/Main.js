import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Input } from '@rneui/themed';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main(props) {

   
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.upperContainer}>
                <Image
                source={require('../assets/logo.png')}
                style={{
                    width: hp(30),
                    height: hp(30)
                }}
                resizeMode={'contain'}
                >
                    
                </Image>
            </View>
            <View style={styles.bottomContainer}>
                <View>
                    <Text style={{
                        fontSize: hp(3),
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#343648'
                    }}>
                        Welcome to EnviroSense
                    </Text>
                </View>
                <View>
                    <Text style={{
                        fontSize: hp(2),
                        textAlign: 'center',
                        marginTop: hp(2),
                        color: '#717580'
                    }}>
                        Make Your Classroom Air Cleaner
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: hp(5),
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: wp(90),
                            backgroundColor: '#7493b3',
                            padding: hp(2),
                            borderRadius: hp(1)
                        }}
                        onPress={() => {
                            props.navigation.navigate("Home")
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: hp(5)
                            }}
                        >
                            Chadwick
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: wp(90),
                            backgroundColor: '#C6DCBA',
                            padding: hp(2),
                            borderRadius: hp(1),
                            marginTop: hp(2)
                        }}
                        onPress={() => {
                            props.navigation.navigate("HomeOther")
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: hp(5)
                            }}
                        >
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>
                   
            </View>
        </KeyboardAwareScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    upperContainer: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 2
    }
})