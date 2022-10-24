/*  Imports */
import '../auth/user.js';
import {
    getPost,
    createComment,
    getUser,
    deleteComment,
    getProfile,
    onMessage,
    getComment,
    getComments,
} from '../fetch-utils.js';
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

/*  State  */
let profile = null;
let error = null;
let post = null;
const user = getUser();
let comments = null;

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
        displayPost();
        displayComments();
        profileName.textContent = profile.username;
    }

    onMessage(post.id, async (payload) => {
        {
            if (payload.eventType === 'INSERT') {
                const commentId = payload.new.id;
                const commentResponse = await getComment(commentId);
                error = commentResponse.error;
                if (error) {
                    displayError();
                } else {
                    const comment = commentResponse.data;
                    post.comments.unshift(comment);
                    displayComments();
                }
            } else {
                const superData = await getPost(post.id);
                post.comments = superData.data.comments;
                displayComments();
            }
        }
    });
});

addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addCommentForm);
    // let currentDate = new Date();
    // let cDay = currentDate.getDate();
    // let cMonth = currentDate.getMonth() + 1;
    // let cYear = currentDate.getFullYear();
    // let commentDate = cMonth + '/' + cDay + '/' + cYear;

    /////////////////////////////////////////// time below  ////////////////////////////////////////
    // let currentTime = new Date();
    // let time = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

    ////////////////////////////////// date/ time getting/ formatting day w/ am/ pm mth/ yr

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    let day = days[d.getDay()];
    let hr = d.getHours();
    let min = d.getMinutes();

    if (min < 10) {
        min = '0' + min;
    }
    let ampm = 'am';
    if (hr > 12) {
        hr -= 12;
        ampm = 'pm';
    }
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    // let x = document.getElementById('time');
    let time = day + ' ' + hr + ':' + min + ampm + ' ' + month + ' ' + date + ' ' + year;
    //////////////////////////////////
    const insertComment = {
        // maybe add a username column to the table then append that data to the comment "posted by..>"
        text: formData.get('text'),
        post_id: post.id,
        username: profile.username,
        // date: commentDate,
        time: time,
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    const response = await createComment(insertComment);
    error = response.error;
    if (error) {
        displayError();
    } else {
        // const comment = response.data;
        // post.comments.unshift(comment);
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
