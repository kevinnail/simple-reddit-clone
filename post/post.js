/*  Imports */
import '../auth/user.js';
import {
    getPost,
    createComment,
    getUser,
    deleteComment,
    getProfile,
    onMessage,
    getPosts,
    deletePost,
    getUrls,
} from '../fetch-utils.js';
import { getDateStamp } from '../calc-utils.js';
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
const profileName = document.getElementById('profile-name');
const userAvatar = document.getElementById('user-avatar');
const deleteButton = document.getElementById('delete-button');
const gallery = document.getElementById('gallery');

/*  State  */
let profile = null;
let error = null;
let post = null;
const user = getUser();
let urls = null;

/* Events */
window.addEventListener('load', async () => {
    const response2 = await getProfile(user.id);

    error = response2.error;
    profile = response2.data;
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
        if (user.id === post.user_id) {
            deleteButton.classList.remove('hide');
        }
        profileName.textContent = profile.username;
        userAvatar.src = profile.url;
        urls = await getUrls(post.id);

        displayPost();
        displayComments();
    }

    onMessage(post.id, async () => {
        {
            const superData = await getPost(post.id);
            post.comments = superData.data.comments;
            displayComments();
        }
    });
});

addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addCommentForm);

    const insertComment = {
        text: formData.get('text'),
        post_id: post.id,
        username: profile.username,
        // time: time,
        time: getDateStamp(),
    };

    const response = await createComment(insertComment);
    error = response.error;
    if (error) {
        displayError();
    } else {
        displayComments();
        addCommentForm.reset();
    }
});

postImage.addEventListener('click', () => {
    postImage.requestFullscreen();
});

postCategory.addEventListener('click', () => {
    location.replace(`/?category=${post.category}`);
    getPosts(null, post.category);
});

deleteButton.addEventListener('click', async () => {
    for (const comment of post.comments) {
        await deleteComment(comment.id);
    }
    await deletePost(post.id);

    location.replace('/');
});

/* Display */
function displayPost() {
    // console.log('checking urls.length etc', urls.data[0]);

    postTitle.textContent = post.title;
    postCategory.textContent = post.category;

    postDescription.textContent = post.description;
    postContact.innerHTML =
        '<p style="font-weight:bold;" >Contact info:</p> ' + post.contact;
    // console.log('urls.data.length', urls.data.length);

    for (let i = 0; i < urls.data.length; i++) {
        // postImage.src = post.image_url;
        // console.log('urls[i]', urls.data[i].image_url);

        // postImage.src = urls.data[i].image_url;
        // postImage.alt = `${post.name} image`;
        const imgs = document.createElement('img');
        imgs.classList.add('post-gallery-pics');
        imgs.src = urls.data[i].image_url;
        gallery.append(imgs);
    }
}
async function displayComments() {
    commentList.innerHTML = '';

    for (const comment of post.comments) {
        const commentEl = renderComment(comment);

        // const commentEl = renderComment(comment);

        // ^^^ works

        // const joyBtn = document.createElement('button');
        // joyBtn.textContent = 'spark joy';
        // joyBtn.classList.add('joy-btn');
        // commentEl.append(joyBtn);
        // commentList.append(commentEl);
        // joyBtn.addEventListener('click', async () => {
        //     const response = await updateJoy(comment.id);

        //     joyBtn.classList.toggle('joy-cmt-joyBtn');
        //     if (joyBtn.textContent === 'spark joy') {
        //         joyBtn.textContent = '!!!!!!!';
        //     } else {
        //         joyBtn.textContent = 'spark joy';
        //     }

        // joyBtn.textContent = '!!!!!!!';
        // const response = await updateJoy(comment.id);
        // });

        // vvv works

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

// data functions
