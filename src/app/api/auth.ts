import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function signUp(email: string, password: string, username: string) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
    }

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            if (authError.message.includes('email_address_invalid')) {
                throw new Error('Please enter a valid email address');
            }
            throw authError;
        }

        if (authData.user) {
            const { data: userData, error: dbError } = await supabase
                .from('users')
                .insert([
                    {
                        email: email,
                        username: username,
                        password: password,
                        role: 'user',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
                .select('id')
                .single();

            if (dbError) {
                throw dbError;
            }

            return {
                auth: authData,
                userId: userData.id
            };
        }

        return { auth: authData };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw error;
    }
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
} 