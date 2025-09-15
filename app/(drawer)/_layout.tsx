import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, Pressable, Platform, StatusBar } from 'react-native';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavLinkProps = {
  navigation: any,
  target: string,
  title: string,
}

function NavLink(props: NavLinkProps){
  return (
        <Pressable
          className="p-3 rounded bg-green-800 mb-2"
          onPress={() => props.navigation.navigate(props.target)}
        >
          <Text className="text-white">{props.title}</Text>
        </Pressable>
    )
}

function LogOutButton(){
  return (
    <>
        <Pressable
          className="p-3 rounded bg-green-800 mb-2"
          onPress={async () => {
            const {error} = await supabase.auth.signOut()
            if(error){
              console.log("Error loggin out.")
            } else {
              console.log("Logged out.")
            }
          }}
        >
          <View className='flex flex-row items-center'>
            <SimpleLineIcons name="logout" size={15} color="white" className='mr-2'/>
            <Text className="text-white">Logout</Text>
          </View>
        </Pressable>
    </>
  )
}

function CustomDrawerContent({ navigation }: any) {
  return (
    <SafeAreaView className='flex-1 bg-white px-4'>
        
        <View className='items-center'>
          <MaterialCommunityIcons name='bird' size={20} color='green' className='mr-[100px]'/>
          <Text className="text-xl font-bold mb-4">AILAMINA</Text>
        </View>
          <LogOutButton />
        <NavLink navigation={navigation} target='index' title='Dashboard'/>
        <NavLink navigation={navigation} target='two' title='My Birds'/>
        <NavLink navigation={navigation} target='createBird' title='Add Bird'/>
        <NavLink navigation={navigation} target='createAnimal' title='Scan Bird'/>
        <NavLink navigation={navigation} target='three' title='Common Parents'/>
        <NavLink navigation={navigation} target='three' title='My Pairs'/>
        <NavLink navigation={navigation} target='three' title='Clutches'/>
        <NavLink navigation={navigation} target='three' title='Eggs'/>
        <NavLink navigation={navigation} target='three' title='Egg Alert'/>
        <NavLink navigation={navigation} target='three' title='Booking List'/>
        <View className='mt-5'>
          <NavLink navigation={navigation} target='three' title='Info'/>
          <NavLink navigation={navigation} target='three' title='Profile'/>
          <NavLink navigation={navigation} target='three' title='Notifications'/>
        </View>

    </SafeAreaView>
    
  )
}

export default function DrawerLayout() {
  return (
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerTintColor: 'white',
          headerStyle:{
            backgroundColor: '#30533dff',
          },
          headerTitleStyle: { 
            fontWeight: 'bold',
          color: '#ffffffff' },
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="createBird" options={{ title: 'Add Bird' }} />
        <Drawer.Screen name="createAnimal" options={{ title: 'Create Animal' }} />
        <Drawer.Screen name="two" options={{ title: 'Second Page' }} />
        <Drawer.Screen name="three" options={{ title: 'Third Page' }} />
      </Drawer>
  );
}
