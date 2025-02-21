import { Notification } from "./notification.js";

/**
 * Navigates to the next or previous question in the questionnaire.
 * @param {number} stepChange - 1 to move forward, -1 to move backward.
 */
function navigateQuestion(stepChange) {
    let currentUrl = window.location.pathname;
    let parts = currentUrl.split('/');  // Extracting path segments
    let currentStep = parts[2];
    let newStep;

    try {
        switch (currentStep) {
            case 'info':
                newStep = stepChange > 0 ? 1 : 'info'; // Move forward to step 1, or stay on 'info'
                break;
            case '6':
                newStep = stepChange > 0 ? 'summary' : 5; // Proceed to summary or return to step 5
                break;
            case 'summary':
                newStep = stepChange > 0 ? 'summary' : '6'; // Remain on summary or go back to step 6
                break;
            case '1':
                newStep = stepChange > 0 ? 2 : 'info'; // Move to step 2 or return to 'info'
                break;
            default:
                newStep = parseInt(currentStep) + stepChange; // Adjust step number dynamically
        }

        window.location.href = `/questionnaire/${newStep}/`;  // Redirect to the new step
    } catch (error) {
        console.error(error);
        window.location.href = `/questionnaire/info/`;  // Redirect to 'info' in case of an error
    }
}

// Handling summary display if on the 'summary' page
if (window.location.pathname.split('/')[2] === 'summary') {
    document.getElementById("summary-gender").textContent = sessionStorage.getItem('gender');
    document.getElementById("summary-birthday").textContent = sessionStorage.getItem('birthday');
    document.getElementById("summary-height").textContent = sessionStorage.getItem('height');
    document.getElementById("summary-weight").textContent = sessionStorage.getItem('weight');
    document.getElementById("summary-diet").textContent = sessionStorage.getItem('diet');

    // Retrieve and format allergies data
    let allergies = sessionStorage.getItem('allergies');
    document.getElementById("summary-allergies").textContent = allergies ? JSON.parse(allergies).join(", ") : "None";

    document.getElementById("confirmAnswers").addEventListener("click", function (e) {
        e.preventDefault();
        let diet = sessionStorage.getItem('diet');
        if (diet === 'None') {
            diet = null;
        }

        const data = {
            gender: sessionStorage.getItem('gender'),
            birthday: sessionStorage.getItem('birthday'),
            height: sessionStorage.getItem('height'),
            weight: sessionStorage.getItem('weight'),
            diet: diet,
            allergies: sessionStorage.getItem('allergies')
        };

        fetch('/rooms/get-questionnaire-info', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(url => window.location.href = url)
            .catch(error => {
                console.log(error);
            });
    });

    document.getElementById('backQuestion').addEventListener('click', function(e) {
        e.preventDefault();
        navigateQuestion(-1);  // Move back to the previous question
    });
}

/**
 * Event listener for the "Next Question" button.
 */
document.getElementById('nextQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    try {
        const currentPath = window.location.pathname;

        switch (currentPath) {
            case '/questionnaire/1/':
                const selectedGender = document.querySelector('input[name="gender"]:checked');
                if (selectedGender) {
                    sessionStorage.setItem('gender', selectedGender.value);
                } else {
                    Notification.showNotification('error', 'Please select your gender.');
                    return;
                }
                break;

            case '/questionnaire/2/':
                const birthday = document.getElementById('birthday').value;
                if (birthday) {
                    sessionStorage.setItem('birthday', birthday);
                } else {
                    Notification.showNotification('error', 'Please select your birthday.');
                    return;
                }
                break;

            case '/questionnaire/3/':
                const height = document.getElementById('height').value;
                if (height && !isNaN(height)) {
                    sessionStorage.setItem('height', height);
                } else {
                    Notification.showNotification('error', 'Please select your height.');
                    return;
                }
                break;

            case '/questionnaire/4/':
                const weight = document.getElementById('weight').value;
                if (weight && !isNaN(weight)) {
                    sessionStorage.setItem('weight', weight);
                } else {
                    Notification.showNotification('error', 'Please select your weight.');
                    return;
                }
                break;

            case '/questionnaire/5/':
                const selectedDiet = document.querySelector('input[name="diet"]:checked');
                if (selectedDiet) {
                    sessionStorage.setItem('diet', selectedDiet.value);
                } else {
                    Notification.showNotification('error', 'Please select your diet.');
                    return;
                }
                break;

            case '/questionnaire/6/':
                const allergicInput = document.getElementById('allergic');
                if (allergicInput.value.trim()) {
                    const allergies = allergicInput.value.split(',').map(allergy => allergy.trim());
                    if (allergies.some(allergy => allergy.length < 2)) {
                        Notification.showNotification('error', 'Please enter a valid allergy!');
                        return;
                    }
                    sessionStorage.setItem('allergies', JSON.stringify(allergies));
                } else {
                    sessionStorage.removeItem('allergies');
                }
                break;
        }

        navigateQuestion(1);  // Move to the next step
    } catch (error) {
        console.log(error);
    }
});

/**
 * Event listener for the "Previous Question" button.
 */
document.getElementById('backQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    navigateQuestion(-1);  // Move back to the previous step
});
