import { Notification } from "./notification.js";

/**
 * Navigates to the next or previous question in the questionnaire.
 * @param {number} stepChange - 1 to move forward, -1 to move backward.
 */
function navigateQuestion(stepChange) {
    let currentUrl = window.location.pathname;
    let parts = currentUrl.split('/');  // Splitting the URL to get the current step
    let currentStep = parts[2];
    let newStep;

    try {
        switch (currentStep) {
            case 'info':
                newStep = stepChange > 0 ? 1 : 'info'; // Move forward to step 1, or stay on 'info'
                break;
            case '6':
                newStep = stepChange > 0 ? 'summary' : 5; // Go to summary or step 5
                break;
            case 'summary':
                newStep = stepChange > 0 ? 'summary' : '6'; // Stay on summary or go back to step 6
                break;
            case '1':
                newStep = stepChange > 0 ? 2 : 'info'; // Go to step 2 or back to 'info'
                break;
            default:
                newStep = parseInt(currentStep) + stepChange; // Increment/decrement step for other cases
        }

        window.location.href = `/questionnaire/${newStep}/`;  // Navigate to the new step
    } catch (error) {
        console.error(error);
        window.location.href = `/questionnaire/info/`;  // Redirect to 'info' on error
    }
}

/**
 * Saves the value to localStorage.
 * @param {string} step - The key to store the value under.
 * @param {string} value - The value to store.
 */
function saveToLocalStorage(step, value) {
    localStorage.setItem(step, value);  // Store the value with the specified key
}

/**
 * Retrieves the value from localStorage.
 * @param {string} step - The key to retrieve the value from.
 * @returns {string} - The stored value.
 */
function getFromLocalStorage(step) {
    return localStorage.getItem(step);
}

/**
 * Validates the input element.
 * @param {string} selector - The selector of the input element.
 * @param {string} errorMessage - Error message to show if validation fails.
 * @param {function} [validator] - Optional custom validation function.
 * @returns {boolean} - True if valid, otherwise false.
 */
function validateInput(selector, errorMessage, validator = null) {
    const input = document.querySelector(selector);
    if (!input || !input.value.trim()) {  // Check if input is empty or missing
        Notification.showNotification('error', errorMessage);
        return false;
    }

    // Use custom validator if provided
    if (validator && !validator(input.value)) {
        Notification.showNotification('error', errorMessage);
        return false;
    }

    saveToLocalStorage(selector, input.value);  // Save the valid input to localStorage
    return true;
}

/**
 * Event listener for the "Next Question" button.
 */
document.getElementById('nextQuestion').addEventListener('click', function(e) {
    e.preventDefault();

    const currentPath = window.location.pathname;

    switch (currentPath) {
        case '/questionnaire/1/':
            if (!validateInput('input[name="gender"]:checked', 'Please select your gender before proceeding!')) {
                return;
            }
            break;

        case '/questionnaire/2/':
            const ageInput = document.getElementById('age');
            if (!validateInput('#age', 'Please enter a valid age!', value => value > 0)) {
                return;
            }

            if (ageInput.value > 122) {  // Check for unreasonable age input
                Notification.showNotification('error', 'You are not Jeanne Calment!\nPlease enter a realistic age 😊');
                return;
            }

            break;

        case '/questionnaire/3/':
            if (!validateInput('#height', 'Please enter a valid height!', value => value > 0)) {
                return;
            }
            break;

        case '/questionnaire/4/':
            if (!validateInput('#weight', 'Please enter a valid weight!', value => value > 0)) {
                return;
            }
            break;

        case '/questionnaire/5/':
            if (!validateInput('input[name="diet"]:checked', 'Please select a dietary preference!')) {
                return;
            }
            break;

        case '/questionnaire/6/':
            const allergicInput = document.getElementById('allergic');
            if (allergicInput.value.trim()) {
                const allergies = allergicInput.value.split(',').map(allergy => allergy.trim());

                if (allergies.some(allergy => allergy.length < 2)) {  // Validate allergy input length
                    Notification.showNotification('error', 'Please enter a valid allergy!');
                    return;
                }

                sessionStorage.setItem('allergies', JSON.stringify(allergies));  // Store allergies in sessionStorage
            } else {
                sessionStorage.removeItem('allergies');  // Clear allergies if input is empty
            }
            /* DEBUG
            //
            const data = {
                gender: getFromLocalStorage('input[name="gender"]:checked'),
                age: getFromLocalStorage('#age'),
                height: getFromLocalStorage('#height'),
                weight: getFromLocalStorage('#weight'),
                diet: getFromLocalStorage('input[name="diet"]:checked'),
                allergies: JSON.parse(sessionStorage.getItem('allergies'))
            };

            console.log('Session Data:', data);  // Log collected data for debugging
             */

            break;
    }

    navigateQuestion(1);  // Move to the next step
});

/**
 * Event listener for the "Previous Question" button.
 */
document.getElementById('backQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    navigateQuestion(-1);  // Navigate backward
});
