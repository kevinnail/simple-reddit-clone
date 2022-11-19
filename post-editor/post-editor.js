/* Imports */

import '../auth/user.js';
import { uploadImage, createPost, getProfile, getUser } from '../fetch-utils.js';
import { getDateStamp } from '../calc-utils.js';

/* DOM */

const postForm = document.getElementById('post-form');
const errorDisplay = document.getElementById('error-display');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const addButton = document.getElementById('add-button');
const profileName = document.getElementById('profile-name');
const userAvatar = document.getElementById('user-avatar');

/* State */

let error = null;
let user = null;
let profile = {};

/* Events */

window.addEventListener('load', async () => {
    user = getUser();
    profile = await getProfile(user.id);

    profileName.textContent = '  ' + profile.data.username;
    userAvatar.src = profile.data.url;
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '../assets/pet-photo-placeholder.png';
    }
});

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addButton.disabled = true;

    const formData = new FormData(postForm);
    let imageFile = [];
    imageFile = formData.getAll('image');

    for (let i = 0; i < imageFile.length; i++) {
        // console.log('imageFile', imageFile[i]);
    }

    let url = null;
    const randomFolder = Math.floor(Date.now() * Math.random());
    const imagePath = `reddit-clone/${randomFolder}/${imageFile[0].name}`;
    url = await uploadImage('project-images', imagePath, imageFile[0]);
    const time = getDateStamp();

    const post = {
        category: formData.get('category'),
        title: formData.get('title'),
        description: formData.get('description'),
        contact: formData.get('contact'),
        image_url: url,
        time: time,
        author: profile.data.id,
    };
    const response = await createPost(post);
    error = response.error;
    addButton.disabled = false;
    if (error) {
        displayError();
    } else {
        location.assign('/');
    }
});

/* Display Functions */

function displayError() {
    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
