function updateValidation(isValidated, newCondition) {
    if (!isValidated) {
        return false;
    }

    return newCondition;
}

function checkRequiredElement(element, errorMsg) {
    const domErrorMsg = element.parent().find(".form__error-msg");
    if (!element.val()) {
        element.parent().addClass("form__control--incorrect");
        element.parent().removeClass("form__control--correct");
        domErrorMsg.text(errorMsg);
        domErrorMsg.show();
        return false;
    }

    element.parent().addClass("form__control--correct");
    element.parent().removeClass("form__control--incorrect");
    domErrorMsg.hide();
    return true;
}

function validateElement(element, validator, errorMsg) {
    const domErrorMsg = element.parent().children(".form__error-msg");

    if (!validator(element.val())) {
        element.parent().addClass("form__control--incorrect");
        element.parent().removeClass("form__control--correct");
        domErrorMsg.text(errorMsg);
        domErrorMsg.show();
        return false;
    }

    element.parent().addClass("form__control--correct");
    element.parent().removeClass("form__control--incorrect");
    domErrorMsg.hide();
    return true;
}

function validateEmail(email) {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regexEmail.test(email);
}

function validatePassword(password) {
    const regexPassword = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^0-9A-Za-z]).{12,}/;

    return regexPassword.test(password);
}

function hideErrorMessages() {
    $(".form__error-msg").hide();
}