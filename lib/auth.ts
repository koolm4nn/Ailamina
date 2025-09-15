import { supabase } from './supabase';

// Sign up user with email and password
export async function signUp(email: string, password: string){
    const {data, error} = await supabase.auth.signUp({
        email,
        password
    })
    return { data, error };
}

// Log in user
export async function signIn(email: string, password: string){
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error };
}

export async function signOut(email: string, password: string){
    const { error} = await supabase.auth.signOut();
    return { error };
}