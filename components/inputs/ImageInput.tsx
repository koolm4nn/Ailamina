import { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Maybe } from "yup";

/**
 * Simple image selector (gallery or camera). 
 */
export default function ImageInput({
    uri, 
    onChangeImage
} : {
    uri: string | null | undefined, 
    onChangeImage: (uri: string | null) => void 
}) {
    const [imageUri, setImageUri] = useState<string | null>(uri ?? null);
    
    async function pickImage(){
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!granted) {
            alert("Permissions required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7
        });

        if(!result.canceled){
            const newUri = result.assets[0].uri;
            setImageUri(newUri);
            onChangeImage(newUri);
        }
    }

    async function takeImage(){
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if(!granted) {
            alert("Permission to access camera is required.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8
        });

        if(!result.canceled) {
            const newUri = result.assets[0].uri;
            setImageUri(newUri);
            onChangeImage(newUri);
        }
    }

    return (
        <View className='items-center mb-10'>

            <View
                className='w-80 h-80 p-2 bg-stone-500 items-center justify-center rounded-md'
            >
                {imageUri? (
                        <Image 
                            source={{ uri: imageUri }}
                            className='w-full h-full rounded'/>
                ) : (
                    <Text className='text-white'>No image selected</Text>
                )}
            </View>
            <View className='flex flex-row justify-between py-2 px-10 w-full'>
                <Pressable
                    onPress={pickImage}
                    className='active:bg-yellow-600 active:opacity-90 bg-accent px-3 py-2 rounded w-[40%]'
                >
                    <Text
                        className='text-neutral-800 text-center'>
                        Select image
                    </Text>
                </Pressable>
                <Pressable
                    onPress={takeImage}
                    className='active:bg-yellow-600 active:opacity-90 bg-accent px-3 py-2 rounded w-[40%]'
                >
                    <Text
                        className='text-neutral-800 text-center'>
                        Take image
                    </Text>
                </Pressable>
            </View>
                <Text>
                    {imageUri}
                </Text>
        </View>
    )
}