import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Touchable, Image, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from "moment/moment";
import { Icon } from "@rneui/themed";
import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, getDocs, orderBy, limit } from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPXIggp5cT0D8wgYeudxFfbcsrbYYm7Ao",
  authDomain: "co2-app-789fa.firebaseapp.com",
  databaseURL: "https://co2-app-789fa-default-rtdb.firebaseio.com",
  projectId: "co2-app-789fa",
  storageBucket: "co2-app-789fa.appspot.com",
  messagingSenderId: "31306520989",
  appId: "1:31306520989:web:170c63f23171e799a5f774",
  measurementId: "G-71B79KBF6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home(props) {
    const [date, setDate] = useState(moment().utc(true));
    const [rooms, setRooms] = useState([]);
    const [outsideData, setOutsideData] = useState({});
    const [colors, setColors] = useState(['#77DD77', '#836953', '#89cff0', '#99c5c4', '#9adedb', '#aa9499', '#ff9899', '#ff694f', '#ca9bf7'])

    const navigateToDetail = (info) => {
        props.navigation.navigate("Detail", {
            info: info,
            outside: outsideData
        });
    }

    useEffect(() => {
        const callFirebase = async() => {
            const q = query(collection(db, "AirQuality"));

            const querySnapshot = await getDocs(q);
            var tempArray = []
            querySnapshot.forEach((doc) => {
                if(doc.id == "Outside")
                {
                    setOutsideData(doc.data());
                }
                else
                {
                    var tempDict = doc.data();
                    tempDict['name'] = doc.id;
                    tempArray.push(tempDict);
                }
            });
            setRooms(tempArray);
        }

        callFirebase();
    }, [])

    const refresh = async() => {
        const q = query(collection(db, "AirQuality"));

        const querySnapshot = await getDocs(q);
        var tempArray = []
        querySnapshot.forEach((doc) => {
            if(doc.id == "Outside")
            {
                setOutsideData(doc.data());
            }
            else
            {
                var tempDict = doc.data();
                tempDict['name'] = doc.id;
                tempArray.push(tempDict);
            }
        });
        setRooms(tempArray);
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#516372', 'transparent']}
                style={styles.background}
            >       
                <View style={styles.bubble}>
                    <View style={styles.innerTopBubble}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            {date.format("MMMM D, Y")}
                        </Text>
                    </View>
                    <View style={styles.innerBottomBubble}>
                        <View>
                            <Text
                                style={{
                                    fontSize: 30,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            >
                                {outsideData.temperature} &deg;C
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            color: 'white',
                            padding: hp(2),
                            letterSpacing: 2
                        }}
                    >
                        ROOMS
                    </Text>
                    <Icon
                            name='refresh-outline'
                            type='ionicon'
                            color='#fff'
                            size={hp(3)}
                            style={{
                                marginRight: hp(2)
                            }}
                            onPress={() => {
                                refresh();
                            }}
                        />
                </View>
                <ScrollView>
                {
                    rooms.map((el, ind) => (
                        <TouchableOpacity 
                            key={ind}
                            onPress={() => {
                                navigateToDetail(el);
                            }}
                            style={styles.roombubble}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.bubbleimage1, {
                                    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                                }]}>
                                    <Icon 
                                        name='stats-chart-outline'
                                        type='ionicon'
                                        color='#fff'
                                        size={hp(4)}
                                    />
                                </View>
                                <View style={{flexDirection: 'column', width: '50%'}}>
                                    <Text style={styles.roomtitle}>
                                        {el.name}
                                    </Text>
                                    <Text style={styles.roomdetail}>
                                        Air Quality: {el.aq}
                                    </Text>
                                    
                                </View>
                                <View style={{flexDirection: 'row', marginRight: hp(1)}}>
                                        <View style={
                                                el.quality_index < 20 ?
                                                    styles.roomstatusboxclean
                                                :
                                                el.quality_index < 40 ?
                                                    styles.roomstatusboxsensitive
                                                :
                                                    styles.roomstatusboxdirty
                                            }
                                        >
                                            <Text style={
                                                    el.quality_index < 20 ?
                                                        styles.roomstatustextclean
                                                    :
                                                    el.quality_index < 40 ?
                                                        styles.roomstatustextsensitive
                                                    :
                                                        styles.roomstatustextdirty
                                                }
                                            >
                                                {
                                                    el.quality_index < 20 ?
                                                    "CLEAN"
                                                    :
                                                    el.quality_index < 40 ?
                                                    "SENSITIVE"
                                                    :
                                                    "DIRTY"
                                                }
                                            </Text>
                                        </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
                </ScrollView>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1
    },
    bubble:{
        width: '92%',
        height: hp(15),
        backgroundColor: "#8694a0",
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: hp(2),
        justifyContent: 'space-between'
    },
    roombubble: {
        width: '92%',
        height: hp(10),
        backgroundColor: "white",
        borderRadius: hp(3),
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: hp(1.5)
    },
    innerBottomBubble: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bubbleimage1:{
        width: hp(8),
        height: hp(8),
        backgroundColor: "#ba9881",
        borderRadius: hp(3),
        alignItems: 'center',
        justifyContent: 'center'
    },
    bubbleimage2:{
        width: hp(8),
        height: hp(8),
        backgroundColor: "#d9c55f",
        borderRadius: hp(3),
        marginTop: hp(1),
        marginLeft: hp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    bubbleimage3:{
        width: hp(8),
        height: hp(8),
        backgroundColor: "#7fa4a3",
        borderRadius: hp(3),
        marginTop: hp(1),
        marginLeft: hp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    roomtitle:{
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1
    },
    roomdetail:{
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 14,
    },
    roomstatusboxclean:{
        width: hp(8),
        height: hp(3.5),
        backgroundColor: "#72bd6a",
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center'
    },
    roomstatustextclean:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    roomstatusboxsensitive:{
        width: hp(11),
        height: hp(3.5),
        backgroundColor: "#eca471",
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center'
    },
    roomstatustextsensitive:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    roomstatusboxdirty:{
        width: hp(8),
        height: hp(3.5),
        backgroundColor: "#ed7e7f",
        borderRadius: hp(3),
        justifyContent: 'center',
        alignItems: 'center'
    },
    roomstatustextdirty:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    }
})