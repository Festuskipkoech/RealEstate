import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Animated, Pressable, ActivityIndicator,RefreshControl } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// Constants
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.100.219:3001';

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

// Shared styles
const shadowStyle = {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
};

const PressableIcon = React.memo(({ iconName, onPress, size = 24, color = '#fff', style = {} }) => {
    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = useCallback(() => {
        Animated.spring(scaleValue, {
            toValue: 1.1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [scaleValue]);

    const handlePressOut = useCallback(() => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
        onPress?.();
    }, [scaleValue, onPress]);

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
});

const PropertyCard = React.memo(({ image, onPress }) => {
    // Construct the full image URL by combining API_URL with imageUrl
    const imageUrl = `${API_URL}/${image.imageUrl}`;
    console.log('Loading image from:', imageUrl); // Debug log

    return (
        <Pressable 
            style={styles.imageCard}
            onPress={() => onPress?.(image)}
        >
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) => console.warn('Image loading error:', error.nativeEvent.error)}
                // You might want to add a default placeholder image
                // defaultSource={require('./assets/placeholder.png')}
            />
            <View style={styles.imageDetails}>
                <Text style={styles.imageTitle}>{image.title || 'Property'}</Text>
                <Text style={styles.imageDescription}>{image.description}</Text>
                <Text style={styles.imagePrice}>${(image.price || 0).toLocaleString()}</Text>
            </View>
        </Pressable>
    );
});

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [notification, setNotification] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);

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
            console.log('API Response:', response.data); // Debug log
            if (response?.data) {
                setImages(response.data);
                setFilteredImages(response.data);
            }
        } catch (error) {
            console.error('API Error:', error); // Debug log
            setError(
                error.response?.data?.message || 
                'Failed to load images. Please check your connection.'
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchImages();
    }, []);

    const filterImages = useCallback(() => {
        setFilteredImages(images.filter(image => 
            (!searchQuery || 
             (image.description && 
              image.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
            (!selectedCategory || image.category === selectedCategory)
        ));
    }, [searchQuery, selectedCategory, images]);

    const showNotification = useCallback((message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const handleCategoryPress = useCallback((categoryName) => {
        setSelectedCategory(prevCategory => 
            prevCategory === categoryName ? null : categoryName
        );
    }, []);

    const handlePropertyPress = useCallback((property) => {
        console.log('Property selected:', property);
        // Add your navigation or modal logic here
    }, []);

    const handleScroll = useCallback(({ nativeEvent }) => {
        setScrollOffset(nativeEvent.contentOffset.x);
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
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
            <View style={styles.propertyListContainer}>
                {filteredImages.length === 0 ? (
                    <Text style={styles.noResultsText}>No properties found</Text>
                ) : (
                    filteredImages.map((image, index) => (
                        <PropertyCard 
                            key={image._id || index}
                            image={image}
                            onPress={handlePropertyPress}
                        />
                    ))
                )}
            </View>
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
                            onPress={() => showNotification('You have new notifications!')}
                            color="#ffffff"
                        />
                    )}
                />                
            </Appbar.Header>

            {scrollOffset > 0 && <View style={styles.horizontalLine} />}
            
            <ScrollView style={styles.mainScrollView}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={onRefresh} 
                        colors={['#3b82f6']}
                    />
                }
            >
                {notification && (
                    <Pressable 
                        style={styles.notificationBar} 
                        onPress={() => setNotification(null)}
                    >
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
                    onScroll={handleScroll}
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
            </ScrollView>
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
        ...shadowStyle,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    mainScrollView: {
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
        marginVertical: 8,
        ...shadowStyle,
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
        ...shadowStyle,
    },
    categoriesContainer: {
        paddingVertical: 1,
        gap: 6,
        marginBottom: 8,
    },
    category: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 8,
        height: 50,
        marginRight: 8,
        ...shadowStyle,
        flexDirection: 'row',
        gap: 4,
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
        marginHorizontal: 4,
    },
    selectedCategoryText: {
        color: '#ffffff',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
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
    propertyListContainer: {
        paddingTop: 0,
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
        overflow: 'hidden',
        ...shadowStyle,
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