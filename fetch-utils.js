const SUPABASE_URL = 'https://lmxgwefcojhyudouhfdi.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxteGd3ZWZjb2poeXVkb3VoZmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ0MTE4NjAsImV4cCI6MTk3OTk4Nzg2MH0.sJ2d3kgfQnCLcAr9C7ybkPsuB6wHrKD1cv_Dva8hdqI';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
