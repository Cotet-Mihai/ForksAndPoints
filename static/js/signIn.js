import {showPassword} from "./elementsControl.js";
import {Notification} from "./notification.js";

// Selects the password input and its icon toggle button
const signinPassword = document.getElementById('signinPassword');
const signinPasswordIcon = document.getElementById('show-password-toggle-icon');

// Toggles the visibility of the password on icon click
signinPasswordIcon.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    showPassword(signinPassword, signinPasswordIcon);
});

// Handles the form submission for sign-in
document.getElementById('signinForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signinUsername');
    const password = document.getElementById('signinPassword');

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            console.log(data);
            if (data['status'] === 'success') {
                // Redirect based on the first-time login status
                if (data['firstTime'] === "True") {
                    window.location.href = '/questionnaire/info/';
                } else {
                    window.location.href = '/rooms/';
                }
            } else {
                // Display error notification and mark fields as invalid
                username.classList.add('is-invalid');
                password.classList.add('is-invalid');
                Notification.showNotification('error', data['msg']);
                console.log(data['msg'])
            }
        })
        .catch(error => {
            console.error("Request failed:", error);
            Notification.showNotification('error', 'Server error or no response. Please try again later.');
        });
});
