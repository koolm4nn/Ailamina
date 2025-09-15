import { Pressable, View, Text } from 'react-native';
import {MaterialCommunityIcons, AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import ConnectionBanner from '@/components/ConnectionBanner';
import SynchronisationBanner from '@/components/SynchronisationBanner';
import DateBanner from '@/components/DateBanner';
import { useRouter } from 'expo-router';


// MaterialCommunityIcons: bird
// AntDesign: inboox
// Ionicons: egg
// MaterialIcons: group, money

type IconFamily = "MaterialCommunityIcons" | "AntDesign" | "Ionicons" | "MaterialIcons";
type DashboardIcon = "bird" | "inbox" | "egg" | "group" | "money";

type DashboardButtonProps = {
  title: string,
  iconName?: DashboardIcon, 
  iconFamily?: IconFamily,
  onPress?: () => void,
  to?: string
}


function DashboardButton(props: DashboardButtonProps) {
  const router = useRouter();

  let IconComponent;
  switch(props.iconFamily){
    case "MaterialCommunityIcons": 
      IconComponent = MaterialCommunityIcons;
      break;
    case "AntDesign":
      IconComponent = AntDesign;
      break;
    case "Ionicons": 
      IconComponent = Ionicons;
      break;
    case "MaterialIcons":
      IconComponent = MaterialIcons;
      break;
    default:
      IconComponent = MaterialCommunityIcons;
      break;
  }

  const handlePress = () => {
    if(props.to){
      router.navigate(props.to as any);
    } else {
      alert(`${props.title} pressed.`)
    }
  }

  return (
    <Pressable 
      className= {`active:bg-green-900 bg-green-700 active:opacity-90 rounded-xl px-2 py-4`}
      onPress={handlePress}>
      <View className='grid grid-col-1 items-center'>
        {props.iconName && <IconComponent name={props.iconName as any} size={24} color="white" />}
      <Text className='pt-1 text-lg text-white'>{props.title}</Text>
      </View>
    </Pressable>
  )
}

export default function TabOneScreen() {
  return (
    <View className='flex-1 bg-green-50'>
      <View className='py-10 items-center'>
        <Text className='text-3xl font-bold'>Hi, Marius</Text>
      </View>
      <View className='flex flex-row justify-between items-center px-2 py-3 bg-gray-200'>
        <ConnectionBanner />
        <SynchronisationBanner />
        <DateBanner />
      </View>

      <View className='flex-row flex-wrap justify-between m-2 p-2'>
        <View className='w-[48%] mb-4'>
          <DashboardButton title='My Animals' iconName='bird' iconFamily='MaterialCommunityIcons'/>
        </View>
        <View className='w-[48%] mb-4'>
          <DashboardButton title='Pairs' iconName='group' iconFamily='MaterialIcons'/>
        </View>
        <View className='w-[48%] mb-4'>
          <DashboardButton title='Clutches' iconName='inbox' iconFamily='AntDesign'/>
        </View>
        <View className='w-[48%] mb-4'>
          <DashboardButton title='Eggs' iconName='egg' iconFamily='Ionicons'/>
        </View>
        <View className='w-[48%] mb-4'>
          <DashboardButton title='Bookings' iconName='money' iconFamily='MaterialIcons'/>
        </View>
      </View>
    </View>
  );
}