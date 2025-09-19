import React, { useState } from "react";
import { Platform, View, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  value: Date,
  onChange: (date: Date) => void
}

/**
 * Date picker consisting of a button and a simple text display of the selected date in a vertical row.
 * Opens the native date picker. 
 */
export default function FormDatePicker({ value, onChange } : Props) {
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
            className='bg-yellow-400 px-10 py-2 rounded mr-5 active:bg-yellow-500'>
            <Text>
                Pick Hatch Date
            </Text>
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