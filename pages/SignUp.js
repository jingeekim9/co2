import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Input } from '@rneui/themed';
import Toast from "react-native-toast-message";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

export default function SignUp(props) {

    const [name, setName] = useState("");
    const [errorName, setErrorName] = useState("");
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
    const [loading, setLoading ] = useState(false);

    const registerWithEmailAndPassword = async() => {
        setErrorName("");
        setErrorEmail("");
        setErrorPassword("");
        setErrorConfirmPassword("");
        if(name == "")
        {
            setErrorName("Please enter a name.");
            return;
        }
        else if(email == "")
        {
            setErrorEmail("Please enter an email.");
            return;
        }
        else if(password == "")
        {
            setErrorPassword("Please enter a password.");
            return;
        }
        else if(confirmPassword != password)
        {
            setErrorConfirmPassword("Please enter the same password as above.");
            return;
        }
        

        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);
            setLoading(false);
            props.navigation.reset({
                routes: [{name: 'Login'}]
            })
        }
        catch (err) {
            console.error(err.code);
            console.log(email)
            console.log(password)
            if(err.code == "auth/invalid-email")
            {
                Toast.show({
                    type: 'error',
                    text1: 'Please input a valid email.'
                })
            }
            else if(err.code == "auth/email-already-in-use")
            {
                Toast.show({
                    type: 'error',
                    text1: 'This email already exists.'
                })
            }
            else if(err.code == "auth/weak-password")
            {
                Toast.show({
                    type: 'error',
                    text1: 'Please enter a more difficult password.'
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
                        placeholder="First, Last Name"
                        onChangeText={(e) => { setName(e) }}
                        errorMessage={errorName}
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
                            marginRight: 'auto',
                            
                        }}
                        placeholder= "Email"
                        autoCapitalize='none'
                        autoComplete='off'
                        onChangeText={(e) => { setEmail(e) }}
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
                        onChangeText={(e) => { console.log(e); setPassword(e) }}
                        secureTextEntry={true}
                        errorMessage={errorPassword}
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
                        placeholder="Confirm Password"
                        onChangeText={(e) => { setConfirmPassword(e) }}
                        secureTextEntry={true}
                        errorMessage={errorConfirmPassword}
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
                        registerWithEmailAndPassword();
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
                                Sign Up
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
                        Already have an account? <Text onPress={()=> {props.navigation.navigate('Login')}} style={{fontWeight: 'bold', color: '#0718c4'}}>Login</Text>
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