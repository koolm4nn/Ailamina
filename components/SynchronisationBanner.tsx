import { Text, View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function SynchronisationBanner() {
    const synchronised = false;
    return (
        <View className="flex flex-row items-center">
            {synchronised
                ?
                <>
                    <MaterialCommunityIcons name="sync" size={24} color="#48bb78" />
                    <Text className="font-bold text-sm text-success">SYNCHRONIZED</Text> 
                </>
                :
                <>
                    <MaterialCommunityIcons name="sync-alert" size={24} color="#ff4949ff" />
                    <Text className="font-bold text-sm text-error">UNSYNCHRONIZED</Text> 
                </>
            }
        </View>
    )
}