import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Animated, Pressable, ActivityIndicator } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// Constants
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const categories = [
    { name: 'Apartments', icon: 'building', color: '#3b82f6' },
    { name: 'Mansions', icon: 'house-user', color: '#3b82f6' },
    { name: 'Single-Family', icon: 'home', color: '#3b82f6' },
    { name: 'Townhouses', icon: 'city', color: '#3b82f6' },
    { name: 'Condominiums', icon: 'building', color: '#3b82f6' },
    { name: 'Duplexes', icon: 'home', color: '#3b82f6' },
    { name: 'Bungalows', icon: 'home', color: '#3b82f6' },
    { name: 'Villas', icon: 'hotel', color: '#3b82f6' }
];

function PressableIcon({ iconName, onPress, size = 24, color = '#fff', style = {} }) {
    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 1.1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
        onPress && onPress();
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.iconContainer, style]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <FontAwesome5 name={iconName} size={size} color={color} />
            </Animated.View>
        </Pressable>
    );
}

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showLine, setShowLine] = useState(false);
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Apartments");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        filterImages();
    }, [searchQuery, images, selectedCategory]);

    const fetchImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/images`);
            setImages(response.data);
            setFilteredImages(response.data);
        } catch (error) {
            setError('Failed to load images');
        } finally {
            setIsLoading(false);
        }
    };

    const filterImages = () => {
        let filtered = [...images];
        if (searchQuery) {
            filtered = filtered.filter(image => 
                image.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) {
            filtered = filtered.filter(image => 
                image.category === selectedCategory
            );
        }
        setFilteredImages(filtered);
    };

    const showNotification = () => {
        setNotification('You have new notifications!');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCategoryPress = (categoryName) => {
        setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable 
                        style={styles.retryButton} 
                        onPress={fetchImages}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            );
        }

        return (
            <ScrollView style={styles.imagesContainer}>
                {filteredImages.length === 0 ? (
                    <Text style={styles.noResultsText}>No properties found</Text>
                ) : (
                    filteredImages.map((image, index) => (
                        <Pressable 
                            key={index} 
                            style={styles.imageCard}
                            onPress={() => console.log('Property selected:', image)}
                        >
                            <Image
                                source={{ uri: image.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.imageDetails}>
                                <Text style={styles.imageTitle}>{image.title}</Text>
                                <Text style={styles.imageDescription}>{image.description}</Text>
                                <Text style={styles.imagePrice}>${image.price?.toLocaleString()}</Text>
                            </View>
                        </Pressable>
                    ))
                )}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action 
                    icon={() => (
                        <PressableIcon 
                            iconName="bars" 
                            onPress={() => console.log('Menu pressed')}
                            color="#ffffff"
                        />
                    )}
                />
                <Appbar.Content 
                    title="Real Estate" 
                    titleStyle={styles.headerTitle}
                />  
                <Appbar.Action 
                    icon={() => (
                        <PressableIcon 
                            iconName="bell" 
                            onPress={showNotification}
                            color="#ffffff"
                        />
                    )}
                />                
            </Appbar.Header>

            {showLine && <View style={styles.horizontalLine} />}
            
            <View style={styles.content}>
                {notification && (
                    <Pressable style={styles.notificationBar} onPress={() => setNotification(null)}>
                        <Text style={styles.notificationText}>{notification}</Text>
                    </Pressable>
                )}
                
                <Text style={styles.welcomeText}>Hi, There!</Text>
                
                <Searchbar
                    placeholder="Search properties..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    placeholderTextColor="#666"
                    iconColor="#3b82f6"
                />

                <ScrollView 
                    horizontal 
                    contentContainerStyle={styles.categoriesContainer} 
                    showsHorizontalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        setShowLine(nativeEvent.contentOffset.x > 0);
                    }}
                    scrollEventThrottle={16}
                >
                    {categories.map((category, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.category,
                                selectedCategory === category.name && styles.selectedCategory
                            ]}
                            onPress={() => handleCategoryPress(category.name)}
                        >
                            <PressableIcon 
                                iconName={category.icon} 
                                size={20} 
                                color={selectedCategory === category.name ? '#ffffff' : category.color}
                                style={styles.categoryIcon}
                            />
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category.name && styles.selectedCategoryText
                            ]}>
                                {category.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#3b82f6',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#1e3a8a',
        marginVertical: 16,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "#e2e8f0",
    },
    notificationBar: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    notificationText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        marginBottom: 16,
        backgroundColor: '#EDEADE',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    categoriesContainer: {
        paddingVertical: 8,
        gap: 6,
    },
    category: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 8,
        height:50,
        marginRight: 4,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        flexDirection: 'row',
        gap: 2,
    },
    selectedCategory: {
        backgroundColor: '#3b82f6',
    },
    categoryIcon: {
        marginRight: 4,
    },
    categoryText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '600',
    },
    selectedCategoryText: {
        color: '#ffffff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    imagesContainer: {
        flex: 1,
    },
    noResultsText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 32,
    },
    imageCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    imageDetails: {
        padding: 16,
    },
    imageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    imageDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    imagePrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3b82f6',
    },
});