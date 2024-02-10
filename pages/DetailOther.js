import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from "moment/moment";
import { Icon } from "@rneui/themed";
import { ProgressCircle } from "react-native-svg-charts";
import { Text as SVGText, Defs, LinearGradient as SVGLinearGradient, Stop } from "react-native-svg";
import { SlideBarChart, SlideAreaChart, GradientProps } from "@connectedcars/react-native-slide-charts";
import { LineChart } from "react-native-chart-kit";
import { Button } from "@rneui/base";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, limit, orderBy, where, getDocs, query } from "firebase/firestore";
// import Material from 'react-native-vector-icons/Material';




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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default function DetailOther(props) {

    const { info, outside } = props.route.params;
    const [airQuality, setAirQuality] = useState(info.aq);
    const [predictedAirQuality, setPredictedAirQuality] = useState(0);
    const [selected, setSelected] = useState('CO2');
    const [curInfo, setCurInfo] = useState(info);

    const [predictions, setPredictions] = useState([]);
    const [refreshed, setRefreshed] = useState(false);

    const getHour = (minus = 0) => {
        var today = new Date();
        today.setHours(today.getHours() - minus);
        var hour = today.getHours();
        var ampm = hour >= 12 ? 'pm' : 'am'
        hour = hour % 12
        hour = hour ? hour : 12
        var strtime = hour + ' ' + ampm;
        return strtime
    }

    const refresh = async () => {
        const docRef = doc(db, "AirQuality", curInfo.name);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            var data = docSnap.data();
            data['name'] = docSnap.id;
            data['co2_arr'] = data['co2_arr'].map(value => isNaN(value) ? 0 : value);
            data['pm10_arr'] = data['pm10_arr'].map(value => isNaN(value) ? 0 : value);
            data['pm25_arr'] = data['pm25_arr'].map(value => isNaN(value) ? 0 : value);
            console.log(data)
            setCurInfo(data);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
        setRefreshed(!refreshed);
    }

    useEffect(() => {
        const getPredictions = async () => {
            const docRef1 = doc(db, "Predictions", curInfo.name);
            const docRef2 = doc(db, "AirQuality", "Outside");
            const docSnap1 = await getDoc(docRef1);
            const docSnap2 = await getDoc(docRef2);
            var tempArray = []
            var outsideArray = []

            if(docSnap1.exists())
            {
                var data1 = docSnap1.data();
                tempArray.push(data1);
            }
            if(docSnap2.exists())
            {
                var data2 = docSnap2.data();
                outsideArray.push(data2);
            }
            console.log(tempArray)
            console.log(outsideArray)

            if(tempArray.length > 0 && outsideArray.length > 0)
            {
                setPredictions(tempArray);
                const indoorAirQuality = tempArray[0]['pred_pm10'] * 0.3 + tempArray[0]['pred_pm25'] * 0.2;
                const outdoorAirQuality = outsideArray[0]['pred_pm10'] * 0.3 + outsideArray[0]['pred_pm25'] * 0.2;
    
                const newAirQuality = (indoorAirQuality - outdoorAirQuality) / (indoorAirQuality + outdoorAirQuality) * 50 + 50;
                setPredictedAirQuality(newAirQuality)
            }
            else
            {
                setPredictions([]);
                setPredictedAirQuality(0)
            }


        }
        getPredictions();
    }, [refreshed])

    const [data, setData] = useState([
        { x: 0, y: curInfo.co2_arr[0], week: getHour(6).toString() },
        { x: 1, y: curInfo.co2_arr[1], week: getHour(5).toString() },
        { x: 2, y: curInfo.co2_arr[2], week: getHour(4).toString() },
        { x: 3, y: curInfo.co2_arr[3], week: getHour(3).toString() },
        { x: 4, y: curInfo.co2_arr[4], week: getHour(2).toString() },
        { x: 5, y: curInfo.co2_arr[5], week: getHour(1).toString() },
        { x: 6, y: curInfo.co2_arr[6], week: getHour(0).toString() }]);
    const renderPredictedValues = () => {
        const variables = ["CO2", "PM 1", "PM 10", "PM 2.5"];

        return variables.map((variable, index) => (
            <Text key={index} style={styles.predictedValue}>
                {variable}
            </Text>
        ));
    };

    const Gradient = () => (
        <Defs key={'gradient'}>
            {
                airQuality >= 0.8 ?
                    <SVGLinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'100%'} y2={'0%'}>
                        <Stop offset={'0%'} stopColor={'#77b477'} stopOpacity={1} />
                        <Stop offset={'50%'} stopColor={'#eeba67'} stopOpacity={1} />
                        <Stop offset={'100%'} stopColor={'#f93b19'} stopOpacity={1} />
                    </SVGLinearGradient>
                    :
                    airQuality >= 0.4 ?
                        <SVGLinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'100%'} y2={'0%'}>
                            <Stop offset={'0%'} stopColor={'#77b477'} stopOpacity={1} />
                            <Stop offset={'100%'} stopColor={'#eeba67'} stopOpacity={1} />
                        </SVGLinearGradient>
                        :
                        <SVGLinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'100%'} y2={'0%'}>
                            <Stop offset={'0%'} stopColor={'#77b477'} stopOpacity={1} />
                            <Stop offset={'100%'} stopColor={'#77b477'} stopOpacity={1} />
                        </SVGLinearGradient>
            }

        </Defs>
    )

    const defaultAreaChartFillGradient = (props) => {
        return (
            <SVGLinearGradient x1='50%' y1='0%' x2='50%' y2='100%' {...props}>
                <Stop stopColor='white' offset='0%' stopOpacity='0.2' />
                <Stop stopColor='#637687' offset='100%' stopOpacity='0.2' />
            </SVGLinearGradient>
        )
    }


    return (
        <View style={styles.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#516372', 'transparent']}
                style={styles.background}
                locations={[0, 0.5]}
            >
                <View style={styles.topSection}>
                    <ProgressCircle
                        style={{ height: 200, marginTop: hp(2) }}
                        progress={airQuality / 100}
                        progressColor={'url(#gradient)'}
                        backgroundColor={'#8694a0'}
                        strokeWidth={10}
                        startAngle={-Math.PI / 2}
                        endAngle={Math.PI / 2}
                        svg={{
                            fill: 'url(#gradient)'
                        }}
                    >
                        <Gradient />
                        <SVGText
                            x={1}
                            y={-40}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={hp(3)}
                            fontWeight={'bold'}
                            stroke={'white'}
                            opacity={'1'}
                            strokeWidth={0.4}>
                            {airQuality}
                        </SVGText>
                        <SVGText
                            x={1}
                            y={-0}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={hp(2)}
                            fontWeight={'normal'}
                            stroke={'white'}
                            opacity={'1'}
                            strokeWidth={0.4}>
                            Air Quality
                        </SVGText>
                    </ProgressCircle>
                </View>
                <ScrollView style={styles.bottomSection}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: 'white',
                                padding: hp(2),
                                letterSpacing: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            INFORMATION: {curInfo.name}
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
                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <View style={styles.infobubble1}>
                            <View style={styles.bubbleimage1}>
                                <Icon
                                    name='barcode-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle}>
                                    PM10
                                </Text>
                                <Text style={styles.detailinfo}>
                                    {curInfo.pm10}ppm
                                </Text>
                            </View>

                        </View>
                        <View style={styles.infobubble1}>
                            <View style={styles.bubbleimage2}>
                                <Icon
                                    name='barcode-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle}>
                                    PM10 Outside
                                </Text>
                                <Text style={styles.detailinfo}>
                                    {outside.pm10}ppm
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <View style={styles.infobubble2}>
                            <View style={styles.bubbleimage3}>
                                <Icon
                                    name='cloud-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle1}>
                                    PM 2.5
                                </Text>
                                <Text style={styles.detailinfo1}>
                                    {curInfo.pm25}ppm
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infobubble2}>
                            <View style={styles.bubbleimage4}>
                                <Icon
                                    name='cloud-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle1}>
                                    PM 2.5 Outside
                                </Text>
                                <Text style={styles.detailinfo1}>
                                    {outside.aq}ppm
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <View style={styles.infobubble3}>
                            <View style={styles.bubbleimage5}>
                                <Icon
                                    name='air'
                                    type='entypo'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle2}>
                                    AQ Inside
                                </Text>
                                <Text style={styles.detailinfo2}>
                                    {curInfo.aq}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infobubble3}>
                            <View style={styles.bubbleimage6}>
                                <Icon
                                    name='air'
                                    type='entypo'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle2}>
                                    AQ Outside
                                </Text>
                                <Text style={styles.detailinfo2}>
                                    {outside.aq}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <View style={[styles.infobubble2, { width: '95%' }]}>
                            <View style={styles.bubbleimage3}>
                                <Icon
                                    name='leaf-outline'
                                    type='ionicon'
                                    color='#fff'
                                    size={hp(3)}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: hp(1) }}>
                                <Text style={styles.detailtitle1}>
                                    CO2
                                </Text>
                                <Text style={styles.detailinfo1}>
                                    {curInfo.co2}ppm
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text
                        style={{
                            fontSize: 15,
                            color: 'white',
                            padding: hp(2),
                            letterSpacing: 1,
                            fontWeight: 'bold'
                        }}
                    >
                        AI MODEL SUGGESTIONS
                    </Text>
                    <View
                        style={[
                            styles.window,
                            {
                                backgroundColor:
                                    predictedAirQuality > 50
                                        ? "rgba(255, 160, 160, 0.5)"
                                        : "rgba(173, 216, 230, 0.5)",
                            },
                        ]}
                    >
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: hp(1),
                                borderRadius: hp(2),
                                marginRight: hp(1)
                            }}
                        >
                            <Icon
                                name={
                                    predictedAirQuality > 50
                                        ? "window-open-variant"
                                        : "window-closed-variant"
                                }
                                type="material-community"
                                size={hp(4)}
                            />
                        </View>
                        <View style={styles.windowbox}>
                            <Text style={styles.windowtext}>
                                Air prediction in one hour
                            </Text>
                            <View
                            >
                                <Text
                                    style={{
                                        fontSize: hp(4),
                                        fontWeight: 'bold',
                                        color: 'white'
                                    }}
                                >
                                    {Math.round(predictedAirQuality)}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: hp(1.5),
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    {
                                        predictedAirQuality > 50 && airQuality > 50 ?
                                            'Keep Window Open' :
                                            predictedAirQuality > 50 && airQuality <= 50 ?
                                                'Open Window in 30 minutes' :
                                                predictedAirQuality <= 50 && airQuality <= 50 ?
                                                    'Keep Window Closed' :
                                                    'Close Window in 30 minutes'
                                    }
                                </Text>
                            </View>
                            {/* <View
                                style={{
                                    flexDirection: 'row'
                                }}
                            >
                                {renderPredictedValues()}
                            </View> */}
                        </View>

                    </View>


                    <Text
                        style={{
                            fontSize: 15,
                            color: 'white',
                            padding: hp(2),
                            letterSpacing: 1,
                            fontWeight: 'bold'
                        }}
                    >
                        STATS & PREDICTIONS
                    </Text>
                    <View style={{ flexDirection: 'row', marginLeft: hp(2) }}>
                        <TouchableOpacity style={{
                            backgroundColor: selected == "CO2" ? 'white' : '#7f8e99',
                            borderRadius: hp(2),
                            padding: hp(1),
                            marginLeft: hp(1),
                            width: wp(15)

                        }}
                            onPress={() => {
                                setSelected('CO2');
                                setData([
                                    { x: 0, y: curInfo.co2_arr[0], week: getHour(6).toString() },
                                    { x: 1, y: curInfo.co2_arr[1], week: getHour(5).toString() },
                                    { x: 2, y: curInfo.co2_arr[2], week: getHour(4).toString() },
                                    { x: 3, y: curInfo.co2_arr[3], week: getHour(3).toString() },
                                    { x: 4, y: curInfo.co2_arr[4], week: getHour(2).toString() },
                                    { x: 5, y: curInfo.co2_arr[5], week: getHour(1).toString() },
                                    { x: 6, y: curInfo.co2_arr[6], week: getHour(0).toString() }]);
                            }}
                        >
                            <Text style={{ color: selected == "CO2" ? '#6a737a' : 'white', textAlign: 'center' }}>CO2</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: selected == "PM10" ? 'white' : '#7f8e99',
                            borderRadius: hp(2),
                            padding: hp(1),
                            marginLeft: hp(1),
                            width: wp(15)

                        }}
                            onPress={() => {
                                setSelected('PM10');
                                setData([
                                    { x: 0, y: curInfo.pm10_arr[0], week: getHour(6).toString() },
                                    { x: 1, y: curInfo.pm10_arr[1], week: getHour(5).toString() },
                                    { x: 2, y: curInfo.pm10_arr[2], week: getHour(4).toString() },
                                    { x: 3, y: curInfo.pm10_arr[3], week: getHour(3).toString() },
                                    { x: 4, y: curInfo.pm10_arr[4], week: getHour(2).toString() },
                                    { x: 5, y: curInfo.pm10_arr[5], week: getHour(1).toString() },
                                    { x: 6, y: curInfo.pm10_arr[6], week: getHour(0).toString() }]);
                            }}
                        >
                            <Text style={{ color: selected == "PM10" ? '#6a737a' : 'white', textAlign: 'center' }}>PM10</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: selected == "PM25" ? 'white' : '#7f8e99',
                            borderRadius: hp(2),
                            padding: hp(1),
                            marginLeft: hp(1),
                            width: wp(15)

                        }}
                            onPress={() => {
                                setSelected('PM25');
                                setData([
                                    { x: 0, y: curInfo.pm25_arr[0], week: getHour(6).toString() },
                                    { x: 1, y: curInfo.pm25_arr[1], week: getHour(5).toString() },
                                    { x: 2, y: curInfo.pm25_arr[2], week: getHour(4).toString() },
                                    { x: 3, y: curInfo.pm25_arr[3], week: getHour(3).toString() },
                                    { x: 4, y: curInfo.pm25_arr[4], week: getHour(2).toString() },
                                    { x: 5, y: curInfo.pm25_arr[5], week: getHour(1).toString() },
                                    { x: 6, y: curInfo.pm25_arr[6], week: getHour(0).toString() }]);
                            }}
                        >
                            <Text style={{ color: selected == "PM25" ? '#6a737a' : 'white', textAlign: 'center' }}>PM25</Text>

                        </TouchableOpacity>
                    </View>
                    <LineChart
                        data={{
                        labels: data.map((el) => { return el.week }),
                        datasets: [
                            {
                            data: data.map((el) => { return el. y })
                            }
                        ]
                        }}
                        width={wp(100)} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: "#637687",
                        backgroundGradientFrom: "#637687",
                        backgroundGradientTo: "#637687",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                            marginBottom: hp(10)
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",   
                            stroke: "#637687"
                        }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                    <View
                        style={{
                            height: hp(10),
                            width: wp(100)
                        }}
                    >

                    </View>
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
    topSection: {
        height: hp(20)
    },
    bottomSection: {
        height: hp(80),
        backgroundColor: '#637687',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    infobubble1: {
        width: '45%',
        backgroundColor: "#e7eefa",
        borderRadius: hp(2),
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        // padding: hp(1),
        // paddingRight: hp(2),
        marginBottom: hp(2),
        flexDirection: 'row',
        padding: hp(1),
        alignItems: 'center'
    },
    infobubble2: {
        width: '45%',
        backgroundColor: "#e9f8e7",
        borderRadius: hp(2),
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        // padding: hp(1),
        // paddingRight: hp(2),
        marginBottom: hp(2),
        flexDirection: 'row',
        padding: hp(1),
        alignItems: 'center'
    },
    infobubble3: {
        width: '45%',
        backgroundColor: "#f4effe",
        borderRadius: hp(2),
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        // padding: hp(1),
        // paddingRight: hp(2),
        marginBottom: hp(2),
        flexDirection: 'row',
        padding: hp(1),
        alignItems: 'center'
    },
    bubbleimage1: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#5b99e8",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    bubbleimage2: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#5b99e8",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    bubbleimage3: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#70bc68",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    bubbleimage4: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#70bc68",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    bubbleimage5: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#8f6fd2",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    bubbleimage6: {
        width: hp(5),
        height: hp(5),
        backgroundColor: "#8f6fd2",
        borderRadius: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailtitle: {
        color: '#63676d',
        fontWeight: 'bold',
        fontSize: hp(1.5),
    },
    detailinfo: {
        color: '#161718',
        // fontWeight: 'bold',
        fontSize: hp(1.8),
    },
    detailtitle1: {
        color: '#63676d',
        fontWeight: 'bold',
        fontSize: hp(1.5),
    },
    detailinfo1: {
        color: '#161718',
        // fontWeight: 'bold',
        fontSize: hp(1.8),
    },
    detailtitle2: {
        color: '#63676d',
        fontWeight: 'bold',
        fontSize: hp(1.5),
    },
    detailinfo2: {
        color: '#161718',
        // fontWeight: 'bold',
        fontSize: hp(1.8),
    },
    window: {
        width: wp(95),
        borderRadius: hp(2),
        fontWeight: 'bold',
        marginBottom: hp(2),
        padding: hp(1),
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    windowbox: {
        borderRadius: hp(2),
        fontWeight: 'bold',
        padding: hp(1),
        justifyContent: 'center'
    },
    windowtext: {
        fontWeight: "bold",
        fontSize: hp(2),
        color: 'white',
    },
    predictedValue: {
        color: 'black',
        fontSize: hp(1.5),
        marginBottom: hp(0.5),
    },


})