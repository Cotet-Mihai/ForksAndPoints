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

    validateMatchInputs(password, repetPassword, repetPasswordIcon);

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
                let countdown = 3;
                const notificationMessage = `Success!\nYou will be redirected to the login page ${countdown}...`;

                Notification.showNotification('success', notificationMessage);

                const interval = setInterval(() => {

                    const currentMessage = `Success!<br>You will be redirected to the login page ${countdown}...`;

                    const lastNotification = document.querySelector('.notification .notification-message');
                    if (lastNotification) {
                        lastNotification.innerHTML = currentMessage;
                    }
                    countdown--;

                    if (countdown < 0) {
                        clearInterval(interval);
                        window.location.href = '/';
                    }
                }, 1000);
            } else if (data['status'] === 'error') {

                if (data['username_exists']) {
                    changeInput(false, username, usernameExclamation);
                } else {
                    changeInput(true, username, usernameExclamation);
                }

                if (data['email_exists']) {
                    changeInput(false, email, emailExclamiation);
                } else {
                    changeInput(true, email, emailExclamiation);
                }

                let items = "";
                if (data['username_exists']) items += "Username ";
                if (data['email_exists']) items += "Email";

                if (items === "Username ") {
                    Notification.showNotification(data['status'], 'Username already exists!');
                } else if (items === "Email") {
                    Notification.showNotification(data['status'], 'Email already exists!');
                } else if (items.trim()) {
                    // Dacă ambele există, vei afișa mesajul complet
                    Notification.showNotification(data['status'], 'The following already exist: ' + items.trim());
                } else {
                    // Dacă nu există niciunul, probabil nu ar trebui să ajungi aici, dar poți adăuga un mesaj de succes
                    Notification.showNotification(data['status'], 'All good!');
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

