import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const FirstPage = ({ onContinueAsGuest }) => {
  return (
    <ImageBackground 
      // source={require('../assets/images/item7.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to My App</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.guestContainer}>
          <TouchableOpacity onPress={onContinueAsGuest}>
            <Text style={styles.guestText}>Continue as a guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor:'#0000ll',
    flex: 1,
    justifyContent: 'flex-end', // Align items to the bottom
    alignItems: 'center',
  },
  container: {
    paddingBottom: 40, // Add space at the bottom
    width: '100%',
    alignItems: 'center', // Center buttons horizontally
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  guestContainer: {
    marginTop: 20,
  },
  guestText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default FirstPage;
