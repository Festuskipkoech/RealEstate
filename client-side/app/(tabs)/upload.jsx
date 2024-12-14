import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function Upload({ navigation }) {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');

    // Function to pick an image from the device
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Launch image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        } else {
            Alert.alert('No image selected', 'Please select an image first!');
        }
    };

    // Function to upload the selected image to the server
    const uploadImage = async () => {
        if (!image) {
            Alert.alert('No image selected', 'Please select an image first!');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.uri.split('/').pop(),
        });
        formData.append('description', description);
        console.log('Form Data:', formData);


        try {
            const response = await axios.post('http://192.168.100.219:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Upload successful', 'Image uploaded successfully!');
            console.log('Upload successful:', response.data);

            // Clear the form after successful upload
            setImage(null);
            setDescription('');
            navigation.goBack();
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error.message);
            Alert.alert('Upload failed', 'There was an error uploading the image.');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image" onPress={pickImage} />
            {image && <Image source={{ uri: image.uri }} style={styles.image} />}
            <TextInput
                placeholder="Image description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button title="Upload" onPress={uploadImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        margin: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
});
