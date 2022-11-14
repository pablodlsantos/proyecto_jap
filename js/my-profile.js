/* This script manage the users profile info and image validations and keeps them in the local storage once everything is validated */ 

// Our constant variables
const profileForm = document.getElementById("profile-form");
const firstNameInput = document.getElementById("first-name-input");
const secondNameInput = document.getElementById("second-name-input");
const firstLastnameInput = document.getElementById("first-lastname-input");
const secondLastnameInput = document.getElementById("second-lastname-input");
const emailInput = document.getElementById("email-input");
const phoneInput = document.getElementById("phone-input");

// This functions checks if the user is logged in, if not sends him to the login page
function loginValidation() {
    if (localStorage.getItem("username") === null && localStorage.getItem("googleUser") === null){
        window.location.href = "index.html";
    } else if (localStorage.getItem("profile") === null && localStorage.getItem("googleUser") === null) {
        emailInput.value = localStorage.getItem("username");
    } else if (localStorage.getItem("profile") === null && localStorage.getItem("username") === null){
        emailInput.value = localStorage.getItem("googleUser");
    }
}

// Form validation with bootstrap, keeps the user info in local storage as an object
function formValidations() {
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
        })
    })();

    profileForm.addEventListener("submit", event =>{
        event.preventDefault();

        if (profileForm.checkValidity() === true){
            let profile = {
                firstName: firstNameInput.value,
                secondName: secondNameInput.value,
                firstLastname: firstLastnameInput.value,
                secondLastname: secondLastnameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
            }
            
            localStorage.setItem("profile", JSON.stringify(profile));
        }
    });
}

// Retrieves the user info from the local storage if it exists
function retrieveProfileData(){
    if (JSON.parse(localStorage.getItem("profile")) !== null){
        let profileData = JSON.parse(localStorage.getItem("profile"));
        
        firstNameInput.value = profileData.firstName;
        secondNameInput.value = profileData.secondName;
        firstLastnameInput.value = profileData.firstLastname;
        secondLastnameInput.value = profileData.secondLastname;
        emailInput.value = profileData.email;
        phoneInput.value = profileData.phone;
    }
}

// Stores the users profile picture in local storage
function profilePicture() {
    const imageInput = document.getElementById("image-input");
    const image = document.getElementById("profile-picture");

    imageInput.addEventListener("change", () => {
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        
        reader.addEventListener("load", () => {
            image.src = reader.result;
            localStorage.setItem("recent-image", reader.result);
        });        
    });

    if (localStorage.getItem("recent-image") !== null){
        image.src = localStorage.getItem("recent-image");
    }
}

// Calling our functions once the DOM is loaded
document.addEventListener("DOMContentLoaded", () =>{
    loginValidation();
    formValidations();
    retrieveProfileData();
    profilePicture();
})



