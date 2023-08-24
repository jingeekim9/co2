import {React, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Input } from '@rneui/themed';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default function Login(props) {

    
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [loading, setLoading ] = useState(false);

    
    const logInWithEmailAndPassword = async() => {
        setErrorEmail("");
        setErrorPassword("");
       if(email == "")
        {
            setErrorEmail("Please enter an email.");
            return;
        }
        else if(password == "")
        {
            setErrorPassword("Please enter a password.");
            return;
        }
        
        

        try {
            setLoading(true);
            const res = await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            props.navigation.reset({
                routes: [{name: 'Home'}]
            })
        }
        catch (err) {
            console.error(err.code);
            console.log(email)
            console.log(password)
            if(err.code == 'auth/invalid-email'){
                Toast.show({
                    type: 'error',
                    text1: 'Please input a valid email.'
                })
            }
            else if(err.code == 'auth/wrong-password') {
                Toast.show({
                    type: 'error', 
                    text1: 'Wrong password.'
                })
            }
            else if(err.code == 'auth/user-not-found') {
                Toast.show({
                    type: 'error',
                    text1: 'No account with this email.'
                })
            }
            setLoading(false);
        }
    }
    return (
        <View style={styles.container}>
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
                        marginTop: hp(5)
                    }}
                >
                    <Input
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            height: hp(8),
                            backgroundColor: '#f6f6f6',
                            borderRadius: 10,
                            padding: hp(2),
                            width: wp(90),
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                        placeholder="Email"
                        onChangeText={(e) => { setEmail(e) }}
                        autoCapitalize='none'
                        autoComplete='off'
                        errorMessage={errorEmail}
                    />
                    <Input
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            height: hp(8),
                            backgroundColor: '#f6f6f6',
                            borderRadius: 10,
                            padding: hp(2),
                            width: wp(90),
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                        placeholder="Password"
                        onChangeText={(e) => { setPassword(e) }}
                        secureTextEntry={true}
                        errorMessage={errorPassword}
                    />
                </View>
                <View
                    style={{marginTop: hp(2)}}
                >
                    <TouchableOpacity
                    style={{
                        height: hp(8),
                        backgroundColor: '#0718c4',
                        borderRadius: 10,
                        padding: hp(2),
                        width: wp(90),
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        logInWithEmailAndPassword();
                    }}
                    >
                        {
                            loading ?
                            <ActivityIndicator color="white" />
                            :
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: hp(2),
                                    fontWeight: 'bold'
                                }}
                            >
                                Login
                            </Text>
                        }
                    </TouchableOpacity>
                </View>
                <View>
                    <Text
                        style={{
                            textAlign: 'center',
                            marginTop: 5,
                            color: '#717580'
                        }}
                    >
                        Don't have an account? <Text onPress={()=> {props.navigation.navigate('SignUp')}} style={{fontWeight: 'bold', color: '#0718c4'}}>Make one here</Text>
                    </Text>
                </View>
            </View>
        </View>

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