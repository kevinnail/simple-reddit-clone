/*   imports   */
import '../auth/user.js';
import { updateProfile, getProfile, getUser } from '../fetch-utils.js';
// import { updateProfile } from '../fetch-utils.js';

// const user = getUser();

/*  DOM   */

const updateButton = document.getElementById('update-button');
const profileForm = document.getElementById('profile-form');
const errorDisplay = document.getElementById('error-display');
const userNameInput = profileForm.querySelector('[name=username]');
const bioTextArea = profileForm.querySelector('[name=email]');

/*  state */
let profile = null;
let error = null;
const user = getUser();
/* events */

window.addEventListener('load', async () => {
    // > Part B:
    //      - get the profile based on user.id
    //      - set profile and error state from response object
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;
    if (error) {
        displayError();
    }
    if (profile) {
        displayProfile();
    }
});

profileForm.addEventListener('submit', async (e) => {
    // keep the form from changing the browser page
    e.preventDefault();

    // niceties for "saving" and errors:
    // reset the error
    errorDisplay.textContent = '';
    // remember the button text
    // const buttonText = updateButton.textContent;
    // disabled button and change to "saving..."
    // updateButton.disabled = true;

    // create a form data object for easy access to form values
    const formData = new FormData(profileForm);
    const profileUpdate = {
        username: formData.get('username'),
        email: formData.get('email'),
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
        // updateButton.disabled = false;/////////////////////////
        // restore the button text to what it was
        // updateButton.textContent = buttonText;////////////////////
    } else {
        // > Part A: uncomment when working to redirect user
        // location.assign('../');
        alert('else');
    }
});

function displayProfile() {
    // > Part B: update user name and bio from profile object
    console.log('profile username: ' + profile.username);
    console.log('profile email:  ' + profile.email);
    userNameInput.value = profile.username;
    bioTextArea.value = profile.email;
}

function displayError() {
    errorDisplay.textContent = error.message;
}
