import React, { useState } from 'react'
import { Alert, View, Text, Pressable, TextInput } from 'react-native'
import { supabase } from '@/lib/supabase';
import { ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Login page
 */
export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailIsTouched, setEmailIsTouched] = useState(false);

  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true)
    const {
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <>
        <View className='flex-1 items-center justify-center bg-green-50'>
            <View className='w-[80%] items-center pb-20'>
                <MaterialCommunityIcons name="bird" size={27} color="#fcc800" className='mr-[150px]'/>
                <Text className='text-neutral-700 p-2 text-3xl'>AILAMINA</Text>
            </View>

            <View className='bg-teal-800/70 w-[95%] px-2 justify-top items-center rounded-xl'>
                <Text className='font-bold text-white text-2xl mb-3 mt-5'>
                  Signing Up.
                </Text>
                <Text className='text-white mb-10'>
                  Type your credentials to create an account.
                </Text>
              <View className='w-[90%] mb-5 '>
                  <TextInput
                      className='text-white text-lg pl-5 mt-none mb-1 border-b border-white w-[100%]'
                      onChangeText={(text) => {setEmail(text)}}
                      onBlur={() => {
                        setEmailIsTouched(true);
                        setEmailIsValid(isValidEmail(email));
                      }}
                      value={email}
                      placeholder="Email"
                      placeholderTextColor="#ffffffab"
                      autoCapitalize={'none'}
                  />
                  {emailIsTouched && !emailIsValid && email !== "" && 
                  (<Text className='ml-2 text-red-300'>
                      E-mail is not valid.
                  </Text>)}
              </View>
              <View className='w-[90%] mb-5'>
                  <TextInput
                      className='text-white text-lg pl-5 mt-none mb-1 border-b border-white w-[100%]'
                      onChangeText={(text) => setPassword(text)}
                      value={password}
                      secureTextEntry={true}
                      placeholder="Password"
                      placeholderTextColor="#ffffffab"
                      autoCapitalize={'none'}
                  />
              </View>
              <View className='w-[90%] mb-5'>
                  <TextInput
                      className='text-white text-lg pl-5 mt-none mb-1 border-b border-white w-[100%]'
                      onChangeText={(text) => setRepeatPassword(text)}
                      value={password}
                      secureTextEntry={true}
                      placeholder="Repeat Password"
                      placeholderTextColor="#ffffffab"
                      autoCapitalize={'none'}
                  />
              </View>
              <Pressable 
                disabled={loading || !(password && email)} 
                className={`${!((password === repeatPassword) && password && email && emailIsValid)? 'bg-gray-100/30 border border-white' : 'bg-accent'} w-[90%] py-3 rounded-full`} 
                onPress={() => {signUpWithEmail}}>
                  {loading? 
                    ( <ActivityIndicator className='text-white'/> ) 
                    : ( <Text className="text-white text-center text-lg">Sign Up</Text> )}
              </Pressable>
              <Pressable 
                className='my-2'
                onPress={() => router.push("/login")}>
                <Text>PRESS</Text>
              </Pressable>
              <View className='w-[60%] flex flex-row justify-between items-center p-1 my-10'>
                <Text className='text-white'>
                  Already have an account?
                </Text>
                  <Pressable 
                    disabled={loading}
                    onPress={() => router.push("/login")}>
                    <Text className="active:text-accent text-white text-center font-bold text-lg">
                      To Login
                    </Text>
                  </Pressable>
              </View>
            </View>
        </View>
    </>
  )
}