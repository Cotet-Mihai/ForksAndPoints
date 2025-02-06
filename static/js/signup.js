import {showPassword, validateMatchInputs} from "./elementsControl.js";

document.querySelectorAll('.password-toggle-icon').forEach(icon => {
    icon.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const input = icon.nextElementSibling;

        showPassword(input, icon);
    });
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername');
    const usernameExclamation = document.getElementById('username-exclamation');
    const usernameInfo = document.getElementById('username-error')

    const email = document.getElementById('signupEmail');
    const emailExclamiation = document.getElementById('email-exclamation');
    const emailInfo = document.getElementById('email-error');

    const password = document.getElementById('signupPassword');
    const repetPassword = document.getElementById('signupRepetPassword');
    const repetPasswordIcon = repetPassword.previousElementSibling;

    validateMatchInputs(password, repetPassword, repetPasswordIcon, e);

    fetch('/add_new_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: repetPassword.value
        })
    })
        .then(response => response.json())

        .then(data => {
            if (data['status'] === 'success') {
                window.location.href = '/';
            } else if (data['status'] === 'error') {

                switch (data['msg']) {

                    case 'Username already exist!':
                        username.classList.add('is-invalid');
                        usernameExclamation.removeAttribute('hidden');
                        usernameExclamation.classList.add('text-danger');
                        usernameInfo.removeAttribute('hidden');
                        break;

                    case 'Email already exist!':
                        email.classList.add('is-invalid');
                        emailExclamiation.removeAttribute('hidden');
                        emailExclamiation.classList.add('text-danger');
                        emailInfo.removeAttribute('hidden');

                        usernameInfo.setAttribute('hidden', true);
                        username.classList.remove('is-invalid');
                        usernameExclamation.setAttribute('hidden', true);
                        break;

                    default:
                        console.log(data['msg'])
                }
            }
        })
});

