/*   imports   */
import '../auth/user.js';
import { updateProfile, getProfile, getUser, uploadImage } from '../fetch-utils.js';
// import { updateProfile } from '../fetch-utils.js';

// const user = getUser();

/*  DOM   */

const updateButton = document.getElementById('update-button');
const profileForm = document.getElementById('profile-form');
const errorDisplay = document.getElementById('error-display');
const userNameInput = profileForm.querySelector('[name=username]');
const emailTextArea = profileForm.querySelector('[name=email]');
const profileName = document.getElementById('profile-name');
const imageInput = document.getElementById('image-input');
const preview = document.getElementById('preview');
const userAvatar = document.getElementById('user-avatar');

/*  state */

let profile = null;
let error = null;
const user = getUser();
// let url = null;
/* events */

window.addEventListener('load', async () => {
    // > Part B:
    //      - get the profile based on user.id
    //      - set profile and error state from response object

    // findPosts();
    // displayPosts();
    // const user = getUser();
    // const profile = await getProfile(user.id);
    // profileName.textContent = '  ' + profile.data.username;

    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;
    // console.log('profile', profile);

    userAvatar.src = profile.url;
    if (error) {
        displayError();
    }
    if (profile) {
        profileName.textContent = profile.username;
        preview.src = profile.url;
        displayProfile();
    }
});
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '../assets/pet-photo-placeholder.png';
    }
});
profileForm.addEventListener('submit', async (e) => {
    // keep the form from changing the browser page
    e.preventDefault();

    // niceties for "saving" and errors:
    // reset the error
    errorDisplay.textContent = '';
    // remember the button text
    const buttonText = updateButton.textContent;
    // disabled button and change to "saving..."
    updateButton.disabled = true;

    // create a form data object for easy access to form values
    const formData = new FormData(profileForm);

    const imageFile = formData.get('image');
    let url = null;
    // console.log('imageFile.size', imageFile.size);
    if (imageFile.size !== 0) {
        const randomFolder = Math.floor(Date.now() * Math.random());
        const imagePath = `profile-pics/${randomFolder}/${imageFile.name}`;
        url = await uploadImage('project-images', imagePath, imageFile);
    } else {
        url = profile.image_url;
    }

    const profileUpdate = {
        username: formData.get('username'),
        email: formData.get('email'),
        image_url: url,
    };
    //      - call updateProfile passing in profile update object, capture the response
    // const response = null; // ??????
    const response = await updateProfile(profileUpdate);
    error = response.error;

    // did it work?
    if (error) {
        // display the error
        displayError();
        // reset the button to be active
        updateButton.disabled = false; /////////////////////////
        // restore the button text to what it was
        updateButton.textContent = buttonText; ////////////////////
    } else {
        // > Part A: uncomment when working to redirect user
        location.assign('../');
    }
});

function displayProfile() {
    // > Part B: update user name and bio from profile object
    // console.log('profile username: ' + profile.username);
    // console.log('profile email:  ' + profile.email);
    userNameInput.value = profile.username;
    // emailTextArea.value = profile.email;
    emailTextArea.value = profile.email;
}

function displayError() {
    errorDisplay.textContent = error.message;
}
