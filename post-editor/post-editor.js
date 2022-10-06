/* Imports */
import '../auth/user.js';
import { uploadImage } from '../fetch-utils.js';
/* DOM */
const postForm = document.getElementById('post-form');
const errorDisplay = document.getElementById('error-display');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const addButton = document.getElementById('add-button');

/* Events */
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addButton.disabled = true;

    const formData = new FormData(postForm);
    const imageFile = formData.get('image');
    let url = null;
    const randomFolder = Math.floor(Date.now() * Math.random());
    const imagePath = `reddit-clone/${randomFolder}/${imageFile.name}`;
    url = await uploadImage('project-images', imagePath, imageFile);
});
/* Display Functions */
