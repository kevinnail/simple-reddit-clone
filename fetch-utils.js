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
export async function createPost(post) {
    return await client.from('posts').insert(post).single();
}
/* Storage functions  */

export async function uploadImage(bucketName, imagePath, imageFile) {
    const bucket = client.storage.from(bucketName);
    let url = null;
    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // in this case, we will _replace_ any
        // existing file with same name.
        upsert: true,
    });

    if (response.error) {
        return null;
    }

    // Construct the URL to this image:
    url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;

    return url;
}
export async function uploadImage2(bucketName, imagePath, imageFile) {
    const bucket = client.storage.from(bucketName);
    let url = null;
    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        // in this case, we will _replace_ any
        // existing file with same name.
        upsert: true,
    });

    if (response.error) {
        return null;
    }

    // Construct the URL to this image:
    url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;

    return url;
}

export async function getPosts(title, category) {
    let query = client
        .from('posts')
        .select('*', { count: 'exact' })
        .limit(200)
        .order('created_at', { ascending: false });
    if (title) {
        query = query.ilike('title', `%${title}%`);
        // return query;
    }
    if (category) {
        query = query.ilike('category', `%${category}%`);
        // return query;
    }
    const response = await query;
    return response;
    // return query;
}

export async function getPost(id) {
    return await client
        .from('posts')
        .select(`*,comments(*)`)
        .eq('id', id)
        .order('created_at', { foreignTable: 'comments', ascending: false })
        .single();
}

export async function createComment(comment) {
    return await client.from('comments').insert(comment).single();
}

export async function deleteComment(id) {
    // return await client.from('comments').delete().eq('id', id).single();
    return await client.from('comments').delete().eq('id', id).single();
}

// profile functions

export async function updateProfile(profile) {
    // > Part A: upsert into profiles table
    // const response = await client.from('profiles').upsert(profile).single();

    const user = getUser();
    const response = await client
        .from('profiles')
        .update({ email: profile.email, username: profile.username, url: profile.image_url })
        .match({ user_id: user.id });
    return response;
}

export async function getProfile(id) {
    // > Part B: get profile by id, maybe single row returned
    const response = await client.from('profiles').select('*').eq('user_id', id).single();
    return response;
}
