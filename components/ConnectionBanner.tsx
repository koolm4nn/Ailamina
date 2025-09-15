import { useConnectionStatus } from "@/components/useConnectionStatus";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Banner that show the connection status
 * Pings the db/health endpoint
 * 
 * Connected, unstable or disconnected
 * -> Green, yellow or red
 */
export default function ConnectionBanner() {
    const status = useConnectionStatus();

    return (
        <View className="p-2 flex flex-row items-center">
            {status === "disconnected" && <MaterialCommunityIcons className="p-2 bg-red-600 rounded-full" name="signal-cellular-outline" size={18} color="white" />}
            {status === "unstable" && <MaterialCommunityIcons className="p-2 bg-yellow-300 rounded-full" name="signal-cellular-2" size={18} color="white"/>}
            {status === "connected" && <MaterialCommunityIcons className="p-2 bg-green-600 rounded-full" name="signal-cellular-3" size={18} color="white" />}

            <Text className={`text-center font-bold text-sm ml-1 ${
                status === "connected"
                    ? "text-green-600"
                    : status === "unstable"
                    ? "text-yellow-300"
                    : "text-red-600"
                }`}
            >
                {status.toUpperCase()}
            </Text>
        </View>
    )
}