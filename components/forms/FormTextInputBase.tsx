import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

export interface FormTextInputProps {
    name: string,
    control: any,
    title: string,
    placeholder?: string,
    required?: boolean
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function FormTextInputBase({ name, control, title, placeholder="Type here..", required=false}: FormTextInputProps){
    return (
        <Controller 
            control={control}
            name={name}
            render={({field: { value, onChange, onBlur }, fieldState}) => (
                <View className='bg-gray-200 px-5 py-2 mb-5'>
                    <View className="flex flex-row">
                        <Text>{title}</Text>{required && (<Text className="font-bold text-red-600">*</Text>)}
                    </View>
                    <TextInput 
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        placeholderTextColor='gray'
                        numberOfLines={1}
                        className='border rounded'
                    />
                    {fieldState.error && (<Text className='text-red-600'>{fieldState.error.message}</Text>)}
                </View>
            )}
        />
    )
}