import { View, Text } from "react-native";
import CurrencyInput, { FakeCurrencyInput } from "react-native-currency-input";

/**
 * Simple field for currency input. 
 */
export default function CurrencyField({ label, value, onChangeValue }: {
  label: string;
  value: number | null;
  onChangeValue: (val: number | null) => void;
}) {
  return (
    <View className='flex flex-row w-full items-center mb-2 justify-between'>
      <Text className='mr-2'>{label}:</Text>
      <View className='flex flex-row items-center justify-end'>
        <FakeCurrencyInput
          value={value}
          onChangeValue={onChangeValue}
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          className="border border-yellow-200 border-2 p-5 bg-white-100 w-[66%] text-right"
          placeholder="0.00"
        />
        <Text className='ml-1'>$</Text>
      </View>
    </View>
  );
}