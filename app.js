/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { getPosts } from './fetch-utils.js';
import { renderPost } from './render-utils.js';

/* Get DOM Elements */
const postList = document.getElementById('post-list');
const errorDisplay = document.getElementById('error-display');
/* State */
let error = null;
let posts = [];
/* Events */
window.addEventListener('load', async () => {
    // > Part C:
    //    - get the pets
    //    - store the error and pets state from the response
    //    - either display the error or the pets
    const response = await getPosts();
    error = response.error;
    posts = response.data;

    if (error) {
        displayError();
    }

    if (posts) {
        displayPosts();
    }
});
/* Display Functions */
function displayPosts() {
    postList.innerHTML = '';

    for (const post of posts) {
        console.log(post.category);
        const petEl = renderPost(post);
        postList.append(petEl);
    }
}
function displayError() {
    if (error) {
        // eslint-disable-next-line no-console
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
