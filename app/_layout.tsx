import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import "@/global.css"
import { useColorScheme } from '@/components/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RootLayoutNav />
    </GestureHandlerRootView>
    )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    
    // Get initial sessions (once)
    supabase.auth.getSession().then(({ data: { session } }) => { 
      setSession(session);
      setLoading(false);
    })

    // Subscribe to changes
    const { data: subscription} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false);
    })

    // Cleanup to avoid duplicates on hot reload
    return () => {
      subscription.subscription.unsubscribe();
    };

  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return session?
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppDrawer /> 
    </ThemeProvider> : 
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthStack /> 
    </ThemeProvider>
  
  //return (
  //  <>
  //    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  //      {!session && 
  //      <Stack screenOptions={{ headerShown: false }}>
  //          <Stack.Screen name="auth"/>
  //      </Stack>}
  //      {session && 
  ///      <Stack screenOptions={{ headerShown: false }}>
   //         <Stack.Screen name="(drawer)"/>
  //          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
  //      </Stack>}
  //    </ThemeProvider>
  //  </>
  //);
}

function AppDrawer(){
  return (
    <Drawer>
      <Drawer.Screen name="(drawer)" options={{ headerShown: false}}/>
    </Drawer>
  )
}

function AuthStack(){
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }}/>
      <Stack.Screen name="sign-up" options={{ headerShown: false }}/>
    </Stack>
  )
}
