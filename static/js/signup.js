import {showPassword, validateMatchInputs} from "./elementsControl.js";
import {Notification} from "./notification.js";

// Add event listener for each password visibility toggle icon
document.querySelectorAll('.password-toggle-icon').forEach(icon => {
    icon.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const input = icon.nextElementSibling;

        // Toggle password visibility
        showPassword(input, icon);
    });
});

// Event listener for signup form submission
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Getting form field elements
    const username = document.getElementById('signupUsername');
    const usernameExclamation = document.getElementById('username-exclamation');
    const email = document.getElementById('signupEmail');
    const emailExclamiation = document.getElementById('email-exclamation');
    const password = document.getElementById('signupPassword');
    const repetPassword = document.getElementById('signupRepetPassword');
    const repetPasswordIcon = repetPassword.previousElementSibling;



    // Send form data to backend to create a new user
    fetch('/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            repetPassword: repetPassword.value
        })
    })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            // Handle success response
            if (data['status'] === 'success') {
                let countdown = 3;
                const notificationMessage = `Success!\nYou will be redirected to the sign-in ${countdown}...`;

                // Show notification and countdown for redirection
                Notification.showNotification('success', notificationMessage);

                const interval = setInterval(() => {
                    const currentMessage = `Success!<br>You will be redirected to the sign-in ${countdown}...`;

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
            }
            // Handle error response
            else if (data['status'] === 'error') {

                // Check if username or email exists and handle UI accordingly
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

                // Check if passwords match
                if (!data['passwords_match']) {
                    validateMatchInputs(password, repetPassword, repetPasswordIcon, true)
                } else {
                    validateMatchInputs(password, repetPassword, repetPasswordIcon, false)
                }


                // Create a list of existing items (username or email)
                let items = "";
                if (data['username_exists']) items += "Username";
                if (data['email_exists']) items += ", Email";

                // Show a detailed notification about existing items
                if (items === "Username") {
                    Notification.showNotification(data['status'], 'Username already exists!');
                } else if (items === ", Email") {
                    Notification.showNotification(data['status'], 'Email already exists!');
                } else if (items.trim()) {
                    Notification.showNotification(data['status'], 'The following already exist: ' + items.trim());
                }
            }
        })
        .catch(error => {
            // Handle network or server error
            console.error("Request failed:", error);
            Notification.showNotification('error', 'Server error or no response. Please try again later.');
        });


    /**
     * Updates input and icon state based on validation result.
     *
     * @param {boolean} state - True if valid, false if invalid.
     * @param {HTMLElement} input - The input element to update.
     * @param {HTMLElement} icon - The icon element to show/hide.
     */
    function changeInput(state, input, icon){
        switch (state){
            case true:
                // Valid input: remove error styles
                input.classList.remove('is-invalid');
                icon.setAttribute('hidden', true);
                icon.classList.remove('text-danger');
                break;

            case false:
                // Invalid input: add error styles
                input.classList.add('is-invalid');
                icon.removeAttribute('hidden');
                icon.classList.add('text-danger');
        }
    }
});
