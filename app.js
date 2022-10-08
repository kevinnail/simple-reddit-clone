/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getUser } from './fetch-utils.js';
import { getPost, getPosts } from './fetch-utils.js';
import { renderPost } from './render-utils.js';

/* Get DOM Elements */
const postList = document.getElementById('post-list');
const errorDisplay = document.getElementById('error-display');
const searchForm = document.getElementById('search-form');
/* State */
let error = null;
let posts = [];
/* Events */
window.addEventListener('load', async () => {
    // > Part C:
    //    - get the pets
    //    - store the error and pets state from the response
    //    - either display the error or the pets
    // const user = getUser();

    findPosts();
    displayPosts();
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
});
async function findPosts(title, category) {
    // > Part A: Call the service function that gets the countries
    const response = await getPosts(title, category);
    // > Part C: Add the name and continent arguments to getCountries

    // > Part A: Assign to state the :
    //      - error,
    //      - data (to the countries variable)
    error = response.error;
    posts = response.data;

    // > Part D: Assign to state the:
    //      - count (of db records)
    // count = response.count;
    // displayNotifications();
    if (!error) {
        displayPosts();
    }
}
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const title = formData.get('title');
    const category = formData.get('category');
    // console.log('title ' + title + '  category  ' + category);
    // if (category !== 'null') {
    //     findPosts(title, category);
    //     return;
    // }
    // if (title !== '') {
    //     findPosts(title, category);
    //     return;
    // } else {
    //     findPosts();
    //     console.log(posts.length);
    // }
    // console.log('title ' + title + ' category ' + category);
    findPosts(title, category);
});

/* Display Functions */
function displayPosts() {
    postList.innerHTML = '';

    for (const post of posts) {
        const petEl = renderPost(post);
        postList.append(petEl);
    }
}
function displayError() {
    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
