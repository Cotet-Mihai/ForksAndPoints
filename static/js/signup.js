import {showPassword, validateMatchInputs} from "./elementsControl.js";
import {Notification} from "./notification.js";

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

    const email = document.getElementById('signupEmail');
    const emailExclamiation = document.getElementById('email-exclamation');

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
                // todo: notificare cu succes si redirect catre login in 3 secunde
                window.location.href = '/';
            } else if (data['status'] === 'error') {
                // todo: modifica api-ul sa verifice si username si email si sa returneze informatie pentru amandoua ca sa le poti verifica aici simultan
                switch (data['msg']) {

                    case 'Username already exist!':
                        changeInput(false, username, usernameExclamation);
                        Notification.showNotification(data['status'], data['msg']);
                        break;

                    case 'Email already exist!':
                        changeInput(false, email, emailExclamiation);
                        changeInput(true, username, usernameExclamation);

                        Notification.showNotification(data['status'], data['msg']);
                        break;

                    default:
                        Notification.showNotification(data['status'], data['msg']);
                        break;
                }
            }
        });

    function changeInput(state, input, icon){
        switch (state){
            case true:
                input.classList.remove('is-invalid');
                icon.setAttribute('hidden', true);
                icon.classList.remove('text-danger');
                break;

            case false:
                input.classList.add('is-invalid');
                icon.removeAttribute('hidden', true);
                icon.classList.add('text-danger');
        }
    }
});

