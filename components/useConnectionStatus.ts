import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export type ConnectionStatus = "connected" | "unstable" | "disconnected";

// process.env.EXPO_PUBLIC_SUPABASE_URL
export function useConnectionStatus(
    pingUrl: string =  `${process.env.EXPO_PUBLIC_SUPABASE_URL}/health`
) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  useEffect(() => {
    let cancelled = false;

    const checkConnection = async () => {
        if(cancelled) return;

        try {
            const start = Date.now();
            const res = await fetch(pingUrl, { 
                method: "GET", 
                headers: {
                    apiKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string
                },
            });
            const duration = Date.now() - start;

            if (!res.ok) {
                setStatus("unstable");
                return;
            }
            

            if (duration > 1000) {
                // response too slow = unstable
                setStatus("unstable");
            } else {
                setStatus("connected");
            }
        } catch (err) {
            setStatus("unstable");
        }

        const net = await NetInfo.fetch();
        if (!net.isConnected) {
            setStatus("disconnected");
            return;
        };


    };

    checkConnection(); 
    const intervalId = setInterval(checkConnection, 5000);
        
    return () => {
        cancelled =true;
        clearInterval(intervalId);
    };
  }, [pingUrl]);

  return status;
}
