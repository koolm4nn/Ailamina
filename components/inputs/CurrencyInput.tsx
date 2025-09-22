import { Controller } from "react-hook-form";
import { View, Text, Pressable } from "react-native";
import CurrencyInput, { FakeCurrencyInput } from "react-native-currency-input";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";



export interface CurrencyFieldProps {
  name: string,
  control: any,
  required?: boolean,
  title: string,
}

/**
 * Simple field for currency input. 
 */
export default function CurrencyField({ name, control, required=false, title }: CurrencyFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Controller 
      name={name}
      control={control}
      render={({field: { value, onChange, onBlur }, fieldState}) => (
        <>
        <View className={`flex flex-row w-full items-center my-1 px-5 py-2 justify-between bg-gray-100`}>
          <View className="flex flex-row w-2/6">
            <Text className="">{title}</Text>
            {required && <Text className="font-bold text-red-600">*</Text>}
          </View>
          <View className='flex flex-row items-center w-4/6 justify-end gap-3'>
            <Text className="text-sm">
              NZD
            </Text>
            <View className={`${focused? "bg-yellow-100" : "bg-white"} border ${ value === 0? "" : fieldState.error? "border-red-500" : "border-green-500"} max-w-3/5 w-3/5 rounded-sm`}>
              <FakeCurrencyInput
                value={value}
                onChangeValue={onChange}
                delimiter=","
                separator="."
                precision={2}
                minValue={0}
                className=""
                placeholder="0.00"
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
              />
            </View>
            <Pressable 
              className="rounded-full bg-red-200 ml-2"
              onPress={() => {onChange(0)}}
              >
              <MaterialIcons 
                name="clear" 
                size={24} 
                color="white" />
            </Pressable>
          </View>
        </View>
        {fieldState.error && (<Text className='text-red-600'>{fieldState.error.message}</Text>)}
        </>
      )} 
    />
  );
}