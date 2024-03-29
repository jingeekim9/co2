import React, { useEffect, useState, Component } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from 'react-native'
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import HomeOther from "./pages/HomeOther";
import DetailOther from "./pages/DetailOther";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Main from "./pages/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Icon } from '@rneui/themed';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();


export default function App() {
  const navigationRef = React.createRef();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen 
            name="Main"
            component={Main}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="Home"
            component={Home}
            options={{
              title: 'HOME',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#516372'
              },
              headerTitleStyle: {
                color: 'white',
                letterSpacing: 2
              },
              headerShadowVisible: false,
              headerRight: () => (
                <Icon 
                  type="ionicon"
                  name="log-out-outline"
                  color="white"
                  style={{
                    marginRight: wp(5)
                  }}
                  onPress={async(props) => {
                    await AsyncStorage.removeItem('email')
                    await AsyncStorage.removeItem('password')
                    navigationRef.current.reset({
                      routes: [{name: 'Login'}]
                  })
                  }}
                />
              )
            }}
          />
          <Stack.Screen 
            name="Detail"
            component={Detail}
            options={{
              title: 'Detail',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#516372'
              },
              headerTitleStyle: {
                color: 'white',
                letterSpacing: 2
              },
              headerShadowVisible: false,
              headerTintColor: 'white'
            }}
          />
          <Stack.Screen 
            name="HomeOther"
            component={HomeOther}
            options={{
              title: 'HOME',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#516372'
              },
              headerTitleStyle: {
                color: 'white',
                letterSpacing: 2
              },
              headerShadowVisible: false,
              headerRight: () => (
                <Icon 
                  type="ionicon"
                  name="log-out-outline"
                  color="white"
                  style={{
                    marginRight: wp(5)
                  }}
                  onPress={async(props) => {
                    await AsyncStorage.removeItem('email')
                    await AsyncStorage.removeItem('password')
                    navigationRef.current.reset({
                      routes: [{name: 'Login'}]
                  })
                  }}
                />
              )
            }}
          />
          <Stack.Screen 
            name="DetailOther"
            component={DetailOther}
            options={{
              title: 'Detail',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#516372'
              },
              headerTitleStyle: {
                color: 'white',
                letterSpacing: 2
              },
              headerShadowVisible: false,
              headerTintColor: 'white'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});