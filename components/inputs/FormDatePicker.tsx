import React, { useState } from "react";
import { Platform, View, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface FormDatePickerProps {
  value: Date,
  onChange: (date: Date) => void
  required?: boolean
}

/**
 * Date picker consisting of a button and a simple text display of the selected date in a vertical row.
 * Opens the native date picker. 
 */
export default function FormDatePicker({ value, onChange, required=true } : FormDatePickerProps) {
  const [date, setDate] = useState(value);
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // iOS keeps picker open, Android closes
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate);
    }
  };

  return (
    <View className='flex flex-row items-center justify-start my-1'>
        <Pressable
            onPress={() => setShow(true)}
            className='bg-accent border px-10 py-2 rounded mr-5 active:bg-yellow-500 flex flex-row'>
            <Text>
                Pick Hatch Date
            </Text>
            {required && <Text className="text-red-600">
              *
            </Text>}
        </Pressable>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default" // "default", "spinner", "calendar"
          maximumDate={new Date(Date.now())}
          onChange={handleChange}
        />
      )}
      <Text className='font-bold text-2xl'>{date.toLocaleDateString()}</Text>
    </View>
  );
}