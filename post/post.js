/*  Imports */
import '../auth/user.js';
import { getPost } from '../fetch-utils.js';

/* DOM */
const postTitle = document.getElementById('title');
const postDescription = document.getElementById('description');
const postImage = document.getElementById('image');
const postCategory = document.getElementById('category');
const postContact = document.getElementById('contact');

/*  State  */
let error = null;
let post = null;

/* Events */
window.addEventListener('load', async () => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (!id) {
        location.replace('/');
        return;
    }
    const response = await getPost(id);
    error = response.error;
    post = response.data;
    if (error) {
        location.replace('/');
    } else {
        displayPost();
    }
});

/*  */
function displayPost() {
    // > Part B: display the pet info
    postTitle.textContent = post.title;
    postCategory.textContent = post.category;
    postDescription.textContent = post.description;
    postContact.textContent = post.contact;
    postImage.src = post.image_url;
    postImage.alt = `${post.name} image`;
}
