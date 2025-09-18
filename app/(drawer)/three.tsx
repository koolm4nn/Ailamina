// Using the provided hook
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Button, View } from 'react-native';

export default function Three() {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ['Delete', 'Save', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 1:
          console.log("Save");
          // Save
          break;

        case destructiveButtonIndex:
          console.log("Delete");
          // Delete
          break;

        case cancelButtonIndex:
          console.log("Cancel");
          // Canceled
      }});
  }

  return (
    <View className='p-20'>
      <Button title="Menu" onPress={onPress}/>

    </View>
  )
};