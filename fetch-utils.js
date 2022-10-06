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
        // eslint-disable-next-line no-console
        return null;
    }

    // Construct the URL to this image:
    url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    // URL Looks like:
    // https://nwxkvnsiwauieanvbiri.supabase.co/storage/v1/object/public/images/pets/984829079656/Franky.jpeg

    return url;
}

export async function getPosts(title) {
    let query = client
        .from('posts')
        .select('*')
        .limit(200)
        .order('created_at', { ascending: false });
    if (title) {
        query.ilike('title', `%${title}%`);
        return query;
    }
    return query;
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
