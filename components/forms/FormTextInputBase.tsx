import { Controller } from "react-hook-form";
import { View, Text, TextInput, Pressable, Keyboard } from "react-native";

export interface FormTextInputProps {
    name: string,
    control: any,
    title: string,
    placeholder?: string,
    required?: boolean,
    multiline?: boolean,
    numberOfLines?: number 
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function FormTextInputBase({ name, control, title, placeholder="Type here..", required=false, multiline=false, numberOfLines=1}: FormTextInputProps){
    return (
        <Controller 
            control={control}
            name={name}
            render={({field: { value, onChange, onBlur }, fieldState}) => (
                <View className={`bg-gray-100 px-5 py-2 my-1`}>
                    <View className="flex flex-row">
                        <Text>{title}</Text>{required && (<Text className="font-bold text-red-600">*</Text>)}
                    </View>
                    <TextInput 
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={required? placeholder : "Optional.."}
                        placeholderTextColor='gray'
                        numberOfLines={numberOfLines}
                        multiline={multiline}
                        className={`border rounded ${fieldState.error? "border-error" : !value? "" : "border-success"}`}
                        textAlignVertical="top"
                        style={{ 
                            minHeight: multiline? 15 * numberOfLines : 15,
                            backgroundColor: "#ffffff"
                        
                        }}
                        
                    />
                    {fieldState.error && (<Text className='text-red-600'>{fieldState.error.message}</Text>)}
                </View>
            )}
        />
    )
}