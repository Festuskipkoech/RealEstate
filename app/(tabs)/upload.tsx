import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Upload() {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action>
                    
                </Appbar.Action>
            </Appbar.Header>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

