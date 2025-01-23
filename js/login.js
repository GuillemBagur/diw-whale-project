const domEmail = $("#email");
const domPassword = $("#password");


function loginUser() {
    const user = findUser(user => user.email == domEmail.val() && checkUserPassword(domPassword.val(), user));

    if(user) {
        hideErrorMessages();
        setSessionUser(user);
        window.location.href = "/diw-whale-project/views/admin-panel.html";
    }
    else {
        $("#error-msg-login").text("Les credencials no són correctes.").show();
    }
}

// Not used atm.
function validateFormLogin() {
    let isValidated = true;

    let isValid = checkRequiredElement(domEmail, "L'email és obligatori.")
    isValidated = updateValidation(isValidated, isValid);

    isValid = checkRequiredElement(domPassword, "La contrasenya és obligatòria.");
    isValidated = updateValidation(isValidated, isValid);

    if(isValidated) {
        hideErrorMessages();
    }

    return isValidated;
}



$("#login-form").on("submit", function (e) {
    e.preventDefault();

    loginUser();
});

$(function() {
    if(localStorage.getItem("whale-session")) {
        window.location.href = "/diw-whale-project/views/admin-panel.html";
    }
});