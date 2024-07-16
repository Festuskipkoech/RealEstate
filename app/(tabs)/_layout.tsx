import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function TabLayout() {
    const router = useRouter();
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    headerShown: false, // Hide the top bar for Home tab
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="wechat" color={color} />,
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity {...props} style={styles.uploadButtonWrapper}>
                            <View style={styles.uploadButton}>
                                <FontAwesome size={28} name="cloud-upload" color="white" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="save"
                options={{
                    title: 'Save',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    header: () => (
                        <Appbar.Header style={styles.appBar}>
                            <Appbar.Action
                                icon="magnify"
                                size={30}
                                onPress={() => console.log('Search icon pressed')}
                            />
                            <Appbar.Content title="Profile" style={styles.title} />
                            <Appbar.Action
                                icon="account-circle"
                                onPress={() => router.push('/profile/user')}
                            />
                        </Appbar.Header>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    uploadButtonWrapper: {
        position: 'absolute',
        bottom: 30,
        left: '50%',
        marginLeft: -35,
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: '#f97316',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    uploadButton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TabLayout;
