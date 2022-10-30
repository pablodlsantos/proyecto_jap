// This function sets the email and password of the user on our session storage, then redirects to home
function login()
{
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(f)
    {
        (f).preventDefault(); /* Preventing the reload of the index page once the user submits */
        
        if (loginForm.checkValidity() === true){
            /* Setting the user info on the session storage */
            let user = document.getElementById("email-input").value;
            localStorage.setItem("username", user);

            if (user != null)
            {
                window.location.href ="home.html"; /* Redirecting to home once we have user info */
            }
        }
    });

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
}

// This function will parse any JWT token, we need it for the google credential 
function parseJwt (token) 
{
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

/* This function handles the credential that google sends us so we can obtain the user data,
when the user logins with google, we want to redirect him to home */
function handleCredentialResponse(response) 
{
    const responsePayload = parseJwt(response.credential);

    let googleUser = responsePayload.email;
    localStorage.setItem("googleUser", googleUser);

    if (googleUser != null)
    {
        window.location.href ="home.html";
    }
}

// Calling our functions once the dom is loaded
document.addEventListener("DOMContentLoaded", function(e)
{   
    let response = undefined;
    if (response != null)
    {
        handleCredentialResponse(response);
    }
    login();
});