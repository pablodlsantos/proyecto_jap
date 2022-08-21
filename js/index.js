function login()
{
    document.getElementById("login-form").addEventListener("submit", function(f)
    {
        (f).preventDefault();
        
        let user = document.getElementById("emailInput").value;
        let password = document.getElementById("passInput").value;
        sessionStorage.setItem("user", user);
        sessionStorage.setItem("password", password);
        sessionStorage.getItem("user");

        if (user != null)
        {
            window.location.href ="home.html";
        }
    });   
}

document.addEventListener("DOMContentLoaded", function(e)
{
    login();
});



