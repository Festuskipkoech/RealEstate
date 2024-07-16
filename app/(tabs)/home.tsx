import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const onSearch = (query) => {
        setSearchQuery(query);
        // Add search logic here
    };

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Notification',
            text2: 'You have new notifications!',
            position: 'bottom',
            visibilityTime: 3000,
            autoHide: true,
            style: styles.toast,
            textStyle: styles.toastText,
        });
    };

    const categories = [
        { name: 'Apartments', icon: 'building' },
        { name: 'Mansions', icon: 'house-user' },
        { name: 'Single-Family', icon: 'home' },
        { name: 'Townhouses', icon: 'city' },
        { name: 'Condominiums', icon: 'building' },
        { name: 'Duplexes', icon: 'home' },
        { name: 'Bungalows', icon: 'home' },
        { name: 'Villas', icon: 'hotel' }
    ];

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.background}>
                <Appbar.Action 
                    icon={() => (
                        <View style={styles.iconContainer}>
                            <FontAwesome name="bars" size={24} color="#fff" />
                        </View>
                    )}
                    onPress={() => console.log('Menu pressed')}
                />
                <Appbar.Content title="Real estate" style={styles.title}/>  
                <Appbar.Action 
                    icon={() => (
                        <View>
                            <FontAwesome name="bell" size={24} color="#fff" style={styles.icon} />
                        </View>
                    )}
                    onPress={showToast}
                />                
            </Appbar.Header>
            <View style={styles.horizontalLine} />
            <Text style={styles.text}>Hi, There!</Text>
            <Searchbar
                placeholder="Search..."
                onChangeText={onSearch}
                value={searchQuery}
                style={styles.searchBar}
            />
            <ScrollView horizontal contentContainerStyle={styles.categoriesContainer}>
                {categories.map((category, index) => (
                    <View key={index} style={styles.category}>
                        <FontAwesome name={category.icon} size={24} color="#f97316" />
                        <Text style={styles.categoryText}>{category.name}</Text>
                    </View>
                ))}
            </ScrollView>
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background:{
        backgroundColor:'#f97316',
    }, 
    title:{
        color:'#ffa100',
    },
    text: {
        fontSize: 24,
        padding: 15,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    icon: {
        color: "#fff",
    },
    iconContainer: {
        backgroundColor: '#f5f3f5',
        borderRadius: 30,
        padding: 2,
    },
    toast: {
        backgroundColor: '#323232',
        borderRadius: 30,
        padding: 10,
    },
    toastText: {
        color: '#ffffff',
    },
    searchBar: {
        margin: 10,
        backgroundColor:'#f5f3f5',
        color:'#ffa',
    },
    categoriesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    category: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    categoryText: {
        marginTop: 5,
        fontSize: 12,
        color: '#f97316',
    },
});
