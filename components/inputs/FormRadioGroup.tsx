import { Pressable, View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

type option = {
    value: string | number,
    label: string
}

/**
 * Radio button group in two columns
 */
export default function FormRadioGroup({ value, onChange, options, error }:{
    value: string,
    onChange: (val: any) => void,
    options: option[]
    error: boolean
}) {
  return (
    <View className={`mb-4 w-full ${error? "bg-red-200" : ""}`}>
      <RadioButton.Group 
        onValueChange={onChange} 
        value={value}
        >
        <View className='flex-row flex-wrap'>
            {options.map(opt => (
                <View key={opt.value} className='w-1/2'>
                    <Pressable>
                            <View className='items-center'>
                                <RadioButton
                                    value={opt.value as string}
                                    status={value === opt.value ? "checked" : "unchecked"}
                                    onPress={() => onChange(opt.value)}
                                />
                                <Text className="ml-2">{opt.label}</Text>
                            </View>
                    </Pressable>
                </View>
            ))}
        </View>
      </RadioButton.Group>
    </View>
  );
}