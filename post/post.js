/*  Imports */
import '../auth/user.js';
import { getPost, createComment, getUser, deleteComment } from '../fetch-utils.js';
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
        displayComments();
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
        displayComments();
        addCommentForm.reset();
    }
});

postImage.addEventListener('click', () => {
    postImage.requestFullscreen();
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
function displayComments() {
    commentList.innerHTML = '';
    for (const comment of post.comments) {
        // const commentEl = renderComment(comment, user.id);
        const commentEl = renderComment(comment);

        // console.log('comment.user_id ' + comment.user_id);
        // console.log('post.user_id ' + post.user_id);

        if (user.id === comment.user_id) {
            const btn = document.createElement('button');
            btn.textContent = 'delete';
            btn.classList.add('delete-cmt-btn');
            commentEl.append(btn);
            commentList.append(commentEl);
            btn.addEventListener('click', async () => {
                const response = await deleteComment(comment.id);
                error = response.error;
                if (error) {
                    displayError();
                } else {
                    const index = post.comments.indexOf(comment);
                    post.comments.splice(index, 1);
                    displayComments();
                }
            });
        } else {
            commentList.append(commentEl);
            // displayComments();
        }
    }
}

function displayError() {
    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
