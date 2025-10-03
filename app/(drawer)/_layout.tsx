import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, Pressable, Image } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type NavLinkProps = {
  navigation: any,
  target: string,
  title: string,
  onBeforeNavigate?: () => void
}

function BirdLogo(){
  return (
    <Image source={require("@/assets/images/bird-icon.png")} style={{ width: 27, height: 27}} />
  )
}

function NavLink({ navigation, target, title, onBeforeNavigate }: NavLinkProps){
  return (
        <Pressable
          className="p-3 rounded bg-primary mb-2"
          onPress={() => {
            if(onBeforeNavigate){
              onBeforeNavigate();
            }
            navigation.navigate(target);}}
        >
          <Text className="text-text-light">{title}</Text>
        </Pressable>
    )
}

function LogOutButton(){
  return (
    <>
        <Pressable
          className="p-3 rounded bg-primary mb-2"
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
    <SafeAreaView className='flex-1 bg-background px-4'>
        <View className='items-center'>
          <View className='mr-[100px]'>
            <BirdLogo />
          </View>
          <Text className="text-xl font-bold text-text mb-4">AILAMINA</Text>
        </View>
        <LogOutButton />
        <NavLink navigation={navigation} target='index' title='Dashboard'/>
        <NavLink navigation={navigation} target='myBirds' title='My Birds'/>
        <NavLink navigation={navigation} target='createBird' title='Add Bird'/>
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
  const queryClient = new QueryClient();
  return (
    <>
      <SafeAreaProvider>
      <QueryClientProvider
        client={queryClient}
      > 
        <GestureHandlerRootView style={{ flex: 1, }}>
            <Drawer
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={{
                headerShown: true,
                headerTintColor: 'white',
                headerStyle:{
                  backgroundColor: "#0369a1",
                },
                headerTitleStyle: { 
                  fontWeight: 'bold',
                color: '#f0f9ff' },
              }}
            >
              <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
              <Drawer.Screen name="createBird" options={{ title: 'Add Bird' }} />
              <Drawer.Screen name="editBird" options={{ title: 'Edit Bird' }} />
              <Drawer.Screen name="myBirds" options={{ title: 'My Birds' }} />
              <Drawer.Screen name="two" options={{ title: 'Second Page' }} />
              <Drawer.Screen name="three" options={{ title: 'Third Page' }} />
            </Drawer>
        </GestureHandlerRootView>
      </QueryClientProvider>
      </SafeAreaProvider>
    </>
  );
}
