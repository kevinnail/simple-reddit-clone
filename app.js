/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getProfile, getUser } from './fetch-utils.js';
import { onPost, getPosts } from './fetch-utils.js';
import { renderPost } from './render-utils.js';

/* Get DOM Elements */
const postList = document.getElementById('post-list');
// const errorDisplay = document.getElementById('error-display');
const searchForm = document.getElementById('search-form');
const profileName = document.getElementById('profile-name');
const userAvatar = document.getElementById('user-avatar');
const categorySelect = document.getElementById('category-select');

/* State */
let error = null;
let posts = [];
let profile = null;
// let authorProfile = null;
let user = null;
/* Events */
window.addEventListener('load', async () => {
    // > Part C:
    //    - get the pets
    //    - store the error and pets state from the response
    //    - either display the error or the pets
    // const user = getUser();
    // const user = getUser();
    user = getUser();
    profile = await getProfile(user.id);

    profileName.textContent = '  ' + profile.data.username;
    userAvatar.src = profile.data.url;

    const searchParams = new URLSearchParams(location.search);

    // const title = searchParams.get('title');
    // console.log('title', title);

    const category = searchParams.get('category');
    // console.log('category', category);

    if (category) {
        findPosts(null, category);
        await displayPosts();
        categorySelect.value = category;
        return;
    }
    findPosts();
    await displayPosts();

    // const response = await getPosts();
    // error = response.error;
    // posts = response.data;

    // if (error) {
    //     displayError();
    // }

    // if (posts) {
    //     // alert('posts');
    //     // getPosts();
    //     console.log('posts.length= ' + posts.length);
    //     // findPosts();
    //     displayPosts();
    // }

    onPost(async () => {
        const superData = await getPosts();
        posts = superData.data;
        await displayPosts();
    });
});

async function findPosts(title, category) {
    const response = await getPosts(title, category);

    error = response.error;
    posts = response.data;

    if (!error) {
        displayPosts();
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const title = formData.get('title');
    const category = formData.get('category');

    findPosts(title, category);
});

/* Display Functions */

async function displayPosts() {
    postList.innerHTML = '';
    // authorProfile = await getProfile(user.id); //trying to get the profile of the author to put in the renderPost function

    for (const post of posts) {
        const petEl = renderPost(post, profile.data.username);
        postList.append(petEl);
    }
}

// function displayError() {
//     if (error) {
//         errorDisplay.textContent = error.message;
//     } else {
//         errorDisplay.textContent = '';
//     }
// }
