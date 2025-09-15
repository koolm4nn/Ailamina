import { Text, View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function SynchronisationBanner() {
    const synchronised = false;
    return (
        <View className="flex flex-row items-center">
            {synchronised
                ?
                <>
                    <MaterialCommunityIcons name="sync" size={24} color="#16a34a" />
                    <Text className="font-bold text-sm text-green-600">SYNCHRONIZED</Text> 
                </>
                :
                <>
                    <MaterialCommunityIcons name="sync-alert" size={24} color="#dc2626" />
                    <Text className="font-bold text-sm text-red-600">UNSYNCHRONIZED</Text> 
                </>
            }
        </View>
    )
}