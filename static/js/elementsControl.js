import {Notification} from "./notification.js";

/**
 * Toggles the visibility of the password input field and the corresponding icon.
 *
 * @param {HTMLInputElement} input - The password input element.
 * @param {HTMLElement} icon - The icon element that will toggle between 'fa-eye' and 'fa-eye-slash'.
 */
export function showPassword(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/**
 * Validates that the two password inputs match. If they don't, an error notification is shown.
 *
 * @param {HTMLInputElement} firstInput - The first password input field.
 * @param {HTMLInputElement} secondInput - The second password input field.
 * @param {HTMLElement} secondIcon - The icon to indicate mismatch.
 * @param {Boolean} state - Whether the passwords do not match.
 */
export function validateMatchInputs(firstInput, secondInput, secondIcon, state) {
    if (state) {
        secondIcon.classList.add('text-danger');
        secondInput.classList.add('is-invalid');
        Notification.showNotification('error', 'The passwords do not match');
    } else if (!state) {
        secondIcon.classList.remove('text-danger');
        secondInput.classList.remove('is-invalid');

    }
}
