import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input } from '@rneui/themed';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main(props) {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.upperContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: hp(30),
            height: hp(30),
          }}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <Text style={styles.welcomeText}>
            Welcome to EnviroSense
          </Text>
        </View>
        <View>
          <Text style={styles.subtitleText}>
            Make Your Classroom Air Cleaner
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.chadwickButton]}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          >
            <Text style={styles.buttonText}>
              Chadwick
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.otherButton]}
            onPress={() => {
              props.navigation.navigate("HomeOther");
            }}
          >
            <Text style={styles.buttonText}>
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  upperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 2,
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343648',
  },
  subtitleText: {
    fontSize: hp(2),
    textAlign: 'center',
    marginTop: hp(2),
    color: '#717580',
  },
  buttonContainer: {
    marginTop: hp(5),
    alignItems: 'center',
  },
  button: {
    width: wp(90),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: hp(2),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: hp(2),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: hp(2.5),
  },
  chadwickButton: {
    backgroundColor: '#495057', // A deep, elegant gray for luxury
  },
  otherButton: {
    backgroundColor: '#6C7A89', // Matte green, adjusted for a luxurious feel
  },
});
