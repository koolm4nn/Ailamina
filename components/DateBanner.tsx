import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

function extractFromDate(date: Date){
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        })
    }
}

export default function DateBanner() {
    const [date, setDate] = useState<Date>(new Date());

    useEffect(()=> {
        let intervalId: ReturnType<typeof setInterval> | undefined;
        let timeoutId: ReturnType<typeof setInterval> | undefined;


        const updateDate = () => setDate(new Date());

        // calc ms until next minute
        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // wait until next full minute
        timeoutId = setTimeout(() => {
            updateDate();

            // tick every minute
            intervalId = setInterval(updateDate, 60000);
        }, msUntilNextMinute)

            
        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };

    }, [])

    return (
        <View className='col col-1 items-end px-2'>
            <Text className="text-text">
                {`${extractFromDate(date).time}`}
            </Text>
            <Text className="text-text">
                {`${extractFromDate(date).date}`}
            </Text>
        </View>
    )
}