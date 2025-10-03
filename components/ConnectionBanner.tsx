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
            {status === "disconnected" && <MaterialCommunityIcons className="p-2 bg-error rounded-full" name="signal-cellular-outline" size={18} color="#f0f9ff" />}
            {status === "unstable" && <MaterialCommunityIcons className="p-2 bg-warning rounded-full" name="signal-cellular-2" size={18} color="#f0f9ff"/>}
            {status === "connected" && <MaterialCommunityIcons className="p-2 bg-success rounded-full" name="signal-cellular-3" size={18} color="#f0f9ff" />}

            <Text className={`text-center font-bold text-sm ml-1 ${
                status === "connected"
                    ? "text-success"
                    : status === "unstable"
                    ? "text-warning"
                    : "text-error"
                }`}
            >
                {status.toUpperCase()}
            </Text>
        </View>
    )
}