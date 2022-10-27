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
/* Events */

window.addEventListener('load', async () => {
    const user = getUser();
    const profile = await getProfile(user.id);
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
    const imageFile = formData.get('image');
    let url = null;
    const randomFolder = Math.floor(Date.now() * Math.random());
    const imagePath = `reddit-clone/${randomFolder}/${imageFile.name}`;
    url = await uploadImage('project-images', imagePath, imageFile);
    const time = getDateStamp();
    const post = {
        category: formData.get('category'),
        title: formData.get('title'),
        description: formData.get('description'),
        contact: formData.get('contact'),
        image_url: url,
        time: time,
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
