import React, { useState } from 'react'
import { Alert, View, Text, Pressable, TextInput, Image } from 'react-native'
import { supabase } from '@/lib/supabase';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

function BirdLogo(){
  return (
    <Image source={require("@/assets/images/bird-icon.png")} style={{ width: 35, height: 35}} />
  )
}

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Login page
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailIsTouched, setEmailIsTouched] = useState(false);
  const [fieldIsTouched, setFieldIsTouched] = useState(false);

  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)

    setLoading(false)
  }

  // <MaterialCommunityIcons name="bird" size={27} color="#fcc800" className='mr-[150px]'/>
  return (
    <>
        <View className='flex-1 items-center justify-center bg-background'>
            <View className='w-[80%] items-center pb-20'>
              <View className='mr-[150px]'>
                <BirdLogo/>
              </View>
              <Text className='text-text p-2 text-4xl'>AILAMINA</Text>
            </View>

            <View className='bg-sky-700 w-[95%] px-2 items-center rounded-md'>
              <Text className='font-bold text-text-light text-2xl mb-3 mt-5'>
                Welcome Back.
              </Text>
              <Text className='text-text-light mb-10'>
                Login to your account
              </Text>
              <View className='w-[90%] mb-5 '>
                  <TextInput
                      className='text-text-light text-lg pl-5 mt-none mb-1 border-b border-background w-[100%]'
                      onChangeText={(text) => {setEmail(text)}}
                      onBlur={() => {
                        setEmailIsTouched(true);
                        setEmailIsValid(isValidEmail(email));
                      }}
                      value={email}
                      placeholder="Email"
                      placeholderTextColor="#b7b7b7d7"
                      autoCapitalize={'none'}
                      cursorColor={"#f0f9ff"}
                  />
                  {emailIsTouched && !emailIsValid && email !== "" && 
                  (<Text className='ml-2 text-red-400'>
                      E-mail is not valid.
                  </Text>)}
              </View>
              <View className='w-[90%] mb-5'>
                  <TextInput
                      className='text-text-light text-lg pl-5 mt-none mb-1 border-b border-background w-[100%]'
                      onChangeText={(text) => setPassword(text)}
                      value={password}
                      secureTextEntry={true}
                      placeholder="Password"
                      placeholderTextColor="#b7b7b7d7"
                      autoCapitalize={'none'}
                      cursorColor={"#f0f9ff"}
                  />
              </View>
              <Pressable 
                disabled={loading || !(password && email)} 
                className={`${!(password && email && emailIsValid)? 'bg-gray-100/20 border border-background' : 'bg-background'} w-[90%] py-3 rounded-full`} 
                onPress={() => signInWithEmail()}>
                  {loading? 
                    ( <ActivityIndicator className="text-zinc-800"/> ) 
                    : ( <Text className={`${!(password && email && emailIsValid)? "text-gray-200" : "text-text"} text-center text-lg`}>Login</Text> )}
              </Pressable>
              <View className='flex flex-row items-center gap-2 p-1 my-10'>
                <Text className='text-text-light'>
                  Don't have an account? 
                </Text>
                <Pressable 
                  className='my-2'
                  onPress={() => router.push("/sign-up")}>
                  {({ pressed }) => (<Text className={`${loading? "text-gray-300" : pressed? "text-accent" : "text-text-light"} font-bold text-lg`}>
                    Sign Up
                  </Text>
                  )}
                </Pressable>
              </View>
            </View>
            {fieldIsTouched && 
            <>
              <View className="mb-20"></View>
              <View className="mb-20"></View>
            </>}
        </View>
    </>
  )
}