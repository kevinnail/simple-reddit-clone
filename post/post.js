/*  Imports */
import '../auth/user.js';
import { getPost, createComment, getUser } from '../fetch-utils.js';
import { renderComment } from '../render-utils.js';

/* DOM */
const postTitle = document.getElementById('title');
const postDescription = document.getElementById('description');
const postImage = document.getElementById('image');
const postCategory = document.getElementById('category');
const postContact = document.getElementById('contact');
const commentList = document.getElementById('comment-list');
const addCommentForm = document.getElementById('add-comment-form');
const errorDisplay = document.getElementById('error-display');

/*  State  */
let error = null;
let post = null;
const user = getUser();

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
        // displayComments();
    }
});
addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addCommentForm);
    const insertComment = {
        text: formData.get('text'),
        post_id: post.id,
    };

    const response = await createComment(insertComment);
    error = response.error;
    if (error) {
        displayError();
    } else {
        const comment = response.data;
        post.comments.unshift(comment);
        addCommentForm.reset();
    }
});
/* Display */
function displayPost() {
    postTitle.textContent = post.title;
    postCategory.textContent = post.category;
    postDescription.textContent = post.description;
    postContact.innerHTML = '<p style="font-weight:bold;" >Contact info:</p> ' + post.contact;
    postImage.src = post.image_url;
    postImage.alt = `${post.name} image`;
}

function displayError() {
    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
